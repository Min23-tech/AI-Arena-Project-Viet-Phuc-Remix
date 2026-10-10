/**
 * Dữ liệu thời trang & văn hóa cho "Việt phục Remix"
 * Chứa thông tin lịch sử, cấu tạo, phụ kiện và các quy tắc kiểm tra độ hòa hợp văn hóa.
 */

// Ảnh đại diện cho bảng chọn dịp (file ở thư mục gốc dự án)
import occAoDai1 from '../../ao-dai-1.jpg';
import occAoDai3 from '../../ao-dai-3.jpg';
import occAoDai2 from '../../ao-dai-2.jpg';
import occNhatBinh1 from '../../nhat-binh-1.jpg';
import occTuThan1 from '../../tu-than-1.jpg';
import occAoTacNam1 from '../../ao-tac-nam-1.jpg';
import occGiaoLinh1 from '../../giao-linh-1.jpg';
import occNguThanLeChua from '../../ngu-than-nam-le-chua.jpg';

export interface EventContext {
  id: string;
  name: string;
  emoji: string;
  description: string;
  recommendation: string;
}

export type GenderFit = 'male' | 'female' | 'unisex';

export interface CostumeItem {
  id: string;
  name: string;
  era: string;
  origin: string;
  gender: GenderFit; // 'male' | 'female' | 'unisex'
  genderFit?: 'all' | 'female' | 'male';
  philosophy: string;
  structure: {
    collar: string;
    body: string;
    sleeves: string;
    buttons: string;
  };
  fabricStory: string;
  traditionalScoreBase: number;
  tags: string[];
}

export type BodySlot = 'head' | 'eyes' | 'ears' | 'neck' | 'hand_right' | 'hand_left' | 'feet';

export const SLOT_LABELS: Record<BodySlot, string> = {
  head: 'Đội đầu',
  eyes: 'Mắt',
  ears: 'Tai',
  neck: 'Cổ',
  hand_right: 'Tay phải',
  hand_left: 'Tay trái',
  feet: 'Giày dép',
};

export interface AccessoryItem {
  id: string;
  name: string;
  type: 'traditional' | 'modern';
  gender: GenderFit; // 'male' | 'female' | 'unisex'
  category: 'head' | 'face' | 'neck' | 'hand' | 'feet';
  slot: BodySlot; // Ô trên cơ thể (mỗi ô chỉ chứa tối đa 1 món)
  emoji: string;
  description: string;
  traditionalPoints: number; // Điểm cộng truyền thống (+ hoặc -)
  modernPoints: number;     // Điểm cộng phá cách
}

export interface ColorPalette {
  id: string;
  name: string;
  poeticName: string;
  primary: string;    // Màu áo chính
  secondary: string;  // Màu quần/vạt phụ
  accent: string;     // Màu viền/họa tiết nút
  border: string;
  tag: string;
}

export interface HairstyleItem {
  id: string;
  name: string;
  gender: 'female' | 'male';
  style: 'long' | 'bun' | 'short' | 'topknot';
  emoji: string;
  description: string;
  traditionType: 'vung_loi' | 'vung_remix';
}

export type WardrobeCategory = 'costume' | 'hair' | 'accessory' | 'footwear' | 'color';

export interface CategoryTab {
  id: WardrobeCategory;
  label: string;
  shortDesc: string;
}

export const CATEGORY_TABS: CategoryTab[] = [
  { id: 'costume', label: 'Trang phục', shortDesc: 'Áo ngũ thân, Áo tấc, Áo dài, Áo tứ thân' },
  { id: 'hair', label: 'Kiểu tóc', shortDesc: 'Tóc truyền thống & biến tấu tân thời' },
  { id: 'accessory', label: 'Phụ kiện', shortDesc: 'Mấn, quạt, kính râm, tai nghe, túi' },
  { id: 'footwear', label: 'Giày dép', shortDesc: 'Hài thêu, guốc mộc & sneaker đường phố' },
  { id: 'color', label: 'Màu sắc', shortDesc: 'Bảng màu hoàng kim, sen hồng, lam ngọc' },
];

export const HAIRSTYLES: HairstyleItem[] = [
  {
    id: 'hair_female_long',
    name: 'Tóc Dài Xõa Nàng Thơ',
    gender: 'female',
    style: 'long',
    emoji: '👧',
    description: 'Tóc dài rẽ ngôi giữa, buông gọn sau lưng, nét đẹp mộc mạc của thiếu nữ Việt.',
    traditionType: 'vung_remix',
  },
  {
    id: 'hair_female_long_side',
    name: 'Tóc Dài Vắt Vai',
    gender: 'female',
    style: 'long',
    emoji: '💁‍♀️',
    description: 'Tóc dài rẽ ngôi giữa, một lọn vắt qua vai trước ngực, mềm mại điệu đà.',
    traditionType: 'vung_remix',
  },
  {
    id: 'hair_female_bun',
    name: 'Búi Tóc Cài Trâm Cổ Điển',
    gender: 'female',
    style: 'bun',
    emoji: '👱‍♀️',
    description: 'Tóc búi gọn sau gáy, tôn bờ vai thanh mảnh và chuẩn mực khi đội mấn.',
    traditionType: 'vung_loi',
  },
  {
    id: 'hair_male_short',
    name: 'Tóc Ngắn Sĩ Tử Hiện Đại',
    gender: 'male',
    style: 'short',
    emoji: '👦',
    description: 'Gọn gàng năng động, phong thái thanh niên Gen Z.',
    traditionType: 'vung_remix',
  },
  {
    id: 'hair_male_topknot',
    name: 'Búi Tóc Củ Hành Truyền Thống',
    gender: 'male',
    style: 'topknot',
    emoji: '🧔',
    description: 'Kiểu búi tóc đặc trưng của nam giới Việt xưa khi mặc áo ngũ thân.',
    traditionType: 'vung_loi',
  },
  {
    id: 'hair_male_comma',
    name: 'Tóc Mái Phẩy',
    gender: 'male',
    style: 'short',
    emoji: '💇‍♂️',
    description: 'Mái dài rủ chéo trán, đuôi cong như dấu phẩy — kiểu tóc Gen Z.',
    traditionType: 'vung_remix',
  },
  {
    id: 'hair_male_curtain',
    name: 'Tóc Rẽ Ngôi Giữa',
    gender: 'male',
    style: 'short',
    emoji: '🧑',
    description: 'Hai mảng mái vén sang hai bên, thư sinh và lãng tử.',
    traditionType: 'vung_remix',
  },
  {
    id: 'hair_male_crew',
    name: 'Tóc Đầu Cua',
    gender: 'male',
    style: 'short',
    emoji: '👨',
    description: 'Ngắn sát, gọn gàng, khoẻ khoắn.',
    traditionType: 'vung_remix',
  },
];

