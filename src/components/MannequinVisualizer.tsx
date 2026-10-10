import React, { useState } from 'react';
import { CostumeItem, AccessoryItem, ColorPalette, HairstyleItem } from '../data/fashionData';
import { Sparkles, Shield, Zap, EyeOff, LayoutGrid, User, Info, ZoomIn, ZoomOut } from 'lucide-react';
import { CharacterFigure, SCENES, TEMPLATE_SCENE, SceneId } from './CharacterFigure';
import { ITEM_KNOWLEDGE } from '../data/itemKnowledge';

export type ZoneHighlightMode = 'none' | 'vung_loi' | 'vung_remix';

interface MannequinVisualizerProps {
  costume: CostumeItem;
  accessories: AccessoryItem[];
  palette: ColorPalette;
  gender: 'female' | 'male';
  hairstyle?: HairstyleItem;
  zoneHighlight: ZoneHighlightMode;
  onToggleZoneHighlight: (mode: ZoneHighlightMode) => void;
  lookName: string;
  onShuffleName: () => void;
  onEditName: (newName: string) => void;
  alertNode?: React.ReactNode;
  viewMode?: 'silhouette' | 'moodboard';
  onViewModeChange?: (mode: 'silhouette' | 'moodboard') => void;
  onOpenKnowledge?: (itemId: string) => void;
  /** id mẫu dịp đang chọn — để tự đổi phông nền theo dịp */
  templateId?: string;
}

