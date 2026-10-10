import React from 'react';
import { WardrobeCategory } from '../data/fashionData';
import { Shirt, Sparkles, Glasses, Footprints, Palette, ArrowLeft } from 'lucide-react';

interface CategorySidebarProps {
  activeCategory: WardrobeCategory;
  onSelectCategory: (category: WardrobeCategory) => void;
  equippedCounts?: Record<WardrobeCategory, number>;
  gender: 'female' | 'male';
  onToggleGender: (gender: 'female' | 'male') => void;
  onBackToOccasion?: () => void;
}

interface NavItem {
  id: WardrobeCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'costume',
    label: 'Trang phục',
    icon: Shirt,
    accentColor: '#C0392B', // Đỏ son
  },
  {
    id: 'hair',
    label: 'Kiểu tóc',
    icon: Sparkles,
    accentColor: '#8C6D53', // Nâu non
  },
  {
    id: 'accessory',
    label: 'Phụ kiện',
    icon: Glasses,
    accentColor: '#D97706', // Vàng hoa hiên
  },
  {
    id: 'footwear',
    label: 'Giày dép',
    icon: Footprints,
    accentColor: '#1E3A5F', // Xanh chàm
  },
  {
    id: 'color',
    label: 'Màu sắc',
    icon: Palette,
    accentColor: '#C0392B', // Đỏ son
  },
];

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  activeCategory,
  onSelectCategory,
  equippedCounts,
  gender,
  onToggleGender,
  onBackToOccasion,
}) => {
  return (
    <aside
      className="flex flex-col items-center py-2 sm:py-3 px-1.5 sm:px-2 gap-2 sm:gap-2.5 select-none z-20 w-20 sm:w-24 md:w-28"
      aria-label="Bộ lọc và Lựa chọn"
    >
      {/* 1. NÚT QUAY LẠI CHỌN DỊP (Nếu chọn sai chủ đề & giới tính) */}
      {onBackToOccasion && (
        <button
          type="button"
          onClick={onBackToOccasion}
          className="w-full flex items-center justify-center gap-1 py-1.5 px-1 sm:px-2 rounded-xl bg-white hover:bg-[#FAF0E6] text-[#8C2D19] border border-[#8C6D53]/25 shadow-2xs text-[11px] font-bold transition active:scale-95 group"
          title="Quay lại chọn dịp và chủ đề khác"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform shrink-0" />
          <span className="truncate">Đổi dịp</span>
        </button>
      )}

      {/* 2. BỘ CHỌN GIỚI TÍNH (GENDER SELECTION TOGGLE - NAM / NỮ) */}
      <div className="w-full flex flex-col items-center gap-1 p-1 bg-white/80 rounded-2xl border border-[#8C6D53]/20 shadow-2xs">
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#8C6D53]">
          Giới tính
        </span>
        <div className="flex w-full p-0.5 bg-[#FAF4E8] rounded-xl border border-[#8C6D53]/15">
          <button
            type="button"
            onClick={() => onToggleGender('female')}
            className={`flex-1 py-1 px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-0.5 ${
              gender === 'female'
                ? 'bg-[#C0392B] text-white shadow-xs'
                : 'text-[#8C6D53] hover:text-[#2A1E17]'
            }`}
            title="Nhân vật Nữ: Áo dài, Áo tứ thân, Nhật bình, Mấn, Hài thêu"
          >
            <span>Nữ</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleGender('male')}
            className={`flex-1 py-1 px-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-0.5 ${
              gender === 'male'
                ? 'bg-[#1E3A5F] text-white shadow-xs'
                : 'text-[#8C6D53] hover:text-[#2A1E17]'
            }`}
            title="Nhân vật Nam: Áo giao lĩnh, Áo ngũ thân nam, Khăn đóng, Guốc mộc"
          >
            <span>Nam</span>
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-[#8C6D53]/15 my-0.5" />

      {/* 3. DANH MỤC TRANG PHỤC & PHỤ KIỆN */}
      <div className="flex flex-col items-center gap-2 sm:gap-2.5 w-full">
        {NAV_ITEMS.map((item) => {
          const isActive = activeCategory === item.id;
          const Icon = item.icon;
          const count = equippedCounts ? equippedCounts[item.id] : 0;

          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className="group flex flex-col items-center justify-center transition-all duration-150 active:scale-95 focus:outline-none w-full"
              title={`Chọn danh mục ${item.label}`}
            >
              {/* Circular Button */}
              <div
                className={`relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-150 ${
                  isActive
                    ? 'bg-[#C0392B] text-[#FDFBF7] shadow-md shadow-[#C0392B]/25 ring-2 ring-[#FDFBF7] scale-105'
                    : 'bg-[#FDFBF7] text-[#8C6D53] hover:text-[#C0392B] hover:bg-white shadow-xs border border-[#8C6D53]/20 hover:border-[#C0392B]/40'
                }`}
              >
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  }`}
                />

                {/* Equipped count indicator dot */}
                {count > 0 && !isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D97706] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {count}
                  </span>
                )}
              </div>

              {/* Vietnamese Label Beneath */}
              <span
                className={`text-[10px] sm:text-[11px] font-semibold tracking-tight mt-0.5 text-center whitespace-nowrap transition-colors duration-150 ${
                  isActive
                    ? 'text-[#C0392B] font-bold'
                    : 'text-[#8C6D53] group-hover:text-[#5C4033]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
