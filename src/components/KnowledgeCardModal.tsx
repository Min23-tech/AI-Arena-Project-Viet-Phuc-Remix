import React, { useEffect, useRef, useState } from 'react';
import { ItemKnowledge } from '../data/itemKnowledge';
import { COSTUMES, HAIRSTYLES, ACCESSORIES } from '../data/fashionData';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lightbulb,
  ExternalLink,
  Shield,
  Zap,
  Clock,
  Eye,
  Calendar,
  Check,
} from 'lucide-react';

interface KnowledgeCardModalProps {
  itemId: string;
  item: ItemKnowledge;
  isEquipped: boolean;
  onEquipAndClose: (itemId: string, category: 'costume' | 'hair' | 'accessory') => void;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  currentIndex?: number;
  totalInGroup?: number;
}

/** Bộ xem nhiều ảnh: mũi tên ‹ ›, chấm chỉ vị trí, ghi nguồn ảnh; ảnh lỗi tự ẩn */
const RealPhotoGallery: React.FC<{ images: { src: string; credit: string }[]; alt: string }> = ({ images, alt }) => {
  const [broken, setBroken] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const list = images.filter((im) => !broken.includes(im.src));
  if (list.length === 0) return null;
  const i = Math.min(idx, list.length - 1);
  const cur = list[i];
  const go = (d: number) => setIdx((i + d + list.length) % list.length);
  return (
    <div>
      <div className="relative w-full h-[42vh] md:h-[460px] bg-stone-900 rounded-2xl overflow-hidden border border-[#8C6D53]/20 shadow-md">
        <img
          src={cur.src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover object-top"
          onError={() => setBroken((b) => [...b, cur.src])}
        />
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Ảnh trước"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Ảnh sau"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/45 hover:bg-black/65 text-white flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {list.map((_, k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setIdx(k)}
                  aria-label={`Ảnh ${k + 1}`}
                  className={`h-2 rounded-full transition-all ${k === i ? 'w-5 bg-white' : 'w-2 bg-white/55'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {cur.credit && (
        <p className="mt-2 text-[11px] text-[#8C6D53] text-center italic">
          Ảnh: {cur.credit}
        </p>
      )}
    </div>
  );
};

export const KnowledgeCardModal: React.FC<KnowledgeCardModalProps> = ({
  itemId,
  item,
  isEquipped,
  onEquipAndClose,
  onClose,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalInGroup,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        onPrev();
      } else if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  // Lookup name, category, traditionType from fashionData
  const costume = COSTUMES.find((c) => c.id === itemId);
  const hair = HAIRSTYLES.find((h) => h.id === itemId);
  const acc = ACCESSORIES.find((a) => a.id === itemId);

  const name = costume?.name || hair?.name || acc?.name || '';
  const category: 'costume' | 'hair' | 'accessory' = costume ? 'costume' : hair ? 'hair' : 'accessory';
  const traditionType: 'vung_loi' | 'vung_remix' = costume
    ? costume.id === 'ao_dai_tan_thoi'
      ? 'vung_remix'
      : 'vung_loi'
    : hair
    ? hair.traditionType
    : acc?.type === 'modern'
    ? 'vung_remix'
    : 'vung_loi';

  // Determine button text based on item category
  const getButtonText = () => {
    if (isEquipped) {
      if (category === 'costume') return 'Đang mặc bộ này';
      if (category === 'hair') return 'Đang để kiểu tóc này';
      return 'Đang đeo phụ kiện này';
    }
    if (category === 'costume') return 'Mặc thử bộ này';
    if (category === 'hair') return 'Thử kiểu tóc này';
    return 'Đeo thử';
  };

  const hasImages = Boolean(item.images && item.images.length > 0);
  const isCore = traditionType === 'vung_loi';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Container: Fullscreen card on Desktop, Bottom Sheet on Mobile */}
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full h-[92vh] md:h-auto md:max-h-[90vh] md:max-w-4xl bg-[#FCFAF6] text-[#2A1E17] rounded-t-3xl md:rounded-3xl shadow-2xl border border-[#8C6D53]/25 flex flex-col overflow-hidden animate-in slide-in-from-bottom md:zoom-in-95 duration-200"
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="md:hidden flex justify-center pt-2.5 pb-1">
          <div className="w-12 h-1 bg-[#8C6D53]/30 rounded-full" />
        </div>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#8C6D53]/15 bg-[#FAF4E8]/90">
          {/* Navigation Controls: Prev / Next */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrev}
              disabled={!hasPrev}
              className={`p-1.5 rounded-full border border-[#8C6D53]/20 flex items-center gap-1 text-xs font-medium transition ${
                hasPrev
                  ? 'bg-white hover:bg-[#FAF6EE] text-[#2A1E17] cursor-pointer'
                  : 'bg-white/50 text-[#8C6D53]/40 cursor-not-allowed border-dashed'
              }`}
              title="Món trước (Phím ←)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline pr-1">Trước</span>
            </button>

            {currentIndex !== undefined && totalInGroup !== undefined && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#8C6D53]/10 text-[#8C6D53] font-semibold">
                {currentIndex + 1} / {totalInGroup}
              </span>
            )}

            <button
              type="button"
              onClick={onNext}
              disabled={!hasNext}
              className={`p-1.5 rounded-full border border-[#8C6D53]/20 flex items-center gap-1 text-xs font-medium transition ${
                hasNext
                  ? 'bg-white hover:bg-[#FAF6EE] text-[#2A1E17] cursor-pointer'
                  : 'bg-white/50 text-[#8C6D53]/40 cursor-not-allowed border-dashed'
              }`}
              title="Món tiếp theo (Phím →)"
            >
              <span className="hidden sm:inline pl-1">Sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Header Tag & Close Button */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C2D19] hidden sm:inline">
              ✦ Thẻ Kiến Thức Di Sản
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white hover:bg-[#F3EAD8] text-[#8C6D53] hover:text-[#2A1E17] border border-[#8C6D53]/20 transition shadow-xs"
              title="Đóng (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-7">
          <div
            className={`w-full ${
              hasImages
                ? 'grid grid-cols-1 md:grid-cols-12 gap-6 items-start'
                : 'max-w-2xl mx-auto'
            }`}
          >
            {/* Left Column (or Full Center Column if no images): Text Content */}
            <div className={`space-y-4 md:space-y-5 ${hasImages ? 'md:col-span-7' : 'w-full'}`}>
              {/* Chips row */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Chip 1: Vùng lõi hoặc Remix */}
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isCore
                      ? 'bg-[#FAF0E6] text-[#C0392B] border-[#C0392B]/30'
                      : 'bg-[#FFF8E7] text-[#D97706] border-[#D97706]/30'
                  }`}
                >
                  {isCore ? <Shield className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                  <span>{isCore ? 'Vùng Lõi' : 'Remix'}</span>
                </span>

                {/* Chip 2: era (nếu có) */}
                {item.era && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>{item.era}</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold font-serif text-[#2A1E17] leading-snug">
                  {name}
                </h2>
              </div>

              {/* Section: Thời kỳ (chỉ hiện khi có period) */}
              {item.period && (
                <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#8C6D53]/15">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8C2D19] mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8C2D19]" />
                    <span>Thời kỳ</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
                    {item.period}
                  </p>
                </div>
              )}

              {/* Section: Nhận diện */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8C6D53]">
                  <Eye className="w-3.5 h-3.5 text-[#8C2D19]" />
                  <span>Nhận diện</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3E3129] leading-relaxed font-sans">
                  {item.identify}
                </p>
              </div>

              {/* Section: Dùng khi */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8C6D53]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                  <span>Dùng khi</span>
                </div>
                <p className="text-xs sm:text-sm text-[#3E3129] leading-relaxed font-sans">
                  {item.useWhen}
                </p>
              </div>

              {/* Khung Vàng: "Bạn có biết?" (đồ truyền thống) HOẶC "Mẹo phối" (đồ hiện đại) */}
              {(item.funFact || item.styleTip) && (
                <div className="p-4 rounded-2xl bg-[#FEF9C3]/80 border border-[#FDE047] shadow-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#854D0E] uppercase tracking-wider">
                    <Lightbulb className="w-4 h-4 text-[#CA8A04] shrink-0" />
                    <span>{item.funFact ? 'Bạn có biết?' : 'Mẹo phối đồ'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#713F12] leading-relaxed">
                    {item.funFact || item.styleTip}
                  </p>
                </div>
              )}

              {/* Dòng nguồn (chỉ hiện khi có sources) */}
              {item.sources && item.sources.length > 0 && (
                <div className="pt-2 text-[11px] text-[#8C6D53] space-y-1 border-t border-[#8C6D53]/15">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-[#8C6D53]/90">
                    Nguồn tư liệu tham khảo:
                  </span>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {item.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#8C2D19] hover:underline font-medium hover:text-[#C0392B]"
                      >
                        <span>{src.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Ảnh người mặc thật: trên điện thoại hiện lên đầu, trên máy tính ở cột phải */}
            {hasImages && item.images && (
              <div className="md:col-span-5 order-first md:order-last">
                <RealPhotoGallery key={itemId} images={item.images} alt={name} />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Action Button */}
        <div className="p-3 sm:p-4 border-t border-[#8C6D53]/15 bg-[#FAF6EE] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#8C6D53]/25 text-xs font-semibold text-[#8C6D53] hover:bg-white transition"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={() => onEquipAndClose(itemId, category)}
            className={`flex-1 sm:flex-initial sm:min-w-[200px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2 active:scale-[0.98] ${
              isEquipped
                ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white'
                : 'bg-[#8C2D19] hover:bg-[#A9321D] text-white'
            }`}
          >
            {isEquipped ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{getButtonText()}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#FDE68A]" />
                <span>{getButtonText()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
