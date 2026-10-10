import { SkeletonMeasurements } from './figureSkeleton';

const f1 = (n: number) => Math.round(n * 10) / 10;

/* Lớp sau đầu: vẽ NGAY SAU renderBackHair, trước quần/thân áo */
export function femaleHeadBack(skel: SkeletonMeasurements, accIds: string[], hairId?: string): string {
  const cx = 200, hc = skel.crown, hw = skel.headHalf, shY = skel.shY;
  let s = '';
  if (accIds.includes('khan_van')) {
    // nửa sau của vành khăn, nhô lên phía trên đỉnh đầu
    s += `<path d="M${cx - hw - 12},${hc + 6} C${cx - hw - 11},${hc - 22} ${cx + hw + 11},${hc - 22} ${cx + hw + 12},${hc + 6} L${cx + hw - 2},${hc + 6} C${cx + hw - 4},${hc - 9} ${cx - hw + 4},${hc - 9} ${cx - hw + 2},${hc + 6} Z" fill="#1E1A18" stroke="#0E0B0A" stroke-width="1"/>`;
    s += `<path d="M${cx - hw - 3},${hc - 4} C${cx - 12},${hc - 15} ${cx + 12},${hc - 15} ${cx + hw + 3},${hc - 4}" fill="none" stroke="#4B413C" stroke-width="1.1"/>`;
  } else if (accIds.includes('man_doi_dau')) {
    // mấn (kiểu nón quai thao) đội hếch ra sau đầu: thấy mặt dưới lòng mấn, vẽ SAU đầu
    const id = 'manU' + Math.round(hc);
    const yc = hc - 4, rx = 62, ry = 27;
    s += `<radialGradient id="${id}" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#EEDCAE"/><stop offset=".7" stop-color="#E2C891"/><stop offset="1" stop-color="#CFB075"/></radialGradient>`;
    // thành mấn (mép ngoài) lộ thành vệt cong phía trên
    s += `<ellipse cx="${cx}" cy="${yc}" rx="${rx}" ry="${ry}" fill="#A9864A" stroke="#7A5E2C" stroke-width="1"/>`;
    // lòng mấn (mặt dưới), lệch xuống một chút để thấy độ dày của thành
    s += `<ellipse cx="${cx}" cy="${yc + 2.5}" rx="${rx - 2}" ry="${ry - 2.5}" fill="url(#${id})"/>`;
    // viền đan nhiều màu sát mép
    s += `<ellipse cx="${cx}" cy="${yc + 2.5}" rx="${rx - 5}" ry="${ry - 5}" fill="none" stroke="#3F8F58" stroke-width="3"/>`;
    s += `<ellipse cx="${cx}" cy="${yc + 2.5}" rx="${rx - 5}" ry="${ry - 5}" fill="none" stroke="#D5487A" stroke-width="3" stroke-dasharray="3.2 3.2"/>`;
    // nan mấn đồng tâm
    for (const k of [0.84, 0.5]) s += `<ellipse cx="${cx}" cy="${yc + 2.5}" rx="${f1((rx - 2) * k)}" ry="${f1((ry - 2.5) * k)}" fill="none" stroke="#C9AB6E" stroke-width=".7"/>`;
    // vòng hoa văn: hai đường chỉ + các ô trám đỏ
    for (const [k, c] of [[0.7, '#B7322C']] as [number, string][]) s += `<ellipse cx="${cx}" cy="${yc + 2.5}" rx="${f1((rx - 2) * k)}" ry="${f1((ry - 2.5) * k)}" fill="none" stroke="${c}" stroke-width=".9"/>`;
    for (let i = 0; i < 8; i++) {
      const t = (i / 8) * Math.PI * 2 + Math.PI / 8, k = 0.62, x = cx + (rx - 2) * k * Math.cos(t), y = yc + 2.5 + (ry - 2.5) * k * Math.sin(t);
      s += `<path d="M${f1(x - 3.4)},${f1(y)} L${f1(x)},${f1(y - 2)} L${f1(x + 3.4)},${f1(y)} L${f1(x)},${f1(y + 2)} Z" fill="#C0392B" opacity=".85"/>`;
    }
    // khua: vòng vàng ôm đỉnh đầu, có bóng lõm xung quanh
    s += `<ellipse cx="${cx}" cy="${yc + 5}" rx="27" ry="13" fill="#8A6A33" opacity=".28"/>`;
    s += `<ellipse cx="${cx}" cy="${yc + 4}" rx="24" ry="11" fill="#F0BF2E" stroke="#B8891A" stroke-width="1"/>`;
    s += `<ellipse cx="${cx}" cy="${yc + 4}" rx="18" ry="8" fill="none" stroke="#C99A1E" stroke-width="1"/>`;
    // mấn nằm SAU đầu: tóc dài phải đè lên mấn (vẽ lại mảng tóc sau, giống hệt renderBackHair)
    if (hairId !== 'hair_female_bun') {
      s += `<path d="M ${cx},${hc - 5} C ${cx + 32},${hc - 6} ${cx + 38},${hc + 24} ${cx + 36},${hc + 56} L ${cx + 38},${shY + 40} C ${cx + 40},${shY + 90} ${cx + 34},${shY + 118} ${cx + 26},${shY + 128} L ${cx - 26},${shY + 128} C ${cx - 34},${shY + 118} ${cx - 40},${shY + 90} ${cx - 38},${shY + 40} L ${cx - 36},${hc + 56} C ${cx - 38},${hc + 24} ${cx - 32},${hc - 6} ${cx},${hc - 5} Z" fill="#1F1916"/>`;
    }
  } else if (accIds.includes('non_la')) {
    const by = hc + 8;
    // mặt dưới vành nón: chỉ lộ ra hai bên đầu, tạo chiều sâu
    s += `<ellipse cx="${cx}" cy="${by}" rx="62" ry="11" fill="#B39352" stroke="#8C7038" stroke-width="1"/>`;
    s += `<ellipse cx="${cx}" cy="${by + 1}" rx="50" ry="7.5" fill="#9C7E43"/>`;
  }
  return s;
}

