import { Point, smooth, adjustHex } from './figureMath';
import { SkeletonMeasurements, CostumeSpec, ArmKeypoints } from './figureSkeleton';
import { GarmentColors } from './figureGarments';

export function renderJewelry(
  skel: SkeletonMeasurements,
  colors: GarmentColors,
  hasPearls: boolean
): string {
  if (!hasPearls) return '';
  const cx = 200;
  // Chuỗi ngọc: 15 hạt theo đường cong từ cổ rủ xuống ngực, mặt khánh vàng
  let html = `<g id="pearl-necklace">`;
  const pearlCount = 15;
  const startY = skel.shY - 2;
  const bottomY = skel.armpit + 16;
  const widthAtTop = skel.neckHalf + 6;

  for (let i = 0; i < pearlCount; i++) {
    const t = i / (pearlCount - 1); // 0 to 1
    // Parabolic curve: x from -widthAtTop to +widthAtTop
    const angle = (t - 0.5) * Math.PI;
    const px = cx + Math.sin(angle) * (widthAtTop + 4);
    const py = startY + Math.cos(angle) * (bottomY - startY);

    html += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.3" fill="#FFFDF8" stroke="#E2E8F0" stroke-width="0.5" />`;
  }

  // Mặt khánh vàng ở đáy chuỗi ngọc
  html += `<path d="M ${cx - 7} ${bottomY + 1} Q ${cx} ${bottomY + 8} ${cx + 7} ${bottomY + 1} Q ${cx} ${bottomY - 2} ${cx - 7} ${bottomY + 1} Z" fill="#FBBF24" stroke="#D97706" stroke-width="0.8" />`;
  html += `</g>`;
  return html;
}