export interface CulturalRule {
  id: string;
  costumeId?: string;
  requiredAccessories?: string[];
  /** Luật chỉ áp dụng khi có ít nhất một trong các món này */
  requiredAnyAccessories?: string[];
  forbiddenAccessories?: string[];
  eventId?: string;
  severity: 'info' | 'warning' | 'celebrate';
  title: string;
  message: string;
  tip: string;
}

// Danh sách sự kiện người dùng có thể chọn
export const EVENTS: EventContext[] = [
  {
    id: 'tet',
    name: 'Tết Cổ Truyền',
    emoji: '🧧',
    description: 'Du xuân, chúc Tết gia đình, lễ bái đầu năm và tụ tập bạn bè.',
    recommendation: 'Ưu tiên màu tươi sáng (Đỏ, Vàng, Hồng), giữ nét trang nghiêm nếu đi đền chùa.'
  },
  {
    id: 'graduation',
    name: 'Lễ Tốt Nghiệp',
    emoji: '🎓',
    description: 'Kỷ niệm cột mốc thanh xuân rực rỡ bên bạn bè và thầy cô.',
    recommendation: 'Rất chuộng phối Áo tấc hoặc Áo ngũ thân kèm sneaker hoặc túi tote để tiện chụp ảnh cả ngày.'
  },
  {
    id: 'streetwear',
    name: 'Dạo Phố & Cafe',
    emoji: '☕',
    description: 'Gặp gỡ cuối tuần, check-in phố cổ, bảo tàng nghệ thuật hoặc quán cafe vibe indie.',
    recommendation: 'Tự do remix cùng kính râm, sneaker hoặc tai nghe chụp tai để tạo phong cách urban chic.'
  },
  {
    id: 'concept',
    name: 'Chụp Ảnh Concept',
    emoji: '📸',
    description: 'Sáng tạo lookbook cá nhân, nghệ thuật thị giác hoặc kỷ yếu độc lạ.',
    recommendation: 'Không giới hạn phá cách, thỏa sức thử nghiệm đa dạng bảng màu và phụ kiện đối lập.'
  }
];

// Các Loại Việt phục tiêu biểu
export const COSTUMES: CostumeItem[] = [
  {
    id: 'ngu_than',
    name: 'Áo Ngũ Thân Lập Lĩnh',
    era: 'Thời Chúa Nguyễn Vũ Vương (1744) & Triều Nguyễn',
    origin: 'Cải cách y phục Đàng Trong, sau trở thành quốc phục của người Việt suốt triều Nguyễn.',
    gender: 'unisex',
    genderFit: 'all',
    philosophy: '5 thân áo tượng trưng cho "Tứ thân phụ mẫu" (cha mẹ mình và cha mẹ người phối ngẫu) cùng "Thân con" nằm khiêm nhường bên trong. 5 hạt nút gỗ/ngọc đại diện cho Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín.',
    structure: {
      collar: 'Lập lĩnh (cổ đứng) may thẳng, ôm khít cổ, thể hiện sự chính trực, đoan trang.',
      body: 'Gồm 2 thân trước, 2 thân sau và 1 thân con (vạt con) bên trong cài kín.',
      sleeves: 'Tay chẽn gọn gàng, ôm vừa vặn cánh tay, rất thanh lịch và tiện sinh hoạt thường nhật.',
      buttons: '5 khuy/nút gài tinh tế chếch từ cổ xuống nách sang sườn phải.'
    },
    fabricStory: 'Thường may bằng the, lụa Hà Đông, đũi, gấm tơ tằm. Khi mặc lồng áo lót trắng bên trong tạo nên hiệu ứng tầng lớp thanh nhã.',
    traditionalScoreBase: 88,
    tags: ['Quốc phục triều Nguyễn', 'Ngũ Thường', 'Tay chẽn', 'Thanh lịch']
  },
  {
    id: 'ao_tac',
    name: 'Áo Tấc (Áo Tay Thụng)',
    era: 'Triều đại nhà Nguyễn (1802 - 1945)',
    origin: 'Dạng trang phục trang trọng (Lễ phục thường dụng) của tầng lớp quý tộc và thường dân trong các dịp đại lễ.',
    gender: 'unisex',
    genderFit: 'all',
    philosophy: 'Ống tay áo thụng dài và rộng tượng trưng cho sự bao dung, lễ nghi và dáng dấp tôn nghiêm. Mỗi khi chắp tay hành lễ, hai tay áo che kín tạo thế "bái tổ" kính cẩn.',
    structure: {
      collar: 'Cổ đứng lập lĩnh cao kín đáo, gài khuy sang bên nách phải.',
      body: 'Cấu tạo 5 thân như áo ngũ thân nhưng kích thước tà thụng rộng và dài chạm mắt cá chân.',
      sleeves: 'Tay thụng rất rộng, khi buông tay dài ngang hoặc quá gối một tấc (khoảng 10-12cm, từ đó có tên là Áo Tấc).',
      buttons: '5 cúc kim loại, đá quý hoặc gỗ bọc gấm quý phái.'
    },
    fabricStory: 'Được dệt bằng gấm hoa triều đình, sa đoạn cao cấp có hoa văn mây rồng hoặc hoa lá cách điệu.',
    traditionalScoreBase: 95,
    tags: ['Đại lễ', 'Lễ phục cung đình', 'Tay thụng', 'Trang trọng bậc nhất']
  },
  {
    id: 'ao_dai_tan_thoi',
    name: 'Áo Dài Tân Thời',
    era: 'Thập niên 1930 (Phong trào Le Mur / Lê Phổ) đến nay',
    origin: 'Được cách tân bởi các họa sĩ Trường Mỹ thuật Đông Dương, kết hợp thẩm mỹ phương Tây và cốt cách Việt.',
    gender: 'female',
    genderFit: 'female',
    philosophy: 'Tôn vinh đường cong tự nhiên và sự uyển chuyển của người phụ nữ Việt Nam trong kỷ nguyên hiện đại, đánh dấu bước chuyển mình tự do của thời trang dân tộc.',
    structure: {
      collar: 'Biến tấu đa dạng: cổ cao 3-5cm truyền thống hoặc cổ tròn, cổ thuyền hiện đại.',
      body: 'Ôm sát eo và ngực, xẻ tà cao đến thắt lưng giúp người mặc sải bước mềm mại.',
      sleeves: 'Tay raglan hoặc tay nối ôm nhẹ nhàng, tạo phom dáng thon gọn.',
      buttons: 'Cúc bấm bên sườn hoặc khóa kéo sau lưng hiện đại.'
    },
    fabricStory: 'Vải voan mềm, lụa chiffon, nhung thêu hoa tinh xảo tạo cảm giác nhẹ bẫng như mây.',
    traditionalScoreBase: 80,
    tags: ['Tân thời 1930s', 'Duyên dáng', 'Đông Dương hoài cổ', 'Linh hoạt']
  },
  {
    id: 'ao_tu_than',
    name: 'Áo Tứ Thân',
    era: 'Thế kỷ 12 - 18 (Cổ truyền Bắc Bộ)',
    origin: 'Trang phục truyền thống tiêu biểu của phụ nữ miền Bắc Việt Nam qua nhiều thế kỷ lao động và hội hè.',
    gender: 'female',
    genderFit: 'female',
    philosophy: '4 thân áo tượng trưng cho bốn đấng sinh thành. Hai vạt trước buộc lại với nhau tượng trưng cho tình vợ chồng quấn quýt nghĩa tình son sắt.',
    structure: {
      collar: 'Áo không có cúc gài kín, mở vạt để lộ yếm lót hoa đào duyên dáng bên trong.',
      body: 'Gồm 2 thân sau may liền sống lưng và 2 thân trước thả buông hoặc thắt nơ trước bụng.',
      sleeves: 'Tay áo may nối vừa vặn để thuận tiện lao động và hát quan họ.',
      buttons: 'Mặc buông vạt, giữ chặt eo bằng thắt lưng bao lụa hồng, xanh thắt hoa.'
    },
    fabricStory: 'Vải đũi mộc mạc, lụa nhuộm màu bùn tự nhiên hoặc nhuộm củ nâu, sồi ấm áp.',
    traditionalScoreBase: 85,
    tags: ['Kinh Bắc', 'Dân ca Quan họ', 'Yếm đào', 'Duyên quê thuần khiết']
  },
  {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật Bình',
    era: 'Thời nhà Nguyễn (1802 - 1945)',
    origin: 'Lễ phục cao quý của Hoàng thái hậu, Hoàng hậu, Công chúa và mệnh phụ quý tộc triều Nguyễn.',
    gender: 'female',
    genderFit: 'female',
    philosophy: 'Cổ áo khoét chữ nhật đối khâm cân đối hài hòa tượng trưng cho đức hạnh đoan chính và khuôn phép cao sang của bậc tôn thất.',
    structure: {
      collar: 'Cổ áo hình chữ nhật to bản viền thêu hoa văn ngũ sắc hoặc rồng phụng.',
      body: 'Áo dài xẻ tà hai bên, vạt áo buông rủ dài qua gối trang trọng.',
      sleeves: 'Tay áo viền dải ngũ hành năm sắc màu rực rỡ.',
      buttons: 'Gài bằng khuy đồng nạm ngọc hoặc ngọc bích quý giá.'
    },
    fabricStory: 'Dệt bằng sa đoạn, gấm vóc tiến cung triều đình Huế với chỉ thêu vàng rực rỡ.',
    traditionalScoreBase: 96,
    tags: ['Cung đình Huế', 'Quý tộc', 'Đối khâm', 'Ngũ sắc']
  },
  {
    id: 'ao_giao_linh',
    name: 'Áo Giao Lĩnh (Nam)',
    era: 'Thời Lý - Trần - Lê (Thế kỷ 11 - 18)',
    origin: 'Trang phục cổ truyền uy nghiêm của nam giới Đại Việt trong các nghi lễ trang trọng.',
    gender: 'male',
    genderFit: 'male',
    philosophy: 'Hai vạt áo giao nhau phía trước ngực thể hiện sự chính khí, dung hòa giữa trời và đất.',
    structure: {
      collar: 'Cổ áo chéo (giao lĩnh), vạt bên trái đè lên vạt bên phải.',
      body: 'Phom dáng rộng rãi, bồng bềnh phong thái nho sĩ, trượng phu.',
      sleeves: 'Ống tay thụng rộng khoan thai uy dũng.',
      buttons: 'Dùng đai thắt lưng lụa bản to buộc giữ eo vững chãi.'
    },
    fabricStory: 'Vải thô dệt tay, lụa đũi nhuộm thảo mộc hoặc gấm mộc mạc thanh cao.',
    traditionalScoreBase: 92,
    tags: ['Đại Việt', 'Nho sĩ', 'Cổ truyền', 'Trang trọng']
  },
  {
    id: 'ngu_than_nam',
    name: 'Áo Ngũ Thân (Nam Phom Rộng)',
    era: 'Triều Nguyễn (1802 - 1945)',
    origin: 'Dạng áo ngũ thân may phom rộng khoáng đạt của quan lại và thân sĩ nam giới triều Nguyễn.',
    gender: 'male',
    genderFit: 'male',
    philosophy: '5 thân áo tượng trưng cho Ngũ Thường, phom rộng tạo phong thái đĩnh đạc, chững chạc của đấng nam nhi.',
    structure: {
      collar: 'Lập lĩnh cổ đứng thẳng, ôm vừa cổ áo trong.',
      body: 'Phom áo may suông rộng rãi, vạt áo dài che gối đường bệ.',
      sleeves: 'Tay chẽn hoặc tay rộng vừa phải thoải mái sải bước.',
      buttons: '5 hạt cúc đá ngọc hoặc đồng chạm trổ.'
    },
    fabricStory: 'Gấm tơ tằm dệt chìm hoa văn chữ Thọ, the lụa Hà Đông cao cấp.',
    traditionalScoreBase: 90,
    tags: ['Quan lại triều Nguyễn', 'Nam phục', 'Chững chạc', 'Phom rộng']
  }
];

