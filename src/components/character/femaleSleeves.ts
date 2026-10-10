import { SkeletonMeasurements } from './figureSkeleton';

const f1 = (n: number) => Math.round(n * 10) / 10;

type SleeveColors = { fill: string; stroke: string; accent: string; dark: string; stripes?: string[] };

/* Tay thụng buông (áo tấc; nhật bình khi cầm quạt/túi). Ống tay rủ thẳng từ vai như cột vải,
   loe nhẹ về đáy; ĐÁY ống tay chính là cửa tay, bàn tay thò ra ở giữa mép dưới.
   Cổ tay (cho renderHands / renderFan / renderBags): W = (cx ± 51, shY + 170). */
export function femaleWideSleevesHang(skel: SkeletonMeasurements, colors: SleeveColors): string {
  const isAoTac = !colors.stripes || colors.stripes.length === 0;
  if (!isAoTac) {
    // Giữ nguyên cho Nhật Bình khi cầm quạt / túi
    const cx = 200, shY = skel.shY, shHalf = skel.shHalf, armpit = skel.armpit;
    const fill = colors.fill, edge = colors.stroke;
    let s = '';
    for (const sg of [-1, 1]) {
      const X = (v: number) => f1(cx + sg * v);
      const d = `M${X(shHalf - 3)},${shY + 5}`
        + ` C${X(shHalf + 8)},${shY + 7} ${X(shHalf + 16)},${shY + 20} ${X(shHalf + 18)},${shY + 40}`
        + ` C${X(shHalf + 21)},${shY + 80} ${X(shHalf + 27)},${shY + 130} ${X(shHalf + 30)},${shY + 167}`
        + ` Q${X(51)},${shY + 178} ${X(30)},${shY + 170}`
        + ` C${X(29)},${shY + 130} ${X(29)},${shY + 80} ${X(shHalf - 12)},${armpit + 4}`
        + ` Q${X(shHalf - 13)},${shY + 10} ${X(shHalf - 3)},${shY + 5} Z`;
      s += `<path d="${d}" fill="${fill}" stroke="${edge}" stroke-width="1.3" stroke-linejoin="round"/>`;
      // bóng dọc mép trong (ống tay nằm trước hông) + nếp vải toả từ bả vai xuống đáy
      s += `<path d="M${X(shHalf - 12)},${armpit + 6} C${X(30)},${shY + 80} ${X(30)},${shY + 130} ${X(31)},${shY + 168} L${X(37)},${shY + 171} C${X(36)},${shY + 130} ${X(35)},${shY + 80} ${X(shHalf - 8)},${armpit + 10} Z" fill="#000" opacity=".1"/>`;
      s += `<path d="M${X(shHalf + 10)},${shY + 30} C${X(shHalf + 16)},${shY + 80} ${X(shHalf + 20)},${shY + 130} ${X(shHalf + 22)},${shY + 168}" fill="none" stroke="${edge}" stroke-width=".9" opacity=".3"/>`;
      s += `<path d="M${X(shHalf + 2)},${shY + 60} C${X(shHalf + 4)},${shY + 100} ${X(shHalf + 6)},${shY + 140} ${X(shHalf + 7)},${shY + 172}" fill="none" stroke="${edge}" stroke-width=".8" opacity=".25"/>`;
      s += cuffBand(X, shY, colors);
    }
    return s;
  }

  return '';
}

