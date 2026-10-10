import React, { useState, useEffect, useRef } from 'react';
import { X, Navigation, Search, MapPin, ExternalLink, RefreshCw } from 'lucide-react';

interface CuratedShop {
  id: string;
  name: string;
  address: string;
  note: string;
  rating: number;
  reviews: number;
}

const CURATED_SHOPS: CuratedShop[] = [
  { id: 'vstyle', name: "V'style – Việt Cổ Phục", address: '3B ngõ 94 Hoàng Ngân, Yên Hòa, Cầu Giấy, Hà Nội', note: 'Studio việt phục: áo tấc, nhật bình, giao lĩnh', rating: 5.0, reviews: 640 },
  { id: 'hoangthanh', name: 'Việt Phục Hoàng Thành', address: 'Trong khu Hoàng thành Thăng Long, Ba Đình, Hà Nội', note: 'Thuê & chụp ảnh việt phục ngay tại di tích', rating: 4.9, reviews: 165 },
  { id: 'thanhphong', name: 'Việt phục Thanh Phong', address: '11 ngõ 355 Xuân Đỉnh, Bắc Từ Liêm, Hà Nội', note: 'Cửa hàng trang phục truyền thống', rating: 5.0, reviews: 34 },
  { id: 'yvanhien', name: 'Ỷ Vân Hiên', address: '195 Đội Cấn, Ba Đình, Hà Nội', note: 'Việt phục phục dựng theo tư liệu', rating: 3.6, reviews: 54 },
  { id: 'dongphong', name: 'Đông Phong', address: '78 Quán Thánh, Ba Đình, Hà Nội', note: 'Cửa hàng trang phục truyền thống', rating: 5.0, reviews: 2 },
];

export interface RentalShop {
  id: string;
  name: string;
  address: string;
  mapsLink: string;
  aiReason?: string;
  rating?: number;
  lat?: number;
  lng?: number;
  distanceKm?: number;
  dirUrl?: string;
  reviews?: number;
  note?: string;
}

interface RentalMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCostume?: string;
  occasionName?: string;
}

// Chuẩn hoá tên địa danh để so khớp (bỏ dấu, bỏ "quận/phường...")
const normVN = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\b(quan|huyen|phuong|xa|thi xa|thanh pho|tp|tinh)\b/g, '')
    .replace(/[^a-z0-9]/g, '');