// Danh sách phụ kiện Cổ điển và Hiện đại
export const ACCESSORIES: AccessoryItem[] = [
  // Cổ điển Nam
  {
    id: 'khan_dong',
    name: 'Khăn Xếp (Khăn Đóng)',
    type: 'traditional',
    gender: 'male',
    category: 'head',
    slot: 'head',
    emoji: '🎩',
    description: 'Khăn quấn sẵn hình tròn nhiều nếp chỉnh tề, tôn phong thái trang trọng của nam phục Việt.',
    traditionalPoints: 12,
    modernPoints: -2
  },
  {
    id: 'guoc_moc_nam',
    name: 'Guốc Mộc Nam Cổ Truyền',
    type: 'traditional',
    gender: 'male',
    category: 'feet',
    slot: 'feet',
    emoji: '🪵',
    description: 'Guốc gỗ mít quai da bản to, tiếng gõ nhịp đĩnh đạc của sĩ tử xưa.',
    traditionalPoints: 12,
    modernPoints: -2
  },
  {
    id: 'quat_thu_phap',
    name: 'Quạt Giấy Thư Pháp (Nam)',
    type: 'traditional',
    gender: 'male',
    category: 'hand',
    slot: 'hand_right',
    emoji: '🪭',
    description: 'Quạt giấy bồi nan tre đề thơ chữ Nôm hoặc thư pháp chữ Hán phong nhã.',
    traditionalPoints: 10,
    modernPoints: 2
  },

  // Cổ điển Nữ
  {
    id: 'khan_van',
    name: 'Khăn Vấn (Nữ)',
    type: 'traditional',
    gender: 'female',
    category: 'head',
    slot: 'head',
    emoji: '👑',
    description: 'Dải khăn cuộn tròn (khăn lươn) quấn 1–2 vòng ôm sát đầu, giữ tóc gọn gàng, nét duyên dáng của phụ nữ Bắc Bộ.',
    traditionalPoints: 12,
    modernPoints: -2
  },
  {
    id: 'man_doi_dau',
    name: 'Mấn (Khăn Vành)',
    type: 'traditional',
    gender: 'female',
    category: 'head',
    slot: 'head',
    emoji: '🪷',
    description: 'Khăn vành bản to, nhiều vòng quấn đều nhau thành vành tròn quanh đầu, dùng trong lễ cưới, lễ Tết và dịp trang trọng.',
    traditionalPoints: 12,
    modernPoints: -2
  },
  {
    id: 'tram_cai_toc',
    name: 'Trâm Cài Tóc Mạ Vàng',
    type: 'traditional',
    gender: 'female',
    category: 'head',
    slot: 'ears',
    emoji: '✨',
    description: 'Trâm ngọc hoặc kim loại chạm hình hoa sen, cánh bướm cài nhẹ búi tóc sau gáy.',
    traditionalPoints: 10,
    modernPoints: 2
  },
  {
    id: 'hai_theu',
    name: 'Hài Thêu Mũi Cong (Nữ)',
    type: 'traditional',
    gender: 'female',
    category: 'feet',
    slot: 'feet',
    emoji: '👡',
    description: 'Hài cong mũi thêu chỉ kim tuyến hoặc guốc mộc thanh nhã gõ nhịp khoan thai.',
    traditionalPoints: 12,
    modernPoints: -3
  },
  {
    id: 'tui_may_tre',
    name: 'Túi Mây Tre Đan Mộc Mạc',
    type: 'traditional',
    gender: 'female',
    category: 'hand',
    slot: 'hand_left',
    emoji: '🧺',
    description: 'Túi đan thủ công từ cói, mây tre tự nhiên, đậm chất nàng thơ mộc mạc.',
    traditionalPoints: 10,
    modernPoints: 6
  },
  {
    id: 'non_quai_thao',
    name: 'Nón Quai Thao',
    type: 'traditional',
    gender: 'female',
    category: 'hand',
    slot: 'hand_left',
    emoji: '🎐',
    description: 'Nón thúng mặt phẳng, vành rộng, có quai thao bằng tơ lụa buông tua; đi cùng áo tứ thân của liền chị Quan họ.',
    traditionalPoints: 10,
    modernPoints: 0
  },
  {
    id: 'non_la',
    name: 'Nón Lá Cổ Truyền',
    type: 'traditional',
    gender: 'female',
    category: 'head',
    slot: 'head',
    emoji: '👒',
    description: 'Nón lá chóp nhọn đan từ lá cọ/lá gồi, biểu tượng mộc mạc của quê hương.',
    traditionalPoints: 10,
    modernPoints: 2
  },
  {
    id: 'quat_giay',
    name: 'Quạt Lụa Hoa Sen',
    type: 'traditional',
    gender: 'female',
    category: 'hand',
    slot: 'hand_right',
    emoji: '🪭',
    description: 'Quạt xếp vẽ hoa sen hoặc hoa mẫu đơn duyên dáng trong tay nàng thơ.',
    traditionalPoints: 8,
    modernPoints: 4
  },
  {
    id: 'chuoi_ngoc',
    name: 'Chuỗi Ngọc / Khánh Bạc',
    type: 'traditional',
    gender: 'female',
    category: 'neck',
    slot: 'neck',
    emoji: '📿',
    description: 'Chuỗi ngọc trai hoặc khánh bạc rủ nhẹ trước ngực áo dưới cổ lập lĩnh.',
    traditionalPoints: 8,
    modernPoints: 2
  },

  // Phụ kiện Unisex Hiện đại Gen Z
  {
    id: 'sneaker',
    name: 'Sneaker Năng Động (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'feet',
    slot: 'feet',
    emoji: '👟',
    description: 'Giày thể thao trắng chunky hoặc retro trainer êm ái, bứt phá năng lượng.',
    traditionalPoints: -10,
    modernPoints: 18
  },
  {
    id: 'giay_tay_nam',
    name: 'Giày Tây Cổ Điển (Nam)',
    type: 'modern',
    gender: 'male',
    category: 'feet',
    slot: 'feet',
    emoji: '👞',
    description: 'Giày da Oxford đen bóng, kiểu nam giới thời giao thời đầu thế kỷ 20 hay đi cùng áo ngũ thân, khăn đóng.',
    traditionalPoints: -2,
    modernPoints: 12
  },
  {
    id: 'hai_vai_nam',
    name: 'Hài Vải Đế Dày (Nam)',
    type: 'traditional',
    gender: 'male',
    category: 'feet',
    slot: 'feet',
    emoji: '🥿',
    description: 'Hài vải đen xỏ chân, đế trắng dày, mũi bọc màu; dáng hài truyền thống may theo kiểu hiện đại.',
    traditionalPoints: 10,
    modernPoints: 0
  },
  {
    id: 'guoc_moc_nu',
    name: 'Guốc Mộc Nữ Sơn Hoa',
    type: 'traditional',
    gender: 'female',
    category: 'feet',
    slot: 'feet',
    emoji: '🪵',
    description: 'Guốc gỗ nhẹ mặt sơn son vẽ hoa, quai nhung đen mềm mại.',
    traditionalPoints: 12,
    modernPoints: -2
  },
  {
    id: 'hai_cuom',
    name: 'Hài Cườm (Nữ)',
    type: 'traditional',
    gender: 'female',
    category: 'feet',
    slot: 'feet',
    emoji: '🥿',
    description: 'Hài mũi kín đế thấp, mặt vải đính hạt cườm nhiều màu.',
    traditionalPoints: 12,
    modernPoints: -3
  },
  {
    id: 'giay_bup_be',
    name: 'Giày Búp Bê',
    type: 'modern',
    gender: 'female',
    category: 'feet',
    slot: 'feet',
    emoji: '🎀',
    description: 'Giày bệt mũi tròn có nơ nhỏ, nhẹ nhàng cho áo dài đi học.',
    traditionalPoints: -4,
    modernPoints: 10
  },
  {
    id: 'cao_got_quai',
    name: 'Cao Gót Quai Mảnh',
    type: 'modern',
    gender: 'female',
    category: 'feet',
    slot: 'feet',
    emoji: '👠',
    description: 'Sandal gót cao quai mảnh ôm chân, hợp áo dài dự tiệc, dạo phố.',
    traditionalPoints: -6,
    modernPoints: 12
  },
  {
    id: 'dep_to_ong',
    name: 'Dép Tổ Ong (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'feet',
    slot: 'feet',
    emoji: '🩴',
    description: 'Dép nhựa trắng ngà quai lỗ tổ ong, biểu tượng hoài niệm thập niên 80–90.',
    traditionalPoints: -12,
    modernPoints: 16
  },
  {
    id: 'dep_suc',
    name: 'Dép Sục Nhựa (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'feet',
    slot: 'feet',
    emoji: '🩴',
    description: 'Dép sục nhựa xốp mũi tròn đế dày, có lỗ thoáng và quai gót.',
    traditionalPoints: -10,
    modernPoints: 16
  },
  {
    id: 'sunglasses',
    name: 'Kính Râm Y2K / Retro (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'face',
    slot: 'eyes',
    emoji: '🕶️',
    description: 'Kính gọng oval đen hoặc mắt mèo cá tính, vibe "tổng tài" thời @.',
    traditionalPoints: -8,
    modernPoints: 16
  },
  {
    id: 'tote_bag',
    name: 'Túi Tote Canvas (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'hand',
    slot: 'hand_left',
    emoji: '👜',
    description: 'Túi vải canvas in slogan khoác trên cổ tay tiện dụng.',
    traditionalPoints: -5,
    modernPoints: 12
  },
  {
    id: 'over_ear_headphones',
    name: 'Tai Nghe Over-Ear (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'head',
    slot: 'ears',
    emoji: '🎧',
    description: 'Tai nghe chụp tai thời thượng (AirPods Max style) tạo visual "Cyber Cổ Trang".',
    traditionalPoints: -10,
    modernPoints: 20
  },
  {
    id: 'beret_hat',
    name: 'Mũ Nồi Beret (Unisex)',
    type: 'modern',
    gender: 'unisex',
    category: 'head',
    slot: 'head',
    emoji: '🧢',
    description: 'Mũ dạ tròn phong cách tiểu thư Đông Dương hoặc nghệ sĩ retro.',
    traditionalPoints: -4,
    modernPoints: 14
  }
];

