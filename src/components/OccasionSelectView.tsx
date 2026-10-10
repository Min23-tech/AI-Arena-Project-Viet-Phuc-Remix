import React, { useState } from 'react';
import { OccasionTemplate, OCCASION_TEMPLATES } from '../data/fashionData';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Info } from 'lucide-react';
import { TiltCard } from './TiltCard';

// Logo mèo của nhóm (ảnh nhúng sẵn, không cần file riêng)
const LOGO_CAT = 'data:image/jpeg;base64,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';

interface OccasionSelectViewProps {
  onSelectTemplate: (template: OccasionTemplate) => void;
  onStartFromScratch: () => void;
  onReplayIntro?: () => void;
}

export const OccasionSelectView: React.FC<OccasionSelectViewProps> = ({
  onSelectTemplate,
  onStartFromScratch,
  onReplayIntro,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF6EE] text-[#2A1E17] flex flex-col overflow-y-auto">
      {/* Top Banner / Navigation */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#8C6D53]/15 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#8C6D53]/30 shadow-xs shrink-0">
            <img src={LOGO_CAT} alt="Logo Việt phục Remix" className="w-full h-full object-cover" draggable={false} />
          </div>
          <div>
            <h1 className="text-base font-bold font-serif text-[#2A1E17] tracking-tight leading-tight">
              Việt phục Remix
            </h1>
            <span className="text-[11px] text-[#8C6D53] font-medium hidden sm:inline">
              Game phối đồ truyền thống & phụ kiện Gen Z
            </span>
          </div>
        </div>

        {/* Nút Xem lại intro & Tự phối từ đầu */}
        <div className="flex items-center gap-2">
          {onReplayIntro && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="px-3 py-1.5 rounded-full bg-[#FAF0E6] hover:bg-[#F3E5D8] text-[#8C2D19] border border-[#8C2D19]/25 text-xs font-semibold shadow-xs transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
              title="Xem lại video mở cổng Ngọ Môn"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C0392B]" />
              <span className="hidden sm:inline">Xem lại intro</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartFromScratch}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white hover:bg-[#FAF0E6] text-[#8C2D19] border border-[#8C2D19]/30 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Tự phối từ đầu</span>
            <ArrowRight className="w-4 h-4 text-[#8C2D19]" />
          </button>
        </div>
      </header>

      {/* Main Title Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#D9AE8A]/40 text-[#8C2D19] text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-[#C0392B]" />
            <span>Màn hình khởi đầu · Chọn bối cảnh</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-[#2A1E17] tracking-tight mb-2.5">
            Hôm nay bạn đi đâu?
          </h2>
          <p className="text-xs sm:text-sm text-[#8C6D53] leading-relaxed">
            Chọn dịp bạn sắp tham gia để bắt đầu với một <strong>bộ mẫu chuẩn di sản</strong>. Bạn hoàn toàn có thể tinh chỉnh tiếp ở <strong>vùng remix</strong> trong khi <strong>vùng lõi</strong> vẫn luôn khóa để bảo tồn vẻ đẹp nguyên bản.
          </p>
        </div>

        {/* 8 DỊP: 5 NỮ + 3 NAM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {OCCASION_TEMPLATES.map((tmpl) => {
            const hasError = imageErrors[tmpl.id];

            return (
              <TiltCard
                key={tmpl.id}
                onClick={() => onSelectTemplate(tmpl)}
                className="group relative bg-[#FFFDF9] rounded-3xl border border-[#8C6D53]/20 hover:border-[#8C2D19] shadow-sm hover:shadow-xl flex flex-col overflow-hidden cursor-pointer"
              >
                {/* 3:4 REAL PHOTO CONTAINER */}
                <div className="relative w-full aspect-[3/4] bg-[#FAF0E6] overflow-hidden">
                  {!hasError ? (
                    <img
                      src={tmpl.imageUrl}
                      alt={tmpl.name}
                      onError={() => handleImageError(tmpl.id)}
                      style={{ objectPosition: tmpl.imagePosition || 'center top' }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    /* Fallback color & pattern on image load error */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#FAF0E6] to-[#EBD5C1] text-[#8C6D53]">
                      <span className="text-4xl mb-2">📸</span>
                      <span className="font-serif font-bold text-sm text-[#8C2D19]">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] text-stone-500 mt-1">Ảnh tư liệu di sản</span>
                    </div>
                  )}

                  {/* Gradient shadow for contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                  {/* Nhãn giới tính */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-xs ${tmpl.gender === 'male' ? 'bg-[#1E3A5F]' : 'bg-[#C0392B]'}`}>
                    {tmpl.gender === 'male' ? 'Nam' : 'Nữ'}
                  </div>

                  {/* Nhãn "Ảnh tham khảo" */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                    Ảnh tham khảo
                  </div>

                  {/* Quick tag on image */}
                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="text-white text-xs font-semibold drop-shadow-md line-clamp-1">
                      {tmpl.tagline}
                    </span>
                  </div>
                </div>

                {/* Ghi công: chỉ hiện khi ảnh có tên tác giả/studio cụ thể; ảnh sưu tầm ghi chung ở chân trang */}

                {/* CARD CONTENT */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
                  <div>
                    {/* Occasion Title */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h3 className="text-base sm:text-lg font-bold font-serif text-[#2A1E17] group-hover:text-[#8C2D19] transition">
                        {tmpl.name}
                      </h3>
                      <span className="w-2 h-2 rounded-full bg-[#8C2D19] shrink-0" />
                    </div>

                    {/* Specification Breakdown */}
                    <div className="space-y-1.5 text-xs text-stone-700 mt-2.5">
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-[#8C2D19] shrink-0">Trang phục:</span>
                        <span className="text-stone-800 line-clamp-1">{tmpl.mainCostumeText}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-[#8C2D19] shrink-0">Màu sắc:</span>
                        <span className="text-stone-800 line-clamp-1">{tmpl.colorText}</span>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="font-bold text-[#8C2D19] shrink-0">Phụ kiện:</span>
                        <span className="text-stone-800 line-clamp-1">{tmpl.accessoriesText}</span>
                      </div>
                    </div>

                    {/* 1 DÒNG GỢI Ý ỨNG XỬ VĂN HÓA */}
                    <div className="mt-3 p-2.5 rounded-xl bg-[#FAF0E6]/80 border border-[#D9AE8A]/35 text-[12px] text-[#6D2313] leading-relaxed flex items-start gap-1.5">
                      <span className="shrink-0 text-xs">💡</span>
                      <span>{tmpl.behaviorTip}</span>
                    </div>
                  </div>

                  {tmpl.authorCredit && tmpl.authorCredit !== 'Ảnh sưu tầm' && (
                    <p className="text-[10px] text-[#8C6D53] text-right -mt-1">
                      Ảnh: <strong className="text-stone-700">{tmpl.authorCredit}</strong>
                    </p>
                  )}

                  {/* Action Button */}
                  <div className="pt-2 border-t border-[#8C6D53]/15">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#8C2D19] group-hover:bg-[#6D2313] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-1.5 transition active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>Chọn bộ này & Phối đồ</span>
                    </button>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-5 sm:p-6 rounded-3xl bg-[#F4ECE1] border border-[#8C6D53]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#8C2D19] flex items-center justify-center text-xl shadow-xs shrink-0">
              🎨
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#2A1E17]">
                Muốn sáng tạo phong cách riêng mà không dùng mẫu?
              </h4>
              <p className="text-xs text-[#8C6D53]">
                Bạn có thể tự do chọn trang phục, màu sắc và phối bất kỳ phụ kiện nào theo gu của mình.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartFromScratch}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FAF6EE] text-[#8C2D19] border border-[#8C2D19]/30 text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
          >
            Tự phối từ đầu →
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-[#8C6D53]/15 text-center text-[11px] text-[#8C6D53]">
        Việt phục Remix · Tôn vinh trang phục truyền thống Việt Nam · Ảnh minh hoạ sưu tầm từ cộng đồng yêu việt phục; bản quyền thuộc về tác giả và studio · Credit: Nguyễnn Minh DS2
      </footer>
    </div>
  );
};
