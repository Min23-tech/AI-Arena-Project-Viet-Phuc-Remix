import { SkeletonMeasurements } from './figureSkeleton';

const f1 = (n: number) => Math.round(n * 10) / 10;

/* Áo tứ thân quan họ: dải áo lót xanh chéo trước ngực (vẽ SAU yếm, TRƯỚC hai vạt áo) */
export function tuThanLapel(skel: SkeletonMeasurements): string {
  const cx = 200, shY = skel.shY, wY = skel.waistY;
  const G = '#3FAE52', GD = '#2A7F3A';
  const d = `M${cx + 3},${shY + 3} L${cx + 12},${shY + 5} C${cx + 8},${shY + 40} ${cx - 2},${wY - 40} ${cx - 5},${wY - 3} L${cx - 15},${wY - 5} C${cx - 11},${wY - 44} ${cx - 3},${shY + 38} ${cx + 3},${shY + 3} Z`;
  return `<path d="${d}" fill="${G}" stroke="${GD}" stroke-width=".8" stroke-linejoin="round"/>`
    + `<path d="M${cx + 9},${shY + 8} C${cx + 5},${shY + 42} ${cx - 3},${wY - 40} ${cx - 7},${wY - 6}" fill="none" stroke="#6FCB7D" stroke-width=".8" opacity=".7"/>`
    // ánh sáng từ trên-trái: vạt trái đổ một mảng bóng cứng lên yếm và dải áo lót
    + `<path d="M${cx - 9.5},${shY + 6} C${cx - 10.5},${shY + 37} ${cx - 12.5},${wY - 27} ${cx - 14},${wY} L${cx - 7},${wY} C${cx - 5.5},${wY - 27} ${cx - 3},${shY + 37} ${cx - 2},${shY + 8} Z" fill="#000" opacity=".28"/>`
    // cằm đổ bóng xuống cổ (lệch nhẹ sang phải)
    + `<path d="M${cx - skel.neckHalf},${skel.chin - 2} Q${cx + 2},${skel.chin + 12} ${cx + skel.neckHalf},${skel.chin - 2} Z" fill="#7A4A32" opacity=".22"/>`;
}

/* Hai vạt trước áo tứ thân: vải rủ thẳng theo trọng lực, gấu phẳng hơi xòe có góc nhọn, vài nếp gấp dọc
   (thay cho 2 path smooth() khép kín bị tròn đáy) */
