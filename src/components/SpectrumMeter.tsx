import React, { useState } from 'react';
import { ShieldCheck, Zap, Info, HelpCircle } from 'lucide-react';

interface SpectrumMeterProps {
  identityPercent: number;
  remixPercent: number;
  onOpenHarmonyModal?: () => void;
  compact?: boolean;
}

export const SpectrumMeter: React.FC<SpectrumMeterProps> = ({
  identityPercent,
  remixPercent,
  onOpenHarmonyModal,
  compact = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative group/spectrum">
      <button
        type="button"
        onClick={onOpenHarmonyModal}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip((prev) => !prev)}
        className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 rounded-full bg-white border border-[#8C6D53]/25 hover:border-[#8C6D53] shadow-xs hover:shadow-sm transition active:scale-95 text-left"
        title="Thanh phổ cân bằng: Bản sắc + Remix = 100%"
      >
        {/* Dual labels & Percentages */}
        <div className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
          <span className="text-[#8C2D19] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Bản sắc {identityPercent}%</span>
          </span>
          <span className="text-[#8C6D53]/40 font-light">·</span>
          <span className="text-[#D97706] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span>Remix {remixPercent}%</span>
          </span>
        </div>

        {/* Dual-Color Spectrum Bar (Sums to exactly 100%) */}
        <div className="w-16 sm:w-24 h-2 bg-stone-100 rounded-full overflow-hidden flex border border-[#8C6D53]/20 shrink-0">
          {/* Identity Segment (Bản sắc) */}
          <div
            className="h-full bg-gradient-to-r from-[#8C2D19] to-[#C0392B] transition-all duration-300"
            style={{ width: `${identityPercent}%` }}
          />
          {/* Remix Segment (Remix) */}
          <div
            className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] transition-all duration-300"
            style={{ width: `${remixPercent}%` }}
          />
        </div>

        <HelpCircle className="w-3.5 h-3.5 text-[#8C6D53]/50 hidden sm:block shrink-0" />
      </button>

      {/* Explanatory Tooltip on Hover / Touch */}
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 p-3 rounded-2xl bg-[#2A1E17] text-[#FAF6EE] text-xs leading-relaxed shadow-2xl border border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/10 font-bold">
            <span className="text-[#FDE68A] flex items-center gap-1.5">
              <span>⚖️</span> Thước Đo Phổ Bản Sắc & Remix
            </span>
            <span className="text-[11px] font-mono text-stone-400">Tổng = 100%</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-start gap-1.5">
              <span className="text-[#F87171] font-bold shrink-0">🏛️ Bản sắc ({identityPercent}%):</span>
              <span className="text-stone-300">
                Vùng lõi (cấu trúc y phục, cổ lập lĩnh, vạt áo, cúc nút) luôn được khóa chặt để bảo tồn di sản, vì vậy Bản sắc <strong>không bao giờ dưới 40%</strong>.
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-[#FBBF24] font-bold shrink-0">⚡ Remix ({remixPercent}%):</span>
              <span className="text-stone-300">
                Thỏa sức biến tấu ở vùng remix qua sneaker, kính râm, tai nghe, túi tote, mũ beret và màu sắc hiện đại (tối đa 60%).
              </span>
            </div>
          </div>

          <div className="mt-2 pt-1.5 border-t border-white/10 text-[10px] text-stone-400 italic text-center">
            Bấm để mở Thước Đo Văn Hóa & Cảnh Báo chi tiết
          </div>
        </div>
      )}
    </div>
  );
};
