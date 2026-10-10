// Ảnh người mặc thật (file ở thư mục gốc dự án)
import tuThanHoaMinzy from '../../tu-than-hoa-minzy-1.jpg';
import aoTacNam2 from '../../ao-tac-nam-2.jpg';
import aoTacNam3 from '../../ao-tac-nam-3.jpg';
import nguThanRong3 from '../../ngu-than-rong-3.jpg';
import nguThanLeChua from '../../ngu-than-nam-le-chua.jpg';
import nguThanNu1 from '../../ngu-than-nu-1.jpg';
import nguThanNam1 from '../../ngu-than-nam-1.jpg';
import nguThanNu2 from '../../ngu-than-nu-2.jpg';
import aoTacNu1 from '../../ao-tac-nu-1.jpg';
import aoTacNam1 from '../../ao-tac-nam-1.jpg';
import aoTacNu2 from '../../ao-tac-nu-2.jpg';
import aoDai1 from '../../ao-dai-1.jpg';
import aoDai2 from '../../ao-dai-2.jpg';
import aoDai3 from '../../ao-dai-3.jpg';
import tuThan1 from '../../tu-than-1.jpg';
import nhatBinh1 from '../../nhat-binh-1.jpg';
import nhatBinh2 from '../../nhat-binh-2.jpg';
import nhatBinh3 from '../../nhat-binh-3.jpg';
import giaoLinh1 from '../../giao-linh-1.jpg';
import giaoLinh2 from '../../giao-linh-2.jpg';
import giaoLinh3 from '../../giao-linh-3.jpg';
import nguThanRong1 from '../../ngu-than-rong-1.jpg';
import nguThanRong2 from '../../ngu-than-rong-2.jpg';

// Kiến thức cho thẻ thông tin khi bấm vào từng món trong "Bảng phối".
// Nội dung đã kiểm chứng nguồn — KHÔNG tự sửa câu chữ.

export interface KnowledgeSource {
  label: string;
  url: string;
}

export interface ItemKnowledge {
  /** nhãn thời kỳ ngắn hiện trên chip, để trống nếu là đồ hiện đại */
  era?: string;
  period?: string;      // Thời kỳ
  identify: string;     // Nhận diện
  useWhen: string;      // Dùng khi
  funFact?: string;     // Bạn có biết?
  styleTip?: string;    // Mẹo phối (chỉ đồ hiện đại)
  sources?: KnowledgeSource[];
  /** ảnh người mặc thật — để trống, sẽ thêm sau. Không có ảnh thì ẩn cột ảnh */
  images?: { src: string; credit: string }[];
}

