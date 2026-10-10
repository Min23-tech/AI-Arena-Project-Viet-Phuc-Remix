import React, { useId } from 'react';
import { adjustHex } from './character/figureMath';
import {
  FEMALE_SKELETON,
  MALE_SKELETON,
  COSTUME_SPECS,
  computeArmPoints,
} from './character/figureSkeleton';
import {
  GarmentColors,
  renderBackHair,
  renderPantsOrSkirt,
  renderNeckAndCollarSkin,
  renderTorsoGarment,
  renderSleeves,
} from './character/figureGarments';
import { femaleHeadBack, femaleHead } from './character/femaleHead';
import {
  femaleWideSleevesHang,
  femaleWideSleevesHangFront,
  femaleNhatBinhClasp,
  femaleAoTacSleeves,
  femaleAoTacHands,
} from './character/femaleSleeves';
import {
  renderJewelry,
  renderHeadAndFace,
  renderHeadwear,
  renderFan,
  renderHands,
  renderBags,
  renderFootwear,
  renderZoneAnnotations,
} from './character/figureHeadAccs';

/* =====================================================================
   NHÂN VẬT KIỂU PHẲNG (flat)
   - Đầu tròn, mắt chấm, tay tròn, khối áo phẳng có ánh lụa nhẹ.
   - Vẽ trong hệ toạ độ 320 x 560, rồi dời vào khung 400 x 580 của app.
   - Trả về chuỗi SVG (không có thẻ <svg> ngoài cùng) để CharacterFigure dùng như cũ.
   ===================================================================== */

export interface FlatFigureOptions {
  gender: 'female' | 'male';
  costumeId: string;
  palette: { primary: string; secondary: string; accent: string };
  accessoryIds: string[];
  hairId?: string;
  zone: 'none' | 'vung_loi' | 'vung_remix';
  uid: string;
}

const HAIR = '#1F1714';
const INK = '#1C1C1E';
const IVORY = '#F7F3E8';
const STRAW = '#E3C98A';
const STRAW_DARK = '#B8964F';
const PANTS = '#F3EEE2';
const SKIN = '#F3D3B8';

type GarmentKind = 'ao-dai' | 'ao-ngu-than' | 'ao-tu-than' | 'ao-nhat-binh' | 'ao-tac' | 'ao-giao-linh';

const GARMENT_OF: Record<string, GarmentKind> = {
  ao_dai_tan_thoi: 'ao-dai',
  ngu_than: 'ao-ngu-than',
  ngu_than_nam: 'ao-ngu-than',
  ao_tu_than: 'ao-tu-than',
  ao_nhat_binh: 'ao-nhat-binh',
  ao_tac: 'ao-tac',
  ao_giao_linh: 'ao-giao-linh',
};

const n = (v: number) => Math.round(v * 10) / 10;