export function renderHeadAndFace(
  gender: 'female' | 'male',
  hairId: string | undefined,
  skel: SkeletonMeasurements,
  colors: GarmentColors,
  isCovered: boolean,
  hasHairPin: boolean = false
): string {
  const cx = 200;
  const hc = skel.crown;
  const hb = skel.chin;
  const hw = skel.headHalf;
  const shY = skel.shY;

  let html = `<g id="head-and-face">`;

  // Tai hai bên
  const earY = (hb + hc) / 2 + 5;
  const earW = 4.5;
  const earH = 8.5;
  html += `<ellipse cx="${cx - hw}" cy="${earY}" rx="${earW}" ry="${earH}" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" />`;
  html += `<ellipse cx="${cx + hw}" cy="${earY}" rx="${earW}" ry="${earH}" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" />`;

  // KHUÔN MẶT:
  if (gender === 'female') {
    const isBun = hairId === 'hair_female_bun' || hasHairPin;

    // BÚI TÓC NỮ (Búi tóc sau gáy & Trâm cài 3D)
    // Theo yêu cầu: Không ẩn búi tóc & trâm khi đội Mấn/Nón. Trâm cài cắm vào búi tóc sau mấn/nón vẫn hiển thị kiêu sa!
    if (isBun) {
      if (hasHairPin) {
        // SVG Group riêng cho búi tóc cài trâm 3D:
        // Trâm xiên chéo qua búi tóc (thân giữa bị búi tóc che khuất tạo hiệu ứng 3D đâm xuyên)
        html += `<g id="bun-with-pin-group">`;
        // 1. Chuôi trâm (thò ra góc dưới bên trái của búi tóc)
        html += `<line x1="${cx - 24}" y1="${hc + 7}" x2="${cx - 9}" y2="${hc - 1}" stroke="#B45309" stroke-width="2.8" stroke-linecap="round" />`;
        html += `<line x1="${cx - 24}" y1="${hc + 7}" x2="${cx - 9}" y2="${hc - 1}" stroke="#F59E0B" stroke-width="1.8" stroke-linecap="round" />`;

        // 2. Khối búi tóc (hair bun) tròn đầy đặn sau đỉnh đầu / sau gáy
        html += `<circle cx="${cx}" cy="${hc - 4}" r="15" fill="#1B1715" stroke="#3A2F29" stroke-width="1.2" />`;
        html += `<ellipse cx="${cx}" cy="${hc - 4}" rx="12.5" ry="10" fill="none" stroke="#4A3C35" stroke-width="1" opacity="0.8" />`;
        html += `<path d="M ${cx - 9} ${hc - 1} C ${cx - 5} ${hc - 9}, ${cx + 5} ${hc - 9}, ${cx + 9} ${hc - 1}" stroke="#3A2F29" stroke-width="1.3" fill="none" />`;
        html += `<path d="M ${cx - 6} ${hc - 6} C ${cx - 2} ${hc - 11}, ${cx + 3} ${hc - 11}, ${cx + 7} ${hc - 6}" stroke="#4A3C35" stroke-width="1" fill="none" opacity="0.7" />`;

        // 3. Đầu trâm & ngọc hoa sen vàng (thò ra góc trên bên phải của búi tóc/mấn)
        html += `<line x1="${cx + 9}" y1="${hc - 7}" x2="${cx + 26}" y2="${hc - 18}" stroke="#B45309" stroke-width="2.8" stroke-linecap="round" />`;
        html += `<line x1="${cx + 9}" y1="${hc - 7}" x2="${cx + 26}" y2="${hc - 18}" stroke="#F59E0B" stroke-width="1.8" stroke-linecap="round" />`;
        // Khối hoa sen / hạt ngọc đỏ ruby
        html += `<circle cx="${cx + 27}" cy="${hc - 18}" r="4.8" fill="#DC2626" stroke="#991B1B" stroke-width="0.8" />`;
        html += `<circle cx="${cx + 27}" cy="${hc - 18}" r="2.2" fill="#FDE047" />`;
        // Tua rua rủ vàng ngọc nhẹ nhàng
        html += `<path d="M ${cx + 25} ${hc - 14} Q ${cx + 21} ${hc - 3} ${cx + 23} ${hc + 6}" stroke="#D97706" stroke-width="1.2" fill="none" stroke-linecap="round" />`;
        html += `<circle cx="${cx + 23}" cy="${hc + 7}" r="1.8" fill="#EF4444" />`;
        html += `<path d="M ${cx + 28} ${hc - 14} Q ${cx + 30} ${hc - 1} ${cx + 27} ${hc + 10}" stroke="#D97706" stroke-width="1.2" fill="none" stroke-linecap="round" />`;
        html += `<circle cx="${cx + 27}" cy="${hc + 11}" r="2" fill="#FBBF24" />`;
        html += `</g>`;
      } else {
        // Búi tóc tròn r 13 tại (cx, hc-3) không trâm
        html += `<circle cx="${cx}" cy="${hc - 3}" r="13" fill="#1F1916" stroke="#3A2F29" stroke-width="1" />`;
        html += `<ellipse cx="${cx}" cy="${hc - 3}" rx="11" ry="10" fill="none" stroke="#3A2F29" stroke-width="0.8" opacity="0.6" />`;
      }
    }

    // a) Khuôn mặt nữ: CẢI THIỆN ĐƯỜNG CONG TRÁI XOAN MỀM MẠI, CẰM THON GỌN, KHÔNG GÓC CẠNH
    const facePathFemale = `M ${cx} ${hc} C ${cx + 16} ${hc}, ${cx + hw} ${hc + 13}, ${cx + hw - 0.5} ${hc + 27} C ${cx + hw - 1} ${hc + 39}, ${cx + 12} ${hb - 3}, ${cx} ${hb} C ${cx - 12} ${hb - 3}, ${cx - hw + 1} ${hc + 39}, ${cx - hw + 0.5} ${hc + 27} C ${cx - hw} ${hc + 13}, ${cx - 16} ${hc}, ${cx} ${hc} Z`;
    html += `<path d="${facePathFemale}" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" />`;

    // b) MÁ HỒNG (BLUSH): 2 hình ellipse mờ màu hồng pastel ở hai bên gò má
    const blushY = hb - 22;
    html += `<ellipse cx="${cx - 13.5}" cy="${blushY}" rx="6.2" ry="3.8" fill="#FB7185" opacity="0.32" />`;
    html += `<ellipse cx="${cx + 13.5}" cy="${blushY}" rx="6.2" ry="3.8" fill="#FB7185" opacity="0.32" />`;
  } else {
    // Mặt NAM có QUAI HÀM GÓC CẠNH (các đoạn thẳng: má → góc hàm → cằm phẳng rộng 20) + nét bóng dọc xương hàm
    const cheekY = hc + 35;
    const jawY = hb - 12;
    const chinY = hb;
    const chinHalfW = 10; // rộng 20

    html += `<path d="M ${cx} ${hc} C ${cx - hw - 2} ${hc + 10}, ${cx - hw} ${cheekY - 10}, ${cx - hw} ${cheekY} L ${cx - hw + 3} ${jawY} L ${cx - chinHalfW} ${chinY} L ${cx + chinHalfW} ${chinY} L ${cx + hw - 3} ${jawY} L ${cx + hw} ${cheekY} C ${cx + hw} ${cheekY - 10}, ${cx + hw + 2} ${hc + 10}, ${cx} ${hc} Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.9" />`;

    // Nét bóng dọc xương hàm nam
    html += `<path d="M ${cx - hw + 3} ${jawY} L ${cx - chinHalfW} ${chinY}" stroke="${colors.skinShadow}" stroke-width="1.6" opacity="0.75" />`;
    html += `<path d="M ${cx + hw - 3} ${jawY} L ${cx + chinHalfW} ${chinY}" stroke="${colors.skinShadow}" stroke-width="1.6" opacity="0.75" />`;
  }

  // MẮT: ở 52% chiều cao đầu, cách trục giữa ±10
  const headHeight = hb - hc;
  const eyeY = hb - headHeight * 0.48;

  if (gender === 'female') {
    // MẮT NỮ: To, tròn, long lanh và có nét viền cong nhẹ vút lên ở đuôi (winged eyeliner makeup cô dâu)
    const eyeH = 4.8;
    [-10.5, 10.5].forEach((ox) => {
      const ex = cx + ox;
      const isLeftEye = ox < 0; // Bên trái hình (mắt phải người mẫu)

      // Lòng trắng mắt to tròn
      html += `<path d="M ${ex - 6.2} ${eyeY} Q ${ex} ${eyeY - eyeH} ${ex + 6.2} ${eyeY} Q ${ex} ${eyeY + eyeH * 0.88} ${ex - 6.2} ${eyeY} Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.4" />`;
      // Tròng mắt to tròn nâu đen hạt dẻ r 3.0
      html += `<circle cx="${ex}" cy="${eyeY}" r="3.0" fill="#321D12" />`;
      // Con ngươi sâu r 1.5
      html += `<circle cx="${ex}" cy="${eyeY}" r="1.5" fill="#000000" />`;
      // 2 Chấm sáng lấp lánh (catchlights)
      html += `<circle cx="${ex + 1.1}" cy="${eyeY - 1.1}" r="0.95" fill="#FFFFFF" />`;
      html += `<circle cx="${ex - 1.2}" cy="${eyeY + 1.2}" r="0.55" fill="#FFFFFF" opacity="0.85" />`;
      // Viền mi trên đậm, cong tròn và vút nhẹ ở đuôi mắt
      const wingX = isLeftEye ? ex - 7.6 : ex + 7.6;
      const wingY = eyeY - 2.0;
      html += `<path d="M ${isLeftEye ? wingX : ex - 6.4} ${isLeftEye ? wingY : eyeY} Q ${ex} ${eyeY - eyeH - 0.7} ${isLeftEye ? ex + 6.4 : wingX} ${isLeftEye ? eyeY : wingY}" stroke="#1E1B18" stroke-width="1.3" stroke-linecap="round" fill="none" />`;
    });
  } else {
    // Mắt NAM: hẹp hơn, phong cách điềm tĩnh
    const eyeH = 3.2;
    [-10, 10].forEach((ox) => {
      const ex = cx + ox;
      html += `<path d="M ${ex - 5.5} ${eyeY} Q ${ex} ${eyeY - eyeH} ${ex + 5.5} ${eyeY} Q ${ex} ${eyeY + eyeH * 0.85} ${ex - 5.5} ${eyeY} Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.4" />`;
      html += `<circle cx="${ex}" cy="${eyeY}" r="2.7" fill="#451A03" />`;
      html += `<circle cx="${ex}" cy="${eyeY}" r="1.3" fill="#000000" />`;
      html += `<circle cx="${ex + 0.9}" cy="${eyeY - 0.9}" r="0.8" fill="#FFFFFF" />`;
      html += `<path d="M ${ex - 6} ${eyeY} Q ${ex} ${eyeY - eyeH - 0.5} ${ex + 6} ${eyeY}" stroke="#1E1B18" stroke-width="1.2" stroke-linecap="round" fill="none" />`;
    });
  }

  // LÔNG MÀY:
  const browY = eyeY - (gender === 'female' ? 6.5 : 5.8);
  if (gender === 'female') {
    // Lông mày nữ cong mảnh
    html += `<path d="M ${cx - 16} ${browY + 1} Q ${cx - 10} ${browY - 2.5} ${cx - 4} ${browY}" stroke="#271F1B" stroke-width="1.2" stroke-linecap="round" fill="none" />`;
    html += `<path d="M ${cx + 4} ${browY} Q ${cx + 10} ${browY - 2.5} ${cx + 16} ${browY + 1}" stroke="#271F1B" stroke-width="1.2" stroke-linecap="round" fill="none" />`;
  } else {
    // Lông mày NAM: khối đậm dày gần thẳng, đuôi hơi nhếch lên
    html += `<polygon points="${cx - 17},${browY - 1} ${cx - 4},${browY + 0.8} ${cx - 4},${browY + 2.6} ${cx - 17},${browY + 1.2}" fill="#1F1916" />`;
    html += `<polygon points="${cx + 4},${browY + 0.8} ${cx + 17},${browY - 1} ${cx + 17},${browY + 1.2} ${cx + 4},${browY + 2.6}" fill="#1F1916" />`;
  }

  // MŨI: nét cong và nét cánh mũi
  const noseY = eyeY + 12;
  html += `<path d="M ${cx - 1} ${eyeY + 2} Q ${cx + 0.5} ${noseY - 3} ${cx - 1.5} ${noseY} Q ${cx + 2} ${noseY + 1.5} ${cx + 3.5} ${noseY}" stroke="${colors.skinStroke}" stroke-width="1" stroke-linecap="round" fill="none" />`;

  // MÔI:
  const lipY = noseY + 8;
  if (gender === 'female') {
    // Môi NỮ: Màu đỏ tươi pha hồng cam rực rỡ, nét vẽ đầy đặn căng mọng chuẩn makeup cô dâu truyền thống
    const lipColor = '#E11D48'; // Đỏ tươi ánh hồng cam tươi tắn
    const lipW = 7.2;
    const lipH = 3.4;

    // Môi trên: đường cong trái tim mềm mại
    html += `<path d="M ${cx - lipW} ${lipY} Q ${cx - lipW * 0.45} ${lipY - lipH} ${cx} ${lipY - lipH * 0.65} Q ${cx + lipW * 0.45} ${lipY - lipH} ${cx + lipW} ${lipY} Q ${cx} ${lipY + 0.6} ${cx - lipW} ${lipY} Z" fill="${lipColor}" />`;
    // Môi dưới: đầy đặn, căng tròn
    html += `<path d="M ${cx - lipW + 0.8} ${lipY} Q ${cx} ${lipY + lipH * 1.3} ${cx + lipW - 0.8} ${lipY} Z" fill="${adjustHex(lipColor, -0.08)}" />`;
    // Điểm bóng sáng căng mọng ở giữa môi dưới
    html += `<ellipse cx="${cx}" cy="${lipY + 2.2}" rx="2.6" ry="1.1" fill="#FDA4AF" opacity="0.65" />`;
  } else {
    // Môi NAM: tông tự nhiên, vừa phải
    const lipColor = '#B7766A';
    const lipW = 5.2;
    const lipH = 2.0;
    html += `<path d="M ${cx - lipW} ${lipY} Q ${cx - lipW * 0.4} ${lipY - lipH} ${cx} ${lipY - lipH * 0.6} Q ${cx + lipW * 0.4} ${lipY - lipH} ${cx + lipW} ${lipY} Q ${cx} ${lipY + 0.5} ${cx - lipW} ${lipY} Z" fill="${lipColor}" />`;
    html += `<path d="M ${cx - lipW + 1} ${lipY} Q ${cx} ${lipY + lipH * 1.2} ${cx + lipW - 1} ${lipY} Z" fill="${adjustHex(lipColor, -0.1)}" />`;
  }

  // TÓC TRƯỚC (Front hair):
  if (gender === 'female') {
    // Mảng TÓC TRƯỚC nữ phủ đỉnh đầu, rẽ ngôi giữa
    const frontHairFemale = `M ${cx - hw - 1},${hc + 30} C ${cx - hw - 4},${hc + 4} ${cx - 12},${hc - 6} ${cx},${hc - 6} C ${cx + 12},${hc - 6} ${cx + hw + 4},${hc + 4} ${cx + hw + 1},${hc + 30} C ${cx + hw - 3},${hc + 18} ${cx + 14},${hc + 8} ${cx + 1.5},${hc + 7} L ${cx},${hc + 10} L ${cx - 1.5},${hc + 7} C ${cx - 14},${hc + 8} ${cx - hw + 3},${hc + 18} ${cx - hw - 1},${hc + 30} Z`;
    html += `<path d="${frontHairFemale}" fill="#1F1916" />`;

    // Hai nét ánh tóc màu #3A2F29 từ ngôi toả xuống hai bên
    html += `<path d="M ${cx - 2} ${hc + 9} C ${cx - 7} ${hc + 11} ${cx - 13} ${hc + 16} ${cx - 18} ${hc + 24}" stroke="#3A2F29" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.85" />`;
    html += `<path d="M ${cx + 2} ${hc + 9} C ${cx + 7} ${hc + 11} ${cx + 13} ${hc + 16} ${cx + 18} ${hc + 24}" stroke="#3A2F29" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.85" />`;

    const isBun = hairId === 'hair_female_bun' || hasHairPin;
    if (isBun) {
      // Mai tóc ngắn hai bên thái dương
      html += `<path d="M ${cx - hw - 0.5} ${hc + 22} C ${cx - hw - 2} ${hc + 34} ${cx - hw + 1.5} ${hc + 46} C ${cx - hw + 2.5} ${hc + 36} ${cx - hw + 1.5} ${hc + 24} Z" fill="#1F1916" />`;
      html += `<path d="M ${cx + hw + 0.5} ${hc + 22} C ${cx + hw + 2} ${hc + 34} ${cx + hw - 1.5} ${hc + 46} C ${cx + hw - 2.5} ${hc + 36} ${cx + hw - 1.5} ${hc + 24} Z" fill="#1F1916" />`;
    } else {
      // Tóc dài: hai lọn tóc thon nhọn buông trước vai
      const leftLock = `M ${cx - (hw + 1.5)},${hc + 24} C ${cx - (hw + 6)},${hc + 58} ${cx - (hw + 3)},${shY - 2} ${cx - (hw + 9)},${shY + 40} C ${cx - (hw + 1)},${shY + 16} ${cx - (hw - 3)},${shY - 14} ${cx - (hw - 1.5)},${hc + 34} Z`;
      const rightLock = `M ${cx + (hw + 1.5)},${hc + 24} C ${cx + (hw + 6)},${hc + 58} ${cx + (hw + 3)},${shY - 2} ${cx + (hw + 9)},${shY + 40} C ${cx + (hw + 1)},${shY + 16} ${cx + (hw - 3)},${shY - 14} ${cx + (hw - 1.5)},${hc + 34} Z`;
      html += `<path d="${leftLock}" fill="#1F1916" />`;
      html += `<path d="${rightLock}" fill="#1F1916" />`;
    }
  } else {
    // ================= TÓC NAM: TÁCH THÀNH BaseHair & TopHair =================
    // 1. BaseHair: Chân tóc, mai tóc hai bên tai và viền sau dái tai
    // BẮT BUỘC GIỮ LẠI KỂ CẢ KHI isCovered === true (đội khăn xếp, nón, mũ) để nhân vật không bị hói
    html += `<g id="male-base-hair">`;
    // Tóc mai trái (sideburns) ôm trước tai tự nhiên bằng đường cong bezier
    html += `<path d="M ${cx - hw + 2.5} ${hc + 14} C ${cx - hw + 1} ${hc + 20}, ${cx - hw - 0.5} ${earY - 2}, ${cx - hw + 0.5} ${earY + 7} C ${cx - hw + 2.8} ${earY + 7}, ${cx - hw + 3.8} ${earY + 1}, ${cx - hw + 3.2} ${hc + 18} Z" fill="#1C1816" />`;
    // Tóc mai phải
    html += `<path d="M ${cx + hw - 2.5} ${hc + 14} C ${cx + hw - 1} ${hc + 20}, ${cx + hw + 0.5} ${earY - 2}, ${cx + hw - 0.5} ${earY + 7} C ${cx + hw - 2.8} ${earY + 7}, ${cx + hw - 3.8} ${earY + 1}, ${cx + hw - 3.2} ${hc + 18} Z" fill="#1C1816" />`;

    // Đường chân tóc tự nhiên quanh trán
    html += `<path d="M ${cx - hw + 2} ${hc + 17} C ${cx - 11} ${hc + 13}, ${cx - 2} ${hc + 15}, ${cx} ${hc + 15} C ${cx + 2} ${hc + 15}, ${cx + 11} ${hc + 13}, ${cx + hw - 2} ${hc + 17} C ${cx + hw} ${hc + 11}, ${cx + 12} ${hc + 5}, ${cx} ${hc + 5} C ${cx - 12} ${hc + 5}, ${cx - hw} ${hc + 11}, ${cx - hw + 2} ${hc + 17} Z" fill="#1C1816" />`;

    // Mép tóc sau dái tai
    html += `<path d="M ${cx - hw - 1} ${earY - 1} C ${cx - hw - 3.5} ${earY + 5}, ${cx - hw - 2} ${earY + 10}, ${cx - hw + 1} ${earY + 10} Z" fill="#1C1816" />`;
    html += `<path d="M ${cx + hw + 1} ${earY - 1} C ${cx + hw + 3.5} ${earY + 5}, ${cx + hw + 2} ${earY + 10}, ${cx + hw - 1} ${earY + 10} Z" fill="#1C1816" />`;
    html += `</g>`;

    // 2. TopHair: Chỏm tóc, búi tóc, mái
    // Khi isCovered === true (đội khăn xếp, nón, mũ) thì ẨN lớp TopHair này
    if (!isCovered) {
      html += `<g id="male-top-hair">`;
      if (hairId === 'hair_male_topknot') {
        // Nam búi tó: đường cong bezier vuốt ngược gọn gàng lên đỉnh đầu
        html += `<path d="M ${cx - hw + 2} ${hc + 17} C ${cx - 12} ${hc + 4}, ${cx + 12} ${hc + 4}, ${cx + hw - 2} ${hc + 17} C ${cx + hw + 2} ${hc - 2}, ${cx} ${hc - 8}, ${cx - hw - 2} ${hc - 2} Z" fill="#1C1816" stroke="#3A2F29" stroke-width="0.8" />`;
        html += `<path d="M ${cx - 8} ${hc + 14} C ${cx - 5} ${hc + 4}, ${cx - 2} ${hc - 3}, ${cx} ${hc - 6}" stroke="#3A2F29" stroke-width="1.2" fill="none" opacity="0.75" />`;
        html += `<path d="M ${cx + 8} ${hc + 14} C ${cx + 5} ${hc + 4}, ${cx + 2} ${hc - 3}, ${cx} ${hc - 6}" stroke="#3A2F29" stroke-width="1.2" fill="none" opacity="0.75" />`;
      } else {
        // Nam tóc ngắn: Phong cách Flat Design với các đường cong bezier mềm mại, tỷ lệ chuẩn, không dùng polygon nhọn hoắt
        html += `<path d="M ${cx - hw + 1} ${hc + 16} C ${cx - hw - 2} ${hc + 2}, ${cx - 16} ${hc - 8}, ${cx - 3} ${hc - 9} C ${cx + 5} ${hc - 10}, ${cx + 15} ${hc - 7}, ${cx + hw + 2} ${hc + 2} C ${cx + hw + 3} ${hc + 10}, ${cx + hw} ${hc + 16}, ${cx + hw - 2} ${hc + 16} C ${cx + 12} ${hc + 12}, ${cx + 3} ${hc + 14}, ${cx - 3} ${hc + 15} C ${cx - 9} ${hc + 14}, ${cx - 14} ${hc + 12}, ${cx - hw + 1} ${hc + 16} Z" fill="#1C1816" stroke="#3A2F29" stroke-width="0.8" />`;
        // Highlight sợi tóc cong mềm mại
        html += `<path d="M ${cx - 10} ${hc - 5} C ${cx - 4} ${hc - 4}, ${cx + 3} ${hc + 2}, ${cx + 7} ${hc + 8}" stroke="#3A2F29" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.8" />`;
        html += `<path d="M ${cx - 3} ${hc - 6} C ${cx + 5} ${hc - 3}, ${cx + 11} ${hc + 3}, ${cx + 13} ${hc + 9}" stroke="#3A2F29" stroke-width="1.3" stroke-linecap="round" fill="none" opacity="0.8" />`;
        html += `<path d="M ${cx - 15} ${hc + 5} C ${cx - 11} ${hc + 1}, ${cx - 5} ${hc + 5}, ${cx - 4} ${hc + 10}" stroke="#3A2F29" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.6" />`;
      }
      html += `</g>`;
    }
  }

  html += `</g>`;
  return html;
}

