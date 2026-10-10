/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  EVENTS,
  COSTUMES,
  ACCESSORIES,
  COLOR_PALETTES,
  LOOKBOOK_NAMES,
  CULTURAL_RULES,
  HAIRSTYLES,
  OCCASION_TEMPLATES,
  OccasionTemplate,
  calculateIdentityRemixScore,
  EventContext,
  CostumeItem,
  AccessoryItem,
  ColorPalette,
  HairstyleItem,
  CulturalRule,
  LookbookSavedItem,
  WardrobeCategory,
} from './data/fashionData';
import { MannequinVisualizer, ZoneHighlightMode } from './components/MannequinVisualizer';
import { CategorySidebar } from './components/CategorySidebar';
import { WardrobeDrawer } from './components/WardrobeDrawer';
import { HarmonyChecker } from './components/HarmonyChecker';
import { CulturalCard } from './components/CulturalCard';
import { CardExportModal } from './components/CardExportModal';
import { SavedLooksModal } from './components/SavedLooksModal';
import { SpectrumMeter } from './components/SpectrumMeter';
import { OccasionSelectView } from './components/OccasionSelectView';
import { IntroOpeningGate } from './components/IntroOpeningGate';
import { WelcomeGate } from './components/WelcomeGate';
import { KnowledgeCardModal } from './components/KnowledgeCardModal';
import { RentalMapModal } from './components/RentalMapModal';

// Logo mèo của nhóm (ảnh nhúng sẵn, không cần file riêng)
const LOGO_CAT = 'data:image/jpeg;base64,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';
import { ITEM_KNOWLEDGE } from './data/itemKnowledge';
import {
  Sparkles,
  Bookmark,
  Shuffle,
  ShieldCheck,
  Zap,
  RotateCcw,
  BookOpen,
  Share2,
  Download,
  X,
  AlertTriangle,
  Lightbulb,
  Compass,
  Check,
  MapPin,
} from 'lucide-react';

export interface CulturalBoxAlert {
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  tip?: string;
  id: number;
}


// ===== Trợ lý AI tư vấn (chatbot) =====
// Ảnh đại diện trợ lý (mèo đeo kính), nhúng sẵn
const BOT_AVATAR = 'data:image/jpeg;base64,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';

type AdvisorMsg = { role: 'user' | 'model'; text: string };
const ADVISOR_SUGGESTIONS = ['Đi kỷ yếu nên mặc gì?', 'Áo tấc là gì?', 'Đi chùa đầu năm mặc sao cho hợp?', 'Phối màu đi chơi Tết'];

// Gom danh mục trang phục của app để AI chỉ gợi ý những gì app có
const buildAdvisorCatalog = (): string => {
  const g = (x: string) => (x === 'male' ? 'nam' : x === 'female' ? 'nữ' : 'nam/nữ');
  return [
    'TRANG PHỤC: ' + COSTUMES.map((c) => `${c.name} (${g(c.gender)}, ${c.era})`).join('; '),
    'DỊP MẪU: ' + OCCASION_TEMPLATES.map((o) => `${o.name} → ${o.mainCostumeText}; màu: ${o.colorText}; phụ kiện: ${o.accessoriesText}; lưu ý: ${o.behaviorTip}`).join(' | '),
    'KIỂU TÓC: ' + HAIRSTYLES.map((h) => `${h.name} (${g(h.gender)})`).join('; '),
    'PHỤ KIỆN: ' + ACCESSORIES.map((a) => `${a.name} (${a.type === 'traditional' ? 'truyền thống' : 'hiện đại'})`).join('; '),
    'BẢNG MÀU: ' + COLOR_PALETTES.map((p) => p.poeticName || p.name).join('; '),
    'SỰ KIỆN: ' + EVENTS.map((e) => e.name).join('; '),
  ].join('\n');
};

function AdvisorChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<AdvisorMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<string>('');

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [msgs, loading, open]);

  const send = async (raw: string) => {
    const q = raw.trim().slice(0, 500);
    if (!q || loading) return;
    if (!catalogRef.current) catalogRef.current = buildAdvisorCatalog();
    const next: AdvisorMsg[] = [...msgs, { role: 'user', text: q }];
    setMsgs(next);
    setInput('');
    setErr('');
    setLoading(true);
    try {
      const r = await fetch('/api/chat-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next, catalog: catalogRef.current }),
      });
      const j: any = await r.json().catch(() => ({}));
      if (!r.ok || !j.text) throw new Error(j.error || 'Trợ lý đang bận, bạn thử lại sau ít giây nhé.');
      setMsgs((m) => [...m, { role: 'model', text: j.text }]);
    } catch (e: any) {
      // Gỡ câu hỏi vừa gửi để lần sau gửi lại không bị lặp
      setMsgs((m) => m.slice(0, -1));
      setInput(q);
      setErr(e?.message || 'Có lỗi, bạn thử lại nhé.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed right-3 sm:right-5 bottom-[84px] z-40 w-[calc(100vw-24px)] sm:w-[370px] h-[70vh] max-h-[540px] bg-[#FDFBF7] border border-[#8C6D53]/25 rounded-[20px] shadow-[0_20px_50px_rgba(42,30,23,0.25)] flex flex-col overflow-hidden">
          <div className="flex items-center gap-2.5 px-3.5 py-3 bg-[#8C2D19] text-white shrink-0">
            <img src={BOT_AVATAR} alt="Trợ lý Việt phục" className="w-9 h-9 rounded-full object-cover border-2 border-white/70" draggable={false} />
            <div className="flex-1 leading-tight">
              <div className="font-bold text-sm">Trợ lý Việt phục</div>
              <div className="text-[11px] opacity-85">Hỏi mặc gì, dịp nào – AI tư vấn</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng trợ lý" className="w-8 h-8 rounded-full hover:bg-white/15 text-lg leading-none">✕</button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3.5 flex flex-col gap-2.5 text-[13px] leading-relaxed text-[#2A1E17]">
            <div className="self-start max-w-[88%] bg-[#F3E7D3] px-3 py-2 rounded-2xl rounded-bl-sm">
              Chào bạn! Mình là Trợ lý Việt phục 🌸 Kể mình nghe bạn sắp đi đâu, bạn là nam hay nữ, dáng người và nước da thế nào, mình sẽ gợi ý bộ hợp nhất nhé.
            </div>
            {msgs.map((m, i) => (
              <div
                key={i}
                className={m.role === 'user'
                  ? 'self-end max-w-[85%] bg-[#8C2D19] text-white px-3 py-2 rounded-2xl rounded-br-sm whitespace-pre-line'
                  : 'self-start max-w-[88%] bg-[#F3E7D3] px-3 py-2 rounded-2xl rounded-bl-sm whitespace-pre-line'}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="self-start bg-[#F3E7D3] px-3 py-2 rounded-2xl rounded-bl-sm text-[#8C6D53] italic">Trợ lý đang suy nghĩ…</div>
            )}
            {err && <div className="self-center text-[12px] text-[#C0392B] text-center px-2">{err}</div>}
          </div>

          {msgs.length === 0 && (
            <div className="flex flex-wrap gap-1.5 px-3.5 pb-2 shrink-0">
              {ADVISOR_SUGGESTIONS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} disabled={loading}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-[#8C2D19]/35 text-[#8C2D19] bg-white hover:bg-[#F3E7D3] disabled:opacity-50">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex gap-2 px-3 py-2.5 border-t border-[#8C6D53]/20 bg-white shrink-0"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Hỏi trợ lý…"
              className="flex-1 min-w-0 border border-[#8C6D53]/30 rounded-full px-3.5 py-2 text-[13px] outline-none focus:border-[#8C2D19]"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Gửi câu hỏi"
              className="w-9 h-9 rounded-full bg-[#8C2D19] text-white grid place-items-center disabled:opacity-40 shrink-0">➤</button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed right-3 sm:right-5 bottom-4 sm:bottom-5 z-40 flex items-center gap-2 bg-[#8C2D19] hover:bg-[#7A2414] text-white pl-1.5 pr-4 py-1.5 rounded-full shadow-[0_10px_25px_rgba(140,45,25,0.35)] text-[13px] font-semibold"
      >
        <img src={BOT_AVATAR} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-white" draggable={false} />
        {open ? 'Đóng trợ lý' : 'Hỏi trợ lý AI'}
      </button>
    </>
  );
}

export default function App() {
  // INTRO OPENING VIDEO: Chạy khi mở app lần đầu, sau đó chuyển vào giao diện chính
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // NAVIGATION SCREEN: 'occasion_select' (Màn hình đầu tiên khi mở app) hoặc 'dressing_room' (Phòng phối đồ)
  const [currentScreen, setCurrentScreen] = useState<'occasion_select' | 'dressing_room'>('occasion_select');
  const [selectedTemplate, setSelectedTemplate] = useState<OccasionTemplate | null>(null);

  // 1. DRESS-UP GAME STATE
  const [activeCategory, setActiveCategory] = useState<WardrobeCategory>('costume');
  const [isCollapsedMobile, setIsCollapsedMobile] = useState<boolean>(false);
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Tự động ẩn Header và Sidebar khi mở Tủ đồ trên mobile để tối ưu tầm nhìn
  useEffect(() => {
    if (!isCollapsedMobile) {
      setIsHeaderCollapsed(true);
      setIsSidebarCollapsed(true);
    }
  }, [isCollapsedMobile]);
  // Chiều cao thật của thanh trên (thanh trên tự xuống dòng nên cao thấp khác nhau) -> dùng để chừa chỗ trên điện thoại
  const headerRef = useRef<HTMLElement>(null);
  const [headerH, setHeaderH] = useState(56);
  useEffect(() => {
    const el = headerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setHeaderH(el.offsetHeight));
    ro.observe(el);
    setHeaderH(el.offsetHeight);
    return () => ro.disconnect();
  }, [currentScreen, showIntro]);
  const [zoneHighlight, setZoneHighlight] = useState<ZoneHighlightMode>('none');

  // Outfit selections
  const [selectedEvent, setSelectedEvent] = useState<EventContext>(EVENTS[0]); // Tết
  const [selectedCostume, setSelectedCostume] = useState<CostumeItem>(COSTUMES[0]); // Áo ngũ thân lập lĩnh
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryItem[]>([
    ACCESSORIES.find((a) => a.id === 'sneaker')!,
    ACCESSORIES.find((a) => a.id === 'khan_van') || ACCESSORIES[0],
  ]);
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(COLOR_PALETTES[0]);
  const [selectedHair, setSelectedHair] = useState<HairstyleItem>(HAIRSTYLES[0]);
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [lookName, setLookName] = useState<string>('Nàng Thơ Gen Z');

  // 2. MODALS STATE
  const [isHarmonyModalOpen, setIsHarmonyModalOpen] = useState(false);
  const [isCultureModalOpen, setIsCultureModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isRentalMapOpen, setIsRentalMapOpen] = useState(false);
  const [knowledgeModalItemId, setKnowledgeModalItemId] = useState<string | null>(null);
  const [visualizerViewMode, setVisualizerViewMode] = useState<'silhouette' | 'moodboard'>('silhouette');
  const [culturalAlert, setCulturalAlert] = useState<CulturalBoxAlert | null>(null);
  const [isAlertFading, setIsAlertFading] = useState(false);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInteractedRef = useRef<boolean>(false);
  const [friendlyNotice, setFriendlyNotice] = useState<{
    title: string;
    message: string;
    suggestion?: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // 3. SAVED LOOKS (Local persistence)
  const [savedLooks, setSavedLooks] = useState<LookbookSavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('viet_remix_saved_looks');
      if (stored) return JSON.parse(stored);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'preset-1',
        name: 'Sĩ Tử Thời @',
        createdAt: new Date().toISOString(),
        eventId: 'graduation',
        costumeId: 'ngu_than',
        accessoryIds: ['sneaker', 'tote_bag'],
        paletteId: 'lam_ngoc',
        gender: 'male',
        traditionalScore: 78,
        modernScore: 42,
      },
      {
        id: 'preset-2',
        name: 'Nàng Thơ Dạo Phố',
        createdAt: new Date().toISOString(),
        eventId: 'streetwear',
        costumeId: 'ao_dai_tan_thoi',
        accessoryIds: ['sneaker', 'sunglasses', 'tote_bag'],
        paletteId: 'sen_hong',
        gender: 'female',
        traditionalScore: 66,
        modernScore: 54,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('viet_remix_saved_looks', JSON.stringify(savedLooks));
    } catch {
      // ignore
    }
  }, [savedLooks]);

  // 4. SCORE CALCULATION (Bản sắc + Remix = 100%)
  const { traditionalScore, modernScore, identityPercent, remixPercent } = useMemo(() => {
    const res = calculateIdentityRemixScore(
      selectedAccessories,
      selectedHair,
      selectedPalette
    );
    return {
      traditionalScore: res.identityPercent,
      modernScore: res.remixPercent,
      identityPercent: res.identityPercent,
      remixPercent: res.remixPercent,
    };
  }, [selectedAccessories, selectedHair, selectedPalette]);

  // Handlers for Occasion Templates & Reset to original template
  const handleSelectTemplate = (template: OccasionTemplate) => {
    setSelectedTemplate(template);
    const costume = COSTUMES.find((c) => c.id === template.costumeId) || COSTUMES[0];
    const palette = COLOR_PALETTES.find((p) => p.id === template.paletteId) || COLOR_PALETTES[0];
    const hair = HAIRSTYLES.find((h) => h.id === template.hairId) || HAIRSTYLES[0];
    const accs = ACCESSORIES.filter((a) => template.accessoryIds.includes(a.id));

    setSelectedCostume(costume);
    setSelectedPalette(palette);
    setSelectedHair(hair);
    setGender(template.gender);
    setSelectedAccessories(accs);
    setLookName(template.name);
    setCurrentScreen('dressing_room');
    triggerToast(`Đã chọn dịp: ${template.name}`);
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setCurrentScreen('dressing_room');
    triggerToast('Đã vào phòng phối đồ tự do!');
  };

  const handleResetToTemplate = () => {
    if (!selectedTemplate) return;
    const costume = COSTUMES.find((c) => c.id === selectedTemplate.costumeId) || COSTUMES[0];
    const palette = COLOR_PALETTES.find((p) => p.id === selectedTemplate.paletteId) || COLOR_PALETTES[0];
    const hair = HAIRSTYLES.find((h) => h.id === selectedTemplate.hairId) || HAIRSTYLES[0];
    const accs = ACCESSORIES.filter((a) => selectedTemplate.accessoryIds.includes(a.id));

    setSelectedCostume(costume);
    setSelectedPalette(palette);
    setSelectedHair(hair);
    setGender(selectedTemplate.gender);
    setSelectedAccessories(accs);
    setLookName(selectedTemplate.name);
    triggerToast(`Đã hoàn tác về bộ mẫu gốc: ${selectedTemplate.name}!`);
  };

  const isModifiedFromTemplate = useMemo(() => {
    if (!selectedTemplate) return false;
    if (selectedCostume.id !== selectedTemplate.costumeId) return true;
    if (selectedPalette.id !== selectedTemplate.paletteId) return true;
    if (selectedHair.id !== selectedTemplate.hairId) return true;
    const currentAccIds = selectedAccessories.map((a) => a.id).sort().join(',');
    const tmplAccIds = [...selectedTemplate.accessoryIds].sort().join(',');
    return currentAccIds !== tmplAccIds;
  }, [selectedTemplate, selectedCostume, selectedPalette, selectedHair, selectedAccessories]);

  // 5. CULTURAL HARMONY DETECTOR (VIỆC 3)
  useEffect(() => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
    setIsAlertFading(false);

    // Bỏ qua lần render đầu tiên khi chưa có tương tác từ người dùng
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      return;
    }

    const accessoryIds = selectedAccessories.map((a) => a.id);

    // 1. Kiểm tra luật CẢNH BÁO (severity === 'warning'): KHÔNG tự ẩn
    const warningRule = CULTURAL_RULES.find((rule) => {
      if (rule.severity !== 'warning') return false;
      if (rule.costumeId) {
        if (rule.costumeId === 'ngu_than') {
          if (selectedCostume.id !== 'ngu_than' && selectedCostume.id !== 'ngu_than_nam') return false;
        } else if (rule.costumeId !== selectedCostume.id) {
          return false;
        }
      }
      if (rule.eventId && rule.eventId !== selectedEvent.id) return false;
      if (
        rule.requiredAccessories &&
        !rule.requiredAccessories.every((id) => accessoryIds.includes(id))
      ) {
        return false;
      }
      // cần có ít nhất MỘT trong các món này (vd: luật tai nghe chỉ áp dụng khi đang đội khăn vấn / khăn đóng / mấn)
      if (rule.requiredAnyAccessories && !rule.requiredAnyAccessories.some((id) => accessoryIds.includes(id))) {
        return false;
      }
      return true;
    });

    if (warningRule) {
      setCulturalAlert({
        type: 'warning',
        title: warningRule.title,
        message: warningRule.message,
        tip: warningRule.tip,
        id: Date.now(),
      });
      return;
    }

    // 2. Kiểm tra luật LƯU Ý NHẸ (severity === 'info'): tự ẩn sau 8 giây
    const infoRule = CULTURAL_RULES.find((rule) => {
      if (rule.severity !== 'info') return false;
      if (rule.costumeId) {
        if (rule.costumeId === 'ngu_than') {
          if (selectedCostume.id !== 'ngu_than' && selectedCostume.id !== 'ngu_than_nam') return false;
        } else if (rule.costumeId !== selectedCostume.id) {
          return false;
        }
      }
      if (rule.eventId && rule.eventId !== selectedEvent.id) return false;
      if (
        rule.requiredAccessories &&
        !rule.requiredAccessories.every((id) => accessoryIds.includes(id))
      ) {
        return false;
      }
      // cần có ít nhất MỘT trong các món này (vd: luật tai nghe chỉ áp dụng khi đang đội khăn vấn / khăn đóng / mấn)
      if (rule.requiredAnyAccessories && !rule.requiredAnyAccessories.some((id) => accessoryIds.includes(id))) {
        return false;
      }
      return true;
    });

    if (infoRule) {
      setCulturalAlert({
        type: 'info',
        title: infoRule.title,
        message: infoRule.message,
        tip: infoRule.tip,
        id: Date.now(),
      });
      alertTimerRef.current = setTimeout(() => {
        setIsAlertFading(true);
        setTimeout(() => setCulturalAlert(null), 500);
      }, 7500);
      return;
    }

    // 3. Nếu phối ỔN: hiện hộp xanh lá nhạt, biểu tượng dấu tích, tự ẩn sau 5 giây
    const celebrateRule = CULTURAL_RULES.find((rule) => {
      if (rule.severity !== 'celebrate') return false;
      if (rule.costumeId && rule.costumeId !== selectedCostume.id) return false;
      if (rule.eventId && rule.eventId !== selectedEvent.id) return false;
      if (
        rule.requiredAccessories &&
        !rule.requiredAccessories.every((id) => accessoryIds.includes(id))
      ) {
        return false;
      }
      // cần có ít nhất MỘT trong các món này (vd: luật tai nghe chỉ áp dụng khi đang đội khăn vấn / khăn đóng / mấn)
      if (rule.requiredAnyAccessories && !rule.requiredAnyAccessories.some((id) => accessoryIds.includes(id))) {
        return false;
      }
      return true;
    });

    setCulturalAlert({
      type: 'success',
      title: celebrateRule ? celebrateRule.title : 'Phối chuẩn rồi!',
      message: celebrateRule
        ? celebrateRule.message
        : `Bộ này giữ đúng vùng lõi của ${selectedCostume.name}.`,
      tip: celebrateRule ? celebrateRule.tip : undefined,
      id: Date.now(),
    });

    alertTimerRef.current = setTimeout(() => {
      setIsAlertFading(true);
      setTimeout(() => setCulturalAlert(null), 500);
    }, 4500);
  }, [selectedCostume, selectedAccessories, selectedHair, selectedPalette, selectedEvent]);

  // 6. INTERACTIVE DRESS-UP ACTIONS
  const handleSelectCostume = (costume: CostumeItem) => {
    setSelectedCostume(costume);

    // Nếu chọn trang phục nữ mà đang ở mẫu nam thì tự đổi sang nữ
    if (costume.gender === 'female' && gender === 'male') {
      setGender('female');
      const femaleHair = HAIRSTYLES.find((h) => h.gender === 'female') || HAIRSTYLES[0];
      setSelectedHair(femaleHair);
    } else if (costume.gender === 'male' && gender === 'female') {
      setGender('male');
      const maleHair = HAIRSTYLES.find((h) => h.gender === 'male') || HAIRSTYLES[2];
      setSelectedHair(maleHair);
    }

    // Khi chọn áo tứ thân, áo dài tân thời hoặc áo nhật bình (nữ), nếu đang đội khăn đóng thì tự đổi sang khăn vấn
    if (
      costume.gender === 'female' ||
      costume.id === 'ao_tu_than' ||
      costume.id === 'ao_dai_tan_thoi' ||
      costume.id === 'ao_nhat_binh'
    ) {
      setSelectedAccessories((prev) => {
        const hasKhanDong = prev.some((a) => a.id === 'khan_dong' || a.id === 'man_khan_dong');
        if (hasKhanDong) {
          const khanVan = ACCESSORIES.find((a) => a.id === 'khan_van');
          if (khanVan) {
            return prev.map((a) => (a.id === 'khan_dong' || a.id === 'man_khan_dong' ? khanVan : a));
          }
        }
        return prev;
      });
    }

    triggerToast(`Đã chọn: ${costume.name}`);
  };

  const handleSelectHair = (hair: HairstyleItem) => {
    setSelectedHair(hair);
    setGender(hair.gender);
  };

  // Switch gender and reset selections to appropriate items
  const handleToggleGender = (newGender: 'female' | 'male') => {
    if (newGender === gender) return;

    setGender(newGender);
    setSelectedTemplate(null); // Clear template comparison when gender changes

    if (newGender === 'male') {
      // 1. Costume: If current costume is female-only, switch to default male costume
      if (selectedCostume.gender === 'female') {
        const maleCostume = COSTUMES.find((c) => c.id === 'ngu_than_nam') || COSTUMES.find((c) => c.gender === 'male') || COSTUMES[0];
        setSelectedCostume(maleCostume);
      }
      // 2. Hairstyle: switch to male hair
      const maleHair = HAIRSTYLES.find((h) => h.gender === 'male') || HAIRSTYLES[2];
      setSelectedHair(maleHair);

      // 3. Filter accessories: keep only male and unisex accessories
      const validMaleAccs = selectedAccessories.filter((a) => a.gender === 'male' || a.gender === 'unisex');
      const hasFootwear = validMaleAccs.some((a) => a.category === 'feet');
      if (!hasFootwear) {
        const guocMoc = ACCESSORIES.find((a) => a.id === 'guoc_moc_nam');
        if (guocMoc) validMaleAccs.push(guocMoc);
      }
      setSelectedAccessories(validMaleAccs);

      // 4. Update Name & Toast
      setLookName('Sĩ Tử Lập Lĩnh');
      triggerToast('Đã chuyển sang mẫu Nam · Toàn bộ trang phục & phụ kiện được cập nhật');
    } else {
      // Switch to female
      if (selectedCostume.gender === 'male') {
        const femaleCostume = COSTUMES.find((c) => c.id === 'ao_dai_tan_thoi') || COSTUMES.find((c) => c.gender === 'female') || COSTUMES[0];
        setSelectedCostume(femaleCostume);
      }
      const femaleHair = HAIRSTYLES.find((h) => h.gender === 'female') || HAIRSTYLES[0];
      setSelectedHair(femaleHair);

      const validFemaleAccs = selectedAccessories.filter((a) => a.gender === 'female' || a.gender === 'unisex');
      const hasFootwear = validFemaleAccs.some((a) => a.category === 'feet');
      if (!hasFootwear) {
        const haiTheu = ACCESSORIES.find((a) => a.id === 'hai_theu');
        if (haiTheu) validFemaleAccs.push(haiTheu);
      }
      setSelectedAccessories(validFemaleAccs);

      setLookName('Nàng Thơ Kinh Kỳ');
      triggerToast('Đã chuyển sang mẫu Nữ · Toàn bộ trang phục & phụ kiện được cập nhật');
    }
  };

  const handleToggleAccessory = (acc: AccessoryItem) => {
    const isEquipping = !selectedAccessories.some((a) => a.id === acc.id);
    const isFemaleCostume = selectedCostume.id === 'ao_tu_than' || selectedCostume.id === 'ao_dai_tan_thoi';

    if (!isEquipping && acc.slot === 'feet') {
      triggerToast('Nhân vật luôn cần một đôi giày dép, hãy chọn đôi khác để đổi');
      return;
    }

    if (!isEquipping) {
      // Tháo món đồ hiện tại
      setSelectedAccessories((prev) => prev.filter((a) => a.id !== acc.id));
      triggerToast(`Đã tháo ${acc.name}`);
      return;
    }

    // Khi người dùng cố tình chọn khăn đóng với trang phục nữ: hiện hộp nhắc thân thiện
    if ((acc.id === 'khan_dong' || acc.id === 'man_khan_dong') && isFemaleCostume) {
      setFriendlyNotice({
        title: 'Mẹo Văn Hóa: Khăn Đóng & Trang Phục Nữ',
        message: 'Khăn đóng (nhiều nếp quấn sẵn cứng cáp) theo phong tục truyền thống thường đi cùng trang phục nam giới. Đối với trang phục nữ như Áo Tứ Thân hay Áo Dài, các cô gái xưa thường chuộng Khăn Vấn tròn mềm ôm sát đầu để tôn nét đoan trang, dịu dàng.',
        suggestion: 'Bạn vẫn có thể giữ Khăn Đóng nếu yêu thích phong cách phá cách này, hoặc đổi sang Khăn Vấn để chuẩn nét truyền thống.',
      });
    }

    // 1. Kiểm tra món cũ cùng ô (slot)
    const existingInSlot = selectedAccessories.find((a) => a.slot === acc.slot && a.id !== acc.id);

    // 2. Kiểm tra luật xung đột giữa các ô: Nón lá vs Tai nghe over-ear
    let conflictRemoveId = '';
    let conflictNotice = '';

    if (acc.id === 'non_la') {
      const headphones = selectedAccessories.find((a) => a.id === 'over_ear_headphones');
      if (headphones) {
        conflictRemoveId = 'over_ear_headphones';
        conflictNotice = ' (tháo Tai Nghe vì không thể đeo cùng Nón Lá)';
      }
    } else if (acc.id === 'over_ear_headphones') {
      const nonLa = selectedAccessories.find((a) => a.id === 'non_la');
      if (nonLa) {
        conflictRemoveId = 'non_la';
        conflictNotice = ' (tháo Nón Lá vì vướng Tai Nghe)';
      }
    }

    // Áo tay thụng (tấc, nhật bình, giao lĩnh): hai tay chắp trước bụng nên chỉ cầm được MỘT món, quạt hoặc túi
    const CLASPED_COSTUMES = ['ao_tac', 'ao_nhat_binh', 'ao_giao_linh'];
    const FAN_IDS = ['quat_giay', 'quat_thu_phap'];
    const BAG_IDS = ['tui_may_tre', 'tote_bag'];
    if (!conflictRemoveId && CLASPED_COSTUMES.includes(selectedCostume.id)) {
      const otherHandItem = FAN_IDS.includes(acc.id)
        ? selectedAccessories.find((a) => BAG_IDS.includes(a.id))
        : BAG_IDS.includes(acc.id)
          ? selectedAccessories.find((a) => FAN_IDS.includes(a.id))
          : undefined;
      if (otherHandItem) {
        conflictRemoveId = otherHandItem.id;
        conflictNotice = ` (tháo ${otherHandItem.name} vì áo tay thụng chắp tay chỉ cầm được một món)`;
      }
    }

    // 3. Hiển thị thông báo toast phù hợp
    if (existingInSlot) {
      triggerToast(`Đã thay ${existingInSlot.name} bằng ${acc.name}${conflictNotice}`);
    } else if (conflictNotice) {
      if (acc.id === 'non_la') {
        triggerToast('Đã tháo Tai Nghe vì không thể đeo cùng Nón Lá');
      } else if (acc.id === 'over_ear_headphones') {
        triggerToast('Đã tháo Nón Lá vì không thể đội cùng Tai Nghe');
      } else {
        triggerToast(`Đã trang bị ${acc.name}${conflictNotice}`);
      }
    } else {
      triggerToast(`Đã trang bị ${acc.name}`);
    }

    // 4. Cập nhật danh sách phụ kiện
    setSelectedAccessories((prev) => {
      // Tháo món cũ trong cùng ô (slot)
      let next = prev.filter((a) => a.slot !== acc.slot);
      // Tháo món xung đột nếu có
      if (conflictRemoveId) {
        next = next.filter((a) => a.id !== conflictRemoveId);
      }
      return [...next, acc];
    });
  };

  const handleSelectPalette = (palette: ColorPalette) => {
    setSelectedPalette(palette);
  };

  const handleShuffleName = () => {
    const remaining = LOOKBOOK_NAMES.filter((n) => n !== lookName);
    const random = remaining[Math.floor(Math.random() * remaining.length)];
    setLookName(random);
  };

  const handleRandomize = () => {
    // Only randomize items matching current gender or unisex
    const availableCostumes = COSTUMES.filter((c) => c.gender === gender || c.gender === 'unisex');
    const availableHair = HAIRSTYLES.filter((h) => h.gender === gender);
    const availablePalettes = COLOR_PALETTES;
    const availableAccessories = ACCESSORIES.filter((a) => a.gender === gender || a.gender === 'unisex');

    // Chỉ nhận bản phối KHÔNG kích hoạt cảnh báo (warning/info) và không vi phạm luật chụm tay
    const CLASPED = ['ao_tac', 'ao_nhat_binh', 'ao_giao_linh'];
    const hitsRule = (costumeId: string, accIds: string[]) =>
      CULTURAL_RULES.some((rule) => {
        if (rule.severity === 'celebrate') return false;
        if (rule.costumeId) {
          if (rule.costumeId === 'ngu_than') {
            if (costumeId !== 'ngu_than' && costumeId !== 'ngu_than_nam') return false;
          } else if (rule.costumeId !== costumeId) {
            return false;
          }
        }
        if (rule.eventId && rule.eventId !== selectedEvent.id) return false;
        if (rule.requiredAccessories && !rule.requiredAccessories.every((id) => accIds.includes(id))) return false;
        if (rule.requiredAnyAccessories && !rule.requiredAnyAccessories.some((id) => accIds.includes(id))) return false;
        return true;
      });

    let randomCostume = availableCostumes[0];
    let randomPalette = availablePalettes[0];
    let randomHair = availableHair[0];
    let newAccs: AccessoryItem[] = [];
    for (let attempt = 0; attempt < 100; attempt++) {
      randomCostume = availableCostumes[Math.floor(Math.random() * availableCostumes.length)];
      randomPalette = availablePalettes[Math.floor(Math.random() * availablePalettes.length)];
      randomHair = availableHair[Math.floor(Math.random() * availableHair.length)];

      newAccs = [];

      // Footwear slot: luôn chọn 1 món duy nhất phù hợp giới tính
      const footwear = availableAccessories.filter((a) => a.slot === 'feet');
      if (footwear.length > 0) {
        newAccs.push(footwear[Math.floor(Math.random() * footwear.length)]);
      }

      // Head slot: 70% cơ hội có món đội đầu
      if (Math.random() > 0.3) {
        const headItems = availableAccessories.filter((a) => a.slot === 'head');
        if (headItems.length > 0) {
          newAccs.push(headItems[Math.floor(Math.random() * headItems.length)]);
        }
      }

      const hasNonLa = newAccs.some((a) => a.id === 'non_la');

      // Ears slot: Tai nghe (35% cơ hội, tuyệt đối KHÔNG đeo cùng Nón Lá)
      if (!hasNonLa && Math.random() > 0.65) {
        const headphones = availableAccessories.find((a) => a.id === 'over_ear_headphones');
        if (headphones) newAccs.push(headphones);
      }

      // Eyes slot: Kính râm (40% cơ hội)
      if (Math.random() > 0.6) {
        const glasses = availableAccessories.find((a) => a.id === 'sunglasses');
        if (glasses) newAccs.push(glasses);
      }

      // Neck slot: Chuỗi ngọc (45% cơ hội - nữ)
      if (gender === 'female' && Math.random() > 0.55) {
        const necklace = availableAccessories.find((a) => a.id === 'chuoi_ngoc');
        if (necklace) newAccs.push(necklace);
      }

      // Hand Right slot: Quạt (45% cơ hội)
      if (Math.random() > 0.55) {
        const handRightItems = availableAccessories.filter((a) => a.slot === 'hand_right');
        if (handRightItems.length > 0) {
          newAccs.push(handRightItems[Math.floor(Math.random() * handRightItems.length)]);
        }
      }

      // Hand Left slot: Túi tote / Túi mây (40% cơ hội)
      if (Math.random() > 0.6) {
        const handLeftItems = availableAccessories.filter((a) => a.slot === 'hand_left');
        if (handLeftItems.length > 0) {
          newAccs.push(handLeftItems[Math.floor(Math.random() * handLeftItems.length)]);
        }
      }
      const ids = newAccs.map((a) => a.id);
      const claspConflict =
        CLASPED.includes(randomCostume.id) &&
        newAccs.some((a) => a.slot === 'hand_right') &&
        newAccs.some((a) => a.slot === 'hand_left');
      if (!claspConflict && !hitsRule(randomCostume.id, ids)) break;
      // lần cuối vẫn lỗi: bỏ phụ kiện gây lỗi, chỉ giữ giày không vi phạm
      if (attempt === 99) {
        newAccs = newAccs.filter((a) => a.slot === 'feet' && !hitsRule(randomCostume.id, [a.id]));
      }
    }

    setSelectedCostume(randomCostume);
    setSelectedPalette(randomPalette);
    setSelectedHair(randomHair);
    setSelectedAccessories(newAccs);
    handleShuffleName();
    triggerToast('Đã phối ngẫu nhiên trang phục mới!');
  };

  const handleReset = () => {
    setSelectedCostume(COSTUMES[0]);
    setSelectedPalette(COLOR_PALETTES[0]);
    setSelectedHair(HAIRSTYLES[0]);
    setGender('female');
    setSelectedAccessories([
      ACCESSORIES.find((a) => a.id === 'sneaker')!,
      ACCESSORIES.find((a) => a.id === 'man_khan_dong')!,
    ]);
    setLookName('Nàng Thơ Gen Z');
    setZoneHighlight('none');
  };

  const isCurrentLookSaved = useMemo(() => {
    return savedLooks.some(
      (l) =>
        l.name === lookName &&
        l.costumeId === selectedCostume.id &&
        l.paletteId === selectedPalette.id
    );
  }, [savedLooks, lookName, selectedCostume, selectedPalette]);

  const handleSaveLook = () => {
    if (isCurrentLookSaved) return;

    const newLook: LookbookSavedItem = {
      id: `look-${Date.now()}`,
      name: lookName,
      createdAt: new Date().toISOString(),
      eventId: selectedEvent.id,
      costumeId: selectedCostume.id,
      accessoryIds: selectedAccessories.map((a) => a.id),
      paletteId: selectedPalette.id,
      gender,
      traditionalScore,
      modernScore,
    };

    setSavedLooks((prev) => [newLook, ...prev]);
  };

  const handleLoadLook = (look: LookbookSavedItem) => {
    const costume = COSTUMES.find((c) => c.id === look.costumeId) || COSTUMES[0];
    const event = EVENTS.find((e) => e.id === look.eventId) || EVENTS[0];
    const palette = COLOR_PALETTES.find((p) => p.id === look.paletteId) || COLOR_PALETTES[0];
    const accs = ACCESSORIES.filter((a) => look.accessoryIds.includes(a.id));
    const hair = HAIRSTYLES.find((h) => h.gender === look.gender) || HAIRSTYLES[0];

    setSelectedCostume(costume);
    setSelectedEvent(event);
    setSelectedPalette(palette);
    setSelectedAccessories(accs);
    setSelectedHair(hair);
    setGender(look.gender);
    setLookName(look.name);
  };

  // 4. THẺ KIẾN THỨC DI SẢN (KNOWLEDGE CARD LOGIC)
  const currentKnowledgeItem = knowledgeModalItemId ? ITEM_KNOWLEDGE[knowledgeModalItemId] : null;

  const knowledgeCategory: 'costume' | 'hair' | 'accessory' | null = useMemo(() => {
    if (!knowledgeModalItemId) return null;
    if (COSTUMES.some((c) => c.id === knowledgeModalItemId)) return 'costume';
    if (HAIRSTYLES.some((h) => h.id === knowledgeModalItemId)) return 'hair';
    if (ACCESSORIES.some((a) => a.id === knowledgeModalItemId)) return 'accessory';
    return null;
  }, [knowledgeModalItemId]);

  const isKnowledgeItemEquipped = useMemo(() => {
    if (!knowledgeModalItemId || !knowledgeCategory) return false;
    if (knowledgeCategory === 'costume') {
      return selectedCostume.id === knowledgeModalItemId;
    }
    if (knowledgeCategory === 'hair') {
      return selectedHair.id === knowledgeModalItemId;
    }
    if (knowledgeCategory === 'accessory') {
      return selectedAccessories.some((a) => a.id === knowledgeModalItemId);
    }
    return false;
  }, [knowledgeModalItemId, knowledgeCategory, selectedCostume, selectedHair, selectedAccessories]);

  // Nút Trước/Sau chỉ chuyển trong cùng nhóm và chỉ những món hợp giới tính đang chọn có trong ITEM_KNOWLEDGE
  const availableKnowledgeItemIdsInGroup = useMemo(() => {
    if (!knowledgeCategory) return [];
    if (knowledgeCategory === 'costume') {
      return COSTUMES.filter(
        (c) => (c.gender === gender || c.gender === 'unisex') && !!ITEM_KNOWLEDGE[c.id]
      ).map((c) => c.id);
    }
    if (knowledgeCategory === 'hair') {
      return HAIRSTYLES.filter(
        (h) => h.gender === gender && !!ITEM_KNOWLEDGE[h.id]
      ).map((h) => h.id);
    }
    if (knowledgeCategory === 'accessory') {
      return ACCESSORIES.filter(
        (a) => (a.gender === gender || a.gender === 'unisex') && !!ITEM_KNOWLEDGE[a.id]
      ).map((a) => a.id);
    }
    return [];
  }, [knowledgeCategory, gender]);

  const currentGroupIndex = useMemo(() => {
    if (!knowledgeModalItemId) return -1;
    return availableKnowledgeItemIdsInGroup.indexOf(knowledgeModalItemId);
  }, [knowledgeModalItemId, availableKnowledgeItemIdsInGroup]);

  const handlePrevKnowledge = () => {
    if (currentGroupIndex > 0) {
      setKnowledgeModalItemId(availableKnowledgeItemIdsInGroup[currentGroupIndex - 1]);
    }
  };

  const handleNextKnowledge = () => {
    if (currentGroupIndex >= 0 && currentGroupIndex < availableKnowledgeItemIdsInGroup.length - 1) {
      setKnowledgeModalItemId(availableKnowledgeItemIdsInGroup[currentGroupIndex + 1]);
    }
  };

  const handleOpenKnowledge = (itemId: string) => {
    if (ITEM_KNOWLEDGE[itemId]) {
      setKnowledgeModalItemId(itemId);
    }
  };

  const handleEquipFromKnowledge = (itemId: string, category: 'costume' | 'hair' | 'accessory') => {
    if (category === 'costume') {
      const c = COSTUMES.find((item) => item.id === itemId);
      if (c) handleSelectCostume(c);
    } else if (category === 'hair') {
      const h = HAIRSTYLES.find((item) => item.id === itemId);
      if (h) handleSelectHair(h);
    } else if (category === 'accessory') {
      const a = ACCESSORIES.find((item) => item.id === itemId);
      if (a) {
        if (!selectedAccessories.some((x) => x.id === a.id)) {
          handleToggleAccessory(a);
        }
      }
    }
    // Đóng thẻ kiến thức
    setKnowledgeModalItemId(null);
    // Chuyển về chế độ Người mẫu
    setVisualizerViewMode('silhouette');
  };

  // Count equipped items per category for badges
  const equippedCounts = useMemo<Record<WardrobeCategory, number>>(() => {
    const footwearCount = selectedAccessories.filter((a) => a.category === 'feet').length;
    const generalAccCount = selectedAccessories.filter((a) => a.category !== 'feet').length;

    return {
      costume: 1,
      hair: 1,
      accessory: generalAccCount,
      footwear: footwearCount,
      color: 1,
    };
  }, [selectedAccessories]);

  // NẾU showIntro === true: Render Component Intro và truyền prop onComplete={() => setShowIntro(false)}
  if (showIntro) {
    return <IntroOpeningGate onComplete={() => { setShowIntro(false); setShowWelcome(true); }} />;
  }

  // Màn chào (ảnh vườn đêm) hiện sau video, trước màn chọn bối cảnh
  if (showWelcome) {
    return <WelcomeGate onEnter={() => setShowWelcome(false)} />;
  }

  // If current screen is occasion selection, render the full occasion selection grid
  if (currentScreen === 'occasion_select') {
    return (
      <>
        <OccasionSelectView
          onSelectTemplate={handleSelectTemplate}
          onStartFromScratch={handleStartFromScratch}
          onReplayIntro={() => setShowIntro(true)}
        />
        <AdvisorChat />
      </>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#FAF6EE] text-[#2A1E17] font-sans antialiased" style={{ ['--hh' as string]: `${headerH}px` } as React.CSSProperties}>
      {/* 1. TOP HEADER: bỏ logo/tên app cho gọn; các nút tự xuống dòng khi màn hẹp (không bị cắt) */}
      <header
        ref={headerRef}
        className={`px-3 sm:px-5 py-2 bg-[#FDFBF7] border-b border-[#8C6D53]/15 flex flex-wrap items-center justify-center md:justify-between gap-x-2 gap-y-1.5 shrink-0 z-40 absolute md:relative top-0 left-0 right-0 transition-transform duration-300 ease-out md:translate-y-0 ${isHeaderCollapsed ? '-translate-y-full' : 'translate-y-0'}`}
      >
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Logo + tên app: chỉ hiện trên máy tính (lg trở lên); điện thoại & máy tính bảng ẩn cho gọn */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-[#8C6D53]/30 shadow-xs shrink-0">
              <img src={LOGO_CAT} alt="Logo Việt phục Remix" className="w-full h-full object-cover" draggable={false} />
            </div>
            <div className="leading-tight">
              <h1 className="text-base font-bold font-serif text-[#2A1E17] tracking-tight leading-none whitespace-nowrap">Việt phục Remix</h1>
              <span className="text-[10px] text-[#8C6D53] font-medium hidden xl:block whitespace-nowrap">Game phối đồ truyền thống &amp; phụ kiện Gen Z</span>
            </div>
          </div>

          {/* NÚT ĐỔI DỊP */}
          <button
            type="button"
            onClick={() => setCurrentScreen('occasion_select')}
            className="px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FAF0E6] hover:bg-[#F3E5D8] text-[#8C2D19] border border-[#8C2D19]/30 text-xs font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Đổi dịp tham gia (quay về màn hình chọn dịp)"
          >
            <Compass className="w-3.5 h-3.5 text-[#C0392B]" />
            <span className="hidden sm:inline">Đổi dịp</span>
          </button>
        </div>

        {/* Thanh Bản sắc / Remix */}
        <div className="min-w-0 max-w-full shrink">
          <SpectrumMeter
            identityPercent={traditionalScore}
            remixPercent={modernScore}
            onOpenHarmonyModal={() => setIsHarmonyModalOpen(true)}
          />
        </div>

        {/* Nút thao tác nhanh */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRandomize}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white text-[#8C6D53] hover:text-[#C0392B] hover:bg-[#FAF6EE] border border-[#8C6D53]/20 shadow-xs text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
            title="Phối ngẫu nhiên toàn bộ đồ"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden md:inline">Phối ngẫu nhiên</span>
          </button>

          <button
            onClick={() => setIsCultureModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white text-[#8C6D53] hover:text-[#C0392B] border border-[#8C6D53]/20 shadow-xs text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
            title="Xem hồ sơ văn hóa & nguồn gốc trang phục"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#C0392B]" />
            <span className="hidden lg:inline">Góc Di Sản</span>
          </button>

          <button
            onClick={() => setIsSavedModalOpen(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white text-[#8C6D53] hover:text-[#2A1E17] border border-[#8C6D53]/20 shadow-xs text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 relative whitespace-nowrap"
            title="Bộ sưu tập trang phục đã lưu"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#8C6D53]" />
            <span className="hidden lg:inline">Tủ đồ</span>
            <span className="w-4 h-4 rounded-full bg-[#8C6D53] text-white text-[9px] flex items-center justify-center font-bold">
              {savedLooks.length}
            </span>
          </button>

          <button
            onClick={() => setIsRentalMapOpen(true)}
            title="Tìm nơi thuê Việt phục gần bạn"
            className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white text-[#D97706] border border-[#D97706]/30 hover:bg-[#FFF8E7] shadow-xs text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Thuê đồ</span>
          </button>

          <button
            onClick={() => setIsCardModalOpen(true)}
            className="px-3 py-1.5 rounded-full bg-[#C0392B] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:bg-[#991B1B] transition active:scale-95 whitespace-nowrap"
            title="Tải thẻ Lookbook kỷ niệm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất Thẻ</span>
          </button>
        </div>

        <button
          type="button"
          aria-label={isHeaderCollapsed ? 'Hiện thanh trên' : 'Ẩn thanh trên'}
          onClick={() => setIsHeaderCollapsed((v) => !v)}
          className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-6 bg-[#FDFBF7] rounded-b-xl border border-t-0 border-[#8C6D53]/20 shadow-sm flex items-center justify-center"
        >
          <span className="w-6 h-1 bg-[#8C6D53]/30 rounded-full" />
        </button>
      </header>

      {/* 2. MAIN DRESS-UP GAME CANVAS (3-ZONE DRESS-UP LAYOUT) */}
      <div className="relative flex-1 flex flex-row overflow-hidden min-h-0">
        {/* ZONE 1: VERTICAL CATEGORY SIDEBAR (LEFT) - BỘ LỌC VÀ LỰA CHỌN */}
        <div className={`shrink-0 absolute md:relative left-0 bottom-0 md:top-0 z-20 md:z-auto flex flex-col bg-[#FAF6EE] border-r border-[#8C6D53]/15 shadow-xl md:shadow-none transition-all duration-300 ease-out md:translate-x-0 ${isHeaderCollapsed ? 'top-0' : 'top-[var(--hh)]'} ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="flex-1 min-h-0 flex flex-col justify-start overflow-y-auto">
            <CategorySidebar
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setIsCollapsedMobile(false); // Auto open drawer on mobile when switching category
              }}
              equippedCounts={equippedCounts}
              gender={gender}
              onToggleGender={handleToggleGender}
              onBackToOccasion={() => setCurrentScreen('occasion_select')}
            />
          </div>
          <button
            type="button"
            aria-label={isSidebarCollapsed ? 'Hiện thanh danh mục' : 'Ẩn thanh danh mục'}
            onClick={() => setIsSidebarCollapsed((v) => !v)}
            className="md:hidden absolute top-1/3 -right-6 w-6 h-16 bg-[#FAF6EE] rounded-r-xl border border-l-0 border-[#8C6D53]/20 shadow-sm flex items-center justify-center"
          >
            <span className="w-1 h-8 bg-[#8C6D53]/30 rounded-full" />
          </button>
        </div>

        {/* ZONE 2: PROMINENT CENTER CHARACTER STAGE */}
        <div className={`flex-1 relative flex flex-col items-center justify-center min-w-0 overflow-hidden bg-gradient-to-b from-[#FDFBF7] via-[#FAF4E8] to-[#EFE5D3] ${isHeaderCollapsed ? 'pt-0' : 'pt-[var(--hh)]'} ${isSidebarCollapsed ? 'pl-0' : 'pl-[88px]'} md:pt-0 md:pl-0 transition-all duration-300`}>
          {/* Đã bỏ ô 'Mẫu gốc' và nút làm mới/hoàn tác trên thanh trên */}
          {/* Interactive Slot Toast Notification (Báo thay thế món đồ trong ô & luật xung đột) */}
          {toastMessage && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 max-w-sm w-[90%] sm:w-auto px-4 py-2 rounded-full bg-[#2A1E17]/95 text-[#FAF6EE] text-xs font-semibold shadow-xl backdrop-blur-md border border-[#FDE68A]/30 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150 pointer-events-none text-center">
              <span className="text-[#FBBF24] text-sm shrink-0">✨</span>
              <span className="truncate">{toastMessage}</span>
            </div>
          )}

          {/* Full-Body Mannequin Visualizer */}
          <MannequinVisualizer
            costume={selectedCostume}
            accessories={selectedAccessories}
            palette={selectedPalette}
            gender={gender}
            hairstyle={selectedHair}
            zoneHighlight={zoneHighlight}
            onToggleZoneHighlight={setZoneHighlight}
            lookName={lookName}
            onShuffleName={handleShuffleName}
            onEditName={setLookName}
            viewMode={visualizerViewMode}
            templateId={selectedTemplate?.id}
            onViewModeChange={setVisualizerViewMode}
            onOpenKnowledge={handleOpenKnowledge}
            alertNode={
              culturalAlert ? (
                <div
                  key={culturalAlert.id}
                  className={`relative w-full max-w-3xl mx-auto max-h-full overflow-y-auto z-30 pointer-events-auto transition-all duration-300 ease-out ${
                    isAlertFading ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
                    }`}
                >
                  <div
                    className={`px-2.5 py-2 sm:px-3 sm:py-2 rounded-2xl shadow-xl backdrop-blur-md border flex items-start justify-between gap-2.5 transition-all ${
                      culturalAlert.type === 'warning'
                        ? 'bg-rose-50/95 border-rose-300 text-rose-950 shadow-rose-900/10'
                        : culturalAlert.type === 'info'
                          ? 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-900/10'
                          : 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-900/10'
                      }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          culturalAlert.type === 'warning'
                            ? 'bg-rose-100 text-rose-700'
                            : culturalAlert.type === 'info'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                      >
                        {culturalAlert.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : culturalAlert.type === 'info' ? (
                          <Lightbulb className="w-4 h-4" />
                        ) : (
                          <Check className="w-4 h-4 stroke-[3]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-bold leading-tight ${
                            culturalAlert.type === 'warning'
                              ? 'text-rose-900'
                              : culturalAlert.type === 'info'
                                ? 'text-amber-900'
                                : 'text-emerald-900'
                            }`}
                        >
                          {culturalAlert.title}
                        </p>
                        <p
                          className={`text-[13px] leading-snug mt-0.5 ${
                            culturalAlert.type === 'warning'
                              ? 'text-rose-800'
                              : culturalAlert.type === 'info'
                                ? 'text-amber-800'
                                : 'text-emerald-800'
                            }`}
                        >
                          {culturalAlert.message}
                        </p>
                        {culturalAlert.tip && (
                          <p
                            className={`text-[12px] italic mt-1 pt-1 border-t leading-snug ${
                              culturalAlert.type === 'warning'
                                ? 'border-rose-200 text-rose-700'
                                : culturalAlert.type === 'info'
                                  ? 'border-amber-200 text-amber-700'
                                  : 'border-emerald-200 text-emerald-700'
                              }`}
                          >
                            💡 Mẹo: {culturalAlert.tip}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAlertFading(true);
                        setTimeout(() => setCulturalAlert(null), 300);
                      }}
                      className={`p-1 rounded-full transition shrink-0 ${
                        culturalAlert.type === 'warning'
                          ? 'text-rose-500 hover:text-rose-800 hover:bg-rose-100'
                          : culturalAlert.type === 'info'
                            ? 'text-amber-500 hover:text-amber-800 hover:bg-amber-100'
                            : 'text-emerald-500 hover:text-emerald-800 hover:bg-emerald-100'
                        }`}
                      title="Đóng thông báo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : null
            }
          />

          {/* MOBILE SLIDE-UP DRAWER AT BOTTOM */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-30">
            <WardrobeDrawer
              category={activeCategory}
              selectedCostume={selectedCostume}
              onSelectCostume={handleSelectCostume}
              selectedAccessories={selectedAccessories}
              onToggleAccessory={handleToggleAccessory}
              selectedPalette={selectedPalette}
              onSelectPalette={handleSelectPalette}
              selectedHair={selectedHair}
              onSelectHair={handleSelectHair}
              gender={gender}
              isCollapsedMobile={isCollapsedMobile}
              onToggleCollapseMobile={() => setIsCollapsedMobile(!isCollapsedMobile)}
              onOpenKnowledge={handleOpenKnowledge}
            />
          </div>
        </div>

        {/* ZONE 3: FIXED WARDROBE DRAWER (DESKTOP RIGHT PANEL) */}
        <div className="hidden md:flex shrink-0 h-full overflow-hidden">
          <WardrobeDrawer
            category={activeCategory}
            selectedCostume={selectedCostume}
            onSelectCostume={handleSelectCostume}
            selectedAccessories={selectedAccessories}
            onToggleAccessory={handleToggleAccessory}
            selectedPalette={selectedPalette}
            onSelectPalette={handleSelectPalette}
            selectedHair={selectedHair}
            onSelectHair={handleSelectHair}
            gender={gender}
            isCollapsedMobile={false}
            onToggleCollapseMobile={() => {}}
            onOpenKnowledge={handleOpenKnowledge}
          />
        </div>
      </div>

      {/* 3. MODALS (HARMONY CHECKER, CULTURAL ARCHIVE, EXPORT, SAVED LOOKS) */}
      {/* Harmony Checker Modal */}
      {isHarmonyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#C0392B]" />
                <h3 className="text-base font-bold text-stone-900">
                  Thước Đo Văn Hóa & Cảnh Báo
                </h3>
              </div>
              <button
                onClick={() => setIsHarmonyModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <HarmonyChecker
              costume={selectedCostume}
              accessories={selectedAccessories}
              event={selectedEvent}
              traditionalScore={traditionalScore}
              modernScore={modernScore}
              activeAlert={
                CULTURAL_RULES.find((rule) => {
                  const accessoryIds = selectedAccessories.map((a) => a.id);
                  if (rule.costumeId) {
                    if (rule.costumeId === 'ngu_than') {
                      if (selectedCostume.id !== 'ngu_than' && selectedCostume.id !== 'ngu_than_nam') return false;
                    } else if (rule.costumeId !== selectedCostume.id) {
                      return false;
                    }
                  }
                  if (rule.eventId && rule.eventId !== selectedEvent.id) return false;
                  if (
                    rule.requiredAccessories &&
                    !rule.requiredAccessories.every((id) => accessoryIds.includes(id))
                  ) {
                    return false;
                  }
                  if (rule.requiredAnyAccessories && !rule.requiredAnyAccessories.some((id) => accessoryIds.includes(id))) return false;
                  return true;
                }) || null
              }
              onDismissAlert={() => setCulturalAlert(null)}
            />

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setIsHarmonyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cultural Card Modal */}
      {isCultureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-stone-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C0392B]" />
                <h3 className="text-base font-bold text-stone-900">
                  Góc Di Sản: Hồ Sơ {selectedCostume.name}
                </h3>
              </div>
              <button
                onClick={() => setIsCultureModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CulturalCard costume={selectedCostume} />

            <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setIsCultureModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lookbook Export Modal */}
      <CardExportModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        lookName={lookName}
        costume={selectedCostume}
        accessories={selectedAccessories}
        palette={selectedPalette}
        event={selectedEvent}
        gender={gender}
        traditionalScore={traditionalScore}
        modernScore={modernScore}
        isSaved={isCurrentLookSaved}
        onSaveToWardrobe={() => {
          handleSaveLook();
          setIsCardModalOpen(false);
          setToastMessage('Đã lưu thẻ vào Tủ đồ của bạn');
          setIsSavedModalOpen(true);
        }}
      />

      {/* Saved Looks Modal */}
      <SavedLooksModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedLooks={savedLooks}
        onLoadLook={handleLoadLook}
        onDeleteLook={(id) => setSavedLooks((prev) => prev.filter((l) => l.id !== id))}
      />

      {/* Friendly Notice Modal (Gợi ý văn hóa thân thiện khi chọn Khăn Đóng với trang phục Nữ) */}
      {friendlyNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#FFFDF9] rounded-2xl p-5 shadow-2xl border border-[#D9AE8A]/60 text-[#2A1E17] animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAF0E6] text-[#C0392B] flex items-center justify-center shrink-0 text-xl shadow-xs">
                💡
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-[#8C2D19] mb-1">
                  {friendlyNotice.title}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed mb-2.5">
                  {friendlyNotice.message}
                </p>
                {friendlyNotice.suggestion && (
                  <p className="text-[11px] text-[#8C6D53] italic bg-[#FAF6EE] p-2.5 rounded-xl border border-[#8C6D53]/15">
                    ✨ {friendlyNotice.suggestion}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#8C6D53]/15 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  const khanVan = ACCESSORIES.find((a) => a.id === 'khan_van');
                  if (khanVan) {
                    setSelectedAccessories((prev) => [
                      ...prev.filter((a) => a.id !== 'khan_dong' && a.id !== 'man_khan_dong'),
                      khanVan,
                    ]);
                  }
                  setFriendlyNotice(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#FAF0E6] hover:bg-[#F3E5D8] text-[#8C2D19] text-xs font-semibold border border-[#D9AE8A]/40 transition active:scale-95"
              >
                Đổi sang Khăn Vấn
              </button>
              <button
                onClick={() => setFriendlyNotice(null)}
                className="px-3.5 py-1.5 rounded-xl bg-[#8C2D19] hover:bg-[#6D2313] text-white text-xs font-semibold shadow-xs transition active:scale-95"
              >
                Giữ Khăn Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Knowledge Card Modal (Thẻ kiến thức di sản) */}
      {currentKnowledgeItem && knowledgeModalItemId && (
        <KnowledgeCardModal
          itemId={knowledgeModalItemId}
          item={currentKnowledgeItem}
          isEquipped={isKnowledgeItemEquipped}
          onEquipAndClose={handleEquipFromKnowledge}
          onClose={() => setKnowledgeModalItemId(null)}
          onPrev={handlePrevKnowledge}
          onNext={handleNextKnowledge}
          hasPrev={currentGroupIndex > 0}
          hasNext={currentGroupIndex >= 0 && currentGroupIndex < availableKnowledgeItemIdsInGroup.length - 1}
          currentIndex={currentGroupIndex >= 0 ? currentGroupIndex : undefined}
          totalInGroup={availableKnowledgeItemIdsInGroup.length}
        />
      )}

      {/* Trợ lý AI tư vấn (chatbot) */}
      <AdvisorChat />

      {/* Rental Map Modal (Tìm nơi thuê Việt phục) */}
      <RentalMapModal
        isOpen={isRentalMapOpen}
        onClose={() => setIsRentalMapOpen(false)}
        currentCostume={selectedCostume.name}
        occasionName={selectedTemplate?.name}
      />
    </div>
  );
}