export function renderFlatFigure(opts: FlatFigureOptions): string {
  const { gender, costumeId, palette, accessoryIds, hairId, zone, uid } = opts;
  const has = (id: string) => accessoryIds.includes(id);
  const id = (name: string) => `${name}-${uid}`;
  const colors = palette;
  const skin = SKIN;
  const kind: GarmentKind = GARMENT_OF[costumeId] ?? 'ao-dai';
  const cx = 160;
  const nam = gender === 'male';
  const sw = nam ? 54 : 40; // nửa bề ngang vai (nam vai rộng săn chắc, nữ thon vai xuôi)
  const ww = nam ? 37 : 32; // nửa bề ngang eo (nam eo gọn → dáng chữ V)
  const hw = nam ? 44 : 42; // nửa bề ngang hông
  const dark = shade(colors.primary, -0.28);

  // ---------- Tư thế ----------
  // 'front': áo tay thụng (tấc, nhật bình, giao lĩnh) — hai cẳng tay khoanh trước bụng, ống tay buông thành mảng lớn
  // 'hang' : áo tay chẽn — tay buông; cầm quạt thì gập tay phải hình đưa quạt lên trước ngực
  const wide = kind === 'ao-tac' || kind === 'ao-nhat-binh' || kind === 'ao-giao-linh';
  const hasFanG = has('quat_giay');
  const hasFanT = has('quat_thu_phap');
  const hasFan = hasFanG || hasFanT;
  const bentArm = !wide && hasFan;
  const handL = wide ? { x: cx - 5, y: 249 } : { x: cx - sw - 19, y: 308 };
  const handR = wide ? { x: cx + 5, y: 246 } : bentArm ? { x: cx + 12, y: 224 } : { x: cx + sw + 19, y: 308 };

  // Đồ đội đầu che búi tóc / trâm
  const headCovered = ['non_la', 'khan_van', 'khan_dong', 'man_doi_dau', 'beret_hat'].some(has);

  // Kiểu tóc
  const hair: 'dai' | 'dai-vai' | 'bui' | 'ngan' | 'bui-nam' | 'mai-phay' | 're-ngoi' | 'cua' =
    hairId === 'hair_male_comma' ? 'mai-phay'
    : hairId === 'hair_male_curtain' ? 're-ngoi'
    : hairId === 'hair_male_crew' ? 'cua'
    :
    hairId === 'hair_female_long_side' ? 'dai-vai'
    : hairId === 'hair_female_bun' ? 'bui'
    : hairId === 'hair_male_topknot' ? 'bui-nam'
    : hairId === 'hair_male_short' ? 'ngan'
    : hairId === 'hair_female_long' ? 'dai'
    : nam ? 'ngan' : 'dai';

  // ---------- Phần dưới ----------
  let bottom = '';
  if (kind === 'ao-tu-than') {
    // Váy đụp sẫm dáng chữ A dài tới mắt cá, vài nếp mờ (không viền ngang)
    const c = shade(colors.primary, -0.42); // váy đụp tông trầm cùng họ màu áo
    bottom += `<path d="M${cx - ww - 6} 244 C${cx - hw - 6} 330 ${cx - hw - 12} 430 ${cx - hw - 14} 512 Q${cx} 518 ${cx + hw + 14} 512 C${cx + hw + 12} 430 ${cx + hw + 6} 330 ${cx + ww + 6} 244 Z" fill="${c}"/>`;
    bottom += `<path d="M${cx - 14} 260 C${cx - 18} 360 ${cx - 22} 440 ${cx - 24} 510 M${cx + 16} 262 C${cx + 20} 360 ${cx + 24} 440 ${cx + 28} 510" stroke="#fff" stroke-opacity="0.06" stroke-width="3" fill="none"/>`;
  } else {
    // quần lụa ống rộng: một khối liền (không hở khe giữa hai ống), đường may giữa thật mờ
    // ống quần bắt đầu hẹp, nằm khuất trong thân áo, loe dần ra chỉ lộ dưới gấu áo (không lòi hai mảng trắng hai bên hông)
    bottom += `<path d="M${cx - 22} 262 C${cx - 25} 340 ${cx - hw - 4} 430 ${cx - hw - 12} 516 L${cx + hw + 12} 516 C${cx + hw + 4} 430 ${cx + 25} 340 ${cx + 22} 262 Z" fill="${PANTS}"/>`;
    bottom += `<path d="M${cx} 300 L${cx} 514" stroke="#000" stroke-opacity="0.07" stroke-width="1.2"/>`;
  }

  // ---------- Giày dép ----------
  const pair = (render: (x: number) => string) => render(cx - 24) + render(cx + 24);
  let feet = '';
  if (has('guoc_moc_nam') || has('guoc_moc')) {
    // guốc mộc nam: đế gỗ mộc dày có vân, quai da nâu bản to, lộ ngón chân
    feet = pair((x) =>
      `<path d="M${x - 15} 526 L${x + 15} 526 L${x + 15} 534 Q${x} 536 ${x - 15} 534 Z" fill="#B98552"/>`
      + `<path d="M${x - 15} 526 L${x + 15} 526" stroke="#8E6036" stroke-width="1"/>`
      + `<path d="M${x - 11} 530 Q${x} 528.5 ${x + 11} 530.5" stroke="#9C6B3E" stroke-width="0.8" fill="none" opacity="0.7"/>`
      + `<ellipse cx="${x}" cy="522" rx="12.5" ry="5" fill="${skin}"/>`
      + `<path d="M${x - 5} 525.5 L${x - 5} 524 M${x} 526 L${x} 524.2 M${x + 5} 525.5 L${x + 5} 524" stroke="${shade(skin, -0.2)}" stroke-width="0.7"/>`
      + `<path d="M${x - 12} 524 Q${x} 513 ${x + 12} 524 L${x + 10} 525 Q${x} 517 ${x - 10} 525 Z" fill="#5A3A26"/>`);
  } else if (has('hai_theu')) {
    // hài thêu: mũi kín, đầu mũi cong vểnh lên ở giữa, thêu hoa chỉ vàng
    const hc = shade(colors.primary, -0.12);
    feet = pair((x) =>
      `<path d="M${x - 14} 532 Q${x - 15} 519 ${x - 4} 517 Q${x} 513.5 ${x + 4} 517 Q${x + 15} 519 ${x + 14} 532 Z" fill="${hc}"/>`
      + `<path d="M${x - 2.5} 517 Q${x} 510.5 ${x + 2.5} 517" fill="${hc}" stroke="${shade(hc, -0.3)}" stroke-width="0.8"/>`
      + `<rect x="${x - 15}" y="530.5" width="30" height="3" rx="1.4" fill="#2E2422"/>`
      + `<path d="M${x - 10} 528 Q${x} 525 ${x + 10} 528" stroke="#E2B85C" stroke-width="0.9" fill="none"/>`
      + `<circle cx="${x}" cy="522.5" r="2.2" fill="#E2B85C"/><circle cx="${x - 3.6}" cy="523.5" r="1.2" fill="#E2B85C"/><circle cx="${x + 3.6}" cy="523.5" r="1.2" fill="#E2B85C"/>`);
  } else if (has('guoc_moc_nu')) {
    // guốc mộc nữ: đế gỗ sơn son, vẽ hoa nhỏ, quai nhung đen
    feet = pair((x) =>
      `<ellipse cx="${x}" cy="521" rx="12.5" ry="5" fill="${skin}"/>`
      + `<path d="M${x - 15} 525 L${x + 15} 525 L${x + 13} 535 L${x - 13} 535 Z" fill="#A4372B"/>`
      + `<path d="M${x - 15} 525 L${x + 15} 525" stroke="#7A2219" stroke-width="1"/>`
      + `<circle cx="${x - 7}" cy="530" r="1.6" fill="#F2C66D"/><circle cx="${x}" cy="530.5" r="1.6" fill="#F2C66D"/><circle cx="${x + 7}" cy="530" r="1.6" fill="#F2C66D"/>`
      + `<path d="M${x - 10} 522 Q${x} 513 ${x + 10} 522" stroke="#1F1A1A" stroke-width="4.5" fill="none" stroke-linecap="round"/>`);
  } else if (has('hai_cuom')) {
    // hài cườm: mũi kín đế thấp, mặt đính hạt cườm nhiều màu
    feet = pair((x) =>
      `<path d="M${x - 14} 531 Q${x - 14} 516 ${x} 516 Q${x + 14} 516 ${x + 14} 531 Z" fill="${shade(colors.primary, -0.15)}"/>`
      + `<rect x="${x - 15}" y="529" width="30" height="3.5" rx="1.5" fill="#3A2E2A"/>`
      + [[-8, 527], [-4, 523], [0, 520.5], [4, 523], [8, 527], [-3, 527.5], [3, 527.5], [0, 524.5]].map(([dx, y], i) =>
        `<circle cx="${x + dx}" cy="${y}" r="1.3" fill="${['#F2C66D', '#FFFFFF', '#E86A7E', '#7FC8B5'][i % 4]}"/>`).join(''));
  } else if (has('giay_bup_be')) {
    // giày búp bê: bệt, mũi tròn, nơ nhỏ
    feet = pair((x) =>
      `<ellipse cx="${x}" cy="520" rx="12" ry="4.5" fill="${skin}"/>`
      + `<path d="M${x - 14} 531 Q${x - 15} 522 ${x - 10} 521 Q${x} 525 ${x + 10} 521 Q${x + 15} 522 ${x + 14} 531 Z" fill="#2B2528"/>`
      + `<rect x="${x - 15}" y="530" width="30" height="2.5" rx="1.2" fill="#1A1517"/>`
      + `<path d="M${x - 4} 522 L${x} 524 L${x + 4} 522 L${x + 4} 526 L${x} 524 L${x - 4} 526 Z" fill="${colors.accent}"/>`);
  } else if (has('cao_got_quai')) {
    // cao gót quai mảnh: lộ mu bàn chân, quai ngón + quai cổ chân mảnh, đế mảnh nhô gót nhọn
    const st = shade(colors.accent, -0.25);
    feet = pair((x) =>
      `<rect x="${x - 2}" y="527" width="4" height="9" rx="1" fill="${shade(st, -0.2)}"/>`
      + `<ellipse cx="${x}" cy="521.5" rx="11.5" ry="5.5" fill="${skin}"/>`
      + `<path d="M${x - 11} 525.5 Q${x} 530 ${x + 11} 525.5 L${x + 12} 528 Q${x} 532.5 ${x - 12} 528 Z" fill="${st}"/>`
      + `<path d="M${x - 10} 524 Q${x} 519.5 ${x + 10} 524" stroke="${st}" stroke-width="1.6" fill="none"/>`
      + `<path d="M${x - 9} 517.5 Q${x} 515 ${x + 9} 517.5" stroke="${st}" stroke-width="1.3" fill="none"/>`);
  } else if (has('dep_to_ong')) {
    // dép tổ ong: nhựa trắng ngà liền khối, quai đầy lỗ, đế dày
    feet = pair((x) =>
      `<ellipse cx="${x}" cy="521" rx="12.5" ry="5" fill="${skin}"/>`
      + `<path d="M${x - 14} 529 Q${x - 15} 518 ${x} 517 Q${x + 15} 518 ${x + 14} 529 Z" fill="#F1EBDD" stroke="#CFC6B2" stroke-width="0.8"/>`
      + [[-6, 521], [0, 520.2], [6, 521], [-3, 524.5], [3, 524.5]].map(([dx, y]) =>
        `<path d="M${x + dx - 1.6} ${y} l0.8 -1.3 h1.6 l0.8 1.3 l-0.8 1.3 h-1.6 Z" fill="#D9D0BC"/>`).join('')
      + `<rect x="${x - 16}" y="528.5" width="32" height="5" rx="2" fill="#E3DBC8" stroke="#CFC6B2" stroke-width="0.8"/>`);
  } else if (has('dep_suc')) {
    // dép sục nhựa (kiểu Crocs): mũi tròn bầu, đế dày, nhiều lỗ thoáng trên mũi, quai gót
    const dc = '#3B3638';
    feet = pair((x) =>
      `<path d="M${x - 14} 520 Q${x} 511 ${x + 14} 520" stroke="${shade(dc, 0.15)}" stroke-width="2.4" fill="none"/>`
      + `<path d="M${x - 15} 531 Q${x - 16} 517 ${x} 516 Q${x + 16} 517 ${x + 15} 531 Z" fill="${dc}" stroke="${shade(dc, -0.15)}" stroke-width="0.8"/>`
      + [[-8, 521.5], [-4, 520.5], [0, 520.2], [4, 520.5], [8, 521.5]].map(([dx, y]) =>
        `<circle cx="${x + dx}" cy="${y}" r="1.1" fill="${shade(dc, 0.3)}"/>`).join('')
      + `<rect x="${x - 16}" y="528.5" width="32" height="6" rx="2.5" fill="${shade(dc, 0.12)}" stroke="${shade(dc, -0.15)}" stroke-width="0.8"/>`
      + `<circle cx="${x - 14}" cy="521" r="1.6" fill="${shade(dc, 0.4)}"/><circle cx="${x + 14}" cy="521" r="1.6" fill="${shade(dc, 0.4)}"/>`);
  } else if (has('giay_tay_nam')) {
    // giày Tây (Oxford) đen: thân da bóng bọc kín, mũi thuôn tròn, đường may ngang mũi (cap-toe),
    // dây buộc mảnh trên mu, đế mỏng sẫm hơn
    feet = pair((x) =>
      `<rect x="${x - 15}" y="530.5" width="30" height="3.6" rx="1.2" fill="#121214"/>`
      + `<path d="M${x - 14} 531 Q${x - 15} 519 ${x - 7} 516.5 L${x + 7} 516.5 Q${x + 15} 519 ${x + 14} 531 Z" fill="#27272A"/>`
      + `<path d="M${x - 12.5} 525.5 Q${x} 521.5 ${x + 12.5} 525.5" stroke="#0E0E10" stroke-width="0.9" fill="none"/>`
      + `<path d="M${x - 5} 517.5 L${x} 522 L${x + 5} 517.5" stroke="#0E0E10" stroke-width="0.9" fill="none"/>`
      + `<path d="M${x - 3.5} 518.6 L${x + 3.5} 518.6 M${x - 2.4} 520.2 L${x + 2.4} 520.2" stroke="#52525B" stroke-width="0.7"/>`
      + `<path d="M${x - 9} 528.5 Q${x - 4} 526.8 ${x + 1} 527.6" stroke="#71717A" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.85"/>`);
  } else if (has('hai_vai_nam')) {
    // hài vải nam: thân vải đen mềm kiểu xỏ chân, đế trắng dày, mũi bọc da/vải màu vàng nâu
    feet = pair((x) =>
      `<rect x="${x - 15.5}" y="529" width="31" height="5.2" rx="2.2" fill="#F4F1EA" stroke="#CFC8BA" stroke-width="0.7"/>`
      + `<path d="M${x - 14} 529.5 Q${x - 15} 519 ${x - 7} 517 L${x + 7} 517 Q${x + 15} 519 ${x + 14} 529.5 Z" fill="#1E1C1D"/>`
      + `<path d="M${x - 8} 517.5 Q${x} 521 ${x + 8} 517.5" stroke="#3A3638" stroke-width="1.2" fill="none"/>`
      + `<path d="M${x - 11} 529.5 Q${x - 9} 525.2 ${x} 524.8 Q${x + 9} 525.2 ${x + 11} 529.5 Z" fill="#C9A06A"/>`
      + `<path d="M${x - 10} 528 Q${x} 525.6 ${x + 10} 528" stroke="#A97F4C" stroke-width="0.6" fill="none"/>`
      + `<path d="M${x - 4} 526.6 Q${x - 1} 525.9 ${x + 2} 526.3" stroke="#E2C493" stroke-width="0.9" fill="none" stroke-linecap="round"/>`);
  } else if (has('sneaker')) {
    // sneaker trắng cổ thấp: mũi bo, đế xám, dây buộc
    feet = pair((x) =>
      `<path d="M${x - 14} 531 Q${x - 15} 518 ${x - 7} 516 L${x + 7} 516 Q${x + 15} 518 ${x + 14} 531 Z" fill="#FBFBFB" stroke="#CFCFD4" stroke-width="0.9"/>`
      + `<path d="M${x - 13} 527 Q${x} 523.5 ${x + 13} 527" fill="none" stroke="#E4E4E8" stroke-width="3"/>`
      + `<rect x="${x - 15.5}" y="529" width="31" height="4.5" rx="2" fill="#D6D6DC"/>`
      + `<path d="M${x - 4} 518 L${x + 4} 521 M${x + 4} 518 L${x - 4} 521 M${x - 4} 521 L${x + 4} 524 M${x + 4} 521 L${x - 4} 524" stroke="#9A9AA2" stroke-width="0.8"/>`
      + `<path d="M${x - 9} 524 Q${x - 6} 521 ${x - 2} 523" stroke="${colors.accent}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`);
  } else {
    feet = pair((x) =>
      `<path d="M${x - 14} 530 Q${x - 14} 516 ${x} 517 Q${x + 15} 517 ${x + 15} 530 Z" fill="#3A2E2A"/>`
      + `<path d="M${x - 6} 520 L${x + 6} 520" stroke="#fff" stroke-opacity="0.3" stroke-width="1.5"/>`);
  }

  // ---------- Thân áo ----------
  const neckline = `M${cx - sw} 146 Q${cx - sw + 1} 128 ${cx - sw / 2 - 4} 124 Q${cx - 17} 120 ${cx - 11} 118 L${cx + 11} 118 Q${cx + 17} 120 ${cx + sw / 2 + 4} 124 Q${cx + sw - 1} 128 ${cx + sw} 146`;
  let back: string | null = null;
  let body = '';
  let sleeveW = 16;
  let details = '';      // vẽ trên thân, dưới tay áo
  let overDetails = '';  // vẽ trên cả tay áo (cổ nhật bình, dải trước ngực…)
  let collar: 'lap-linh' | 'khong' | 'giao' | 'nhat-binh' = 'lap-linh';
  const btns = (list: [number, number][]) => list.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="${colors.accent}" stroke="${INK}" stroke-opacity="0.35" stroke-width="0.6"/>`).join('');

  if (kind === 'ao-dai') {
    const hem = nam ? 420 : 470;
    const wa = nam ? ww + 2 : ww - 5;
    const fl = nam ? 14 : 20;
    back = null; // bỏ lớp tà sau: từ chính diện nó nằm khuất sau quần, chỉ lòi hai mép gây vệt lỗi
    void `M${cx - wa} 240 C${cx - wa - 2} 320 ${cx - ww - fl} 400 ${cx - ww - fl - 4} ${hem + 4} Q${cx} ${hem + 2} ${cx + ww + fl + 4} ${hem + 4} C${cx + ww + fl} 400 ${cx + wa + 2} 320 ${cx + wa} 240 Z`;
    body = `${neckline} C${cx + sw - 1} 176 ${cx + ww + 6} 196 ${cx + wa} 234`
      + ` C${cx + wa + 2} 310 ${cx + ww + fl - 6} 400 ${cx + ww + fl} ${hem}`
      + ` Q${cx} ${hem + 6} ${cx - ww - fl} ${hem}`
      + ` C${cx - ww - fl + 6} 400 ${cx - wa - 2} 310 ${cx - wa} 234`
      + ` C${cx - ww - 6} 196 ${cx - sw + 1} 176 ${cx - sw} 146 Z`;
    sleeveW = 15;
    details += `<path d="M${cx - ww - fl + 1} ${hem - 1} Q${cx} ${hem + 5} ${cx + ww + fl - 1} ${hem - 1}" stroke="${colors.secondary}" stroke-width="3" fill="none"/>`;
    // đường cài khuy chéo: lùi vào trong để nằm trọn trên thân, không chui dưới ống tay
    details += `<path d="M${cx + 10} 122 Q${cx + sw / 2 + 1} 128 ${cx + sw - 15} 146 C${cx + wa + 1} 176 ${cx + wa - 1} 208 ${cx + wa - 4} 234" stroke="${colors.secondary}" stroke-width="1.5" fill="none" stroke-opacity="0.95"/>`;
    for (const [bx, by] of [[cx + 14, 125], [cx + 20, 130], [cx + 25, 137]]) details += `<circle cx="${bx}" cy="${by}" r="1.7" fill="${colors.secondary}"/>`;
  } else if (kind === 'ao-ngu-than' && costumeId === 'ngu_than_nam') {
    // Ngũ thân NAM PHOM RỘNG: may suông rộng từ nách xuống, vạt dài che gối, tay rộng vừa phải (miệng tay loe),
    // có nếp vải dọc rủ — khác bản lập lĩnh tay chẽn ôm người
    const hem = 466;
    const fl = 24;
    body = `${neckline} C${cx + sw + 4} 190 ${cx + ww + 12} 240 ${cx + ww + 15} 290 C${cx + ww + 18} 360 ${cx + ww + fl - 2} 420 ${cx + ww + fl} ${hem} Q${cx} ${hem + 5} ${cx - ww - fl} ${hem} C${cx - ww - fl + 2} 420 ${cx - ww - 18} 360 ${cx - ww - 15} 290 C${cx - ww - 12} 240 ${cx - sw - 4} 190 ${cx - sw} 146 Z`;
    sleeveW = 30;
    details += `<path d="M${cx + 4} 121 Q${cx + 20} 128 ${cx + sw - 14} 146 C${cx + ww + 2} 200 ${cx + ww + 4} 280 ${cx + ww + 8} 350" stroke="${dark}" stroke-opacity="0.55" stroke-width="1.3" fill="none"/>`;
    details += `<path d="M${cx - ww - 12} 360 L${cx - ww - fl + 1} ${hem} M${cx + ww + 12} 360 L${cx + ww + fl - 1} ${hem}" stroke="${dark}" stroke-opacity="0.45" stroke-width="1.4"/>`;
    details += `<path d="M${cx - 16} 300 C${cx - 18} 360 ${cx - 21} 410 ${cx - 24} ${hem - 4} M${cx + 2} 320 C${cx + 2} 380 ${cx + 3} 420 ${cx + 4} ${hem - 2} M${cx + 22} 300 C${cx + 25} 360 ${cx + 29} 410 ${cx + 33} ${hem - 4}" stroke="${dark}" stroke-opacity="0.22" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    details += btns([[cx + 7, 116], [cx + 21, 129], [cx + sw - 13, 148], [cx + ww + 1, 184], [cx + ww + 2, 216]]);
  } else if (kind === 'ao-ngu-than') {
    // Ngũ thân tay chẽn: thân suông dài qua gối, tay hẹp ôm cổ tay, cổ đứng lót trắng, 5 khuy chạy chéo sang nách phải
    const hem = 444;
    body = `${neckline} C${cx + sw + 1} 180 ${cx + ww + 2} 214 ${cx + ww + 3} 250 C${cx + ww + 5} 320 ${cx + ww + 9} 390 ${cx + ww + 11} ${hem} Q${cx} ${hem + 4} ${cx - ww - 11} ${hem} C${cx - ww - 9} 390 ${cx - ww - 5} 320 ${cx - ww - 3} 250 C${cx - ww - 2} 214 ${cx - sw - 1} 180 ${cx - sw} 146 Z`;
    sleeveW = 13;
    details += `<path d="M${cx + 4} 121 Q${cx + 20} 128 ${cx + sw - 14} 146 C${cx + ww - 4} 200 ${cx + ww - 3} 280 ${cx + ww} 340" stroke="${dark}" stroke-opacity="0.55" stroke-width="1.3" fill="none"/>`;
    details += `<path d="M${cx - ww - 8} 352 L${cx - ww - 11} ${hem} M${cx + ww + 8} 352 L${cx + ww + 11} ${hem}" stroke="${dark}" stroke-opacity="0.45" stroke-width="1.4"/>`;
    details += btns([[cx + 7, 116], [cx + 21, 129], [cx + sw - 13, 148], [cx + ww - 4, 182], [cx + ww - 4, 212]]);
  } else if (kind === 'ao-tac') {
    // Áo tấc (ngũ thân tay thụng): thân dài, tay rất rộng buông thành mảng chữ nhật, cổ đứng lót trắng, xẻ tà lộ quần trắng, có tua treo trước ngực
    const hem = nam ? 456 : 462;
    body = `${neckline} C${cx + sw + 1} 200 ${cx + ww + 12} 320 ${cx + ww + 15} ${hem} Q${cx} ${hem + 5} ${cx - ww - 15} ${hem} C${cx - ww - 12} 320 ${cx - sw - 1} 200 ${cx - sw} 146 Z`;
    sleeveW = 0;
    details += `<path d="M${cx - ww - 11} 350 L${cx - ww - 15} ${hem} M${cx + ww + 11} 350 L${cx + ww + 15} ${hem}" stroke="${dark}" stroke-opacity="0.45" stroke-width="1.4"/>`;
    details += `<path d="M${cx + 4} 121 Q${cx + 20} 128 ${cx + sw - 8} 146" stroke="${dark}" stroke-opacity="0.5" stroke-width="1.3" fill="none"/>`;
    details += btns([[cx + 7, 116], [cx + 22, 129], [cx + sw - 9, 150]]);
    // dây tua: từ khuy thứ hai buông xuống, cuối có quả tua màu nhấn
    overDetails += `<path d="M${cx + 22} 130 Q${cx + 20} 160 ${cx + 17} 196" stroke="${colors.accent}" stroke-width="1.1" fill="none"/>`;
    overDetails += `<ellipse cx="${cx + 17}" cy="198" rx="2.4" ry="3" fill="${IVORY}"/>`;
    overDetails += `<path d="M${cx + 15} 201 L${cx + 13} 222 L${cx + 21} 222 L${cx + 19} 201 Z" fill="${colors.accent}"/>`;
    overDetails += `<path d="M${cx + 15} 206 L${cx + 14.5} 220 M${cx + 17} 206 L${cx + 17} 221 M${cx + 19} 206 L${cx + 19.5} 220" stroke="#000" stroke-opacity="0.2" stroke-width="0.6"/>`;
  } else if (kind === 'ao-giao-linh') {
    const hem = 476;
    body = `M${cx - sw} 146 Q${cx - sw + 1} 128 ${cx - sw / 2 - 4} 124 Q${cx - 17} 120 ${cx - 14} 118 L${cx + 14} 118 Q${cx + 17} 120 ${cx + sw / 2 + 4} 124 Q${cx + sw - 1} 128 ${cx + sw} 146 C${cx + sw + 2} 200 ${cx + ww + 20} 330 ${cx + ww + 24} ${hem} Q${cx} ${hem + 5} ${cx - ww - 24} ${hem} C${cx - ww - 20} 330 ${cx - sw - 2} 200 ${cx - sw} 146 Z`;
    sleeveW = 0;
    collar = 'giao';
    details += `<path d="M${cx + 14} 118 L${cx + 3} 142 L${cx + 11} 144 L${cx + 22} 120 Z" fill="${colors.secondary}" fill-opacity="0.85"/>`;
    details += `<path d="M${cx - 16} 117 L${cx + 26} 200 L${cx + 36} 195 L${cx - 4} 115 Z" fill="${colors.secondary}"/>`;
    details += `<path d="M${cx - 10} 120 L${cx + 30} 197" stroke="${colors.accent}" stroke-width="1" stroke-opacity="0.8"/>`;
    details += `<path d="M${cx + 31} 198 L${cx + ww + 18} 400" stroke="${dark}" stroke-opacity="0.45" stroke-width="1.3"/>`;
    details += `<path d="M${cx - ww - 24} ${hem - 2} Q${cx} ${hem + 3} ${cx + ww + 24} ${hem - 2}" stroke="${colors.secondary}" stroke-width="4" fill="none"/>`;
  } else if (kind === 'ao-tu-than') {
    // Tứ thân: hai vạt trước mở để lộ yếm, buộc thắt lưng bao, váy đụp
    const hem = 462;
    body = `M${cx - sw} 146 Q${cx - sw + 1} 128 ${cx - sw / 2 - 4} 124 Q${cx - 18} 120 ${cx - 16} 120 L${cx + 16} 120 Q${cx + 18} 120 ${cx + sw / 2 + 4} 124 Q${cx + sw - 1} 128 ${cx + sw} 146 C${cx + sw} 200 ${cx + ww + 14} 320 ${cx + ww + 20} ${hem} L${cx - ww - 20} ${hem} C${cx - ww - 14} 320 ${cx - sw} 200 ${cx - sw} 146 Z`;
    sleeveW = 14;
    collar = 'khong';
    // yếm lộ giữa hai vạt (không viền đậm)
    // Theo ảnh Quan họ: giữa hai vạt lộ yếm đỏ; vạt áo lót xanh lá mạ (áo mớ ba) bẻ chéo thành một mảng tam giác
    // từ cổ bên phải xuống giữa ngực; dưới mảng xanh là vạt áo ngoài sẫm đắp chéo
    const layer = '#3FA95B';
    const yem = colors.accent;
    const vPath = `M${cx - 16} 121 Q${cx - 26} 190 ${cx - 7} 248 L${cx + 7} 248 Q${cx + 26} 190 ${cx + 16} 121 Z`;
    details += `<path d="${vPath}" fill="${yem}"/>`;
    details += `<path d="M${cx - 15} 122 Q${cx} 130 ${cx + 15} 122" stroke="${shade(yem, -0.3)}" stroke-width="1" fill="none"/>`;
    details += `<path d="M${cx - 22} 196 Q${cx} 186 ${cx + 22} 198 Q${cx + 20} 230 ${cx + 7} 248 L${cx - 7} 248 Q${cx - 20} 228 ${cx - 22} 196 Z" fill="${shade(colors.primary, -0.12)}"/>`;
    details += `<path d="M${cx + 6} 122 L${cx + 17} 122 Q${cx + 25} 150 ${cx + 22} 168 Q${cx + 4} 196 ${cx - 16} 214 Q${cx - 18} 204 ${cx - 14} 196 Q${cx - 2} 170 ${cx + 6} 122 Z" fill="${layer}"/>`;
    details += `<path d="M${cx + 22} 168 Q${cx + 4} 196 ${cx - 16} 214" stroke="${shade(layer, -0.3)}" stroke-width="1" fill="none"/>`;
    details += `<path d="M${cx + 9} 130 Q${cx + 2} 165 ${cx - 9} 200" stroke="#fff" stroke-opacity="0.2" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    // mép hai vạt áo: nét mảnh cùng tông áo
    details += `<path d="M${cx - 16} 121 Q${cx - 26} 190 ${cx - 7} 248 Q${cx - 14} 330 ${cx - 22} ${hem} M${cx + 16} 121 Q${cx + 26} 190 ${cx + 7} 248 Q${cx + 14} 330 ${cx + 22} ${hem}" stroke="${dark}" stroke-opacity="0.6" stroke-width="1.2" fill="none"/>`;
    // thắt lưng bao: dải ngang + nút buộc lệch trái + hai đuôi buông
    const sash = colors.accent;
    overDetails += `<path d="M${cx - ww - 8} 244 Q${cx} 250 ${cx + ww + 8} 244 L${cx + ww + 8} 254 Q${cx} 260 ${cx - ww - 8} 254 Z" fill="${sash}"/>`;
    overDetails += `<path d="M${cx - 12} 254 C${cx - 16} 290 ${cx - 20} 320 ${cx - 22} 350 L${cx - 12} 352 C${cx - 10} 320 ${cx - 8} 290 ${cx - 6} 256 Z" fill="${sash}"/>`;
    overDetails += `<path d="M${cx - 6} 254 C${cx - 2} 284 ${cx + 2} 306 ${cx + 2} 330 L${cx + 11} 328 C${cx + 8} 300 ${cx + 2} 280 ${cx} 254 Z" fill="${shade(sash, 0.15)}"/>`;
    overDetails += `<ellipse cx="${cx - 8}" cy="252" rx="7" ry="5" fill="${shade(sash, -0.12)}"/>`;
    // thắt lưng thứ hai màu xanh lá mạ (bộ "thắt lưng xanh, hồng" của áo tứ thân): dải ngang ngay dưới + đuôi dài có tua
    const sash2 = '#3FA95B';
    overDetails += `<path d="M${cx - ww - 8} 254 Q${cx} 260 ${cx + ww + 8} 254 L${cx + ww + 8} 261 Q${cx} 267 ${cx - ww - 8} 261 Z" fill="${sash2}"/>`;
    overDetails += `<path d="M${cx + 4} 260 C${cx + 8} 300 ${cx + 12} 340 ${cx + 14} 384 L${cx + 25} 384 C${cx + 22} 340 ${cx + 18} 300 ${cx + 13} 260 Z" fill="${sash2}"/>`;
    overDetails += `<path d="M${cx + 4} 260 C${cx + 8} 300 ${cx + 12} 340 ${cx + 14} 384" stroke="${shade(sash2, -0.2)}" stroke-width="0.8" fill="none"/>`;
    for (let i = 0; i < 6; i++) overDetails += `<path d="M${cx + 15 + i * 1.9} 384 L${cx + 15 + i * 1.9} 392" stroke="${sash2}" stroke-width="1.1"/>`;
    overDetails += `<ellipse cx="${cx + 9}" cy="259" rx="6" ry="4.2" fill="${shade(sash2, -0.15)}"/>`;
  } else {
    // ao-nhat-binh: áo tay thụng dài, cổ nhật bình (bản cổ to vắt qua vai, hai dải buông dọc trước ngực)
    const hem = 482;
    body = `${neckline} C${cx + sw + 4} 210 ${cx + ww + 26} 340 ${cx + ww + 30} ${hem} Q${cx} ${hem + 6} ${cx - ww - 30} ${hem} C${cx - ww - 26} 340 ${cx - sw - 4} 210 ${cx - sw} 146 Z`;
    sleeveW = 0;
    collar = 'nhat-binh';
    // Cổ nhật bình (theo ảnh tư liệu): khung cổ VUÔNG phẳng trên ngực, viền vải màu tương phản
    // (thường xanh chàm) có chỉ vàng; lòng khung màu ngà thêu sóng nước; bên trong lộ cổ đứng áo lót trắng.
    // Dưới khung là một khuy tết, hai vạt trước đối khâm chạy thẳng xuống gấu.
    const rgb = parseInt(colors.primary.slice(1), 16);
    const warm = (rgb >> 16) >= (rgb & 255);
    const band = warm ? '#26386E' : '#8E2030';
    const gold = '#D9B45A';
    // Theo ảnh mặc thật: bản cổ không phải hình vuông cứng mà là dải vải mềm ôm từ sau gáy,
    // vắt qua hai bên cổ rồi buông xuống ngực, nở dần ra, đáy cong mềm.
    const W = nam ? 31 : 27;          // nửa bề ngang ở đáy
    const yBot = nam ? 228 : 220;     // đáy bản cổ
    const n = nam ? 1.1 : 1;
    const outerP = `M${cx - 12} 112 C${cx - 22} 114 ${cx - 28 * n} 120 ${cx - 29 * n} 131 C${cx - 29 * n} 160 ${cx - W} 190 ${cx - W} ${yBot - 6} Q${cx - W} ${yBot} ${cx - W + 6} ${yBot} Q${cx} ${yBot + 9} ${cx + W - 6} ${yBot} Q${cx + W} ${yBot} ${cx + W} ${yBot - 6} C${cx + W} 190 ${cx + 29 * n} 160 ${cx + 29 * n} 131 C${cx + 28 * n} 120 ${cx + 22} 114 ${cx + 12} 112 Z`;
    const iW = W - 7, iB = yBot - 6;
    const innerP = `M${cx - 9} 119 C${cx - 16} 126 ${cx - 21 * n} 134 ${cx - 21 * n} 146 C${cx - 21 * n} 170 ${cx - iW} 190 ${cx - iW} ${iB - 4} Q${cx - iW} ${iB} ${cx - iW + 4} ${iB} Q${cx} ${iB + 8} ${cx + iW - 4} ${iB} Q${cx + iW} ${iB} ${cx + iW} ${iB - 4} C${cx + iW} 190 ${cx + 21 * n} 170 ${cx + 21 * n} 146 C${cx + 21 * n} 134 ${cx + 16} 126 ${cx + 9} 119 Z`;
    overDetails += `<path d="${outerP}" fill="${band}"/>`;
    // nếp vải mềm: một bên hơi tối như vải đổ theo ngực
    overDetails += `<path d="M${cx + 22 * n} 134 C${cx + 24 * n} 165 ${cx + W - 3} 190 ${cx + W - 3} ${yBot - 6}" stroke="${shade(band, -0.3)}" stroke-width="3" fill="none" opacity="0.45"/>`;
    // hoa văn hình học nhỏ trên viền (chấm vàng thưa)
    for (const t of [0.25, 0.45, 0.65, 0.85]) {
      const y = 135 + t * (yBot - 145);
      const xo = 25 * n + t * (W - 4 - 25 * n);
      overDetails += `<circle cx="${cx - xo}" cy="${y}" r="0.9" fill="${gold}"/><circle cx="${cx + xo}" cy="${y}" r="0.9" fill="${gold}"/>`;
    }
    overDetails += `<path d="${innerP}" fill="${IVORY}" stroke="${gold}" stroke-width="1.1"/>`;
    overDetails += `<path d="${outerP}" fill="none" stroke="${gold}" stroke-width="0.9" opacity="0.9"/>`;
    // hoa nhỏ thêu rải dọc lòng yếm
    const flower = (x: number, y: number, c: string) => `<g fill="${c}"><circle cx="${x - 1.6}" cy="${y}" r="1.3"/><circle cx="${x + 1.6}" cy="${y}" r="1.3"/><circle cx="${x}" cy="${y - 1.6}" r="1.3"/><circle cx="${x}" cy="${y + 1.6}" r="1.3"/></g><circle cx="${x}" cy="${y}" r="0.8" fill="${gold}"/>`;
    overDetails += flower(cx - 11, 150, '#D9604A') + flower(cx + 11, 150, '#D9604A') + flower(cx - 13, 172, '#4E8FA8') + flower(cx + 13, 172, '#4E8FA8');
    // núi – sóng nước (sơn thủy) ở đáy lòng yếm
    const wv = '#4E8FA8';
    overDetails += `<path d="M${cx - 10} ${iB - 6} Q${cx} ${iB - 20} ${cx + 10} ${iB - 6} Z" fill="${band}" stroke="${gold}" stroke-width="0.8"/>`;
    for (let i = 0; i < 2; i++) {
      const y = iB - 2 - i * 4;
      overDetails += `<path d="M${cx - iW + 3} ${y} q${iW / 4} -3.5 ${iW / 2} 0 t${iW / 2} 0 t${iW / 2} 0 t${iW / 2} 0" stroke="${i ? gold : wv}" stroke-width="1.2" fill="none"/>`;
    }
    // cổ đứng áo lót trắng bên trong
    overDetails += `<path d="M${cx - 10} 108 Q${cx} 105 ${cx + 10} 108 L${cx + 10} 121 Q${cx + 5} 126 ${cx} 132 Q${cx - 5} 126 ${cx - 10} 121 Z" fill="#FFFFFF" stroke="${shade(IVORY, -0.18)}" stroke-width="0.8"/>`;
    overDetails += `<path d="M${cx} 121 L${cx} 132" stroke="${shade(IVORY, -0.25)}" stroke-width="0.8"/>`;
    // quả bông trắng giữa ngực
    // Tà áo ngoài phủ mềm lên hai mép bản cổ (như khi mặc thật): mép vải lượn chữ S, có bóng đổ nhẹ lên yếm
    for (const d of [-1, 1] as const) {
      const X = (v: number) => cx + d * v;
      const edgeP = `M${X(28.5 * n)} 127 C${X(26.5 * n)} 140 ${X(24.5 * n)} 160 ${X(25.5 * n)} 188 C${X(26.5 * n)} 204 ${X(W - 1)} 214 ${X(W)} ${yBot + 10}`;
      const drape = `${edgeP} L${X(sw)} ${yBot + 10} L${X(sw - 0.5)} 146 Q${X(sw - 2)} 131 ${X(28.5 * n)} 127 Z`;
      overDetails += `<path d="${edgeP}" stroke="#000" stroke-opacity="0.18" stroke-width="4" fill="none" transform="translate(${-d * 1.5} 1)"/>`;
      overDetails += `<path d="${drape}" fill="${colors.primary}"/>`;
      overDetails += `<path d="${drape}" fill="url(#${id('sheen')})"/>`;
      overDetails += `<path d="${edgeP}" stroke="${shade(colors.primary, 0.18)}" stroke-width="1.2" fill="none"/>`;
      // nếp gấp mềm trên tà
      overDetails += `<path d="M${X(30 * n)} 150 C${X(32 * n)} 170 ${X(31 * n)} 190 ${X(33 * n)} 206" stroke="${shade(colors.primary, -0.22)}" stroke-width="1.1" fill="none" opacity="0.5"/>`;
    }
    // khuy tết dưới khung + đường xẻ đối khâm
    overDetails += `<path d="M${cx} ${yBot + 5} L${cx} ${hem + 2}" stroke="${shade(colors.primary, -0.3)}" stroke-width="1.1"/>`;
    overDetails += `<circle cx="${cx}" cy="${yBot + 9}" r="2.4" fill="${gold}" stroke="${shade(gold, -0.3)}" stroke-width="0.7"/>`;
    details += `<path d="M${cx - ww - 30} ${hem - 2} Q${cx} ${hem + 4} ${cx + ww + 30} ${hem - 2}" stroke="${band}" stroke-width="4" fill="none"/>`;
  }

  // ---------- Tay áo ----------
  // tay chẽn buông
  const sleeveHang = (side: -1 | 1) => {
    const w = Math.max(sleeveW, 17);
    const sx = cx + side * sw;
    const wx = cx + side * (sw + 19);
    // bắp tay đầy (~22) thuôn xuống cổ tay (~17); mép trong chỉ chạm nhẹ mép thân, không lấn vào ngực
    const bulk = nam ? 4 : 0; // nam: bắp tay đầy hơn chút
    return `M${sx - side * 7} 126 Q${sx + side * (8 + bulk)} 124 ${sx + side * (12 + bulk)} 152 Q${sx + side * (18 + bulk)} 206 ${wx + (side * w) / 2} 298 L${wx - (side * w) / 2} 300 Q${sx - side * 1} 212 ${sx - side * 7} 172 Q${sx - side * 10} 136 ${sx - side * 7} 126 Z`;
  };
  // tay chẽn gập (cầm quạt): khuỷu ra ngoài, cẳng tay đưa vào trước ngực
  const sleeveBent = (side: -1 | 1) => {
    const sx = cx + side * sw;
    const ex = sx + side * 16; // khuỷu
    return `M${sx - side * 11} 126 Q${sx + side * 6} 125 ${sx + side * 9} 150 Q${sx + side * 16} 196 ${ex + side * 2} 236 Q${ex + side * 4} 256 ${ex - side * 16} 253 L${handR.x + side * 10} 234 L${handR.x + side * 8} 213 L${sx - side * 4} 220 Q${sx - side * 13} 196 ${sx - side * 17} 172 Q${sx - side * 18} 137 ${sx - side * 11} 126 Z`;
  };
  // tay thụng khoanh trước bụng: ống tay buông thành mảng lớn, miệng tay quay vào giữa
  const sleeveWide = (side: -1 | 1) => {
    const sx = cx + side * sw;
    const o = nam ? 24 : 19;   // độ loe ra ngoài ở đáy
    const by = nam ? 340 : 334; // đáy ống tay
    return `M${sx - side * 9} 127 Q${sx + side * 4} 126 ${sx + side * 6} 148 C${sx + side * 14} 200 ${sx + side * (o - 4)} 262 ${sx + side * o} ${by - 14} Q${sx + side * (o - 4)} ${by + 6} ${cx + side * 18} ${by - 4} L${cx + side * 9} 262 L${cx + side * 7} 240 Q${cx + side * 24} 222 ${sx - side * 10} 192 Q${sx - side * 15} 150 ${sx - side * 9} 127 Z`;
  };
  const sleeveFor = (side: -1 | 1) => (wide ? sleeveWide(side) : bentArm && side === 1 ? sleeveBent(side) : sleeveHang(side));
  const sleeves = `${sleeveFor(-1)} ${sleeveFor(1)}`;

  // Viền / lót miệng tay
  let cuffs = '';
  if (wide) {
    for (const side of [-1, 1] as const) {
      const by = nam ? 340 : 334;
      // lòng tay áo (lót sẫm) dọc miệng tay
      cuffs += `<path d="M${cx + side * 7} 240 L${cx + side * 9} 262 L${cx + side * 18} ${by - 4} L${cx + side * 25} ${by - 6} L${cx + side * 16} 262 L${cx + side * 13} 240 Z" fill="${dark}" opacity="0.55"/>`;
      if (kind === 'ao-nhat-binh') {
        const stripes = [colors.secondary, '#2E7D5B', '#D9B45A', colors.accent, '#2F3F8F'];
        stripes.forEach((c, i) => {
          const d = 2.2 + i * 2.6;
          cuffs += `<path d="M${cx + side * (7 + d)} 240 L${cx + side * (9 + d)} 262 L${cx + side * (18 + d)} ${by - 4 - i * 0.6}" stroke="${c}" stroke-width="2.6" fill="none"/>`;
        });
      } else {
        // áo tấc / giao lĩnh: chỉ một đường viền mảnh cùng tông áo ở miệng tay, không kẻ trắng
        cuffs += `<path d="M${cx + side * 7} 240 L${cx + side * 9} 262 L${cx + side * 18} ${by - 4}" stroke="${shade(colors.primary, 0.18)}" stroke-width="1.6" fill="none"/>`;
      }
    }
  } else {
    cuffs += `<path d="M${handL.x - 8.5} 298 L${handL.x + 8.5} 300" stroke="${colors.secondary}" stroke-width="2.5"/>`;
    cuffs += bentArm
      ? `<path d="M${handR.x + 8} 214 L${handR.x + 10} 232" stroke="${colors.secondary}" stroke-width="2.5"/>`
      : `<path d="M${handR.x - 8.5} 300 L${handR.x + 8.5} 298" stroke="${colors.secondary}" stroke-width="2.5"/>`;
  }

  // ---------- Tóc ----------
  const isLong = hair === 'dai' || hair === 'dai-vai';
  // tóc sau lưng: chỉ lộ hai bên cổ tới bả vai, phần dưới khuất sau lưng (không lòi ra giữa tay và thân)
  const backHair = isLong
    ? `<path d="M${cx - 32} 62 C${cx - 29} 46 ${cx - 16} 38 ${cx} 38 C${cx + 16} 38 ${cx + 29} 46 ${cx + 32} 62 C${cx + 35} 80 ${cx + 32} 98 ${cx + 33} 118 C${cx + 36} 145 ${cx + 37} 165 ${cx + 34} 180 C${cx + 32} 196 ${cx + 28} 206 ${cx + 22} 210 L${cx - 22} 210 C${cx - 28} 206 ${cx - 32} 196 ${cx - 34} 180 C${cx - 37} 165 ${cx - 36} 145 ${cx - 33} 118 C${cx - 32} 98 ${cx - 35} 80 ${cx - 32} 62 Z" fill="${HAIR}"/>`
    : '';
  // 'dai': tóc thả gọn sau lưng (không lọn nào ra trước); 'dai-vai': một lọn dày vắt qua vai trước ngực
  const frontHair = hair === 'dai-vai'
    // mảng tóc bên trái liền khối với tóc trên đầu, rủ qua vai rồi thon dần, buông dài tới eo; mép trơn, đuôi thuôn
    ? `<path d="M${cx - 33} 70 C${cx - 35} 92 ${cx - 38} 108 ${cx - 37.5} 128 C${cx - 37} 150 ${cx - 34} 174 ${cx - 31} 194 C${cx - 30} 204 ${cx - 28} 212 ${cx - 24} 214 C${cx - 20.5} 215 ${cx - 18.5} 206 ${cx - 18} 196 C${cx - 17} 172 ${cx - 15} 146 ${cx - 15} 108 C${cx - 16} 98 ${cx - 20} 92 ${cx - 24} 90 Z" fill="${HAIR}"/>`
      + `<path d="M${cx - 31} 112 C${cx - 31.5} 136 ${cx - 29.5} 165 ${cx - 26.5} 196" stroke="#fff" stroke-opacity="0.1" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : '';

  let face = '';
  // khuôn mặt có góc cạnh: nữ hàm thon cằm nhọn nhẹ; nam hàm vuông, cằm bản rộng
  face += nam
    // nam: hai bên má thẳng, góc hàm sắc, cằm bằng
    ? `<path d="M${cx - 10.5} 100 L${cx - 8} 111.5 Q${cx} 114 ${cx + 8} 111.5 L${cx + 10.5} 100 Z" fill="#D7A887"/>`
      + `<path d="M${cx - 23} 70 C${cx - 23} 53 ${cx - 13} 46 ${cx} 46 C${cx + 13} 46 ${cx + 23} 53 ${cx + 23} 70 C${cx + 23.6} 80 ${cx + 23.4} 90 ${cx + 21.8} 97 L${cx + 9.5} 106.8 Q${cx} 110 ${cx - 9.5} 106.8 L${cx - 21.8} 97 C${cx - 23.4} 90 ${cx - 23.6} 80 ${cx - 23} 70 Z" fill="${skin}"/>`
    // nữ: mặt vừa khung tóc, hàm chữ V, cằm nhọn
    : `<path d="M${cx - 9} 99 L${cx - 5} 110 Q${cx} 112 ${cx + 5} 110 L${cx + 9} 99 Z" fill="#E2B697"/>`
      + `<path d="M${cx - 23} 72 C${cx - 23} 54 ${cx - 13} 47 ${cx} 47 C${cx + 13} 47 ${cx + 23} 54 ${cx + 23} 72 L${cx + 22.8} 79 C${cx + 22} 89 ${cx + 15} 98 ${cx + 6.5} 104.5 Q${cx} 109.5 ${cx - 6.5} 104.5 C${cx - 15} 98 ${cx - 22} 89 ${cx - 22.8} 79 Z" fill="${skin}"/>`;
  if (nam) {
    // nam: mày đậm thẳng sát mắt, mắt hẹp có mí trên, mũi một nét, miệng gọn hơi nhếch
    for (const sd of [-1, 1]) {
      const ex = cx + sd * 9.5;
      face += `<path d="M${ex - sd * 5} 74.5 L${ex + sd * 5.5} 73.2 L${ex + sd * 5.2} 75.6 L${ex - sd * 5} 76.6 Z" fill="#2A1D18"/>`;
      face += `<ellipse cx="${ex}" cy="80.5" rx="2.5" ry="2.1" fill="${INK}"/>`;
      face += `<path d="M${ex - 3.8} 79 Q${ex} 77.2 ${ex + 3.8} 79" stroke="${INK}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    }
    face += `<path d="M${cx + 0.8} 84 L${cx - 1.2} 90 L${cx + 1.4} 90.6" stroke="#C99B80" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    face += `<path d="M${cx - 4.5} 96 Q${cx} 97.6 ${cx + 5} 95.4" stroke="#8A3B2E" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
  } else {
    // nữ: mày mảnh hơi cong, mắt có mí trên + đuôi mi nhỏ, mũi một nét, môi nhỏ khép
    for (const sd of [-1, 1]) {
      const ex = cx + sd * 9.2;
      face += `<path d="M${ex - sd * 4.2} 73.8 Q${ex + sd * 0.6} 71.4 ${ex + sd * 5} 73.2" stroke="#3A2620" stroke-width="1.05" fill="none" stroke-linecap="round"/>`;
      face += `<ellipse cx="${ex}" cy="80.6" rx="2.4" ry="2.5" fill="${INK}"/>`;
      face += `<circle cx="${ex + sd * 0.8}" cy="79.6" r="0.7" fill="#fff" opacity="0.85"/>`;
      face += `<path d="M${ex - sd * 3.6} 79.6 Q${ex} 76.8 ${ex + sd * 3.9} 78.8" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
    }
    face += `<path d="M${cx + 0.5} 87 L${cx - 0.8} 90.4" stroke="#D2A088" stroke-width="0.9" stroke-linecap="round"/>`;
    face += `<path d="M${cx - 3.4} 95.2 Q${cx} 94 ${cx + 3.4} 95.2 Q${cx} 97.8 ${cx - 3.4} 95.2 Z" fill="#C25A5A"/>`;
    face += `<path d="M${cx - 3.4} 95.2 Q${cx} 96 ${cx + 3.4} 95.2" stroke="#8A3B3B" stroke-width="0.6" fill="none"/>`;
  }
  // má hồng nhỏ, nam nhạt hơn
  // má hồng nhỏ, chỉ nữ
  if (!nam) {
    face += `<ellipse cx="${cx - 14}" cy="89" rx="3.4" ry="1.9" fill="#E88A7A" opacity="0.33"/>`;
    face += `<ellipse cx="${cx + 14}" cy="89" rx="3.4" ry="1.9" fill="#E88A7A" opacity="0.33"/>`;
  }
  const maleHair = hair === 'ngan' || hair === 'bui-nam' || hair === 'mai-phay' || hair === 're-ngoi' || hair === 'cua';
  if (maleHair) {
    const strands = (d: string) => `<path d="${d}" stroke="#4A3A33" stroke-opacity="0.55" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
    if (headCovered || hair === 'bui-nam') {
      // đội khăn/nón, hoặc búi tó: tóc chải ngược sát đầu, không phồng
      face += `<path d="M${cx - 24.5} 74 L${cx - 25} 57 Q${cx - 23.5} 44 ${cx} 43.5 Q${cx + 23.5} 44 ${cx + 25} 57 L${cx + 24.5} 72 Q${cx + 21} 60 ${cx + 12} 57.5 Q${cx} 59 ${cx - 12} 57.5 Q${cx - 21} 60 ${cx - 24.5} 74 Z" fill="${HAIR}"/>`;
      if (!headCovered) face += strands(`M${cx - 16} 50 Q${cx} 44 ${cx + 16} 50 M${cx - 9} 47 L${cx - 4} 40 M${cx + 9} 47 L${cx + 4} 40`);
    } else if (hair === 'mai-phay') {
      // Mái phẩy: mái dài rủ chéo trán, đuôi mái cong như dấu phẩy
      face += `<path d="M${cx - 24} 72 L${cx - 25} 55 Q${cx - 23} 40 ${cx - 6} 37 Q${cx + 14} 35 ${cx + 24} 46 Q${cx + 27} 56 ${cx + 24} 70 Q${cx + 22} 62 ${cx + 19} 58 Q${cx + 10} 65 ${cx - 4} 65.5 Q${cx - 12} 66 ${cx - 15} 61.5 Q${cx - 14} 66.5 ${cx - 19} 66 Q${cx - 22} 67 ${cx - 24} 72 Z" fill="${HAIR}"/>`;
      face += strands(`M${cx + 18} 45 Q${cx + 6} 50 ${cx - 6} 62 M${cx + 10} 42 Q${cx - 2} 46 ${cx - 13} 59`);
    } else if (hair === 're-ngoi') {
      // Rẽ ngôi giữa: hai mảng mái vén sang hai bên ôm trán
      face += `<path d="M${cx - 24} 73 L${cx - 25} 55 Q${cx - 24} 39 ${cx} 37.5 Q${cx + 24} 39 ${cx + 25} 55 L${cx + 24} 73 Q${cx + 23} 63 ${cx + 15} 59.5 Q${cx + 6} 58 ${cx + 1.5} 51.5 L${cx} 49 L${cx - 1.5} 51.5 Q${cx - 6} 58 ${cx - 15} 59.5 Q${cx - 23} 63 ${cx - 24} 73 Z" fill="${HAIR}"/>`;
      face += strands(`M${cx - 1} 41 Q${cx - 10} 46 ${cx - 19} 58 M${cx + 1} 41 Q${cx + 10} 46 ${cx + 19} 58`);
    } else if (hair === 'cua') {
      // Đầu cua: tóc ngắn sát, viền gọn, màu nhạt hơn chút (thấy chân tóc)
      face += `<path d="M${cx - 23.5} 66 Q${cx - 24} 46 ${cx} 45 Q${cx + 24} 46 ${cx + 23.5} 66 Q${cx + 21} 57 ${cx + 13} 55.5 L${cx - 13} 55.5 Q${cx - 21} 57 ${cx - 23.5} 66 Z" fill="#2F2622"/>`;
    } else {
      // Vuốt ngược: phồng ở trán
      face += `<path d="M${cx - 23.5} 71 L${cx - 24.5} 55 Q${cx - 23} 41 ${cx - 12} 36.5 Q${cx - 2} 31 ${cx + 12} 34 Q${cx + 25} 38 ${cx + 25} 54 L${cx + 23.5} 69 Q${cx + 22} 60 ${cx + 17} 56.5 Q${cx + 8} 53 ${cx - 3} 55.5 Q${cx - 14} 55 ${cx - 19} 60 Q${cx - 22} 64 ${cx - 23.5} 71 Z" fill="${HAIR}"/>`;
      face += strands(`M${cx - 14} 44 Q${cx - 2} 37 ${cx + 14} 40 M${cx - 18} 50 Q${cx - 4} 42 ${cx + 18} 46`);
    }
  } else if (isLong) {
    // tóc dài: khối tóc tròn ôm đầu, mái rẽ giữa mềm ôm má, phần dưới buông sau lưng
    face += `<path d="M${cx - 24} 102 C${cx - 33} 94 ${cx - 34} 76 ${cx - 32} 62 C${cx - 29} 46 ${cx - 16} 38 ${cx} 38 C${cx + 16} 38 ${cx + 29} 46 ${cx + 32} 62 C${cx + 34} 76 ${cx + 33} 94 ${cx + 24} 102 C${cx + 23} 88 ${cx + 22} 72 ${cx + 14} 64 C${cx + 9} 60 ${cx + 4} 59.5 ${cx} 61 C${cx - 4} 59.5 ${cx - 9} 60 ${cx - 14} 64 C${cx - 22} 72 ${cx - 23} 88 ${cx - 24} 102 Z" fill="${HAIR}"/>`;
    face += `<path d="M${cx - 2} 44 C${cx - 14} 46 ${cx - 25} 56 ${cx - 28} 76 M${cx + 2} 44 C${cx + 14} 46 ${cx + 25} 56 ${cx + 28} 76" stroke="#4A3A33" stroke-opacity="0.5" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  } else {
    face += `<path d="M${cx - 23.5} 76 C${cx - 26} 60 ${cx - 21} 44 ${cx} 42 C${cx + 21} 44 ${cx + 26} 60 ${cx + 23.5} 76 C${cx + 21.5} 66 ${cx + 14} 59.5 ${cx} 58.5 C${cx - 14} 59.5 ${cx - 21.5} 66 ${cx - 23.5} 76 Z" fill="${HAIR}"/>`;
    face += `<path d="M${cx - 21} 68 C${cx - 20} 56 ${cx - 13} 49 ${cx - 5} 46 M${cx - 13} 59 C${cx - 10} 53 ${cx - 6} 50 ${cx - 2} 48 M${cx + 21} 68 C${cx + 20} 56 ${cx + 13} 49 ${cx + 5} 46 M${cx + 13} 59 C${cx + 10} 53 ${cx + 6} 50 ${cx + 2} 48" stroke="#4A3A33" stroke-opacity="0.55" stroke-width="0.9" fill="none" stroke-linecap="round"/>`;
  }
  const showBun = (hair === 'bui' || hair === 'bui-nam') && !headCovered;
  if (showBun && hair === 'bui') face += `<circle cx="${cx}" cy="44" r="13" fill="${HAIR}"/>`;
  if (showBun && hair === 'bui-nam') face += `<circle cx="${cx}" cy="42" r="9" fill="${HAIR}"/><rect x="${cx - 7}" y="46" width="14" height="3" rx="1.5" fill="${colors.accent}"/>`;

  let glasses = '';
  if (has('sunglasses')) {
    glasses += `<rect x="${cx - 18}" y="74" width="15" height="10" rx="4" fill="${INK}"/>`;
    glasses += `<rect x="${cx + 3}" y="74" width="15" height="10" rx="4" fill="${INK}"/>`;
    glasses += `<path d="M${cx - 3} 78 L${cx + 3} 78 M${cx - 18} 77 L${cx - 25} 75 M${cx + 18} 77 L${cx + 25} 75" stroke="${INK}" stroke-width="1.6"/>`;
    glasses += `<path d="M${cx - 15} 77 L${cx - 9} 77" stroke="#fff" stroke-opacity="0.35" stroke-width="1.4" stroke-linecap="round"/>`;
  }

  // ---------- Đồ đội đầu ----------
  let headwear = '';
  if (has('tram_cai_toc') && !headCovered) {
    // Trâm: thân trâm ngắn cài xiên theo búi/mái, chỉ lộ đầu trâm có hoa và chuỗi hạt rủ
    const gold = '#C9A24B';
    const flower = (x: number, y: number, r: number) => {
      let f = '';
      for (const a of [0, 72, 144, 216, 288]) f += `<circle cx="${n(x + r * Math.cos(((a - 90) * Math.PI) / 180))}" cy="${n(y + r * Math.sin(((a - 90) * Math.PI) / 180))}" r="${n(r * 0.75)}" fill="${colors.accent}"/>`;
      return f + `<circle cx="${x}" cy="${y}" r="${n(r * 0.55)}" fill="#F6D58E"/>`;
    };
    if (hair === 'bui') {
      // xuyên ngang búi: vẽ que rồi vẽ lại búi đè lên, chỉ lộ hai đầu
      headwear += `<path d="M${cx - 19} 40 L${cx + 20} 49" stroke="${gold}" stroke-width="2.2" stroke-linecap="round"/>`;
      headwear += `<circle cx="${cx}" cy="44" r="13" fill="${HAIR}"/>`;
      headwear += flower(cx + 21, 49, 3.2);
      headwear += `<path d="M${cx + 21} 52 L${cx + 22} 62 M${cx + 24} 51 L${cx + 26} 59" stroke="${gold}" stroke-width="0.8"/><circle cx="${cx + 22}" cy="63" r="1.3" fill="${colors.accent}"/><circle cx="${cx + 26}" cy="60" r="1.3" fill="${colors.accent}"/>`;
    } else if (isLong) {
      // tóc dài + trâm: vấn búi nửa đầu (nửa trên búi, nửa dưới xoã), trâm xuyên qua búi
      headwear += `<path d="M${cx - 18} 28 L${cx + 19} 37" stroke="${gold}" stroke-width="2.1" stroke-linecap="round"/>`;
      headwear += `<ellipse cx="${cx}" cy="31" rx="13" ry="10.5" fill="${HAIR}"/>`;
      headwear += `<path d="M${cx - 8} 27 Q${cx} 22 ${cx + 8} 27" stroke="#fff" stroke-opacity="0.12" stroke-width="1.5" fill="none"/>`;
      headwear += flower(cx + 20, 37, 3);
      headwear += `<path d="M${cx + 20} 40 L${cx + 21} 49" stroke="${gold}" stroke-width="0.8"/><circle cx="${cx + 21}" cy="50" r="1.3" fill="${colors.accent}"/>`;
    }
  }
  // Khăn vấn / mấn: vành vải độn trùm qua đỉnh đầu như vầng hào quang, dày ở đỉnh, thon dần xuống thái dương, hai lớp cuộn
  // Khi ở màu sắc là đen ở bất kỳ bộ áo nào thì chuyển sang màu xám (#5E6068) cho đỡ trùng màu với tóc (#1F1714)
  const GRAY_HEADWEAR = '#5E6068';
  const vanRing = (rawColor: string) => {
    const c = isBlackColor(rawColor) ? GRAY_HEADWEAR : rawColor;
    const cd = shade(c, -0.2), cl = shade(c, 0.25);
    // tóc lấp kín phần trong vành (không hở nền giữa khăn và đầu)
    let r = `<path d="M${cx - 25} 82 C${cx - 28} 54 ${cx - 15} 39 ${cx} 39 C${cx + 15} 39 ${cx + 28} 54 ${cx + 25} 82 Q${cx + 22} 67 ${cx + 2} 63 L${cx} 59.5 L${cx - 2} 63 Q${cx - 22} 67 ${cx - 25} 82 Z" fill="${HAIR}"/>`;
    r += `<path d="M${cx - 31} 82 C${cx - 37} 46 ${cx - 21} 24 ${cx} 24 C${cx + 21} 24 ${cx + 37} 46 ${cx + 31} 82 L${cx + 24} 80 C${cx + 27} 54 ${cx + 15} 40 ${cx} 40 C${cx - 15} 40 ${cx - 27} 54 ${cx - 24} 80 Z" fill="${c}" stroke="${shade(c, -0.3)}" stroke-width="0.9" stroke-opacity="0.6"/>`;
    // đường chia hai lớp cuộn
    r += `<path d="M${cx - 27.5} 81 C${cx - 32} 50 ${cx - 18} 32 ${cx} 32 C${cx + 18} 32 ${cx + 32} 50 ${cx + 27.5} 81" stroke="${cd}" stroke-width="1.4" fill="none" opacity="0.8"/>`;
    // ánh sáng trên lớp ngoài, bóng mép trong
    r += `<path d="M${cx - 24} 44 C${cx - 16} 30 ${cx - 6} 27 ${cx + 6} 27" stroke="${cl}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.7"/>`;
    r += `<path d="M${cx - 24} 80 C${cx - 27} 54 ${cx - 15} 40 ${cx} 40 C${cx + 15} 40 ${cx + 27} 54 ${cx + 24} 80" stroke="${cd}" stroke-width="1.2" fill="none" opacity="0.6"/>`;
    // vân vải xoắn mờ
    for (const t of [0.18, 0.32, 0.46, 0.6, 0.74]) {
      const a = Math.PI * (1 - t);
      const x1 = cx + 27 * Math.cos(a), y1 = 60 - 30 * Math.sin(a);
      r += `<path d="M${n(x1 - 2)} ${n(y1 - 3)} L${n(x1 + 2)} ${n(y1 + 3)}" stroke="${cd}" stroke-width="1" opacity="0.35"/>`;
    }
    return r;
  };
  const manColor = isBlackColor(colors.primary) ? GRAY_HEADWEAR : colors.primary;
  const vanColor = isBlackColor(colors.secondary) || isBlackColor(colors.primary) ? GRAY_HEADWEAR : colors.secondary;
  // Mấn (khăn vành): vành to tròn, nhiều vòng quấn đều nhau, trơn màu
  const manVanh = (col: string) => {
    const c = col;
    let r = vanRing(c);
    // khăn vành: nhiều vòng quấn đều nhau
    for (let i = 1; i <= 5; i++) {
      const k = i / 6;
      const ox = 31 - 7 * k, oy = 24 + 16 * k, ex = 37 - 10 * k;
      r += `<path d="M${n(cx - ox)} 81 C${n(cx - ex)} ${n(46 + 8 * k)} ${n(cx - 21 + 6 * k)} ${n(oy)} ${cx} ${n(oy)} C${n(cx + 21 - 6 * k)} ${n(oy)} ${n(cx + ex)} ${n(46 + 8 * k)} ${n(cx + ox)} 81" stroke="${shade(c, -0.22)}" stroke-width="0.7" fill="none" opacity="0.55"/>`;
    }
    return r;
  };
  // Khăn vấn kiểu khăn lươn (khăn rí, Bắc Bộ): dải khăn cuộn tròn như con lươn, quấn 1–2 vòng
  // quanh đầu như một chiếc băng đô dày, nằm trên chân tóc trán; vẫn lộ chỏm tóc phía trên.
  const khanVan = (c: string) => {
    const cd = shade(c, -0.28), cl = shade(c, 0.22);
    // chỏm tóc phía trên khăn
    let r = `<path d="M${cx - 28} 72 C${cx - 31} 46 ${cx - 17} 35 ${cx} 35 C${cx + 17} 35 ${cx + 31} 46 ${cx + 28} 72 C${cx + 27} 60 ${cx + 16} 50 ${cx} 50 C${cx - 16} 50 ${cx - 27} 60 ${cx - 28} 72 Z" fill="${HAIR}"/>`;
    r += `<path d="M${cx - 14} 41 C${cx - 8} 37.5 ${cx + 2} 37 ${cx + 10} 39" stroke="#3A302C" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.8"/>`;
    // vòng khăn: tròn, dày, ôm từ mang tai bên này sang bên kia
    const outer = `M${cx - 31} 84 C${cx - 35} 60 ${cx - 21} 44 ${cx} 44 C${cx + 21} 44 ${cx + 35} 60 ${cx + 31} 84`;
    const inner = `L${cx + 24} 83 C${cx + 27} 64 ${cx + 16} 53 ${cx} 53 C${cx - 16} 53 ${cx - 27} 64 ${cx - 24} 83 Z`;
    r += `<path d="${outer} ${inner}" fill="${c}"/>`;
    // khối tròn: sáng ở mép trên, tối ở mép dưới
    r += `<path d="M${cx - 30} 72 C${cx - 31} 58 ${cx - 18} 46.5 ${cx} 46.5 C${cx + 18} 46.5 ${cx + 31} 58 ${cx + 30} 72" stroke="${cl}" stroke-width="2.2" fill="none" opacity="0.75" stroke-linecap="round"/>`;
    r += `<path d="M${cx - 25} 82 C${cx - 27.5} 65 ${cx - 16} 54.5 ${cx} 54.5 C${cx + 16} 54.5 ${cx + 27.5} 65 ${cx + 25} 82" stroke="${cd}" stroke-width="1.6" fill="none" opacity="0.7"/>`;
    // nếp cuộn chéo (khăn xoắn như con lươn)
    for (const t of [0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92]) {
      const ang = Math.PI * (1 - t);
      const xm = cx + 28 * Math.cos(ang), ym = 66 - 18 * Math.sin(ang);
      r += `<path d="M${n(xm - 2.6)} ${n(ym - 3.2)} Q${n(xm + 0.6)} ${n(ym)} ${n(xm + 1.8)} ${n(ym + 3.4)}" stroke="${cd}" stroke-width="1" fill="none" opacity="0.55"/>`;
    }
    return r;
  };
  // khăn vấn lấy tông sẫm của áo; áo đen thì dùng màu xám cho khỏi lẫn với tóc
  const khanColor = isBlackColor(colors.primary) ? GRAY_HEADWEAR : shade(colors.primary, -0.35);
  void vanColor;
  if (has('man_doi_dau')) headwear += manVanh(manColor);
  if (has('khan_van')) headwear += khanVan(khanColor);
  if (has('khan_dong')) {
    headwear += `<path d="M${cx - 30} 66 L${cx - 30} 44 Q${cx} 36 ${cx + 30} 44 L${cx + 30} 66 Q${cx} 58 ${cx - 30} 66 Z" fill="${INK}"/>`;
    for (const dx of [-20, -10, 0, 10, 20]) headwear += `<path d="M${cx + dx - 4} 44 L${cx + dx + 4} 62" stroke="#fff" stroke-opacity="0.18" stroke-width="1.2"/>`;
  }
  if (has('over_ear_headphones')) {
    headwear += `<path d="M${cx - 27} 78 Q${cx - 30} 36 ${cx} 34 Q${cx + 30} 36 ${cx + 27} 78" stroke="#2A2A2E" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    headwear += `<rect x="${cx - 34}" y="70" width="12" height="22" rx="5" fill="#2A2A2E"/><rect x="${cx + 22}" y="70" width="12" height="22" rx="5" fill="#2A2A2E"/>`;
    headwear += `<rect x="${cx - 32}" y="74" width="4" height="14" rx="2" fill="${colors.accent}"/><rect x="${cx + 28}" y="74" width="4" height="14" rx="2" fill="${colors.accent}"/>`;
  }
  if (has('beret_hat')) {
    headwear += `<path d="M${cx - 34} 58 Q${cx - 36} 34 ${cx - 2} 32 Q${cx + 36} 32 ${cx + 34} 54 Q${cx + 20} 62 ${cx - 6} 60 Q${cx - 24} 60 ${cx - 34} 58 Z" fill="${colors.accent}"/>`;
    headwear += `<path d="M${cx - 30} 56 Q${cx} 62 ${cx + 30} 52" stroke="#000" stroke-opacity="0.2" stroke-width="2" fill="none"/>`;
    headwear += `<rect x="${cx - 2}" y="27" width="4" height="7" rx="2" fill="${colors.accent}"/>`;
  }
  if (has('non_la')) {
    // Nón lá đội sát đầu: vành che trán, bóng vành đổ lên mặt, quai ôm theo quai hàm xuống dưới cằm
    headwear += `<path d="M${cx - 22} 66 Q${cx - 27} 98 ${cx} 110 Q${cx + 27} 98 ${cx + 22} 66" stroke="${colors.accent}" stroke-width="1.1" stroke-opacity="0.75" fill="none"/>`;
    headwear += `<path d="M${cx - 24} 66 Q${cx} 78 ${cx + 24} 66 L${cx + 24} 70 Q${cx} 82 ${cx - 24} 70 Z" fill="#000" opacity="0.1"/>`;
    headwear += `<path d="M${cx - 70} 68 L${cx} 12 L${cx + 70} 68 Q${cx} 80 ${cx - 70} 68 Z" fill="${STRAW}" stroke="${STRAW_DARK}" stroke-width="1.2"/>`;
    for (const dx of [-46, -23, 0, 23, 46]) headwear += `<path d="M${cx} 14 L${cx + dx} ${72 + Math.abs(dx) * -0.06}" stroke="${STRAW_DARK}" stroke-opacity="0.5" stroke-width="0.8"/>`;
    headwear += `<path d="M${cx - 53} 55 Q${cx} 63 ${cx + 53} 55 M${cx - 32} 38 Q${cx} 44 ${cx + 32} 38" stroke="${STRAW_DARK}" stroke-opacity="0.5" stroke-width="0.8" fill="none"/>`;
    headwear += `<path d="M${cx - 70} 68 Q${cx} 80 ${cx + 70} 68" stroke="${STRAW_DARK}" stroke-width="2" fill="none"/>`;
  }

  // ---------- Cổ: chuỗi ngọc ----------
  let neckItem = '';
  if (has('chuoi_ngoc')) {
    // Chuỗi ngọc hình chữ U vòng từ hai bên gáy xuống ngực; hạt đặt cách đều theo độ dài dây (không hở khe)
    const pts: { x: number; y: number }[] = [];
    for (let k = 0; k <= 200; k++) {
      const th = -1.62 + (3.24 * k) / 200;
      pts.push({ x: cx + 22 * Math.sin(th), y: 120 + 31 * Math.cos(th) });
    }
    const seg = [0];
    for (let k = 1; k < pts.length; k++) seg.push(seg[k - 1] + Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y));
    const L = seg[seg.length - 1];
    const count = Math.round(L / 5.2) + 1;
    let k = 0;
    for (let i = 0; i < count; i++) {
      const target = (L * i) / (count - 1);
      while (k < seg.length - 1 && seg[k + 1] < target) k++;
      if (i === 0 || i === count - 1) continue;
      const p = pts[k];
      neckItem += `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="2.5" fill="#FBF7EE" stroke="#CFC6B4" stroke-width="0.6"/>`;
    }
  }

  // ---------- Đồ cầm tay ----------
  const fan = (x: number, y: number, a0: number, a1: number, r: number, calligraphy: boolean) => {
    const ribs = Array.from({ length: 9 }, (_, i) => ((a0 + ((a1 - a0) * i) / 8) * Math.PI) / 180);
    const P = (a: number, rr: number) => `${n(x + rr * Math.cos(a))} ${n(y + rr * Math.sin(a))}`;
    let s2 = `<path d="M${x} ${y} L${P(ribs[0], r)} A${r} ${r} 0 0 1 ${P(ribs[8], r)} Z" fill="${IVORY}" stroke="${colors.accent}" stroke-width="1.5"/>`;
    for (const a of ribs) s2 += `<path d="M${x} ${y} L${P(a, r)}" stroke="${colors.accent}" stroke-opacity="0.6" stroke-width="0.8"/>`;
    const mid = ((a0 + a1) / 2) * (Math.PI / 180);
    if (calligraphy) {
      s2 += `<text x="${n(x + 0.62 * r * Math.cos(mid))}" y="${n(y + 0.62 * r * Math.sin(mid) + 4)}" font-family="serif" font-size="11" font-weight="bold" fill="${INK}" text-anchor="middle">Tâm</text>`;
    } else {
      s2 += `<path d="M${P(ribs[1], 0.6 * r)} A${0.6 * r} ${0.6 * r} 0 0 1 ${P(ribs[7], 0.6 * r)}" stroke="${colors.primary}" stroke-width="3" fill="none"/>`;
    }
    return s2;
  };
  // Túi: quai vắt qua bàn tay, thân túi treo bên dưới (bàn tay vẽ lại đè lên quai)
  const strawBag = (x: number, y: number) => {
    let s2 = `<path d="M${x - 11} ${y + 16} Q${x} ${y - 12} ${x + 11} ${y + 16}" stroke="${STRAW_DARK}" stroke-width="3" fill="none"/>`;
    s2 += `<path d="M${x - 20} ${y + 14} L${x + 20} ${y + 14} L${x + 16} ${y + 50} L${x - 16} ${y + 50} Z" fill="${STRAW}" stroke="${STRAW_DARK}" stroke-width="1.2"/>`;
    for (const dy of [22, 30, 38, 46]) s2 += `<path d="M${x - 19} ${y + dy} L${x + 19} ${y + dy}" stroke="${STRAW_DARK}" stroke-opacity="0.5" stroke-width="0.8"/>`;
    s2 += `<rect x="${x - 20}" y="${y + 14}" width="40" height="6" fill="${colors.accent}"/>`;
    return s2;
  };
  const toteBag = (x: number, y: number) => {
    let s2 = `<path d="M${x - 9} ${y + 18} Q${x - 10} ${y - 10} ${x} ${y - 10} Q${x + 10} ${y - 10} ${x + 9} ${y + 18}" stroke="#D8CFBE" stroke-width="3" fill="none"/>`;
    s2 += `<rect x="${x - 19}" y="${y + 16}" width="38" height="42" rx="2" fill="#F1EBDD" stroke="#CFC6B4" stroke-width="1"/>`;
    s2 += `<circle cx="${x}" cy="${y + 37}" r="7" fill="none" stroke="${colors.primary}" stroke-width="2"/>`;
    return s2;
  };
  const SKIN_LINE = '#C99B80';
  // bàn tay buông: thon dài như giọt nước, ngón cái áp vào trong
  const handDot = (h: { x: number; y: number }) =>
    `<path d="M${h.x - 6.5} ${h.y - 8} Q${h.x - 8.5} ${h.y + 4} ${h.x - 3.5} ${h.y + 11} Q${h.x} ${h.y + 14} ${h.x + 3.5} ${h.y + 11} Q${h.x + 8.5} ${h.y + 4} ${h.x + 6.5} ${h.y - 8} Z" fill="${skin}"/>`
    + `<path d="M${h.x + (h.x < cx ? 3 : -3)} ${h.y - 5} Q${h.x + (h.x < cx ? 5 : -5)} ${h.y + 1} ${h.x + (h.x < cx ? 3 : -3)} ${h.y + 5}" stroke="${SKIN_LINE}" stroke-opacity="0.55" stroke-width="1" fill="none"/>`;
  // bàn tay gập cầm quạt
  const handFist = (h: { x: number; y: number }) =>
    `<ellipse cx="${h.x}" cy="${h.y}" rx="8" ry="7" fill="${skin}"/><path d="M${h.x - 5} ${h.y + 1} Q${h.x} ${h.y + 5} ${h.x + 5} ${h.y + 1}" stroke="${SKIN_LINE}" stroke-opacity="0.5" stroke-width="1" fill="none"/>`;
  // hai tay khoanh: một khối liền, tay phải đặt trên tay trái
  const handsClasped = () =>
    `<path d="M${cx - 15} ${handL.y - 3} Q${cx - 16} ${handL.y + 7} ${cx - 6} ${handL.y + 9} L${cx + 7} ${handL.y + 8} Q${cx + 16} ${handL.y + 5} ${cx + 15} ${handL.y - 4} Q${cx + 12} ${handL.y - 10} ${cx} ${handL.y - 9} Q${cx - 12} ${handL.y - 9} ${cx - 15} ${handL.y - 3} Z" fill="${skin}"/>`
    + `<path d="M${cx - 11} ${handL.y - 1} Q${cx} ${handL.y - 6} ${cx + 12} ${handL.y - 2}" stroke="${SKIN_LINE}" stroke-opacity="0.55" stroke-width="1" fill="none"/>`
    + `<path d="M${cx - 7} ${handL.y + 4} Q${cx + 1} ${handL.y + 1} ${cx + 9} ${handL.y + 4}" stroke="${SKIN_LINE}" stroke-opacity="0.35" stroke-width="0.9" fill="none"/>`;
  const bagFn = has('tui_may_tre') ? strawBag : has('tote_bag') ? toteBag : null;

  let fanLayer = '';
  if (hasFan) {
    const calli = hasFanT && !hasFanG;
    fanLayer = wide
      ? fan(cx + 2, 244, -146, -40, 38, calli)          // quạt xoè lên từ hai bàn tay khoanh
      : fan(handR.x, handR.y, -150, -30, 36, calli);   // quạt xoè lên từ bàn tay gập trước ngực
  }
  let hands = '';
  let bagLayer = '';
  if (wide) {
    hands = handsClasped();
    // tay chắp chỉ cầm được một món: đang cầm quạt thì không vẽ túi
    if (bagFn && !hasFan) bagLayer = bagFn(cx, 250) + handsClasped();
  } else {
    hands = handDot(handL) + (bentArm ? handFist(handR) : handDot(handR));
    if (bagFn) {
      const h = hasFan ? handL : handR;
      bagLayer = bagFn(h.x, h.y) + handDot(h);
    }
  }

  // ---------- Nón quai thao đeo sau lưng (như ảnh Quan họ) ----------
  // mặt nón tròn phẳng nằm sau lưng, lộ một phần bên trái; dây quai lụa hồng vắt qua vai; tua quai thao buông dưới nón
  let nonBack = '';
  let nonStrap = '';
  if (has('non_quai_thao')) {
    const R = 66, ox = cx - sw + 14, oy = 232;
    nonBack += `<circle cx="${ox}" cy="${oy}" r="${R}" fill="${STRAW}" stroke="${STRAW_DARK}" stroke-width="1.5"/>`;
    nonBack += `<circle cx="${ox}" cy="${oy}" r="${R - 4}" fill="none" stroke="#B5473A" stroke-width="2" stroke-dasharray="7 5"/>`;
    for (const k of [0.78, 0.6, 0.42]) nonBack += `<circle cx="${ox}" cy="${oy}" r="${n(R * k)}" fill="none" stroke="${STRAW_DARK}" stroke-opacity="0.5" stroke-width="1"/>`;
    for (let i = 0; i < 18; i++) { const a = (i * 20 * Math.PI) / 180; nonBack += `<path d="M${n(ox + R * 0.42 * Math.cos(a))} ${n(oy + R * 0.42 * Math.sin(a))} L${n(ox + (R - 6) * Math.cos(a))} ${n(oy + (R - 6) * Math.sin(a))}" stroke="${STRAW_DARK}" stroke-opacity="0.25" stroke-width="0.8"/>`; }
    nonBack += `<path d="M${ox - 30} ${oy - 18} l8 -12 l8 12 l-8 12 Z M${ox - 34} ${oy + 30} l7 -10 l7 10 l-7 10 Z" fill="none" stroke="#3F8F5B" stroke-width="1.2"/>`;
    // tua quai thao vàng – xanh – đỏ buông dưới nón
    const tc = ['#E2B33F', '#3FA95B', '#C8102E', '#E2B33F'];
    for (let i = 0; i < 12; i++) nonBack += `<path d="M${ox + 14 + i * 2.2} ${oy + 40} L${ox + 12 + i * 2.6} ${oy + 92}" stroke="${tc[i % 4]}" stroke-width="1.4"/>`;
    nonBack += `<rect x="${ox + 11}" y="${oy + 36}" width="30" height="6" rx="2" fill="#2E2420"/>`;
    // dây quai lụa hồng vắt qua vai trái (phía người xem) buông dọc theo nách
    nonStrap += `<path d="M${cx - sw + 8} 126 Q${cx - sw + 2} 180 ${cx - sw + 6} 236" stroke="#E2557A" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    nonStrap += `<path d="M${cx - sw + 7} 130 Q${cx - sw + 1} 180 ${cx - sw + 5} 230" stroke="#fff" stroke-opacity="0.25" stroke-width="1.2" fill="none"/>`;
  }

  // ---------- Ánh vải ----------
  const sheen = 0.45;
  const defs = `<defs>
    <linearGradient id="${id('sheen')}" gradientUnits="userSpaceOnUse" x1="${cx - sw - 40}" y1="0" x2="${cx + sw + 40}" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.38" stop-color="#fff" stop-opacity="${n(sheen * 0.35)}"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.8" stop-color="#000" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.14"/>
    </linearGradient>
  </defs>`;

  // ---------- Ghép theo thứ tự vẽ ----------
  let s = defs;
  s += `<g transform="translate(40 10)">`;
  s += `<ellipse cx="${cx}" cy="534" rx="90" ry="10" fill="#000" opacity="0.1"/>`;
  s += `<g transform="translate(${cx} 106) scale(${nam ? 1.12 : 1.07}) translate(${-cx} -106)">${backHair}</g>`;
  if (back) s += `<path d="${back}" fill="${colors.primary}"/><path d="${back}" fill="#000" opacity="0.14"/>`;
  s += bottom;
  s += feet;
  s += nonBack;
  s += `<rect x="${cx - (nam ? 11 : 9)}" y="100" width="${nam ? 22 : 18}" height="24" fill="${skin}"/>`;
  s += `<path d="${body}" fill="${colors.primary}"/>`;
  s += `<path d="${body}" fill="url(#${id('sheen')})"/>`;
  s += details;
  s += `<path d="${sleeves}" fill="${colors.primary}"/>`;
  s += `<path d="${sleeves}" fill="url(#${id('sheen')})"/>`;
  s += `<path d="${sleeves}" fill="none" stroke="${dark}" stroke-opacity="0.35" stroke-width="1"/>`;
  if (!wide && kind !== 'ao-dai') {
    s += `<path d="M${cx - sw - 16} 214 L${cx - sw - 4} 212" stroke="#000" stroke-opacity="0.15" stroke-width="1.2"/>`;
  }
  s += cuffs;
  s += overDetails;
  s += nonStrap;
  if (collar === 'lap-linh') {
    // Cổ đứng (lập lĩnh): bản cổ cùng màu áo, mép trên lộ viền cổ lót trắng
    const fill = colors.primary; // cổ áo cùng vải thân áo
    s += `<path d="M${cx - 11} 106 Q${cx} 103 ${cx + 11} 106 L${cx + 12} 121 Q${cx} 124 ${cx - 12} 121 Z" fill="${fill}" stroke="${dark}" stroke-opacity="0.35" stroke-width="0.8"/>`;
    if (kind !== 'ao-dai') s += `<path d="M${cx - 10.5} 106.5 Q${cx} 103.5 ${cx + 10.5} 106.5" stroke="${IVORY}" stroke-width="2.4" fill="none"/>`;
  }
  s += neckItem;
  s += fanLayer;
  s += hands;
  s += bagLayer;
  s += frontHair ? `<g transform="translate(${cx} 106) scale(${nam ? 1.12 : 1.07}) translate(${-cx} -106)">${frontHair}</g>` : '';
  // nam vai rộng nên phóng to cả khối đầu ~12% (giữ điểm nối ở cổ) cho cân với thân
  const headScale = nam ? 1.12 : 1.07;
  s += `<g transform="translate(${cx} 106) scale(${headScale}) translate(${-cx} -106)">`;
  s += face;
  s += glasses;
  s += headwear;
  s += `</g>`;
  s += `</g>`;

  s += renderFlatZones(zone, kind);
  return s;
}