export function renderHeadwear(
  accIds: string[],
  gender: 'female' | 'male',
  skel: SkeletonMeasurements,
  colors: GarmentColors,
  uid: string = 'headwear'
): string {
  const cx = 200;
  const hc = skel.crown;
  const hw = skel.headHalf;
  let html = `<g id="headwear-layer">`;

  // 1. KHĂN ĐÓNG (nam): khối tròn dẹt quanh đầu màu #1C2130, 6 nếp ngang, chữ "nhân" (hình chữ V ngược) nổi ở giữa trán
  if (accIds.includes('khan_dong')) {
    const turbanY = hc + 12;
    html += `<ellipse cx="${cx}" cy="${turbanY}" rx="${hw + 5}" ry="15" fill="#1C2130" stroke="#0F141F" stroke-width="1.2" />`;
    // 6 nếp ngang
    for (let i = 1; i <= 6; i++) {
      const ny = turbanY - 8 + i * 2.6;
      const rx = hw + 5 - Math.abs(i - 3) * 0.8;
      html += `<path d="M ${cx - rx} ${ny} Q ${cx} ${ny + 4} ${cx + rx} ${ny}" stroke="#2B3245" stroke-width="0.9" fill="none" />`;
    }
    // Chữ "nhân" (chữ V ngược) ở giữa trán
    html += `<path d="M ${cx - 8} ${turbanY + 8} L ${cx} ${turbanY + 1} L ${cx + 8} ${turbanY + 8}" stroke="#F1F5F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />`;
  }

  // 2. KHĂN VẤN (nữ): KHỐI VÀNH KHĂN (TORUS/DONUT SHAPE) TRÒN TRỊA, CÓ ĐỘ PHỒNG 3D, ÔM NHẸ ĐỈNH ĐẦU
  if (accIds.includes('khan_van')) {
    const vanCenterY = hc + 4;
    const vanOuterRx = hw + 16;
    const vanOuterRy = 16;
    const vanInnerRx = hw - 4;
    const vanInnerRy = 8.5;

    // Vành khăn Torus / Donut (dùng fill-rule="evenodd" tạo vành khăn rỗng ở giữa để lộ phần tóc đỉnh/sau gáy)
    const torusD = `M ${cx} ${vanCenterY - vanOuterRy} C ${cx + vanOuterRx * 0.55} ${vanCenterY - vanOuterRy}, ${cx + vanOuterRx} ${vanCenterY - vanOuterRy * 0.4}, ${cx + vanOuterRx} ${vanCenterY} C ${cx + vanOuterRx} ${vanCenterY + vanOuterRy * 0.7}, ${cx + vanOuterRx * 0.55} ${vanCenterY + vanOuterRy}, ${cx} ${vanCenterY + vanOuterRy} C ${cx - vanOuterRx * 0.55} ${vanCenterY + vanOuterRy}, ${cx - vanOuterRx} ${vanCenterY + vanOuterRy * 0.7}, ${cx - vanOuterRx} ${vanCenterY} C ${cx - vanOuterRx} ${vanCenterY - vanOuterRy * 0.4}, ${cx - vanOuterRx * 0.55} ${vanCenterY - vanOuterRy}, ${cx} ${vanCenterY - vanOuterRy} Z M ${cx} ${vanCenterY - vanInnerRy} C ${cx - vanInnerRx * 0.55} ${vanCenterY - vanInnerRy}, ${cx - vanInnerRx} ${vanCenterY - vanInnerRy * 0.2}, ${cx - vanInnerRx} ${vanCenterY + 2} C ${cx - vanInnerRx} ${vanCenterY + vanInnerRy * 0.7}, ${cx - vanInnerRx * 0.55} ${vanCenterY + vanInnerRy}, ${cx} ${vanCenterY + vanInnerRy} C ${cx + vanInnerRx * 0.55} ${vanCenterY + vanInnerRy}, ${cx + vanInnerRx} ${vanCenterY + vanInnerRy * 0.7}, ${cx + vanInnerRx} ${vanCenterY + 2} C ${cx + vanInnerRx} ${vanCenterY - vanInnerRy * 0.2}, ${cx + vanInnerRx * 0.55} ${vanCenterY - vanInnerRy}, ${cx} ${vanCenterY - vanInnerRy} Z`;

    html += `<path d="${torusD}" fill="url(#${uid}-manDarkGrad)" fill-rule="evenodd" stroke="#120F0E" stroke-width="1.2" />`;

    // Mảng bóng mờ chân vành khăn (tạo độ phồng 3D mặt dưới)
    html += `<path d="M ${cx - vanOuterRx + 4} ${vanCenterY + 5} C ${cx - vanOuterRx * 0.5} ${vanCenterY + vanOuterRy + 1}, ${cx + vanOuterRx * 0.5} ${vanCenterY + vanOuterRy + 1}, ${cx + vanOuterRx - 4} ${vanCenterY + 5} C ${cx + vanInnerRx} ${vanCenterY + vanInnerRy}, ${cx - vanInnerRx} ${vanCenterY + vanInnerRy}, ${cx - vanOuterRx + 4} ${vanCenterY + 5} Z" fill="#000000" opacity="0.25" />`;

    // Dải sáng highlight cong theo gờ trên đỉnh mấn
    html += `<path d="M ${cx - vanOuterRx + 8} ${vanCenterY - vanOuterRy + 5} C ${cx - 15} ${vanCenterY - vanOuterRy + 1}, ${cx + 15} ${vanCenterY - vanOuterRy + 1}, ${cx + vanOuterRx - 8} ${vanCenterY - vanOuterRy + 5}" stroke="#5E4E45" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8" />`;

    // Các đường nếp xoắn xéo tự nhiên quấn quanh vành khăn
    const twistX = [-26, -16, -6, 6, 16, 26];
    twistX.forEach((ox) => {
      const topX = cx + ox - 4;
      const botX = cx + ox + 6;
      const topY = vanCenterY - vanOuterRy * 0.75;
      const botY = vanCenterY + vanOuterRy * 0.8;
      html += `<path d="M ${topX.toFixed(1)} ${topY.toFixed(1)} Q ${cx + ox} ${vanCenterY} ${botX.toFixed(1)} ${botY.toFixed(1)}" stroke="#453831" stroke-width="2.0" stroke-linecap="round" fill="none" opacity="0.85" />`;
    });
  }

  // 3. MẤN ĐỘI ĐẦU / KHĂN VÀNH (man_doi_dau): KHỐI VÀNH KHĂN (TORUS/DONUT SHAPE) TRÒN TRỊA, PHỒNG 3D HOÀNG GIA / CÔ DÂU
  if (accIds.includes('man_doi_dau')) {
    const manCenterY = hc + 3;
    const manOuterRx = hw + 18;
    const manOuterRy = 18;
    const manInnerRx = hw - 3;
    const manInnerRy = 9.5;

    // Khối Torus / Donut hình vành xuyến lượn cong Bezier tròn trịa
    const manTorusD = `M ${cx} ${manCenterY - manOuterRy} C ${cx + manOuterRx * 0.55} ${manCenterY - manOuterRy}, ${cx + manOuterRx} ${manCenterY - manOuterRy * 0.4}, ${cx + manOuterRx} ${manCenterY} C ${cx + manOuterRx} ${manCenterY + manOuterRy * 0.75}, ${cx + manOuterRx * 0.55} ${manCenterY + manOuterRy}, ${cx} ${manCenterY + manOuterRy} C ${cx - manOuterRx * 0.55} ${manCenterY + manOuterRy}, ${cx - manOuterRx} ${manCenterY + manOuterRy * 0.75}, ${cx - manOuterRx} ${manCenterY} C ${cx - manOuterRx} ${manCenterY - manOuterRy * 0.4}, ${cx - manOuterRx * 0.55} ${manCenterY - manOuterRy}, ${cx} ${manCenterY - manOuterRy} Z M ${cx} ${manCenterY - manInnerRy} C ${cx - manInnerRx * 0.55} ${manCenterY - manInnerRy}, ${cx - manInnerRx} ${manCenterY - manInnerRy * 0.2}, ${cx - manInnerRx} ${manCenterY + 2} C ${cx - manInnerRx} ${manCenterY + manInnerRy * 0.75}, ${cx - manInnerRx * 0.55} ${manCenterY + manInnerRy}, ${cx} ${manCenterY + manInnerRy} C ${cx + manInnerRx * 0.55} ${manCenterY + manInnerRy}, ${cx + manInnerRx} ${manCenterY + manInnerRy * 0.75}, ${cx + manInnerRx} ${manCenterY + 2} C ${cx + manInnerRx} ${manCenterY - manInnerRy * 0.2}, ${cx + manInnerRx * 0.55} ${manCenterY - manInnerRy}, ${cx} ${manCenterY - manInnerRy} Z`;

    html += `<path d="${manTorusD}" fill="url(#${uid}-manGoldGrad)" fill-rule="evenodd" stroke="#B45309" stroke-width="1.3" />`;

    // Mảng bóng mờ dưới chân mấn (độ phồng 3D mặt sau & đáy vành)
    html += `<path d="M ${cx - manOuterRx + 4} ${manCenterY + 6} C ${cx - manOuterRx * 0.5} ${manCenterY + manOuterRy + 1.5}, ${cx + manOuterRx * 0.5} ${manCenterY + manOuterRy + 1.5}, ${cx + manOuterRx - 4} ${manCenterY + 6} C ${cx + manInnerRx} ${manCenterY + manInnerRy}, ${cx - manInnerRx} ${manCenterY + manInnerRy}, ${cx - manOuterRx + 4} ${manCenterY + 6} Z" fill="#78350F" opacity="0.3" />`;

    // Gờ sáng highlight phản chiếu ánh kim trên đỉnh mấn cô dâu
    html += `<path d="M ${cx - manOuterRx + 8} ${manCenterY - manOuterRy + 5} C ${cx - 18} ${manCenterY - manOuterRy + 1}, ${cx + 18} ${manCenterY - manOuterRy + 1}, ${cx + manOuterRx - 8} ${manCenterY - manOuterRy + 5}" stroke="#FEF3C7" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.9" />`;

    // 4 nếp cuộn mấn cô dâu uốn lượn Bezier song song theo độ cong khối xuyến
    for (let i = 1; i <= 4; i++) {
      const frac = i / 5;
      const rx_i = manInnerRx + (manOuterRx - manInnerRx) * frac;
      const ry_i = manInnerRy + (manOuterRy - manInnerRy) * frac;
      html += `<path d="M ${cx - rx_i + 2} ${manCenterY - ry_i * 0.3} C ${cx - rx_i * 0.5} ${manCenterY - ry_i}, ${cx + rx_i * 0.5} ${manCenterY - ry_i}, ${cx + rx_i - 2} ${manCenterY - ry_i * 0.3}" stroke="#D97706" stroke-width="1.0" fill="none" opacity="0.8" />`;
      html += `<path d="M ${cx - rx_i + 3} ${manCenterY + 2} C ${cx - rx_i * 0.5} ${manCenterY + ry_i * 0.9}, ${cx + rx_i * 0.5} ${manCenterY + ry_i * 0.9}, ${cx + rx_i - 3} ${manCenterY + 2}" stroke="#D97706" stroke-width="0.9" fill="none" opacity="0.65" />`;
    }

    // HOA SEN NGỌC ĐÍNH CHÍNH GIỮA TRÁN MẤN CÔ DÂU:
    const jewelY = manCenterY + manOuterRy - 3.5;
    // Bông hoa sen vàng 8 cánh chạm nổi
    html += `<circle cx="${cx}" cy="${jewelY}" r="5.5" fill="#F59E0B" stroke="#B45309" stroke-width="0.8" />`;
    // Hạt ngọc ruby đỏ thẫm
    html += `<circle cx="${cx}" cy="${jewelY}" r="3.2" fill="#DC2626" stroke="#991B1B" stroke-width="0.7" />`;
    // Chấm sáng ngọc
    html += `<circle cx="${cx + 0.8}" cy="${jewelY - 0.8}" r="1.1" fill="#FEF08A" />`;
    // Đính 2 hạt ngọc trai nhỏ hai bên
    html += `<circle cx="${cx - 8.5}" cy="${jewelY}" r="1.8" fill="#FFFBEB" stroke="#D97706" stroke-width="0.5" />`;
    html += `<circle cx="${cx + 8.5}" cy="${jewelY}" r="1.8" fill="#FFFBEB" stroke="#D97706" stroke-width="0.5" />`;
  }

  // 4. NÓN LÁ (Cải thiện độ sâu 3D với ellipse lót đáy lòng nón tối màu & dải lụa mềm mại rủ sóng)
  if (accIds.includes('non_la')) {
    const apex = { x: cx, y: skel.crown - 32 };
    const brimY = skel.crown + 18;
    const brimW = 68;
    const chinUnder = skel.chin + 6;

    // A. HÌNH ELLIPSE LÓT ĐÁY NÓN (PHÍA BÊN TRONG LÒNG NÓN CÓ MÀU TỐI HƠN TẠO CHIỀU SÂU THẬT)
    html += `<ellipse cx="${cx}" cy="${brimY + 4}" rx="${brimW - 3}" ry="13" fill="url(#${uid}-nonLaInnerGrad)" stroke="#4A3B22" stroke-width="0.8" />`;

    // B. DẢI LỤA (QUAI NÓN) MỀM MẠI: Uốn lượn Bezier ôm má, thắt nơ nhẹ và rủ sóng tha thướt
    // Hai dải lụa ôm má từ lòng nón xuống cằm
    html += `<path d="M ${cx - 38} ${brimY + 4} C ${cx - hw - 8} ${brimY + 16}, ${cx - 18} ${chinUnder}, ${cx} ${chinUnder + 2}" fill="none" stroke="#DC2626" stroke-width="2.8" stroke-linecap="round" />`;
    html += `<path d="M ${cx + 38} ${brimY + 4} C ${cx + hw + 8} ${brimY + 16}, ${cx + 18} ${chinUnder}, ${cx} ${chinUnder + 2}" fill="none" stroke="#DC2626" stroke-width="2.8" stroke-linecap="round" />`;

    // Nút thắt nơ lụa mềm dưới cằm
    html += `<ellipse cx="${cx}" cy="${chinUnder + 2}" rx="3.2" ry="2.2" fill="#B91C1C" stroke="#991B1B" stroke-width="0.6" />`;

    // 2 Dải lụa mềm mại rủ xuống ngực với đường cong S-curve mềm rủ uyển chuyển
    // Dải trái rủ mềm
    html += `<path d="M ${cx - 1} ${chinUnder + 3} C ${cx - 8} ${chinUnder + 14}, ${cx - 16} ${chinUnder + 24}, ${cx - 11} ${chinUnder + 38} C ${cx - 7} ${chinUnder + 48}, ${cx - 13} ${chinUnder + 58}, ${cx - 16} ${chinUnder + 66}" fill="none" stroke="#DC2626" stroke-width="2.5" stroke-linecap="round" />`;
    html += `<path d="M ${cx - 1} ${chinUnder + 3} C ${cx - 8} ${chinUnder + 14}, ${cx - 15} ${chinUnder + 24}, ${cx - 11} ${chinUnder + 38}" fill="none" stroke="#991B1B" stroke-width="1.0" stroke-linecap="round" opacity="0.6" />`;

    // Dải phải lượn dài hơn, rủ nhẹ nhàng bay bổng
    html += `<path d="M ${cx + 1} ${chinUnder + 3} C ${cx + 8} ${chinUnder + 15}, ${cx + 17} ${chinUnder + 26}, ${cx + 13} ${chinUnder + 42} C ${cx + 10} ${chinUnder + 54}, ${cx + 16} ${chinUnder + 64}, ${cx + 20} ${chinUnder + 74}" fill="none" stroke="#E11D48" stroke-width="2.5" stroke-linecap="round" />`;
    html += `<path d="M ${cx + 1} ${chinUnder + 3} C ${cx + 8} ${chinUnder + 15}, ${cx + 16} ${chinUnder + 26}, ${cx + 13} ${chinUnder + 42}" fill="none" stroke="#B91C1C" stroke-width="1.0" stroke-linecap="round" opacity="0.6" />`;

    // C. THÂN NÓN LÁ GÓC NHÌN 3D PERSPECTIVE:
    // Nón hình nón cong 3D từ đỉnh chóp xuống hai mép vành ngoài, đáy elip cong
    html += `<path d="M ${apex.x} ${apex.y} L ${cx - brimW} ${brimY} C ${cx - brimW * 0.55} ${brimY + 13}, ${cx + brimW * 0.55} ${brimY + 13}, ${cx + brimW} ${brimY} Z" fill="url(#${uid}-nonLaGrad)" stroke="#C8B388" stroke-width="1" />`;

    // Vành nón 3D (viền đáy nón)
    html += `<path d="M ${cx - brimW} ${brimY} C ${cx - brimW * 0.55} ${brimY + 13}, ${cx + brimW * 0.55} ${brimY + 13}, ${cx + brimW} ${brimY} C ${cx + brimW * 0.55} ${brimY + 9}, ${cx - brimW * 0.55} ${brimY + 9}, ${cx - brimW} ${brimY} Z" fill="url(#${uid}-nonLaBrimGrad)" stroke="#B8A070" stroke-width="0.7" />`;

    // 6 vòng nan nón lá uốn theo cung elip cong 3D
    for (let i = 1; i <= 6; i++) {
      const frac = i / 7;
      const ny = apex.y + (brimY - apex.y) * frac;
      const nrx = brimW * frac;
      const nry = 12 * frac;
      html += `<path d="M ${(cx - nrx).toFixed(1)} ${ny.toFixed(1)} C ${(cx - nrx * 0.55).toFixed(1)} ${(ny + nry).toFixed(1)}, ${(cx + nrx * 0.55).toFixed(1)} ${(ny + nry).toFixed(1)}, ${(cx + nrx).toFixed(1)} ${ny.toFixed(1)}" fill="none" stroke="#E6DAC0" stroke-width="0.75" />`;
    }
    // Nan dọc tỏa từ đỉnh
    html += `<line x1="${apex.x}" y1="${apex.y}" x2="${cx}" y2="${brimY + 12}" stroke="#D4C29A" stroke-width="0.6" opacity="0.6" />`;
    html += `<line x1="${apex.x}" y1="${apex.y}" x2="${cx - 30}" y2="${brimY + 8}" stroke="#D4C29A" stroke-width="0.6" opacity="0.5" />`;
    html += `<line x1="${apex.x}" y1="${apex.y}" x2="${cx + 30}" y2="${brimY + 8}" stroke="#D4C29A" stroke-width="0.6" opacity="0.5" />`;
    // Chóp nhọn nón lá
    html += `<circle cx="${apex.x}" cy="${apex.y + 1}" r="2" fill="#D4C29A" />`;
  }

  // 5. BERET: nghiêng một bên, có núm
  if (accIds.includes('beret')) {
    const beretX = cx - 4;
    const beretY = skel.crown + 6;
    html += `<g transform="rotate(-12, ${beretX}, ${beretY})">`;
    html += `<ellipse cx="${beretX}" cy="${beretY}" rx="${skel.headHalf + 10}" ry="14" fill="#334155" stroke="#1E293B" stroke-width="1.2" />`;
    html += `<line x1="${beretX}" y1="${beretY - 14}" x2="${beretX}" y2="${beretY - 20}" stroke="#1E293B" stroke-width="2.2" stroke-linecap="round" />`;
    html += `</g>`;
  }

  // 6. TAI NGHE: vòm vòng qua đầu, hai tai nghe
  if (accIds.includes('over_ear_headphones')) {
    const hasBulkyHat = accIds.some((id) => ['khan_dong', 'khan_van', 'man_doi_dau', 'beret'].includes(id));
    const archH = hasBulkyHat ? skel.headHalf + 16 : skel.headHalf + 10;
    const archTopY = hasBulkyHat ? skel.crown - 10 : skel.crown - 2;
    const earCenterY = (skel.chin + skel.crown) / 2 + 5;

    html += `<path d="M ${cx - skel.headHalf - 6} ${earCenterY} C ${cx - archH} ${archTopY}, ${cx + archH} ${archTopY}, ${cx + skel.headHalf + 6} ${earCenterY}" stroke="#0F172A" stroke-width="4" fill="none" stroke-linecap="round" />`;
    html += `<rect x="${cx - skel.headHalf - 12}" y="${earCenterY - 12}" width="10" height="24" rx="5" fill="#334155" stroke="#0F172A" stroke-width="1.2" />`;
    html += `<rect x="${cx + skel.headHalf + 2}" y="${earCenterY - 12}" width="10" height="24" rx="5" fill="#334155" stroke="#0F172A" stroke-width="1.2" />`;
  }

  // 7. KÍNH RÂM: hai tròng bo góc
  if (accIds.includes('sunglasses')) {
    const eyeY = skel.chin - (skel.chin - skel.crown) * 0.48;
    html += `<line x1="${cx - 4}" y1="${eyeY}" x2="${cx + 4}" y2="${eyeY}" stroke="#0F172A" stroke-width="1.8" />`;
    html += `<rect x="${cx - 18}" y="${eyeY - 6}" width="14" height="12" rx="3.5" fill="#0F172A" stroke="#334155" stroke-width="1" />`;
    html += `<rect x="${cx + 4}" y="${eyeY - 6}" width="14" height="12" rx="3.5" fill="#0F172A" stroke="#334155" stroke-width="1" />`;
    html += `<line x1="${cx - 15}" y1="${eyeY + 3}" x2="${cx - 8}" y2="${eyeY - 4}" stroke="#64748B" stroke-width="1.2" opacity="0.6" />`;
    html += `<line x1="${cx + 7}" y1="${eyeY + 3}" x2="${cx + 14}" y2="${eyeY - 4}" stroke="#64748B" stroke-width="1.2" opacity="0.6" />`;
  }

  // TRÂM CÀI TÓC: ĐÃ XÓA BỎ VÌ ĐƯỢC CHUYỂN VÀO NHÓM BÚI TÓC 3D (bun-with-pin-group) VỚI ĐÚNG VỊ TRÍ SAU ĐẦU!

  html += `</g>`;
  return html;
}

