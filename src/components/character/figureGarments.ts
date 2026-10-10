import { Point, smooth, offsets, capsule, adjustHex, isColorTooDark } from './figureMath';
import { tuThanLapel, tuThanSash, tuThanPanels } from './femaleTuThan';
import {
  SkeletonMeasurements,
  FEMALE_SKELETON,
  MALE_SKELETON,
  CostumeSpec,
  COSTUME_SPECS,
  computeArmPoints,
  ArmKeypoints,
} from './figureSkeleton';

export interface GarmentColors {
  primary: string;
  secondary: string;
  accent: string;
  stroke: string;
  skin: string;
  skinShadow: string;
  skinStroke: string;
}

export function renderBackHair(
  gender: 'female' | 'male',
  hairId: string | undefined,
  skel: SkeletonMeasurements,
  accentColor: string,
  isHeadCovered: boolean
): string {
  const cx = 200;
  const hc = skel.crown;
  const shY = skel.shY;
  const isFemaleLong = gender === 'female' && hairId !== 'hair_female_bun';
  const isFemaleBun = gender === 'female' && hairId === 'hair_female_bun';
  const isMaleTopknot = gender === 'male' && hairId === 'hair_male_topknot';

  let html = '';

  if (isFemaleLong) {
    // Tóc dài nữ: mảng tóc sau nằm sau lưng, dài tới ngang ngực (shY + 128)
    // Tóc dài vẫn buông phía sau bên dưới vành khăn / nón / mấn
    const backHairD = `M ${cx},${hc - 5} C ${cx + 32},${hc - 6} ${cx + 38},${hc + 24} ${cx + 36},${hc + 56} L ${cx + 38},${shY + 40} C ${cx + 40},${shY + 90} ${cx + 34},${shY + 118} ${cx + 26},${shY + 128} L ${cx - 26},${shY + 128} C ${cx - 34},${shY + 118} ${cx - 40},${shY + 90} ${cx - 38},${shY + 40} L ${cx - 36},${hc + 56} C ${cx - 38},${hc + 24} ${cx - 32},${hc - 6} ${cx},${hc - 5} Z`;
    html += `<path d="${backHairD}" fill="#1F1916" />`;
    html += `<path d="M ${cx - 18} ${shY + 20} Q ${cx - 14} ${shY + 80} ${cx - 10} ${shY + 124}" stroke="#3A2F29" stroke-width="1.6" fill="none" opacity="0.65" />`;
    html += `<path d="M ${cx + 18} ${shY + 20} Q ${cx + 14} ${shY + 80} ${cx + 10} ${shY + 124}" stroke="#3A2F29" stroke-width="1.6" fill="none" opacity="0.65" />`;
  } else if (isFemaleBun) {
    // Tóc búi: không có tóc sau lưng, búi tóc vẽ tại đỉnh đầu
    return '';
  } else if (isMaleTopknot && !isHeadCovered) {
    // Búi tó nam r 9 có dây buộc màu accent (ẩn nếu đội khăn)
    const bunY = skel.crown + 4;
    html += `<circle cx="${cx}" cy="${bunY}" r="9" fill="#1F1916" />`;
    html += `<line x1="${cx - 11}" y1="${bunY + 6}" x2="${cx + 11}" y2="${bunY + 6}" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round" />`;
  }

  return html;
}

export function renderPantsOrSkirt(
  spec: CostumeSpec,
  gender: 'female' | 'male',
  skel: SkeletonMeasurements,
  colors: GarmentColors,
  uid: string
): string {
  const cx = 200;
  let html = '';

  if (spec.id === 'ao_tu_than') {
    // Váy đụp tứ thân: từ eo (±waistHalf + 6) xòe tới ±(hipHalf + 14) ở gấu, có 5 nếp dọc
    const skirtColor = isColorTooDark(colors.secondary) ? colors.secondary : '#1E1B18';
    const topY = skel.waistY + 4;
    const botY = spec.hemY + 40;
    const topHalf = skel.waistHalf + 6;
    const botHalf = skel.hipHalf + 14;

    const skirtPts: Point[] = [
      { x: cx - topHalf, y: topY },
      { x: cx - botHalf, y: botY },
      { x: cx - botHalf * 0.4, y: botY + 4 },
      { x: cx, y: botY + 5 },
      { x: cx + botHalf * 0.4, y: botY + 4 },
      { x: cx + botHalf, y: botY },
      { x: cx + topHalf, y: topY },
    ];

    html += `<path d="${smooth(skirtPts, true)}" fill="${skirtColor}" stroke="${adjustHex(skirtColor, -0.3)}" stroke-width="1" />`;

    // 5 nếp dọc
    const foldFractions = [-0.65, -0.32, 0, 0.32, 0.65];
    foldFractions.forEach((f) => {
      const xTop = cx + topHalf * f * 0.7;
      const xBot = cx + botHalf * f;
      html += `<path d="M ${xTop.toFixed(1)} ${topY + 10} Q ${(cx + f * 10).toFixed(1)} ${(topY + botY) / 2} ${xBot.toFixed(1)} ${botY - 2}" stroke="#000000" stroke-width="1.8" opacity="0.35" fill="none" />`;
    });

    return html;
  }

  // Quần ống rộng:
  // Mỗi ống là hình thang cong, từ hipY - 6 xuống ankleY + 6
  // Mép ngoài ±(hipHalf - 2) thu còn ±(hipHalf - 8), mép trong ±2 -> ±7
  const pantsColor = isColorTooDark(colors.secondary) ? '#F7F5EF' : colors.secondary;
  const pantsStroke = adjustHex(pantsColor, -0.25);
  const topY = skel.hipY - 6;
  const botY = skel.ankleY + 6;

  // Ống phải người mặc (bên trái x < 200)
  const leftOuterTop = cx - (skel.hipHalf - 2);
  const leftOuterBot = cx - (skel.hipHalf - 8);
  const leftInnerTop = cx - 2;
  const leftInnerBot = cx - 7;

  const leftPantsPts: Point[] = [
    { x: leftInnerTop, y: topY },
    { x: leftOuterTop, y: topY },
    { x: (leftOuterTop + leftOuterBot) / 2 - 2, y: skel.kneeY },
    { x: leftOuterBot, y: botY },
    { x: (leftOuterBot + leftInnerBot) / 2, y: botY + 2 },
    { x: leftInnerBot, y: botY },
    { x: (leftInnerTop + leftInnerBot) / 2 - 1, y: skel.kneeY },
  ];

  // Ống trái người mặc (bên phải x > 200)
  const rightOuterTop = cx + (skel.hipHalf - 2);
  const rightOuterBot = cx + (skel.hipHalf - 8);
  const rightInnerTop = cx + 2;
  const rightInnerBot = cx + 7;

  const rightPantsPts: Point[] = [
    { x: rightInnerTop, y: topY },
    { x: (rightInnerTop + rightInnerBot) / 2 + 1, y: skel.kneeY },
    { x: rightInnerBot, y: botY },
    { x: (rightOuterBot + rightInnerBot) / 2, y: botY + 2 },
    { x: rightOuterBot, y: botY },
    { x: (rightOuterTop + rightOuterBot) / 2 + 2, y: skel.kneeY },
    { x: rightOuterTop, y: topY },
  ];

  html += `<g id="${uid}-pants">`;
  const legPath = (iT: number, oT: number, oB: number, iB: number) =>
    `M ${iT} ${topY} L ${oT} ${topY} Q ${oT + (oB - oT) * 0.15} ${skel.kneeY} ${oB} ${botY} Q ${(oB + iB) / 2} ${botY + 2} ${iB} ${botY} Q ${iB + (iT - iB) * 0.3} ${skel.kneeY} ${iT} ${topY} Z`;
  html += `<path d="${legPath(leftInnerTop, leftOuterTop, leftOuterBot, leftInnerBot)}" fill="${pantsColor}" stroke="${pantsStroke}" stroke-width="0.8" />`;
  html += `<path d="${legPath(rightInnerTop, rightOuterTop, rightOuterBot, rightInnerBot)}" fill="${pantsColor}" stroke="${pantsStroke}" stroke-width="0.8" />`;
  // Nếp gấp mờ dọc ống
  html += `<path d="M ${(leftOuterTop + leftInnerTop) / 2} ${topY + 30} Q ${(leftOuterBot + leftInnerBot) / 2 - 2} ${skel.kneeY} ${(leftOuterBot + leftInnerBot) / 2} ${botY - 6}" stroke="#000000" stroke-width="1.2" opacity="0.12" fill="none" />`;
  html += `<path d="M ${(rightOuterTop + rightInnerTop) / 2} ${topY + 30} Q ${(rightOuterBot + rightInnerBot) / 2 + 2} ${skel.kneeY} ${(rightOuterBot + rightInnerBot) / 2} ${botY - 6}" stroke="#000000" stroke-width="1.2" opacity="0.12" fill="none" />`;
  html += `</g>`;

  return html;
}