export function tuThanPanels(skel: SkeletonMeasurements, fit: { chest: number; waist: number; hip: number; hem: number }, hemY: number, fill: string, stroke: string, uid: string): string {
  const cx = 200, shY = skel.shY, ap = skel.armpit, wY = skel.waistY, hY = skel.hipY;
  const nx = skel.neckHalf + 2, shx = skel.shHalf - 4, apx = skel.shHalf - 9;
  let s = '';
  for (const sg of [-1, 1]) {
    const X = (v: number) => f1(cx + sg * v);
    const d = `M${X(nx)},${shY - 8}`
      + ` C${X(nx + 13)},${shY - 5} ${X(shx + 2)},${shY - 1} ${X(shx + 2)},${shY + skel.shDrop}`
      + ` C${X(shx + 3)},${shY + 14} ${X(apx + 1)},${ap - 4} ${X(apx)},${ap + 2}`
      + ` C${X(fit.chest + 1)},${ap + 16} ${X(fit.waist - 1)},${wY - 30} ${X(fit.waist)},${wY}`
      + ` C${X(fit.waist + 1)},${wY + 18} ${X(fit.hip)},${hY - 16} ${X(fit.hip)},${hY}`
      + ` C${X(fit.hip + 1)},${hY + 60} ${X(fit.hem + 1)},${hemY - 80} ${X(fit.hem + 2)},${hemY}`
      + ` Q${X(fit.hem - 10)},${hemY + 5} ${X(fit.hem - 20)},${hemY + 2}`
      + ` Q${X(26)},${hemY - 1} ${X(16)},${hemY + 2}`
      + ` C${X(15.5)},${hemY - 80} ${X(14.5)},${wY + 60} ${X(14)},${wY}`
      + ` C${X(13)},${wY - 40} ${X(10)},${shY + 30} ${X(9)},${shY} Z`;
    s += `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="1" stroke-linejoin="round"/>`;
    // đổ bóng mảng theo nguồn sáng trên-trái: mép trái mỗi vạt sáng, mép phải tối (cắt theo đúng hình vạt)
    const cid = `${uid}-tt${sg < 0 ? 'L' : 'R'}`;
    const outer = `M${X(apx - 3)},${ap + 10} C${X(fit.chest - 4)},${ap + 16} ${X(fit.waist - 6)},${wY - 30} ${X(fit.waist - 6)},${wY} C${X(fit.waist - 5)},${wY + 18} ${X(fit.hip - 7)},${hY - 16} ${X(fit.hip - 7)},${hY} C${X(fit.hip - 7)},${hY + 60} ${X(fit.hem - 6)},${hemY - 80} ${X(fit.hem - 6)},${hemY + 10} L${X(fit.hem + 30)},${hemY + 10} L${X(fit.hem + 30)},${shY - 20} L${X(apx - 3)},${shY - 20} Z`;
    const inner = `M${X(14)},${shY - 20} C${X(15)},${shY + 30} ${X(18)},${wY - 40} ${X(19)},${wY} C${X(19.5)},${wY + 60} ${X(20.5)},${hemY - 80} ${X(21)},${hemY + 10} L${X(-5)},${hemY + 10} L${X(-5)},${shY - 20} Z`;
    const hi = sg < 0 ? outer : inner, lo = sg < 0 ? inner : outer;
    s += `<clipPath id="${cid}"><path d="${d}"/></clipPath><g clip-path="url(#${cid})"><path d="${hi}" fill="#fff" opacity=".1"/><path d="${lo}" fill="#000" opacity=".32"/></g>`;
    // nếp gấp dọc do vải rủ (tối) + mép sáng nhẹ
    s += `<path d="M${X(27)},${wY + 14} C${X(29)},${wY + 90} ${X(30)},${hemY - 90} ${X(31)},${hemY - 2}" fill="none" stroke="#000" stroke-width="1.1" opacity=".3" stroke-linecap="round"/>`;
    s += `<path d="M${X(fit.hip - 8)},${hY + 20} C${X(fit.hip - 7)},${hY + 90} ${X(fit.hem - 8)},${hemY - 70} ${X(fit.hem - 7)},${hemY - 4}" fill="none" stroke="#000" stroke-width="1" opacity=".25" stroke-linecap="round"/>`;
    s += `<path d="M${X(21)},${wY + 30} C${X(21.5)},${wY + 100} ${X(22)},${hemY - 80} ${X(22.5)},${hemY - 6}" fill="none" stroke="#fff" stroke-width=".8" opacity=".09" stroke-linecap="round"/>`;
  }
  return s;
}

