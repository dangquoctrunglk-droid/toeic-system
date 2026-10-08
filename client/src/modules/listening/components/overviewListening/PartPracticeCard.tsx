import type React from "react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingBasket, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type {
  PracticeLevelCard,
  CardPracticeStats,
  VocabItem,
} from "../../types";
import { VocabBasketDrawer } from "../practiceListening/VocabBasketDrawer";

/**
 * ==============================================================================
 * COMPONENT: PartPracticeCard.tsx
 * MỤC ĐÍCH: Thẻ luyện tập phân cấp Level (1-4) hoặc Chủ đề chi tiết (Part 1-4)
 * THIẾT KẾ: Bám sát 100% hình ảnh thực tế của người dùng:
 *   - Viền dạ quang xanh cyan ở cạnh trên cùng của thẻ
 *   - Tiêu đề cấp độ/chủ đề (ví dụ: Level 1 – Dưới 200 màu xanh da trời text-sky-400)
 *   - Dòng thống kê động chuẩn Ảnh: "5/53  ✓ 2  ✕ 3" (hoặc Chưa luyện tập · 53 câu)
 *   - Hàng dưới: Cụm 4 icon tiện ích bên trái:
 *       + Giỏ ShoppingBasket có badge vàng hổ phách hiển thị số từ vựng trong giỏ từ
 *       + Giấy ghi chú
 *       + Tải lại có badge đỏ số câu sai
 *       + Xóa màu đỏ
 *   - Nút xanh ngọc đậm bên phải: "Học ngay" (Chuẩn TOEIC Master AI)
 *   - Modal xác nhận xóa tiến độ chuẩn 100% Ảnh người dùng (Có số lượt xóa còn lại)
 * ==============================================================================
 */

interface PartPracticeCardProps {
  card: PracticeLevelCard;
  onStartLearning: (cardId: string) => void;
  onRetryWrong?: (cardId: string) => void;
  onResetProgress?: (cardId: string) => void;
  isDarkMode: boolean;
  userKey?: string;
  stats?: CardPracticeStats;
  savedVocabs?: VocabItem[];
  part?: number | string;
}