/* Làm sáng (amt > 0) hoặc tối (amt < 0) một màu hex. */
function shade(hex: string, amt: number): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const v = parseInt(m[1], 16);
  const ch = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) =>
    Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)),
  );
  return '#' + ch.map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('');
}

/* Kiểm tra màu đen/than chì/tối đậm để đổi sang màu xám cho khăn vấn và mấn đội đầu, tránh trùng màu tóc */
export function isBlackColor(hex: string): boolean {
  if (!hex) return false;
  const h = hex.trim().toLowerCase();
  if (h === 'black' || h === '#000' || h === '#000000') return true;
  const m = /^#?([0-9a-f]{6})$/i.exec(h);
  if (!m) return false;
  const v = parseInt(m[1], 16);
  const r = (v >> 16) & 255;
  const g = (v >> 8) & 255;
  const b = v & 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum < 58 && Math.max(r, g, b) < 70;
}

/* Chú thích vùng lõi / vùng remix, vẽ trong khung 400 x 580 (đã cộng lệch 40, 10). */
function renderFlatZones(zone: 'none' | 'vung_loi' | 'vung_remix', kind: GarmentKind): string {
  if (zone === 'none') return '';
  const X = (x: number) => x + 40, Y = (y: number) => y + 10;
  const cx = 160;
  const label = (x: number, y: number, w: number, text: string, col: string, lineTo: number) => {
    const right = lineTo < x; // đường nối sang trái
    return `<g transform="translate(${x}, ${y})">`
      + `<rect x="0" y="0" width="${w}" height="22" rx="6" fill="${col}" opacity="0.95"/>`
      + `<text x="${w / 2}" y="14" fill="#FFFFFF" font-size="8.5" font-weight="bold" text-anchor="middle">${text}</text>`
      + (right
        ? `<line x1="0" y1="11" x2="${lineTo - x}" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2"/>`
        : `<line x1="${w}" y1="11" x2="${lineTo - x}" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2"/>`)
      + `</g>`;
  };
  let s = `<g id="zone-annotations">`;
  if (zone === 'vung_loi') {
    const col = '#C0392B';
    s += `<ellipse cx="${X(cx)}" cy="${Y(122)}" rx="24" ry="14" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2"/>`;
    const t1 = kind === 'ao-tu-than' ? '🔒 Vạt trước mở' : kind === 'ao-giao-linh' ? '🔒 Cổ giao lĩnh' : kind === 'ao-nhat-binh' ? '🔒 Cổ nhật bình' : '🔒 Cổ lập lĩnh bất biến';
    s += label(6, Y(111), 112, t1, col, X(cx) - 24);
    s += `<ellipse cx="${X(cx + 18)}" cy="${Y(176)}" rx="26" ry="44" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2"/>`;
    const t2 = kind === 'ao-tu-than' ? '🔒 Yếm & Thắt lưng bao' : kind === 'ao-nhat-binh' ? '🔒 Hai dải cổ buông' : kind === 'ao-giao-linh' ? '🔒 Vạt chéo phải' : '🔒 5 Cúc Ngũ Thường';
    s += label(274, Y(165), 120, t2, col, X(cx + 44));
    s += `<rect x="${X(cx - 45)}" y="${Y(250)}" width="90" height="150" rx="8" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="5 3"/>`;
    const t3 = kind === 'ao-tu-than' ? '🔒 Tứ thân phụ mẫu' : kind === 'ao-dai' ? '🔒 Phom tà dài thướt tha' : '🔒 Cấu trúc ngũ thân';
    s += label(6, Y(314), 114, t3, col, X(cx - 45));
  } else {
    const col = '#C2710C';
    s += `<ellipse cx="${X(cx)}" cy="${Y(66)}" rx="44" ry="40" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2"/>`;
    s += label(268, Y(54), 126, '⚡ Nón · kính · tai nghe', col, X(cx + 44));
    // đồ cầm tay: áo tay thụng thì hai tay chắp trước bụng; áo tay chẽn thì bàn tay phải (phía người xem) buông cạnh hông
    const wideK = kind === 'ao-tac' || kind === 'ao-nhat-binh' || kind === 'ao-giao-linh';
    if (wideK) {
      s += `<ellipse cx="${X(cx)}" cy="${Y(250)}" rx="34" ry="26" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2"/>`;
      s += label(268, Y(250) - 11, 112, '⚡ Quạt · túi cầm tay', col, X(cx + 34));
    } else {
      s += `<ellipse cx="${X(cx + 60)}" cy="${Y(310)}" rx="28" ry="30" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2"/>`;
      s += label(292, Y(310) - 11, 104, '⚡ Quạt · túi cầm tay', col, X(cx + 88));
    }
    s += `<ellipse cx="${X(cx)}" cy="${Y(524)}" rx="56" ry="16" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2"/>`;
    s += label(268, Y(513), 120, '⚡ Giày · guốc · sneaker', col, X(cx + 56));
  }
  s += `</g>`;
  return s;
}