/* Viền cửa tay ở đáy ống tay. Áo tấc: 1 dải màu nhấn. Nhật bình: các dải sọc ngang (vòng sọc quanh cửa tay). */
function cuffBand(X: (v: number) => number, shY: number, colors: SleeveColors): string {
  const isNhat = colors.stripes && colors.stripes.length > 1;
  const list = isNhat ? ['#15803D', '#EAB308', '#1D4ED8', '#FFFFFF', '#B91C1C'] : (colors.stripes && colors.stripes.length ? colors.stripes : [colors.accent]);
  const h = isNhat ? 7 : 5;
  // mép dưới cửa tay: từ ngoài (shHalf+30 = 72) cong võng xuống tới trong (30)
  const yAt = (v: number, up: number) => { const t = (72 - v) / 42; return f1(shY + 167 + t * 3 + Math.sin(Math.PI * t) * 5.5 - up); };
  let s = '';
  list.forEach((c, i) => {
    const a = i * h, b = (i + 1) * h;
    let p = `M${X(72.4)},${yAt(72, b)}`;
    for (let k = 1; k <= 8; k++) { const v = 72 - 42 * k / 8; p += ` L${X(v + (k === 8 ? -0.4 : 0))},${yAt(v, b)}`; }
    for (let k = 8; k >= 0; k--) { const v = 72 - 42 * k / 8; p += ` L${X(v + (k === 0 ? 0.4 : k === 8 ? -0.4 : 0))},${yAt(v, a)}`; }
    s += `<path d="${p} Z" fill="${c}"/>`;
  });
  const tot = list.length * h;
  let o = `M${X(72)},${yAt(72, 0)}`;
  for (let k = 1; k <= 8; k++) { const v = 72 - 42 * k / 8; o += ` L${X(v)},${yAt(v, 0)}`; }
  s += `<path d="${o}" fill="none" stroke="${colors.stroke}" stroke-width="1.3" stroke-linecap="round"/>`;
  let t = `M${X(72)},${yAt(72, tot)}`;
  for (let k = 1; k <= 8; k++) { const v = 72 - 42 * k / 8; t += ` L${X(v)},${yAt(v, tot)}`; }
  s += `<path d="${t}" fill="none" stroke="${colors.stroke}" stroke-width=".7" opacity=".6"/>`;
  return s;
}

/* Vẽ SAU bàn tay: bóng cổ tay + vẽ lại viền cửa tay đè lên cổ tay, để bàn tay như thò ra từ trong ống tay. */
export function femaleWideSleevesHangFront(skel: SkeletonMeasurements, colors: SleeveColors): string {
  const isAoTac = !colors.stripes || colors.stripes.length === 0;
  const cx = 200, shY = skel.shY;
  let s = '';
  for (const sg of [-1, 1]) {
    const X = (v: number) => f1(cx + sg * v);
    if (isAoTac) continue; // Áo Tấc dùng femaleAoTacSleeves / femaleAoTacHands
    s += `<ellipse cx="${X(51)}" cy="${shY + 174.5}" rx="7" ry="2.2" fill="${colors.dark}" opacity=".3"/>`;
    s += cuffBand(X, shY, colors);
  }
  return s;
}

