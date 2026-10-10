import React from 'react';
import { ColorPalette } from '../data/fashionData';
import { isBlackColor } from './CharacterFigure';

interface ItemThumbnailProps {
  type: 'costume' | 'hair' | 'accessory' | 'footwear' | 'barefoot';
  itemId: string;
  palette: ColorPalette;
  gender?: 'female' | 'male';
  className?: string;
}

export const ItemThumbnail: React.FC<ItemThumbnailProps> = ({
  type,
  itemId,
  palette,
  gender = 'female',
  className = 'w-14 h-14',
}) => {
  return (
    <div
      className={`relative rounded-xl bg-[#FAF6EE] border border-[#8C6D53]/15 flex items-center justify-center overflow-hidden p-1 shadow-xs transition-colors duration-150 pointer-events-none ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Brocade weave pattern */}
          <pattern id={`brocadeThumb-${itemId}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            <path d="M0 5 Q2.5 2.5 5 5 T10 5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          </pattern>
          <radialGradient id={`turbanThumb-${itemId}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#0f172a" />
          </radialGradient>
        </defs>

        {/* 1. TRANG PHỤC (COSTUME) - Dáng áo chính diện rõ cổ & đường khuy */}
        {type === 'costume' && (
          <g transform="translate(0, 0)">
            {/* Case: Áo Tấc (Tay thụng đại lễ) */}
            {itemId === 'ao_tac' && (
              <g id="thumb-ao-tac">
                {/* Tay thụng rộng 2 bên rủ xuống */}
                <path
                  d="M38 32 L10 46 Q6 65 10 82 L28 76 L32 50 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path d="M10 82 L28 76" stroke={palette.secondary} strokeWidth="1.8" />
                <path
                  d="M62 32 L90 46 Q94 65 90 82 L72 76 L68 50 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path d="M90 82 L72 76" stroke={palette.secondary} strokeWidth="1.8" />

                {/* Thân áo tấc thụng dài */}
                <path
                  d="M36 30 L44 28 L56 28 L64 30 L68 52 L74 92 Q50 94 26 92 L32 52 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.2"
                />
                <path
                  d="M36 30 L44 28 L56 28 L64 30 L68 52 L74 92 Q50 94 26 92 L32 52 Z"
                  fill={`url(#brocadeThumb-${itemId})`}
                />

                {/* Cổ áo lập lĩnh cao đứng */}
                <path
                  d="M44 24 L56 24 L58 29 L42 29 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                {/* Viền cổ lót trắng */}
                <path d="M44.5 24.5 L55.5 24.5" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Vạt hò gài khuy sang sườn phải */}
                <path d="M50 29 C53 33 57 37 60 42 L63 56" fill="none" stroke={palette.accent} strokeWidth="1.2" />

                {/* 5 Hạt khuy vàng */}
                <circle cx="51" cy="30" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="54" cy="34" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="58" cy="39" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="60" cy="46" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="62" cy="54" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
              </g>
            )}

            {/* Case: Áo Ngũ Thân Lập Lĩnh (Tay chẽn) */}
            {itemId === 'ngu_than' && (
              <g id="thumb-ao-ngu-than">
                {/* Tay chẽn gọn gàng ôm cánh tay */}
                <path
                  d="M36 31 L24 45 L20 70 L26 71 L32 50 L36 38 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path
                  d="M64 31 L76 45 L80 70 L74 71 L68 50 L64 38 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />

                {/* Thân áo 5 vạt gọn */}
                <path
                  d="M36 30 L44 28 L56 28 L64 30 L67 48 L71 90 Q50 92 29 90 L33 48 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.2"
                />
                <path
                  d="M36 30 L44 28 L56 28 L64 30 L67 48 L71 90 Q50 92 29 90 L33 48 Z"
                  fill={`url(#brocadeThumb-${itemId})`}
                />

                {/* Cổ lập lĩnh */}
                <path
                  d="M44 24 L56 24 L58 29 L42 29 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path d="M44.5 24.5 L55.5 24.5" stroke="#FFFFFF" strokeWidth="1.5" />

                {/* Vạt hò cong sang nách và sườn phải */}
                <path d="M50 29 C53 33 57 37 60 43 L63 56" fill="none" stroke={palette.accent} strokeWidth="1.2" />

                {/* 5 Hạt khuy ngũ thường */}
                <circle cx="51" cy="30" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="54" cy="34" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="57.5" cy="39" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="60" cy="46" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                <circle cx="62" cy="54" r="1.3" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />

                {/* Tà xẻ hai bên */}
                <path d="M33 54 L29 90" stroke={palette.accent} strokeWidth="0.8" opacity="0.6" />
                <path d="M67 54 L71 90" stroke={palette.accent} strokeWidth="0.8" opacity="0.6" />
              </g>
            )}

            {/* Case: Áo Dài Tân Thời (Tà dài thướt tha, eo thon) */}
            {itemId === 'ao_dai_tan_thoi' && (
              <g id="thumb-ao-dai">
                {/* Tay nối raglan thon */}
                <path
                  d="M37 30 L26 43 L22 68 L26 69 L32 48 L37 37 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path
                  d="M63 30 L74 43 L78 68 L74 69 L68 48 L63 37 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />

                {/* Tà trước eo thon xòe rộng */}
                <path
                  d="M40 30 Q45 42 42 50 Q39 65 33 93 Q50 96 67 93 Q61 65 58 50 Q55 42 60 30 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.2"
                />

                {/* Tà sau lấp ló */}
                <path d="M32 91 Q50 97 68 91 L69 94 Q50 100 31 94 Z" fill={palette.accent} opacity="0.7" />

                {/* Cổ cao thanh mảnh 3cm */}
                <path
                  d="M45 25 L55 25 L57 30 L43 30 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path d="M45.5 25.5 L54.5 25.5" stroke="#FFFFFF" strokeWidth="1.2" />

                {/* Đường ráp tay raglan duyên dáng */}
                <path d="M43 30 Q40 35 38 40" stroke={palette.accent} strokeWidth="0.8" fill="none" />
                <path d="M57 30 Q60 35 62 40" stroke={palette.accent} strokeWidth="0.8" fill="none" />
              </g>
            )}

            {/* Case: Áo Nhật Bình (Nữ quý tộc, cổ đối khâm chữ nhật, dải ngũ sắc) */}
            {(itemId === 'ao_nhat_binh') && (
              <g id="thumb-ao-nhat-binh">
                <path
                  d="M36 30 L22 46 L18 72 L24 73 L30 50 L35 38 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path
                  d="M64 30 L78 46 L82 72 L76 73 L70 50 L65 38 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                {/* Viền ngũ sắc tay áo */}
                <path d="M19 66 L25 67" stroke="#3B82F6" strokeWidth="2" />
                <path d="M20 69 L26 70" stroke="#EF4444" strokeWidth="2" />
                <path d="M75 66 L81 67" stroke="#3B82F6" strokeWidth="2" />
                <path d="M74 69 L80 70" stroke="#EF4444" strokeWidth="2" />

                {/* Thân áo đối khâm buông dài */}
                <path
                  d="M36 30 L64 30 L68 50 L72 92 Q50 94 28 92 L32 50 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.2"
                />
                {/* Cổ áo Nhật Bình chữ nhật bản to viền ngũ sắc */}
                <path
                  d="M42 26 L58 26 L58 48 L53 48 L53 32 L47 32 L47 48 L42 48 Z"
                  fill="#F59E0B"
                  stroke="#B45309"
                  strokeWidth="0.8"
                />
                {/* Nẹp cổ chạy dài xuống vạt */}
                <line x1="47" y1="48" x2="47" y2="92" stroke="#F59E0B" strokeWidth="1.6" />
                <line x1="53" y1="48" x2="53" y2="92" stroke="#F59E0B" strokeWidth="1.6" />
                {/* Khuy ngọc */}
                <circle cx="50" cy="48" r="1.8" fill="#10B981" />
              </g>
            )}

            {/* Case: Áo Giao Lĩnh (Nam cổ chéo) */}
            {itemId === 'ao_giao_linh' && (
              <g id="thumb-ao-giao-linh">
                {/* Tay thụng rộng phóng khoáng */}
                <path
                  d="M36 32 L14 48 Q10 68 14 80 L30 75 L34 50 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path
                  d="M64 32 L86 48 Q90 68 86 80 L70 75 L66 50 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                {/* Thân áo */}
                <path
                  d="M36 30 L64 30 L68 52 L73 92 Q50 94 27 92 L32 52 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.2"
                />
                {/* Cổ giao lĩnh vạt chéo trái đè phải */}
                <path d="M38 30 L58 50 L56 54 L36 34 Z" fill="#F8FAFC" opacity="0.9" />
                <path d="M62 30 L42 50 L44 54 L64 34 Z" fill="#E2E8F0" opacity="0.7" />
                {/* Thắt lưng đai lụa bản to */}
                <rect x="36" y="52" width="28" height="6" rx="1.5" fill="#78350F" />
              </g>
            )}

            {/* Case: Áo Ngũ Thân Nam phom rộng */}
            {itemId === 'ngu_than_nam' && (
              <g id="thumb-ao-ngu-than-nam">
                <path
                  d="M34 30 L16 46 L14 74 L22 75 L28 52 L34 38 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path
                  d="M66 30 L84 46 L86 74 L78 75 L72 52 L66 38 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1"
                />
                <path
                  d="M34 29 L66 29 L70 50 L75 92 Q50 94 25 92 L30 50 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.2"
                />
                {/* Cổ lập lĩnh */}
                <path d="M43 23 L57 23 L59 29 L41 29 Z" fill={palette.primary} stroke={palette.accent} strokeWidth="1" />
                <path d="M43.5 23.5 L56.5 23.5" stroke="#FFFFFF" strokeWidth="1.5" />
                {/* Vạt hò và cúc */}
                <path d="M50 29 C54 34 59 38 62 44 L65 58" fill="none" stroke={palette.accent} strokeWidth="1.2" />
                <circle cx="51" cy="30" r="1.3" fill="#FBBF24" />
                <circle cx="55" cy="35" r="1.3" fill="#FBBF24" />
                <circle cx="59" cy="41" r="1.3" fill="#FBBF24" />
                <circle cx="62" cy="48" r="1.3" fill="#FBBF24" />
                <circle cx="64" cy="56" r="1.3" fill="#FBBF24" />
              </g>
            )}
          </g>
        )}

        {/* 2. KIỂU TÓC (HAIRSTYLE) */}
        {type === 'hair' && (
          <g transform="translate(0, 0)">
            {/* Gương mặt silhouette mềm mại làm nền */}
            <ellipse cx="50" cy="52" rx="16" ry="20" fill="#FED7AA" />
            <rect x="44" y="68" width="12" height="12" fill="#FED7AA" />

            {/* Case: Nữ tóc dài xõa nàng thơ */}
            {itemId === 'hair_female_long' && (
              <g id="thumb-hair-female-long">
                <path
                  d="M34 50 C32 28 68 28 66 50 C68 56 67 76 63 86 C58 74 58 64 57 56 C49 54 43 56 42 61 C40 70 38 82 35 86 C33 74 34 62 34 50 Z"
                  fill="#1C1917"
                />
                {/* Mái tóc bồng bềnh */}
                <path d="M37 40 Q50 34 63 40" stroke="#44403C" strokeWidth="1" fill="none" />
              </g>
            )}

            {/* Case: Nữ búi tóc cài trâm cổ điển */}
            {itemId === 'hair_female_bun' && (
              <g id="thumb-hair-female-bun">
                {/* Tóc vén gọn */}
                <path
                  d="M34 50 C32 30 68 30 66 50 C68 54 67 62 63 68 C59 62 59 58 57 54 C50 52 44 54 43 58 C41 62 38 68 35 68 C33 62 34 54 34 50 Z"
                  fill="#1C1917"
                />
                {/* Búi tóc tròn trên đỉnh sau gáy */}
                <ellipse cx="50" cy="27" rx="11" ry="9" fill="#1C1917" stroke="#292524" strokeWidth="1" />
                {/* Trâm cài tóc vàng có hạt ngọc đỏ */}
                <line x1="36" y1="24" x2="64" y2="30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                <circle cx="65" cy="30" r="2.5" fill="#DC2626" />
                <circle cx="62" cy="33" r="1.5" fill="#F59E0B" />
              </g>
            )}

            {/* Case: Nam tóc ngắn sĩ tử hiện đại */}
            {['hair_male_short', 'hair_male_comma', 'hair_male_curtain', 'hair_male_crew'].includes(itemId) && (
              <g id="thumb-hair-male-short">
                <path
                  d="M33 50 C32 30 68 30 67 50 C66 42 58 38 50 39 C42 38 34 43 33 50 Z"
                  fill="#1C1917"
                />
                {/* Tỉa nếp tóc mái trẻ trung */}
                <path d="M38 42 Q50 36 60 42" stroke="#44403C" strokeWidth="1" fill="none" />
              </g>
            )}

            {/* Case: Nam búi tó truyền thống */}
            {itemId === 'hair_male_topknot' && (
              <g id="thumb-hair-male-topknot">
                <path
                  d="M33 52 C32 32 68 32 67 52 C66 44 57 39 50 40 C43 39 34 44 33 52 Z"
                  fill="#1C1917"
                />
                {/* Búi tó tròn trịa Bézier trên đỉnh đầu */}
                <path
                  d="M44 32 C41 29 42 22 47 19 C50 17 53 17 56 19 C61 22 62 29 59 32 C56 34 47 34 44 32 Z"
                  fill="#1C1917"
                  stroke="#3A2F29"
                  strokeWidth="0.9"
                />
                {/* Nếp cuộn xoắn của búi tó */}
                <path d="M45 28 C47 24 53 23 57 26" stroke="#4A3C35" strokeWidth="1" fill="none" />
                <path d="M47 24 C50 20 54 21 55 24" stroke="#4A3C35" strokeWidth="0.8" fill="none" opacity="0.8" />
                {/* Dây lạt buộc chân búi tóc */}
                <path d="M44 32 Q50 30 59 32" stroke="#78350F" strokeWidth="1.8" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 3. PHỤ KIỆN (ACCESSORY) */}
        {type === 'accessory' && (
          <g transform="translate(0, 0)">
            {/* Case: Khăn Đóng / Khăn Xếp (Nam) */}
            {(itemId === 'khan_dong' || itemId === 'man_khan_dong') && (
              <g id="thumb-khan-dong" transform="translate(20, 26)">
                {/* Khung khăn đóng nhiều tầng nếp xếp chỉnh tề */}
                <ellipse cx="30" cy="24" rx="28" ry="12" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                <ellipse cx="30" cy="20" rx="26" ry="10" fill={palette.primary} stroke={palette.accent} strokeWidth="0.8" />
                <ellipse cx="30" cy="16" rx="24" ry="9" fill="#334155" />
                <ellipse cx="30" cy="12" rx="21" ry="7" fill="#0F172A" />
                {/* Các nếp xếp ngang sắc sảo của khăn đóng */}
                <path d="M4 23 Q30 30 56 23" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                <path d="M7 19 Q30 26 53 19" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                <path d="M10 15 Q30 22 50 15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              </g>
            )}

            {/* Case: Quạt Giấy Thư Pháp (Nam) */}
            {itemId === 'quat_thu_phap' && (
              <g id="thumb-quat-thu-phap" transform="translate(20, 24)">
                <path d="M30 45 L2 14 Q30 -6 58 14 Z" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.2" />
                <line x1="30" y1="45" x2="14" y2="8" stroke="#D97706" strokeWidth="1" />
                <line x1="30" y1="45" x2="30" y2="4" stroke="#D97706" strokeWidth="1" />
                <line x1="30" y1="45" x2="46" y2="8" stroke="#D97706" strokeWidth="1" />
                {/* Chữ thư pháp mực tàu */}
                <path d="M26 18 Q30 16 34 20 M30 17 L30 28 M25 24 L35 24" stroke="#1C1917" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="28" cy="46" r="1.5" fill="#78350F" />
              </g>
            )}

            {/* Case: Mấn Đội Đầu Thêu Hoa (Nữ) */}
            {itemId === 'man_doi_dau' && (
              <g id="thumb-man-doi-dau" transform="translate(20, 25)">
                <ellipse cx="30" cy="24" rx="27" ry="13" fill="#E11D48" stroke="#BE123C" strokeWidth="1.2" />
                <ellipse cx="30" cy="20" rx="24" ry="10" fill={isBlackColor(palette.primary) ? '#5E6068' : palette.primary} stroke={palette.accent} strokeWidth="1" />
                <ellipse cx="30" cy="16" rx="19" ry="8" fill="#1C1917" />
                {/* Hoa văn đính ngọc */}
                <circle cx="30" cy="21" r="3" fill="#FDE047" />
                <circle cx="20" cy="23" r="2" fill="#FFFFFF" />
                <circle cx="40" cy="23" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* Case: Trâm Cài Tóc (Nữ) */}
            {itemId === 'tram_cai_toc' && (
              <g id="thumb-tram-cai-toc" transform="translate(20, 20)">
                <line x1="12" y1="55" x2="48" y2="15" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="50" cy="13" r="7" fill="#FDE047" stroke="#D97706" strokeWidth="1.2" />
                <circle cx="50" cy="13" r="3" fill="#E11D48" />
                {/* Dây rủ tua rua */}
                <line x1="46" y1="18" x2="44" y2="34" stroke="#D97706" strokeWidth="1" />
                <circle cx="44" cy="35" r="2" fill="#FBBF24" />
                <line x1="52" y1="18" x2="54" y2="38" stroke="#D97706" strokeWidth="1" />
                <circle cx="54" cy="39" r="2.2" fill="#E11D48" />
              </g>
            )}

            {/* Case: Túi Mây Tre Đan (Nữ) */}
            {itemId === 'tui_may_tre' && (
              <g id="thumb-tui-may-tre" transform="translate(25, 20)">
                <path d="M12 20 C12 -2 38 -2 38 20" fill="none" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="5" y="20" width="40" height="36" rx="6" fill="#FDE68A" stroke="#B45309" strokeWidth="1.6" />
                {/* Đan nan mây tre */}
                <line x1="5" y1="30" x2="45" y2="30" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="5" y1="40" x2="45" y2="40" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="15" y1="20" x2="15" y2="56" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="25" y1="20" x2="25" y2="56" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="35" y1="20" x2="35" y2="56" stroke="#D97706" strokeWidth="1" strokeDasharray="3 2" />
              </g>
            )}

            {/* Case: Khăn Vấn (Nữ đài các) */}
            {itemId === 'khan_van' && (
              <g id="thumb-khan-van" transform="translate(20, 26)">
                {/* Vành khăn vấn nhung tròn ôm tóc */}
                <ellipse cx="30" cy="22" rx="27" ry="13" fill={`url(#turbanThumb-${itemId})`} stroke="#475569" strokeWidth="1" />
                <ellipse cx="30" cy="18" rx="24" ry="11" fill={isBlackColor(palette.primary) ? '#5E6068' : palette.primary} stroke={palette.accent} strokeWidth="1" />
                {/* Phần tóc gọn giữa vành khăn */}
                <ellipse cx="30" cy="15" rx="19" ry="8" fill="#1C1917" />
                {/* Nếp gấp lụa/nhung mềm mại bao quanh trán */}
                <path d="M6 21 Q30 27 54 21" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.4" />
                <path d="M11 17 Q30 23 49 17" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              </g>
            )}

            {/* Case: Nón Quai Thao (nón thúng mặt phẳng, tua quai thao) */}
            {itemId === 'non_quai_thao' && (
              <g id="thumb-non-quai-thao" transform="translate(20, 14)">
                <circle cx="30" cy="30" r="29" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.3" />
                <circle cx="30" cy="30" r="26" fill="none" stroke="#B5473A" strokeWidth="1.2" strokeDasharray="4 3" />
                <circle cx="30" cy="30" r="19" fill="none" stroke="#D97706" strokeWidth="0.8" />
                <circle cx="30" cy="30" r="12" fill="none" stroke="#D97706" strokeWidth="0.8" />
                <circle cx="30" cy="30" r="4.5" fill="#3A2A20" />
                <path d="M22 50 L20 70 M25 51 L24 71 M35 51 L36 71 M38 50 L40 70" stroke="#E2B33F" strokeWidth="1.6" />
                <path d="M23.5 51 L22 70 M36.5 51 L38 70" stroke="#3FA95B" strokeWidth="1.4" />
                <path d="M30 51 L30 71" stroke="#C8102E" strokeWidth="1.6" />
              </g>
            )}

            {/* Case: Nón Lá Cổ Truyền */}
            {itemId === 'non_la' && (
              <g id="thumb-non-la" transform="translate(15, 20)">
                {/* Chóp nón hình nón quai thao/nón bài thơ chuẩn Việt */}
                <polygon points="35,5 0,46 70,46" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
                {/* Các vành nón lá tròn tinh xảo */}
                <path d="M10 36 Q35 28 60 36" fill="none" stroke="#D97706" strokeWidth="0.8" />
                <path d="M18 25 Q35 19 52 25" fill="none" stroke="#D97706" strokeWidth="0.8" />
                <path d="M26 14 Q35 10 44 14" fill="none" stroke="#D97706" strokeWidth="0.8" />
                {/* Quai nón lụa mềm buông thả */}
                <path d="M8 46 Q35 74 62 46" fill="none" stroke="#F43F5E" strokeWidth="2.5" />
              </g>
            )}

            {/* Case: Quạt Giấy / Quạt Lụa */}
            {itemId === 'quat_giay' && (
              <g id="thumb-quat-giay" transform="translate(20, 24)">
                {/* Nan quạt xòe hình quạt giấy sen */}
                <path d="M30 45 L0 12 Q30 -8 60 12 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.2" />
                {/* Nan nan tre xòe */}
                <line x1="30" y1="45" x2="12" y2="7" stroke="#FDE68A" strokeWidth="1" />
                <line x1="30" y1="45" x2="30" y2="2" stroke="#FDE68A" strokeWidth="1" />
                <line x1="30" y1="45" x2="48" y2="7" stroke="#FDE68A" strokeWidth="1" />
                {/* Bông hoa sen hồng vẽ trên quạt */}
                <circle cx="30" cy="20" r="5" fill="#FDA4AF" opacity="0.9" />
                <circle cx="30" cy="18" r="3" fill="#E11D48" opacity="0.7" />
                {/* Dây tua rua đỏ thắm */}
                <path d="M30 45 L27 64" stroke="#E11D48" strokeWidth="2.2" />
                <circle cx="27" cy="65" r="2.5" fill="#E11D48" />
              </g>
            )}

            {/* Case: Chuỗi Ngọc / Khánh Bạc */}
            {itemId === 'chuoi_ngoc' && (
              <g id="thumb-chuoi-ngoc" transform="translate(20, 25)">
                {/* Chuỗi hạt ngọc trai uốn cong đeo ngực */}
                <path
                  d="M10 15 Q30 52 50 15"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="4"
                  strokeDasharray="4 2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 15 Q30 52 50 15"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                {/* Khánh vàng chạm khắc chữ Phúc Lộc Thọ */}
                <circle cx="30" cy="38" r="5" fill="#FACC15" stroke="#CA8A04" strokeWidth="1" />
                <path d="M28 38 L32 38 M30 36 L30 40" stroke="#78350F" strokeWidth="0.8" />
              </g>
            )}

            {/* Case: Kính Râm Y2K / Retro */}
            {itemId === 'sunglasses' && (
              <g id="thumb-sunglasses" transform="translate(18, 38)">
                {/* Mắt kính trái */}
                <ellipse cx="18" cy="12" rx="14" ry="9" fill="#09090B" stroke="#3F3F46" strokeWidth="1.8" />
                <path d="M10 8 Q16 6 22 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                {/* Cầu nối kính */}
                <path d="M32 12 L36 12" stroke="#3F3F46" strokeWidth="2.5" />
                {/* Mắt kính phải */}
                <ellipse cx="50" cy="12" rx="14" ry="9" fill="#09090B" stroke="#3F3F46" strokeWidth="1.8" />
                <path d="M42 8 Q48 6 54 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                {/* Gọng kính hai bên */}
                <path d="M4 12 L0 9" stroke="#3F3F46" strokeWidth="2" />
                <path d="M64 12 L68 9" stroke="#3F3F46" strokeWidth="2" />
              </g>
            )}

            {/* Case: Túi Tote Canvas */}
            {itemId === 'tote_bag' && (
              <g id="thumb-tote-bag" transform="translate(30, 20)">
                {/* Quai túi canvas quàng qua */}
                <path d="M10 18 C10 -6 30 -6 30 18" fill="none" stroke="#334155" strokeWidth="2.8" strokeLinecap="round" />
                {/* Thân túi canvas chữ nhật */}
                <rect x="2" y="18" width="36" height="46" rx="3" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1.8" />
                {/* Khung đồ họa Gen Z in chữ VIET REMIX */}
                <rect x="8" y="26" width="24" height="18" fill="#FCA5A5" opacity="0.7" rx="1" />
                <text x="12" y="38" fontSize="7" fontWeight="bold" fill="#881337" fontFamily="sans-serif">
                  VIET
                </text>
                <text x="11" y="55" fontSize="6" fontWeight="bold" fill="#64748B" fontFamily="sans-serif">
                  REMIX
                </text>
              </g>
            )}

            {/* Case: Tai Nghe Over-Ear */}
            {itemId === 'over_ear_headphones' && (
              <g id="thumb-headphones" transform="translate(20, 22)">
                {/* Quai đeo kim loại bạc cong */}
                <path d="M12 36 C12 6 48 6 48 36" fill="none" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M16 28 C16 12 44 12 44 28" fill="none" stroke="#64748B" strokeWidth="1.5" />
                {/* Đệm tai nghe bên trái */}
                <rect x="4" y="26" width="11" height="22" rx="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1.5" />
                {/* Đệm tai nghe bên phải */}
                <rect x="45" y="26" width="11" height="22" rx="5" fill="#0F172A" stroke="#E2E8F0" strokeWidth="1.5" />
              </g>
            )}

            {/* Case: Mũ Beret Nồi */}
            {itemId === 'beret_hat' && (
              <g id="thumb-beret" transform="translate(20, 32)">
                <path
                  d="M4 26 C6 6 56 0 60 18 C62 28 15 32 4 26 Z"
                  fill="#292524"
                  stroke="#1C1917"
                  strokeWidth="1.8"
                />
                <circle cx="36" cy="7" r="2.2" fill="#292524" />
                <path d="M14 26 Q34 29 54 23" stroke="#44403C" strokeWidth="1.2" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 4. GIÀY DÉP (FOOTWEAR) */}
        {type === 'footwear' && (
          <g transform="translate(0, 0)">
            {/* Giày dép bổ sung (nhìn nghiêng) */}
            {itemId === 'guoc_moc_nu' && (
              <g transform="translate(18, 40)">
                <path d="M4 18 L62 18 L60 28 L6 28 Z" fill="#A4372B" stroke="#7A2219" strokeWidth="1.5" />
                <circle cx="20" cy="23" r="2" fill="#F2C66D" /><circle cx="32" cy="23" r="2" fill="#F2C66D" /><circle cx="44" cy="23" r="2" fill="#F2C66D" />
                <path d="M30 18 Q40 4 52 18" stroke="#1F1A1A" strokeWidth="6" fill="none" strokeLinecap="round" />
              </g>
            )}
            {itemId === 'hai_cuom' && (
              <g transform="translate(18, 34)">
                <path d="M4 26 Q8 12 30 10 Q52 10 62 22 L62 28 L4 28 Z" fill={palette.primary} stroke="#3A2E2A" strokeWidth="1.5" />
                <rect x="3" y="27" width="60" height="4" rx="2" fill="#3A2E2A" />
                <circle cx="40" cy="16" r="2" fill="#F2C66D" /><circle cx="47" cy="19" r="2" fill="#FFFFFF" /><circle cx="33" cy="15" r="2" fill="#E86A7E" /><circle cx="52" cy="23" r="2" fill="#7FC8B5" /><circle cx="26" cy="16" r="2" fill="#F2C66D" />
              </g>
            )}
            {itemId === 'giay_bup_be' && (
              <g transform="translate(18, 40)">
                <path d="M4 24 Q4 14 16 14 Q30 20 46 16 Q62 16 62 26 L4 26 Z" fill="#2B2528" />
                <rect x="3" y="25" width="60" height="3" rx="1.5" fill="#1A1517" />
                <path d="M44 15 L48 18 L52 15 L52 21 L48 18 L44 21 Z" fill={palette.accent} />
              </g>
            )}
            {itemId === 'cao_got_quai' && (
              <g transform="translate(18, 30)">
                <path d="M6 36 L16 12 L20 12 L12 36 Z" fill={palette.accent} />
                <path d="M14 14 Q34 24 62 30 L62 34 Q34 30 14 18 Z" fill={palette.accent} />
                <path d="M20 8 Q24 2 28 8" stroke={palette.accent} strokeWidth="2.5" fill="none" />
                <path d="M40 22 Q48 14 56 26" stroke={palette.accent} strokeWidth="2.5" fill="none" />
              </g>
            )}
            {itemId === 'dep_to_ong' && (
              <g transform="translate(18, 38)">
                <path d="M30 18 Q44 4 62 20" fill="#F1EBDD" stroke="#CFC6B2" strokeWidth="1.5" />
                <rect x="3" y="20" width="60" height="8" rx="3" fill="#E3DBC8" stroke="#CFC6B2" strokeWidth="1.5" />
                <circle cx="44" cy="13" r="1.8" fill="#D9D0BC" /><circle cx="51" cy="14" r="1.8" fill="#D9D0BC" /><circle cx="38" cy="16" r="1.8" fill="#D9D0BC" />
              </g>
            )}
            {itemId === 'dep_suc' && (
              <g transform="translate(18, 34)">
                <path d="M6 20 Q4 8 14 8" stroke="#5A5456" strokeWidth="3" fill="none" />
                <path d="M4 28 Q4 14 22 12 Q50 8 62 24 L62 28 Z" fill="#3B3638" />
                <rect x="3" y="26" width="60" height="6" rx="3" fill="#4B4648" />
                <circle cx="40" cy="15" r="1.8" fill="#8A8487" /><circle cx="47" cy="17" r="1.8" fill="#8A8487" /><circle cx="54" cy="20" r="1.8" fill="#8A8487" /><circle cx="33" cy="15" r="1.8" fill="#8A8487" />
              </g>
            )}
            {/* Case: Giày Tây Cổ Điển (Nam) */}
            {itemId === 'giay_tay_nam' && (
              <g id="thumb-giay-tay" transform="translate(18, 30)">
                <rect x="2" y="33" width="13" height="7" rx="1" fill="#111113" />
                <path d="M2 34 Q2 25 12 22 Q22 17 32 16.5 Q42 16.5 47 21 Q60 23 64 30 L64 35 L2 35 Z" fill="#27272A" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M2 35 L64 35 L64 37.5 L2 37.5 Z" fill="#111113" />
                <path d="M48 21.5 Q51 28 49 35" stroke="#0E0E10" strokeWidth="1" fill="none" />
                <path d="M29 17.5 L37 20 M31 20.5 L39 22.5" stroke="#52525B" strokeWidth="1.2" />
                <path d="M53 25 Q58 26 61 29" stroke="#71717A" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </g>
            )}

            {/* Case: Hài Vải Đế Dày (Nam) */}
            {itemId === 'hai_vai_nam' && (
              <g id="thumb-hai-vai" transform="translate(18, 30)">
                <path d="M4 32 Q4 24 12 22 L28 20 Q40 18 50 21 Q62 24 64 32 Z" fill="#1E1C1D" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M14 22 Q24 26 34 20.5" stroke="#3A3638" strokeWidth="1.4" fill="none" />
                <path d="M50 21 Q62 24 64 32 L47 32 Q46 26 50 21 Z" fill="#C9A06A" />
                <path d="M55 24 Q59 25.5 61 28" stroke="#E2C493" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <rect x="2" y="32" width="64" height="6" rx="2.5" fill="#F4F1EA" stroke="#CFC8BA" strokeWidth="1.2" />
              </g>
            )}

            {/* Case: Sneaker Năng Động (Chunky Streetwear) */}
            {itemId === 'sneaker' && (
              <g id="thumb-sneakers" transform="translate(20, 32)">
                {/* Sneaker nhìn nghiêng */}
                <path
                  d="M6 24 Q12 12 28 10 L48 12 Q60 18 64 28 L64 36 L0 36 Q0 28 6 24 Z"
                  fill="#FFFFFF"
                  stroke="#0F172A"
                  strokeWidth="2"
                />
                {/* Đế giày sneaker chunky */}
                <path d="M0 32 L64 32 L64 38 L0 38 Z" fill="#E2E8F0" stroke="#0F172A" strokeWidth="1.5" />
                {/* Vệt màu remix theo bảng màu */}
                <path d="M16 20 Q30 26 44 18" stroke={palette.primary} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                {/* Dây giày */}
                <line x1="20" y1="14" x2="30" y2="14" stroke="#64748B" strokeWidth="1.5" />
                <line x1="24" y1="18" x2="34" y2="18" stroke="#64748B" strokeWidth="1.5" />
              </g>
            )}

            {/* Case: Guốc Mộc Nam */}
            {itemId === 'guoc_moc_nam' && (
              <g id="thumb-guoc-moc" transform="translate(20, 34)">
                {/* Thân guốc gỗ mộc */}
                <path d="M4 24 Q30 20 58 22 L58 32 L4 32 Z" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
                {/* Quai guốc da nâu bản to */}
                <path d="M16 23 Q28 6 42 22" fill="#451A03" stroke="#292524" strokeWidth="2.5" />
                <circle cx="16" cy="23" r="1.8" fill="#FBBF24" />
                <circle cx="42" cy="22" r="1.8" fill="#FBBF24" />
              </g>
            )}

            {/* Case: Hài Thêu Cung Đình / Guốc Mộc */}
            {itemId === 'hai_theu' && (
              <g id="thumb-hai-theu" transform="translate(20, 34)">
                {/* Thân hài vải gấm màu theo bảng màu */}
                <path
                  d="M4 22 Q18 12 44 14 Q56 12 60 4 Q62 10 58 24 L4 26 Z"
                  fill={palette.primary}
                  stroke={palette.accent}
                  strokeWidth="1.8"
                />
                {/* Đế hài uốn lượn */}
                <path d="M4 25 Q30 28 58 24" stroke={palette.secondary} strokeWidth="2.5" fill="none" />
                {/* Chóp mũi hài thêu chỉ kim tuyến và đính ngọc vàng */}
                <circle cx="59" cy="6" r="3.5" fill="#FACC15" stroke="#B45309" strokeWidth="1" />
                {/* Hoa văn thêu hoàng cung trên thân hài */}
                <path d="M22 18 Q32 14 42 19" stroke="#FEF08A" strokeWidth="1.2" fill="none" />
              </g>
            )}
          </g>
        )}

        {/* 5. CHÂN MỘC / THÁO GIÀY (BARE FEET) */}
        {type === 'barefoot' && (
          <g id="thumb-barefoot" transform="translate(25, 26)">
            {/* Dáng bàn chân mộc cổ truyền mềm mại */}
            <path
              d="M10 26 C10 14 26 12 36 18 C44 23 48 34 46 44 C44 54 36 58 24 58 C14 58 10 46 10 36 Z"
              fill="#FED7AA"
              stroke="#D4A373"
              strokeWidth="1.8"
            />
            {/* Các ngón chân mộc tự nhiên */}
            <ellipse cx="36" cy="18" rx="4.5" ry="4" fill="#FED7AA" stroke="#D4A373" strokeWidth="1" />
            <ellipse cx="43" cy="22" rx="3.5" ry="3" fill="#FED7AA" stroke="#D4A373" strokeWidth="1" />
            <ellipse cx="47" cy="28" rx="3" ry="2.5" fill="#FED7AA" stroke="#D4A373" strokeWidth="1" />
            <ellipse cx="48" cy="35" rx="2.5" ry="2" fill="#FED7AA" stroke="#D4A373" strokeWidth="1" />
            <ellipse cx="46" cy="41" rx="2" ry="1.8" fill="#FED7AA" stroke="#D4A373" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
};