export function renderFan(
  accIds: string[],
  rightArm: ArmKeypoints,
  isClasped: boolean = false
): string {
  if (isClasped) return '';
  const hasFanG = accIds.includes('quat_giay');
  const hasFanT = accIds.includes('quat_thu_phap');
  if (!hasFanG && !hasFanT) return '';

  // Quạt xếp bán kính 44, mở 110°, 8 nan
  // Quạt thư pháp ghi chữ quốc ngữ "Tâm"
  // Quạt giấy vẽ hoa sen hồng
  // Hướng mở: tay hẹp gập (-118°), tay thụng (-80°), tay thả (100°)
  let angleDeg = 100;
  if (rightArm.isFoldedFan) angleDeg = -118;
  if (rightArm.isWideFan) angleDeg = -80;

  const W = rightArm.W;
  const radius = 44;
  const openDeg = 110;
  const startAng = angleDeg - openDeg / 2;
  const endAng = angleDeg + openDeg / 2;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const rad1 = toRad(startAng);
  const rad2 = toRad(endAng);

  const p1 = { x: W.x + radius * Math.cos(rad1), y: W.y + radius * Math.sin(rad1) };
  const p2 = { x: W.x + radius * Math.cos(rad2), y: W.y + radius * Math.sin(rad2) };

  let html = `<g id="fan-prop">`;

  // Mảng quạt xòe
  html += `<path d="M ${W.x} ${W.y} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${radius} ${radius} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} Z" fill="#FFFDF8" stroke="#D4AF37" stroke-width="0.8" />`;

  // 8 nan quạt
  for (let i = 0; i < 8; i++) {
    const a = toRad(startAng + (openDeg * i) / 7);
    const nx = W.x + radius * Math.cos(a);
    const ny = W.y + radius * Math.sin(a);
    html += `<line x1="${W.x}" y1="${W.y}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}" stroke="#92400E" stroke-width="1.2" opacity="0.85" />`;
  }

  // Họa tiết giữa quạt
  const midAng = toRad(angleDeg);
  const textX = W.x + radius * 0.65 * Math.cos(midAng);
  const textY = W.y + radius * 0.65 * Math.sin(midAng);

  if (hasFanT) {
    // Quạt thư pháp: chữ quốc ngữ "Tâm"
    html += `<text x="${textX.toFixed(1)}" y="${textY.toFixed(1)}" font-family="serif" font-size="9" font-weight="bold" fill="#1C1917" text-anchor="middle" dominant-baseline="middle">Tâm</text>`;
  } else {
    // Quạt giấy hoa sen hồng
    html += `<circle cx="${textX.toFixed(1)}" cy="${textY.toFixed(1)}" r="4.5" fill="#FDA4AF" opacity="0.9" />`;
    html += `<circle cx="${textX.toFixed(1)}" cy="${textY.toFixed(1)}" r="2" fill="#F43F5E" />`;
  }

  html += `</g>`;
  return html;
}

