import React from 'react';
import {
  CostumeItem,
  AccessoryItem,
  EventContext,
  CulturalRule,
  CULTURAL_RULES,
} from '../data/fashionData';
import {
  Sparkles,
  AlertTriangle,
  Lightbulb,
  PartyPopper,
  ShieldCheck,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HarmonyCheckerProps {
  costume: CostumeItem;
  accessories: AccessoryItem[];
  event: EventContext;
  traditionalScore: number;
  modernScore: number;
  activeAlert: CulturalRule | null;
  onDismissAlert: () => void;
}

export const HarmonyChecker: React.FC<HarmonyCheckerProps> = ({
  costume,
  accessories,
  event,
  traditionalScore,
  modernScore,
  activeAlert,
  onDismissAlert,
}) => {
  const [showAllTips, setShowAllTips] = React.useState(false);

  // Compute matched cultural advice based on current outfit
  const matchedRules = React.useMemo(() => {
    const accessoryIds = accessories.map((a) => a.id);
    return CULTURAL_RULES.filter((rule) => {
      if (rule.costumeId && rule.costumeId !== costume.id) return false;
      if (rule.eventId && rule.eventId !== event.id) return false;
      if (
        rule.requiredAccessories &&
        !rule.requiredAccessories.every((id) => accessoryIds.includes(id))
      ) {
        return false;
      }
      return true;
    });
  }, [costume, accessories, event]);

  // Determine outfit mood verdict
  const verdict = React.useMemo(() => {
    if (traditionalScore >= 85 && modernScore <= 20) {
      return {
        label: 'Thuần Di Sản (Pure Heritage)',
        desc: 'Bộ trang phục bảo tồn gần như trọn vẹn nét đoan trang cổ truyền. Rất thích hợp cho các dịp tế lễ, thăm đình chùa trang nghiêm.',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: ShieldCheck,
      };
    }
    if (traditionalScore >= 60 && modernScore >= 35) {
      return {
        label: 'Giao Thoa Tinh Tế (Harmonious Remix)',
        desc: 'Điểm cân bằng lý tưởng! Giữ cốt cách văn hóa Việt nhưng thổi vào làn gió trẻ trung, tiện lợi của đời sống Gen Z đương đại.',
        badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        icon: Sparkles,
      };
    }
    if (modernScore > 50) {
      return {
        label: 'Phá Cách Nổi Bật (High Modern Vibe)',
        desc: 'Năng lượng đường phố đậm nét! Rất ấn tượng khi chụp ảnh concept, dạo phố cafe cùng bạn bè. Nhớ lưu ý bối cảnh trang nghiêm nhé.',
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: Zap,
      };
    }
    return {
      label: 'Thời Trang Tân Cổ (Neo-Classic)',
      desc: 'Sự pha trộn duyên dáng giữa di sản và phụ kiện thường nhật.',
      badgeColor: 'bg-stone-100 text-stone-800 border-stone-300',
      icon: Info,
    };
  }, [traditionalScore, modernScore]);

  const VerdictIcon = verdict.icon;

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Real-time Toast/Popup Notification when triggered */}
      {activeAlert && (
        <div
          className={`p-4 rounded-2xl border shadow-md animate-in fade-in slide-in-from-top-2 duration-300 relative ${
            activeAlert.severity === 'warning'
              ? 'bg-amber-50/95 border-amber-300 text-amber-900'
              : activeAlert.severity === 'celebrate'
              ? 'bg-rose-50/95 border-rose-300 text-rose-900'
              : 'bg-sky-50/95 border-sky-300 text-sky-900'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white shadow-xs shrink-0">
              {activeAlert.severity === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : activeAlert.severity === 'celebrate' ? (
                <PartyPopper className="w-5 h-5 text-rose-600" />
              ) : (
                <Lightbulb className="w-5 h-5 text-sky-600" />
              )}
            </div>

            <div className="flex-1 pr-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-wider font-bold">
                  Thước Đo Văn Hóa & Cảnh Báo
                </span>
              </div>
              <h4 className="text-sm font-bold mb-1">{activeAlert.title}</h4>
              <p className="text-xs leading-relaxed opacity-95">{activeAlert.message}</p>
              {activeAlert.tip && (
                <div className="mt-2 pt-2 border-t border-black/10 text-[11px] font-medium opacity-90 flex items-center gap-1.5">
                  <span className="font-bold">✨ Bí kíp Gen Z:</span>
                  <span>{activeAlert.tip}</span>
                </div>
              )}
            </div>

            <button
              onClick={onDismissAlert}
              className="absolute top-3 right-3 text-stone-400 hover:text-stone-700 p-1 text-xs rounded"
              title="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 2. Unified 100% Spectrum Bar (Bản sắc + Remix = 100%) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Thước Đo Cân Bằng Văn Hóa (Tổng = 100%)
            </h3>
            <p className="text-sm font-bold text-[#8C2D19] mt-0.5">
              Bản sắc {traditionalScore}% · Remix {modernScore}%
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${verdict.badgeColor}`}
          >
            <VerdictIcon className="w-3.5 h-3.5" />
            <span>{verdict.label}</span>
          </div>
        </div>

        {/* Unified Spectrum Bar */}
        <div className="space-y-2 pt-1">
          <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex border border-[#8C6D53]/25 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#8C2D19] to-[#C0392B] rounded-l-full transition-all duration-500 ease-out"
              style={{ width: `${traditionalScore}%` }}
              title={`Bản sắc: ${traditionalScore}%`}
            />
            <div
              className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-r-full transition-all duration-500 ease-out"
              style={{ width: `${modernScore}%` }}
              title={`Remix: ${modernScore}%`}
            />
          </div>

          <div className="flex justify-between items-center text-xs px-1">
            <span className="font-semibold text-[#8C2D19] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Bản sắc di sản ({traditionalScore}%)
            </span>
            <span className="font-semibold text-[#D97706] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Biến tấu Remix ({modernScore}%)
            </span>
          </div>
        </div>

        {/* Rule explanation */}
        <div className="mt-3 p-3 rounded-xl bg-[#FAF0E6]/70 border border-[#D9AE8A]/30 text-xs text-[#8C2D19] leading-relaxed">
          <p>
            🔒 <strong>Vùng lõi bảo tồn:</strong> Cấu trúc y phục, cổ lập lĩnh, vạt áo luôn được khóa, giữ Bản sắc luôn <strong>từ 40% đến 100%</strong>. Bạn tự do biến tấu phụ kiện ở vùng remix tối đa 60%.
          </p>
        </div>

        {/* Verdict Explanation */}
        <div className="mt-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600 leading-relaxed">
          <span className="font-semibold text-stone-900">Đánh giá tổng quan: </span>
          {verdict.desc}
        </div>
      </div>

      {/* 3. Cultural Advice & Contextual Guidance list */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Cẩm Nang & Ghi Chú Văn Hóa
            </h3>
          </div>
          <button
            onClick={() => setShowAllTips(!showAllTips)}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 transition"
          >
            <span>{showAllTips ? 'Thu gọn' : 'Xem tất cả mẹo'}</span>
            {showAllTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="space-y-2.5">
          {matchedRules.length > 0 ? (
            matchedRules.slice(0, showAllTips ? undefined : 2).map((rule) => (
              <div
                key={rule.id}
                className="p-3 rounded-xl border border-stone-100 bg-stone-50/70 text-xs space-y-1"
              >
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <span className="text-amber-600">✦</span>
                  <span>{rule.title}</span>
                </div>
                <p className="text-stone-600 leading-relaxed">{rule.message}</p>
                {rule.tip && (
                  <p className="text-[11px] text-amber-800 font-medium pt-1">
                    👉 {rule.tip}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 rounded-xl border border-stone-100 bg-stone-50 text-xs text-stone-600">
              Bộ phối của bạn hiện đang rất an toàn và hài hòa! Bạn có thể thử kết hợp thêm các phụ kiện hiện đại như Kính râm hoặc Tai nghe over-ear để xem phản ứng văn hóa nhé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
