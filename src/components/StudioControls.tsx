import React from 'react';
import {
  EVENTS,
  COSTUMES,
  ACCESSORIES,
  COLOR_PALETTES,
  EventContext,
  CostumeItem,
  AccessoryItem,
  ColorPalette
} from '../data/fashionData';
import { Shuffle, RotateCcw, Check, Sparkles, SlidersHorizontal } from 'lucide-react';

interface StudioControlsProps {
  selectedEvent: EventContext;
  onSelectEvent: (event: EventContext) => void;
  selectedCostume: CostumeItem;
  onSelectCostume: (costume: CostumeItem) => void;
  selectedAccessories: AccessoryItem[];
  onToggleAccessory: (accessory: AccessoryItem) => void;
  selectedPalette: ColorPalette;
  onSelectPalette: (palette: ColorPalette) => void;
  gender: 'female' | 'male';
  onToggleGender: (gender: 'female' | 'male') => void;
  onRandomize: () => void;
  onReset: () => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  selectedEvent,
  onSelectEvent,
  selectedCostume,
  onSelectCostume,
  selectedAccessories,
  onToggleAccessory,
  selectedPalette,
  onSelectPalette,
  gender,
  onToggleGender,
  onRandomize,
  onReset,
}) => {
  const [accessoryTab, setAccessoryTab] = React.useState<'all' | 'traditional' | 'modern'>('all');

  const filteredAccessories = React.useMemo(() => {
    if (accessoryTab === 'all') return ACCESSORIES;
    return ACCESSORIES.filter((a) => a.type === accessoryTab);
  }, [accessoryTab]);

  const isAccessorySelected = (id: string) => {
    return selectedAccessories.some((a) => a.id === id);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header with Fast Action Buttons */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-amber-700" />
          <h2 className="text-base font-bold text-stone-900 uppercase tracking-wider">
            Phòng Thử Đồ Mix & Match
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRandomize}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-amber-100/80 hover:bg-amber-200/90 rounded-lg transition-colors border border-amber-300/60 shadow-xs"
            title="Tự động phối một set ngẫu nhiên cực chất"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-800" />
            <span>Phối Ngẫu Nhiên</span>
          </button>
          <button
            onClick={onReset}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
            title="Đặt lại bộ trang phục về mặc định"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Choose Event Context */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            1. Bối cảnh & Sự kiện
          </label>
          <span className="text-xs text-stone-400 font-normal">Ngữ cảnh diện trang phục</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {EVENTS.map((event) => {
            const isSelected = selectedEvent.id === event.id;
            return (
              <button
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-200/60 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/70'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{event.emoji}</span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-rose-900' : 'text-stone-800'}`}>
                    {event.name}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-1">
                  {event.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected event recommendation note */}
        <div className="mt-2 p-2 rounded-lg bg-stone-100/80 text-[11px] text-stone-600 border border-stone-200/60 flex items-start gap-1.5">
          <span className="text-amber-600 font-bold shrink-0">💡 Gợi ý:</span>
          <span>{selectedEvent.recommendation}</span>
        </div>
      </div>

      {/* 3. Choose Costume Type & Gender */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              2. Loại Việt Phục
            </label>
            <span className="text-[11px] text-stone-400">· 4 kiểu dáng tiêu biểu</span>
          </div>

          {/* Gender toggle */}
          <div className="flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => onToggleGender('female')}
              className={`px-2 py-0.5 rounded-md font-medium transition ${
                gender === 'female' ? 'bg-white text-rose-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nữ
            </button>
            <button
              onClick={() => onToggleGender('male')}
              className={`px-2 py-0.5 rounded-md font-medium transition ${
                gender === 'male' ? 'bg-white text-blue-700 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nam
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {COSTUMES.map((costume) => {
            const isSelected = selectedCostume.id === costume.id;
            return (
              <button
                key={costume.id}
                onClick={() => onSelectCostume(costume)}
                className={`p-3 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-200/60 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-amber-900' : 'text-stone-900'}`}>
                      {costume.name}
                    </span>
                    {isSelected && (
                      <span className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-400 font-mono mb-1.5">
                    {costume.era.split('(')[0]}
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                    {costume.philosophy}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-1.5 flex-wrap">
                  {costume.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Choose Color Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
            3. Bảng Màu Sắc Điệu
          </label>
          <span className="text-xs font-serif italic text-stone-700">
            {selectedPalette.poeticName}
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = selectedPalette.id === palette.id;
            return (
              <button
                key={palette.id}
                onClick={() => onSelectPalette(palette)}
                className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center gap-1.5 ${
                  isSelected
                    ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900/10 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
                title={palette.name}
              >
                <div className="relative">
                  <div
                    className="w-7 h-7 rounded-full shadow-inner border border-black/10 flex items-center justify-center"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                  </div>
                  <div
                    className="w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border border-white shadow-xs"
                    style={{ backgroundColor: palette.secondary }}
                  />
                </div>
                <span className="text-[10px] font-medium text-stone-700 truncate w-full">
                  {palette.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Mix Accessories (Traditional vs Modern) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              4. Phối Phụ Kiện
            </label>
            <span className="text-[11px] text-stone-400">
              ({selectedAccessories.length} món đang chọn)
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center p-0.5 bg-stone-100 rounded-lg text-xs border border-stone-200">
            <button
              onClick={() => setAccessoryTab('all')}
              className={`px-2 py-0.5 rounded-md font-medium transition ${
                accessoryTab === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Tất Cả
            </button>
            <button
              onClick={() => setAccessoryTab('traditional')}
              className={`px-2 py-0.5 rounded-md font-medium transition ${
                accessoryTab === 'traditional' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Cổ Điển
            </button>
            <button
              onClick={() => setAccessoryTab('modern')}
              className={`px-2 py-0.5 rounded-md font-medium transition ${
                accessoryTab === 'modern' ? 'bg-white text-amber-800 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Hiện Đại
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredAccessories.map((acc) => {
            const selected = isAccessorySelected(acc.id);
            return (
              <button
                key={acc.id}
                onClick={() => onToggleAccessory(acc)}
                className={`p-2.5 rounded-xl text-left border transition-all flex items-start justify-between gap-2 ${
                  selected
                    ? acc.type === 'modern'
                      ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-200/50'
                      : 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-200/50'
                    : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/80'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl p-1 bg-stone-100 rounded-lg">{acc.emoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900">{acc.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                          acc.type === 'modern'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {acc.type === 'modern' ? 'Gen Z' : 'Cổ Điển'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {acc.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition ${
                    selected
                      ? acc.type === 'modern'
                        ? 'bg-amber-500 border-amber-600 text-white'
                        : 'bg-emerald-600 border-emerald-700 text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