export interface RenderFigureOptions {
  gender: 'female' | 'male';
  costumeId: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  accessoryIds: string[];
  hairId?: string;
  zone: 'none' | 'vung_loi' | 'vung_remix';
  uid: string;
}

// Nhân vật kiểu phẳng. Muốn quay lại kiểu cũ: đổi thành renderFigureClassic(opts).
export function renderFigure(opts: RenderFigureOptions): string {
  return renderFlatFigure(opts);
}

export function renderFigureClassic(opts: RenderFigureOptions): string {
  const { gender, costumeId, palette, accessoryIds, hairId, zone, uid } = opts;
  const skel = gender === 'female' ? FEMALE_SKELETON : MALE_SKELETON;
  const spec = COSTUME_SPECS[costumeId] || COSTUME_SPECS['ao_dai_tan_thoi'];

  // Colors:
  // Viền áo (stroke) = primary tối đi 32–38%
  const stroke = adjustHex(palette.primary, -0.35);
  // Da nữ #F0CFB2 (bóng #DDB08F, nét #C18E6C); da nam #E7C09E (bóng #CF9F7B, nét #B7835F)
  const skin = gender === 'female' ? '#F0CFB2' : '#E7C09E';
  const skinShadow = gender === 'female' ? '#DDB08F' : '#CF9F7B';
  const skinStroke = gender === 'female' ? '#C18E6C' : '#B7835F';

  const colors: GarmentColors = {
    primary: palette.primary,
    secondary: palette.secondary,
    accent: palette.accent,
    stroke,
    skin,
    skinShadow,
    skinStroke,
  };

  // Check headwear
  const isHeadCovered = accessoryIds.some((id) =>
    ['khan_dong', 'khan_van', 'man_doi_dau', 'non_la', 'beret'].includes(id)
  );

  // Arms and props calculations
  const hasFan = accessoryIds.some((id) => id === 'quat_giay' || id === 'quat_thu_phap');
  const hasBag = accessoryIds.some((id) => id === 'tote_bag' || id === 'tui_may_tre');

  const rightArm = computeArmPoints('right', gender, spec.sleeve, hasFan, hasBag, spec.type);
  const leftArm = computeArmPoints('left', gender, spec.sleeve, hasFan, hasBag, spec.type);

  // Thân áo tô bằng linearGradient ngang: primary sáng 14% → primary → primary tối 14%
  const gradLight = adjustHex(palette.primary, 0.14);
  const gradDark = adjustHex(palette.primary, -0.14);

  let svgContent = '';

  // 0. <defs>
  svgContent += `<defs>
    <linearGradient id="${uid}-bodyGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${gradLight}" />
      <stop offset="50%" stop-color="${palette.primary}" />
      <stop offset="100%" stop-color="${gradDark}" />
    </linearGradient>
    <radialGradient id="${uid}-nonLaGrad" cx="42%" cy="30%" r="68%">
      <stop offset="0%" stop-color="#FFFDF2" />
      <stop offset="45%" stop-color="#F5E8C8" />
      <stop offset="85%" stop-color="#EADBBA" />
      <stop offset="100%" stop-color="#D4C299" />
    </radialGradient>
    <radialGradient id="${uid}-nonLaBrimGrad" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#EDE0BE" />
      <stop offset="100%" stop-color="#C7B283" />
    </radialGradient>
  </defs>`;

  // 1. Tóc sau
  svgContent += renderBackHair(gender, hairId, skel, colors.accent, gender === 'female' ? false : isHeadCovered);
  if (gender === 'female') svgContent += femaleHeadBack(skel, accessoryIds, hairId);

  // 2. Quần hoặc Váy (Áo tứ thân)
  svgContent += renderPantsOrSkirt(spec, gender, skel, colors, uid);

  // 3. Cổ (da) + bóng dưới cằm
  svgContent += renderNeckAndCollarSkin(skel, colors);

  // 4. Thân áo (Tà sau trước, tà trước đè lên, khuy, cổ, yếm/đai)
  svgContent += renderTorsoGarment(spec, gender, skel, colors, uid);

  // 5. Chuỗi ngọc (nếu có)
  const hasPearls = accessoryIds.includes('chuoi_ngoc');
  svgContent += renderJewelry(skel, colors, hasPearls);

  // 6. Tay áo (Nhật Bình chỉ chắp tay khi KHÔNG có quạt và KHÔNG có túi; có quạt hoặc túi thì chuyển sang tay thụng buông xuống như áo tấc)
  const isNhatBinhClasped = spec.id === 'ao_nhat_binh' && !hasBag;
  // Áo Tấc (nữ): tay áo + bàn tay vẽ riêng (chắp tay trước bụng, hoặc giơ tay phải cầm quạt)
  const isFemaleAoTac = gender === 'female' && spec.type === 'tac';
  const femaleWide = gender === 'female' && (spec.type === 'tac' || spec.type === 'nhat');
  const sleeveColors = {
    fill: `url(#${uid}-bodyGrad)`,
    stroke,
    accent: palette.accent,
    dark: adjustHex(palette.primary, -0.4),
    stripes: spec.type === 'nhat' ? ['#2E7D5B', '#F4EFE4', palette.accent, '#2F3F8F', '#F4EFE4', '#C23B2E'] : undefined,
  };
  svgContent += femaleWide
    ? (isNhatBinhClasped ? femaleNhatBinhClasp(skel, sleeveColors) : isFemaleAoTac ? femaleAoTacSleeves(skel, sleeveColors, false) : femaleWideSleevesHang(skel, sleeveColors))
    : renderSleeves(spec, gender, skel, colors, rightArm, leftArm, hasFan, hasBag, uid);

  // 7. Quạt (vẽ trước rồi bàn tay nắm đè lên cán - tuyệt đối không vẽ khi đang chắp tay)
  // Nhật Bình chắp tay mà cầm quạt: quạt xòe lên từ chỗ hai cửa tay gặp nhau (tay giấu trong ống áo)
  // Nhật Bình buông tay (khi đeo túi) mà cầm quạt: quạt vẽ sau cửa tay, xòe lên từ nắm tay phải (không rủ xuống)
  const isNhatBinhHangFan = spec.id === 'ao_nhat_binh' && !isNhatBinhClasped && hasFan;
  svgContent += isNhatBinhClasped && hasFan
    ? renderFan(accessoryIds, { ...rightArm, W: { x: 200, y: skel.shY + 152 }, isFoldedFan: false, isWideFan: true }, false)
    : isNhatBinhHangFan ? '' : renderFan(accessoryIds, rightArm, isNhatBinhClasped);

  // 8. Túi (quai móc qua cổ tay, túi treo bên dưới - tuyệt đối không vẽ khi đang chắp tay)
  svgContent += renderBags(accessoryIds, leftArm, isNhatBinhClasped);

  // 9. Bàn tay
  svgContent += isFemaleAoTac
    ? femaleAoTacHands(skel, { base: skin, line: skinStroke }, hasFan)
    : renderHands(spec, gender, colors, rightArm, leftArm, hasFan, hasBag);
  if (femaleWide && !isNhatBinhClasped && !isFemaleAoTac) svgContent += femaleWideSleevesHangFront(skel, sleeveColors);
  if (isNhatBinhHangFan) svgContent += renderFan(accessoryIds, { ...rightArm, W: { x: rightArm.W.x, y: rightArm.W.y + 9 }, isFoldedFan: false, isWideFan: true }, false);

  // 10. Đầu và mặt (Khuôn mặt, mắt, mũi, miệng, tai, má hồng nữ, tóc nam BaseHair & TopHair, búi tóc & trâm 3D)
  const hasHairPin = accessoryIds.includes('tram_cai_toc');
  svgContent += gender === 'female'
    ? femaleHead(skel, accessoryIds, hairId, { base: skin, sh: skinShadow, line: skinStroke }, uid)
    : renderHeadAndFace(gender, hairId, skel, colors, isHeadCovered, hasHairPin);

  // 11. Đồ đội đầu & phụ kiện trên mặt (Khăn, Mấn, Nón lá 3D, Beret, Tai nghe, Kính râm)
  svgContent += renderHeadwear(gender === 'female' ? accessoryIds.filter(id => !['khan_van', 'man_doi_dau', 'non_la'].includes(id)) : accessoryIds, gender, skel, colors, uid);

  // 12. Giày (Sneaker, Hài thêu, Guốc mộc)
  svgContent += renderFootwear(accessoryIds, gender, skel, colors);

  // 13. Chú thích vùng lõi / remix (khi zone !== 'none')
  svgContent += renderZoneAnnotations(zone, spec, skel);

  return svgContent;
}