export const MannequinVisualizer: React.FC<MannequinVisualizerProps> = ({
  costume,
  accessories,
  palette,
  gender,
  hairstyle,
  zoneHighlight,
  onToggleZoneHighlight,
  lookName,
  onShuffleName,
  onEditName,
  alertNode,
  viewMode: propsViewMode,
  onViewModeChange,
  onOpenKnowledge,
  templateId,
}) => {
  // Phông nền: tự chọn theo mẫu dịp, người dùng vẫn đổi tay được
  const [sceneId, setSceneId] = useState<SceneId>(() => (templateId && TEMPLATE_SCENE[templateId]) || 'studio');
  React.useEffect(() => {
    setSceneId((templateId && TEMPLATE_SCENE[templateId]) || 'studio');
  }, [templateId]);
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState(lookName);
  // View mode: 'silhouette' (Người mẫu faceless mềm mại) hoặc 'moodboard' (Bảng phối đồ Pinterest)
  const [internalViewMode, setInternalViewMode] = useState<'silhouette' | 'moodboard'>('silhouette');
  const viewMode = propsViewMode !== undefined ? propsViewMode : internalViewMode;

  // ===== Phóng to / thu nhỏ nhân vật (mọi thiết bị) =====
  // Nút +/−, lăn chuột, chụm 2 ngón (điện thoại), nhấp đúp để phóng to/thu về; khi đang phóng to thì kéo để di chuyển
  const ZOOM_MIN = 1, ZOOM_MAX = 3.5;
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const zoomRef = React.useRef(1);
  const panRef = React.useRef({ x: 0, y: 0 });
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = React.useRef<{ dist: number; zoom: number } | null>(null);
  const clampPan = (p: { x: number; y: number }, z: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return p;
    const mx = (r.width * (z - 1)) / 2, my = (r.height * (z - 1)) / 2;
    return { x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) };
  };
  const applyView = (z: number, p: { x: number; y: number }) => {
    const zz = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z));
    const pp = zz === 1 ? { x: 0, y: 0 } : clampPan(p, zz);
    zoomRef.current = zz; panRef.current = pp;
    setZoom(zz); setPan(pp);
  };
  // phóng quanh một điểm trên màn hình (điểm đó đứng yên khi phóng)
  const zoomAt = (newZ: number, clientX?: number, clientY?: number) => {
    const r = stageRef.current?.getBoundingClientRect();
    const z0 = zoomRef.current, p0 = panRef.current;
    const z = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, newZ));
    if (!r || clientX === undefined || clientY === undefined) { applyView(z, { x: (p0.x * z) / z0, y: (p0.y * z) / z0 }); return; }
    const px = clientX - (r.left + r.width / 2), py = clientY - (r.top + r.height / 2);
    applyView(z, { x: px - ((px - p0.x) * z) / z0, y: py - ((py - p0.y) * z) / z0 });
  };
  const resetZoom = () => applyView(1, { x: 0, y: 0 });
  React.useEffect(() => { resetZoom(); }, [viewMode]); // đổi chế độ xem thì trả về khung gốc
  const onStageWheel = (e: React.WheelEvent) => zoomAt(zoomRef.current * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY);
  const onStagePointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom: zoomRef.current };
    }
    setDragging(true);
  };
  const onStagePointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((pinchRef.current.zoom * d) / Math.max(1, pinchRef.current.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
    } else if (zoomRef.current > 1) {
      applyView(zoomRef.current, { x: panRef.current.x + (e.clientX - prev.x), y: panRef.current.y + (e.clientY - prev.y) });
    }
  };
  const onStagePointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) setDragging(false);
  };
  const onStageDoubleClick = (e: React.MouseEvent) => (zoomRef.current > 1.05 ? resetZoom() : zoomAt(2.2, e.clientX, e.clientY));

  const handleSetViewMode = (mode: 'silhouette' | 'moodboard') => {
    if (onViewModeChange) {
      onViewModeChange(mode);
    } else {
      setInternalViewMode(mode);
    }
  };

  React.useEffect(() => {
    setCustomName(lookName);
  }, [lookName]);

  const handleSaveName = () => {
    if (customName.trim()) {
      onEditName(customName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full min-h-[460px] md:min-h-[580px] max-h-screen select-none overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF4E8] to-[#EFE5D3]">
      {/* 1. TOP FLOATING CONTROLS: VIEW TOGGLE, VÙNG LÕI / REMIX & LOOK NAME */}
      <div className="w-full px-3 pt-2.5 pb-1 z-30 flex flex-wrap items-center justify-between gap-2">
        {/* Lookbook Name Tag */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-xs border border-[#8C6D53]/20 max-w-[190px] sm:max-w-xs">
          {isEditing ? (
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
              className="text-xs font-bold text-[#2A1E17] bg-white border border-[#C0392B] rounded px-1.5 py-0.5 w-full focus:outline-hidden"
            />
          ) : (
            <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setIsEditing(true)}>
              <span className="text-xs font-bold font-serif text-[#2A1E17] truncate hover:text-[#C0392B] transition">
                {lookName}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShuffleName();
                }}
                className="text-[#8C6D53] hover:text-[#C0392B] transition p-0.5"
                title="Đổi tên ngẫu nhiên"
              >
                <Sparkles className="w-3 h-3 text-[#D97706]" />
              </button>
            </div>
          )}
        </div>

        {/* VIEW MODE TOGGLE (Người Mẫu Faceless vs Bảng Phối Pinterest) & ZONE HIGHLIGHT */}
        <div className="flex items-center gap-1.5">
          {/* Toggle View Mode */}
          <div className="flex items-center p-0.5 bg-white/90 backdrop-blur-md rounded-full border border-[#8C6D53]/20 shadow-xs text-xs font-medium">
            <button
              type="button"
              onClick={() => handleSetViewMode('silhouette')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                viewMode === 'silhouette'
                  ? 'bg-[#8C2D19] text-white font-bold shadow-xs'
                  : 'text-[#8C6D53] hover:text-[#2A1E17]'
              }`}
              title="Chế độ Người mẫu thời trang Minimalist"
            >
              <User className="w-3 h-3" />
              <span className="text-[11px] hidden sm:inline">Người mẫu</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode('moodboard')}
              className={`px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
                viewMode === 'moodboard'
                  ? 'bg-[#8C2D19] text-white font-bold shadow-xs'
                  : 'text-[#8C6D53] hover:text-[#2A1E17]'
              }`}
              title="Chế độ Bảng phối đồ Pinterest (Inspiration Flat-lay)"
            >
              <LayoutGrid className="w-3 h-3" />
              <span className="text-[11px] hidden sm:inline">Bảng phối</span>
            </button>
          </div>

          {/* Vùng Lõi / Vùng Remix Toggle */}
          <div className="flex items-center p-0.5 bg-white/90 backdrop-blur-md rounded-full border border-[#8C6D53]/20 shadow-xs text-xs font-medium">
            <button
              type="button"
              onClick={() => onToggleZoneHighlight(zoneHighlight === 'vung_loi' ? 'none' : 'vung_loi')}
              className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                zoneHighlight === 'vung_loi'
                  ? 'bg-[#C0392B] text-white font-bold shadow-xs'
                  : 'text-[#8C6D53] hover:text-[#C0392B]'
              }`}
              title="Soi Vùng Lõi: Các chuẩn mực di sản được bảo tồn"
            >
              <Shield className="w-3 h-3" />
              <span className="text-[10px] hidden md:inline">Vùng Lõi</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleZoneHighlight(zoneHighlight === 'vung_remix' ? 'none' : 'vung_remix')}
              className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
                zoneHighlight === 'vung_remix'
                  ? 'bg-[#D97706] text-white font-bold shadow-xs'
                  : 'text-[#8C6D53] hover:text-[#D97706]'
              }`}
              title="Soi Vùng Remix: Khu vực phụ kiện & kiểu tóc tự do biến tấu"
            >
              <Zap className="w-3 h-3" />
              <span className="text-[10px] hidden md:inline">Remix</span>
            </button>

            {zoneHighlight !== 'none' && (
              <button
                type="button"
                onClick={() => onToggleZoneHighlight('none')}
                className="p-1 rounded-full text-[#8C6D53] hover:text-black"
                title="Tắt chú thích"
              >
                <EyeOff className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. BACKGROUND MOTIF: SUBTLE ARTISTIC TRADITIONAL LOTUS AESTHETIC */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
        <svg className="w-[360px] h-[360px] md:w-[460px] md:h-[460px]" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="92" fill="none" stroke="#8C6D53" strokeWidth="0.5" opacity="0.25" />
          <circle cx="100" cy="100" r="76" fill="none" stroke="#D97706" strokeWidth="0.5" opacity="0.25" />
          <path
            d="M100 20 C112 45 130 60 135 100 C130 140 112 155 100 180 C88 155 70 140 65 100 C70 60 88 45 100 20 Z"
            fill="none"
            stroke="#C0392B"
            strokeWidth="0.8"
            opacity="0.35"
          />
          <path
            d="M20 100 C45 112 60 130 100 135 C140 130 155 112 180 100 C155 88 140 70 100 65 C60 70 45 88 20 100 Z"
            fill="none"
            stroke="#C0392B"
            strokeWidth="0.8"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* 3. MAIN DISPLAY AREA: SILHOUETTE MODE OR MOODBOARD MODE */}
      {viewMode === 'silhouette' ? (
        /* Hàng trên: khung chứa SVG nhân vật */
        <div className="relative z-10 w-full flex-1 min-h-0 flex items-center justify-center px-2">
          <div
            ref={stageRef}
            className="absolute inset-0 flex items-center justify-center select-none px-2"
            style={{ touchAction: 'none', cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            onWheel={onStageWheel}
            onPointerDown={onStagePointerDown}
            onPointerMove={onStagePointerMove}
            onPointerUp={onStagePointerUp}
            onPointerCancel={onStagePointerUp}
            onDoubleClick={onStageDoubleClick}
          >
            <div
              className="h-full w-full flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: dragging ? 'none' : 'transform 180ms ease-out',
              }}
            >
              <CharacterFigure

            gender={gender}
            costumeId={costume.id}
            palette={palette}
            accessoryIds={accessories.map((a) => a.id)}
            hairId={hairstyle?.id}
            zone={zoneHighlight}
            sceneId={sceneId}
            className="h-full w-auto max-h-full max-w-full transition-all duration-300"
            style={{ filter: 'drop-shadow(0 12px 24px rgba(78, 52, 46, 0.10))' }}
          />
            </div>
          </div>

          {/* Phóng to / thu nhỏ nhân vật */}
          <div className="absolute right-1.5 top-1.5 sm:right-3 sm:top-1/2 sm:-translate-y-1/2 z-20 flex flex-col items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-2xl bg-white/85 backdrop-blur-md border border-[#8C6D53]/20 shadow-xs">
            <button type="button" onClick={() => zoomAt(zoomRef.current * 1.3)} disabled={zoom >= ZOOM_MAX} aria-label="Phóng to" title="Phóng to"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-[#8C2D19] hover:bg-[#FAF0E6] disabled:opacity-35">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button type="button" onClick={resetZoom} aria-label="Về khung gốc" title="Về khung gốc"
              className="w-7 sm:w-8 py-0.5 rounded-lg text-[10px] font-bold text-[#8C6D53] hover:bg-[#FAF0E6] tabular-nums">
              {Math.round(zoom * 100)}%
            </button>
            <button type="button" onClick={() => zoomAt(zoomRef.current / 1.3)} disabled={zoom <= ZOOM_MIN} aria-label="Thu nhỏ" title="Thu nhỏ"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-[#8C2D19] hover:bg-[#FAF0E6] disabled:opacity-35">
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Chọn phông nền (cột nhỏ bên trái, không che nhân vật) */}
          <div className="absolute left-1.5 top-1.5 sm:left-3 sm:top-1/2 sm:-translate-y-1/2 z-20 flex flex-col gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-2xl bg-white/85 backdrop-blur-md border border-[#8C6D53]/20 shadow-xs">
            {SCENES.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => setSceneId(sc.id)}
                title={`Phông: ${sc.name}`}
                aria-label={`Phông nền ${sc.name}`}
                className={`flex items-center gap-1.5 rounded-xl px-1 py-0.5 sm:px-1.5 sm:py-1 text-[11px] font-semibold transition-all ${
                  sceneId === sc.id ? 'bg-[#8C2D19] text-white shadow-xs' : 'text-[#8C6D53] hover:bg-[#FAF0E6]'
                }`}
              >
                <span className="text-sm leading-none">{sc.emoji}</span>
                <span className="hidden lg:inline whitespace-nowrap">{sc.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ================= MODE 2: PINTEREST AESTHETIC INSPIRATION LOOKBOOK BOARD ================= */
        <div className="relative z-10 w-full flex-1 min-h-0 flex items-start justify-center px-3 pt-6 pb-3 sm:px-5 sm:pt-7 sm:pb-5 max-w-lg overflow-y-auto animate-in fade-in duration-300">
          <div className="w-full my-auto bg-[#FAF5EB]/95 backdrop-blur-md rounded-3xl border border-[#8C6D53]/25 p-4 sm:p-5 shadow-lg relative">
            {/* Top Washi Tape Pin Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#E8D5C4]/90 border border-[#D9AE8A]/40 rotate-1 shadow-xs flex items-center justify-center text-[10px] font-bold text-[#8C2D19] tracking-widest uppercase">
              LOOKBOOK · BOARD
            </div>

            {/* Board Header */}
            <div className="text-center pt-2 pb-3.5 border-b border-[#8C6D53]/15">
              <span className="text-[10px] uppercase tracking-widest text-[#D97706] font-bold block">
                PINTEREST MOODBOARD · VIỆT PHỤC REMIX
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-[#2A1E17] mt-0.5">
                {lookName}
              </h3>
              <p className="text-[11px] text-[#8C6D53] mt-0.5">
                Bảng phối đồ tách lớp (Layered Aesthetic Flat-lay)
              </p>
            </div>

            {/* Grid of Aesthetic Component Cards */}
            <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
              {/* Card 1: Trang Phục Chính (Folded Silk Garment Card) */}
              {(() => {
                const hasCostumeKnowledge = !!ITEM_KNOWLEDGE[costume.id];
                return (
                  <div
                    onClick={() => hasCostumeKnowledge && onOpenKnowledge?.(costume.id)}
                    className={`p-3 rounded-2xl bg-white border border-[#8C6D53]/20 shadow-xs flex flex-col justify-between transition-all duration-150 ${
                      hasCostumeKnowledge
                        ? 'cursor-pointer hover:border-[#8C2D19] hover:shadow-md hover:bg-[#FAF6EE]/50 active:scale-[0.98]'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-bold text-[#8C2D19]">
                          Trang phục chính
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#FAF0E6] text-[#8C2D19] font-bold">
                            Vùng lõi
                          </span>
                          {hasCostumeKnowledge && (
                            <span className="w-4 h-4 rounded-full bg-white text-[#8C2D19] border border-[#8C2D19]/30 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                              ⓘ
                            </span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm leading-tight">
                        {costume.name}
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                        {costume.philosophy.slice(0, 80)}...
                      </p>
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="w-5 h-5 rounded-lg shadow-inner border border-black/10 shrink-0"
                          style={{ backgroundColor: palette.primary }}
                        />
                        <span className="text-[11px] text-stone-700 font-semibold truncate">
                          {palette.poeticName}
                        </span>
                      </div>
                      {hasCostumeKnowledge && (
                        <span className="text-[10px] text-[#8C2D19] font-bold shrink-0">
                          Thẻ ⓘ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Card 2: Kiểu Tóc */}
              {hairstyle && (() => {
                const hasHairKnowledge = !!ITEM_KNOWLEDGE[hairstyle.id];
                return (
                  <div
                    onClick={() => hasHairKnowledge && onOpenKnowledge?.(hairstyle.id)}
                    className={`p-3 rounded-2xl bg-white border border-[#8C6D53]/20 shadow-xs flex flex-col justify-between transition-all duration-150 ${
                      hasHairKnowledge
                        ? 'cursor-pointer hover:border-[#8C2D19] hover:shadow-md hover:bg-[#FAF6EE]/50 active:scale-[0.98]'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] uppercase font-bold text-[#8C6D53]">
                          Kiểu tóc
                        </span>
                        <div className="flex items-center gap-1">
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                              hairstyle.traditionType === 'vung_loi'
                                ? 'bg-[#FAF0E6] text-[#8C2D19]'
                                : 'bg-[#FFF8E7] text-[#D97706]'
                            }`}
                          >
                            {hairstyle.traditionType === 'vung_loi' ? 'Cổ điển' : 'Tân thời'}
                          </span>
                          {hasHairKnowledge && (
                            <span className="w-4 h-4 rounded-full bg-white text-[#8C2D19] border border-[#8C2D19]/30 flex items-center justify-center text-[10px] font-bold shadow-2xs">
                              ⓘ
                            </span>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm leading-tight flex items-center gap-1">
                        <span>{hairstyle.emoji}</span>
                        <span>{hairstyle.name}</span>
                      </h4>
                      <p className="text-[10px] text-stone-500 mt-1 line-clamp-2">
                        {hairstyle.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-[#8C6D53]">
                      <span>{gender === 'female' ? 'Tóc Nữ' : 'Tóc Nam'}</span>
                      {hasHairKnowledge && (
                        <span className="text-[10px] text-[#8C2D19] font-bold shrink-0">
                          Thẻ ⓘ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Card 3: Bảng Màu & Quần (Silk Drape & Swatch) */}
              <div className="p-3 rounded-2xl bg-white border border-[#8C6D53]/20 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D97706] block mb-1">
                    Sắc thái & Quần lụa
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm leading-tight">
                    {palette.name}
                  </h4>
                  <span className="text-[10px] text-stone-500 block mt-1">
                    Quần/Váy: {palette.secondary === '#FFFFFF' ? 'Trắng lụa thanh tao' : palette.secondary}
                  </span>
                </div>

                {/* Color swatches bar */}
                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5">
                  <div
                    className="flex-1 h-5 rounded-md shadow-xs"
                    style={{ backgroundColor: palette.primary }}
                    title={`Chính: ${palette.primary}`}
                  />
                  <div
                    className="flex-1 h-5 rounded-md shadow-xs border border-stone-200"
                    style={{ backgroundColor: palette.secondary }}
                    title={`Phụ: ${palette.secondary}`}
                  />
                  <div
                    className="flex-1 h-5 rounded-md shadow-xs"
                    style={{ backgroundColor: palette.accent }}
                    title={`Viền/Nút: ${palette.accent}`}
                  />
                </div>
              </div>

              {/* Card 4: Phụ Kiện Đang Phối (Equipped Accessories) */}
              <div className="col-span-2 p-3 rounded-2xl bg-white border border-[#8C6D53]/20 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-[#8C6D53]">
                    Phụ kiện Remix ({accessories.length} món)
                  </span>
                  <span className="text-[10px] text-[#D97706] font-bold">
                    Vùng biến tấu
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {accessories.length > 0 ? (
                    accessories.map((acc) => {
                      const hasAccKnowledge = !!ITEM_KNOWLEDGE[acc.id];
                      return (
                        <div
                          key={acc.id}
                          onClick={() => hasAccKnowledge && onOpenKnowledge?.(acc.id)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            hasAccKnowledge
                              ? 'cursor-pointer hover:scale-105 active:scale-95 shadow-xs hover:border-[#8C2D19]'
                              : ''
                          } ${
                            acc.type === 'modern'
                              ? 'bg-amber-50 text-amber-950 border-amber-200'
                              : 'bg-emerald-50 text-emerald-950 border-emerald-200'
                          }`}
                          title={hasAccKnowledge ? 'Bấm để xem thẻ kiến thức' : undefined}
                        >
                          <span className="text-sm">{acc.emoji}</span>
                          <span>{acc.name}</span>
                          {hasAccKnowledge && (
                            <span className="w-3.5 h-3.5 rounded-full bg-white/90 text-[#8C2D19] border border-[#8C2D19]/30 flex items-center justify-center text-[9px] font-bold ml-0.5 shadow-2xs">
                              ⓘ
                            </span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-xs text-stone-400 italic py-1">
                      Chưa gắn phụ kiện nào. Hãy chọn phụ kiện ở danh mục bên trái!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Seal & Inspiration Tag */}
            <div className="mt-3.5 pt-3 border-t border-[#8C6D53]/15 flex items-center justify-between text-[11px] text-[#8C6D53]">
              <span className="flex items-center gap-1">
                <span>🏷️</span>
                <span>{gender === 'female' ? 'Nàng thơ đương đại' : 'Sĩ tử Gen Z'}</span>
              </span>
              <span className="font-bold text-[#8C2D19] italic font-serif">
                Viet Remix Lookbook Approved ✦
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Hàng dưới: vùng thông báo cao CỐ ĐỊNH h-[148px] shrink-0 (luôn giữ chỗ kể cả khi không có hộp, để nhân vật không nhảy lên xuống). */}
      <div className="w-full h-[140px] shrink-0 px-3 z-30 flex items-center justify-center">
        {alertNode}
      </div>

      {/* 2. Thanh tên trang phục và niên đại ở đáy đặt ngay dưới vùng thông báo, không đè lên nhân vật */}
      <div className="w-full px-3 pb-2 pt-1 z-20 flex items-center justify-between gap-2 pointer-events-none text-[11px]">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur shadow-xs border border-[#8C6D53]/20 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.primary }} />
          <span className="font-bold text-[#2A1E17]">{costume.name}</span>
          <span
            className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
              gender === 'female' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {gender === 'female' ? 'Nữ' : 'Nam'}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[#8C6D53] px-2 py-0.5 rounded-full bg-white/80 backdrop-blur pointer-events-auto">
          <span>{costume.era.split('(')[0].trim()}</span>
        </div>
      </div>
    </div>
  );
};