export function femaleNhatBinhClasp(
  skel: SkeletonMeasurements,
  colors: SleeveColors,
  skin?: { base: string; line: string }
): string {
  const cx = 200, shY = skel.shY, shHalf = skel.shHalf, armpit = skel.armpit;
  const fill = colors.fill, edge = colors.stroke, dark = colors.dark;
  const sk = skin?.base || '#FDDEC2';
  const ln = skin?.line || '#A66B49';
  const sh = '#E0AA8B';

  let s = '';

  // 0. Tạm thời ẩn quạt để nhân vật giữ tư thế trang nghiêm chắp tay trước bụng
  s += `<style>#fan-prop { display: none !important; }</style>`;

  // 1. Z-INDEX: Render BÀN TAY ĐAN NHAU (clasped hands) TRƯỚC BỤNG (y ~ 224)
  // Hai bàn tay đan vào nhau ở chính giữa bụng/eo, cổ tay chìa sang hai bên (x: 176 đến 224)
  // Ống tay áo sẽ phủ lên che phần cổ tay (x < 185 và x > 215), để lộ ngón tay đan ở giữa
  s += `<g id="nhatbinh-clasped-hands">`;
  // Cổ tay & mu bàn tay trái (đỡ phía dưới)
  s += `<path d="M 180 226 C 186 230 196 233 208 231 C 216 229 222 226 226 222 L 226 216 C 220 219 214 222 206 222 C 196 222 188 219 180 220 Z" fill="${sk}" stroke="${ln}" stroke-width="0.8" stroke-linejoin="round"/>`;

  // Cổ tay & bàn tay phải (úp đan lên trên)
  s += `<path d="M 174 219 C 180 217 188 216 196 216 C 204 216 211 218 218 221 C 220 225 217 229 211 230 C 201 231 189 227 174 225 Z" fill="${sk}" stroke="${ln}" stroke-width="0.8" stroke-linejoin="round"/>`;

  // Bóng đổ giữa hai bàn tay
  s += `<path d="M 188 223 C 196 224 204 225 212 223" stroke="${sh}" stroke-width="1.2" fill="none" opacity="0.6"/>`;

  // Ngón tay búp măng đan nhau
  s += `<path d="M 185 218 C 190 217 195 218 199 220" stroke="${ln}" stroke-width="0.8" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M 192 220 C 198 221 205 222 211 221" stroke="${ln}" stroke-width="0.75" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M 191 223 C 197 224 204 225 210 224" stroke="${ln}" stroke-width="0.75" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M 190 226 C 196 227 203 228 208 227" stroke="${ln}" stroke-width="0.7" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M 191 229 C 196 230 202 231 206 229" stroke="${ln}" stroke-width="0.65" fill="none" stroke-linecap="round"/>`;
  s += `</g>`;

  // 2. Z-INDEX: Render ỐNG TAY ÁO THỤNG & DẢI NGŨ SẮC Ở CỬA TAY
  // Form ống tay THỤNG, RỘNG VÀ RỦ DÀI tương tự Áo Tấc
  // Hai cửa tay nằm ngay sát nhau ở khu vực bụng/eo (y: 206 đến 244)
  // 5 dải màu ngũ sắc (Lục, Hoàng, Thanh, Bạch, Xích) nằm ở viền ống tay, bọc lấy khu vực bàn tay.
  const nguSacColors = ['#15803D', '#EAB308', '#1D4ED8', '#FFFFFF', '#B91C1C'];

  for (const sg of [-1, 1]) {
    const X = (v: number) => f1(cx + sg * v);
    // Cửa tay: mép trong v=15 (ngay sát mép bàn tay cx±15 = 185 / 215)
    // Mép ngoài của dải ngũ sắc: v=55 (rộng 40px, chia 5 dải, mỗi dải 8px)
    const cuffIn = 15;
    const cuffOut = 55;
    const cuffTop = 206;
    const cuffBot = 244;

    // Ống tay thụng rộng và rủ dài tương tự Áo Tấc:
    // Từ vai (shHalf - 2 = 40, shY + 6 = 134), phồng rộng ra ngoài tới 80px,
    // rủ sâu xuống tới hông (y = 276px) tạo thành túi thụng lớn, rồi vòng lên đáy cửa tay (cuffIn, cuffBot = 244)
    const d = `M${X(shHalf - 2)},${shY + 6}`
      + ` C${X(shHalf + 20)},${shY + 20} ${X(shHalf + 38)},${shY + 60} ${X(shHalf + 40)},${shY + 112}`
      + ` C${X(shHalf + 42)},160 ${X(shHalf + 36)},210 ${X(shHalf + 24)},246`
      + ` C${X(shHalf + 10)},272 ${X(36)},276 ${X(cuffIn)},${cuffBot}`
      + ` L${X(cuffIn)},${cuffTop}`
      + ` C${X(24)},180 ${X(32)},160 ${X(shHalf - 12)},${armpit + 4}`
      + ` Q${X(shHalf - 13)},${shY + 10} ${X(shHalf - 2)},${shY + 6} Z`;

    s += `<path d="${d}" fill="${fill}" stroke="${edge}" stroke-width="1.3" stroke-linejoin="round"/>`;

    // Nếp vải rủ và bóng đổ của túi ống tay thụng
    s += `<path d="M${X(shHalf + 34)},160 C${X(shHalf + 34)},200 ${X(shHalf + 24)},240 ${X(shHalf + 8)},262 L${X(shHalf + 12)},265 C${X(shHalf + 28)},242 ${X(shHalf + 38)},200 ${X(shHalf + 38)},160 Z" fill="#000" opacity=".12"/>`;
    s += `<path d="M${X(shHalf + 12)},160 C${X(shHalf + 22)},200 ${X(shHalf + 22)},235 ${X(shHalf + 12)},258" fill="none" stroke="${edge}" stroke-width=".9" opacity=".2"/>`;
    s += `<path d="M${X(34)},264 C${X(shHalf)},272 ${X(shHalf + 16)},266 ${X(shHalf + 24)},252" fill="none" stroke="${edge}" stroke-width=".8" opacity=".25"/>`;

    // Độ sâu lòng ống tay áo tại cửa tay (ngay trước mép cổ tay áo đè lên mép bàn tay)
    s += `<path d="M${X(cuffIn)},${cuffTop} Q${X(cuffIn - 4)},${(cuffTop + cuffBot) / 2} ${X(cuffIn)},${cuffBot} L${X(cuffIn + 3)},${cuffBot} Q${X(cuffIn - 1)},${(cuffTop + cuffBot) / 2} ${X(cuffIn + 3)},${cuffTop} Z" fill="${dark}" opacity=".75"/>`;

    // 5 DẢI MÀU DỌC NGŨ SẮC Ở CỬA TAY (BỌC LẤY KHU VỰC BÀN TAY):
    // Vị trí: Ở cổ tay áo (y: 206 đến 244, x: từ cuffOut=55 về cuffIn=15)
    // Thứ tự từ ngoài vào trong: Lục (ngoài cùng) -> Hoàng -> Thanh -> Bạch -> Xích (mép sát bàn tay)
    // Mỗi dải rộng 8px, cao 38px, bản màu to và rõ ràng
    const numStripes = 5;
    const sWidth = (cuffOut - cuffIn) / numStripes; // 8px

    for (let i = 0; i < numStripes; i++) {
      // i = 0: Lục (v: 55 -> 47)
      // i = 1: Hoàng (v: 47 -> 39)
      // i = 2: Thanh (v: 39 -> 31)
      // i = 3: Bạch (v: 31 -> 23)
      // i = 4: Xích (v: 23 -> 15, sát mép bàn tay)
      const vOuter = cuffOut - i * sWidth;
      const vInner = cuffOut - (i + 1) * sWidth;

      // Độ cong nhẹ theo chiều cổ tay áo
      const curveOuter = Math.sin((i / numStripes) * Math.PI) * 1.5;
      const curveInner = Math.sin(((i + 1) / numStripes) * Math.PI) * 1.5;

      const p = `M${X(vOuter)},${cuffTop - curveOuter}`
        + ` L${X(vInner)},${cuffTop - curveInner}`
        + ` L${X(vInner)},${cuffBot + curveInner}`
        + ` L${X(vOuter)},${cuffBot + curveOuter} Z`;

      s += `<path d="${p}" fill="${nguSacColors[i]}" stroke="#000000" stroke-width="0.5" stroke-opacity="0.2"/>`;
    }

    // Viền trên và dưới của mảng ngũ sắc tại cửa tay
    s += `<path d="M${X(cuffOut)},${cuffTop} L${X(cuffIn)},${cuffTop}" fill="none" stroke="${edge}" stroke-width="1.2" stroke-linecap="round"/>`;
    s += `<path d="M${X(cuffOut)},${cuffBot} L${X(cuffIn)},${cuffBot}" fill="none" stroke="${edge}" stroke-width="1.2" stroke-linecap="round"/>`;

    // Mép ngoài cùng của dải ngũ sắc (ranh giới giữa thân ống tay áo và dải Lục)
    s += `<line x1="${X(cuffOut)}" y1="${cuffTop}" x2="${X(cuffOut)}" y2="${cuffBot}" stroke="${edge}" stroke-width="1.2"/>`;

    // Mép trong cùng của dải ngũ sắc (mép dải Xích đè nhẹ lên gốc bàn tay)
    s += `<line x1="${X(cuffIn)}" y1="${cuffTop}" x2="${X(cuffIn)}" y2="${cuffBot}" stroke="${edge}" stroke-width="1.4" stroke-linecap="round"/>`;
  }

  return s;
}