export interface CharacterFigureProps {
  gender: 'female' | 'male';
  costumeId: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  accessoryIds: string[];
  hairId?: string;
  zone: 'none' | 'vung_loi' | 'vung_remix';
  uid?: string;
  className?: string;
  style?: React.CSSProperties;
  /** phông nền vẽ tràn ra ngoài khung (chỉ dùng ở sân khấu chính) */
  sceneId?: SceneId;
}

export const CharacterFigure: React.FC<CharacterFigureProps> = ({
  gender,
  costumeId,
  palette,
  accessoryIds,
  hairId,
  zone,
  uid: propUid,
  className,
  style,
  sceneId,
}) => {
  const autoId = useId().replace(/:/g, '');
  const uid = propUid || `fig-${autoId}`;

  const innerSvgHtml = renderFigure({
    gender,
    costumeId,
    palette,
    accessoryIds,
    hairId,
    zone,
    uid,
  });

  const sceneHtml = sceneId && sceneId !== 'studio' ? renderScene(sceneId, `${uid}-scene`) : '';

  return (
    <svg
      viewBox="0 4 400 540"
      className={className}
      style={sceneHtml ? { ...style, overflow: 'visible', filter: 'none' } : style}
      dangerouslySetInnerHTML={{ __html: sceneHtml + innerSvgHtml }}
    />
  );
};

