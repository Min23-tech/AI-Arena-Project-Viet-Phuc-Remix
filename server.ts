import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '1mb' }));

  // Giới hạn chống spam: mỗi IP tối đa 10 request/phút (lưu trong bộ nhớ)
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 phút
  const RATE_LIMIT_MAX = 10;

  // Endpoint POST /api/rental-search
  // ===== Đổi địa chỉ thật -> toạ độ (không dùng toạ độ AI đoán) =====
  const PLUS_RE = /\b[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}\b/i;
  const OLC = '23456789CFGHJMPQRVWX';
  // Giải mã Plus Code rút gọn (vd. 2QPW+4WW) theo chuẩn Open Location Code của Google
  function decodeShortPlus(code: string, refLat: number, refLng: number) {
    const c = code.toUpperCase();
    const sep = c.indexOf('+');
    const pad = 8 - sep;
    if (sep < 2 || sep > 8 || pad % 2) return null;
    let full = c;
    if (pad > 0) {
      const res = Math.pow(20, 2 - pad / 2);
      let la = Math.floor((refLat + 90) / res) * res, ln = Math.floor((refLng + 180) / res) * res, pv = 20, pre = '';
      for (let i = 0; i < 4; i++) { const d1 = Math.floor(la / pv), d2 = Math.floor(ln / pv); la -= d1 * pv; ln -= d2 * pv; pre += OLC[d1] + OLC[d2]; pv /= 20; }
      full = pre.slice(0, pad) + c;
    }
    const digits = full.replace('+', '');
    let lat = -90, lng = -180, pv = 20, h = 20;
    for (let i = 0; i + 1 < Math.min(digits.length, 10); i += 2) { lat += OLC.indexOf(digits[i]) * pv; lng += OLC.indexOf(digits[i + 1]) * pv; h = pv; pv /= 20; }
    let hLat = h, hLng = h;
    if (digits.length > 10) { const k = OLC.indexOf(digits[10]); hLat = h / 5; hLng = h / 4; lat += Math.floor(k / 4) * hLat; lng += (k % 4) * hLng; }
    lat += hLat / 2; lng += hLng / 2;
    if (pad > 0) {
      const res = Math.pow(20, 2 - pad / 2), half = res / 2;
      if (lat - refLat > half) lat -= res; else if (refLat - lat > half) lat += res;
      if (lng - refLng > half) lng -= res; else if (refLng - lng > half) lng += res;
    }
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }
  // OpenStreetMap Nominatim: xếp hàng tối đa 1 lượt/giây cho toàn server (theo quy định của OSM)
  let osmQueue: Promise<unknown> = Promise.resolve();
  let osmWaiting = 0;
  function nominatim(q: string): Promise<{ lat: number; lng: number } | null> {
    if (osmWaiting > 12) return Promise.resolve(null); // hàng chờ quá dài -> bỏ qua, không làm chậm người sau
    osmWaiting++;
    const job = osmQueue.then(async () => {
      try {
        const u = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=vn&accept-language=vi&q=' + encodeURIComponent(q);
        const r = await fetch(u, { headers: { 'User-Agent': 'VietPhucRemix/1.0 (AI Arena demo app)' }, signal: AbortSignal.timeout(5000) });
        if (!r.ok) { console.log('rental-search: OSM', r.status); return null; }
        const j: any = await r.json();
        return j?.[0] ? { lat: parseFloat(j[0].lat), lng: parseFloat(j[0].lon) } : null;
      } catch (e: any) { console.log('rental-search: OSM lỗi', e?.message); return null; }
    });
    job.then(() => osmWaiting--);
    osmQueue = job.then(() => new Promise((r) => setTimeout(r, 1050)));
    return job;
  }
  const geoCache = new Map<string, { lat: number; lng: number } | null>();
  // ===== Endpoint POST /api/chat-advisor: Trợ lý AI tư vấn mặc gì, dịp nào =====
  // Không dùng công cụ tìm kiếm; AI chỉ được gợi ý trong danh mục trang phục mà app gửi lên.
  const chatRateMap = new Map<string, { count: number; resetTime: number }>();
  app.post('/api/chat-advisor', async (req, res) => {
    try {
      const fwd = req.headers['x-forwarded-for'];
      const ip = typeof fwd === 'string' ? fwd.split(',')[0].trim() : (req.ip || 'unknown');
      const now = Date.now();
      const rate = chatRateMap.get(ip);
      if (rate && now < rate.resetTime) {
        if (rate.count >= 8) return res.status(429).json({ error: 'Bạn hỏi hơi nhanh rồi, đợi khoảng 1 phút rồi hỏi tiếp nhé.' });
        rate.count++;
      } else {
        chatRateMap.set(ip, { count: 1, resetTime: now + 60 * 1000 });
      }
      if (chatRateMap.size > 1000) {
        for (const [k, e] of chatRateMap.entries()) if (now > e.resetTime) chatRateMap.delete(k);
      }

      const { messages, catalog } = req.body || {};
      if (!Array.isArray(messages)) return res.status(400).json({ error: 'Thiếu câu hỏi.' });
      const history = messages
        .slice(-8)
        .filter((m: any) => m && typeof m.text === 'string' && m.text.trim() && (m.role === 'user' || m.role === 'model'))
        .map((m: any) => ({ role: m.role, parts: [{ text: String(m.text).slice(0, 600) }] }));
      if (!history.length || history[history.length - 1].role !== 'user') return res.status(400).json({ error: 'Thiếu câu hỏi.' });

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Thiếu GEMINI_API_KEY trong biến môi trường server');
        return res.status(500).json({ error: 'Máy chủ chưa sẵn sàng, bạn thử lại sau nhé.' });
      }
      const ai = new GoogleGenAI({ apiKey });
      const cat = typeof catalog === 'string' ? catalog.slice(0, 8000) : '';
      const systemInstruction = [
        'Bạn là Trợ lý Việt phục của app "Việt phục Remix", tư vấn trang phục truyền thống Việt Nam cho học sinh, sinh viên.',
        'Trả lời bằng tiếng Việt, thân thiện như một người bạn, ngắn gọn (khoảng 80-130 từ). Khi liệt kê thì dùng gạch đầu dòng "- ".',
        'CÁCH TƯ VẤN (rất quan trọng):',
        '- Trước khi gợi ý bộ đồ, kiểm tra đã biết đủ các thông tin cần thiết chưa: (1) đi đâu / dịp gì, (2) giới tính (nam hay nữ), (3) dáng người (cao/thấp, gầy/đầy đặn), (4) nước da (trắng, ngăm, trung bình), (5) phong cách thích (nhẹ nhàng truyền thống hay cá tính, nổi bật).',
        '- Nếu còn thiếu thông tin quan trọng, CHỦ ĐỘNG hỏi lại trước, gọn trong 1 tin nhắn, tối đa 3 câu hỏi ngắn đánh số, giọng thân thiện. Ưu tiên hỏi dịp và giới tính trước, sau đó dáng người và nước da. Hỏi dáng người chung chung (cao, thấp, mảnh, đầy đặn), KHÔNG hỏi cân nặng hay số đo cụ thể.',
        '- Không hỏi lại điều người dùng đã nói. Nếu người dùng muốn trả lời nhanh hoặc đã hỏi lại 1 lần mà vẫn thiếu, cứ gợi ý theo hướng phổ biến và nói rõ mình đang giả định gì.',
        '- Khi đã đủ thông tin: gợi ý cụ thể và giải thích ngắn vì sao hợp (vd. nước da ngăm hợp màu đỏ gạch, xanh rêu; người thấp nên chọn tà dài, màu trơn, tóc búi cao).',
        '- Câu hỏi kiến thức (vd. "áo tấc là gì?") thì trả lời thẳng, không cần hỏi thêm.',
        '',
        'QUY TẮC:',
        '1. Chỉ gợi ý trang phục, kiểu tóc, phụ kiện, màu sắc CÓ TRONG DANH MỤC bên dưới và gọi đúng tên như danh mục. Không bịa tên bộ đồ khác.',
        '2. Tôn trọng nguyên tắc Lõi & Remix: phần lõi (dáng áo, cổ, tà, cấu trúc) giữ đúng truyền thống; chỉ remix màu, phụ kiện, tóc, giày.',
        '3. Ở nơi trang nghiêm (chùa, đền, di tích, lễ) luôn khuyên mặc kín đáo, màu nhã nhặn, hạn chế phụ kiện quá nổi.',
        '4. Về lịch sử chỉ nói điều chắc chắn; không chắc thì nói chung chung, không bịa năm tháng.',
        '5. Không bình luận chê ngoại hình. Nếu người dùng kể về dáng người, gợi ý tích cực (vd. tà dài, màu trơn giúp dáng thon cao).',
        '6. Câu hỏi ngoài chủ đề trang phục, văn hoá: nhẹ nhàng kéo về chủ đề trang phục.',
        '7. Không dùng markdown đậm (**), không dùng bảng.',
        '8. Khi đã gợi ý bộ đồ, kết thúc bằng 1 câu ngắn rủ người dùng thử phối bộ đó ngay trong phòng phối đồ (người dùng ĐANG ở trong app, không bảo họ mở app), hoặc dùng mục Thuê đồ để tìm tiệm gần. Khi đang hỏi thêm thông tin thì không cần câu này.',
        '',
        'DANH MỤC CỦA APP:',
        cat,
      ].join('\n');

      const resp: any = await Promise.race([
        ai.models.generateContent({
          model: 'gemini-3.5-flash-lite',
          contents: history,
          config: { systemInstruction, temperature: 0.6, maxOutputTokens: 1200 },
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 20000)),
      ]);
      const text = String(resp?.text || '').replace(/\*\*/g, '').trim();
      return res.json({ text: text || 'Mình chưa nghĩ ra câu trả lời, bạn hỏi lại cụ thể hơn một chút nhé.' });
    } catch (err: any) {
      console.error('chat-advisor lỗi:', err?.message || err);
      return res.status(503).json({ error: 'Trợ lý đang bận, bạn thử lại sau ít giây nhé.' });
    }
  });

  app.post('/api/rental-search', async (req, res) => {
    try {
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.ip || req.socket.remoteAddress || 'unknown';

      const now = Date.now();
      const clientRate = rateLimitMap.get(clientIp);

      if (clientRate && now < clientRate.resetTime) {
        if (clientRate.count >= RATE_LIMIT_MAX) {
          return res.status(429).json({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.' });
        }
        clientRate.count++;
      } else {
        rateLimitMap.set(clientIp, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }

      // Dọn dẹp định kỳ các IP đã hết hạn
      if (rateLimitMap.size > 1000) {
        for (const [ip, entry] of rateLimitMap.entries()) {
          if (now > entry.resetTime) rateLimitMap.delete(ip);
        }
      }

      const { latLng, queryArea, costume } = req.body ?? {};

      // Kiểm tra đầu vào
      const area = typeof queryArea === 'string' ? queryArea.trim().slice(0, 100) : '';
      const costumeName = typeof costume === 'string' && costume.trim() ? costume.trim().slice(0, 100) : 'Việt phục truyền thống';
      const hasLatLng =
        latLng &&
        typeof latLng === 'object' &&
        typeof latLng.latitude === 'number' &&
        typeof latLng.longitude === 'number' &&
        !isNaN(latLng.latitude) &&
        !isNaN(latLng.longitude);
      if (!hasLatLng && !area) {
        return res.status(400).json({ error: 'Thiếu khu vực hoặc vị trí để tìm.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Thiếu GEMINI_API_KEY trong biến môi trường server');
        return res.status(500).json({ error: 'Chưa cấu hình API Key trên server.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      // Gói miễn phí: 3.5 Flash Lite được 500 lượt tìm bằng Google Maps/ngày (3.8 Flash = 0 lượt)
      const MODEL = 'gemini-3.5-flash-lite';
      // Google Maps hiểu TÊN ĐỊA DANH tốt hơn toạ độ -> đổi toạ độ thành tên phố/phường (OpenStreetMap)
      let placeName = '';
      if (hasLatLng) {
        try {
          const u = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=vi&lat=' + latLng.latitude + '&lon=' + latLng.longitude;
          const r = await fetch(u, { headers: { 'User-Agent': 'VietPhucRemix/1.0 (AI Arena demo app)' }, signal: AbortSignal.timeout(3000) });
          const a: any = r.ok ? (await r.json())?.address || {} : {};
          placeName = [a.road, a.quarter || a.suburb || a.neighbourhood, a.city_district || a.county, a.city || a.state].filter(Boolean).join(', ');
        } catch { /* không tra được thì dùng toạ độ */ }
      }
      const where = hasLatLng
        ? (placeName ? `${placeName} (toạ độ ${latLng.latitude.toFixed(4)}, ${latLng.longitude.toFixed(4)})` : `toạ độ ${latLng.latitude.toFixed(4)}, ${latLng.longitude.toFixed(4)} (Việt Nam)`)
        : `${area} (Việt Nam)`;

      // BƯỚC 1: chỉ tìm cửa hàng bằng Google Maps (câu hỏi ngắn -> model luôn tra Maps)
      // Mỗi lần hỏi tối đa 15 giây; hỏi 2 câu ngắn CÙNG LÚC rồi gộp kết quả (nhanh hơn thử lần lượt)
      const tStart = Date.now(); // đồng hồ tổng: cả lượt tìm cố gắng dưới 30 giây
      const askMaps = (q: string) =>
        Promise.race([
          ai.models.generateContent({
            model: MODEL,
            contents: q,
            config: {
              tools: [{ googleMaps: {} }],
              ...(hasLatLng
                ? { toolConfig: { retrievalConfig: { latLng: { latitude: latLng.latitude, longitude: latLng.longitude } } } }
                : {}),
            },
          }).then((r: any) => r.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []),
          new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 15000)),
        ]).catch((e) => { console.log('rental-search: lỗi 1 câu hỏi Maps', e?.message); return [] as any[]; });
      const queries = [
        `Dùng Google Maps tìm 15 cửa hàng cho thuê việt phục / cổ phục / trang phục truyền thống GẦN NHẤT với ${where}. Liệt kê tên và địa chỉ.`,
        `Dùng Google Maps tìm 15 tiệm cho thuê áo dài, việt phục GẦN NHẤT với ${where}. Liệt kê tên và địa chỉ.`,
      ];
      let raw: any[] = (await Promise.all(queries.map(askMaps))).flat();
      if (raw.length === 0 && Date.now() - tStart < 12000) {
        console.log('rental-search: 2 câu đầu không có nguồn Google Maps, thử lại 1 lần...');
        raw = await askMaps(queries[0]);
      }
      const seen = new Set<string>();
      let groundingChunks: any[] = raw.filter((c: any) => {
        const key = c?.maps?.placeId || c?.maps?.uri;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Lấy địa chỉ, số sao, số lượt đánh giá thật từ dữ liệu Google Maps
      const shops = groundingChunks.map((c: any) => {
        const info: string = c.maps?.text || '';
        const title = String(c.maps?.title || '').replace(/\s*[-–—|]\s*Google Maps\s*$/i, '').trim();
        const address = (info.match(/\*\*Address:\*\*\s*([^\n]+)/i)?.[1] || '').replace(/,?\s*\d{5,6}\s*,?\s*Vietnam\s*$/i, '').replace(/,\s*Vietnam\s*$/i, '').trim();
        const rm = info.match(/\*\*Rating:\*\*\s*([\d.]+)\s*\(([\d.,]+)\s*reviews?\)/i);
        return { title, address, rating: rm ? rm[1] : '?', reviews: rm ? rm[2].replace(/[.,]/g, '') : '?' };
      });

      // Lọc uy tín: bỏ tiệm có dưới 4 lượt đánh giá trên Google Maps (tiệm chưa rõ số lượt vẫn giữ)
      const MIN_REVIEWS = 4;
      const kept = shops
        .map((s, i) => ({ s, c: groundingChunks[i] }))
        .filter(({ s }) => s.reviews === '?' || parseInt(s.reviews, 10) >= MIN_REVIEWS)
        .slice(0, 12);
      shops.splice(0, shops.length, ...kept.map((k) => k.s));
      groundingChunks = kept.map((k) => k.c);

      // Đổi ĐỊA CHỈ THẬT (từ Google Maps) thành toạ độ bằng OpenStreetMap — chạy song song với bước 2
      // Toạ độ TÂM KHU VỰC người dùng gõ: tra thật bằng OpenStreetMap (không dùng số AI đoán). Xếp hàng trước các tiệm.
      const areaCenterPromise: Promise<{ lat: number; lng: number } | null> = (async () => {
        if (hasLatLng || !area) return null;
        const parts = area.split(',').map((p) => p.trim()).filter(Boolean);
        for (let k = 0; k < Math.min(parts.length, 3); k++) {
          const q = parts.slice(k).join(', ');
          if (geoCache.has('AREA:' + q)) { const c = geoCache.get('AREA:' + q); if (c) return c; continue; }
          const c = await nominatim(q);
          geoCache.set('AREA:' + q, c);
          if (c) return c;
        }
        return null;
      })();
      const cleanAddr = (a: string) => {
        const parts = a.replace(PLUS_RE, '').replace(/^\s*,/, '')
          .split(',').map((p) => p.trim()).filter((p) => p && !/đến biển|đi vào|là thấy|phía bên/i.test(p));
        if (parts.length) {
          // "21 Ng. 98 P. Thái Hà" -> "98 Phố Thái Hà" (đầu ngõ 98 nằm ngay số 98 trên phố chính, OSM dễ tìm hơn)
          parts[0] = parts[0]
            .replace(/^.*?(?:\bng\.|ngõ|ngách|hẻm|kiệt)\s*(\d+[a-z]?)(?:\/\d+)?\s+(?=\D)/i, '$1 ')
            .replace(/\bP\.\s*/g, 'Phố ').replace(/\bĐ\.\s*/g, 'Đường ').trim();
        }
        return parts.join(', ');
      };
      const tryOsm = async (q: string) => {
        if (geoCache.has(q)) return geoCache.get(q)!;
        const c = await nominatim(q);
        if (geoCache.size > 2000) geoCache.clear();
        geoCache.set(q, c);
        return c;
      };
      const geoStart = Date.now();
      const geoDone: ({ lat: number; lng: number; level: string } | null | undefined)[] = shops.map(() => undefined);
      const geoAll = Promise.all(
        shops.map(async (s) => {
          const parts = cleanAddr(s.address).split(', ').filter(Boolean);
          const plus = s.address.match(PLUS_RE)?.[0];
          // 1) Có Plus Code -> giải mã ra toạ độ chính xác (cần 1 điểm tham chiếu gần đó)
          if (plus) {
            const ref = hasLatLng ? { lat: latLng.latitude, lng: latLng.longitude } : parts.length ? await tryOsm(parts.slice(-2).join(', ')) : null;
            const p = ref ? decodeShortPlus(plus, ref.lat, ref.lng) : null;
            if (p) return { ...p, level: 'plus' };
          }
          // 2) Tra địa chỉ đầy đủ, không ra thì tra cấp đường
          let g = parts.length ? await tryOsm(parts.join(', ')) : null;
          let level = 'số nhà';
          if (!g && parts.length > 2) { g = await tryOsm(parts.slice(1).join(', ')); level = 'đường'; }
          return g ? { ...g, level } : null;
        }).map((p, k) => p.then((v) => (geoDone[k] = v)))
      );
      // Dự phòng: Photon tra song song (nhanh, kém chính xác hơn) cho tiệm chưa kịp tới lượt
      const photon = async (q: string) => {
        try {
          const u = 'https://photon.komoot.io/api/?limit=1&q=' + encodeURIComponent(q + ', Việt Nam') + (hasLatLng ? '&lat=' + latLng.latitude + '&lon=' + latLng.longitude : '');
          const r = await fetch(u, { headers: { 'User-Agent': 'VietPhucRemix/1.0 (AI Arena demo app)' }, signal: AbortSignal.timeout(4000) });
          const f: any = r.ok ? (await r.json())?.features?.[0] : null;
          return f && f.properties?.countrycode === 'VN' ? { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], level: 'ước tính' } : null;
        } catch { return null; }
      };
      const photonAll = Promise.all(shops.map((s) => photon(cleanAddr(s.address))));
      // Chờ tra chuẩn tối đa 12 giây, sau đó dùng Photon cho tiệm còn thiếu
      const geoPromise = (async () => {
        await Promise.race([geoAll, new Promise((r) => setTimeout(r, Math.max(0, 10000 - (Date.now() - geoStart))))]);
        const ph = await photonAll;
        return shops.map((_, k) => (geoDone[k] !== undefined && geoDone[k] !== null ? geoDone[k]! : ph[k]));
      })();

      // BƯỚC 2: (không dùng công cụ) xác định khu vực, toạ độ và viết câu gợi ý cho từng cửa hàng
      const list = shops.map((s, i) => `${i + 1}. ${s.title} — ${s.address}`).join('\n');
      const r2: any = await Promise.race([ai.models.generateContent({
        model: MODEL,
        contents:
          `Người dùng tìm quanh: ${area ? `"${area}"` : where}.\n` +
          `Danh sách cửa hàng (dữ liệu Google Maps):\n${list || '(trống)'}\n\n` +
          `Trả lời đúng định dạng, không thêm gì khác:\n` +
          `Dòng đầu: KHU VỰC: <tên địa điểm chuẩn>, <phường/xã>, <quận/huyện>, <tỉnh/thành> | <VĨ ĐỘ, KINH ĐỘ trung tâm>. ` +
          `Nếu khu vực người dùng gõ không phải địa danh có thật ở Việt Nam thì chỉ ghi: KHU VỰC: KHÔNG RÕ\n` +
          `Sau đó với mỗi cửa hàng (giữ đúng số thứ tự): SỐ || VĨ ĐỘ, KINH ĐỘ || 1 câu ngắn gợi ý vì sao nên ghé hỏi thuê ${costumeName} ` +
          `(không ghi giá, số điện thoại, không khẳng định có sẵn đồ).`,
      }), new Promise((r) => setTimeout(() => r({ text: '' }), 8000))]).catch((e: any) => { console.log('rental-search: bước 2 lỗi', e?.message); return { text: '' }; });
      const geoList = await geoPromise;
      const t2 = r2.text ?? '';
      let areaCenterFinal: { lat: number; lng: number } | null = null;
      // Photon (OpenStreetMap) hợp để tra TÊN ĐỊA DANH (phường/xã/thị trấn), không bị giới hạn 1 lượt/giây
      const photonPlace = async (q: string) => {
        try {
          const u = 'https://photon.komoot.io/api/?limit=1&q=' + encodeURIComponent(q + ', Việt Nam');
          const r = await fetch(u, { headers: { 'User-Agent': 'VietPhucRemix/1.0 (AI Arena demo app)' }, signal: AbortSignal.timeout(4000) });
          const f: any = r.ok ? (await r.json())?.features?.[0] : null;
          return f && f.properties?.countrycode === 'VN' ? { lat: f.geometry.coordinates[1] as number, lng: f.geometry.coordinates[0] as number } : null;
        } catch { return null; }
      };
      let areaLine = t2.split('\n').find((l) => /KHU\s*VỰC\s*:/i.test(l)) || (area ? `KHU VỰC: ${area}` : '');
      if (!hasLatLng && !/KHÔNG\s*RÕ/i.test(areaLine)) {
        // Bỏ toạ độ AI đoán, thay bằng toạ độ tra thật (tra không ra -> để trống, app sẽ không hiện số sai)
        // Ưu tiên TÊN ĐỊA DANH CỤ THỂ NHẤT (đã chuẩn hoá, bỏ "Quốc lộ/đường") -> tránh ra 1 điểm bất kỳ trên quốc lộ dài
        const label = areaLine.replace(/^.*?KHU\s*VỰC\s*:\s*/i, '').replace(/\s*\|.*$/, '');
        const lp = label.split(',').map((p) => p.trim()).map((p) => p.replace(/^số\s+/i, '')).filter((p) => p && !/^(quốc lộ|ql|tỉnh lộ)\b/i.test(p)); // chỉ bỏ quốc lộ/tỉnh lộ (đường rất dài), giữ số nhà + tên phố
        const cands = [lp.length >= 2 ? lp[0] + ', ' + lp[lp.length - 1] : '', lp.length >= 3 ? lp[0] + ', ' + lp[1] + ', ' + lp[lp.length - 1] : '', lp.join(', '), lp.slice(1).join(', ')]
          .filter((q, k, arr) => q && arr.indexOf(q) === k);
        let center: { lat: number; lng: number } | null = null;
        for (const q of cands) {
          if (center) break;
          center = await photonPlace(q);
        }
        // Kiểm tra chéo: điểm tra được phải nằm gần phường/quận AI đã xác định (tránh nhầm cơ sở khác, vd. trường có 2 cơ sở)
        if (center && lp.length >= 3) {
          const ward = await photonPlace(lp.slice(1).join(', '));
          if (ward) {
            const R = Math.PI / 180;
            const h = Math.sin(((ward.lat - center.lat) * R) / 2) ** 2 + Math.cos(center.lat * R) * Math.cos(ward.lat * R) * Math.sin(((ward.lng - center.lng) * R) / 2) ** 2;
            const km = 12742 * Math.asin(Math.sqrt(h));
            if (km > 5) { console.log('rental-search: tâm lệch', km.toFixed(1), 'km so với phường -> dùng toạ độ phường'); center = ward; }
          }
        }
        // Không ra thì mới dùng kết quả tra nguyên chữ người dùng gõ
        if (!center) center = await Promise.race([areaCenterPromise, new Promise<null>((r) => setTimeout(() => r(null), 6000))]);
        areaCenterFinal = center;
        areaLine = areaLine.replace(/\s*\|.*$/, '') + (center ? ` | ${center.lat.toFixed(5)}, ${center.lng.toFixed(5)}` : '');
      }
      const extra = new Map<number, { coords: string; reason: string }>();
      for (const line of t2.split('\n')) {
        const parts = line.split('||').map((p) => p.replace(/\*\*/g, '').trim());
        const idx = parseInt(parts[0], 10);
        if (parts.length >= 3 && idx >= 1) extra.set(idx, { coords: parts[1], reason: parts[2] });
      }

      // Ghép lại đúng định dạng cũ để phía app giữ nguyên: TÊN || ĐỊA CHỈ || LÝ DO || TOẠ ĐỘ || SAO || LƯỢT
      const text = [
        areaLine.trim(),
        ...shops.map((s, i) => {
          const e = extra.get(i + 1);
          let g = geoList[i];
          // Có Plus Code mà chưa ra toạ độ -> giải mã bằng tâm khu vực vừa tra được
          if (!g && areaCenterFinal) {
            const pc = s.address.match(PLUS_RE)?.[0];
            const p = pc ? decodeShortPlus(pc, areaCenterFinal.lat, areaCenterFinal.lng) : null;
            if (p) g = { ...p, level: 'plus' };
          }
          // Ưu tiên toạ độ tra từ địa chỉ thật (OpenStreetMap); nếu không tra được mới dùng ước đoán của AI
          const coords = g ? `${g.lat.toFixed(5)}, ${g.lng.toFixed(5)}` : ''; // không tra được -> để trống, không dùng số AI đoán
          return `${s.title} || ${s.address} || ${e?.reason || ''} || ${coords} || ${s.rating} || ${s.reviews}`;
        }),
      ]
        .filter(Boolean)
        .join('\n');

      return res.json({ text, groundingChunks, geo: geoList.map((g) => (g ? g.level : 'AI')) });
    } catch (err: any) {
      console.error('Lỗi server rental-search:', err?.message || err);
      return res.status(500).json({ error: 'Trợ lý AI đang bận hoặc mạng yếu. Vui lòng thử lại.' });
    }
  });

  // Tích hợp Vite frontend
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Phục vụ frontend tĩnh đã build trong thư mục dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