// Bảng màu rực rỡ phong cách Gen Z pha lẫn sắc màu truyền thống
export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'hoang_kim',
    name: 'Hoàng Kim Triều Đình',
    poeticName: 'Ánh Dương Cung Đình',
    primary: '#D97706',    // Vàng hổ phách
    secondary: '#FEF3C7',  // Trắng kem ngọc trai
    accent: '#B45309',     // Nâu gốm nung
    border: '#FDE68A',
    tag: 'Quyền quý & Rực rỡ'
  },
  {
    id: 'sen_hong',
    name: 'Sen Hồng Ngọc Nữ',
    poeticName: 'Hương Sen Tây Hồ',
    primary: '#DB2777',    // Hồng sen thắm
    secondary: '#FDF2F8',  // Hồng phấn dịu
    accent: '#9D174D',     // Đỏ đỗ quyên
    border: '#FBCFE8',
    tag: 'Dịu dàng & Nàng thơ'
  },
  {
    id: 'lam_ngoc',
    name: 'Lam Ngọc Thủy Mặc',
    poeticName: 'Ngọc Bích Hương Giang',
    primary: '#0D9488',    // Xanh ngọc bích
    secondary: '#F0FDFA',  // Xanh sương mai
    accent: '#115E59',     // Xanh rêu trầm
    border: '#99F6E4',
    tag: 'Thanh tao & Hiện đại'
  },
  {
    id: 'chu_sa',
    name: 'Chu Sa Khánh Hỷ',
    poeticName: 'Hồng Đào Chúc Phúc',
    primary: '#E11D48',    // Đỏ chu sa
    secondary: '#FFF1F2',  // Trắng gấm
    accent: '#9F1239',     // Đỏ mận chín
    border: '#FECDD3',
    tag: 'May mắn & Lễ Tết'
  },
  {
    id: 'tim_hue',
    name: 'Tím Mộng Kinh Kỳ',
    poeticName: 'Sương Khói Cố Đô',
    primary: '#7C3AED',    // Tím huế tân thời
    secondary: '#F5F3FF',  // Tím khói nhạt
    accent: '#5B21B6',     // Tím than
    border: '#DDD6FE',
    tag: 'Bí ẩn & Tinh tế'
  },
  {
    id: 'huyen_den',
    name: 'Hắc Mặc Tối Giản',
    poeticName: 'Mực Tàu Thư Họa',
    primary: '#1E293B',    // Đen than chì sang trọng
    secondary: '#F8FAFC',  // Trắng sứ
    accent: '#475569',     // Xám bạc
    border: '#CBD5E1',
    tag: 'Minimalism & Cool'
  },
  {
    id: 'den_quan_ho',
    name: 'Đen Tuyền Quan Họ',
    poeticName: 'Liền chị Kinh Bắc',
    primary: '#241C22',    // Đen tuyền áo tứ thân
    secondary: '#141213',  // Váy đen
    accent: '#C8102E',     // Yếm đỏ
    border: '#3A3033',
    tag: 'Quan họ & Truyền thống'
  },
  {
    id: 'trang_tinh_khoi',
    name: 'Bạch Tuyết Nữ Sinh',
    poeticName: 'Áo Dài Trắng Tinh Khôi',
    primary: '#F8FAFC',    // Trắng tinh ngọc trai
    secondary: '#FFFFFF',  // Quần trắng lụa
    accent: '#CBD5E1',     // Viền xám sáng thanh nhã
    border: '#E2E8F0',
    tag: 'Thuần khiết & Giảng đường'
  },
  {
    id: 'nau_dong_que',
    name: 'Nâu Củ Nâu Kinh Bắc',
    poeticName: 'Nâu Sồng Đồng Nội',
    primary: '#784315',    // Nâu củ nâu quan họ
    secondary: '#1C1917',  // Váy sồi đen tuyền
    accent: '#DC2626',     // Yếm đào đỏ thắm
    border: '#A16207',
    tag: 'Mộc mạc & Quan họ'
  },
  {
    id: 'hong_phan',
    name: 'Hồng Phấn Nàng Thơ',
    poeticName: 'Hồng Pastel Dạo Phố',
    primary: '#EBC3CF',    // Hồng phấn pastel thanh nhã
    secondary: '#FFFFFF',  // Quần trắng lụa
    accent: '#B98796',     // Viền hồng tro tinh tế
    border: '#B98796',
    tag: 'Pastel & Dạo phố'
  }
];