export function renderHands(
  spec: CostumeSpec,
  gender: 'female' | 'male',
  colors: GarmentColors,
  rightArm: ArmKeypoints,
  leftArm: ArmKeypoints,
  hasFan: boolean,
  hasBag: boolean = false
): string {
  // Bàn tay: vẽ trong hệ tọa độ riêng (cổ tay ở gốc, ngón hướng +y), xoay theo hướng khuỷu→cổ tay, lật gương cho tay bên phải hình
  // Tay thả: lòng bàn tay thon dài ~35, ngón cái áp sát mặt trong, 2 nét ngón mờ
  // Tay nắm: nắm tay tròn ~20 có ngón cái ôm. Nam phóng to 1.24, nữ 1.32
  const scale = gender === 'male' ? 1.24 : 1.32;
  let html = `<g id="hands-layer">`;

  // Nếu là Nhật bình và không cầm quạt lẫn không có túi: cả hai tay đã chắp giấu trong tay áo
  if (spec.id === 'ao_nhat_binh' && !hasBag) {
    html += `</g>`;
    return html;
  }

  const isFemaleWideSleeve = gender === 'female' && (spec.id === 'ao_tac' || spec.id === 'ao_nhat_binh');

  // 1. TAY PHẢI NGƯỜI MẶC (bên trái hình x < 200)
  const W_r = rightArm.W;
  const E_r = rightArm.E;
  const angle_r = (Math.atan2(W_r.y - E_r.y, W_r.x - E_r.x) * 180) / Math.PI - 90;

  html += `<g transform="translate(${W_r.x}, ${W_r.y}) rotate(${angle_r.toFixed(1)}) scale(${scale})">`;
  if (isFemaleWideSleeve) {
    if (hasFan) {
      // Nữ Áo Tấc / Nhật Bình cầm quạt: Bàn tay ngọc ngà từ TRONG lòng ống tay rộng vươn ra ôm cán quạt
      html += `<path d="M -2.5 0 C -4.8 2 -5.8 5 -5.5 10 C -5.2 14 -2.0 15.5 0.5 15.5 C 3.0 15.5 5.5 13.5 5.5 9 C 5.5 5 4.0 1.5 2.5 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" stroke-linejoin="round" />`;
      html += `<path d="M -2.5 4.5 C -0.8 6.5 2.0 7 4.2 5.8" stroke="${colors.skinStroke}" stroke-width="1.0" stroke-linecap="round" fill="none" />`;
      // Mép trước miệng tay áo rộng đè nhẹ lên gốc tay để bàn tay lấp ló từ BÊN TRONG lòng ống tay
      html += `<path d="M -12 -2 Q 0 4 12 -2" stroke="${colors.stroke}" stroke-width="1.4" fill="none" />`;
    } else {
      // Nữ Áo Tấc / Nhật Bình thả tự nhiên: Các ngón tay thon dài búp măng lấp ló từ BÊN TRONG lòng ống tay rộng rủ sâu
      html += `<path d="M -3 0 C -3.6 4 -4.0 9 -3.5 14 C -3.0 17.5 -1.8 20.5 -0.6 20.5 C 0.8 20.5 1.8 18 2.0 15 C 2.4 12 2.4 9 2.0 6 C 3.2 5 4.2 3.5 4.2 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.75" stroke-linejoin="round" />`;
      // Kẽ ngón tay búp măng mềm mại
      html += `<path d="M -0.8 12 C -0.8 15 -0.6 18 -0.5 20" stroke="${colors.skinStroke}" stroke-width="0.55" stroke-linecap="round" fill="none" opacity="0.4" />`;
      html += `<path d="M 1.8 8 C 1.4 6 1.4 3 2.0 1" stroke="${colors.skinStroke}" stroke-width="0.65" stroke-linecap="round" fill="none" opacity="0.5" />`;
      // Mép trước miệng tay áo rộng phủ lên gốc tay (bàn tay lấp ló từ bên trong)
      html += `<path d="M -13 -2 Q 0 4 13 -2" stroke="${colors.stroke}" stroke-width="1.4" fill="none" />`;
    }
  } else if (hasFan) {
    // Bàn tay cầm quạt: Flat design khép tay ôm cán quạt
    html += `<path d="M -3 0 C -5.5 2 -6.5 6 -6.2 11 C -5.8 15 -2.5 16.5 0.5 16.5 C 3.5 16.5 6.2 14.5 6.2 10 C 6.2 5.5 4.5 1.5 3 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" stroke-linejoin="round" />`;
    // Ngón cái gập ngang ôm cán quạt
    html += `<path d="M -3 5 C -1 7.5 2.5 8 5 6.5" stroke="${colors.skinStroke}" stroke-width="1.1" stroke-linecap="round" fill="none" />`;
    // Gợi nếp khớp ngón tròn mềm
    html += `<path d="M -4.5 10 C -2.5 12.5 1 13 4 11.5" stroke="${colors.skinStroke}" stroke-width="0.8" stroke-linecap="round" fill="none" opacity="0.6" />`;
    html += `<path d="M -3 13.5 C -1 14.8 1.5 14.8 3 13.8" stroke="${colors.skinStroke}" stroke-width="0.7" stroke-linecap="round" fill="none" opacity="0.5" />`;
  } else {
    // Bàn tay thả tự nhiên: Flat design tối giản, ngón cái tách nhẹ, 4 ngón gộp khối bo tròn mềm mại
    html += `<path d="M -3.5 0 C -4.2 6 -4.8 14 -4.2 20 C -3.8 24.5 -2.5 28.5 -0.8 28.5 C 1.2 28.5 2.5 25.5 2.8 22 C 3.2 18 3.2 15 2.8 14 C 4.2 13.5 5.8 11.5 5.8 8 C 5.8 4.5 4.5 2 3.5 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" stroke-linejoin="round" />`;
    // Đường rãnh mềm giữa ngón cái và lòng bàn tay
    html += `<path d="M 2.8 14 C 2.2 10 2.2 6 3.0 2" stroke="${colors.skinStroke}" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.6" />`;
    // Đường rãnh phân ngón nhẹ nhàng
    html += `<path d="M -1.2 18 C -1.2 22 -1.0 25 -0.8 27" stroke="${colors.skinStroke}" stroke-width="0.6" stroke-linecap="round" fill="none" opacity="0.35" />`;
  }
  html += `</g>`;

  // 2. TAY TRÁI NGƯỜI MẶC (bên phải hình x > 200)
  const W_l = leftArm.W;
  const E_l = leftArm.E;
  const angle_l = (Math.atan2(W_l.y - E_l.y, W_l.x - E_l.x) * 180) / Math.PI - 90;

  html += `<g transform="translate(${W_l.x}, ${W_l.y}) rotate(${angle_l.toFixed(1)}) scale(${-scale}, ${scale})">`;
  if (isFemaleWideSleeve) {
    if (hasBag) {
      // Tay đón quai túi từ TRONG lòng ống tay rộng
      html += `<path d="M -3 0 C -3.6 4 -4.0 9 -3.5 14 C -3.0 17.5 -1.8 20.5 -0.6 20.5 C 0.8 20.5 1.8 18 2.0 15 C 2.4 12 2.4 9 2.0 6 C 3.2 5 4.2 3.5 4.2 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.75" stroke-linejoin="round" />`;
      html += `<path d="M -0.8 12 C -0.8 15 -0.6 18 -0.5 20" stroke="${colors.skinStroke}" stroke-width="0.55" stroke-linecap="round" fill="none" opacity="0.4" />`;
      html += `<path d="M -13 -2 Q 0 4 13 -2" stroke="${colors.stroke}" stroke-width="1.4" fill="none" />`;
    } else {
      // Bàn tay lấp ló từ BÊN TRONG lòng ống tay rộng
      html += `<path d="M -3 0 C -3.6 4 -4.0 9 -3.5 14 C -3.0 17.5 -1.8 20.5 -0.6 20.5 C 0.8 20.5 1.8 18 2.0 15 C 2.4 12 2.4 9 2.0 6 C 3.2 5 4.2 3.5 4.2 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.75" stroke-linejoin="round" />`;
      html += `<path d="M -0.8 12 C -0.8 15 -0.6 18 -0.5 20" stroke="${colors.skinStroke}" stroke-width="0.55" stroke-linecap="round" fill="none" opacity="0.4" />`;
      html += `<path d="M 1.8 8 C 1.4 6 1.4 3 2.0 1" stroke="${colors.skinStroke}" stroke-width="0.65" stroke-linecap="round" fill="none" opacity="0.5" />`;
      html += `<path d="M -13 -2 Q 0 4 13 -2" stroke="${colors.stroke}" stroke-width="1.4" fill="none" />`;
    }
  } else if (hasBag) {
    // Tay móc quai túi: bàn tay hơi uốn cong đón quai túi vắt qua cổ tay
    html += `<path d="M -3.5 0 C -4.2 5 -4.6 12 -4.0 18 C -3.5 23 -2.2 27 -0.5 27 C 1.2 27 2.4 24 2.6 20 C 3.0 16 3.4 13 4.8 10 C 5.5 7.5 5.2 4 3.5 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" stroke-linejoin="round" />`;
    html += `<path d="M 2.6 15 C 2.0 11 2.2 7 3.2 2" stroke="${colors.skinStroke}" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.6" />`;
    html += `<path d="M -1.0 17 C -1.0 21 -0.8 24 -0.6 26" stroke="${colors.skinStroke}" stroke-width="0.6" stroke-linecap="round" fill="none" opacity="0.35" />`;
  } else {
    // Bàn tay thả tự nhiên
    html += `<path d="M -3.5 0 C -4.2 6 -4.8 14 -4.2 20 C -3.8 24.5 -2.5 28.5 -0.8 28.5 C 1.2 28.5 2.5 25.5 2.8 22 C 3.2 18 3.2 15 2.8 14 C 4.2 13.5 5.8 11.5 5.8 8 C 5.8 4.5 4.5 2 3.5 0 Z" fill="${colors.skin}" stroke="${colors.skinStroke}" stroke-width="0.8" stroke-linejoin="round" />`;
    html += `<path d="M 2.8 14 C 2.2 10 2.2 6 3.0 2" stroke="${colors.skinStroke}" stroke-width="0.75" stroke-linecap="round" fill="none" opacity="0.6" />`;
    html += `<path d="M -1.2 18 C -1.2 22 -1.0 25 -0.8 27" stroke="${colors.skinStroke}" stroke-width="0.6" stroke-linecap="round" fill="none" opacity="0.35" />`;
  }
  html += `</g>`;

  html += `</g>`;
  return html;
}