/* Đầu, mặt, tóc trước, khăn vấn / mấn / nón lá, trâm cho NỮ: thay renderHeadAndFace khi gender === 'female' */
export function femaleHead(skel: SkeletonMeasurements, accIds: string[], hairId: string | undefined, skin: { base: string; sh: string; line: string }, uid: string): string {
  const cx = 200, hc = skel.crown, hb = skel.chin, hw = skel.headHalf;
  const SK = skin;
  const HAIR = '#1F1916', HAIR_HI = '#3A2F29';
  const isBun = hairId === 'hair_female_bun';
  const nonLa = accIds.includes('non_la'), khanVan = accIds.includes('khan_van'), man = accIds.includes('man_doi_dau');
  const eyeY = hc + (hb - hc) * 0.52;
  let s = '';

  // búi tóc: ẩn khi quấn khăn vấn (tóc đã cuộn trong khăn); với nón lá thì chóp nón tự che
  if (isBun && !khanVan) {
    s += `<circle cx="${cx}" cy="${hc - 3}" r="13" fill="${HAIR}"/><path d="M${cx - 9},${hc - 6} Q${cx},${hc - 17} ${cx + 9},${hc - 6}" fill="none" stroke="${HAIR_HI}" stroke-width="1.2"/>`;
  }
  // ---- khuôn mặt nữ: GIỮ ĐÚNG kiểu mặt gốc của app (tai, mặt trái xoan, má hồng, mắt, mày, mũi, môi) ----
  const earY = (hb + hc) / 2 + 5;
  s += `<ellipse cx="${cx - hw}" cy="${earY}" rx="4.5" ry="8.5" fill="${SK.base}" stroke="${SK.line}" stroke-width="0.8" />`;
  s += `<ellipse cx="${cx + hw}" cy="${earY}" rx="4.5" ry="8.5" fill="${SK.base}" stroke="${SK.line}" stroke-width="0.8" />`;
  s += `<path d="M ${cx},${hc} C ${cx + 17},${hc} ${cx + hw + 1},${hc + 14} ${cx + hw},${hc + 32} C ${cx + hw - 1},${hc + 48} ${cx + 15},${hb - 6} ${cx},${hb} C ${cx - 15},${hb - 6} ${cx - hw + 1},${hc + 48} ${cx - hw},${hc + 32} C ${cx - hw - 1},${hc + 14} ${cx - 17},${hc} ${cx},${hc} Z" fill="${SK.base}" stroke="${SK.line}" stroke-width="0.8" />`;
  const blushY = hb - 22;
  s += `<ellipse cx="${cx - 13}" cy="${blushY}" rx="5.5" ry="3.5" fill="#F49D90" opacity="0.45" />`;
  s += `<ellipse cx="${cx + 13}" cy="${blushY}" rx="5.5" ry="3.5" fill="#F49D90" opacity="0.45" />`;
  const eyeH = 4.2;
  [-10, 10].forEach((ox) => {
    const ex = cx + ox;
    s += `<path d="M ${ex - 5.5} ${eyeY} Q ${ex} ${eyeY - eyeH} ${ex + 5.5} ${eyeY} Q ${ex} ${eyeY + eyeH * 0.85} ${ex - 5.5} ${eyeY} Z" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="0.4" />`;
    s += `<circle cx="${ex}" cy="${eyeY}" r="2.7" fill="#451A03" />`;
    s += `<circle cx="${ex}" cy="${eyeY}" r="1.3" fill="#000000" />`;
    s += `<circle cx="${ex + 0.9}" cy="${eyeY - 0.9}" r="0.8" fill="#FFFFFF" />`;
    s += `<path d="M ${ex - 6} ${eyeY} Q ${ex} ${eyeY - eyeH - 0.5} ${ex + 6} ${eyeY}" stroke="#1E1B18" stroke-width="1.2" stroke-linecap="round" fill="none" />`;
  });
  const browY = eyeY - 6.5;
  s += `<path d="M ${cx - 16} ${browY + 1} Q ${cx - 10} ${browY - 2.5} ${cx - 4} ${browY}" stroke="#271F1B" stroke-width="1.2" stroke-linecap="round" fill="none" />`;
  s += `<path d="M ${cx + 4} ${browY} Q ${cx + 10} ${browY - 2.5} ${cx + 16} ${browY + 1}" stroke="#271F1B" stroke-width="1.2" stroke-linecap="round" fill="none" />`;
  const noseY = eyeY + 12;
  s += `<path d="M ${cx - 1} ${eyeY + 2} Q ${cx + 0.5} ${noseY - 3} ${cx - 1.5} ${noseY} Q ${cx + 2} ${noseY + 1.5} ${cx + 3.5} ${noseY}" stroke="${SK.line}" stroke-width="1" stroke-linecap="round" fill="none" />`;
  const lipY = noseY + 8, lipColor = '#C2575B', lipW = 6.5, lipH = 2.8;
  s += `<path d="M ${cx - lipW} ${lipY} Q ${cx - lipW * 0.4} ${lipY - lipH} ${cx} ${lipY - lipH * 0.6} Q ${cx + lipW * 0.4} ${lipY - lipH} ${cx + lipW} ${lipY} Q ${cx} ${lipY + 0.5} ${cx - lipW} ${lipY} Z" fill="${lipColor}" />`;
  s += `<path d="M ${cx - lipW + 1} ${lipY} Q ${cx} ${lipY + lipH * 1.2} ${cx + lipW - 1} ${lipY} Z" fill="#AF4E52" />`;

  // tóc trước: ngôi giữa, phủ kín đỉnh đầu (luôn vẽ, không bao giờ ẩn)
  s += `<path d="M${cx - hw - 1},${hc + 30} C${cx - hw - 4},${hc + 4} ${cx - 12},${hc - 6} ${cx},${hc - 6} C${cx + 12},${hc - 6} ${cx + hw + 4},${hc + 4} ${cx + hw + 1},${hc + 30} C${cx + hw - 3},${hc + 18} ${cx + 14},${hc + 8} ${cx + 1.5},${hc + 7} L${cx},${hc + 10} L${cx - 1.5},${hc + 7} C${cx - 14},${hc + 8} ${cx - hw + 3},${hc + 18} ${cx - hw - 1},${hc + 30} Z" fill="${HAIR}"/>`;
  s += `<path d="M${cx - 4},${hc - 3} Q${cx - 14},${hc + 1} ${cx - 19},${hc + 12} M${cx + 4},${hc - 3} Q${cx + 14},${hc + 1} ${cx + 19},${hc + 12}" fill="none" stroke="${HAIR_HI}" stroke-width="1"/>`;
  // tóc mai ngắn hai bên thái dương (tóc dài buông phía sau lưng, không để 2 lọn dài buông trước vai)
    for (const sg of [-1, 1]) s += `<path d="M${cx + sg * (hw + 1)},${hc + 24} C${cx + sg * (hw + 3)},${hc + 34} ${cx + sg * (hw + 1)},${hc + 42} ${cx + sg * (hw - 1)},${hc + 46} L${cx + sg * (hw - 1)},${hc + 28} Z" fill="${HAIR}"/>`;

  // ---- đồ đội đầu (phần phía trước mặt) ----
  let pin: number[] | null = null; // vị trí trâm [x1,y1,x2,y2]
  if (khanVan) {
    const id = uid + '-khanvan';
    const band = `M${cx - hw - 13},${hc + 7} C${cx - hw - 13},${hc - 5} ${cx - 14},${hc - 5} ${cx},${hc - 4} C${cx + 14},${hc - 5} ${cx + hw + 13},${hc - 5} ${cx + hw + 13},${hc + 7} C${cx + hw + 14},${hc + 18} ${cx + hw + 5},${hc + 24} ${cx + hw - 3},${hc + 20} C${cx + 12},${hc + 14} ${cx - 12},${hc + 14} ${cx - hw + 3},${hc + 20} C${cx - hw - 5},${hc + 24} ${cx - hw - 14},${hc + 18} ${cx - hw - 13},${hc + 7} Z`;
    s += `<clipPath id="${id}"><path d="${band}"/></clipPath>`;
    s += `<path d="${band}" fill="#2A2220" stroke="#0E0B0A" stroke-width="1"/>`;
    let tw = '';
    for (let k = -3; k <= 3; k++) { const x = cx + k * 12; tw += `<path d="M${f1(x - 8)},${hc + 24} Q${f1(x)},${hc + 9} ${f1(x + 8)},${hc - 6}" fill="none" stroke="#15110F" stroke-width="1.1"/><path d="M${f1(x - 6)},${hc + 24} Q${f1(x + 2)},${hc + 9} ${f1(x + 10)},${hc - 6}" fill="none" stroke="#4A403A" stroke-width=".8"/>`; }
    tw += `<path d="M${cx - hw - 13},${hc + 9} C${cx - 14},${hc + 3} ${cx + 14},${hc + 3} ${cx + hw + 13},${hc + 9}" fill="none" stroke="#0E0B0A" stroke-width="1.2"/>`;
    s += `<g clip-path="url(#${id})">${tw}</g>`;
    s += `<path d="M${cx - hw - 9},${hc + 1} C${cx - 14},${hc - 3} ${cx + 14},${hc - 3} ${cx + hw + 9},${hc + 1}" fill="none" stroke="#7A6C64" stroke-width="1" opacity=".8"/>`;
    pin = [cx + hw - 3, hc + 14, cx + hw + 15, hc - 3];
  } else if (man) {
    // quai lụa đỏ bản to: từ lòng mấn hai bên, vòng hình chữ V dưới cằm
    const qy = hc + 22, qx = 37;
    const quai = `M${cx - qx},${qy} C${cx - qx + 6},${hb - 14} ${cx - 10},${hb + 12} ${cx},${hb + 16} C${cx + 10},${hb + 12} ${cx + qx - 6},${hb - 14} ${cx + qx},${qy}`;
    s += `<path d="${quai}" fill="none" stroke="#A8243A" stroke-width="5" stroke-linecap="round"/><path d="${quai}" fill="none" stroke="#E0384F" stroke-width="3.6" stroke-linecap="round"/><path d="${quai}" fill="none" stroke="#F27A8A" stroke-width=".8" transform="translate(0,-1)"/>`;
    // tua vàng dài rủ từ vành mấn hai bên
    for (const sg of [-1, 1]) {
      const X = (v: number) => f1(cx + sg * v);
      const ax = 50, ty = hc + 12;
      s += `<path d="M${X(ax)},${hc + 2} L${X(ax)},${ty}" stroke="#E0384F" stroke-width="1.6"/>`;
      s += `<path d="M${X(ax - 2)},${ty} L${X(ax + 2)},${ty} L${X(ax + 2.6)},${ty + 8} L${X(ax - 2.6)},${ty + 8} Z" fill="#E8B82A"/><rect x="${f1(cx + sg * ax - 2.6)}" y="${ty + 1.5}" width="5.2" height="1.3" fill="#C0392B"/><rect x="${f1(cx + sg * ax - 2.8)}" y="${ty + 5}" width="5.6" height="1.3" fill="#C0392B"/>`;
      s += `<path d="M${X(ax - 2.8)},${ty + 8} Q${X(ax)},${ty + 58} ${X(ax + 2.8)},${ty + 8} Z" fill="#EBC132"/>`;
      let fr = '';
      for (let k = -3; k <= 3; k++) fr += `M${X(ax + k * 0.8)},${ty + 8} L${X(ax + k * 1.5)},${ty + 52} `;
      s += `<path d="${fr}" stroke="#F8DA6A" stroke-width=".7" stroke-linecap="round"/>`;
    }
    pin = null;
  } else if (nonLa) {
    const by = hc + 8, top = hc - 36, R = 62;
    s += `<path d="M${cx - R},${by} L${cx},${top} L${cx + R},${by} Q${cx},${by + 7} ${cx - R},${by} Z" fill="#E8D6A2" stroke="#A88C52" stroke-width="1"/>`;
    for (const k of [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]) s += `<path d="M${cx},${top} L${f1(cx + k * R)},${f1(by + 7 * (1 - k * k) * 0.5)}" stroke="#C4AB6E" stroke-width=".7"/>`;
    for (const t of [0.35, 0.68]) { const y = top + (by - top) * t, w = R * t; s += `<path d="M${f1(cx - w)},${f1(y)} Q${cx},${f1(y + 7 * t)} ${f1(cx + w)},${f1(y)}" fill="none" stroke="#C4AB6E" stroke-width=".7"/>`; }
    s += `<path d="M${cx - R},${by} Q${cx},${by + 7} ${cx + R},${by}" fill="none" stroke="#CDB47A" stroke-width="2"/>`;
    // quai lụa: từ trong vành, ôm ngoài má, gặp nhau dưới cằm, thắt nơ
    s += `<path d="M${cx - hw - 2},${by + 4} C${cx - hw - 5},${f1(eyeY + 14)} ${cx - 13},${hb + 4} ${cx - 1.5},${hb + 4.5} M${cx + hw + 2},${by + 4} C${cx + hw + 5},${f1(eyeY + 14)} ${cx + 13},${hb + 4} ${cx + 1.5},${hb + 4.5}" fill="none" stroke="#C0392B" stroke-width="1.7" stroke-linecap="round"/>`;
    s += `<path d="M${cx},${hb + 4.5} C${cx - 5},${hb + 1} ${cx - 8},${hb + 7} ${cx},${hb + 5} C${cx + 8},${hb + 7} ${cx + 5},${hb + 1} ${cx},${hb + 4.5} Z" fill="#C0392B"/>`;
    s += `<path d="M${cx - 0.5},${hb + 5.5} Q${cx - 2},${hb + 12} ${cx - 3.5},${hb + 16} M${cx + 0.5},${hb + 5.5} Q${cx + 2},${hb + 12} ${cx + 3},${hb + 17}" fill="none" stroke="#C0392B" stroke-width="1.5" stroke-linecap="round"/>`;
    pin = [cx + hw - 6, by + 15, cx + hw + 9, by + 5];
  } else if (isBun) {
    pin = [cx - 17, hc + 4, cx + 15, hc - 12];
  } else {
    pin = [cx + hw - 7, hc + 14, cx + hw + 9, hc + 2];
  }
  // trâm cài: CHỈ hiện khi để tóc búi và không đội gì trên đầu (tóc xoã hoặc có khăn/nón/mấn/mũ thì ẩn trâm)
  const headItem = ['khan_van', 'man_doi_dau', 'non_la', 'beret_hat', 'khan_dong'].some(id => accIds.includes(id));
  if (accIds.includes('tram_cai_toc') && isBun && !headItem && pin) {
    const [x1, y1, x2, y2] = pin;
    s += `<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="#9C7A2E" stroke-width="2.4" stroke-linecap="round"/><path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke="#E0BF63" stroke-width="1.1" stroke-linecap="round"/>`;
    s += `<circle cx="${f1(x2 + 1.5)}" cy="${f1(y2 - 1.5)}" r="3.4" fill="#C0392B" stroke="#7A1F16" stroke-width=".8"/><circle cx="${f1(x2 + 1.5)}" cy="${f1(y2 - 1.5)}" r="1.2" fill="#F4D877"/>`;
    s += `<path d="M${f1(x2 + 1.5)},${f1(y2 + 1.9)} L${f1(x2 + 1.5)},${f1(y2 + 6)}" stroke="#E0BF63" stroke-width=".7"/><circle cx="${f1(x2 + 1.5)}" cy="${f1(y2 + 7.6)}" r="1.7" fill="#F4EEE2" stroke="#BDB39E" stroke-width=".5"/>`;
  }
  return s;
}
