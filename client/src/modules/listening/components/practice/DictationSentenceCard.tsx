import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Bookmark, Copy, Sparkles, X } from "lucide-react";
import { toast } from "react-toastify";
import type { SentenceItem, PracticeMode, BlankField } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: DictationSentenceCard.tsx
 * MỤC ĐÍCH: Khối Luyện nghe chép chính tả điền từ vào ô trống (Chuẩn Ảnh 2)
 * TÍNH NĂNG:
 *   - Các mức gợi ý: 30%, 50%, 100%
 *   - Nút Bookmark (đánh dấu câu), Nút Sao chép câu, Nút "Hỏi bài" cùng AI Mentor
 *   - Các ô gõ từ thông minh: tự nhảy sang ô tiếp theo khi điền đúng, kiểm tra tức thì
 *   - Hàng nút LẬT TỪ: 1 từ | 2 từ | 3 từ | Tất cả
 * ==============================================================================
 */

interface DictationSentenceCardProps {
  sentence: SentenceItem;
  mode: PracticeMode;
  onSentenceComplete: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isDarkMode: boolean;
}

export const DictationSentenceCard: React.FC<DictationSentenceCardProps> = ({
  sentence,
  mode,
  onSentenceComplete,
  isBookmarked,
  onToggleBookmark,
  isDarkMode,
}) => {
  const [hintLevel, setHintLevel] = useState<number>(50); // 30, 50, 100
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset dữ liệu ô điền khi chuyển sang câu mới
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserInputs({});
    setRevealedIds(new Set());
  }, [sentence.id]);

  // Cắt câu thành các từ hiển thị hoặc ô trống
  const sentenceWords = sentence.fullSentence.split(" ");

  // Xử lý khi người dùng gõ vào ô trống
  const handleInputChange = (
    blankId: string,
    targetWord: string,
    val: string,
  ) => {
    const cleanVal = val.trim();
    setUserInputs((prev) => ({ ...prev, [blankId]: val }));

    // Kiểm tra xem đã gõ đúng từ chưa (không phân biệt hoa thường và dấu chấm phẩy)
    const normalizedTarget = targetWord.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedUser = cleanVal.toLowerCase().replace(/[^a-z0-9]/g, "");

    if (normalizedUser === normalizedTarget) {
      // Tự động nhảy sang ô điền tiếp theo
      const blankIndex = sentence.blanks.findIndex(
        (b: BlankField) => b.id === blankId,
      );
      if (blankIndex < sentence.blanks.length - 1) {
        const nextBlank = sentence.blanks[blankIndex + 1];
        inputRefs.current[nextBlank.id]?.focus();
      } else {
        // Đã hoàn thành câu cuối cùng
        onSentenceComplete();
      }
    }
  };

  // Lật từ gợi ý (1 từ, 2 từ, 3 từ, Tất cả)
  const handleRevealWords = (count: number) => {
    const unrevealed = sentence.blanks.filter(
      (b: BlankField) => !revealedIds.has(b.id),
    );
    const toReveal = count === -1 ? unrevealed : unrevealed.slice(0, count);

    const newRevealed = new Set(revealedIds);
    toReveal.forEach((b: BlankField) => {
      newRevealed.add(b.id);
      setUserInputs((prev) => ({ ...prev, [b.id]: b.word }));
    });
    setRevealedIds(newRevealed);

    if (newRevealed.size === sentence.blanks.length) {
      onSentenceComplete();
    }
  };

  // Sao chép câu vào clipboard
  const handleCopySentence = () => {
    navigator.clipboard.writeText(sentence.fullSentence);
    toast.info("Đã sao chép câu vào bộ nhớ tạm");
  };

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 ${
        isDarkMode
          ? "bg-[#0b1329]/95 border-slate-800 shadow-xl shadow-black/20"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      {/* 1. HÀNG ĐẦU: Các mức gợi ý % & Cụm nút Bookmark / Copy / Hỏi bài */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {/* Nút mức gợi ý % (30%, 50%, 100%) & Chủ đề câu */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex items-center p-1 rounded-2xl border transition-colors ${
              isDarkMode
                ? "bg-[#070c1a] border-slate-800"
                : "bg-slate-100 border-slate-200"
            }`}
          >
            {[30, 50, 100].map((lvl) => {
              const isActive = hintLevel === lvl;
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setHintLevel(lvl)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-sky-500 text-white shadow-sm shadow-sky-500/30"
                      : isDarkMode
                        ? "text-slate-400 hover:text-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {lvl}%
                </button>
              );
            })}
          </div>

          {sentence.topicTitle && (
            <span
              className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors ${
                isDarkMode
                  ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                  : "bg-sky-50 border-sky-200 text-sky-700"
              }`}
            >
              {sentence.topicTitle}
            </span>
          )}
        </div>

        {/* Nút Bookmark, Copy và Hỏi bài AI Mentor */}
        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              isBookmarked
                ? "bg-amber-500/20 border-amber-400 text-amber-400"
                : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
            title="Đánh dấu câu cần luyện lại"
          >
            <Bookmark
              size={15}
              className={isBookmarked ? "fill-amber-400 text-amber-400" : ""}
            />
          </button>

          {/* Copy */}
          <button
            type="button"
            onClick={handleCopySentence}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
            title="Sao chép toàn bộ câu"
          >
            <Copy size={15} />
          </button>

          {/* Hỏi bài (AI Mentor) */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-slate-200 hover:text-sky-300 hover:border-sky-500/50"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300"
            }`}
          >
            <Sparkles size={14} className="text-sky-400" />
            <span>Hỏi bài</span>
          </button>
        </div>
      </div>

      {/* 2. KHU VỰC CÂU LUYỆN NGHE & CÁC Ô TRỐNG (Chuẩn format The [ ] is [ ] a [ ] of [ ] .) */}
      <div
        className={`p-5 sm:p-7 rounded-2xl border min-h-[100px] flex flex-wrap items-center gap-2.5 sm:gap-3 leading-relaxed text-base sm:text-lg font-medium transition-colors ${
          isDarkMode
            ? "bg-[#070c1a]/90 border-slate-800/80 text-slate-200"
            : "bg-slate-50 border-slate-200 text-slate-800"
        }`}
      >
        {mode === "full" ? (
          // Chế độ Nghe full: hiển thị toàn bộ nội dung nguyên văn
          <p className="text-sky-400 font-semibold">{sentence.fullSentence}</p>
        ) : (
          // Chế độ Nghe chép hoặc Nghe check: render các từ và ô trống
          sentenceWords.map((word: string, idx: number) => {
            const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
            const punctuation = word.replace(/[a-zA-Z0-9]/g, "");
            const blank = sentence.blanks.find(
              (b: BlankField) =>
                b.word.toLowerCase() === cleanWord.toLowerCase() &&
                b.position === idx,
            );

            if (!blank) {
              return (
                <span key={idx} className="whitespace-pre">
                  {word}
                </span>
              );
            }

            const currentVal = userInputs[blank.id] || "";
            const isCorrect =
              currentVal.trim().toLowerCase() === blank.word.toLowerCase();
            const isRevealed = revealedIds.has(blank.id);

            // Placeholder hiển thị chữ cái đầu nếu chọn gợi ý 50% hoặc 100%
            let placeholderText = "";
            if (hintLevel === 50 && blank.hint) {
              placeholderText = blank.hint + "...";
            } else if (hintLevel === 100) {
              placeholderText = blank.word;
            }

            return (
              <span key={idx} className="inline-flex items-center gap-1">
                <input
                  ref={(el) => {
                    inputRefs.current[blank.id] = el;
                  }}
                  type="text"
                  value={isRevealed ? blank.word : currentVal}
                  placeholder={placeholderText}
                  onChange={(e) =>
                    handleInputChange(blank.id, blank.word, e.target.value)
                  }
                  className={`px-2.5 py-1 text-center font-bold text-sm sm:text-base rounded-lg border outline-none transition-all duration-150 ${
                    isCorrect || isRevealed
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                      : isDarkMode
                        ? "border-slate-700 bg-[#0e1730] text-white focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
                        : "border-slate-300 bg-white text-slate-900 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  }`}
                  style={{
                    width: `${Math.max(blank.word.length * 12 + 20, 65)}px`,
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                />
                {punctuation ? <span>{punctuation}</span> : null}
              </span>
            );
          })
        )}
      </div>

      {/* 3. HÀNG NÚT LẬT TỪ (Chuẩn ảnh: LẬT TỪ: 1 từ | 2 từ | 3 từ | Tất cả) */}
      <div className="flex flex-wrap items-center gap-2 mt-5 pt-3 border-t border-slate-800/40">
        <span className="text-xs font-black uppercase tracking-wider text-slate-400 mr-1">
          LẬT TỪ:
        </span>
        {[
          { label: "1 từ", count: 1 },
          { label: "2 từ", count: 2 },
          { label: "3 từ", count: 3 },
          { label: "Tất cả", count: -1 },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleRevealWords(item.count)}
            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isDarkMode
                ? "bg-[#070c1a] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/50"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* MODAL HỎI BÀI AI MENTOR GIẢI THÍCH NGỮ PHÁP / TỪ VỰNG */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl relative ${
              isDarkMode
                ? "bg-[#0b1329] border-sky-500/30 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3 text-sky-400 font-bold text-sm">
              <Sparkles size={16} />
              <span>AI Mentor Giải Thích Câu Này</span>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
              <p className="font-semibold text-white">
                &ldquo;{sentence.fullSentence}&rdquo;
              </p>
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs leading-normal">
                <strong>💡 Cấu trúc câu:</strong> Thì hiện tại tiếp diễn mô tả
                hành động đặc trưng trong TOEIC Part 1. Chú ý các từ phát âm
                nuốt âm thường gặp giữa động từ và danh từ.
              </div>
              {sentence.vocabRecommendation && (
                <div className="text-xs text-slate-400">
                  <strong>Từ trọng tâm:</strong>{" "}
                  {sentence.vocabRecommendation.word} (
                  {sentence.vocabRecommendation.meaning})
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAiModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md shadow-sky-500/20"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