export function renderNeckAndCollarSkin(
  skel: SkeletonMeasurements,
  colors: GarmentColors
): string {
  const cx = 200;
  const neckW = skel.neckHalf;
  // Cổ da + bóng dưới cằm
  let html = `<g id="figure-neck">`;
  html += `<path d="M ${cx - neckW} ${skel.neckTop} L ${cx - neckW - 2} ${skel.shY} L ${cx + neckW + 2} ${skel.shY} L ${cx + neckW} ${skel.neckTop} Z" fill="${colors.skin}" />`;
  // Bóng đổ dưới cằm
  html += `<ellipse cx="${cx}" cy="${skel.chin + 3}" rx="${neckW + 1}" ry="5" fill="${colors.skinShadow}" opacity="0.65" />`;
  html += `</g>`;
  return html;
}

export function renderTorsoGarment(
  spec: CostumeSpec,
  gender: 'female' | 'male',
  skel: SkeletonMeasurements,
  colors: GarmentColors,
  uid: string
): string {
  const cx = 200;
  const isTac = spec.type === 'tac';
  const actualHemY = isTac ? (gender === 'female' ? 432 : 470) : spec.hemY;

  // chestFit: fitted = chestHalf - 3, loose = chestHalf, wide = chestHalf + 4
  let chestFit = skel.chestHalf;
  if (spec.fit === 'fitted') chestFit = skel.chestHalf - 3;
  if (spec.fit === 'wide') chestFit = skel.chestHalf + 4;
  if (isTac) chestFit = skel.chestHalf + 2;

  // Eo / hông:
  // fitted (waistHalf + 1, hipHalf + 1); loose (chestHalf + 1, hipHalf + 4); wide (waist gently tapered, hips & hem draping wide)
  let waistFit = skel.chestHalf + 1;
  let hipFit = skel.hipHalf + 4;
  if (spec.fit === 'fitted') {
    waistFit = skel.waistHalf + 1;
    hipFit = skel.hipHalf + 1;
  } else if (isTac) {
    // Áo tấc: dáng suông, KHÔNG chiết eo
    waistFit = chestFit + 1;
    hipFit = chestFit + 5;
  } else if (spec.fit === 'wide') {
    // Thắt nhẹ ở eo, mở rộng mềm mại ở hông để tạo độ rủ vải thụng
    waistFit = skel.waistHalf + (gender === 'female' ? 4.5 : 6.5);
    hipFit = skel.hipHalf + (gender === 'female' ? 10 : 12);
  }

  // Nửa gấu: fitted hipHalf + 4, loose hipHalf + 8, wide hipHalf + 20 (nam + 2)
  let hemFit = skel.hipHalf + 8;
  if (spec.fit === 'fitted') hemFit = skel.hipHalf + 4;
  if (isTac) {
    hemFit = chestFit + 9;
  } else if (spec.fit === 'wide') {
    hemFit = skel.hipHalf + 21;
    if (gender === 'male') hemFit += 2;
  }

  // Tà SAU: vẽ trước, tối hơn primary 14%, rộng hơn tà trước 4-6 ở gấu, bắt đầu từ khe xẻ:
  // áo dài xẻ từ waistY + 8, áo tấc xẻ từ hipY + 4, các áo khác xẻ từ hipY + 16
  const slitY = spec.type === 'dai' ? skel.waistY + 8 : (isTac ? skel.hipY + 4 : skel.hipY + 16);
  const backHemFit = hemFit + (isTac ? 4 : 5);
  const backColor = adjustHex(colors.primary, -0.14);

  let html = `<g id="${uid}-torso">`;

  // 1. TÀ SAU
  if (isTac) {
    // Áo tấc: gấu ngang thẳng
    const leftBackPts: Point[] = [
      { x: cx - waistFit, y: slitY },
      { x: cx - (hipFit + 2), y: skel.hipY },
      { x: cx - backHemFit, y: actualHemY },
    ];
    const rightBackPts: Point[] = [
      { x: cx + backHemFit, y: actualHemY },
      { x: cx + (hipFit + 2), y: skel.hipY },
      { x: cx + waistFit, y: slitY },
    ];
    const leftBackD = smooth(leftBackPts, false);
    const rightBackD = smooth(rightBackPts, false);
    html += `<path d="${leftBackD} L ${cx + backHemFit} ${actualHemY} ${rightBackD.replace(/^M/, 'L')} Z" fill="${backColor}" stroke="${colors.stroke}" stroke-width="0.8" />`;

    // Khe xẻ hai bên từ hông xuống gấu để lộ màu lớp áo trong (#F5EFE3)
    html += `<path d="M ${cx - hipFit + 1} ${slitY} L ${cx - backHemFit} ${actualHemY} L ${cx - hemFit + 3} ${actualHemY} L ${cx - hipFit + 3} ${slitY} Z" fill="#F5EFE3" stroke="#D8CEBE" stroke-width="0.75" />`;
    html += `<path d="M ${cx + hipFit - 1} ${slitY} L ${cx + backHemFit} ${actualHemY} L ${cx + hemFit - 3} ${actualHemY} L ${cx + hipFit - 3} ${slitY} Z" fill="#F5EFE3" stroke="#D8CEBE" stroke-width="0.75" />`;
  } else {
    // Gấu tà sau có đường cong lượn sóng nhẹ (wavy curve) tạo độ rủ của vải
    const backFlapPts: Point[] = [
      { x: cx - waistFit, y: slitY },
      { x: cx - (hipFit + 2), y: skel.hipY },
      { x: cx - backHemFit, y: actualHemY },
      { x: cx - backHemFit * 0.5, y: actualHemY + 4 },
      { x: cx, y: actualHemY + 2.5 },
      { x: cx + backHemFit * 0.5, y: actualHemY + 4 },
      { x: cx + backHemFit, y: actualHemY },
      { x: cx + (hipFit + 2), y: skel.hipY },
      { x: cx + waistFit, y: slitY },
    ];
    html += `<path d="${smooth(backFlapPts, true)}" fill="${backColor}" stroke="${colors.stroke}" stroke-width="0.8" />`;
  }

  // 2. TÀ TRƯỚC
  // Outline points: cổ → vai → nách (mượn đường cong lượn xuống) → ngực → eo thắt nhẹ → hông → gấu lượn sóng
  const shDrop = isTac ? skel.shDrop + 3 : skel.shDrop;
  const leftFrontHalfPts: Point[] = [
    { x: cx - (skel.neckHalf + 2), y: skel.shY - (isTac ? 6 : 8) },
    { x: cx - (skel.shHalf - 4), y: skel.shY + shDrop },
    { x: cx - (skel.shHalf - 9), y: skel.armpit + 2 },
    { x: cx - chestFit, y: skel.armpit + 22 },
    { x: cx - waistFit, y: skel.waistY },
    { x: cx - hipFit, y: skel.hipY },
    { x: cx - hemFit, y: actualHemY },
  ];

  const rightFrontHalfPts: Point[] = [
    { x: cx + hemFit, y: actualHemY },
    { x: cx + hipFit, y: skel.hipY },
    { x: cx + waistFit, y: skel.waistY },
    { x: cx + chestFit, y: skel.armpit + 22 },
    { x: cx + (skel.shHalf - 9), y: skel.armpit + 2 },
    { x: cx + (skel.shHalf - 4), y: skel.shY + shDrop },
    { x: cx + (skel.neckHalf + 2), y: skel.shY - (isTac ? 6 : 8) },
  ];

  if (spec.id === 'ao_tu_than') {
    // Áo tứ thân: vạt trước MỞ (hai mép cong từ cổ ±9 xuống gấu ±16)
    // Lộ yếm màu accent từ shY + 10 tới eo
    const yemTopY = skel.shY + 12;
    const yemBotY = skel.waistY + 4;
    const yemPts: Point[] = [
      { x: cx - 21, y: yemTopY },
      { x: cx, y: yemTopY + 5 },
      { x: cx + 21, y: yemTopY },
      { x: cx + 18, y: yemBotY },
      { x: cx - 18, y: yemBotY },
    ];
    // Da ngực lộ bên trên yếm
    html += `<path d="M ${cx - skel.neckHalf - 2} ${skel.shY - 4} Q ${cx} ${skel.shY + 2} ${cx + skel.neckHalf + 2} ${skel.shY - 4} L ${cx + 23} ${yemTopY + 2} L ${cx} ${yemTopY + 9} L ${cx - 23} ${yemTopY + 2} Z" fill="${colors.skin}" />`;
    // Yếm
    html += `<path d="${smooth(yemPts, true)}" fill="${colors.accent}" stroke="${adjustHex(colors.accent, -0.2)}" stroke-width="1" />`;
    html += tuThanLapel(skel);

    html += tuThanPanels(skel, { chest: chestFit, waist: waistFit, hip: hipFit, hem: hemFit }, actualHemY, `url(#${uid}-bodyGrad)`, colors.stroke, uid);

    html += tuThanSash(skel, waistFit);
  } else {
    if (isTac) {
      // Áo tấc: gấu ngang thẳng
      const leftD = smooth(leftFrontHalfPts, false);
      const rightD = smooth(rightFrontHalfPts, false);
      html += `<path d="${leftD} L ${cx + hemFit} ${actualHemY} ${rightD.replace(/^M/, 'L')} Z" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;
    } else {
      // Các áo khác có tà trước kín với gấu lượn sóng nhẹ nhàng
      const frontPts: Point[] = [
        ...leftFrontHalfPts,
        { x: cx - hemFit * 0.5, y: actualHemY + 3.5 },
        { x: cx, y: actualHemY + 1.5 },
        { x: cx + hemFit * 0.5, y: actualHemY + 3.5 },
        ...rightFrontHalfPts,
      ];
      html += `<path d="${smooth(frontPts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;
    }

    // Mảng bóng mờ sườn phải người mặc (bên trái hình) và sườn trái người mặc (bên phải hình) tạo hiệu ứng đổ bóng 3D, phân tách rõ thân áo với cánh tay
    html += `<path d="M ${cx - (skel.shHalf - 9)} ${skel.armpit + 4} C ${cx - chestFit} ${skel.armpit + 22}, ${cx - waistFit} ${skel.waistY}, ${cx - hipFit} ${skel.hipY} L ${cx - hemFit} ${actualHemY} L ${cx - hemFit + 8} ${actualHemY} C ${cx - hipFit + 7} ${skel.hipY}, ${cx - waistFit + 6} ${skel.waistY}, ${cx - chestFit + 6} ${skel.armpit + 22} Z" fill="#000000" opacity="0.12" />`;
    html += `<path d="M ${cx + (skel.shHalf - 9)} ${skel.armpit + 4} C ${cx + chestFit} ${skel.armpit + 22}, ${cx + waistFit} ${skel.waistY}, ${cx + hipFit} ${skel.hipY} L ${cx + hemFit} ${actualHemY} L ${cx + hemFit - 8} ${actualHemY} C ${cx + hipFit - 7} ${skel.hipY}, ${cx + waistFit - 6} ${skel.waistY}, ${cx + chestFit - 6} ${skel.armpit + 22} Z" fill="#000000" opacity="0.12" />`;

    // Nếp vải nhẹ rủ theo thân áo
    html += `<path d="M ${cx - 12} ${skel.waistY + 15} Q ${cx - 18} ${skel.hipY + 30} ${cx - 24} ${actualHemY - 30}" stroke="#000000" stroke-width="1.2" opacity="0.2" fill="none" />`;
    html += `<path d="M ${cx + 10} ${skel.waistY + 20} Q ${cx + 16} ${skel.hipY + 40} ${cx + 20} ${actualHemY - 25}" stroke="#000000" stroke-width="1.2" opacity="0.2" fill="none" />`;

    // Đường may chéo mảnh từ chân cổ xuống nách hai bên; tay áo liền mạch với thân (cho Áo Tấc)
    if (isTac) {
      html += `<path d="M ${cx - skel.neckHalf - 1} ${skel.shY - 6} Q ${cx - (skel.shHalf + skel.neckHalf) / 2} ${skel.shY + 8} ${cx - (skel.shHalf - 9)} ${skel.armpit + 3}" stroke="${colors.stroke}" stroke-width="0.85" opacity="0.45" stroke-dasharray="3 2" fill="none" />`;
      html += `<path d="M ${cx + skel.neckHalf + 1} ${skel.shY - 6} Q ${cx + (skel.shHalf + skel.neckHalf) / 2} ${skel.shY + 8} ${cx + (skel.shHalf - 9)} ${skel.armpit + 3}" stroke="${colors.stroke}" stroke-width="0.85" opacity="0.45" stroke-dasharray="3 2" fill="none" />`;
    }

    // Đường nối giữa thân dạng nét đứt cho ngũ thân và áo tấc
    if (spec.type === 'ngu' || spec.type === 'tac') {
      html += `<line x1="${cx}" y1="${skel.shY + 12}" x2="${cx}" y2="${actualHemY}" stroke="${colors.stroke}" stroke-width="1" stroke-dasharray="3 3" opacity="0.65" />`;
    }

    // Áo giao lĩnh: cổ bắt chéo, vạt trái đè vạt phải (accent collar band từ cổ bên phải hình chéo xuống eo bên trái hình), đai lưng
    if (spec.id === 'ao_giao_linh') {
      // Dải cổ vạt dưới (từ cổ trái hình chéo xuống ngực)
      html += `<path d="M ${cx - skel.neckHalf} ${skel.shY - 6} L ${cx + 14} ${skel.armpit + 32} L ${cx + 8} ${skel.armpit + 34} L ${cx - skel.neckHalf - 6} ${skel.shY - 4} Z" fill="#E2E8F0" opacity="0.75" />`;
      // Dải cổ màu accent (từ cổ bên phải hình chéo xuống eo bên trái hình)
      html += `<path d="M ${cx + skel.neckHalf + 2} ${skel.shY - 6} L ${cx - waistFit + 4} ${skel.waistY - 2} L ${cx - waistFit + 4} ${skel.waistY + 12} L ${cx + skel.neckHalf - 4} ${skel.shY - 6} Z" fill="${colors.accent}" stroke="${adjustHex(colors.accent, -0.2)}" stroke-width="0.8" />`;
      // Đai lưng ngang eo và một dải buông
      const beltY = skel.waistY;
      html += `<rect x="${cx - waistFit - 2}" y="${beltY - 4}" width="${(waistFit + 2) * 2}" height="14" rx="2" fill="${adjustHex(colors.accent, -0.3)}" />`;
      html += `<path d="M ${cx - 10} ${beltY + 10} Q ${cx - 14} ${beltY + 80} ${cx - 18} ${beltY + 130} L ${cx - 8} ${beltY + 130} Q ${cx - 4} ${beltY + 80} ${cx - 2} ${beltY + 10} Z" fill="${adjustHex(colors.accent, -0.2)}" />`;
    }

    // Áo Nhật Bình: Cổ áo to bản HÌNH CHỮ NHẬT TO BẢN (rộng 70px, khoảng 60px-80px) ngay giữa ngực
    // Bên dưới hình chữ nhật, 2 dải lụa bản nhỏ khoảng 15px thả thẳng đứng xuống gấu áo (màu trắng, KHÔNG có ngũ sắc)
    if (spec.id === 'ao_nhat_binh') {
      const rectTop = 114;
      const rectBot = 168;
      const rectH = rectBot - rectTop; // 54px
      const rectHalfW = 35;            // Rộng 70px (trong khoảng 60px-80px) nằm chính giữa trục y

      // 1. Cổ áo to bản: Một mảng HÌNH CHỮ NHẬT TO BẢN vuông vức ngay giữa ngực
      html += `<rect x="${cx - rectHalfW}" y="${rectTop}" width="${rectHalfW * 2}" height="${rectH}" rx="2" fill="#FFFFFF" stroke="${colors.stroke}" stroke-width="2" />`;
      html += `<rect x="${cx - rectHalfW + 2.5}" y="${rectTop + 2.5}" width="${(rectHalfW - 2.5) * 2}" height="${rectH - 5}" rx="1" fill="none" stroke="#D97706" stroke-width="0.9" />`;

      // Cổ lót trắng phía trên
      html += `<path d="M ${cx - 16} ${rectTop} L ${cx} ${rectTop + 10} L ${cx + 16} ${rectTop}" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.1" />`;

      // Họa tiết hoa văn hoàng gia vàng kim chính giữa ngực
      html += `<circle cx="${cx}" cy="${rectTop + 28}" r="7" fill="#FBBF24" stroke="#B45309" stroke-width="1.1" />`;
      html += `<circle cx="${cx}" cy="${rectTop + 28}" r="3.2" fill="#DC2626" />`;
      // Họa tiết mây vàng 4 góc
      html += `<circle cx="${cx - 22}" cy="${rectTop + 16}" r="2.5" fill="#F59E0B" />`;
      html += `<circle cx="${cx + 22}" cy="${rectTop + 16}" r="2.5" fill="#F59E0B" />`;
      html += `<circle cx="${cx - 22}" cy="${rectTop + 40}" r="2.5" fill="#F59E0B" />`;
      html += `<circle cx="${cx + 22}" cy="${rectTop + 40}" r="2.5" fill="#F59E0B" />`;

      // 2. Hai dải lụa (bản nhỏ khoảng 15px) thả thẳng đứng xuống gấu áo (màu trắng lụa gấm, KHÔNG có ngũ sắc)
      const ribbonTopY = rectBot;
      const ribbonBotY = actualHemY - 4; // Tận gấu áo (~436)
      const ribbonH = ribbonBotY - ribbonTopY;
      const ribbonW = 15; // Bản nhỏ khoảng 15px

      // Bóng nhẹ của dải lụa trên nền áo
      html += `<rect x="${cx - ribbonW - 2}" y="${ribbonTopY + 1}" width="${ribbonW * 2 + 4}" height="${ribbonH}" fill="#000000" opacity="0.08" />`;

      // Dải lụa trái (rộng 15px, màu trắng)
      html += `<rect x="${cx - ribbonW - 2}" y="${ribbonTopY}" width="${ribbonW}" height="${ribbonH}" fill="#FFFFFF" stroke="${colors.stroke}" stroke-width="0.8" />`;
      // Dải lụa phải (rộng 15px, màu trắng)
      html += `<rect x="${cx + 2}" y="${ribbonTopY}" width="${ribbonW}" height="${ribbonH}" fill="#FFFFFF" stroke="${colors.stroke}" stroke-width="0.8" />`;

      // Đường gân lụa giữa mỗi dải
      html += `<line x1="${cx - ribbonW / 2 - 2}" y1="${ribbonTopY}" x2="${cx - ribbonW / 2 - 2}" y2="${ribbonBotY}" stroke="#E2E8F0" stroke-width="0.8" />`;
      html += `<line x1="${cx + ribbonW / 2 + 2}" y1="${ribbonTopY}" x2="${cx + ribbonW / 2 + 2}" y2="${ribbonBotY}" stroke="#E2E8F0" stroke-width="0.8" />`;
    }

    // Cổ đứng (lập lĩnh):
    if (isTac) {
      // Áo Tấc: Cổ đứng hai lớp; lớp cổ trong màu kem (#F5EFE3) nhô cao hơn cổ áo tấc khoảng 2–3px
      const colTop = skel.chin + 8;
      const colBot = skel.shY - 6;
      const colHalf = skel.neckHalf + 3;
      const innerColTop = colTop - 2.5; // nhô cao hơn 2.5px
      const innerColHalf = skel.neckHalf + 2.3;

      // Lớp cổ trong màu kem nhô cao hơn
      html += `<path d="M ${cx - innerColHalf} ${colBot} L ${cx - innerColHalf} ${innerColTop} Q ${cx} ${innerColTop - 2} ${cx + innerColHalf} ${innerColTop} L ${cx + innerColHalf} ${colBot} Z" fill="#F5EFE3" stroke="#D8CEBE" stroke-width="0.8" />`;
      // Lớp cổ áo tấc bên ngoài
      html += `<path d="M ${cx - colHalf} ${colBot} L ${cx - colHalf} ${colTop} Q ${cx} ${colTop - 2} ${cx + colHalf} ${colTop} L ${cx + colHalf} ${colBot} Z" fill="${colors.primary}" stroke="${colors.stroke}" stroke-width="1.1" />`;
    } else if (spec.collar === 'dung') {
      const colTop = skel.chin + 7;
      const colBot = skel.shY - 7;
      const colHalf = skel.neckHalf + 2.5;
      html += `<path d="M ${cx - colHalf} ${colBot} L ${cx - colHalf} ${colTop} Q ${cx} ${colTop - 2} ${cx + colHalf} ${colTop} L ${cx + colHalf} ${colBot} Z" fill="${colors.primary}" stroke="${colors.stroke}" stroke-width="1" />`;
      // Viền trắng cổ lót bên trong
      html += `<path d="M ${cx - colHalf + 1} ${colTop} Q ${cx} ${colTop - 2} ${cx + colHalf - 1} ${colTop}" stroke="#FFFFFF" stroke-width="1.6" fill="none" />`;
    }

    // Đường cài vạt & Khuy:
    if (isTac) {
      // Áo Tấc: 1 khuy ở giữa cổ, 1 khuy ở vai phải của nhân vật (bên trái màn hình).
      // Treo thêm một dây tua mảnh từ khuy vai xuống ngực (có thể tắt bằng một biến boolean).
      const armpitTargetX = cx - skel.shHalf + 9;
      const armpitTargetY = skel.armpit + 3;
      const shoulderBtn = { x: cx - 24, y: skel.shY + 1 };

      // Đường cài vạt cong từ cổ qua vai phải nhân vật xuống nách
      html += `<path d="M ${cx} ${skel.shY - 6} Q ${cx - 14} ${skel.shY - 4} ${shoulderBtn.x} ${shoulderBtn.y}" stroke="${colors.stroke}" stroke-width="1.2" fill="none" opacity="0.8" />`;
      html += `<path d="M ${shoulderBtn.x} ${shoulderBtn.y} Q ${cx - 30} ${skel.shY + 14} ${armpitTargetX} ${armpitTargetY}" stroke="${colors.stroke}" stroke-width="1.2" fill="none" opacity="0.8" />`;
      html += `<path d="M ${armpitTargetX} ${armpitTargetY} Q ${cx - waistFit + 2} ${skel.waistY} ${cx - hipFit + 3} ${slitY}" stroke="${colors.stroke}" stroke-width="1.1" fill="none" opacity="0.65" />`;

      // 1 khuy ở giữa cổ
      html += `<circle cx="${cx}" cy="${skel.chin + 14}" r="2.5" fill="#FBBF24" stroke="#B45309" stroke-width="0.8" />`;

      // 1 khuy ở vai phải của nhân vật (bên trái màn hình)
      html += `<circle cx="${shoulderBtn.x}" cy="${shoulderBtn.y}" r="2.5" fill="#FBBF24" stroke="#B45309" stroke-width="0.8" />`;

      // Treo thêm một dây tua mảnh từ khuy vai xuống ngực (có thể tắt bằng biến boolean)
      const showShoulderTassel = true;
      if (showShoulderTassel) {
        const tasselEndY = skel.shY + 54;
        html += `<path d="M ${shoulderBtn.x} ${shoulderBtn.y + 2.5} Q ${shoulderBtn.x - 3} ${skel.shY + 28} ${shoulderBtn.x + 2} ${tasselEndY}" stroke="#D97706" stroke-width="0.9" fill="none" />`;
        html += `<circle cx="${shoulderBtn.x + 2}" cy="${tasselEndY}" r="1.6" fill="#F59E0B" />`;
        html += `<path d="M ${shoulderBtn.x + 0.5} ${tasselEndY + 1} L ${shoulderBtn.x - 1} ${tasselEndY + 15} M ${shoulderBtn.x + 2} ${tasselEndY + 1} L ${shoulderBtn.x + 2} ${tasselEndY + 17} M ${shoulderBtn.x + 3.5} ${tasselEndY + 1} L ${shoulderBtn.x + 5} ${tasselEndY + 15}" stroke="#D97706" stroke-width="0.8" stroke-linecap="round" />`;
      }
    } else if (spec.type === 'ngu' || spec.type === 'dai') {
      // Đường cài vạt (closure curve) cho ngu / dai: 5 khuy vàng
      const armpitTargetX = cx - skel.shHalf + 8;
      const armpitTargetY = skel.armpit + 2;

      html += `<path d="M ${cx} ${skel.shY - 6} Q ${cx - 18} ${skel.shY + 8} ${armpitTargetX} ${armpitTargetY}" stroke="${colors.stroke}" stroke-width="1.4" fill="none" />`;
      html += `<path d="M ${armpitTargetX} ${armpitTargetY} Q ${cx - waistFit + 2} ${skel.waistY} ${cx - hipFit + 4} ${slitY}" stroke="${colors.stroke}" stroke-width="1.2" fill="none" opacity="0.75" />`;

      // 5 khuy vàng: 1 ở cổ áo, 4 dọc đường cài
      const btnPoints: Point[] = [
        { x: cx, y: skel.chin + 14 },
        { x: cx - 9, y: skel.shY + 1 },
        { x: cx - 21, y: skel.shY + 11 },
        { x: (cx - 21 + armpitTargetX) / 2, y: (skel.shY + 11 + armpitTargetY) / 2 },
        { x: armpitTargetX, y: armpitTargetY },
      ];

      btnPoints.forEach((pt) => {
        html += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="2.4" fill="#FBBF24" stroke="#B45309" stroke-width="0.8" />`;
      });
    }
  }

  html += `</g>`;
  return html;
}

export function renderSleeves(
  spec: CostumeSpec,
  gender: 'female' | 'male',
  skel: SkeletonMeasurements,
  colors: GarmentColors,
  rightArm: ArmKeypoints,
  leftArm: ArmKeypoints,
  hasFan: boolean,
  hasBag: boolean = false,
  uid: string = 'sleeve'
): string {
  const cx = 200;
  let html = `<g id="${uid}-sleeves">`;

  // NHẬT BÌNH (khi không cầm đồ: không quạt và không túi): HAI TAY CHẮP TRƯỚC BỤNG
  if (spec.id === 'ao_nhat_binh' && !hasFan && !hasBag) {
    // Mỗi ống tay đi từ đường may vai, phồng ra ngoài tới ~shHalf + 34, rồi thu về giữa;
    // hai cửa tay gặp nhau tại cx ± 3, từ shY + 150 tới shY + 214;
    // cửa tay có 6 sọc dọc: xanh #2E7D5B, trắng #F4EFE4, accent, lam #2F3F8F, trắng, đỏ #C23B2E
    const shDrop = skel.shDrop;
    const topY = skel.shY + 150;
    const botY = skel.shY + 214;
    const billowOut = skel.shHalf + 34;

    // Tay phải người mặc (bên trái hình)
    const leftSleevePts: Point[] = [
      { x: cx - (skel.shHalf - 3), y: skel.shY + shDrop },
      { x: cx - billowOut, y: (skel.shY + topY) / 2 },
      { x: cx - billowOut + 4, y: botY - 8 },
      { x: cx - 3, y: botY },
      { x: cx - 3, y: topY },
      { x: cx - (skel.shHalf - 12), y: skel.armpit + 4 },
    ];

    // Tay trái người mặc (bên phải hình)
    const rightSleevePts: Point[] = [
      { x: cx + (skel.shHalf - 3), y: skel.shY + shDrop },
      { x: cx + billowOut, y: (skel.shY + topY) / 2 },
      { x: cx + billowOut - 4, y: botY - 8 },
      { x: cx + 3, y: botY },
      { x: cx + 3, y: topY },
      { x: cx + (skel.shHalf - 12), y: skel.armpit + 4 },
    ];

    html += `<path d="${smooth(leftSleevePts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;
    html += `<path d="${smooth(rightSleevePts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;

    // Mảng bóng mờ sườn trong nách và nếp gấp vải khuỷu tay áo chắp Nhật Bình
    html += `<path d="M ${cx - (skel.shHalf - 12)} ${skel.armpit + 4} Q ${cx - billowOut + 10} ${(skel.shY + topY) / 2 + 10} ${cx - 3} ${botY} L ${cx - 3} ${botY - 10} Q ${cx - billowOut + 16} ${(skel.shY + topY) / 2 + 6} ${cx - (skel.shHalf - 7)} ${skel.armpit + 10} Z" fill="#000000" opacity="0.12" />`;
    html += `<path d="M ${cx + (skel.shHalf - 12)} ${skel.armpit + 4} Q ${cx + billowOut - 10} ${(skel.shY + topY) / 2 + 10} ${cx + 3} ${botY} L ${cx + 3} ${botY - 10} Q ${cx + billowOut - 16} ${(skel.shY + topY) / 2 + 6} ${cx + (skel.shHalf - 7)} ${skel.armpit + 10} Z" fill="#000000" opacity="0.12" />`;
    // Nếp nhăn vải nhẹ ở khuỷu tay
    html += `<path d="M ${cx - billowOut + 8} ${(skel.shY + topY) / 2 + 14} Q ${cx - billowOut + 22} ${(skel.shY + topY) / 2 + 20} ${cx - billowOut + 28} ${botY - 12}" stroke="${colors.stroke}" stroke-width="0.9" fill="none" opacity="0.35" />`;
    html += `<path d="M ${cx + billowOut - 8} ${(skel.shY + topY) / 2 + 14} Q ${cx + billowOut - 22} ${(skel.shY + topY) / 2 + 20} ${cx + billowOut - 28} ${botY - 12}" stroke="${colors.stroke}" stroke-width="0.9" fill="none" opacity="0.35" />`;

    // Cửa tay Áo Nhật Bình: mỗi bên là một hình chữ nhật hơi vát, từ x = cx±3 ra tới cx±(shHalf+4), cao từ shY+150 tới shY+214
    // chia đều 5 SỌC DỌC phẳng màu Ngũ sắc lần lượt: Lục (#15803D), Hoàng (#EAB308), Thanh (#1D4ED8), Bạch (#FFFFFF), Xích (#B91C1C)
    // Không vẽ hoạ tiết, không gradient, không chữ trên cửa tay. Viền ngoài cửa tay một nét màu viền áo.
    const cuffOuterHalf = skel.shHalf + 4;
    const cuffW = cuffOuterHalf - 3;
    const sWidth = cuffW / 5;
    const stripeColors = ['#15803D', '#EAB308', '#1D4ED8', '#FFFFFF', '#B91C1C'];

    // Tô 5 sọc phẳng cửa tay trái người mặc (bên phải hình) và phải người mặc (bên trái hình)
    stripeColors.forEach((sc, i) => {
      // Bên trái hình (wearer's right: từ ngoài vào trong: Lục -> Hoàng -> Thanh -> Bạch -> Xích)
      const leftX = cx - cuffOuterHalf + i * sWidth;
      html += `<rect x="${leftX.toFixed(2)}" y="${topY}" width="${(sWidth + 0.1).toFixed(2)}" height="${botY - topY}" fill="${sc}" />`;

      // Bên phải hình (wearer's left: từ ngoài vào trong: Lục -> Hoàng -> Thanh -> Bạch -> Xích)
      const rightX = cx + cuffOuterHalf - (i + 1) * sWidth;
      html += `<rect x="${rightX.toFixed(2)}" y="${topY}" width="${(sWidth + 0.1).toFixed(2)}" height="${botY - topY}" fill="${sc}" />`;
    });

    // Viền ngoài mỗi cửa tay một nét màu viền áo, hơi vát nhẹ
    html += `<rect x="${(cx - cuffOuterHalf).toFixed(2)}" y="${topY}" width="${cuffW.toFixed(2)}" height="${botY - topY}" rx="2" fill="none" stroke="${colors.stroke}" stroke-width="1.2" />`;
    html += `<rect x="${(cx + 3).toFixed(2)}" y="${topY}" width="${cuffW.toFixed(2)}" height="${botY - topY}" rx="2" fill="none" stroke="${colors.stroke}" stroke-width="1.2" />`;

    html += `</g>`;
    return html;
  }

  // ================= TAY THỤNG (ÁO TẤC, GIAO LĨNH, NHẬT BÌNH CÓ CẦM QUẠT) =================
  if (spec.sleeve === 'thung' || spec.id === 'ao_nhat_binh') {
    // 1. Tay phải người mặc (x < 200)
    if (rightArm.isWideFan) {
      // Cầm quạt tay thụng: bắp tay rủ xuống, cẳng tay đưa ngang trước ngực, miệng tay áo là bầu dục dọc rx 5, ry 17.5, vải rủ lớn dưới cẳng tay
      const S = rightArm.S;
      const E = rightArm.E;
      const W = rightArm.W;
      const shDrop = skel.shDrop;

      const drapePts: Point[] = [
        { x: cx - (skel.shHalf - 3), y: skel.shY + shDrop },
        { x: E.x - 14, y: E.y + 10 },
        { x: E.x + 8, y: E.y + 60 },
        { x: W.x + 6, y: W.y + 40 },
        { x: W.x, y: W.y },
        { x: cx - (skel.shHalf - 12), y: skel.armpit + 4 },
      ];

      html += `<path d="${smooth(drapePts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;
      // Mảng bóng mờ sâu mặt trong ống tay
      html += `<path d="M ${cx - (skel.shHalf - 12)} ${skel.armpit + 4} Q ${E.x + 4} ${E.y + 35} ${E.x + 8} ${E.y + 60} L ${W.x + 6} ${W.y + 40} Q ${E.x} ${E.y + 30} ${cx - (skel.shHalf - 6)} ${skel.armpit + 12} Z" fill="#000000" opacity="0.13" />`;
      // Miệng tay áo bầu dục dọc
      html += `<ellipse cx="${W.x}" cy="${W.y}" rx="5" ry="17.5" fill="${adjustHex(colors.primary, -0.4)}" stroke="${colors.accent}" stroke-width="1.8" />`;
    } else if (spec.type === 'tac') {
      // ÁO TẤC: Ống tay phồng túi vải (Bezier) rủ xuống tới giữa đùi, rộng ngang ngực áo
      const botY = gender === 'female' ? 336 : 340;
      const xOut = skel.shHalf + (gender === 'male' ? 34 : 26);
      const xIn = gender === 'male' ? 26 : 22;

      // 1. Tay phải người mặc (x < 200)
      const rightTacPts: Point[] = [
        { x: cx - (skel.shHalf - 2), y: skel.shY + 6 },
        { x: cx - xOut, y: (skel.shY + botY) / 2 },
        { x: cx - (xOut - 2), y: botY - 14 },
        { x: cx - (skel.shHalf - 4), y: botY },
        { x: cx - xIn, y: botY - 14 },
        { x: cx - (xIn - 2), y: 280 },
        { x: cx - (skel.shHalf - 12), y: skel.armpit + 4 },
      ];
      html += `<path d="${smooth(rightTacPts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1.3" />`;
      // Bóng sườn mép trong
      html += `<path d="M ${cx - (skel.shHalf - 12)} ${skel.armpit + 4} C ${cx - xIn} 220, ${cx - xIn} 280, ${cx - xIn} ${botY - 14} L ${cx - (xIn + 6)} ${botY - 10} C ${cx - (xIn + 4)} 280, ${cx - (xIn + 4)} 220, ${cx - (skel.shHalf - 8)} ${skel.armpit + 10} Z" fill="#000000" opacity="0.12" />`;
      // 2-3 nếp gấp mềm dọc ống tay
      html += `<path d="M ${cx - (skel.shHalf + 8)} ${skel.shY + 40} C ${cx - (skel.shHalf + 16)} 200, ${cx - (skel.shHalf + 14)} 270, ${cx - (skel.shHalf + 8)} ${botY - 18}" fill="none" stroke="${colors.stroke}" stroke-width="0.9" opacity="0.2" />`;
      html += `<path d="M ${cx - skel.shHalf} ${skel.shY + 70} C ${cx - (skel.shHalf + 4)} 200, ${cx - (skel.shHalf + 2)} 270, ${cx - (skel.shHalf - 4)} ${botY - 14}" fill="none" stroke="${colors.stroke}" stroke-width="0.9" opacity="0.2" />`;
      html += `<path d="M ${cx - 34} ${skel.shY + 115} C ${cx - 36} 200, ${cx - 34} 260, ${cx - 28} ${botY - 26}" fill="none" stroke="${colors.stroke}" stroke-width="0.8" opacity="0.2" />`;
      // Cửa tay xiên mở ra phía trước với dải lót màu kem #F5EFE3 rộng ~5px
      html += `<path d="M ${cx - 64} 282 L ${cx - 36} 304 L ${cx - 33} 299 L ${cx - 60} 277 Z" fill="#F5EFE3" stroke="#D8CEBE" stroke-width="0.8" />`;
      html += `<path d="M ${cx - 64} 282 L ${cx - 36} 304" fill="none" stroke="${colors.stroke}" stroke-width="1.3" stroke-linecap="round" />`;

      // 2. Tay trái người mặc (x > 200)
      const leftTacPts: Point[] = [
        { x: cx + (skel.shHalf - 2), y: skel.shY + 6 },
        { x: cx + xOut, y: (skel.shY + botY) / 2 },
        { x: cx + (xOut - 2), y: botY - 14 },
        { x: cx + (skel.shHalf - 4), y: botY },
        { x: cx + xIn, y: botY - 14 },
        { x: cx + (xIn - 2), y: 280 },
        { x: cx + (skel.shHalf - 12), y: skel.armpit + 4 },
      ];
      html += `<path d="${smooth(leftTacPts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1.3" />`;
      html += `<path d="M ${cx + (skel.shHalf - 12)} ${skel.armpit + 4} C ${cx + xIn} 220, ${cx + xIn} 280, ${cx + xIn} ${botY - 14} L ${cx + (xIn + 6)} ${botY - 10} C ${cx + (xIn + 4)} 280, ${cx + (xIn + 4)} 220, ${cx + (skel.shHalf - 8)} ${skel.armpit + 10} Z" fill="#000000" opacity="0.12" />`;
      html += `<path d="M ${cx + (skel.shHalf + 8)} ${skel.shY + 40} C ${cx + (skel.shHalf + 16)} 200, ${cx + (skel.shHalf + 14)} 270, ${cx + (skel.shHalf + 8)} ${botY - 18}" fill="none" stroke="${colors.stroke}" stroke-width="0.9" opacity="0.2" />`;
      html += `<path d="M ${cx + skel.shHalf} ${skel.shY + 70} C ${cx + (skel.shHalf + 4)} 200, ${cx + (skel.shHalf + 2)} 270, ${cx + (skel.shHalf - 4)} ${botY - 14}" fill="none" stroke="${colors.stroke}" stroke-width="0.9" opacity="0.2" />`;
      html += `<path d="M ${cx + 34} ${skel.shY + 115} C ${cx + 36} 200, ${cx + 34} 260, ${cx + 28} ${botY - 26}" fill="none" stroke="${colors.stroke}" stroke-width="0.8" opacity="0.2" />`;
      html += `<path d="M ${cx + 64} 282 L ${cx + 36} 304 L ${cx + 33} 299 L ${cx + 60} 277 Z" fill="#F5EFE3" stroke="#D8CEBE" stroke-width="0.8" />`;
      html += `<path d="M ${cx + 64} 282 L ${cx + 36} 304" fill="none" stroke="${colors.stroke}" stroke-width="1.3" stroke-linecap="round" />`;
    } else {
      // Tay thụng thả tự nhiên (cho các áo khác như Nhật Bình cầm quạt/túi):
      // Biên ngoài rơi gần thẳng xuống, hơi loe tới điểm O ở ngang cổ tay (rộng hơn cổ tay 27 nam/23 nữ)
      // Phần vải thừa rủ xuống thấp hơn cổ tay ~50 thành đáy cong lượn sóng B rồi vòng lên dọc sườn về nách
      const S = rightArm.S;
      const W = rightArm.W;
      const loe = gender === 'male' ? 27 : 23;
      const O = { x: W.x - loe, y: W.y };
      const B = { x: (O.x + W.x) / 2, y: W.y + 50 };

      const thungPts: Point[] = [
        { x: cx - (skel.shHalf - 3), y: skel.shY + skel.shDrop },
        { x: O.x - 3, y: (S.y + O.y) / 2 },
        { x: O.x, y: O.y },
        // Gấu tay áo và nếp rủ vải có độ cong lượn sóng nhẹ nhàng
        { x: O.x * 0.7 + B.x * 0.3, y: W.y + 30 },
        { x: B.x - 3, y: B.y },
        { x: B.x + 3, y: B.y + 2 },
        { x: W.x + 8, y: W.y + 35 },
        { x: cx - (skel.shHalf - 12), y: skel.armpit + 4 },
      ];

      html += `<path d="${smooth(thungPts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;
      // Mảng màu tối (opacity 13%) dọc theo mặt trong của ống tay rộng tạo hiệu ứng đổ bóng (shading) có chiều sâu
      html += `<path d="M ${cx - (skel.shHalf - 12)} ${skel.armpit + 4} C ${W.x + 8} ${W.y + 35}, ${B.x + 4} ${B.y - 8}, ${B.x} ${B.y} C ${B.x - 7} ${B.y - 10}, ${W.x} ${W.y + 24}, ${cx - (skel.shHalf - 6)} ${skel.armpit + 14} Z" fill="#000000" opacity="0.13" />`;
      // Nếp gấp vải lượn sóng nhẹ
      html += `<path d="M ${O.x + 5} ${O.y + 12} Q ${(O.x + B.x) / 2} ${(O.y + B.y) / 2 + 5} ${B.x - 4} ${B.y - 4}" stroke="${colors.stroke}" stroke-width="0.9" fill="none" opacity="0.4" />`;
      // Miệng tay áo có đường cong mềm mại
      html += `<ellipse cx="${W.x}" cy="${W.y}" rx="14" ry="7" fill="${adjustHex(colors.primary, -0.4)}" stroke="${colors.accent}" stroke-width="1.6" />`;
      html += `<path d="M ${W.x - 13} ${W.y} Q ${W.x} ${W.y + 3.5} ${W.x + 13} ${W.y}" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.7" />`;
    }

    // 2. Tay trái người mặc (x > 200) - Thả tự nhiên
    const W_left = leftArm.W;
    const loe = gender === 'male' ? 27 : 23;
    const O_left = { x: W_left.x + loe, y: W_left.y };
    const B_left = { x: (O_left.x + W_left.x) / 2, y: W_left.y + 50 };

    const thungLeftPts: Point[] = [
      { x: cx + (skel.shHalf - 3), y: skel.shY + skel.shDrop },
      { x: O_left.x + 3, y: (skel.shY + O_left.y) / 2 },
      { x: O_left.x, y: O_left.y },
      // Gấu tay áo và nếp rủ vải có độ cong lượn sóng nhẹ nhàng
      { x: O_left.x * 0.7 + B_left.x * 0.3, y: W_left.y + 30 },
      { x: B_left.x + 3, y: B_left.y },
      { x: B_left.x - 3, y: B_left.y + 2 },
      { x: W_left.x - 8, y: W_left.y + 35 },
      { x: cx + (skel.shHalf - 12), y: skel.armpit + 4 },
    ];

    html += `<path d="${smooth(thungLeftPts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;
    // Mảng màu tối (opacity 13%) dọc theo mặt trong của ống tay rộng bên trái
    html += `<path d="M ${cx + (skel.shHalf - 12)} ${skel.armpit + 4} C ${W_left.x - 8} ${W_left.y + 35}, ${B_left.x - 4} ${B_left.y - 8}, ${B_left.x} ${B_left.y} C ${B_left.x + 7} ${B_left.y - 10}, ${W_left.x} ${W_left.y + 24}, ${cx + (skel.shHalf - 6)} ${skel.armpit + 14} Z" fill="#000000" opacity="0.13" />`;
    // Nếp gấp vải lượn sóng nhẹ
    html += `<path d="M ${O_left.x - 5} ${O_left.y + 12} Q ${(O_left.x + B_left.x) / 2} ${(O_left.y + B_left.y) / 2 + 5} ${B_left.x + 4} ${B_left.y - 4}" stroke="${colors.stroke}" stroke-width="0.9" fill="none" opacity="0.4" />`;
    // Miệng tay áo
    html += `<ellipse cx="${W_left.x}" cy="${W_left.y}" rx="14" ry="7" fill="${adjustHex(colors.primary, -0.4)}" stroke="${colors.accent}" stroke-width="1.6" />`;
    html += `<path d="M ${W_left.x - 13} ${W_left.y} Q ${W_left.x} ${W_left.y + 3.5} ${W_left.x + 13} ${W_left.y}" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.7" />`;

    html += `</g>`;
    return html;
  }

  // ================= TAY ÁO HẸP (NGŨ THÂN, ÁO DÀI, TỨ THÂN) =================
  // 5 điểm: S, giữa bắp tay (lệch ra ngoài 1.5), E, giữa cẳng tay (lệch ra ngoài 1), W
  // Nửa bề rộng nữ [14.5, 13, 11, 10.5, 9], nam [14.5, 12.8, 10.8, 11.2, 9.6]
  const halfW =
    gender === 'female'
      ? [14.5, 13, 11, 10.5, 9]
      : [14.5, 12.8, 10.8, 11.2, 9.6];

  // 1. Tay phải người mặc (x < 200)
  if (rightArm.isFoldedFan) {
    // Tay gập cầm quạt (áo hẹp):
    // bắp tay = hình từ điểm vai, xuống quanh khuỷu (đầu khuỷu bo tròn), về nách;
    // cẳng tay = capsule(E, W) vẽ đè lên. Nửa bề rộng nữ [11.2, 7.8, 6.6], nam [14.5, 11, 9.4]
    const S = rightArm.S;
    const E = rightArm.E;
    const W = rightArm.W;
    const wCap = gender === 'female' ? { e: 10.5, w: 9 } : { e: 11, w: 9.4 };

    // Bắp tay
    const bicepPts: Point[] = [
      { x: cx - (skel.shHalf - 3), y: skel.shY + skel.shDrop },
      { x: (S.x + E.x) / 2 - 10, y: (S.y + E.y) / 2 },
      { x: E.x - wCap.e, y: E.y },
      { x: E.x, y: E.y + wCap.e },
      { x: E.x + wCap.e, y: E.y },
      { x: (S.x + E.x) / 2 + 6, y: (S.y + E.y) / 2 },
      { x: cx - (skel.shHalf - 12), y: skel.armpit + 4 },
    ];
    html += `<path d="${smooth(bicepPts, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;

    // Cẳng tay capsule
    html += `<path d="${capsule(E, W, wCap.e, wCap.w)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;

    // Cổ tay áo
    html += `<line x1="${W.x - 6}" y1="${W.y - 4}" x2="${W.x + 6}" y2="${W.y + 4}" stroke="${colors.stroke}" stroke-width="1.2" />`;
  } else {
    // Tay thả tự nhiên
    const S = rightArm.S;
    const E = rightArm.E;
    const W = rightArm.W;

    const midBicep: Point = {
      x: (S.x + E.x) / 2 - 1.5,
      y: (S.y + E.y) / 2,
    };
    const midForearm: Point = {
      x: (E.x + W.x) / 2 - 1.0,
      y: (E.y + W.y) / 2,
    };

    const pts = [S, midBicep, E, midForearm, W];
    const { outer, inner } = offsets(pts, halfW, halfW);

    // Điểm đầu biên ngoài = điểm vai của thân áo
    outer[0] = { x: cx - (skel.shHalf - 3), y: skel.shY + skel.shDrop };
    // Điểm đầu biên trong = điểm nách
    inner[0] = { x: cx - (skel.shHalf - 12), y: skel.armpit + 4 };

    // Ghép thành đa giác khép kín
    const sleevePolygon = [...outer, ...inner.slice().reverse()];
    html += `<path d="${smooth(sleevePolygon, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;

    // Đường cổ tay áo và nếp khuỷu
    html += `<line x1="${outer[4].x.toFixed(1)}" y1="${outer[4].y.toFixed(1)}" x2="${inner[4].x.toFixed(1)}" y2="${inner[4].y.toFixed(1)}" stroke="${colors.stroke}" stroke-width="1.2" />`;
    html += `<path d="M ${E.x - 2} ${E.y - 3} Q ${E.x + 2} ${E.y} ${E.x - 1} ${E.y + 3}" stroke="#000000" stroke-width="1" opacity="0.3" fill="none" />`;
  }

  // 2. Tay trái người mặc (x > 200) - Thả tự nhiên
  const S_left = leftArm.S;
  const E_left = leftArm.E;
  const W_left = leftArm.W;

  const midBicep_left: Point = {
    x: (S_left.x + E_left.x) / 2 + 1.5,
    y: (S_left.y + E_left.y) / 2,
  };
  const midForearm_left: Point = {
    x: (E_left.x + W_left.x) / 2 + 1.0,
    y: (E_left.y + W_left.y) / 2,
  };

  const ptsLeft = [S_left, midBicep_left, E_left, midForearm_left, W_left];
  const { outer: outerLeft, inner: innerLeft } = offsets(ptsLeft, halfW, halfW);

  outerLeft[0] = { x: cx + (skel.shHalf - 3), y: skel.shY + skel.shDrop };
  innerLeft[0] = { x: cx + (skel.shHalf - 12), y: skel.armpit + 4 };

  const sleeveLeftPolygon = [...outerLeft, ...innerLeft.slice().reverse()];
  html += `<path d="${smooth(sleeveLeftPolygon, true)}" fill="url(#${uid}-bodyGrad)" stroke="${colors.stroke}" stroke-width="1" />`;

  html += `<line x1="${outerLeft[4].x.toFixed(1)}" y1="${outerLeft[4].y.toFixed(1)}" x2="${innerLeft[4].x.toFixed(1)}" y2="${innerLeft[4].y.toFixed(1)}" stroke="${colors.stroke}" stroke-width="1.2" />`;
  html += `<path d="M ${E_left.x + 2} ${E_left.y - 3} Q ${E_left.x - 2} ${E_left.y} ${E_left.x + 1} ${E_left.y + 3}" stroke="#000000" stroke-width="1" opacity="0.3" fill="none" />`;

  html += `</g>`;
  return html;
}
