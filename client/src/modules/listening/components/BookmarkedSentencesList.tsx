import type React from "react";
import { Bookmark, Volume2, ArrowRight, Trash2, Headphones } from "lucide-react";
import type { SentenceItem, ListeningPart } from "../types";

/**
 * ==============================================================================
 * COMPONENT: BookmarkedSentencesList.tsx
 * MỤC ĐÍCH: Hiển thị danh sách các câu đã đánh dấu "Cần luyện lại" hoặc Trạng thái rỗng
 * ==============================================================================
 */

export interface BookmarkedSentenceEntry extends SentenceItem {
  part: ListeningPart;
}

interface BookmarkedSentencesListProps {
  items: BookmarkedSentenceEntry[];
  onPracticeSentence: (item: BookmarkedSentenceEntry) => void;
  onRemoveBookmark: (sentenceId: string) => void;
  isDarkMode: boolean;
}

export const BookmarkedSentencesList: React.FC<BookmarkedSentencesListProps> = ({
  items,
  onPracticeSentence,
  onRemoveBookmark,
  isDarkMode,
}) => {
  // Phát âm câu
  const handlePronounce = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  // 1. TRƯỜNG HỢP DANH SÁCH RỖNG (Chuẩn Ảnh 1)
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 animate-fade-in">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
            isDarkMode ? "bg-slate-800/60 text-slate-500" : "bg-slate-100 text-slate-400"
          }`}
        >
          <Bookmark size={28} className="stroke-[2.2]" />
        </div>
        <h3
          className={`font-black text-base sm:text-lg mb-1.5 ${
            isDarkMode ? "text-white" : "text-slate-800"
          }`}
        >
          Chưa có câu nào được đánh dấu
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
          Bấm biểu tượng đánh dấu 🔖 trên thẻ câu khi luyện nghe để lưu câu vào đây.
        </p>
      </div>
    );
  }

  // 2. TRƯỜNG HỢP CÓ CÂU ĐÃ ĐÁNH DẤU
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-amber-400" />
          <h2
            className={`text-lg sm:text-xl font-black tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Câu cần luyện lại ({items.length} câu)
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group hover:translate-y-[-2px] hover:shadow-xl ${
              isDarkMode
                ? "bg-[#0b1329]/90 border-slate-800/90 hover:border-amber-500/40 shadow-md shadow-black/20"
                : "bg-white border-slate-200/90 hover:border-amber-300 shadow-sm hover:shadow-md"
            }`}
          >
            {/* Viền trên vàng hổ phách */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500/30" />

            <div>
              {/* Header của thẻ câu hỏi */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  Part {item.part} · Câu {item.sentenceIndex}
                  {item.topicTitle && ` · ${item.topicTitle}`}
                </span>

                <button
                  type="button"
                  onClick={() => onRemoveBookmark(item.id)}
                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Bỏ đánh dấu câu này"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Nội dung câu nghe */}
              <div className="flex items-start gap-2.5 my-2">
                <button
                  type="button"
                  onClick={() => handlePronounce(item.fullSentence)}
                  className="mt-0.5 p-1.5 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-500/25 transition-colors cursor-pointer shrink-0"
                  title="Phát âm câu"
                >
                  <Volume2 size={16} />
                </button>
                <p
                  className={`text-sm sm:text-base font-semibold leading-relaxed ${
                    isDarkMode ? "text-slate-100" : "text-slate-800"
                  }`}
                >
                  &ldquo;{item.fullSentence}&rdquo;
                </p>
              </div>

              {/* Gợi ý từ vựng nếu có */}
              {item.vocabRecommendation && (
                <div className="mt-2.5 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-300">
                  <span className="font-bold text-amber-400">
                    {item.vocabRecommendation.word}:
                  </span>{" "}
                  {item.vocabRecommendation.meaning} ({item.vocabRecommendation.phonetic})
                </div>
              )}
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-slate-800/40">
              <button
                type="button"
                onClick={() => onPracticeSentence(item)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Headphones size={13} />
                <span>Luyện câu này ngay</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
