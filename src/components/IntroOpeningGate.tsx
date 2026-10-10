import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IntroOpeningGateProps {
  onComplete: () => void;
}

export const IntroOpeningGate: React.FC<IntroOpeningGateProps> = ({ onComplete }) => {
  return (
    <div className="w-screen h-screen fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden">
      {/* Video intro full màn hình */}
      <video
        src="/ngomon-intro-real.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        className="w-full h-full object-cover"
      />

      {/* Nút CTA đè lên trên video với z-index cao hơn */}
      <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20">
        <button
          type="button"
          onClick={onComplete}
          className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/60 hover:bg-[#8C2D19] text-white border border-amber-300/50 hover:border-[#8C2D19] text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span>Bỏ qua · Vào ứng dụng</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Nhãn di sản góc trên bên trái */}
      <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-serif">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ngọ Môn Huế · Mở lối di sản</span>
        </div>
      </div>
    </div>
  );
};
