import React, { useState } from 'react';
import { OccasionTemplate } from '../data/fashionData';
import { RotateCcw, Maximize2, X, Sparkles, Check, Info } from 'lucide-react';

interface TemplateComparisonWidgetProps {
  template: OccasionTemplate | null;
  onResetToTemplate: () => void;
  isModified?: boolean;
}

export const TemplateComparisonWidget: React.FC<TemplateComparisonWidgetProps> = ({
  template,
  onResetToTemplate,
  isModified = false,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!template) return null;

  return (
    <>
      {/* Corner floating widget in dressing room */}
      <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-1.5 animate-in fade-in duration-200">
        <div className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#8C6D53]/25 shadow-md hover:border-[#8C6D53] transition">
          {/* Small 3:4 Thumbnail (Click to enlarge) */}
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="relative w-9 h-12 rounded-xl overflow-hidden bg-stone-200 border border-[#8C6D53]/30 shrink-0 group focus:outline-hidden"
            title="Bấm để phóng to ảnh mẫu người thật"
          >
            {!imgError ? (
              <img
                src={template.imageUrl}
                alt={template.name}
                onError={() => setImgError(true)}
                style={{ objectPosition: template.id === 'ky_yeu' ? 'center 30%' : 'center top' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full bg-[#FAF0E6] text-[#8C2D19] flex items-center justify-center text-xs font-bold">
                📷
              </div>
            )}
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 flex items-center justify-center transition">
              <Maximize2 className="w-3.5 h-3.5 text-white opacity-90 drop-shadow-xs" />
            </div>
          </button>

          {/* Info & Reset Button */}
          <div className="min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C2D19]">
                Mẫu gốc
              </span>
              {isModified && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">
                  Đã chỉnh
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-stone-900 truncate max-w-[120px] sm:max-w-[150px]">
              {template.name}
            </p>

            <button
              type="button"
              onClick={onResetToTemplate}
              className="mt-0.5 text-[10px] text-[#C0392B] hover:text-[#991B1B] font-semibold flex items-center gap-1 transition active:scale-95 underline"
              title="Khôi phục lại đúng mẫu gốc ban đầu"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Trở về mẫu gốc</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Phóng to ảnh mẫu người thật) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-[#FDFBF7] border-b border-[#8C6D53]/15 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#8C2D19] flex items-center gap-1.5 font-serif">
                  <span>🏛️</span> Bộ Mẫu Chuẩn: {template.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4">
              {/* Photo Frame 3:4 */}
              <div className="relative w-full max-w-[280px] mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-[#FAF0E6] shadow-md border border-[#8C6D53]/20">
                {!imgError ? (
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    style={{ objectPosition: template.id === 'ky_yeu' ? 'center 30%' : 'center top' }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center">
                    <span className="text-3xl mb-1">📷</span>
                    <span className="text-xs">Không thể tải ảnh xem trước</span>
                  </div>
                )}
                {/* Badge Ảnh tham khảo */}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                  Ảnh tham khảo
                </div>
              </div>

              {/* Dòng ghi công nhỏ bắt buộc */}
              <div className="text-center text-[11px] text-[#8C6D53] border-b border-[#8C6D53]/15 pb-3">
                <span>Ảnh: </span>
                <span className="font-semibold text-stone-800">{template.authorCredit}</span>
                <span> · </span>
                <span className="text-stone-600">{template.license}</span>
                <span> · </span>
                <span className="italic">{template.source}</span>
              </div>

              {/* Chi tiết trang phục mẫu */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#8C6D53]/15 flex items-start gap-2">
                  <span className="font-bold text-[#8C2D19] shrink-0">Trang phục:</span>
                  <span className="text-stone-800">{template.mainCostumeText}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#8C6D53]/15 flex items-start gap-2">
                  <span className="font-bold text-[#8C2D19] shrink-0">Màu sắc:</span>
                  <span className="text-stone-800">{template.colorText}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#8C6D53]/15 flex items-start gap-2">
                  <span className="font-bold text-[#8C2D19] shrink-0">Phụ kiện:</span>
                  <span className="text-stone-800">{template.accessoriesText}</span>
                </div>

                {/* Gợi ý ứng xử */}
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950">
                  <span className="font-bold text-amber-900 block mb-0.5">
                    💡 Gợi ý ứng xử văn hóa:
                  </span>
                  <p className="leading-relaxed text-[11px]">{template.behaviorTip}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#FDFBF7] border-t border-[#8C6D53]/15 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  onResetToTemplate();
                  setIsLightboxOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#FAF0E6] hover:bg-[#F5E5D5] text-[#8C2D19] text-xs font-bold border border-[#8C2D19]/30 transition active:scale-95 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Trở về mẫu gốc</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#2A1E17] text-white text-xs font-bold hover:bg-stone-800 transition active:scale-95"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