export interface OccasionTemplate {
  id: string;
  name: string; // Tên dịp
  tagline: string;
  imageUrl: string;
  /** vị trí khung ảnh (CSS object-position), mặc định 'center top' */
  imagePosition?: string;
  authorCredit: string;
  license: string;
  source: string;
  costumeId: string;
  paletteId: string;
  hairId: string;
  gender: 'female' | 'male';
  accessoryIds: string[];
  mainCostumeText: string;
  colorText: string;
  accessoriesText: string;
  behaviorTip: string; // 1 dòng gợi ý ứng xử
}

export const OCCASION_TEMPLATES: OccasionTemplate[] = [
  {
    id: 'khai_giang',
    name: 'Khai giảng / Kỷ yếu',
    tagline: 'Áo dài trắng tinh khôi ngày tựu trường',
    imageUrl: occAoDai1,
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_dai_tan_thoi',
    paletteId: 'trang_tinh_khoi',
    hairId: 'hair_female_long',
    gender: 'female',
    accessoryIds: ['hai_theu'],
    mainCostumeText: 'Áo dài trắng tân thời, quần trắng',
    colorText: 'Bạch tuyết nữ sinh',
    accessoriesText: 'Hài thêu',
    behaviorTip: 'Tà áo trắng giữ nét đoan trang; cả lớp cùng màu áo cho khung hình kỷ yếu đồng điệu.',
  },
  {
    id: 'pho_co_den_long',
    name: 'Phố cổ / Đêm hội đèn lồng',
    tagline: 'Áo tấc giữa phố đèn lồng rực rỡ',
    imageUrl: occAoTacNam1,
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_tac',
    paletteId: 'lam_ngoc',
    hairId: 'hair_male_short',
    gender: 'male',
    accessoryIds: ['khan_dong', 'quat_thu_phap', 'hai_vai_nam'],
    mainCostumeText: 'Áo tấc nam, quần trắng',
    colorText: 'Lam ngọc thủy mặc',
    accessoriesText: 'Khăn đóng, Quạt thư pháp, Hài vải',
    behaviorTip: 'Bước chậm tôn dáng áo tay thụng; nơi đông người nên khép quạt lại.',
  },
  {
    id: 'tet_du_xuan',
    name: 'Tết / Du xuân / Dạo phố',
    tagline: 'Sắc đỏ may mắn rước phúc lộc đầu năm',
    imageUrl: occAoDai3,
    imagePosition: 'center 20%',
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_dai_tan_thoi',
    paletteId: 'chu_sa',
    hairId: 'hair_female_long',
    gender: 'female',
    accessoryIds: ['non_la', 'hai_theu'],
    mainCostumeText: 'Áo dài đỏ, quần trắng',
    colorText: 'Chu sa khánh hỷ (đỏ thắm)',
    accessoriesText: 'Nón lá, Hài thêu',
    behaviorTip: 'Mặc áo đỏ đi chúc Tết hay dạo phố đầu xuân; vào nhà ông bà nhớ chào hỏi lễ phép.',
  },
  {
    id: 'tham_quan_di_tich',
    name: 'Tham quan di tích / Chụp cổ phục',
    tagline: 'Giao lĩnh đỏ giữa mái đình cổ kính',
    imageUrl: occGiaoLinh1,
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_giao_linh',
    paletteId: 'chu_sa',
    hairId: 'hair_male_short',
    gender: 'male',
    accessoryIds: ['khan_dong', 'guoc_moc_nam'],
    mainCostumeText: 'Áo giao lĩnh nam',
    colorText: 'Chu sa khánh hỷ',
    accessoriesText: 'Khăn đóng, Guốc mộc nam',
    behaviorTip: 'Hỏi ban quản lý trước khi chụp; không trèo lên bệ thờ hay chạm vào hiện vật.',
  },
  {
    id: 'nang_tho_thu_ha_noi',
    name: 'Nàng thơ thu Hà Nội',
    tagline: 'Hồ Gươm, lá vàng và tà áo pastel',
    imageUrl: occAoDai2,
    authorCredit: 'Nguyên Anh Photography',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_dai_tan_thoi',
    paletteId: 'hong_phan',
    hairId: 'hair_female_long_side',
    gender: 'female',
    accessoryIds: ['tui_may_tre', 'giay_bup_be'],
    mainCostumeText: 'Áo dài hồng pastel, quần trắng',
    colorText: 'Hồng phấn nàng thơ',
    accessoriesText: 'Túi mây tre, Giày búp bê',
    behaviorTip: 'Chụp ảnh quanh Hồ Gươm nên đi sáng sớm, nhường lối cho người đi bộ.',
  },
  {
    id: 'le_chua_dau_nam',
    name: 'Đi lễ chùa đầu năm',
    tagline: 'Ngũ thân thanh nhã ngày đầu xuân',
    imageUrl: occNguThanLeChua,
    imagePosition: 'center 30%',
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ngu_than',
    paletteId: 'tim_hue',
    hairId: 'hair_male_short',
    gender: 'male',
    accessoryIds: ['quat_thu_phap', 'hai_vai_nam'],
    mainCostumeText: 'Áo ngũ thân lập lĩnh, quần trắng',
    colorText: 'Tím mộng kinh kỳ',
    accessoriesText: 'Quạt thư pháp, Hài vải',
    behaviorTip: 'Ăn mặc kín đáo, nói khẽ; xếp hàng thắp hương, không chen lấn hay rải tiền lẻ.',
  },
  {
    id: 'hoi_lang_kinh_bac',
    name: 'Đi hội làng (Kinh Bắc)',
    tagline: 'Duyên quê thuần khiết đượm tình Quan họ',
    imageUrl: occTuThan1,
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_tu_than',
    paletteId: 'den_quan_ho',
    hairId: 'hair_female_long',
    gender: 'female',
    accessoryIds: ['khan_van', 'non_quai_thao', 'hai_theu'],
    mainCostumeText: 'Áo tứ thân đen, yếm đỏ, váy đen',
    colorText: 'Đen tuyền, thắt lưng xanh hồng',
    accessoriesText: 'Khăn vấn, Nón quai thao, Hài thêu',
    behaviorTip: 'Giữ vẻ ý nhị, lời ăn tiếng nói nền nã khi trẩy hội đình làng miền Quan họ.',
  },
  {
    id: 'an_hoi_co_dau',
    name: 'Lễ ăn hỏi / Cô dâu',
    tagline: 'Nhật bình hồng, mấn vành ngày vu quy',
    imageUrl: occNhatBinh1,
    authorCredit: 'Ảnh sưu tầm',
    license: 'Ảnh minh hoạ',
    source: '',
    costumeId: 'ao_nhat_binh',
    paletteId: 'sen_hong',
    hairId: 'hair_female_bun',
    gender: 'female',
    accessoryIds: ['man_doi_dau', 'chuoi_ngoc', 'hai_theu'],
    mainCostumeText: 'Áo nhật bình, mấn (khăn vành)',
    colorText: 'Sen hồng ngọc nữ',
    accessoriesText: 'Mấn, Chuỗi ngọc, Hài thêu',
    behaviorTip: 'Cô dâu bước ra chào họ nhà trai khi được mời; đi chậm, giữ tà áo gọn gàng.',
  },
];