/* ================= ÁO TẤC (nữ) =================
   Dáng theo ảnh áo tấc thật: tay áo rất rộng, vai xuôi liền thân. Cẳng tay gập ngang trước bụng
   (hoặc giơ lên ngực khi cầm quạt); vải ống tay rủ từ cẳng tay xuống thành túi lớn tới hông/đùi.
   Cửa tay mở ở cổ tay, mép cửa tay chạy dọc xuống đáy ống tay và lộ một dải lót kem.
   Toạ độ khớp lấy từ computeArmPoints (W = cổ tay). */
type TacPose = 'waist' | 'raised';

function aoTacSleeveGeom(pose: TacPose, shHalf: number, shY: number, armpit: number) {
  // v = khoảng cách tới trục giữa (dương = ra ngoài), y tuyệt đối
  if (pose === 'raised') {
    return {
      outline: [
        `M`, [shHalf - 2, shY + 6],
        `C`, [shHalf + 20, shY + 20], [shHalf + 38, shY + 58], [shHalf + 42, shY + 108],
        `C`, [shHalf + 45, shY + 160], [shHalf + 36, shY + 198], [shHalf + 16, shY + 202],
        `C`, [shHalf + 4, shY + 205], [36, shY + 200], [30, shY + 190],
        `L`, [24, shY + 86],
        `C`, [22, shY + 78], [23, shY + 70], [28, shY + 66],
        `C`, [36, shY + 70], [46, shY + 80], [52, shY + 92],
        `C`, [46, shY + 60], [36, shY + 40], [shHalf - 12, armpit + 4],
        `Q`, [shHalf - 13, shY + 10], [shHalf - 2, shY + 6], `Z`,
      ],
      cuffTop: [24, shY + 86] as [number, number],
      cuffBot: [30, shY + 190] as [number, number],
      wristTop: [28, shY + 66] as [number, number],
    };
  }
  return {
    outline: [
      `M`, [shHalf - 2, shY + 6],
      `C`, [shHalf + 20, shY + 20], [shHalf + 38, shY + 60], [shHalf + 40, shY + 112],
      `C`, [shHalf + 42, shY + 148], [shHalf + 34, shY + 182], [shHalf + 14, shY + 186],
      `C`, [shHalf - 2, shY + 189], [26, shY + 184], [18, shY + 174],
      `L`, [14, shY + 108],
      `C`, [13, shY + 100], [14, shY + 92], [18, shY + 88],
      `C`, [28, shY + 84], [40, shY + 84], [46, shY + 76],
      `C`, [40, shY + 52], [32, shY + 37], [shHalf - 12, armpit + 4],
      `Q`, [shHalf - 13, shY + 10], [shHalf - 2, shY + 6], `Z`,
    ],
    cuffTop: [14, shY + 108] as [number, number],
    cuffBot: [18, shY + 174] as [number, number],
    wristTop: [18, shY + 88] as [number, number],
  };
}