export const PartPracticeCard: React.FC<PartPracticeCardProps> = ({
  card,
  onStartLearning,
  onRetryWrong,
  onResetProgress,
  isDarkMode,
  userKey = "guest",
  stats: propStats,
  part,
}) => {
  const cardStorageKey = `toeic_card_stats_${userKey}_${card.id}`;
  const basketStorageKey = `toeic_listening_basket_${userKey}_${card.id}`;
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isNoProgressModalOpen, setIsNoProgressModalOpen] =
    useState<boolean>(false);

  const [stats, setStats] = useState<CardPracticeStats>(() => {
    if (propStats) return { ...propStats, totalQuestions: card.questionCount };
    try {
      const saved = localStorage.getItem(cardStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          totalQuestions: card.questionCount,
        };
      }
    } catch {
      // ignore
    }
    return {
      completedCount: 0,
      correctCount: 0,
      wrongCount: 0,
      totalQuestions: card.questionCount,
    };
  });

  // Tự động đồng bộ stats từ localStorage khi cardStorageKey hoặc propStats thay đổi
  useEffect(() => {
    if (propStats) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStats({ ...propStats, totalQuestions: card.questionCount });
      return;
    }
    try {
      const saved = localStorage.getItem(cardStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStats({
          ...parsed,
          totalQuestions: card.questionCount,
        });
      } else {
        setStats({
          completedCount: 0,
          correctCount: 0,
          wrongCount: 0,
          totalQuestions: card.questionCount,
        });
      }
    } catch {
      // ignore
    }
  }, [cardStorageKey, propStats, card.questionCount]);

  // Lấy danh sách từ vựng riêng biệt cho từng thẻ (Card-specific Vocabulary Basket)
  const getInitialVocabs = (): VocabItem[] => {
    try {
      const saved = localStorage.getItem(basketStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Dữ liệu mẫu khởi tạo riêng cho Level 1 – Dưới 200 (p1-l1)
    if (card.id === "p1-l1") {
      return [
        {
          word: "ladder",
          phonetic: "/ˈlæd.ər/",
          type: "danh từ",
          meaning: "Cái thang xếp, thang gấp",
          example:
            "The worker is climbing a ladder to repair the doorway ceiling.",
        },
        {
          word: "gather",
          phonetic: "/ˈɡæðər/",
          type: "động từ",
          meaning: "Tập trung lại, quây quần, hội họp",
          example:
            "Colleagues are gathered around a table to review the quarterly report.",
        },
        {
          word: "repair",
          phonetic: "/rɪˈpeər/",
          type: "động từ",
          meaning: "Sửa chữa, phục hồi",
          example: "He is repairing the equipment on the wall.",
        },
      ];
    }
    return [];
  };

  const [cardVocabs, setCardVocabs] = useState<VocabItem[]>(getInitialVocabs);

  // Đồng bộ giỏ từ riêng của thẻ từ localStorage khi key thay đổi
  useEffect(() => {
    try {
      const saved = localStorage.getItem(basketStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCardVocabs(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    if (card.id === "p1-l1") {
      setCardVocabs([
        {
          word: "ladder",
          phonetic: "/ˈlæd.ər/",
          type: "danh từ",
          meaning: "Cái thang xếp, thang gấp",
          example:
            "The worker is climbing a ladder to repair the doorway ceiling.",
        },
        {
          word: "gather",
          phonetic: "/ˈɡæðər/",
          type: "động từ",
          meaning: "Tập trung lại, quây quần, hội họp",
          example:
            "Colleagues are gathered around a table to review the quarterly report.",
        },
        {
          word: "repair",
          phonetic: "/rɪˈpeər/",
          type: "động từ",
          meaning: "Sửa chữa, phục hồi",
          example: "He is repairing the equipment on the wall.",
        },
      ]);
    } else {
      setCardVocabs([]);
    }
  }, [basketStorageKey, card.id]);

  // Xóa từ vựng khỏi giỏ từ riêng của thẻ
  const handleRemoveVocab = (word: string) => {
    const next = cardVocabs.filter(
      (v) => v.word.toLowerCase() !== word.toLowerCase(),
    );
    setCardVocabs(next);
    try {
      localStorage.setItem(basketStorageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
    toast.info(`Đã xóa "${word}" khỏi giỏ từ`);
  };

  const hasCompleted = stats.completedCount > 0;
  const hasWrong = stats.wrongCount > 0;

  // Xử lý xem giỏ từ vựng: Mở Drawer trượt từ bên phải chuẩn 100% Ảnh 2
  const handleViewVocab = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVocabDrawerOpen(true);
  };

  // Xử lý luyện lại các câu làm sai
  const handleRetryWrong = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasWrong) {
      toast.info(
        `Bắt đầu luyện tập lại ${stats.wrongCount} câu làm sai của ${card.title}`,
      );

      // Cập nhật ngay thống kê trên thẻ: đặt lại số câu sai về 0
      setStats((prev) => ({
        ...prev,
        completedCount: prev.correctCount,
        wrongCount: 0,
      }));

      if (onRetryWrong) {
        onRetryWrong(card.id);
      } else {
        onStartLearning(card.id);
      }
    } else {
      toast.info("Bạn chưa có câu nào làm sai trong phần này!");
    }
  };

  // Tên Part & Tên Level ngắn gọn chuẩn ảnh xác nhận (ví dụ: Part 1 — Level 1)
  const partName = typeof part === "number" ? `Part ${part}` : part || "Part 1";
  const levelShortTitle = card.title.includes("–")
    ? card.title.split("–")[0].trim()
    : card.title.includes("-")
      ? card.title.split("-")[0].trim()
      : card.title;

  // Xử lý mở Modal khi nhấn nút thùng rác xóa tiến độ
  const handleResetProgress = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasCompleted && stats.completedCount === 0) {
      setIsNoProgressModalOpen(true);
      return;
    }
    setIsConfirmModalOpen(true);
  };

  // Xác nhận xóa sạch toàn bộ câu đã làm
  const confirmDeleteProgress = () => {
    if (onResetProgress) {
      onResetProgress(card.id);
    } else {
      const resetData: CardPracticeStats = {
        completedCount: 0,
        correctCount: 0,
        wrongCount: 0,
        totalQuestions: card.questionCount,
      };
      setStats(resetData);
      try {
        localStorage.setItem(cardStorageKey, JSON.stringify(resetData));
      } catch {
        // ignore
      }
    }

    setIsConfirmModalOpen(false);
    toast.success(`Đã xoá tiến độ ${levelShortTitle}!`);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all duration-300 flex flex-col justify-between group hover:translate-y-[-2px] hover:shadow-xl min-w-0 ${
        isDarkMode
          ? "bg-[#0b1329]/90 border-slate-800/90 hover:border-sky-500/40 shadow-md shadow-black/20"
          : "bg-white border-slate-200/90 hover:border-sky-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* 1. ĐƯỜNG VIỀN XANH CYAN DẠ QUANG CẠNH TRÊN */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400/30" />

      {/* 2. KHỐI TIÊU ĐỀ & THỐNG KÊ TIẾN ĐỘ */}
      <div className="mb-6">
        <h3
          className={`font-black text-base sm:text-[17px] tracking-tight mb-2 transition-colors ${
            isDarkMode
              ? "text-sky-400 group-hover:text-sky-300"
              : "text-sky-600 group-hover:text-sky-500"
          }`}
        >
          {card.title}
        </h3>

        {/* THỐNG KÊ ĐỘNG CHUẨN ẢNH 2: 3/53  ✓ 1  ✕ 2 */}
        {hasCompleted ? (
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs sm:text-[13px] font-bold tracking-wide flex-wrap">
            <span className="text-emerald-400 font-extrabold">
              {stats.completedCount}/{stats.totalQuestions}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-extrabold">
              <span className="text-xs">✓</span> {stats.correctCount}
            </span>
            <span className="flex items-center gap-1 text-rose-400 font-extrabold">
              <span className="text-xs">✕</span> {stats.wrongCount}
            </span>
          </div>
        ) : (
          <p className="text-xs sm:text-[13px] font-medium text-slate-400">
            {card.statusText} · {card.questionCount} câu
          </p>
        )}
      </div>

      {/* 3. HÀNG DƯỚI CÙNG: CỤM 4 ICON TIỆN ÍCH & NÚT "HỌC NGAY" */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 pt-3 border-t border-slate-800/40">
        {/* Cụm 4 Icon trong capsule bo tròn bo góc chuẩn Ảnh 1 & 2 */}
        <div
          className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
            isDarkMode
              ? "bg-[#070c1a]/90 border-slate-800"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          {/* Icon 1: Giỏ từ vựng riêng cho từng thẻ */}
          <button
            type="button"
            onClick={handleViewVocab}
            className={`relative p-1 sm:p-1.5 rounded-lg transition-all cursor-pointer ${
              isVocabDrawerOpen
                ? "border border-sky-400 text-sky-400 bg-sky-500/20 shadow-sm shadow-sky-400/50"
                : "text-slate-400 hover:text-sky-400 hover:bg-slate-800/40"
            }`}
            title={`Giỏ từ vựng ${card.title} (${cardVocabs.length})`}
          >
            <ShoppingBasket
              size={16}
              className={isVocabDrawerOpen ? "text-sky-400" : "text-sky-300"}
            />
            {cardVocabs.length > 0 && (
              <span className="absolute -top-2 -right-2.5 bg-[#f59e0b] text-white text-[11px] font-black rounded-full min-w-[19px] h-[19px] px-1 flex items-center justify-center leading-none shadow-md shadow-amber-950/80 border-2 border-[#070c1a]">
                {cardVocabs.length}
              </span>
            )}
          </button>

          {/* Icon 2: Làm lại / Luyện lại câu sai (có badge đỏ khi có câu làm sai) */}
          <button
            type="button"
            onClick={handleRetryWrong}
            className={`relative p-1 rounded-lg transition-colors cursor-pointer ${
              hasWrong
                ? "text-rose-500 hover:text-rose-400"
                : "text-slate-500 hover:text-sky-400"
            }`}
            title={
              hasWrong ? `Luyện lại ${stats.wrongCount} câu sai` : "Làm lại"
            }
          >
            <RotateCcw size={14} />
            {hasWrong && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#ef4444] text-white text-[9px] font-black rounded-full min-w-[15px] h-[15px] px-0.5 flex items-center justify-center leading-none shadow-sm shadow-rose-950/60 border border-slate-900">
                {stats.wrongCount}
              </span>
            )}
          </button>

          {/* Icon 4: Xóa / Đặt lại tiến độ (đổi màu đỏ khi đã có tiến độ hoàn thành) */}
          <button
            type="button"
            onClick={handleResetProgress}
            className={`p-1 rounded-lg transition-colors cursor-pointer ${
              hasCompleted
                ? "text-rose-500 hover:text-rose-400"
                : "text-slate-500 hover:text-rose-400"
            }`}
            title="Xóa tiến độ thẻ này"
          >
            <Trash2
              size={14}
              className={hasCompleted ? "text-rose-400" : undefined}
            />
          </button>
        </div>

        {/* Nút: Học ngay (Nút xanh lục đậm chuẩn Image 2) */}
        <button
          type="button"
          onClick={() => onStartLearning(card.id)}
          className="shrink-0 px-3.5 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-[#00ba66] hover:bg-[#00d072] active:scale-95 transition-all duration-200 cursor-pointer shadow-md shadow-emerald-950/30 whitespace-nowrap"
        >
          Học ngay
        </button>
      </div>

      {/* DRAWER GIỎ TỪ VỰNG TRƯỢT TỪ BÊN PHẢI (CHUẨN 100% ẢNH 2) */}
      <VocabBasketDrawer
        isOpen={isVocabDrawerOpen}
        onClose={() => setIsVocabDrawerOpen(false)}
        vocabs={cardVocabs}
        isDarkMode={isDarkMode}
        part={part || (card.id.startsWith("p") ? card.id.slice(1, 2) : 1)}
        level={card.title ? card.title.split("–")[0].trim() : 1}
        title={`Giỏ từ · ${card.title}`}
        subtitle={`${cardVocabs.length} từ — dành riêng cho ${card.title}`}
        onRemoveVocab={handleRemoveVocab}
      />

      {/* MODAL XÁC NHẬN XOÁ TIẾN ĐỘ CHUẨN 100% ẢNH NGƯỜI DÙNG */}
      {isConfirmModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop mờ phủ toàn màn hình */}
            <div
              className="fixed inset-0 bg-black/75  transition-opacity"
              onClick={() => setIsConfirmModalOpen(false)}
            />

            {/* Hộp thoại xác nhận */}
            <div className="relative z-10 w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl transition-all">
              <h3 className="text-lg sm:text-[19px] font-bold text-white tracking-tight mb-2.5">
                Xoá tiến độ {levelShortTitle}?
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Toàn bộ trạng thái đúng/sai của các câu thuộc{" "}
                <strong className="text-white font-semibold">
                  {partName} — {levelShortTitle}
                </strong>{" "}
                sẽ trở về chưa làm. Hành động này{" "}
                <strong className="text-white font-semibold">
                  không thể hoàn tác
                </strong>
                .
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/60 active:scale-95 transition-all cursor-pointer"
                >
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProgress}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#dc2626] hover:bg-[#ef4444] active:scale-95 transition-all shadow-md shadow-rose-950/40 cursor-pointer"
                >
                  Xoá ngay
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* MODAL THÔNG BÁO CHƯA CÓ TIẾN ĐỘ CHUẨN 100% ẢNH NGƯỜI DÙNG */}
      {isNoProgressModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop tối phủ toàn màn hình (không làm mờ) */}
            <div
              className="fixed inset-0 bg-black/75 transition-opacity"
              onClick={() => setIsNoProgressModalOpen(false)}
            />

            {/* Hộp thoại thông báo Chưa có tiến độ */}
            <div className="relative z-10 w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl p-6 shadow-2xl transition-all">
              <h3 className="text-lg sm:text-[19px] font-bold text-white tracking-tight mb-2.5">
                Chưa có tiến độ
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Bạn chưa luyện câu nào ở {levelShortTitle}. Hãy bắt đầu luyện
                trước khi reset.
              </p>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsNoProgressModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-95 transition-all shadow-md shadow-blue-950/30 cursor-pointer"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
