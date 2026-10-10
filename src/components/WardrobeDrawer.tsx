import React from 'react';
import {
  CostumeItem,
  AccessoryItem,
  ColorPalette,
  HairstyleItem,
  WardrobeCategory,
  COSTUMES,
  ACCESSORIES,
  COLOR_PALETTES,
  HAIRSTYLES,
  CATEGORY_TABS,
  SLOT_LABELS,
} from '../data/fashionData';
import { ItemThumbnail } from './ItemThumbnail';
import { Check, ChevronDown, ChevronUp, Sparkles, X, Shield, RefreshCw, Info } from 'lucide-react';
import { ITEM_KNOWLEDGE } from '../data/itemKnowledge';

interface WardrobeDrawerProps {
  category: WardrobeCategory;
  selectedCostume: CostumeItem;
  onSelectCostume: (costume: CostumeItem) => void;
  selectedAccessories: AccessoryItem[];
  onToggleAccessory: (accessory: AccessoryItem) => void;
  selectedPalette: ColorPalette;
  onSelectPalette: (palette: ColorPalette) => void;
  selectedHair: HairstyleItem;
  onSelectHair: (hair: HairstyleItem) => void;
  gender: 'female' | 'male';
  isCollapsedMobile: boolean;
  onToggleCollapseMobile: () => void;
  onOpenKnowledge?: (itemId: string) => void;
}