export function femaleAoTacSleeves(skel: SkeletonMeasurements, colors: SleeveColors, rightRaised: boolean): string {
  const cx = 200, shY = skel.shY, shHalf = skel.shHalf, armpit = skel.armpit;
  const edge = colors.stroke, lining = '#F5EFE3', liningEdge = '#D5CCBE';
  let s = '';
  for (const sg of [-1, 1]) {
    const X = (v: number) => f1(cx + sg * v);
    const pose: TacPose = sg === -1 && rightRaised ? 'raised' : 'waist';
    const g = aoTacSleeveGeom(pose, shHalf, shY, armpit);
    let d = '';
    for (const t of g.outline) d += typeof t === 'string' ? ` ${t}` : ` ${X(t[0])},${t[1]}`;
    s += `<path d="${d.trim()}" fill="${colors.fill}" stroke="${edge}" stroke-width="1.3" stroke-linejoin="round"/>`;
    const [tv, ty] = g.cuffTop, [bv, by] = g.cuffBot;
    // bóng đáy túi vải
    s += `<path d="M${X(bv)},${by} C${X(bv + 10)},${by + 9} ${X(bv + 26)},${by + 13} ${X(bv + 40)},${by + 11} L${X(bv + 40)},${by + 7} C${X(bv + 26)},${by + 8} ${X(bv + 12)},${by + 4} ${X(bv + 4)},${by - 4} Z" fill="#000" opacity=".12"/>`;
    s += `<path d="M${X(shHalf + 34)},${shY + 112} C${X(shHalf + 34)},${shY + 156} ${X(shHalf + 26)},${shY + 180} ${X(shHalf + 12)},${shY + 184} L${X(shHalf + 14)},${shY + 186} C${X(shHalf + 34)},${shY + 182} ${X(shHalf + 42)},${shY + 148} ${X(shHalf + 40)},${shY + 112} Z" fill="#000" opacity=".1"/>`;
    // nếp vải rủ từ cẳng tay xuống
    s += `<path d="M${X(tv + 18)},${ty + 4} C${X(tv + 22)},${ty + 40} ${X(tv + 24)},${by - 30} ${X(bv + 20)},${by + 4}" fill="none" stroke="${edge}" stroke-width=".9" opacity=".22"/>`;
    s += `<path d="M${X(shHalf + 12)},${shY + 36} C${X(shHalf + 26)},${shY + 90} ${X(shHalf + 28)},${shY + 140} ${X(shHalf + 20)},${shY + 180}" fill="none" stroke="${edge}" stroke-width=".9" opacity=".2"/>`;
    // dải lót kem dọc mép cửa tay (từ cổ tay xuống đáy ống tay)
    s += `<path d="M${X(tv)},${ty} L${X(bv)},${by} L${X(bv + 7)},${by + 2} L${X(tv + 7)},${ty + 2} Z" fill="${lining}" stroke="${liningEdge}" stroke-width=".7" stroke-linejoin="round"/>`;
    s += `<path d="M${X(tv)},${ty} L${X(bv)},${by}" stroke="${edge}" stroke-width="1.2" stroke-linecap="round"/>`;
    // lòng tay áo tối ngay cửa tay (nơi cổ tay thò ra)
    const [wv, wy] = g.wristTop;
    s += `<path d="M${X(wv)},${wy} C${X(wv - 6)},${wy + 6} ${X(tv - 2)},${ty - 8} ${X(tv)},${ty} L${X(tv + 7)},${ty + 2} C${X(tv + 4)},${ty - 8} ${X(wv + 2)},${wy + 8} ${X(wv + 8)},${wy + 2} Z" fill="${colors.dark}" opacity=".75"/>`;
  }
  return s;
}