// ================= PHÔNG NỀN (SCENE) =================
// Phông nền vẽ phẳng cho nhân vật (cùng hệ toạ độ viewBox 0 0 400 580, mặt đất y = 520).
// Phông được vẽ tràn rộng ra ngoài khung (x -1100..1500, y -500..1200) để khi SVG nhân vật
// đặt overflow: visible thì phông phủ kín cả sân khấu trên PC (màn ngang) lẫn điện thoại (màn dọc),
// mà mặt đất luôn khớp đúng chân nhân vật ở mọi kích thước.

export type SceneId = 'studio' | 'dinh_lang' | 'pho_co' | 'vuon_dao' | 'ho_guom';

export const SCENES: { id: SceneId; name: string; emoji: string }[] = [
  { id: 'studio', name: 'Studio', emoji: '🪞' },
  { id: 'dinh_lang', name: 'Sân đình', emoji: '🏯' },
  { id: 'pho_co', name: 'Phố cổ Hội An', emoji: '🏮' },
  { id: 'vuon_dao', name: 'Vườn đào Tết', emoji: '🌸' },
  { id: 'ho_guom', name: 'Hồ Gươm thu', emoji: '🍂' },
];

// Mẫu dịp → phông tự chọn
export const TEMPLATE_SCENE: Record<string, SceneId> = {
  khai_giang: 'ho_guom',
  hoi_lang_kinh_bac: 'dinh_lang',
  pho_co_den_long: 'pho_co',
  tet_du_xuan: 'vuon_dao',
  nang_tho_thu_ha_noi: 'ho_guom',
  tham_quan_di_tich: 'dinh_lang',
  le_chua_dau_nam: 'dinh_lang',
};