export const WardrobeDrawer: React.FC<WardrobeDrawerProps> = ({
  category,
  selectedCostume,
  onSelectCostume,
  selectedAccessories,
  onToggleAccessory,
  selectedPalette,
  onSelectPalette,
  selectedHair,
  onSelectHair,
  gender,
  isCollapsedMobile,
  onToggleCollapseMobile,
  onOpenKnowledge,
}) => {
  const currentCategoryInfo = CATEGORY_TABS.find((t) => t.id === category) || CATEGORY_TABS[0];

  const isAccessoryEquipped = (id: string) => {
    return selectedAccessories.some((a) => a.id === id);
  };

  // Filter items by current gender: show items matching gender or 'unisex'
  const filteredCostumes = COSTUMES.filter((c) => c.gender === gender || c.gender === 'unisex');
  const filteredHairstyles = HAIRSTYLES.filter((h) => h.gender === gender);
  const footwearItems = ACCESSORIES.filter(
    (a) => a.category === 'feet' && (a.gender === gender || a.gender === 'unisex')
  );
  const nonFootwearAccessories = ACCESSORIES.filter(
    (a) => a.category !== 'feet' && (a.gender === gender || a.gender === 'unisex')
  );

  return (
    <div
      className={`transition-all duration-200 ease-out select-none flex flex-col bg-[#FDFBF7] border-[#8C6D53]/20 shadow-lg ${
        /* On mobile: sliding drawer at bottom. On desktop: fixed panel on the right */
        'w-full md:w-80 lg:w-96 md:h-full md:border-l md:rounded-none rounded-t-3xl border-t md:border-t-0'
      }`}
    >
      {/* Mobile Drawer Handle & Toggle Bar */}
      <div
        onClick={onToggleCollapseMobile}
        className="md:hidden flex flex-col items-center justify-center pt-2.5 pb-2 cursor-pointer border-b border-[#8C6D53]/10 hover:bg-[#FAF6EE]"
      >
        <div className="w-10 h-1 bg-[#8C6D53]/30 rounded-full mb-1" />
        <div className="flex items-center justify-between w-full px-4 text-xs font-semibold text-[#8C6D53]">
          <span className="flex items-center gap-1.5 text-[#C0392B]">
            <span className="w-2 h-2 rounded-full bg-[#C0392B]" />
            <span>Ngăn: {currentCategoryInfo.label}</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#8C6D53]">
            {isCollapsedMobile ? 'Mở ngăn đồ' : 'Thu gọn'}
            {isCollapsedMobile ? (
              <ChevronUp className="w-3.5 h-3.5 text-[#C0392B]" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-[#8C6D53]" />
            )}
          </span>
        </div>
      </div>

      {/* Content wrapper (collapsible on mobile, always visible on desktop) */}
      <div
        className={`${
          isCollapsedMobile ? 'hidden md:flex' : 'flex'
        } flex-col flex-1 min-h-0 overflow-hidden`}
      >
        {/* Drawer Header (Desktop & Expanded Mobile) */}
        <div className="hidden md:flex items-center justify-between p-4 pb-3 border-b border-[#8C6D53]/15 bg-[#FAF6EE]/80">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D53]/80">
              Ngăn Chứa Đồ
            </div>
            <h3 className="text-base font-bold text-[#2A1E17] font-serif flex items-center gap-2">
              <span>{currentCategoryInfo.label}</span>
            </h3>
          </div>
          <span className="text-[11px] text-[#8C6D53] italic max-w-[160px] text-right truncate">
            {currentCategoryInfo.shortDesc}
          </span>
        </div>

        {/* Scrollable Item Grid */}
        <div className="p-3 sm:p-4 overflow-y-auto max-h-[46vh] md:max-h-none flex-1 space-y-3">
          {/* TAB 1: TRANG PHỤC */}
          {category === 'costume' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8C6D53] font-medium flex items-center justify-between">
                <span>Chọn 1 trang phục ({gender === 'female' ? 'Nữ & Unisex' : 'Nam & Unisex'}):</span>
                <span className="text-[#C0392B] text-[10px] font-bold">🔒 Vùng Lõi Bản Sắc</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {filteredCostumes.map((item) => {
                  const isEquipped = selectedCostume.id === item.id;
                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={item.id}
                      onClick={() => onSelectCostume(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectCostume(item);
                        }
                      }}
                      className={`group relative p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.98] select-none ${
                        isEquipped
                          ? 'bg-[#FAF6EE] border-[#C0392B] ring-2 ring-[#C0392B]/20 shadow-sm'
                          : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/50 hover:bg-[#FAF6EE]/40'
                      }`}
                    >
                      {/* Thumbnail & Badges */}
                      <div className="flex items-start justify-between gap-1.5 mb-2 w-full">
                        <ItemThumbnail
                          type="costume"
                          itemId={item.id}
                          palette={selectedPalette}
                          gender={gender}
                          className="w-14 h-14"
                        />
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {ITEM_KNOWLEDGE[item.id] && onOpenKnowledge && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenKnowledge(item.id);
                                }}
                                className="w-5 h-5 rounded-full bg-white hover:bg-[#FAF6EE] text-[#8C6D53] hover:text-[#8C2D19] border border-[#8C6D53]/25 flex items-center justify-center transition shadow-xs cursor-pointer z-10"
                                title="Xem thẻ kiến thức"
                              >
                                <Info className="w-3 h-3" />
                              </button>
                            )}
                            {isEquipped && (
                              <span className="w-5 h-5 rounded-full bg-[#C0392B] text-white flex items-center justify-center text-[10px]">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#C0392B] font-semibold border border-[#C0392B]/30">
                            <Shield className="w-2.5 h-2.5" />
                            Vùng Lõi
                          </span>
                        </div>
                      </div>

                      {/* Item Title & Details */}
                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isEquipped ? 'text-[#C0392B]' : 'text-[#2A1E17]'
                          }`}
                        >
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-[#8C6D53] mt-1 line-clamp-2">
                          {item.structure.collar}
                        </p>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-[#8C6D53]/10 text-[9px] text-[#8C6D53]/80 font-mono">
                        {item.era.split('(')[0].trim()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: KIỂU TÓC */}
          {category === 'hair' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8C6D53] font-medium flex items-center justify-between">
                <span>Kiểu tóc ({gender === 'female' ? 'Nữ' : 'Nam'}):</span>
                <span className="text-[#8C6D53] text-[10px] font-semibold">Tự nhiên & Chuẩn mực</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {filteredHairstyles.map((hair) => {
                  const isEquipped = selectedHair.id === hair.id;
                  const isCore = hair.traditionType === 'vung_loi';

                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={hair.id}
                      onClick={() => onSelectHair(hair)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectHair(hair);
                        }
                      }}
                      className={`relative p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] ${
                        isEquipped
                          ? 'bg-[#FAF6EE] border-[#C0392B] ring-2 ring-[#C0392B]/20 shadow-sm'
                          : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/50 hover:bg-[#FAF6EE]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-2">
                        <ItemThumbnail
                          type="hair"
                          itemId={hair.id}
                          palette={selectedPalette}
                          gender={hair.gender}
                          className="w-14 h-14"
                        />
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {ITEM_KNOWLEDGE[hair.id] && onOpenKnowledge && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenKnowledge(hair.id);
                                }}
                                className="w-5 h-5 rounded-full bg-white hover:bg-[#FAF6EE] text-[#8C6D53] hover:text-[#8C2D19] border border-[#8C6D53]/25 flex items-center justify-center transition shadow-xs cursor-pointer z-10"
                                title="Xem thẻ kiến thức"
                              >
                                <Info className="w-3 h-3" />
                              </button>
                            )}
                            {isEquipped && (
                              <span className="w-4 h-4 rounded-full bg-[#C0392B] text-white flex items-center justify-center text-[10px]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                              isCore
                                ? 'bg-[#FAF0E6] text-[#C0392B] border border-[#C0392B]/30'
                                : 'bg-[#EBF5FB] text-[#1E3A5F] border border-[#1E3A5F]/20'
                            }`}
                          >
                            {isCore ? 'Cổ Điển' : 'Tân Thời'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold ${
                            isEquipped ? 'text-[#C0392B]' : 'text-[#2A1E17]'
                          }`}
                        >
                          {hair.name}
                        </h4>
                        <p className="text-[10px] text-[#8C6D53] mt-0.5 line-clamp-2">
                          {hair.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PHỤ KIỆN */}
          {category === 'accessory' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8C6D53] font-medium flex items-center justify-between">
                <span>Chọn phụ kiện (1 món / 1 ô cơ thể):</span>
                <span className="text-[#D97706] text-[10px] font-bold">⚡ Vùng Remix & Cổ Điển</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {nonFootwearAccessories.map((acc) => {
                  const isEquipped = isAccessoryEquipped(acc.id);
                  const isModern = acc.type === 'modern';

                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={acc.id}
                      onClick={() => onToggleAccessory(acc)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onToggleAccessory(acc);
                        }
                      }}
                      className={`relative p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] ${
                        isEquipped
                          ? 'bg-[#FAF6EE] border-[#C0392B] ring-2 ring-[#C0392B]/20 shadow-sm'
                          : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/50 hover:bg-[#FAF6EE]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-2">
                        <ItemThumbnail
                          type="accessory"
                          itemId={acc.id}
                          palette={selectedPalette}
                          className="w-14 h-14"
                        />
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {ITEM_KNOWLEDGE[acc.id] && onOpenKnowledge && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenKnowledge(acc.id);
                                }}
                                className="w-5 h-5 rounded-full bg-white hover:bg-[#FAF6EE] text-[#8C6D53] hover:text-[#8C2D19] border border-[#8C6D53]/25 flex items-center justify-center transition shadow-xs cursor-pointer z-10"
                                title="Xem thẻ kiến thức"
                              >
                                <Info className="w-3 h-3" />
                              </button>
                            )}
                            {isEquipped && (
                              <span className="w-4 h-4 rounded-full bg-[#C0392B] text-white flex items-center justify-center text-[10px]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#FAF0E6] text-[#8C2D19] font-medium border border-[#D9AE8A]/40">
                            Ô: {SLOT_LABELS[acc.slot]}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                              isModern
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {isModern ? '⚡ Remix' : '🔒 Cổ truyền'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isEquipped ? 'text-[#C0392B]' : 'text-[#2A1E17]'
                          }`}
                        >
                          {acc.name}
                        </h4>
                        <p className="text-[10px] text-[#8C6D53] mt-0.5 line-clamp-1">
                          {acc.description}
                        </p>
                      </div>

                      <div className="mt-2 text-[9px] text-[#8C6D53] italic">
                        {isEquipped ? '✓ Đang mặc (Bấm để gỡ)' : '+ Bấm để đeo'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GIÀY DÉP */}
          {category === 'footwear' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8C6D53] font-medium flex items-center justify-between">
                <span>Chọn 1 đôi giày dép (bấm đôi khác để đổi):</span>
                <span className="text-[#1E3A5F] text-[10px] font-bold">Hài / Guốc / Sneaker</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {footwearItems.map((item) => {
                  const isEquipped = isAccessoryEquipped(item.id);
                  const isModern = item.type === 'modern';

                  return (
                    <div
                      role="button"
                      tabIndex={0}
                      key={item.id}
                      onClick={() => onToggleAccessory(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onToggleAccessory(item);
                        }
                      }}
                      className={`relative p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between cursor-pointer select-none active:scale-[0.98] ${
                        isEquipped
                          ? 'bg-[#FAF6EE] border-[#C0392B] ring-2 ring-[#C0392B]/20 shadow-sm'
                          : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/50 hover:bg-[#FAF6EE]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between w-full mb-2">
                        <ItemThumbnail
                          type="footwear"
                          itemId={item.id}
                          palette={selectedPalette}
                          className="w-14 h-14"
                        />
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            {ITEM_KNOWLEDGE[item.id] && onOpenKnowledge && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenKnowledge(item.id);
                                }}
                                className="w-5 h-5 rounded-full bg-white hover:bg-[#FAF6EE] text-[#8C6D53] hover:text-[#8C2D19] border border-[#8C6D53]/25 flex items-center justify-center transition shadow-xs cursor-pointer z-10"
                                title="Xem thẻ kiến thức"
                              >
                                <Info className="w-3 h-3" />
                              </button>
                            )}
                            {isEquipped && (
                              <span className="w-4 h-4 rounded-full bg-[#C0392B] text-white flex items-center justify-center text-[10px]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                              isModern
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            }`}
                          >
                            {isModern ? '⚡ Remix' : '🔒 Vùng Lõi'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isEquipped ? 'text-[#C0392B]' : 'text-[#2A1E17]'
                          }`}
                        >
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-[#8C6D53] mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-2 text-[9px] text-[#8C6D53] italic">
                        {isEquipped ? '✓ Đang mang' : '+ Bấm để mang'}
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>
          )}

          {/* TAB 5: MÀU SẮC */}
          {category === 'color' && (
            <div className="space-y-2.5">
              <div className="text-[11px] text-[#8C6D53] font-medium flex items-center justify-between">
                <span>Chọn bảng màu sắc điệu:</span>
                <span className="text-[#C0392B] text-[10px] font-bold">⚡ Vùng Remix Màu Sắc</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {COLOR_PALETTES.map((palette) => {
                  const isEquipped = selectedPalette.id === palette.id;

                  return (
                    <button
                      key={palette.id}
                      onClick={() => onSelectPalette(palette)}
                      className={`p-3 rounded-2xl text-left border transition-all duration-150 flex flex-col justify-between ${
                        isEquipped
                          ? 'bg-[#FAF6EE] border-[#C0392B] ring-2 ring-[#C0392B]/20 shadow-sm'
                          : 'bg-white border-[#8C6D53]/20 hover:border-[#8C6D53]/50 hover:bg-[#FAF6EE]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="relative">
                          <div
                            className="w-8 h-8 rounded-full border border-black/10 shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: palette.primary }}
                          >
                            {isEquipped && <Check className="w-4 h-4 text-white drop-shadow" />}
                          </div>
                          <div
                            className="w-3.5 h-3.5 rounded-full absolute -bottom-0.5 -right-0.5 border border-white shadow-xs"
                            style={{ backgroundColor: palette.secondary }}
                          />
                        </div>

                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white text-[#8C6D53] border border-[#8C6D53]/20">
                          {palette.tag.split('&')[0].trim()}
                        </span>
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isEquipped ? 'text-[#C0392B]' : 'text-[#2A1E17]'
                          }`}
                        >
                          {palette.name}
                        </h4>
                        <p className="text-[10px] text-[#8C6D53] font-serif italic mt-0.5">
                          {palette.poeticName}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
