import type React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ShoppingBasket, ShoppingBag, X, Volume2, Clock, Trash2 } from "lucide-react";
import type { VocabItem } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: VocabBasketDrawer.tsx
 * MỤC ĐÍCH: Khung trượt bên phải hiển thị danh sách từ vựng đã lưu trong giỏ từ
 * THIẾT KẾ: Bám sát 100% Ảnh người dùng:
 *   - Icon: ShoppingBasket màu xanh da trời (sky-400)
 *   - Tiêu đề: "Giỏ từ · Part 1 · Level 1"
 *   - Phụ đề: "2 từ — dùng chung cho cả cấp độ"
 *   - Mục: "🕒 Mới thêm gần đây"
 *   - Nút đóng (X) bên phải trên thanh tiêu đề
 *   - Thẻ từ vựng nền tối bo góc kèm phát âm
 * ==============================================================================
 */

interface VocabBasketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  vocabs: VocabItem[];
  isDarkMode?: boolean;
  part?: number | string;
  level?: number | string;
  title?: string;
  subtitle?: string;
  onRemoveVocab?: (word: string) => void;
}

export const VocabBasketDrawer: React.FC<VocabBasketDrawerProps> = ({
  isOpen,
  onClose,
  vocabs,
  isDarkMode = true,
  part,
  level,
  title,
  subtitle,
  onRemoveVocab,
}) => {
  // Đóng khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Phát âm từ vựng tiếng Anh
  const handlePronounce = (word: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  if (!isOpen) return null;

  // Format tiêu đề giỏ từ chuẩn ảnh: "Giỏ từ · Part 1 · Level 1"
  const formatPartText = () => {
    if (!part) return "Part 1";
    const str = String(part).trim();
    if (str.toLowerCase().startsWith("part")) return str;
    return `Part ${str}`;
  };

  const formatLevelText = () => {
    if (!level) return "Level 1";
    const str = String(level).trim();
    if (str.includes("–")) return str.split("–")[0].trim();
    if (str.includes("-")) return str.split("-")[0].trim();
    if (str.toLowerCase().startsWith("level")) return str;
    return `Level ${str}`;
  };

  const headerTitle =
    title || `Giỏ từ · ${formatPartText()} · ${formatLevelText()}`;
  const headerSubtitle =
    subtitle || `${vocabs.length} từ — dùng chung cho cả cấp độ`;

  const drawerContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-end animate-fade-in">
      {/* Backdrop mờ phủ toàn màn hình */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Khung Drawer trượt từ bên phải toàn chiều cao màn hình chuẩn 100% Ảnh */}
      <aside
        className={`relative z-10 w-full max-w-sm sm:max-w-md md:max-w-lg h-full p-5 sm:p-6 border-l shadow-2xl flex flex-col justify-start transition-all duration-300 overflow-y-auto ${
          isDarkMode
            ? "bg-[#070e20] border-slate-800/80 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header Drawer chuẩn ảnh */}
        <div className="flex items-start justify-between pb-3.5 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-3">
            <ShoppingBasket size={22} className="text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base sm:text-[17px] text-white tracking-tight leading-tight">
                {headerTitle}
              </h3>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                {headerSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Đóng giỏ từ"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nhãn "Mới thêm gần đây" chuẩn ảnh */}
        {vocabs.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3 px-0.5">
            <Clock size={13} className="text-slate-400 shrink-0" />
            <span>Mới thêm gần đây</span>
          </div>
        )}

        {/* Danh sách thẻ từ vựng */}
        {vocabs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <ShoppingBag
              size={36}
              className="mx-auto mb-3 opacity-40 text-slate-500"
            />
            <p className="text-sm font-semibold text-slate-300">
              Chưa có từ vựng nào trong giỏ từ.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Hãy bấm "Thêm vào giỏ từ" khi luyện tập để xem lại tại đây!
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 pr-0.5">
            {vocabs.map((v, i) => (
              <div
                key={`${v.word}-${i}`}
                className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode
                    ? "bg-[#0a1226] border-slate-800/90 hover:border-slate-700/80"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Dòng 1: Từ vựng + Phiên âm + Loa phát âm */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-amber-400 text-sm sm:text-[15px]">
                      {v.word}
                    </span>
                    {v.phonetic && (
                      <span className="text-xs text-slate-400 font-mono">
                        {v.phonetic}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePronounce(v.word)}
                      className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 active:scale-95 transition-all cursor-pointer"
                      title="Phát âm"
                    >
                      <Volume2 size={15} />
                    </button>
                    {onRemoveVocab && (
                      <button
                        type="button"
                        onClick={() => onRemoveVocab(v.word)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
                        title="Xóa khỏi giỏ từ"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Dòng 2: Nghĩa tiếng Việt */}
                <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                  {v.meaning}
                </p>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