/* Bàn tay áo tấc (vẽ SAU tay áo và quạt): kiểu bàn tay phẳng tối giản giống các trang phục khác.
   Hai bàn tay đặt ngang trước bụng, tay phải chồng lên tay trái. Cầm quạt: tư thế tay giữ nguyên, cán quạt kẹp dưới bàn tay phải. */
export function femaleAoTacHands(
  skel: SkeletonMeasurements,
  skin: { base: string; line: string },
  _hasFan: boolean
): string {
  const cx = 200, shY = skel.shY;
  const sk = skin.base, ln = skin.line, sc = 1.32;
  // hai bàn tay đặt ngang trước bụng: tay trái ở dưới, tay phải chồng lên trên (mu bàn tay hướng ra ngoài)
  const flatHand = (x: number, y: number, rot: number, flip: number) =>
    `<g transform="translate(${x}, ${y}) rotate(${rot}) scale(${flip * sc}, ${sc})">`
    + `<path d="M -3.5 0 C -4.2 6 -4.8 14 -4.2 20 C -3.8 24.5 -2.5 28.5 -0.8 28.5 C 1.2 28.5 2.5 25.5 2.8 22 C 3.2 18 3.2 15 2.8 14 C 4.2 13.5 5.8 11.5 5.8 8 C 5.8 4.5 4.5 2 3.5 0 Z" fill="${sk}" stroke="${ln}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<path d="M 2.8 14 C 2.2 10 2.2 6 3.0 2" stroke="${ln}" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.6"/>`
    + `</g>`;
  let s = '';
  // tay trái (bên phải hình), ngón hướng vào giữa
  s += flatHand(cx + 17, shY + 100, 82, -1);
  // tay phải (bên trái hình) đặt chồng lên tay trái; khi cầm quạt, cán quạt kẹp dưới bàn tay này
  s += flatHand(cx - 17, shY + 96, -82, 1);
  return s;
}