export function renderBags(
  accIds: string[],
  leftArm: ArmKeypoints,
  isClasped: boolean = false
): string {
  if (isClasped) return '';
  const hasTote = accIds.includes('tote_bag');
  const hasMay = accIds.includes('tui_may_tre');
  if (!hasTote && !hasMay) return '';

  const W = leftArm.W;
  let html = `<g id="bag-prop">`;

  // Quai MÓC QUA CỔ TAY, túi treo bên dưới
  if (hasTote) {
    // Túi tote vải bố #F1E8D6 có chữ "VIỆT / REMIX"
    const bagX = W.x - 14;
    const bagY = W.y + 24;
    // Quai túi vắt qua cổ tay W
    html += `<path d="M ${bagX + 8} ${bagY} Q ${W.x} ${W.y - 12} ${W.x} ${W.y} Q ${W.x + 8} ${W.y + 12} ${bagX + 26} ${bagY}" stroke="#334155" stroke-width="2.4" fill="none" stroke-linecap="round" />`;
    // Thân túi
    html += `<rect x="${bagX}" y="${bagY}" width="34" height="42" rx="3" fill="#F1E8D6" stroke="#D6CBBA" stroke-width="1.2" />`;
    // Chữ VIỆT / REMIX
    html += `<text x="${bagX + 17}" y="${bagY + 18}" font-family="sans-serif" font-size="6.5" font-weight="900" fill="#991B1B" text-anchor="middle">VIỆT</text>`;
    html += `<text x="${bagX + 17}" y="${bagY + 27}" font-family="sans-serif" font-size="5" font-weight="700" fill="#1E293B" text-anchor="middle">REMIX</text>`;
  } else if (hasMay) {
    // Túi mây tre #D5AE72 có vân đan
    const bagX = W.x - 13;
    const bagY = W.y + 22;
    html += `<path d="M ${bagX + 7} ${bagY} Q ${W.x} ${W.y - 14} ${W.x} ${W.y} Q ${W.x + 8} ${W.y + 12} ${bagX + 23} ${bagY}" stroke="#78350F" stroke-width="2.4" fill="none" stroke-linecap="round" />`;
    html += `<rect x="${bagX}" y="${bagY}" width="30" height="32" rx="6" fill="#D5AE72" stroke="#92400E" stroke-width="1.2" />`;
    // Vân đan
    html += `<line x1="${bagX + 2}" y1="${bagY + 10}" x2="${bagX + 28}" y2="${bagY + 10}" stroke="#B45309" stroke-width="0.9" stroke-dasharray="3 2" />`;
    html += `<line x1="${bagX + 2}" y1="${bagY + 20}" x2="${bagX + 28}" y2="${bagY + 20}" stroke="#B45309" stroke-width="0.9" stroke-dasharray="3 2" />`;
    html += `<line x1="${bagX + 10}" y1="${bagY}" x2="${bagX + 10}" y2="${bagY + 32}" stroke="#B45309" stroke-width="0.9" stroke-dasharray="3 2" />`;
    html += `<line x1="${bagX + 20}" y1="${bagY}" x2="${bagX + 20}" y2="${bagY + 32}" stroke="#B45309" stroke-width="0.9" stroke-dasharray="3 2" />`;
  }

  html += `</g>`;
  return html;
}

