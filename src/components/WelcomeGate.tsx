import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

// Logo mèo của nhóm (ảnh nhúng sẵn, không cần file riêng)
const LOGO_CAT = 'data:image/jpeg;base64,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';

interface WelcomeGateProps {
  onEnter: () => void;
}

// Màn chào hiện ngay sau video mở cổng Ngọ Môn.
// Video kết thúc bằng màn sáng màu kem, nên màn này bắt đầu từ lớp kem đó rồi tan dần ra ảnh vườn đêm.
export const WelcomeGate: React.FC<WelcomeGateProps> = ({ onEnter }) => {
  const [shown, setShown] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, []);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onEnter, 700);
  };

  const rise = `transition-all duration-[900ms] ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#0B0907] transition-opacity duration-700 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Ảnh nền vườn đêm, phóng nhẹ rồi thu về */}
      <img
        src="/vuon-dem.jpg"
        alt="Vườn đêm Đại Nội Huế với hoa sen, hoa đào, hoa mai và lầu mái ngói vàng"
        draggable={false}
        className={`absolute inset-0 w-full h-full object-cover object-center select-none transition-transform duration-[9000ms] ease-out ${
          shown ? 'scale-100' : 'scale-110'
        }`}
      />

      {/* Lớp tối để chữ trắng dễ đọc */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/80 pointer-events-none" />

      {/* Lớp kem nối tiếp khung cuối của video, tan dần */}
      <div
        className={`absolute inset-0 bg-[#FAF6EE] pointer-events-none transition-opacity duration-[1600ms] ease-out ${
          shown ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Thanh trên */}
      <header className="absolute top-0 inset-x-0 flex items-center justify-between px-5 sm:px-12 pt-5 sm:pt-7">
        <div className="flex items-center gap-2.5 text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
          <span className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/70 shrink-0"><img src={LOGO_CAT} alt="Logo Việt phục Remix" className="w-full h-full object-cover" draggable={false} /></span>
          <span className="font-serif font-bold text-lg">Việt phục Remix</span>
        </div>
        <span className="hidden sm:inline-block text-[13px] text-white/90 border border-white/40 rounded-full px-4 py-2 bg-black/20 backdrop-blur-md">
          Ngọ Môn · Huế
        </span>
      </header>

      {/* Nội dung chính */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-[clamp(40px,9vh,88px)] flex flex-col items-center text-center gap-4">
        <span className={`${rise} text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-amber-200/90`} style={{ transitionDelay: shown ? '900ms' : '0ms' }}>
          Phòng phối đồ di sản
        </span>
        <h1
          className={`${rise} m-0 font-serif font-semibold text-white leading-[1.04] text-[clamp(38px,7vw,88px)] max-w-[14ch] drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]`}
          style={{ transitionDelay: shown ? '1050ms' : '0ms', textWrap: 'balance' as any }}
        >
          Mặc việt phục <em className="italic text-amber-200">theo cách riêng</em> của bạn
        </h1>
        <p
          className={`${rise} m-0 text-white/80 text-sm sm:text-base leading-relaxed max-w-[46ch] drop-shadow-[0_1px_10px_rgba(0,0,0,0.6)]`}
          style={{ transitionDelay: shown ? '1250ms' : '0ms' }}
        >
          Phối áo dài, tứ thân, ngũ thân với phụ kiện Gen Z. Phần lõi văn hóa luôn được giữ đúng, phần còn lại để bạn remix.
        </p>
        <div className={`${rise} mt-3`} style={{ transitionDelay: shown ? '1450ms' : '0ms' }}>
          <button
            type="button"
            onClick={handleEnter}
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#2A1E17] px-7 py-4 text-[15px] font-semibold shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)] transition-colors hover:bg-[#FAF6EE] active:scale-[0.98] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Vào phòng phối đồ
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
          <p className="m-0 mt-1 text-[11px] sm:text-xs tracking-[0.08em] text-white/60">Credit: Nguyễnn Minh DS2</p>
      </div>
    </div>
  );
};
