import React from 'react';
import {
  LookbookSavedItem,
  COSTUMES,
  COLOR_PALETTES,
  EVENTS,
  ACCESSORIES,
} from '../data/fashionData';
import { X, Trash2, ArrowUpRight, Sparkles, FolderHeart } from 'lucide-react';

interface SavedLooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLooks: LookbookSavedItem[];
  onLoadLook: (look: LookbookSavedItem) => void;
  onDeleteLook: (id: string) => void;
}

export const SavedLooksModal: React.FC<SavedLooksModalProps> = ({
  isOpen,
  onClose,
  savedLooks,
  onLoadLook,
  onDeleteLook,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-stone-900">
              Bộ Sưu Tập Của Tôi ({savedLooks.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of saved looks */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {savedLooks.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-700">
                Chưa có bộ trang phục nào được lưu
              </p>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Hãy phối một bộ đồ ưng ý trong phòng thử đồ và bấm "Lưu Vào Bộ Sưu Tập" nhé!
              </p>
            </div>
          ) : (
            savedLooks.map((look) => {
              const costume = COSTUMES.find((c) => c.id === look.costumeId);
              const palette = COLOR_PALETTES.find((p) => p.id === look.paletteId);
              const event = EVENTS.find((e) => e.id === look.eventId);

              return (
                <div
                  key={look.id}
                  className="p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/20 transition flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl border border-black/10 shrink-0 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: palette?.primary || '#d97706' }}
                    >
                      <span className="text-base">{event?.emoji || '✨'}</span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-stone-900 truncate">
                        {look.name}
                      </h4>
                      <div className="text-xs text-stone-500 flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-stone-700">{costume?.name}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-mono text-[11px]">
                          {look.traditionalScore}% Truyền thống
                        </span>
                        <span>·</span>
                        <span className="text-amber-700 font-mono text-[11px]">
                          {look.modernScore}% Gen Z
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onLoadLook(look);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1 transition shadow-xs"
                    >
                      <span>Mặc Thử</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLook(look.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Xóa khỏi bộ sưu tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
