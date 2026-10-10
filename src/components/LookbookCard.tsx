import React from 'react';
import {
  CostumeItem,
  AccessoryItem,
  ColorPalette,
  EventContext,
} from '../data/fashionData';
import { Bookmark, Download, Share2, Check, Sparkles } from 'lucide-react';

interface LookbookCardProps {
  lookName: string;
  costume: CostumeItem;
  accessories: AccessoryItem[];
  palette: ColorPalette;
  event: EventContext;
  gender: 'female' | 'male';
  traditionalScore: number;
  modernScore: number;
  isSaved: boolean;
  onSaveLook: () => void;
  onOpenCardModal: () => void;
}

export const LookbookCard: React.FC<LookbookCardProps> = ({
  lookName,
  costume,
  accessories,
  palette,
  event,
  gender,
  traditionalScore,
  modernScore,
  isSaved,
  onSaveLook,
  onOpenCardModal,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4">
      {/* Upper summary */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
            Tổng Quan Phối Đồ
          </span>
          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
            <span>{event.emoji}</span>
            <span>{event.name}</span>
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900 leading-snug">
          {lookName}
        </h3>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              Trang Phục Chính
            </span>
            <span className="font-semibold text-stone-800 line-clamp-1">
              {costume.name}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              Sắc Thái
            </span>
            <span className="font-semibold text-stone-800 line-clamp-1 flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: palette.primary }}
              />
              {palette.name}
            </span>
          </div>
        </div>

        {/* Selected accessories list */}
        <div className="mt-3">
          <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1.5">
            Phụ Kiện ({accessories.length} món)
          </span>
          <div className="flex flex-wrap gap-1.5">
            {accessories.length > 0 ? (
              accessories.map((acc) => (
                <span
                  key={acc.id}
                  className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
                    acc.type === 'modern'
                      ? 'bg-amber-50 text-amber-900 border-amber-200'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  }`}
                >
                  {acc.emoji} {acc.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-stone-400 italic">
                Chưa chọn phụ kiện nào
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
        <button
          onClick={onSaveLook}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            isSaved
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Đã Lưu Lookbook</span>
            </>
          ) : (
            <>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Lưu Vào Bộ Sưu Tập</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenCardModal}
          className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
          title="Xem & Tải Thẻ Lookbook Đẹp Mắt"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={handleCopyLink}
          className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
          title="Sao chép liên kết chia sẻ"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