export function renderFootwear(
  accIds: string[],
  gender: 'female' | 'male',
  skel: SkeletonMeasurements,
  colors: GarmentColors
): string {
  const cx = 200;
  const ankleY = skel.ankleY;
  const isSneaker = accIds.includes('sneaker');
  const isHaiTheu = accIds.includes('hai_theu');
  const isGuocMoc = accIds.includes('guoc_moc_nam');

  let html = `<g id="footwear-layer">`;

  // Tọa độ cổ chân mỗi bên
  const leftX = cx - (skel.hipHalf - 6);
  const rightX = cx + (skel.hipHalf - 6);

  // Render 1 chiếc giày bên phải người mặc (x < 200, bên trái hình) và lật gương cho bên trái
  const renderSingleShoe = (isMirrored: boolean) => {
    let s = '';
    if (isSneaker) {
      // Sneaker trắng đế dày có vệt màu accent
      s += `<path d="M -16 6 Q -12 -3 4 -3 L 14 -1 Q 20 3 20 9 L 20 14 L -18 14 Q -18 10 -16 6 Z" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="0.8" />`;
      // Đế dày
      s += `<rect x="-18" y="11" width="38" height="5" rx="1.5" fill="#F1F5F9" stroke="#94A3B8" stroke-width="0.8" />`;
      // Vệt màu accent
      s += `<path d="M -10 6 Q 0 9 12 4" stroke="${colors.accent}" stroke-width="2.2" stroke-linecap="round" fill="none" />`;
    } else if (isHaiTheu) {
      // Hài thêu đỏ mũi cong có chỉ vàng
      s += `<path d="M -14 5 Q -6 -2 10 -1 Q 18 -1 20 -5 Q 22 -1 18 6 L -14 8 Z" fill="#DC2626" stroke="#991B1B" stroke-width="0.8" />`;
      s += `<circle cx="19" cy="-4" r="1.8" fill="#FBBF24" />`;
      s += `<path d="M -6 4 Q 4 1 12 3" stroke="#FDE047" stroke-width="1" fill="none" />`;
    } else if (isGuocMoc) {
      // Guốc mộc nam đế gỗ quai đen
      s += `<rect x="-14" y="6" width="32" height="7" rx="1.8" fill="#854D0E" stroke="#582E06" stroke-width="0.8" />`;
      s += `<path d="M -10 6 C -6 -1 6 -1 10 6 Z" fill="#0F172A" stroke="#334155" stroke-width="0.8" />`;
    } else {
      // Giày vải đen tối giản
      s += `<path d="M -13 4 Q -4 -2 12 -1 Q 17 2 17 8 L -15 8 Z" fill="#1E293B" stroke="#0F172A" stroke-width="0.8" />`;
    }
    return s;
  };

  // Giày phải người mặc (bên trái hình)
  html += `<g transform="translate(${leftX}, ${ankleY})">`;
  html += renderSingleShoe(false);
  html += `</g>`;

  // Giày trái người mặc (bên phải hình) - Lật gương scale(-1, 1)
  html += `<g transform="translate(${rightX}, ${ankleY}) scale(-1, 1)">`;
  html += renderSingleShoe(true);
  html += `</g>`;

  html += `</g>`;
  return html;
}

