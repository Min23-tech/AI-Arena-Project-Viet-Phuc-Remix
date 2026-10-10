import React, { useRef } from 'react';

/* Thẻ nghiêng 3D như lá bài: nghiêng theo vị trí con trỏ, có vệt sáng bóng lướt theo chuột,
   bóng đổ lệch ngược hướng nghiêng, ảnh bên trong trôi nhẹ tạo chiều sâu.
   Chỉ chạy với chuột (điện thoại/cảm ứng giữ nguyên), tắt khi người dùng bật "giảm chuyển động". */
interface TiltCardProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  maxTilt?: number; // độ nghiêng tối đa (độ)
}

export const TiltCard: React.FC<TiltCardProps> = ({ className = '', onClick, children, maxTilt = 10 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const reducedMotion = () =>
    typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || reducedMotion()) return;
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const ry = (x - 0.5) * 2 * maxTilt;
      const rx = -(y - 0.5) * 2 * maxTilt * 0.7; // thẻ cao nên nghiêng dọc nhẹ hơn
      card.style.transition = 'transform 80ms linear, box-shadow 80ms linear';
      card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.03)`;
      card.style.boxShadow = `${(-ry * 1.5).toFixed(1)}px ${(rx * 1.5 + 18).toFixed(1)}px 40px -10px rgba(60,30,10,0.35)`;
      const glare = glareRef.current;
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${(x * 100).toFixed(1)}% ${(y * 100).toFixed(1)}%, rgba(255,255,255,0.75), rgba(255,255,255,0) 55%)`;
        glare.style.opacity = '1';
      }
      const img = card.querySelector('img');
      if (img) {
        img.style.transition = 'transform 80ms linear';
        img.style.transform = `scale(1.08) translate(${((x - 0.5) * -10).toFixed(1)}px, ${((y - 0.5) * -10).toFixed(1)}px)`;
      }
    });
  };

  const handleLeave = () => {
    cancelAnimationFrame(raf.current);
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = 'transform 600ms cubic-bezier(0.2,0.8,0.2,1), box-shadow 600ms ease';
    card.style.transform = '';
    card.style.boxShadow = '';
    if (glareRef.current) glareRef.current.style.opacity = '0';
    const img = card.querySelector('img');
    if (img) {
      img.style.transition = 'transform 600ms cubic-bezier(0.2,0.8,0.2,1)';
      img.style.transform = '';
    }
  };

  return (
    <div style={{ perspective: '1000px' }} className="h-full">
      <div
        ref={cardRef}
        onClick={onClick}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`${className} h-full`}
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >
        {children}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0, transition: 'opacity 300ms', mixBlendMode: 'soft-light', zIndex: 5, borderRadius: 'inherit' }}
        />
      </div>
    </div>
  );
};
