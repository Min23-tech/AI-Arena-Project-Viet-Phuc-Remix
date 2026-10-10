import React from 'react';
import { CostumeItem } from '../data/fashionData';
import { BookOpen, Sparkles, Feather, History, Layers } from 'lucide-react';

interface CulturalCardProps {
  costume: CostumeItem;
}

export const CulturalCard: React.FC<CulturalCardProps> = ({ costume }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Editorial Header */}
      <div className="p-4 sm:p-5 border-b border-stone-100 bg-amber-50/30 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800">
              Góc Di Sản & Ý Nghĩa Văn Hóa
            </span>
            <h3 className="text-base sm:text-lg font-bold font-serif text-stone-900">
              Hồ Sơ: {costume.name}
            </h3>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-mono text-stone-500">{costume.era.split('(')[0]}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5 text-stone-700">
        {/* Origin & Historical Context */}
        <div className="flex items-start gap-3">
          <History className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-900 mb-1">
              Nguồn Gốc & Thời Kỳ
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {costume.origin}
            </p>
          </div>
        </div>

        {/* Philosophy & Meaning */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
          <Sparkles className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-900 mb-1">
              Triết Lý Nhân Sinh & Giá Trị Biểu Tượng
            </h4>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif italic">
              "{costume.philosophy}"
            </p>
          </div>
        </div>

        {/* Anatomy & Structure Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Layers className="w-4 h-4 text-amber-700" />
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-900">
              Giải Phẫu Cấu Trúc Trang Phục
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100">
              <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                • Cổ Áo (Lập Lĩnh / Cổ Đứng):
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {costume.structure.collar}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100">
              <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                • Tay Áo & Phom Dáng:
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {costume.structure.sleeves}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100">
              <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                • Thân Áo & Vạt Áo:
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {costume.structure.body}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50/80 border border-stone-100">
              <span className="text-[11px] font-bold text-amber-900 block mb-0.5">
                • Nút Cài & Khuy:
              </span>
              <p className="text-xs text-stone-600 leading-relaxed">
                {costume.structure.buttons}
              </p>
            </div>
          </div>
        </div>

        {/* Fabric & Weaver story */}
        <div className="flex items-start gap-3 pt-1 border-t border-stone-100">
          <Feather className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-stone-900 mb-1">
              Chất Liệu & Nghệ Thuật Dệt May Truyền Thống
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {costume.fabricStory}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