// Hỏi BigDataCloud xem một toạ độ thuộc quận/thành phố nào (null nếu không tra được)
const reverseNames = async (c: { lat: number; lng: number }): Promise<string[] | null> => {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${c.lat}&longitude=${c.lng}&localityLanguage=vi`,
      { signal: ctrl.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const d = await res.json();
    const admin = ((d.localityInfo?.administrative || []) as { name: string; adminLevel?: number }[])
      .filter((x) => (x.adminLevel ?? 0) >= 5)
      .map((x) => x.name);
    return [d.locality, d.city, d.principalSubdivision, ...admin].filter(Boolean).map(normVN).filter((n: string) => n.length >= 3);
  } catch {
    return null;
  }
};

// Khoảng cách đường chim bay (km) giữa 2 toạ độ
const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};
// Đọc "21.03, 105.80" -> toạ độ; chỉ nhận toạ độ nằm trong Việt Nam
const parseLatLng = (s?: string) => {
  const m = (s || '').match(/(-?\d{1,2}\.\d+)\s*[,;]\s*(-?\d{2,3}\.\d+)/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lng = parseFloat(m[2]);
  if (lat < 8 || lat > 24 || lng < 102 || lng > 110) return null;
  return { lat, lng };
};

// Lọc nhanh ô khu vực trước khi gọi AI (không tốn lượt gọi Gemini)
const BAD_WORDS = ['địt', 'đéo', 'đếch', 'lồn', 'buồi', 'cặc', 'đụ', 'đm', 'đcm', 'dcm', 'vcl', 'vkl', 'clm', 'cc', 'fuck', 'shit'];
const checkAreaInput = (raw: string): string | null => {
  const s = raw.normalize('NFC').trim().toLowerCase();
  const tokens = s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (tokens.some((t) => BAD_WORDS.includes(t))) {
    return 'Ô này chỉ dùng để gõ khu vực thôi nha 😅 Ví dụ: Cầu Giấy, Huế, Hội An.';
  }
  const letters = (s.match(/\p{L}/gu) || []).length;
  if (letters < 2 || s.length > 60 || /(.)\1{4,}/u.test(s)) {
    return 'Mình chưa hiểu khu vực này. Bạn thử gõ tên quận/thành phố, ví dụ: Cầu Giấy, Huế, Hội An.';
  }
  return null;
};

export const RentalMapModal: React.FC<RentalMapModalProps> = ({
  isOpen,
  onClose,
  currentCostume,
  occasionName,
}) => {
  const curatedRentalShops: RentalShop[] = CURATED_SHOPS.map((s) => {
    const q = encodeURIComponent(`${s.name}, ${s.address}`);
    return {
      ...s,
      mapsLink: `https://www.google.com/maps/search/?api=1&query=${q}`,
    };
  });

  const [activeTab, setActiveTab] = useState<'curated' | 'ai'>('curated');
  const [activeShopId, setActiveShopId] = useState<string>(curatedRentalShops[0].id);

  // AI Tab state
  const [aiShops, setAiShops] = useState<RentalShop[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [queryArea, setQueryArea] = useState<string>('');
  const [lastOptions, setLastOptions] = useState<{ latLng?: { latitude: number; longitude: number }; queryArea?: string } | null>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number; acc: number; label: string | null; src?: string } | null>(null);
  const [showUserOnMap, setShowUserOnMap] = useState<boolean>(false);
  const [resolvedArea, setResolvedArea] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Esc key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Đếm giây trong lúc AI tìm, để người dùng biết app không bị treo
  const [searchSecs, setSearchSecs] = useState(0);
  useEffect(() => {
    if (!isSearching) return;
    setSearchSecs(0);
    const timer = setInterval(() => setSearchSecs((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isSearching]);

  if (!isOpen) return null;

  // Active shop selection
  const currentList = activeTab === 'curated'
    ? curatedRentalShops
    : (aiShops.length > 0 ? aiShops : curatedRentalShops);

  const activeShop = currentList.find((s) => s.id === activeShopId) || currentList[0] || curatedRentalShops[0];
  const activeMapQuery = encodeURIComponent(`${activeShop.name}, ${activeShop.address}`);

  const runAiSearch = async (options: { latLng?: { latitude: number; longitude: number }; queryArea?: string }) => {
    setIsSearching(true);
    setSearchError(null);
    setGeoNotice(null);
    setHasSearched(true);
    setLastOptions(options);
    setResolvedArea(null);

    try {
      const locationText = options.latLng
        ? `vị trí người dùng tại toạ độ ${options.latLng.latitude.toFixed(4)}, ${options.latLng.longitude.toFixed(4)} (Việt Nam)`
        : (options.queryArea || 'Hà Nội');

      const costumeName = currentCostume || 'Việt phục truyền thống';
      const eventTitle = occasionName || 'chưa chọn';

      const prompt = `Tìm từ 8 đến 9 cửa hàng CHO THUÊ việt phục / cổ phục / trang phục truyền thống Việt Nam gần ${locationText}. Người dùng đang phối bộ: ${costumeName}, dịp: ${eventTitle}. Với mỗi cửa hàng, viết đúng 1 dòng theo mẫu: TÊN CỬA HÀNG || ĐỊA CHỈ || 1 câu ngắn gợi ý vì sao nên ghé để hỏi thuê bộ ${costumeName} || VĨ ĐỘ, KINH ĐỘ của cửa hàng theo Google Maps || SỐ SAO trên Google Maps (vd 4.8) || SỐ LƯỢT ĐÁNH GIÁ (vd 120). Nếu không chắc chắn số sao hoặc số lượt đánh giá thì ghi dấu ? chứ tuyệt đối không đoán. Ưu tiên cửa hàng gần nhất (trong bán kính 8 km) và sắp xếp từ GẦN đến XA. KHÔNG khẳng định cửa hàng chắc chắn có sẵn món đồ nào, KHÔNG ghi giá hay số điện thoại.`;

      const areaRule = options.queryArea
        ? ` Người dùng gõ khu vực là "${options.queryArea}". Dòng ĐẦU TIÊN bắt buộc có dạng: KHU VỰC: <tên khu vực chuẩn trên Google Maps, kèm tỉnh/thành phố> | <VĨ ĐỘ, KINH ĐỘ trung tâm khu vực>. Nếu nội dung trong ngoặc kép không phải một địa danh có thật ở Việt Nam (gõ bừa, câu tục, tên không tồn tại), chỉ trả lời đúng một dòng: KHU VỰC: KHÔNG RÕ — và không liệt kê cửa hàng nào.`
        : '';

      const res = await fetch('/api/rental-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt + areaRule,
          latLng: options.latLng,
          queryArea: options.queryArea,
          costume: costumeName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${res.status}`);
      }

      const data: { text?: string; groundingChunks?: any[] } = await res.json();
      const response = {
        text: data.text ?? '',
        candidates: [{ groundingMetadata: { groundingChunks: data.groundingChunks ?? [] } }],
      };

      // Lấy groundingChunks từ Google Maps Grounding
      const candidate = response.candidates?.[0];
      const chunks = candidate?.groundingMetadata?.groundingChunks || [];

      // Phân tích các dòng từ văn bản AI
      const rawText = response.text || '';

      // Kiểm tra khu vực AI hiểu được (chỉ khi người dùng tự gõ)
      const areaMatch = rawText.match(/KHU\s*VỰC\s*:\s*(.+)/i);
      const areaName = areaMatch ? areaMatch[1].replace(/[*_`]/g, '').trim() : '';
      if (options.queryArea && /KHÔNG\s*RÕ/i.test(areaName)) {
        setAiShops([]);
        setHasSearched(false);
        setGeoNotice(
          `Không tìm thấy khu vực “${options.queryArea}” trên bản đồ. Bạn thử gõ tên quận/thành phố, ví dụ: Cầu Giấy, Huế, Hội An.`
        );
        return;
      }
      const areaLabel = areaName.split('|')[0].trim();
      let areaCenter = parseLatLng(areaName.split('|')[1]);
      if (options.queryArea && areaCenter) {
        // Kiểm tra chéo: toạ độ tâm AI đưa ra có đúng là khu vực đã gõ không
        const names = await reverseNames(areaCenter);
        const labelParts = areaLabel.split(',').map((p) => normVN(p)).filter(Boolean);
        const targets = labelParts.length >= 3 ? labelParts.slice(0, -1) : labelParts.slice(0, 1);
        if (names && !names.some((n) => targets.some((t) => n.includes(t) || t.includes(n)))) {
          areaCenter = null;
        }
      }
      setResolvedArea(options.queryArea && areaLabel ? areaLabel : null);
      const textLines = rawText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.includes('||'));

      const parsedLines = textLines.map((line) => {
        // Chỉ bỏ ký hiệu đầu dòng (-, *, 1.) ở TÊN; địa chỉ giữ nguyên số nhà (vd 3B)
        const parts = line.split('||').map((p, idx) => {
          let s = p.replace(/\*\*/g, '').trim();
          if (idx === 0) s = s.replace(/^(?:[-*•]|\d+[.)])\s*/, '');
          return s;
        });
        return {
          name: parts[0] || '',
          address: parts[1] || '',
          aiReason: parts[2] || '',
          coords: parseLatLng(parts[3]),
          // Số sao 1–5 và số lượt đánh giá; "?" hoặc số vô lý thì bỏ trống
          rating: (() => {
            const r = parseFloat((parts[4] || '').replace(',', '.'));
            return r >= 1 && r <= 5 ? Math.round(r * 10) / 10 : undefined;
          })(),
          reviews: (() => {
            const n = parseInt((parts[5] || '').replace(/[^\d]/g, ''), 10);
            return Number.isFinite(n) && n > 0 ? n : undefined;
          })(),
        };
      });

      // Hàm chuẩn hóa chuỗi để so sánh gần đúng
      const cleanStr = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

      const validShops: RentalShop[] = [];
      const seenUris = new Set<string>();
      const usedLines = new Set<(typeof parsedLines)[number]>();

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const mapItem = chunk.maps || (chunk as any).web;
        const title = mapItem?.title?.replace(/\s*[-–—|]\s*Google Maps\s*$/i, '').trim();
        const uri = mapItem?.uri?.trim();

        if (!title || !uri) continue;
        if (seenUris.has(uri)) continue;
        seenUris.add(uri);

        // Khớp theo tên gần đúng với các dòng AI trả về
        const titleClean = cleanStr(title);
        const matched = parsedLines.find((pl) => {
          if (usedLines.has(pl)) return false;
          const nameClean = cleanStr(pl.name);
          if (nameClean.length < 3) return false;
          return titleClean.includes(nameClean) || nameClean.includes(titleClean);
        });
        // Bỏ địa điểm Maps không có trong danh sách cửa hàng AI đưa ra (vd: di tích, tên phố)
        if (!matched) continue;
        usedLines.add(matched);

        validShops.push({
          id: `ai-${i}-${encodeURIComponent(title)}`,
          name: title,
          address: matched?.address || '',
          mapsLink: uri,
          aiReason: matched?.aiReason,
          lat: matched?.coords?.lat,
          lng: matched?.coords?.lng,
          rating: matched?.rating,
          reviews: matched?.reviews,
        });

        if (validShops.length >= 12) break;
      }

      // Sắp xếp từ gần đến xa (theo vị trí người dùng, hoặc tâm khu vực đã gõ)
      const ref = options.latLng
        ? { lat: options.latLng.latitude, lng: options.latLng.longitude }
        : areaCenter;
      let finalShops = validShops;
      if (ref) {
        validShops.forEach((s) => {
          if (s.lat !== undefined && s.lng !== undefined) {
            s.distanceKm = distanceKm(ref, { lat: s.lat, lng: s.lng });
          }
        });
        // Chỉ giữ tiệm trong bán kính 8 km; tiệm không rõ toạ độ xếp cuối
        finalShops = validShops
          .filter((s) => s.distanceKm === undefined || s.distanceKm <= 8)
          .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
      }
      finalShops = finalShops.slice(0, 9);
      // Link "Chỉ đường" của Google Maps: Google tự tính quãng đường & thời gian đi thật
      finalShops.forEach((s) => {
        s.dirUrl =
          'https://www.google.com/maps/dir/?api=1' +
          (ref ? '&origin=' + ref.lat + ',' + ref.lng : '') +
          '&destination=' + encodeURIComponent(s.name + ', ' + s.address);
      });
      setAiShops(finalShops);
      if (finalShops.length > 0) {
        setActiveShopId(finalShops[0].id);
      }
    } catch (err) {
      console.error('Lỗi gọi Gemini Maps grounding:', err);
      setSearchError('Trợ lý AI đang bận hoặc mạng yếu. Bạn xem tạm tab Gợi ý chọn lọc nhé!');
    } finally {
      setIsSearching(false);
    }
  };

  // Đổi toạ độ thành tên đường/phường để người dùng tự kiểm tra (OpenStreetMap Nominatim, không cần key)
  const reverseGeocode = async (lat: number, lng: number) => {
    const apply = (label: string, src: string) =>
      setUserLoc((prev) => (prev && prev.lat === lat && prev.lng === lng ? { ...prev, label, src } : prev));
    const getJson = async (url: string) => {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 4000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(String(res.status));
        return await res.json();
      } finally {
        clearTimeout(timer);
      }
    };
    const uniq = (arr: (string | undefined)[]) => arr.filter((p, i) => !!p && arr.indexOf(p) === i) as string[];
    // 1) OpenStreetMap: chi tiết tới tên đường
    try {
      const d = await getJson(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&accept-language=vi`
      );
      const a = d.address || {};
      const parts = uniq([
        a.road,
        a.quarter || a.suburb || a.neighbourhood || a.village,
        a.city_district || a.county || a.town,
        a.city || a.state,
      ]);
      if (parts.length) return apply(parts.join(', '), '© OpenStreetMap');
    } catch {}
    // 2) Dự phòng BigDataCloud: tới cấp phường/quận
    try {
      const d = await getJson(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=vi`
      );
      const admin = ((d.localityInfo?.administrative || []) as { name: string; adminLevel?: number }[])
        .filter((x) => (x.adminLevel ?? 0) >= 4)
        .sort((x, y) => (y.adminLevel ?? 0) - (x.adminLevel ?? 0))
        .map((x) => x.name);
      const parts = uniq([d.locality, ...admin]).slice(0, 3);
      if (parts.length) return apply(parts.join(', '), 'BigDataCloud');
    } catch {}
    apply(`Toạ độ ${lat.toFixed(5)}, ${lng.toFixed(5)}`, 'trình duyệt');
  };

  const handleLocationSearch = () => {
    if (isSearching) return;
    setGeoNotice(null);
    setSearchError(null);

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoNotice('Trình duyệt không hỗ trợ lấy vị trí. Vui lòng nhập khu vực bên dưới nhé!');
      setTimeout(() => inputRef.current?.focus(), 100);
      return;
    }

    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude, acc: accuracy, label: null });
        setShowUserOnMap(true);
        reverseGeocode(latitude, longitude);
        runAiSearch({
          latLng: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
      },
      (err) => {
        setIsSearching(false);
        setGeoNotice('Không thể lấy vị trí (đã từ chối quyền hoặc chưa bật GPS). Bạn hãy nhập khu vực bên dưới nhé!');
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSearching || !queryArea.trim()) return;
    setUserLoc(null);
    setShowUserOnMap(false);
    const inputProblem = checkAreaInput(queryArea);
    if (inputProblem) {
      setGeoNotice(inputProblem);
      setSearchError(null);
      setAiShops([]);
      setHasSearched(false);
      setResolvedArea(null);
      return;
    }
    runAiSearch({ queryArea: queryArea.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:w-[96vw] max-w-[1600px] h-[94vh] bg-[#FDFBF7] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-[#8C6D53]/20"
      >
        {/* Nút X đóng ở góc trên phải */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#8C6D53] hover:text-[#2A1E17] shadow-sm flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* CỘT BẢN ĐỒ: Trái trên PC, Trên 300px trên Mobile */}
        <div className="h-[45vh] md:h-auto md:flex-1 shrink-0 bg-[#EFE5D3] relative">
          <iframe
            key={showUserOnMap && userLoc ? 'me' : activeShop.id}
            title={`Bản đồ ${activeShop.name}`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={showUserOnMap && userLoc
              ? `https://maps.google.com/maps?q=${userLoc.lat},${userLoc.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`
              : `https://maps.google.com/maps?q=${activeMapQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
          />
        </div>

        {/* CỘT DANH SÁCH: Phải trên PC, Dưới cuộn được trên Mobile */}
        <div className="flex-1 md:flex-none md:w-[42%] md:max-w-[640px] min-h-0 flex flex-col bg-[#FDFBF7] border-t md:border-t-0 md:border-l border-[#8C6D53]/15">
          {/* 2 Tabs chuyển đổi */}
          <div className="flex border-b border-[#8C6D53]/15 px-4 pt-3 gap-2 shrink-0 bg-[#FAF6EE]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('curated');
                setShowUserOnMap(false);
                setActiveShopId(curatedRentalShops[0].id);
              }}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition border-b-2 ${
                activeTab === 'curated'
                  ? 'border-[#8C2D19] text-[#8C2D19]'
                  : 'border-transparent text-[#8C6D53] hover:text-[#2A1E17]'
                }`}
            >
              Gợi ý chọn lọc
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ai');
                if (aiShops.length > 0) {
                  setActiveShopId(aiShops[0].id);
                }
              }}
              className={`pb-2.5 px-3 text-xs sm:text-sm font-semibold transition border-b-2 flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'border-[#8C2D19] text-[#8C2D19]'
                  : 'border-transparent text-[#8C6D53] hover:text-[#2A1E17]'
                }`}
            >
              <span>🧭</span> Gần bạn (AI)
            </button>
          </div>

          {/* Vùng nội dung cuộn */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
            {activeTab === 'curated' ? (
              /* TAB 1: GỢI Ý CHỌN LỌC */
              <div>
                <div className="mb-3 pr-8 md:pr-0">
                  <h3 className="font-serif font-bold text-base text-[#2A1E17]">
                    📍 Điểm thuê Việt phục uy tín
                  </h3>
                  <p className="text-xs text-[#8C6D53] mt-0.5">
                    Hà Nội · thông tin tham khảo từ Google Maps, nên gọi trước khi đến
                  </p>
                </div>

                <div className="space-y-2">
                  {curatedRentalShops.map((shop) => (
                    <button
                      key={shop.id}
                      type="button"
                      onClick={() => setActiveShopId(shop.id)}
                      className={`w-full text-left rounded-2xl border p-3 transition active:scale-[0.99] ${
                        shop.id === activeShop.id
                          ? 'bg-[#FAF0E6] border-[#8C2D19] shadow-xs ring-1 ring-[#8C2D19]/30'
                          : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/40'
                        }`}
                    >
                      <div className="font-bold text-sm text-[#2A1E17] leading-tight mb-1">
                        {shop.name}
                      </div>
                      <div className="text-xs text-[#5C4534] leading-snug mb-1">
                        {shop.address}
                      </div>
                      {shop.rating !== undefined && (
                        <div className="text-[11px] font-semibold text-[#B45309] mb-1">
                          ⭐ {shop.rating.toFixed(1)} · {shop.reviews} đánh giá trên Google
                        </div>
                      )}
                      {shop.note && (
                        <div className="text-[11px] text-[#8C6D53] italic">
                          {shop.note}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* TAB 2: GẦN BẠN (AI VỚI GOOGLE MAPS GROUNDING) */
              <div className="space-y-3">
                <div className="pr-8 md:pr-0">
                  <h3 className="font-serif font-bold text-base text-[#2A1E17] flex items-center gap-1.5">
                    <span>🧭</span> Trợ lý tìm điểm thuê gần bạn
                  </h3>
                  <p className="text-xs text-[#8C6D53] mt-0.5">
                    Dùng Gemini kết nối dữ liệu Google Maps thật
                  </p>
                </div>

                {/* Nút tìm quanh vị trí */}
                <div>
                  <button
                    type="button"
                    disabled={isSearching}
                    onClick={handleLocationSearch}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#8C2D19] hover:bg-[#6D2313] disabled:opacity-50 text-white text-xs font-bold transition shadow-xs active:scale-[0.99]"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Tìm quanh vị trí hiện tại</span>
                  </button>
                  <p className="text-[10px] text-center text-[#8C6D53] mt-1 italic">
                    Vị trí chỉ dùng cho lần tìm này, không lưu lại.
                  </p>
                </div>

                {/* Thông báo nếu bị từ chối vị trí */}
                {geoNotice && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed animate-in fade-in">
                    {geoNotice}
                  </div>
                )}

                {/* Vị trí AI đang dùng — để người dùng tự kiểm tra */}
                {userLoc && (
                  <div className="p-3 rounded-2xl bg-[#F1F6EF] border border-[#4E7A52]/30 text-xs space-y-2 animate-in fade-in">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#4E7A52] shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-[#2A1E17]">Vị trí AI đang dùng</p>
                        <p className="text-[#5C4534] leading-snug">{userLoc.label ?? 'Đang tra tên khu vực...'}</p>
                        <p className="text-[10px] text-[#8C6D53] mt-0.5">
                          Sai số khoảng ±{Math.round(userLoc.acc)} m{userLoc.src ? ` · nguồn: ${userLoc.src}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowUserOnMap(true)}
                        className="flex-1 px-2 py-1.5 rounded-xl bg-white border border-[#4E7A52]/40 text-[#3B5E3E] font-semibold hover:bg-[#E6F0E3] transition"
                      >
                        Xem trên bản đồ
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUserLoc(null);
                          setShowUserOnMap(false);
                          setTimeout(() => inputRef.current?.focus(), 50);
                        }}
                        className="flex-1 px-2 py-1.5 rounded-xl bg-white border border-[#8C6D53]/30 text-[#8C6D53] font-semibold hover:bg-[#FAF0E6] transition"
                      >
                        Sai rồi? Gõ khu vực
                      </button>
                    </div>
                  </div>
                )}

                {/* Form gõ khu vực */}
                <form onSubmit={handleInputSubmit} className="flex gap-1.5">
                  <div className="relative flex-1">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D53]" />
                    <input
                      ref={inputRef}
                      type="text"
                      disabled={isSearching}
                      value={queryArea}
                      onChange={(e) => setQueryArea(e.target.value)}
                      placeholder="Hoặc gõ khu vực (vd: Cầu Giấy, Huế)"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white rounded-xl border border-[#8C6D53]/20 focus:border-[#8C2D19] focus:outline-none placeholder:text-stone-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !queryArea.trim()}
                    className="px-3.5 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E5D8] text-[#8C2D19] border border-[#8C2D19]/30 text-xs font-bold transition disabled:opacity-40 shrink-0"
                  >
                    Tìm
                  </button>
                </form>

                {/* Trạng thái đang tìm (Skeleton) */}
                {isSearching && (
                  <div className="space-y-2 pt-2 animate-in fade-in">
                    <p className="text-xs text-[#8C6D53] font-medium flex items-center gap-1.5 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin text-[#8C2D19]" />
                      {searchSecs}s · AI đang tra Google Maps, thường mất 30–60 giây, bạn đợi chút nhé ☕
                    </p>
                    {[1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white/70 border border-[#8C6D53]/15 rounded-2xl space-y-2 animate-pulse"
                      >
                        <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                        <div className="h-3 bg-stone-100 rounded-md w-full" />
                        <div className="h-3 bg-stone-100 rounded-md w-1/2" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Trạng thái báo lỗi */}
                {!isSearching && searchError && (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-2 animate-in fade-in">
                    <p>{searchError}</p>
                    <button
                      type="button"
                      onClick={() => (lastOptions ? runAiSearch(lastOptions) : handleLocationSearch())}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-900 font-semibold hover:bg-rose-100 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Thử lại</span>
                    </button>
                  </div>
                )}

                {/* Kết quả tìm kiếm AI */}
                {!isSearching && !searchError && hasSearched && aiShops.length === 0 && (
                  <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#8C6D53]/15 text-center text-xs text-[#8C6D53] space-y-1">
                    <p className="font-semibold text-stone-700">Không tìm thấy cửa hàng nào.</p>
                    <p>Thử khu vực rộng hơn hoặc xem tab Gợi ý chọn lọc.</p>
                  </div>
                )}

                {resolvedArea && !isSearching && !searchError && aiShops.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F1F6EF] border border-[#4E7A52]/30 text-xs text-[#3B5E3E] animate-in fade-in">
                    <Search className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Đang tìm quanh: <b className="text-[#2A1E17]">{resolvedArea}</b>
                    </span>
                  </div>
                )}

                {!isSearching && !searchError && aiShops.length > 0 && (
                  <div className="space-y-2 pt-1 animate-in fade-in">
                    {aiShops.map((shop) => (
                      <button
                        key={shop.id}
                        type="button"
                        onClick={() => { setActiveShopId(shop.id); setShowUserOnMap(false); }}
                        className={`w-full text-left rounded-2xl border p-3 transition active:scale-[0.99] ${
                          shop.id === activeShop.id
                            ? 'bg-[#FAF0E6] border-[#8C2D19] shadow-xs ring-1 ring-[#8C2D19]/30'
                            : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/40'
                          }`}
                      >
                        <div className="font-bold text-sm text-[#2A1E17] leading-tight mb-1">
                          {shop.name}
                        </div>
                        {shop.address && (
                          <div className="text-xs text-[#5C4534] leading-snug mb-1">
                            {shop.address}
                          </div>
                        )}
                        {shop.rating !== undefined && (
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] mb-1">
                            <span className="font-semibold text-[#B45309]">
                              ★ {shop.rating.toFixed(1)}
                              {shop.reviews !== undefined && (
                                <span className="font-normal text-[#8C6D53]">
                                  {' '}· {shop.reviews.toLocaleString('vi-VN')} đánh giá trên Google
                                </span>
                              )}
                            </span>
                            {shop.rating >= 4.5 && (shop.reviews ?? 0) >= 100 && (
                              <span className="px-2 py-0.5 rounded-full bg-[#FFF4D6] border border-[#D97706]/40 text-[#92400E] font-semibold">
                                🔥 Được nhiều người đánh giá cao!
                              </span>
                            )}
                          </div>
                        )}
                        {shop.distanceKm !== undefined && (
                          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3B5E3E] bg-[#F1F6EF] border border-[#4E7A52]/30 rounded-full px-2 py-0.5 mb-1">
                            📍 ~
                            {shop.distanceKm < 1
                              ? `${Math.round(shop.distanceKm * 100) * 10} m`
                              : `${shop.distanceKm.toFixed(1).replace('.', ',')} km`}
                            <span className="font-normal text-[#5F7D61]"> · đường chim bay, ước tính</span>
                          </div>
                        )}
                        {shop.aiReason && (
                          <div className="text-[11px] text-[#8C6D53] bg-[#FDFBF7] p-2 rounded-xl border border-[#8C6D53]/10 italic my-1.5">
                            <span className="font-semibold text-[#8C2D19] not-italic">✨ AI gợi ý: </span>
                            {shop.aiReason}
                          </div>
                        )}
                        <span
                          role="link"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(shop.dirUrl || shop.mapsLink, '_blank', 'noopener,noreferrer');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation();
                              window.open(shop.dirUrl || shop.mapsLink, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#7A2A1C] hover:bg-[#8C2D19] text-white text-[12px] font-semibold transition"
                        >
                          🧭 Chỉ đường
                        </span>
                        <span className="block text-center text-[10px] text-[#8C6D53] mt-1">
                          Mở Google Maps để xem quãng đường &amp; thời gian đi thật
                        </span>
                      </button>
                    ))}

                    <div className="text-[10px] text-[#8C6D53] text-center pt-2">
                      Dữ liệu địa điểm: Google Maps
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DƯỚI CÙNG: Nút xem trên Google Maps & Lưu ý */}
          <div className="p-3 bg-[#FDFBF7] border-t border-[#8C6D53]/15 shrink-0 space-y-1.5">
            <a
              href={activeShop.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-[#D97706] text-[#D97706] hover:bg-[#FFF8E7] text-xs font-bold transition shadow-xs"
            >
              <span>Xem trên Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[10px] text-center text-[#8C6D53] leading-tight">
              Thông tin chỉ để tham khảo — hãy kiểm tra lại trên Google Maps trước khi đến
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