/* Thắt lưng quan họ: dải lụa xanh quấn eo, thắt nút lệch trái có nơ, hai dải hồng + xanh buông rủ theo trọng lực có tua */
export function tuThanSash(skel: SkeletonMeasurements, waistFit: number): string {
  const cx = 200, wY = skel.waistY;
  const G = '#3FAE52', GD = '#2A7F3A', P = '#E23C7E', PD = '#A8245A';
  const L = cx - waistFit - 2, R = cx + waistFit + 2;
  let s = '';
  const kx = cx - 8, ky = wY + 7;
  const pinkTail = `M${kx - 5},${ky} C${kx - 10},${ky + 45} ${kx - 2},${ky + 95} ${kx - 10},${ky + 148} L${kx + 2},${ky + 153} C${kx + 6},${ky + 95} ${kx - 1},${ky + 45} ${kx + 3},${ky} Z`;
  const greenTail = `M${kx + 2},${ky} C${kx + 6},${ky + 60} ${kx + 14},${ky + 115} ${kx + 9},${ky + 170} L${kx + 22},${ky + 174} C${kx + 24},${ky + 115} ${kx + 15},${ky + 60} ${kx + 11},${ky} Z`;
  // bóng đổ (nguồn sáng trên-trái → bóng lệch xuống-phải): dưới bản thắt lưng và sau hai dải buông
  s += `<path d="M${L},${wY + 6} Q${cx},${wY + 12} ${R},${wY + 6} L${R},${wY + 10} Q${cx},${wY + 16} ${L},${wY + 10} Z" fill="#000" opacity=".3"/>`;
  s += `<g transform="translate(3,2)" opacity=".3"><path d="${pinkTail}" fill="#000"/><path d="${greenTail}" fill="#000"/></g>`;
  // dải xanh quấn quanh eo, cong theo thân
  s += `<path d="M${L},${wY - 5} Q${cx},${wY + 1} ${R},${wY - 5} L${R},${wY + 5} Q${cx},${wY + 11} ${L},${wY + 5} Z" fill="${G}" stroke="${GD}" stroke-width=".8"/>`;
  s += `<path d="M${L + 2},${wY - 1} Q${cx},${wY + 5} ${R - 2},${wY - 1}" fill="none" stroke="${GD}" stroke-width=".7" opacity=".5"/>`;
  // dải hồng mảnh quấn đè lên, lệch xuống
  s += `<path d="M${L},${wY + 2} Q${cx},${wY + 8} ${R},${wY + 2} L${R},${wY + 6} Q${cx},${wY + 12} ${L},${wY + 6} Z" fill="${P}" stroke="${PD}" stroke-width=".6"/>`;
  // nếp nhăn trên dải lụa, tỏa ra từ nút thắt
  s += `<path d="M${kx - 7},${ky - 6} Q${kx - 17},${ky - 9} ${kx - 27},${ky - 8} M${kx - 7},${ky + 1} Q${kx - 16},${ky + 1} ${kx - 24},${ky + 3} M${kx + 7},${ky - 6} Q${kx + 17},${ky - 9} ${kx + 27},${ky - 7} M${kx + 7},${ky + 1} Q${kx + 15},${ky + 2} ${kx + 23},${ky + 4}" fill="none" stroke="#000" stroke-width=".7" opacity=".22"/>`;
  // dải hồng buông: lượn chữ S nhẹ, đầu dải cắt xéo
  s += `<path d="${pinkTail}" fill="${P}" stroke="${PD}" stroke-width=".7" stroke-linejoin="round"/>`;
  s += `<path d="M${kx - 1},${ky + 8} C${kx - 5},${ky + 50} ${kx + 1},${ky + 100} ${kx - 4},${ky + 149}" fill="none" stroke="${PD}" stroke-width=".8" opacity=".55"/>`;
  // dải xanh buông: dài hơn, rủ lệch sang phải rồi chùng lại
  s += `<path d="${greenTail}" fill="${G}" stroke="${GD}" stroke-width=".7" stroke-linejoin="round"/>`;
  s += `<path d="M${kx + 7},${ky + 10} C${kx + 10},${ky + 60} ${kx + 18},${ky + 115} ${kx + 15},${ky + 171}" fill="none" stroke="${GD}" stroke-width=".8" opacity=".55"/>`;
  // tua theo mép cắt xéo
  let fr = '';
  for (let i = 0; i <= 5; i++) { const t = i / 5, x = kx - 10 + 12 * t, y = ky + 148 + 5 * t; fr += `M${f1(x)},${f1(y)} L${f1(x - 1 + t)},${f1(y + 11)} `; }
  s += `<path d="${fr}" stroke="${P}" stroke-width=".9" stroke-linecap="round"/>`;
  fr = '';
  for (let i = 0; i <= 5; i++) { const t = i / 5, x = kx + 9 + 13 * t, y = ky + 170 + 4 * t; fr += `M${f1(x)},${f1(y)} L${f1(x - 1 + t * 1.5)},${f1(y + 13)} `; }
  s += `<path d="${fr}" stroke="${G}" stroke-width=".9" stroke-linecap="round"/>`;
  // nút thắt + nơ, có nếp gấp trong hai tai nơ
  s += `<path d="M${kx},${ky - 2} C${kx - 14},${ky - 14} ${kx - 22},${ky - 2} ${kx - 12},${ky + 8} Z" fill="${P}" stroke="${PD}" stroke-width=".7"/>`;
  s += `<path d="M${kx - 3},${ky - 2} Q${kx - 10},${ky - 7} ${kx - 16},${ky - 4} M${kx - 3},${ky + 1} Q${kx - 9},${ky + 2} ${kx - 13},${ky + 5}" fill="none" stroke="${PD}" stroke-width=".6" opacity=".7"/>`;
  s += `<path d="M${kx},${ky - 2} C${kx + 9},${ky - 13} ${kx + 17},${ky - 4} ${kx + 9},${ky + 6} Z" fill="${G}" stroke="${GD}" stroke-width=".7"/>`;
  s += `<path d="M${kx + 3},${ky - 2} Q${kx + 8},${ky - 7} ${kx + 12},${ky - 4}" fill="none" stroke="${GD}" stroke-width=".6" opacity=".7"/>`;
  s += `<ellipse cx="${kx}" cy="${ky}" rx="4" ry="4.6" fill="${P}" stroke="${PD}" stroke-width=".7"/>`;
  s += `<path d="M${kx - 2},${ky - 3} Q${kx},${ky} ${kx - 1.5},${ky + 3}" fill="none" stroke="${PD}" stroke-width=".6" opacity=".7"/>`;
  return s;
}