/**
 * Tính điểm Bản sắc % và Remix % chuẩn 100%:
 * - Món cổ truyền = 0 điểm remix
 * - Món hiện đại (sneaker, kính râm, tai nghe, túi tote, mũ beret) = điểm dương
 * - Màu hiện đại (huyen_den) = điểm dương
 * - Tóc vùng remix = điểm dương
 * - Remix % = (tổng điểm / điểm tối đa có thể đạt) * 60, làm tròn số nguyên
 * - Vì vùng lõi luôn khóa, Remix tối đa chỉ được 60%, tức Bản sắc không bao giờ dưới 40%
 * - Bản sắc % = 100 - Remix %
 */
export function calculateIdentityRemixScore(
  accessories: AccessoryItem[],
  hair: HairstyleItem,
  palette: ColorPalette
): {
  identityPercent: number;
  remixPercent: number;
  currentRemixPoints: number;
  maxRemixPoints: number;
} {
  let points = 0;

  // 1. Phụ kiện hiện đại trong vùng remix
  accessories.forEach((acc) => {
    if (acc.type === 'modern') {
      if (acc.id === 'sneaker') points += 14;
      else if (acc.id === 'over_ear_headphones') points += 14;
      else if (acc.id === 'sunglasses') points += 10;
      else if (acc.id === 'tote_bag') points += 10;
      else if (acc.id === 'beret_hat') points += 10;
      else points += 10;
    }
  });

  // 2. Kiểu tóc vùng remix
  if (hair.traditionType === 'vung_remix') {
    points += 6;
  }

  // 3. Màu sắc hiện đại
  if (palette.id === 'huyen_den') {
    points += 6;
  }

  // Tổng điểm tối đa nếu chọn sneaker (14) + tai nghe (14) + kính (10) + túi (10) + tóc remix (6) + màu đen (6) = 60
  const maxRemixPoints = 60;

  // Tỉ lệ Remix tối đa 60%
  const rawRemixPercent = Math.round((points / maxRemixPoints) * 60);
  const remixPercent = Math.min(60, Math.max(0, rawRemixPercent));
  const identityPercent = 100 - remixPercent;

  return {
    identityPercent,
    remixPercent,
    currentRemixPoints: points,
    maxRemixPoints,
  };
}