const X0 = -1100, X1 = 1500, Y0 = -500, Y1 = 1200, GY = 520;
const FW = X1 - X0;

function dinhLang(uid: string): string {
  let s = `<defs><linearGradient id="${uid}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="${GY}"><stop offset="0" stop-color="#E3EEEE"/><stop offset="1" stop-color="#F7EFE0"/></linearGradient></defs>`;
  s += `<rect x="${X0}" y="${Y0}" width="${FW}" height="${GY - Y0}" fill="url(#${uid}-sky)"/>`;
  s += `<g fill="#FFFFFF" opacity="0.7">`;
  for (const [x, y] of [[300, 70], [80, 110], [-380, 40], [720, 20], [-760, 100], [1050, 90]]) s += `<ellipse cx="${x}" cy="${y}" rx="46" ry="12"/><ellipse cx="${x + 30}" cy="${y - 8}" rx="26" ry="10"/>`;
  s += `</g>`;
  // dây cờ ngũ sắc
  const flagCols = ['#C8473C', '#E2B33F', '#3F8F6B', '#3D6FA8', '#F2EDE2'];
  for (let seg = -3; seg <= 3; seg++) {
    const ox = seg * 400;
    s += `<path d="M${ox} 40 Q${ox + 200} 90 ${ox + 400} 40" stroke="#8C6D53" stroke-width="1" fill="none" opacity="0.6"/>`;
    for (let i = 0; i < 13; i++) {
      const lx = 15 + i * 30, t = lx / 400, y = 40 + 50 * 4 * t * (1 - t) * 0.5;
      s += `<path d="M${ox + lx} ${y} L${ox + lx + 14} ${y + 1} L${ox + lx + 7} ${y + 16} Z" fill="${flagCols[(i + seg + 10) % 5]}" opacity="0.8"/>`;
    }
  }
  // tường hoa thấp hai bên sân
  const wall = (a: number, b: number) => `<rect x="${a}" y="440" width="${b - a}" height="${GY - 440}" fill="#EADBC4"/><rect x="${a}" y="432" width="${b - a}" height="10" fill="#9A5A40"/>`
    + Array.from({ length: Math.floor((b - a) / 60) }, (_, i) => `<rect x="${a + 20 + i * 60}" y="458" width="26" height="26" rx="13" fill="none" stroke="#C9AD8C" stroke-width="3"/>`).join('');
  s += wall(X0, 40) + wall(360, X1);
  // đình
  const roof = '#7A4A36', roofD = '#5E3828', wood = '#8E5B3D';
  s += `<g opacity="0.92">`;
  s += `<rect x="70" y="300" width="260" height="${GY - 300}" fill="#E9DCC6"/>`;
  for (const x of [92, 140, 188, 212, 260, 308]) s += `<rect x="${x - 4}" y="300" width="8" height="${GY - 300}" fill="${wood}" opacity="0.75"/>`;
  s += `<rect x="70" y="300" width="260" height="${GY - 300}" fill="#3A2A20" opacity="0.18"/>`;
  s += `<path d="M30 305 Q60 300 90 270 L310 270 Q340 300 370 305 Q382 298 388 284 Q372 296 352 292 L330 262 L70 262 L48 292 Q28 296 12 284 Q18 298 30 305 Z" fill="${roof}"/>`;
  s += `<path d="M70 262 L330 262 L314 244 L86 244 Z" fill="${roofD}"/>`;
  s += `<path d="M86 244 Q100 236 112 214 L288 214 Q300 236 314 244 Q322 238 326 226 Q314 234 300 230 L284 206 L116 206 L100 230 Q86 234 74 226 Q78 238 86 244 Z" fill="${roof}"/>`;
  s += `<path d="M116 206 L284 206 L276 196 L124 196 Z" fill="${roofD}"/>`;
  s += `<path d="M190 196 Q200 186 210 196" stroke="${roofD}" stroke-width="3" fill="none"/><circle cx="200" cy="186" r="4" fill="#C9A24A"/>`;
  s += `</g>`;
  // cây đa
  const tree = (x: number, k: number) => `<path d="M${x - 8} ${GY} C${x - 4} ${GY - 50} ${x - 10} ${GY - 100} ${x} ${GY - 140} L${x + 12} ${GY - 140} C${x + 18} ${GY - 100} ${x + 14} ${GY - 50} ${x + 20} ${GY} Z" fill="#6B4A35"/>`
    + `<g fill="#5E8A5A" opacity="0.95"><circle cx="${x - 26 * k}" cy="${GY - 190}" r="46"/><circle cx="${x + 24 * k}" cy="${GY - 220}" r="50"/><circle cx="${x + 64 * k}" cy="${GY - 175}" r="34"/><circle cx="${x - 6 * k}" cy="${GY - 140}" r="34"/></g>`
    + `<g fill="#6E9C68" opacity="0.8"><circle cx="${x + 12 * k}" cy="${GY - 230}" r="26"/><circle cx="${x - 28 * k}" cy="${GY - 202}" r="22"/></g>`;
  s += tree(-110, 1) + tree(500, -1) + tree(-470, 1) + tree(860, -1);
  // sân gạch
  s += `<rect x="${X0}" y="${GY}" width="${FW}" height="${Y1 - GY}" fill="#D9B79A"/>`;
  for (let y = GY + 12; y < Y1; y += 14) s += `<path d="M${X0} ${y} L${X1} ${y}" stroke="#C49C7E" stroke-width="1"/>`;
  for (let x = X0; x < X1 + 200; x += 28) s += `<path d="M${x} ${GY} L${x - 30} 580 L${x - 30} ${Y1}" stroke="#C49C7E" stroke-width="1" fill="none"/>`;
  s += `<rect x="${X0}" y="${Y0}" width="${FW}" height="${Y1 - Y0}" fill="#F6F1E8" opacity="0.22"/>`;
  return s;
}