export function renderZoneAnnotations(
  zone: 'none' | 'vung_loi' | 'vung_remix',
  spec: CostumeSpec,
  skel: SkeletonMeasurements
): string {
  if (zone === 'none') return '';

  const cx = 200;
  let html = `<g id="zone-annotations">`;

  // Chú thích: elip / khung nét đứt quanh vùng + nhãn bo tròn chữ trắng.
  // Nhãn bên trái căn phải tại x = 118, nhãn bên phải căn trái tại x = 290 nhưng KHÔNG vượt quá x = 396
  // Vùng lõi màu #C0392B; Vùng remix màu #C2710C
  if (zone === 'vung_loi') {
    const col = '#C0392B';

    // 1. Cổ áo
    html += `<ellipse cx="${cx}" cy="${skel.shY - 6}" rx="22" ry="15" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2" />`;
    const colText = spec.id === 'ao_tu_than' ? '🔒 Vạt trước mở' : spec.id === 'ao_giao_linh' ? '🔒 Cổ giao lĩnh' : spec.id === 'ao_nhat_binh' ? '🔒 Cổ nhật bình' : '🔒 Cổ lập lĩnh bất biến';
    // Nhãn bên trái căn phải tại x = 118
    const labelW1 = 112;
    html += `<g transform="translate(${118 - labelW1}, ${skel.shY - 17})">`;
    html += `<rect x="0" y="0" width="${labelW1}" height="22" rx="6" fill="${col}" opacity="0.95" />`;
    html += `<text x="${labelW1 / 2}" y="14" fill="#FFFFFF" font-size="8.5" font-weight="bold" text-anchor="middle">${colText}</text>`;
    html += `<line x1="${labelW1}" y1="11" x2="${labelW1 + 16}" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2" />`;
    html += `</g>`;

    // 2. Đường cài / Yếm
    html += `<ellipse cx="${cx - 18}" cy="${skel.shY + 45}" rx="24" ry="34" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2" />`;
    const closeText = spec.id === 'ao_tu_than' ? '🔒 Yếm & Thắt lưng bao' : spec.id === 'ao_nhat_binh' ? '🔒 Hai dải cổ buông' : '🔒 5 Cúc Ngũ Thường';
    const labelW2 = 120;
    // Nhãn bên phải căn trái tại x = 290 (không vượt quá 396)
    const posX2 = Math.min(290, 396 - labelW2);
    html += `<g transform="translate(${posX2}, ${skel.shY + 34})">`;
    html += `<rect x="0" y="0" width="${labelW2}" height="22" rx="6" fill="${col}" opacity="0.95" />`;
    html += `<text x="${labelW2 / 2}" y="14" fill="#FFFFFF" font-size="8.5" font-weight="bold" text-anchor="middle">${closeText}</text>`;
    html += `<line x1="0" y1="11" x2="-14" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2" />`;
    html += `</g>`;

    // 3. Cấu trúc thân / Tà áo
    html += `<rect x="${cx - 45}" y="${skel.waistY + 20}" width="90" height="130" rx="8" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="5 3" />`;
    const bodyText = spec.id === 'ao_tu_than' ? '🔒 Tứ thân phụ mẫu' : spec.id === 'ao_dai_tan_thoi' ? '🔒 Phom tà dài thướt tha' : '🔒 Cấu trúc ngũ thân';
    const labelW3 = 114;
    html += `<g transform="translate(${118 - labelW3}, ${skel.waistY + 80})">`;
    html += `<rect x="0" y="0" width="${labelW3}" height="22" rx="6" fill="${col}" opacity="0.95" />`;
    html += `<text x="${labelW3 / 2}" y="14" fill="#FFFFFF" font-size="8.5" font-weight="bold" text-anchor="middle">${bodyText}</text>`;
    html += `<line x1="${labelW3}" y1="11" x2="${labelW3 + 24}" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2" />`;
    html += `</g>`;
  } else if (zone === 'vung_remix') {
    const col = '#C2710C';

    // 1. Đầu: Nón · kính · tai nghe
    html += `<ellipse cx="${cx}" cy="${skel.crown + 35}" rx="38" ry="34" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2" />`;
    const labelW1 = 126;
    const posX1 = Math.min(290, 396 - labelW1);
    html += `<g transform="translate(${posX1}, ${skel.crown + 24})">`;
    html += `<rect x="0" y="0" width="${labelW1}" height="22" rx="6" fill="${col}" opacity="0.95" />`;
    html += `<text x="${labelW1 / 2}" y="14" fill="#FFFFFF" font-size="8" font-weight="bold" text-anchor="middle">⚡ Nón · kính · tai nghe</text>`;
    html += `<line x1="0" y1="11" x2="-14" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2" />`;
    html += `</g>`;

    // 2. Thân: Màu sắc tự do
    html += `<circle cx="${cx}" cy="${skel.waistY}" r="28" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2" />`;
    const labelW2 = 110;
    html += `<g transform="translate(${118 - labelW2}, ${skel.waistY - 11})">`;
    html += `<rect x="0" y="0" width="${labelW2}" height="22" rx="6" fill="${col}" opacity="0.95" />`;
    html += `<text x="${labelW2 / 2}" y="14" fill="#FFFFFF" font-size="8.5" font-weight="bold" text-anchor="middle">⚡ Màu sắc tự do</text>`;
    html += `<line x1="${labelW2}" y1="11" x2="${labelW2 + 26}" y2="11" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2" />`;
    html += `</g>`;

    // 3. Giày
    html += `<rect x="${cx - 65}" y="${skel.ankleY - 6}" width="130" height="26" rx="6" fill="none" stroke="${col}" stroke-width="1.8" stroke-dasharray="4 2" />`;
    const labelW3 = 130;
    html += `<g transform="translate(${cx - labelW3 / 2}, ${skel.ankleY + 28})">`;
    html += `<rect x="0" y="0" width="${labelW3}" height="22" rx="6" fill="${col}" opacity="0.95" />`;
    html += `<text x="${labelW3 / 2}" y="14" fill="#FFFFFF" font-size="8" font-weight="bold" text-anchor="middle">⚡ Sneaker · Hài · Guốc</text>`;
    html += `<line x1="${labelW3 / 2}" y1="0" x2="${labelW3 / 2}" y2="-8" stroke="${col}" stroke-width="1.5" stroke-dasharray="3 2" />`;
    html += `</g>`;
  }

  html += `</g>`;
  return html;
}
