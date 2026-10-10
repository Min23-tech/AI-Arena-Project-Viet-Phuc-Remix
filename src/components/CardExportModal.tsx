import React from 'react';
import {
  CostumeItem,
  AccessoryItem,
  ColorPalette,
  EventContext,
} from '../data/fashionData';
import { Download, X, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface CardExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lookName: string;
  costume: CostumeItem;
  accessories: AccessoryItem[];
  palette: ColorPalette;
  event: EventContext;
  gender: 'female' | 'male';
  traditionalScore: number;
  modernScore: number;
  /** Lưu look hiện tại vào Tủ đồ */
  onSaveToWardrobe?: () => void;
  isSaved?: boolean;
}

export const CardExportModal: React.FC<CardExportModalProps> = ({
  isOpen,
  onClose,
  lookName,
  costume,
  accessories,
  palette,
  event,
  gender,
  traditionalScore,
  modernScore,
  onSaveToWardrobe,
  isSaved = false,
}) => {
  if (!isOpen) return null;

  const handleSave = () => {
    if (onSaveToWardrobe) onSaveToWardrobe();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Top Modal Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Thẻ Lookbook Việt Phục Remix
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Lookbook Card */}
        <div className="p-6 bg-[#FAF7F2] space-y-6" id="printable-lookbook-card">
          {/* Card Frame */}
          <div className="border-2 border-stone-800 rounded-2xl p-5 bg-white relative shadow-sm">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-stone-300 text-[10px]">✤</div>
            <div className="absolute top-2 right-2 text-stone-300 text-[10px]">✤</div>
            <div className="absolute bottom-2 left-2 text-stone-300 text-[10px]">✤</div>
            <div className="absolute bottom-2 right-2 text-stone-300 text-[10px]">✤</div>

            {/* Header info */}
            <div className="text-center pb-4 border-b border-stone-100">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 block">
                VIỆT PHỤC REMIX · GEN Z HERITAGE
              </span>
              <h2 className="text-2xl font-bold font-serif text-stone-900 mt-1">
                {lookName}
              </h2>
              <div className="text-xs text-stone-500 mt-1">
                Bối cảnh: {event.emoji} {event.name} · {gender === 'female' ? 'Nàng thơ' : 'Sĩ tử'}
              </div>
            </div>

            {/* Center Garment & Palette Details */}
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Trang Phục Chính:</span>
                <span className="font-bold text-stone-900">{costume.name}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Thời Kỳ Di Sản:</span>
                <span className="font-mono text-stone-700">{costume.era.split('(')[0]}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Sắc Màu Thể Hiện:</span>
                <span className="font-serif italic text-stone-800 flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300"
                    style={{ backgroundColor: palette.primary }}
                  />
                  {palette.poeticName}
                </span>
              </div>

              {/* Accessories listed */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                  Phụ Kiện Remix
                </span>
                <div className="flex flex-wrap gap-1">
                  {accessories.length > 0 ? (
                    accessories.map((acc) => (
                      <span
                        key={acc.id}
                        className="text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-800"
                      >
                        {acc.emoji} {acc.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400">Không phối thêm phụ kiện</span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Scores & Seal */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
              <div className="space-y-1.5 flex-1 max-w-[240px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#8C2D19] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Bản sắc {traditionalScore}%
                  </span>
                  <span className="font-bold text-[#D97706] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Remix {modernScore}%
                  </span>
                </div>
                {/* Dual spectrum bar */}
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex border border-stone-300">
                  <div
                    className="h-full bg-gradient-to-r from-[#8C2D19] to-[#C0392B]"
                    style={{ width: `${traditionalScore}%` }}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706]"
                    style={{ width: `${modernScore}%` }}
                  />
                </div>
                <span className="text-[10px] text-stone-400 block italic">
                  Tổng phổ cân bằng = 100% · Vùng lõi di sản luôn bảo tồn
                </span>
              </div>

              {/* Red Traditional Vermilion Seal Stamp */}
              <div className="w-14 h-14 rounded-lg border-2 border-rose-700 text-rose-700 p-1 flex flex-col items-center justify-center rotate-6 select-none opacity-85 shrink-0">
                <span className="text-[8px] font-bold tracking-widest leading-none">VIỆT</span>
                <span className="text-[10px] font-serif font-black leading-none my-0.5">REMIX</span>
                <span className="text-[7px] tracking-wider leading-none">ẤN CHỨNG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            Đóng
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-1.5 shadow-sm disabled:opacity-60 disabled:cursor-default"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isSaved ? 'Đã có trong Tủ đồ' : 'Lưu vào Tủ đồ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