export const ITEM_KNOWLEDGE: Record<string, ItemKnowledge> = {
  // ===== TRANG PHỤC =====
  ngu_than: {
    era: 'Thế kỷ 18',
    period: 'Phổ biến từ thời các chúa Nguyễn (thế kỷ 18), thường được gắn với cải cách y phục năm 1744.',
    identify: 'Cổ đứng, may từ 5 thân (4 thân ngoài, 1 thân con), khuy cài chéo sang nách phải.',
    useWhen: 'Dự tiệc, lễ Tết hoặc dạo phố.',
    funFact: 'Tương truyền 5 thân áo tượng trưng tứ thân phụ mẫu và bản thân, 5 khuy là ngũ thường.',
    sources: [
      { label: 'Báo Pháp luật', url: 'https://baophapluat.vn/su-tro-lai-ngoan-muc-cua-ao-dai-ngu-than-post384250.html' },
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/%C3%81o_d%C3%A0i' },
    ],
    images: [
     { src: nguThanLeChua, credit: "Ảnh sưu tầm" },
      { src: nguThanNam1, credit: "Nguyên Anh Photography" },
      { src: nguThanNu2, credit: "Nguyên Anh Photography" },
       { src: nguThanNu1, credit: "Harmony Studio" },
    ],
  },
  ao_tac: {
    era: 'Thế kỷ 18',
    period: 'Ra đời cùng thời kỳ cải cách y phục Đàng Trong vào thế kỷ 18.',
    identify: 'Cấu trúc giống áo ngũ thân nhưng ống tay may thụng, rộng rủ xuống che kín tay.',
    useWhen: 'Mặc trong các dịp tế lễ, dâng hương hoặc nghi thức trọng đại.',
    funFact: 'Theo cách hiểu phổ biến, tên "áo tấc" xuất phát từ phần viền tay áo rộng khoảng một tấc.',
    sources: [
      { label: 'Vietcetera', url: 'https://vietcetera.com/amp/en/viet-phuc-elegant-and-symbolic-vietnamese-costumes-besides-ao-dai' },
    ],
    images: [
      { src: aoTacNu1, credit: "V'style – Việt Cổ Phục" },
      { src: aoTacNam1, credit: "Ảnh sưu tầm" },
      { src: aoTacNu2, credit: "V'style – Việt Cổ Phục" },
      { src: aoTacNam2, credit: "Ảnh sưu tầm" },
      { src: aoTacNam3, credit: "Studio Lương Huyền" },
    ],
  },
  ao_dai_tan_thoi: {
    era: 'Thập niên 1930',
    period: 'Xuất hiện thập niên 1930 do họa sĩ Nguyễn Cát Tường (Lemur) sáng tạo.',
    identify: 'Áo ôm sát cơ thể, cổ khoét rộng, tay phồng, có viền ren.',
    useWhen: 'Mặc chụp ảnh hoài cổ, dạo phố hoặc dự tiệc tân thời.',
    funFact: 'Đây là thiết kế mạnh dạn loại bỏ dáng áo rộng để tôn lên đường cong tự nhiên của phụ nữ.',
    sources: [
      { label: 'Việt Nam News', url: 'https://vietnamnews.vn/sunday/features/482405/book-exploring-modern-ao-dai-published.html' },
      { label: 'Tạp chí Công Thương', url: 'https://tapchicongthuong.vn/tram-nam-bien-tau-ao-dai-viet-nam-44643.htm' },
    ],
    images: [
      { src: aoDai3, credit: "Ảnh sưu tầm" },
      { src: aoDai2, credit: "Nguyên Anh Photography" },
      { src: aoDai1, credit: "Ảnh sưu tầm" },
      
    ],
  },
  ao_tu_than: {
    era: 'Lâu đời',
    period: 'Trang phục lâu đời, có từ trước áo ngũ thân, gắn với phụ nữ Bắc Bộ.',
    identify: 'Áo gồm 4 mảnh vải, vạt trước buông thõng hoặc thắt múi, mặc kèm yếm và váy đụp.',
    useWhen: 'Biểu diễn văn nghệ, dự hội làng hoặc chụp ảnh nghệ thuật.',
    funFact: 'Liền chị quan họ thường mặc nhiều lớp áo chồng lên nhau khi đi hát hội.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/%C3%81o_t%E1%BB%A9_th%C3%A2n' },
      { label: 'Báo Văn Hóa', url: 'https://baovanhoa.vn/van-hoa/duyen-dang-trang-phuc-quan-ho-bac-ninh-100761.html' },
    ],
    images: [
      { src: tuThan1, credit: "Ảnh sưu tầm" },
      { src: tuThanHoaMinzy, credit: "Hòa Minzy" },
    ],
  },
  ao_nhat_binh: {
    era: 'Thời Nguyễn',
    period: 'Theo cách hiểu phổ biến, áo được định chế chính thức vào năm 1807 thời vua Gia Long.',
    identify: 'Hai vạt trước đối nhau, cổ áo bản to tạo thành hình vuông lớn trước ngực.',
    useWhen: 'Trang phục cưới hỏi truyền thống hoặc chụp ảnh hóa thân hoàng cung.',
    funFact: 'Hoa văn và màu sắc trên áo từng được quy định khắt khe để phân biệt các bậc trong cung.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/%C3%81o_nh%E1%BA%ADt_b%C3%ACnh' },
      { label: 'Việt Nam News', url: 'https://vietnamnews.vn/life-style/1717359/nhat-binh-long-dress-viet-nam-s-cultural-ambassador-in-us.html' },
    ],
    images: [
      { src: nhatBinh1, credit: "Ảnh sưu tầm" },
      { src: nhatBinh2, credit: "ANP Studio" },
      { src: nhatBinh3, credit: "Việt Phục Hoàng Thành" },
    ],
  },
  ao_giao_linh: {
    era: 'Thời Lê',
    period: 'Phổ biến qua nhiều triều đại, đặc biệt thời Lê; ở Đàng Trong bị thay từ năm 1744.',
    identify: 'Áo phom rộng, cổ khoét hình chữ V, vạt áo đắp chéo nhau sang bên phải.',
    useWhen: 'Tham gia lễ hội cổ truyền, tế lễ hoặc hóa trang nhân vật lịch sử.',
    funFact: 'Áo giao lĩnh từng là kiểu trang phục phổ thông cho cả quan lại lẫn thường dân người Việt.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/%C3%81o_giao_l%C4%A9nh' },
      { label: 'Nhân Dân', url: 'https://nhandan.vn/tai-hien-nghi-le-thoi-le-trung-hung-post361051.html' },
    ],
    images: [
      { src: giaoLinh1, credit: "Ảnh sưu tầm" },
      { src: giaoLinh2, credit: "Ảnh sưu tầm" },
      { src: giaoLinh3, credit: "Cổ Trang Hoàng Cung" },
    ],
  },
  ngu_than_nam: {
    era: 'Thời Nguyễn',
    period: 'Phổ biến từ thời chúa Nguyễn; đời Minh Mạng được áp dụng ra cả Bắc Hà.',
    identify: 'Cổ đứng, 5 khuy cài chéo sang nách phải, phom rộng, xẻ tà hai bên.',
    useWhen: 'Làm lễ phục cưới hỏi, ngoại giao hoặc sự kiện văn hóa.',
    funFact: 'Sử liệu năm 1744 chỉ ghi lệnh mặc "áo ngắn, hẹp tay", nên chuyện chúa Nguyễn "khai sinh áo dài" vẫn còn tranh luận.',
    sources: [
      { label: 'Tuổi Trẻ', url: 'https://tuoitre.vn/co-dung-la-chua-nguyen-phuc-khoat-khai-sinh-ao-dai-viet-nam-20200726213306063.htm' },
      { label: 'Báo Pháp luật', url: 'https://baophapluat.vn/su-tro-lai-ngoan-muc-cua-ao-dai-ngu-than-post384250.html' },
    ],
    images: [
      { src: nguThanRong1, credit: "Harmony Studio" },
      { src: nguThanRong2, credit: "Ảnh sưu tầm" },
      { src: nguThanRong3, credit: "Harper's Bazaar Vietnam" },
    ],
  },

  non_quai_thao: {
    era: 'Bắc Bộ xưa',
    period: 'Nón thúng quai thao (còn gọi nón ba tầm) là nón của phụ nữ Bắc Bộ xưa; thế kỷ 20 được thu gọn lại cho liền chị Quan họ biểu diễn.',
    identify: 'Mặt nón phẳng như cái thúng, vành rộng chừng 70–80 cm, lòng nón có vành khua để đội; quai thao là những sợi tơ lụa nhiều màu buông thành tua.',
    useWhen: 'Đi hội làng, hát Quan họ, chụp ảnh áo tứ thân ở đình làng; ngày nay hay cầm tay hoặc đeo sau lưng khi tạo dáng.',
    funFact: 'Tên "quai thao" lấy từ sợi thao (tơ lụa) làm quai, đẹp đến mức người ta gọi luôn cả chiếc nón theo tên quai.',
    sources: [
      { label: 'Wikipedia (Ba tầm)', url: 'https://en.wikipedia.org/wiki/Ba_t%E1%BA%A7m' },
      { label: 'VinWonders – Quan họ Bắc Ninh', url: 'https://vinwonders.com/vi/wonderpedia/news/quan-ho-bac-ninh/' },
    ],
    images: [
      { src: tuThan1, credit: "Ảnh sưu tầm" },
    ],
  },

  // ===== KIỂU TÓC =====
  hair_male_topknot: {
    era: 'Thời Lê – Nguyễn',
    period: 'Thời Lê – Nguyễn, nam giới để tóc dài búi tó theo quan niệm Nho giáo.',
    identify: 'Tóc dài được búi gọn thành cục tròn phía sau gáy hoặc đỉnh đầu.',
    useWhen: 'Đội cùng khăn xếp và mặc áo ngũ thân nam.',
    funFact: 'Búi tóc nằm gọn bên trong, nên khi đội khăn xếp lên thì gần như không nhìn thấy.',
  },
  hair_female_bun: {
    era: 'Truyền thống',
    period: 'Kiểu tóc truyền thống của phụ nữ Việt qua nhiều triều đại.',
    identify: 'Tóc búi cao hoặc búi trễ, được giữ chặt bằng một chiếc trâm cài.',
    useWhen: 'Mặc trang phục hoàng cung, áo nhật bình hoặc đi dự yến tiệc.',
    funFact: 'Trâm cài không chỉ giữ tóc mà còn là món trang sức, trâm quý tộc được chạm khắc rất tinh xảo.',
    sources: [
      { label: 'Dân Trí', url: 'https://dantri.com.vn/van-hoa/tinh-xao-trang-suc-co-viet-nam-1430875425.htm' },
    ],
  },
  hair_female_long: {
    identify: 'Mái tóc đen nhánh để buông xõa tự nhiên, suôn mượt.',
    useWhen: 'Kết hợp với áo dài tân thời hoặc trang phục dạo phố.',
  },
  hair_female_long_side: {
    identify: 'Tóc dài được vén gọn và để buông rủ sang một bên bờ vai.',
    useWhen: 'Tạo dáng chụp ảnh điệu đà cùng y phục cổ.',
  },
  hair_male_short: {
    identify: 'Tóc cắt ngắn gọn gàng, chải vuốt lịch sự.',
    useWhen: 'Kết hợp linh hoạt từ áo sơ mi đến áo cổ phục.',
  },
  hair_male_comma: {
    identify: 'Phần tóc mái uốn cong rủ chéo trán như dấu phẩy.',
    useWhen: 'Phối cùng trang phục năng động hoặc dạo phố.',
  },
  hair_male_curtain: {
    identify: 'Tóc chia đều sang hai bên, trông lãng tử và thư sinh.',
    useWhen: 'Hợp với nhiều loại trang phục từ cổ điển đến hiện đại.',
  },
  hair_male_crew: {
    identify: 'Tóc cắt ngắn đều, dựng nhẹ trên đỉnh, gọn gàng và khỏe khoắn.',
    useWhen: 'Mặc đồ thể thao, dạo phố hoặc khi cần sự năng động.',
  },

  // ===== PHỤ KIỆN TRUYỀN THỐNG =====
  khan_dong: {
    era: 'Thập niên 1930',
    period: 'Phát triển từ khăn quấn tay, trở thành khăn làm sẵn phổ biến khoảng thập niên 1930.',
    identify: 'Khối tròn cứng bọc vải đen, xếp nhiều lớp nếp gấp đều đặn, dành cho nam.',
    useWhen: 'Đội cùng áo ngũ thân nam, áo tấc trong dịp cưới hỏi, lễ Tết.',
    funFact: 'Thôn Giáp Nhất (Nam Định) là một trong số ít làng còn giữ nghề làm khăn xếp ở miền Bắc.',
    sources: [
      { label: 'Thể thao & Văn hóa', url: 'https://thethaovanhoa.vn/di-tim-quoc-phuc-nam-truyen-thong-ky-3-ao-dai-nam-phai-di-voi-khan-gi-20200303083203350.htm' },
      { label: 'Tạp chí Công Thương', url: 'https://tapchicongthuong.vn/lang-nghe-khan-xep-doc-nhat-viet-nam-44770.htm' },
    ],
  },
  khan_van: {
    era: 'Thế kỷ 18',
    period: 'Phổ biến từ thế kỷ 18, khi phụ nữ để tóc dài. Ở Bắc Bộ thường gọi là khăn lươn hay khăn rí.',
    identify: 'Dải nhung hoặc lụa cuộn tròn như con lươn (bên trong độn tóc), quấn 1–2 vòng ôm sát đầu như chiếc băng đô dày; vẫn lộ chỏm tóc phía trên.',
    useWhen: 'Mặc thường ngày hoặc đi hội cùng áo tứ thân, áo ngũ thân.',
    funFact: 'Khăn vấn khác mấn ở chỗ: khăn vấn là dải nhỏ ôm sát tóc, quấn tay mỗi lần đội; mấn là vành to tròn như chiếc đĩa, trang trọng hơn. Phụ nữ Bắc Bộ còn trùm khăn mỏ quạ ra ngoài khăn vấn.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Kh%C4%83n_v%E1%BA%A5n' },
      { label: 'Thể thao & Văn hóa', url: 'https://thethaovanhoa.vn/khan-doi-dau-20130204164008910.htm' },
    ],
  },
  man_doi_dau: {
    era: 'Thời Nguyễn',
    period: 'Còn gọi là khăn vành hay khăn mấn, gốc từ khăn vành của phụ nữ quý tộc, cung đình Huế thời Nguyễn.',
    identify: 'Vành khăn bản to, dày, nhiều vòng quấn đều nhau thành hình tròn như chiếc đĩa quanh đầu; nay thường may sẵn, chỉ cần đặt lên đầu.',
    useWhen: 'Đội cùng áo dài cưới, áo nhật bình trong lễ cưới, lễ Tết và dịp trang trọng.',
    funFact: 'Mấn, khăn vành, khăn mấn là cùng một món. Khác khăn vấn: mấn là vành to, cứng, nhìn từ phía trước như vầng tròn quanh đầu; khăn vấn chỉ là dải nhỏ ôm sát tóc.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Kh%C4%83n_v%E1%BA%A5n' },
      { label: 'Đáng Nhớ', url: 'https://dangnho.com/doi-song/ky-su/nhung-chiec-khan-van-cu%CC%89a-nguoi-vie%CC%A3t.html' },
    ],
  },
  tram_cai_toc: {
    era: 'Thời Nguyễn',
    period: 'Phụ kiện của phụ nữ nhiều thời; bảo tàng Huế còn lưu trâm vàng thời Nguyễn.',
    identify: 'Thanh dài bằng gỗ, sừng, bạc hoặc vàng, đầu trâm chạm khắc hoa lá tinh xảo.',
    useWhen: 'Cố định búi tóc khi mặc y phục cổ, tăng vẻ đài các.',
    funFact: 'Với người Thái ở Con Cuông (Nghệ An), cây trâm trên búi tóc cho biết người phụ nữ đã có chồng.',
    sources: [
      { label: 'Dân Trí', url: 'https://dantri.com.vn/van-hoa/tinh-xao-trang-suc-co-viet-nam-1430875425.htm' },
      { label: 'Báo Nghệ An', url: 'https://baonghean.vn/chiec-tram-dau-va-tuc-bui-toc-10020511.html' },
    ],
  },
  non_la: {
    era: 'Hàng trăm năm',
    period: 'Gắn bó với đời sống nông nghiệp Việt Nam qua hàng trăm năm.',
    identify: 'Hình chóp nhọn, khung 16 vòng tre, lợp lá nón, khâu bằng chỉ cước.',
    useWhen: 'Che nắng mưa khi lao động, hoặc làm đạo cụ múa, chụp ảnh nghệ thuật.',
    funFact: 'Nón bài thơ xứ Huế kẹp thơ hoặc tranh giữa 2 lớp lá, soi lên nắng mới thấy.',
    sources: [
      { label: 'VietnamPlus', url: 'https://www.vietnamplus.vn/non-la-lang-chuong-ba-lop-la-16-vong-tre-va-hon-nghe-xu-bac-post1131198.vnp' },
      { label: 'VnExpress', url: 'https://vnexpress.net/lang-nghe-lam-non-hue-2878895.html' },
    ],
  },
  chuoi_ngoc: {
    era: 'Phong kiến',
    period: 'Trang sức quen thuộc của người Việt thời phong kiến.',
    identify: 'Vòng cổ xâu hạt ngọc, hoặc miếng khánh bạc chạm trổ đeo trước ngực.',
    useWhen: 'Phối cùng áo dài, áo nhật bình để tôn vẻ đài các.',
    funFact: 'Nhiều người xưa tin đeo bạc giúp trẻ "tránh gió". Đây là niềm tin dân gian, chưa được khoa học chứng minh.',
    sources: [
      { label: 'VietNamNet', url: 'https://vietnamnet.vn/tre-deo-bac-thuc-hu-chuyen-tranh-gio-149813.html' },
    ],
  },
  quat_giay: {
    era: 'Lâu đời',
    period: 'Có từ lâu đời, làm ở các làng nghề quạt nổi tiếng như Chàng Sơn (Hà Nội).',
    identify: 'Xương quạt bằng tre mỏng, mặt bọc lụa mềm in hoặc vẽ hình hoa lá.',
    useWhen: 'Dùng làm mát, đạo cụ múa hoặc tạo dáng chụp ảnh.',
    funFact: 'Trong chèo, chiếc quạt giúp diễn viên thể hiện cảm xúc và tính cách nhân vật.',
    sources: [
      { label: 'Tạp chí Công Thương', url: 'https://tapchicongthuong.vn/cau-chuyen-ve-nhung-chiec-quat-tay-1653.htm' },
    ],
  },
  quat_thu_phap: {
    era: 'Hơn 200 năm',
    period: 'Làng quạt Chàng Sơn (Hà Nội) đã làm quạt giấy hơn 200 năm.',
    identify: 'Quạt xếp nan tre, mặt dán giấy viết chữ thư pháp mực tàu.',
    useWhen: 'Đạo cụ cầm tay cho nam giới khi mặc áo ngũ thân, áo tấc.',
    funFact: 'Thế kỷ 19, quạt Chàng Sơn từng sang Pháp dự triển lãm ở Paris.',
    sources: [
      { label: 'VietnamPlus', url: 'https://www.vietnamplus.vn/ve-chang-son-tim-hieu-nghe-lam-ra-gio-hon-200-nam-post1127060.vnp' },
      { label: 'Tạp chí Công Thương', url: 'https://tapchicongthuong.vn/quat-giay-chang-son--bao-ton-net-van-hoa-xua-26149.htm' },
    ],
  },
  tui_may_tre: {
    era: 'Hiện đại',
    period: 'Ngày xưa đan làn, giỏ; túi xách mây là sản phẩm thời trang hiện đại.',
    identify: 'Túi xách phom hộp hoặc tròn, đan thủ công từ sợi tự nhiên, có quai xách.',
    useWhen: 'Dạo phố, đi chợ Tết hoặc phối với y phục truyền thống mộc mạc.',
    funFact: 'Làng Phú Vinh (Chương Mỹ, Hà Nội) là "xứ mây" của Hà Nội, làm hơn 500 loại sản phẩm.',
    sources: [
      { label: 'Báo Quốc tế', url: 'https://baoquocte.vn/phu-vinh-soi-may-noi-nhip-the-gioi-409225.html' },
    ],
  },
  hai_theu: {
    era: 'Thế kỷ 17',
    period: 'Ở Thăng Long, nghề làm giày hài tập trung ở phố Hàng Giầy từ thế kỷ 17.',
    identify: 'Giày bọc vải nhung lụa, thêu hoa văn, phần mũi giày uốn cong vểnh lên.',
    useWhen: 'Mang cùng áo nhật bình, áo ngũ thân trong cưới hỏi, lễ Tết.',
    funFact: 'Dân gian thờ tiến sĩ Nguyễn Thời Trung (đỗ năm 1565) làm tổ nghề da giày.',
    sources: [
      { label: 'Mekong ASEAN', url: 'https://mekongasean.vn/hoai-niem-mot-goc-thang-long-on-lai-lich-su-nghe-thu-cong-da-giay-1326.html' },
    ],
  },
  guoc_moc_nam: {
    era: 'Hàng trăm năm',
    period: 'Hiện diện từ hàng trăm năm trước, là vật dụng đi lại quen thuộc của người Việt.',
    identify: 'Đế đẽo từ gỗ nhẹ như vông, xoan; quai ngang bằng da hoặc vải đóng đinh chắc chắn.',
    useWhen: 'Đi lại sinh hoạt hằng ngày, hoặc phối cùng áo tứ thân, áo ngũ thân.',
    funFact: 'Tiếng lộc cộc của guốc mộc từng là âm thanh quen thuộc trên khắp các nẻo đường quê.',
    sources: [
      { label: 'Cổng thông tin Cần Thơ', url: 'https://www.cantho.gov.vn/wps/portal/home/en/detail/about-can-tho/culture-and-beliefs/wooden+clogs+in+the+life+of+southern+vietnamese+people' },
      { label: 'Báo Vĩnh Long', url: 'https://baovinhlong.com.vn/phong-su-ky-su/202307/tieng-dong-guoc-moc-loc-ca-loc-coc-3171108/' },
    ],
  },

  // ===== PHỤ KIỆN HIỆN ĐẠI (không lịch sử, không nguồn) =====
  sneaker: {
    identify: 'Giày thể thao đế cao su êm ái, kiểu dáng trẻ trung.',
    useWhen: 'Đi học, dạo phố năng động hằng ngày.',
    styleTip: 'Hợp áo dài tân thời; tránh đi cùng áo tấc, áo ngũ thân khi vào nơi thờ tự.',
  },
  sunglasses: {
    identify: 'Kính mát gọng nhựa dày, màu sắc sặc sỡ, phom dáng cá tính.',
    useWhen: 'Đi chơi, du lịch hoặc chụp ảnh thời trang đường phố.',
    styleTip: 'Nhớ tháo kính râm khi vào chùa hoặc những nơi trang nghiêm nhé.',
  },
  tote_bag: {
    identify: 'Túi vải bố (canvas) bền, hình chữ nhật rộng, họa tiết tối giản.',
    useWhen: 'Đi học, đi làm hoặc mua sắm thay túi nilon.',
    styleTip: 'Áo dài + sneaker + tote là combo "áo dài đường phố"; tránh phối với áo nhật bình.',
  },
  over_ear_headphones: {
    identify: 'Tai nghe bản to trùm kín vành tai, thiết kế hiện đại.',
    useWhen: 'Nghe nhạc, dạo phố hoặc làm phụ kiện chụp ảnh.',
    styleTip: 'Không đeo khi đang đội khăn vấn, khăn xếp hay mấn vì không hợp với trang phục lễ.',
  },
  beret_hat: {
    identify: 'Mũ tròn, phẳng, mềm bằng dạ hoặc len, không có vành.',
    useWhen: 'Đội vào thu đông, mang vẻ lãng mạn, nghệ sĩ.',
    styleTip: 'Thử đội hơi nghiêng sang một bên; không đội chung với khăn hay nón.',
  },

  // ===== GIÀY DÉP BỔ SUNG =====
  guoc_moc_nu: {
    era: 'Đầu thế kỷ 20',
    period: 'Guốc Sài Gòn có quai đóng đinh xuất hiện năm 1910; sau 1945 guốc thêm nước sơn, nhiều kiểu quai và gót cao.',
    identify: 'Đế gỗ nhẹ, mặt sơn hoặc vẽ hoa, quai ngang bằng nhung, vải hoặc da.',
    useWhen: 'Hợp với áo tứ thân, áo ngũ thân hoặc áo dài khi muốn vẻ dân dã, nữ tính.',
    funFact: 'Đầu thế kỷ 20, phụ nữ Nam Bộ chuộng guốc "ngù ngà": không có quai, chỉ có núm nhỏ kẹp giữa hai ngón chân.',
    sources: [
      { label: 'Cổng thông tin Cần Thơ', url: 'https://www.cantho.gov.vn/wps/portal/home/en/detail/about-can-tho/culture-and-beliefs/wooden+clogs+in+the+life+of+southern+vietnamese+people' },
      { label: 'Báo SGGP', url: 'https://www.sggp.org.vn/xom-guoc-lang-tham-giu-nghe-post841720.html' },
    ],
  },
  hai_cuom: {
    era: 'Truyền thống',
    identify: 'Giày hài mũi kín, đế thấp, mặt vải đính hạt cườm nhiều màu.',
    useWhen: 'Hợp với áo nhật bình, mấn hoặc trang phục cưới truyền thống.',
  },
  giay_bup_be: {
    era: 'Hiện đại',
    period: 'Rose Repetto làm đôi giày búp bê đầu tiên năm 1947; Audrey Hepburn đi kiểu giày này trong phim Funny Face (1957).',
    identify: 'Giày bệt mũi tròn, mềm, ôm chân, lấy cảm hứng từ giày múa ba lê.',
    useWhen: 'Hợp với áo dài tân thời khi đi học, chụp kỷ yếu hoặc cần đi lại nhiều.',
    styleTip: 'Chọn màu nude hoặc cùng tông quần để chân trông dài hơn.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Ballet_flat' },
    ],
  },
  cao_got_quai: {
    era: 'Hiện đại',
    period: 'Giày có gót bắt đầu từ kỵ binh Ba Tư để giữ chân trên bàn đạp; đầu thế kỷ 17, quý tộc nam châu Âu đi cao gót.',
    identify: 'Sandal gót cao, quai mảnh ôm bàn chân và cổ chân.',
    useWhen: 'Hợp với áo dài tân thời khi dự tiệc, lễ Tết hoặc dạo phố.',
    styleTip: 'Chọn quai màu trung tính để tôn tà áo mà không rối mắt; không hợp áo nhật bình, áo tấc.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/High-heeled_shoe' },
      { label: 'VTC News', url: 'https://vtcnews.vn/tet-dien-ao-dai-dung-quen-ket-hop-voi-mau-giay-dep-nay-ar851117.html' },
    ],
  },
  dep_to_ong: {
    era: 'Thập niên 1980–90',
    period: 'Đôi đầu tiên do Xí nghiệp nhựa Hải Phòng sản xuất, nhãn hiệu Tiền Phong; phổ biến ở miền Bắc thập niên 80–90.',
    identify: 'Dép nhựa liền khối, quai nhiều lỗ như tổ ong, thường màu trắng ngà.',
    useWhen: 'Đi trong nhà hoặc dạo phố kiểu hoài niệm; không dùng với lễ phục.',
    funFact: 'Năm 1987, có gia đình phải bán 15 buồng chuối mới đủ tiền mua hai đôi dép tổ ong.',
    sources: [
      { label: 'VTC News', url: 'https://vtcnews.vn/dep-to-ong-niem-tu-hao-mot-thoi-cua-hoc-sinh-mien-bac-gio-ra-sao-ar204535.html' },
      { label: 'Báo Nông nghiệp & Môi trường', url: 'https://nongnghiepmoitruong.vn/dep-to-ong-venh-vang-mot-thoi-d271501.html' },
    ],
  },
  dep_suc: {
    era: 'Hiện đại',
    period: 'Kiểu dép nhựa xốp có lỗ thoáng này ra mắt năm 2002 tại một triển lãm thuyền ở Fort Lauderdale (Mỹ).',
    identify: 'Dép sục nhựa xốp mũi tròn bầu, đế dày, có lỗ thoáng và quai gót.',
    useWhen: 'Đi chơi, dạo phố, đi biển; không dùng với lễ phục.',
    styleTip: 'Hợp quần ống rộng và áo dài cách tân; tránh đi với áo tấc, áo nhật bình.',
    sources: [
      { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Crocs' },
    ],
  },
  giay_tay_nam: {
    era: 'Đầu thế kỷ 20',
    period: 'Thời Pháp thuộc, nhiều đàn ông thành thị mặc áo dài, đội khăn xếp nhưng đi giày da kiểu Tây — một kiểu pha trộn Đông Tây có thật.',
    identify: 'Giày da đen bóng, bọc kín chân, dây buộc trên mu, đế mỏng.',
    useWhen: 'Đi cùng áo ngũ thân, khăn đóng khi dự tiệc, lễ cưới hoặc chụp ảnh phong cách giao thời.',
    styleTip: 'Chọn giày đen trơn, không hoạ tiết để không lấn át áo dài.',
  },
  hai_vai_nam: {
    identify: 'Hài vải đen kiểu xỏ chân, đế trắng dày, mũi bọc da hoặc vải màu vàng nâu.',
    useWhen: 'Đi cùng áo ngũ thân, áo tấc trong lễ Tết, lễ hội, chụp ảnh cổ phục.',
    funFact: 'Đây là dáng hài vải truyền thống được các tiệm cổ phục may lại cho dễ đi; chưa có tư liệu xác định đúng kiểu này thuộc thời kỳ nào.',
  },
};