// Các quy tắc kiểm tra độ hòa hợp văn hóa (Cultural Harmony Rules)
export const CULTURAL_RULES: CulturalRule[] = [
  {
    id: 'ngu_than_sneaker',
    costumeId: 'ngu_than',
    requiredAccessories: ['sneaker'],
    severity: 'warning',
    title: 'Lưu ý khi phối Áo Ngũ Thân & Sneaker',
    message: 'Áo ngũ thân nguyên bản thường được đi kèm với hài thêu hoặc guốc mộc để giữ chuẩn form dáng khoan thai truyền thống. Phối cùng Sneaker tạo visual phá cách đường phố, nhưng không nên mặc khi vào chốn tế tự trang nghiêm!',
    tip: 'Hãy đổi sang hài thêu hoặc guốc mộc để giữ trọn vẹn nét chuẩn mực truyền thống nhé.'
  },
  {
    id: 'ao_tac_sneaker_warning',
    costumeId: 'ao_tac',
    requiredAccessories: ['sneaker'],
    severity: 'warning',
    title: 'Cẩn trọng với Áo Tấc (Đại Lễ Phục)',
    message: 'Áo tấc là lễ phục trang trọng bậc nhất thời Nguyễn, thường dùng trong tế bái tổ tiên và đại hôn. Mang sneaker với áo tấc tạo visual "thời đại số" rất vui mắt nhưng không nên mặc vào các nghi lễ tâm linh!',
    tip: 'Nếu chụp lookbook kỷ yếu thì combo này cực kỳ viral, nhưng hãy tôn trọng không gian nghi lễ nhé bạn trẻ.'
  },
  {
    id: 'ao_tac_sunglasses',
    costumeId: 'ao_tac',
    requiredAccessories: ['sunglasses'],
    severity: 'info',
    title: 'Vibe "Quan Lại Gen Z" cực ngầu!',
    message: 'Kính râm kết hợp áo tấc tay thụng tạo cảm giác như một bức ảnh xuyên không giữa thế kỷ 19 và 21.',
    tip: 'Kính râm gọng tròn đen cổ điển thời Nguyễn cuối thế kỷ 19 thực ra từng được nhiều quan lại trí thức ưa chuộng đấy!'
  },
  {
    id: 'headphones_man',
    requiredAccessories: ['over_ear_headphones'],
    requiredAnyAccessories: ['khan_van', 'khan_dong', 'man_doi_dau'],
    severity: 'warning',
    title: 'Chú ý kết cấu Khăn Vấn / Khăn Đóng',
    message: 'Đeo tai nghe over-ear cồng kềnh có thể ép chặt làm biến dạng hoặc xô lệch các nếp khăn đóng, khăn vấn truyền thống.',
    tip: 'Bạn có thể đeo tai nghe hờ quanh cổ áo lập lĩnh, vừa khoe trọn chi tiết khăn đầu vừa trông rất high-fashion.'
  },
  {
    id: 'tu_than_perfect',
    costumeId: 'ao_tu_than',
    requiredAccessories: ['hai_theu', 'quat_giay'],
    severity: 'celebrate',
    title: '10/10 Chuẩn Nét Kinh Bắc Xưa!',
    message: 'Bộ trang phục mang đậm hồn sắc dân ca quan họ Bắc Ninh. Guốc mộc gõ nhịp kết hợp quạt giấy lụa tạo nên một tổng thể vô cùng duyên dáng.',
    tip: 'Một chiếc nón quai thao đi kèm sẽ biến bạn thành cô Tấm đích thực trong ngày hội mùa xuân.'
  },
  {
    id: 'ao_dai_streetwear_combo',
    costumeId: 'ao_dai_tan_thoi',
    requiredAccessories: ['sneaker', 'tote_bag'],
    eventId: 'streetwear',
    severity: 'celebrate',
    title: 'Nàng Thơ Dạo Phố Cực Dễ Thương!',
    message: 'Đây là outfit biểu tượng của nữ sinh Việt Nam hiện đại: dịu dàng tà áo dài nhưng đôi chân sneaker bước thoăn thoắt năng động trên phố.',
    tip: 'Túi tote canvas đựng vừa sách vở và bình nước cá nhân, đúng chuẩn combo sống xanh của Gen Z.'
  },
  {
    id: 'tet_respect',
    eventId: 'tet',
    requiredAccessories: ['over_ear_headphones', 'sunglasses'],
    severity: 'info',
    title: 'Lưu ý khi đi chúc Tết họ hàng',
    message: 'Khi vào nhà chúc Tết ông bà hay thắp hương tổ tiên ngày mùng 1, đừng quên tháo tai nghe và kính râm để thể hiện sự cung kính trọn vẹn nhé.',
    tip: 'Người lớn tuổi rất thích nhìn thấy gương mặt rạng rỡ và ánh mắt tươi vui của bạn khi nhận lì xì!'
  },
  {
    id: 'dep_to_ong_ngu_than',
    costumeId: 'ngu_than',
    requiredAccessories: ['dep_to_ong'],
    severity: 'warning',
    title: 'Dép tổ ong đi cùng Áo Ngũ Thân?',
    message: 'Dép tổ ong là món đồ bình dân, hoài niệm rất Gen Z, nhưng Áo Ngũ Thân là trang phục trang trọng. Phối thế này vui khi chụp ảnh concept, không nên mặc khi đi lễ hay dự nghi thức.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để bộ đồ giữ đúng chuẩn mực.'
  },
  {
    id: 'dep_suc_ngu_than',
    costumeId: 'ngu_than',
    requiredAccessories: ['dep_suc'],
    severity: 'warning',
    title: 'Dép sục nhựa đi cùng Áo Ngũ Thân?',
    message: 'Dép sục nhựa hợp đi chơi, đi biển, còn Áo Ngũ Thân là trang phục trang trọng. Combo này chỉ hợp ảnh vui, không hợp dịp lễ.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để giữ nét trang nghiêm.'
  },
  {
    id: 'dep_to_ong_ao_tac',
    costumeId: 'ao_tac',
    requiredAccessories: ['dep_to_ong'],
    severity: 'warning',
    title: 'Dép tổ ong đi cùng Áo Tấc?',
    message: 'Dép tổ ong là món đồ bình dân, hoài niệm rất Gen Z, nhưng Áo Tấc là trang phục trang trọng. Phối thế này vui khi chụp ảnh concept, không nên mặc khi đi lễ hay dự nghi thức.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để bộ đồ giữ đúng chuẩn mực.'
  },
  {
    id: 'dep_suc_ao_tac',
    costumeId: 'ao_tac',
    requiredAccessories: ['dep_suc'],
    severity: 'warning',
    title: 'Dép sục nhựa đi cùng Áo Tấc?',
    message: 'Dép sục nhựa hợp đi chơi, đi biển, còn Áo Tấc là trang phục trang trọng. Combo này chỉ hợp ảnh vui, không hợp dịp lễ.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để giữ nét trang nghiêm.'
  },
  {
    id: 'dep_to_ong_ao_nhat_binh',
    costumeId: 'ao_nhat_binh',
    requiredAccessories: ['dep_to_ong'],
    severity: 'warning',
    title: 'Dép tổ ong đi cùng Áo Nhật Bình?',
    message: 'Dép tổ ong là món đồ bình dân, hoài niệm rất Gen Z, nhưng Áo Nhật Bình là trang phục trang trọng. Phối thế này vui khi chụp ảnh concept, không nên mặc khi đi lễ hay dự nghi thức.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để bộ đồ giữ đúng chuẩn mực.'
  },
  {
    id: 'dep_suc_ao_nhat_binh',
    costumeId: 'ao_nhat_binh',
    requiredAccessories: ['dep_suc'],
    severity: 'warning',
    title: 'Dép sục nhựa đi cùng Áo Nhật Bình?',
    message: 'Dép sục nhựa hợp đi chơi, đi biển, còn Áo Nhật Bình là trang phục trang trọng. Combo này chỉ hợp ảnh vui, không hợp dịp lễ.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để giữ nét trang nghiêm.'
  },
  {
    id: 'dep_to_ong_ao_giao_linh',
    costumeId: 'ao_giao_linh',
    requiredAccessories: ['dep_to_ong'],
    severity: 'warning',
    title: 'Dép tổ ong đi cùng Áo Giao Lĩnh?',
    message: 'Dép tổ ong là món đồ bình dân, hoài niệm rất Gen Z, nhưng Áo Giao Lĩnh là trang phục trang trọng. Phối thế này vui khi chụp ảnh concept, không nên mặc khi đi lễ hay dự nghi thức.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để bộ đồ giữ đúng chuẩn mực.'
  },
  {
    id: 'dep_suc_ao_giao_linh',
    costumeId: 'ao_giao_linh',
    requiredAccessories: ['dep_suc'],
    severity: 'warning',
    title: 'Dép sục nhựa đi cùng Áo Giao Lĩnh?',
    message: 'Dép sục nhựa hợp đi chơi, đi biển, còn Áo Giao Lĩnh là trang phục trang trọng. Combo này chỉ hợp ảnh vui, không hợp dịp lễ.',
    tip: 'Đổi sang hài thêu hoặc guốc mộc để giữ nét trang nghiêm.'
  },
  {
    id: 'cao_got_ao_nhat_binh',
    costumeId: 'ao_nhat_binh',
    requiredAccessories: ['cao_got_quai'],
    severity: 'info',
    title: 'Cao gót với Áo Nhật Bình',
    message: 'Áo Nhật Bình xưa đi cùng hài hoặc guốc đế thấp. Cao gót quai mảnh hợp áo dài tân thời hơn.',
    tip: 'Thử hài thêu hoặc guốc mộc nữ cho đúng dáng.'
  },
  {
    id: 'cao_got_ao_tac',
    costumeId: 'ao_tac',
    requiredAccessories: ['cao_got_quai'],
    severity: 'info',
    title: 'Cao gót với Áo Tấc',
    message: 'Áo Tấc xưa đi cùng hài hoặc guốc đế thấp. Cao gót quai mảnh hợp áo dài tân thời hơn.',
    tip: 'Thử hài thêu hoặc guốc mộc nữ cho đúng dáng.'
  },
  {
    id: 'cao_got_ao_tu_than',
    costumeId: 'ao_tu_than',
    requiredAccessories: ['cao_got_quai'],
    severity: 'info',
    title: 'Cao gót với Áo Tứ Thân',
    message: 'Áo Tứ Thân xưa đi cùng hài hoặc guốc đế thấp. Cao gót quai mảnh hợp áo dài tân thời hơn.',
    tip: 'Thử hài thêu hoặc guốc mộc nữ cho đúng dáng.'
  },
  {
    id: 'giay_bup_be_ao_nhat_binh',
    costumeId: 'ao_nhat_binh',
    requiredAccessories: ['giay_bup_be'],
    severity: 'info',
    title: 'Giày búp bê với Áo Nhật Bình',
    message: 'Áo nhật bình là lễ phục cung đình, thường đi cùng hài thêu. Giày búp bê hợp áo dài đi học hơn.',
    tip: 'Đổi sang hài thêu hoặc hài cườm cho đồng bộ.'
  },
  {
    id: 'dep_to_ong_ao_tu_than',
    costumeId: 'ao_tu_than',
    requiredAccessories: ['dep_to_ong'],
    severity: 'info',
    title: 'Tứ thân + dép tổ ong',
    message: 'Một combo "làng quê remix" khá vui, nhưng áo tứ thân đi hội thường đi cùng guốc mộc.',
    tip: 'Muốn chuẩn hơn thì đổi sang guốc mộc nữ.'
  },
];

// Danh sách tên Lookbook ngẫu nhiên gợi ý
export const LOOKBOOK_NAMES = [
  'Nàng Thơ Gen Z',
  'Sĩ Tử Thời @',
  'Kinh Kỳ Cyberpunk',
  'Phố Cổ Y2K',
  'Hương Sắc Tân Thời',
  'Quan Họ Phố Lên Đèn',
  'Ngũ Thân Dạo Phố',
  'Trâm Anh Hiện Đại',
  'Vương Giả Retro',
  'Thiếu Niên Đông Dương',
  'Bách Hoa Du Ngoạn',
  'Thanh Xuân Di Sản'
];

export interface LookbookSavedItem {
  id: string;
  name: string;
  createdAt: string;
  eventId: string;
  costumeId: string;
  accessoryIds: string[];
  paletteId: string;
  gender: 'female' | 'male';
  traditionalScore: number;
  modernScore: number;
}