function phoCo(uid: string): string {
  let s = `<defs><linearGradient id="${uid}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="${GY}"><stop offset="0" stop-color="#1F2845"/><stop offset="1" stop-color="#5A4A6A"/></linearGradient>
  <radialGradient id="${uid}-glow"><stop offset="0" stop-color="#FFD58A" stop-opacity="0.55"/><stop offset="1" stop-color="#FFD58A" stop-opacity="0"/></radialGradient></defs>`;
  s += `<rect x="${X0}" y="${Y0}" width="${FW}" height="${GY - Y0}" fill="url(#${uid}-sky)"/>`;
  for (let i = 0; i < 60; i++) { const x = X0 + ((i * 337) % FW), y = -280 + ((i * 151) % 400); s += `<circle cx="${x}" cy="${y}" r="1.2" fill="#FFFFFF" opacity="0.6"/>`; }
  const house = (x: number, w: number, top: number, wallC = '#E7B95A') => {
    let h = `<rect x="${x}" y="${top}" width="${w}" height="${GY - top}" fill="${wallC}"/>`;
    h += `<rect x="${x}" y="${top}" width="${w}" height="${GY - top}" fill="#7A4E1E" opacity="0.12"/>`;
    h += `<path d="M${x - 8} ${top + 4} L${x + w / 2} ${top - 26} L${x + w + 8} ${top + 4} Z" fill="#7A3E2B"/>`;
    h += `<path d="M${x - 8} ${top + 4} L${x + w + 8} ${top + 4}" stroke="#5C2C1E" stroke-width="3"/>`;
    h += `<rect x="${x + w * 0.2}" y="${GY - 90}" width="${w * 0.6}" height="90" fill="#6B3A22"/>`;
    for (let i = 1; i < 4; i++) h += `<path d="M${x + w * 0.2 + (w * 0.6 * i) / 4} ${GY - 90} L${x + w * 0.2 + (w * 0.6 * i) / 4} ${GY}" stroke="#4E2915" stroke-width="1.2"/>`;
    h += `<rect x="${x + w * 0.25}" y="${top + 40}" width="${w * 0.5}" height="34" fill="#FFD27A" opacity="0.9"/>`;
    h += `<path d="M${x + w * 0.5} ${top + 40} L${x + w * 0.5} ${top + 74}" stroke="#7A4E1E" stroke-width="1.5"/>`;
    return h;
  };
  s += `<g opacity="0.35"><rect x="100" y="320" width="200" height="${GY - 320}" fill="#C99A4A"/><path d="M92 322 L200 290 L308 322 Z" fill="#6B3A2B"/></g>`;
  const tops = [230, 250, 215, 240, 225];
  const walls = ['#E7B95A', '#EAC873', '#DDAA4E', '#E3BE6A'];
  for (let k = 0; k < 9; k++) s += house(-20 - k * 128, 110, tops[k % 5], walls[k % 4]);
  for (let k = 0; k < 10; k++) s += house(310 + k * 128, 110, tops[(k + 2) % 5], walls[(k + 1) % 4]);
  const lanCols = ['#D9412E', '#F0A13A', '#E8C547', '#C2366B', '#3F9E7A'];
  for (let seg = -3; seg <= 3; seg++) {
    const ox = seg * 400;
    for (const [y0, sag] of [[150, 40], [215, 30]] as const) {
      s += `<path d="M${ox} ${y0} Q${ox + 200} ${y0 + sag * 2} ${ox + 400} ${y0}" stroke="#2A1E17" stroke-width="1" fill="none" opacity="0.7"/>`;
      for (let i = 0; i < 9; i++) {
        const lx = 22 + i * 45, t = lx / 400, y = y0 + sag * 2 * 2 * t * (1 - t) + 8, x = ox + lx;
        const c = lanCols[(i + seg + 10 + (y0 > 160 ? 2 : 0)) % 5];
        s += `<circle cx="${x}" cy="${y + 6}" r="22" fill="url(#${uid}-glow)"/>`;
        s += `<path d="M${x} ${y - 6} L${x} ${y - 2}" stroke="#2A1E17" stroke-width="1"/>`;
        s += `<ellipse cx="${x}" cy="${y + 6}" rx="9" ry="11" fill="${c}"/>`;
        s += `<path d="M${x - 4} ${y - 3} L${x + 4} ${y - 3} M${x - 4} ${y + 15} L${x + 4} ${y + 15}" stroke="#7A4E1E" stroke-width="2"/>`;
        s += `<path d="M${x} ${y + 17} L${x} ${y + 24}" stroke="${c}" stroke-width="1.2"/>`;
      }
    }
  }
  s += `<rect x="${X0}" y="${GY}" width="${FW}" height="${Y1 - GY}" fill="#4A4250"/>`;
  for (let y = GY + 10; y < 900; y += 12) for (let x = X0 + ((y / 12) % 2 ? 0 : 14); x < X1; x += 28) s += `<rect x="${x + 2}" y="${y - 8}" width="24" height="9" rx="3" fill="#5A5262"/>`;
  s += `<rect x="${X0}" y="${Y0}" width="${FW}" height="${Y1 - Y0}" fill="#F6F1E8" opacity="0.08"/>`;
  return s;
}

function vuonDao(uid: string): string {
  let s = `<defs><linearGradient id="${uid}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="${GY}"><stop offset="0" stop-color="#FBE6E4"/><stop offset="1" stop-color="#F7EFE0"/></linearGradient></defs>`;
  s += `<rect x="${X0}" y="${Y0}" width="${FW}" height="${GY - Y0}" fill="url(#${uid}-sky)"/>`;
  // tường thấp mái ngói hai bên + nguyệt môn ở giữa
  s += `<rect x="${X0}" y="300" width="${FW}" height="${GY - 300}" fill="#F1E4D3"/>`;
  s += `<rect x="${X0}" y="290" width="${FW}" height="12" fill="#A65E45"/>`;
  s += `<circle cx="200" cy="330" r="150" fill="#FBEDE8"/>`;
  s += `<circle cx="200" cy="330" r="150" fill="none" stroke="#E7D3C0" stroke-width="22"/>`;
  for (const x of [-560, -320, 720, 960]) s += `<rect x="${x}" y="360" width="70" height="70" rx="35" fill="none" stroke="#DCC6AE" stroke-width="5"/>`;
  // câu đối
  for (const x of [52, 330]) {
    s += `<rect x="${x}" y="170" width="18" height="230" rx="2" fill="#C8302E"/>`;
    s += `<rect x="${x + 2}" y="172" width="14" height="226" fill="none" stroke="#E5B54E" stroke-width="0.8"/>`;
    for (let i = 0; i < 7; i++) s += `<path d="M${x + 5} ${190 + i * 30} q4 -5 8 0 M${x + 9} ${186 + i * 30} l0 10" stroke="#E5B54E" stroke-width="1.4" fill="none"/>`;
  }
  // cành đào
  const branchSet = (ox: number, flip: number) => {
    const X = (v: number) => ox + flip * v;
    let b = `<path d="M${X(-260)} 40 C${X(-120)} 50 ${X(-40)} 60 ${X(120)} 90 M${X(60)} 66 C${X(70)} 40 ${X(90)} 30 ${X(110)} 34 M${X(90)} 76 C${X(110)} 110 ${X(100)} 130 ${X(130)} 150 M${X(-120)} 50 C${X(-100)} 90 ${X(-90)} 120 ${X(-60)} 140" stroke="#6B4A3A" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    for (const [x, y] of [[120, 90], [110, 34], [130, 150], [80, 64], [100, 120], [40, 66], [150, 110], [60, 40], [-60, 140], [-100, 80], [-160, 46], [-20, 58], [-80, 110], [-220, 44]] as const) {
      for (let k = 0; k < 5; k++) { const a = (k * 72 - 90) * Math.PI / 180; b += `<circle cx="${(X(x) + 5 * Math.cos(a)).toFixed(1)}" cy="${(y + 5 * Math.sin(a)).toFixed(1)}" r="4.2" fill="#F2A3B5"/>`; }
      b += `<circle cx="${X(x)}" cy="${y}" r="2.2" fill="#D9536F"/>`;
    }
    return b;
  };
  s += branchSet(0, 1) + branchSet(400, -1);
  for (const [x, y] of [[170, 200], [240, 260], [90, 300], [320, 330], [210, 160], [-60, 240], [470, 210], [-200, 330], [600, 300]]) s += `<ellipse cx="${x}" cy="${y}" rx="3" ry="1.8" fill="#F2A3B5" opacity="0.8" transform="rotate(30 ${x} ${y})"/>`;
  // sân
  s += `<rect x="${X0}" y="${GY}" width="${FW}" height="${Y1 - GY}" fill="#EAD9C6"/>`;
  s += `<path d="M${X0} ${GY} L${X1} ${GY}" stroke="#D9C2A8" stroke-width="2"/>`;
  for (const x of [70, 330, -200, 600, -480, 880]) {
    s += `<path d="M${x - 16} ${GY - 22} L${x + 16} ${GY - 22} L${x + 12} ${GY + 6} L${x - 12} ${GY + 6} Z" fill="#B5553A"/>`;
    s += `<circle cx="${x}" cy="${GY - 42}" r="22" fill="#5E8A5A"/>`;
    for (const [dx, dy] of [[-10, -46], [6, -54], [12, -38], [-4, -34], [-14, -32]]) s += `<circle cx="${x + dx}" cy="${GY + dy}" r="3" fill="#F0A13A"/>`;
  }
  return s;
}

function hoGuom(uid: string): string {
  let s = `<defs><linearGradient id="${uid}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-300" x2="0" y2="400"><stop offset="0" stop-color="#F3E6CF"/><stop offset="1" stop-color="#F8EEDD"/></linearGradient>
  <linearGradient id="${uid}-wat" gradientUnits="userSpaceOnUse" x1="0" y1="380" x2="0" y2="${GY}"><stop offset="0" stop-color="#A9C3BE"/><stop offset="1" stop-color="#8FAFAA"/></linearGradient></defs>`;
  s += `<rect x="${X0}" y="${Y0}" width="${FW}" height="${GY - Y0}" fill="url(#${uid}-sky)"/>`;
  // hàng cây bờ xa (mờ)
  s += `<g fill="#B9A86A" opacity="0.55">`;
  for (let x = X0; x < X1; x += 46) s += `<ellipse cx="${x}" cy="${372 - ((x * 7) % 13)}" rx="34" ry="${18 + ((x * 3) % 9)}"/>`;
  s += `</g><rect x="${X0}" y="372" width="${FW}" height="10" fill="#A79A66" opacity="0.5"/>`;
  // mặt hồ
  s += `<rect x="${X0}" y="380" width="${FW}" height="${GY - 380}" fill="url(#${uid}-wat)"/>`;
  for (let i = 0; i < 40; i++) { const x = X0 + ((i * 263) % FW), y = 392 + ((i * 37) % 110); s += `<path d="M${x} ${y} l${18 + (i % 3) * 8} 0" stroke="#D6E4E0" stroke-width="1.4" opacity="0.7" stroke-linecap="round"/>`; }
  // Tháp Rùa trên gò nhỏ giữa hồ
  const tx = 300, ty = 412;
  s += `<g transform="translate(372 ${ty + 6}) scale(1.35) translate(${-tx} ${-(ty + 6)})">`;
  s += `<ellipse cx="${tx}" cy="${ty + 6}" rx="36" ry="6" fill="#6F8F5A"/>`;
  s += `<g fill="#E9DCC0" stroke="#8C7A5A" stroke-width="0.8">`;
  s += `<rect x="${tx - 16}" y="${ty - 22}" width="32" height="26"/><rect x="${tx - 12}" y="${ty - 40}" width="24" height="18"/><rect x="${tx - 8}" y="${ty - 54}" width="16" height="14"/></g>`;
  for (const [y, w] of [[ty - 22, 20], [ty - 40, 16], [ty - 54, 12]] as const) s += `<path d="M${tx - w} ${y} L${tx + w} ${y} L${tx + w - 4} ${y - 4} L${tx - w + 4} ${y - 4} Z" fill="#8C5A3C"/>`;
  s += `<path d="M${tx} ${ty - 58} L${tx} ${ty - 66}" stroke="#8C5A3C" stroke-width="1.5"/>`;
  for (const dx of [-8, 0, 8]) s += `<path d="M${tx + dx - 3} ${ty - 2} Q${tx + dx} ${ty - 10} ${tx + dx + 3} ${ty - 2}" fill="#8C7A5A" opacity="0.6"/>`;
  s += `<path d="M${tx - 16} ${ty + 10} L${tx + 16} ${ty + 10}" stroke="#E9DCC0" stroke-width="1" opacity="0.5"/>`;
  s += `</g>`;
  // cầu Thê Húc đỏ cong bên trái, nối ra đền Ngọc Sơn
  s += `<path d="M-520 470 Q-300 400 -60 430" stroke="#C0392B" stroke-width="7" fill="none"/>`;
  s += `<path d="M-520 476 Q-300 406 -60 436" stroke="#8E2A20" stroke-width="2" fill="none"/>`;
  for (let i = 0; i <= 20; i++) { const t = i / 20; const x = -520 + 460 * t; const y = (1 - t) * (1 - t) * 470 + 2 * (1 - t) * t * 400 + t * t * 430; s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l0 -10" stroke="#C0392B" stroke-width="2"/>`; }
  s += `<path d="M-520 460 Q-300 390 -60 420" stroke="#C0392B" stroke-width="2" fill="none"/>`;
  s += `<g fill="#B5523E"><rect x="-60" y="392" width="70" height="40"/><path d="M-72 394 L-25 370 L22 394 Z" fill="#6B3A2B"/></g>`;
  // bờ hồ: kè đá + lối đi
  s += `<rect x="${X0}" y="${GY - 6}" width="${FW}" height="10" fill="#B8AD9A"/>`;
  s += `<rect x="${X0}" y="${GY + 4}" width="${FW}" height="${Y1 - GY}" fill="#D8C8AE"/>`;
  for (let x = X0; x < X1; x += 40) s += `<path d="M${x} ${GY - 6} l0 10" stroke="#9E937E" stroke-width="1"/>`;
  for (let y = GY + 30; y < 900; y += 30) s += `<path d="M${X0} ${y} L${X1} ${y}" stroke="#C9B894" stroke-width="1" opacity="0.6"/>`;
  // ghế đá ven hồ
  for (const x of [430, -230, 860]) s += `<rect x="${x}" y="${GY - 18}" width="70" height="8" rx="2" fill="#9C9486"/><rect x="${x + 6}" y="${GY - 10}" width="8" height="14" fill="#857D70"/><rect x="${x + 56}" y="${GY - 10}" width="8" height="14" fill="#857D70"/>`;
  // cây lá vàng mùa thu (thân nghiêng ra hồ) hai bên
  const tree = (x: number, k: number) => {
    let t = `<path d="M${x} ${GY + 4} C${x + 4 * k} ${GY - 80} ${x + 20 * k} ${GY - 170} ${x + 50 * k} ${GY - 250}" stroke="#5E4532" stroke-width="12" fill="none" stroke-linecap="round"/>`;
    t += `<path d="M${x + 22 * k} ${GY - 170} C${x + 50 * k} ${GY - 200} ${x + 80 * k} ${GY - 210} ${x + 110 * k} ${GY - 230}" stroke="#5E4532" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    const cols = ['#E2A93B', '#D98A2B', '#EBC35A', '#C9772A'];
    for (let i = 0; i < 9; i++) t += `<circle cx="${x + (30 + ((i * 23) % 100)) * k}" cy="${GY - 230 - ((i * 31) % 70)}" r="${26 + (i % 3) * 8}" fill="${cols[i % 4]}" opacity="0.92"/>`;
    return t;
  };
  s += tree(-60, 1) + tree(470, -1) + tree(-460, 1) + tree(900, -1);
  // lá rơi
  for (let i = 0; i < 26; i++) { const x = X0 + 400 + ((i * 97) % 1800), y = 120 + ((i * 53) % 420); s += `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.2" fill="${i % 2 ? '#E2A93B' : '#D98A2B'}" transform="rotate(${(i * 37) % 180} ${x} ${y})"/>`; }
  for (let i = 0; i < 18; i++) { const x = X0 + 600 + ((i * 131) % 1400), y = GY + 14 + ((i * 17) % 120); s += `<ellipse cx="${x}" cy="${y}" rx="4" ry="2.2" fill="#D98A2B" opacity="0.8" transform="rotate(${(i * 53) % 180} ${x} ${y})"/>`; }
  return s;
}

export function renderScene(id: SceneId | undefined, uid: string): string {
  if (id === 'dinh_lang') return dinhLang(uid);
  if (id === 'pho_co') return phoCo(uid);
  if (id === 'vuon_dao') return vuonDao(uid);
  if (id === 'ho_guom') return hoGuom(uid);
  return '';
}
