import type React from "react";
import { BookOpen, Lock, Volume2, Plus, Check } from "lucide-react";
import type { VocabItem } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: VocabularyLockedCard.tsx
 * MỤC ĐÍCH: Thẻ hiển thị Từ vựng nên học có trạng thái Khóa / Mở khóa (Chuẩn Ảnh 2)
 * TRẠNG THÁI KHÓA (CHƯA XONG):
 *   - Icon Ổ Khóa 🔒
 *   - Tiêu đề: "Chép xong câu để xem 1 từ nên học"
 *   - Dòng phụ: "Từ vựng nằm ngay trong câu, hiện sớm sẽ lộ đáp án."
 * TRẠNG THÁI MỞ KHÓA (ĐÃ XONG HOẶC BẤM XEM):
 *   - Tên từ, phiên âm IPA, loại từ, giải nghĩa tiếng Việt
 *   - Nút phát âm loa từ vựng & Nút thêm vào Giỏ từ
 * ==============================================================================
 */

interface VocabularyLockedCardProps {
  vocab?: VocabItem;
  isUnlocked: boolean;
  onUnlockForce: () => void;
  onAddToBasket: (vocab: VocabItem) => void;
  isSavedInBasket: boolean;
  isDarkMode: boolean;
}

export const VocabularyLockedCard: React.FC<VocabularyLockedCardProps> = ({
  vocab,
  isUnlocked,
  onUnlockForce,
  onAddToBasket,
  isSavedInBasket,
  isDarkMode,
}) => {
  // Phát âm riêng từ vựng
  const handlePronounce = (word: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        isDarkMode
          ? "bg-[#0b1329]/95 border-slate-800 shadow-xl shadow-black/20"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      {/* 1. THANH TIÊU ĐỀ: 📖 Từ vựng nên học */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800/40">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} className="text-sky-400" />
          <h3
            className={`font-bold text-sm sm:text-base ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Từ vựng nên học
          </h3>
        </div>

        {!isUnlocked && (
          <button
            type="button"
            onClick={onUnlockForce}
            className="text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
          >
            Mở xem sớm
          </button>
        )}
      </div>

      {/* 2. NỘI DUNG (KHÓA HOẶC MỞ KHÓA) */}
      <div className="p-6 sm:p-8">
        {!isUnlocked ? (
          // TRẠNG THÁI KHÓA (Chuẩn Ảnh 2)
          <div className="flex flex-col items-center justify-center text-center py-6 sm:py-8">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                isDarkMode ? "bg-slate-800/70 text-slate-400" : "bg-slate-100 text-slate-500"
              }`}
            >
              <Lock size={22} className="stroke-[2.2]" />
            </div>

            <h4
              className={`font-bold text-sm sm:text-base mb-1.5 ${
                isDarkMode ? "text-slate-100" : "text-slate-800"
              }`}
            >
              Chép xong câu để xem 1 từ nên học
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Từ vựng nằm ngay trong câu, hiện sớm sẽ lộ đáp án.
            </p>
          </div>
        ) : vocab ? (
          // TRẠNG THÁI MỞ KHÓA: HIỂN THỊ TỪ VỰNG CHI TIẾT
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-black text-sky-400">
                  {vocab.word}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {vocab.phonetic}
                </span>
                <button
                  type="button"
                  onClick={() => handlePronounce(vocab.word)}
                  className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 transition-all cursor-pointer"
                  title="Phát âm từ"
                >
                  <Volume2 size={16} />
                </button>
              </div>

              {/* Nút thêm vào giỏ từ */}
              <button
                type="button"
                onClick={() => onAddToBasket(vocab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSavedInBasket
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-400"
                    : isDarkMode
                      ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/40"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
              >
                {isSavedInBasket ? (
                  <>
                    <Check size={14} />
                    <span>Đã lưu vào giỏ</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Thêm vào giỏ từ</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                {vocab.type}
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {vocab.meaning}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-500/5 border border-sky-500/15 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              &ldquo;{vocab.example}&rdquo;
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
