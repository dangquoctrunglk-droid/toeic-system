import type React from "react";
import { useState } from "react";
import {
  Star,
  CheckCircle2,
  XCircle,
  BookOpen,
  Languages,
  Sparkles,
  Bot,
  X,
  Volume2,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-toastify";
import type {
  SentenceItem,
  ListeningPart,
  VocabItem,
  QuestionOption,
} from "../../types";

/**
 * ==============================================================================
 * COMPONENT: ETSMultipleChoiceCard.tsx
 * MỤC ĐÍCH: Khối bài tập trắc nghiệm chuẩn đề ETS TOEIC:
 *   - Part 1 (Ảnh 1): Câu 1., 4 lựa chọn (A-D) đầy đủ text, nút Dịch nghĩa & Từ vựng
 *   - Part 2 (Ảnh 2): Câu 7., 3 lựa chọn (A, B, C) radio buttons chuẩn format ETS
 *   - Part 3 & 4 (Ảnh 3): Nhóm câu 56 - 58 (3 câu hỏi), 3 câu hỏi liên hoàn,
 *     tích hợp Dẫn chứng (Evidence highlighting) & Dịch nghĩa hội thoại
 *   - Tích hợp Trợ lý AI Mentorship ("Hỏi bài") phân tích bẫy đề thi
 * ==============================================================================
 */

interface ETSMultipleChoiceCardProps {
  sentence: SentenceItem;
  part: ListeningPart;
  userAnswers: Record<string, string>;
  onSelectOption: (
    questionKey: string,
    optionKey: "A" | "B" | "C" | "D",
    isCorrect: boolean,
  ) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  bookmarkedSubIds?: string[];
  onToggleSubBookmark?: (subId: string) => void;
  isBilingualActive: boolean;
  isEvidenceActive: boolean;
  onAddToBasket?: (vocab: VocabItem) => void;
  isDarkMode: boolean;
}

export const ETSMultipleChoiceCard: React.FC<ETSMultipleChoiceCardProps> = ({
  sentence,
  part,
  userAnswers,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  bookmarkedSubIds = [],
  onToggleSubBookmark,
  isBilingualActive,
  isEvidenceActive,
  onAddToBasket,
  isDarkMode,
}) => {
  // Toggles độc lập cho Dịch nghĩa câu hỏi & Từ vựng nên học
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [showVocab, setShowVocab] = useState<boolean>(false);
  const [showEvidenceLocal, setShowEvidenceLocal] = useState<boolean>(false);
  const [showAIMentorModal, setShowAIMentorModal] = useState<boolean>(false);

  // Hiệu ứng phát âm từ vựng
  const handlePronounce = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  // Trạng thái hiển thị Dẫn chứng (kết hợp toggle header hoặc toggle thẻ)
  const isEvidenceVisible = isEvidenceActive || showEvidenceLocal;
  // Trạng thái hiển thị Dịch nghĩa (kết hợp Song ngữ header hoặc toggle thẻ)
  const isTranslationVisible = isBilingualActive || showTranslation;

  // Lựa chọn hiện tại cho câu đơn (Part 1 hoặc Part 2)
  const singleAnswer = userAnswers[sentence.id];

  return (
    <div className="space-y-4">
      {/* 1. THANH TIÊU ĐỀ PHỤ: BADGE LEVEL VÀ NÚT HỎI BÀI */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-500 text-white tracking-wide shadow-sm">
            Lv.1
          </span>
          {sentence.topicTitle && (
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {sentence.topicTitle}
            </span>
          )}
        </div>

        {/* Nút: 🤖 Hỏi bài (AI Mentor phân tích đề) */}
        <button
          type="button"
          onClick={() => setShowAIMentorModal(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 cursor-pointer ${
            isDarkMode
              ? "bg-[#0b1329] border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-sky-400 hover:border-sky-500/40"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-sky-600 shadow-sm"
          }`}
        >
          <Bot size={14} className="text-sky-400" />
          <span>Hỏi bài</span>
        </button>
      </div>

      {/* 2. KHUNG NỘI DUNG CHÍNH (THAY ĐỔI THEO TỪNG PART) */}
      {part === 1 || part === 2 ? (
        /* =========================================================================
         * GIAO DIỆN PART 1 & PART 2 (CÂU ĐƠN)
         * ========================================================================= */
        <div
          className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 border transition-all duration-200 ${
            isDarkMode
              ? "bg-[#0b1329]/95 border-slate-800/80 shadow-xl shadow-black/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Header câu: Số thứ tự câu e.g. "1." hoặc "7." & Ngôi sao Bookmark */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`font-black text-base sm:text-lg ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {sentence.displayNumber || `${sentence.sentenceIndex}.`}
            </span>

            {/* Nút Ngôi sao lưu Bookmark */}
            <button
              type="button"
              onClick={onToggleBookmark}
              title={
                isBookmarked ? "Bỏ lưu câu này" : "Lưu vào câu cần luyện lại"
              }
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                isBookmarked
                  ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20"
                  : isDarkMode
                    ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Star
                size={18}
                className={isBookmarked ? "fill-amber-400 text-amber-400" : ""}
              />
            </button>
          </div>

          {/* Danh sách các lựa chọn đáp án */}
          <div className="space-y-3">
            {sentence.options?.map((opt: QuestionOption) => {
              const isSelected = singleAnswer === opt.key;
              const hasAnswered = !!singleAnswer;
              const isCorrectAnswer = opt.isCorrect;

              // Định kiểu hiển thị dựa trên trạng thái trả lời
              // eslint-disable-next-line no-useless-assignment
              let cardStyles = "";
              if (!hasAnswered) {
                cardStyles = isDarkMode
                  ? "bg-[#080d1c] border-slate-800 hover:border-sky-500/50 hover:bg-[#0c142b] text-slate-200"
                  : "bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800";
              } else if (isSelected && isCorrectAnswer) {
                cardStyles =
                  "bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/10";
              } else if (isSelected && !isCorrectAnswer) {
                cardStyles =
                  "bg-rose-950/40 border-2 border-rose-500 text-rose-300";
              } else if (!isSelected && isCorrectAnswer) {
                cardStyles =
                  "bg-emerald-950/20 border border-emerald-500/60 text-emerald-400/90";
              } else {
                cardStyles = isDarkMode
                  ? "bg-[#080d1c]/50 border-slate-800/60 text-slate-500 opacity-60"
                  : "bg-slate-50/60 border-slate-200 text-slate-400 opacity-60";
              }

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() =>
                    onSelectOption(sentence.id, opt.key, opt.isCorrect)
                  }
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${cardStyles}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Part 2 hiển thị dạng Radio Circle ○ (A), (B), (C) chuẩn ảnh 2 */}
                    {part === 2 ? (
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? isCorrectAnswer
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-rose-500 bg-rose-500"
                            : isDarkMode
                              ? "border-slate-600 bg-slate-800"
                              : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                    ) : null}

                    {/* Nội dung câu hoặc nhãn chữ */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm sm:text-base leading-relaxed">
                        {part === 2 ||
                        (part === 1 &&
                          !hasAnswered &&
                          !isTranslationVisible) ? (
                          <span>({opt.key})</span>
                        ) : (
                          <span>
                            ({opt.key}) {opt.text}
                          </span>
                        )}
                      </div>

                      {/* Hiển thị dịch nghĩa từng đáp án khi bật Song ngữ */}
                      {isTranslationVisible && opt.translation && (
                        <p
                          className={`text-xs mt-1 transition-all ${
                            isSelected && isCorrectAnswer
                              ? "text-emerald-400/80"
                              : isDarkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                          }`}
                        >
                          {opt.translation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Icon Check hoặc X khi đã chọn */}
                  {hasAnswered && isSelected && (
                    <div className="shrink-0">
                      {isCorrectAnswer ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <XCircle size={18} className="text-rose-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* =========================================================================
         * GIAO DIỆN PART 3 & PART 4 (NHÓM 3 CÂU HỎI LIÊN HOÀN - CHUẨN ẢNH 3)
         * ========================================================================= */
        <div
          className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 border space-y-6 transition-all duration-200 ${
            isDarkMode
              ? "bg-[#0b1329]/95 border-slate-800/80 shadow-xl shadow-black/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          {/* Header nhóm: e.g. "Nhóm câu 56 - 58 (3 câu hỏi)" */}
          <div className="pb-3 border-b border-slate-800/60 flex items-center justify-between">
            <h3
              className={`font-black text-sm sm:text-base tracking-wide ${
                isDarkMode ? "text-sky-300" : "text-sky-700"
              }`}
            >
              {sentence.groupTitle || `Nhóm câu ${sentence.displayNumber}`}
            </h3>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isDarkMode
                  ? "bg-slate-800 text-slate-400"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Part {part}
            </span>
          </div>

          {/* Danh sách 3 câu hỏi con */}
          <div className="space-y-6 divide-y divide-slate-800/40">
            {sentence.subQuestions?.map((subQ) => {
              const currentSubAnswer = userAnswers[subQ.id];
              const hasSubAnswered = !!currentSubAnswer;
              const isSubBookmarked = bookmarkedSubIds.includes(subQ.id);

              return (
                <div key={subQ.id} className="pt-5 first:pt-0 space-y-3">
                  {/* Tiêu đề câu hỏi con + Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`font-bold text-sm sm:text-base leading-snug ${
                        isDarkMode ? "text-slate-100" : "text-slate-900"
                      }`}
                    >
                      {subQ.questionNumber}. {subQ.questionText}
                    </p>

                    <button
                      type="button"
                      onClick={() => onToggleSubBookmark?.(subQ.id)}
                      title="Lưu câu này"
                      className={`p-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                        isSubBookmarked
                          ? "text-amber-400 bg-amber-400/10"
                          : isDarkMode
                            ? "text-slate-600 hover:text-slate-400"
                            : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Star
                        size={16}
                        className={
                          isSubBookmarked ? "fill-amber-400 text-amber-400" : ""
                        }
                      />
                    </button>
                  </div>

                  {/* Dịch câu hỏi nếu bật song ngữ */}
                  {isTranslationVisible && subQ.translation && (
                    <p className="text-xs text-sky-400/90 italic">
                      Dịch: {subQ.translation}
                    </p>
                  )}

                  {/* 4 lựa chọn Radio chuẩn ảnh 3 */}
                  <div className="space-y-2">
                    {subQ.options.map((opt) => {
                      const isSelected = currentSubAnswer === opt.key;
                      const isCorrect = opt.isCorrect;

                      // eslint-disable-next-line no-useless-assignment
                      let optStyles = "";
                      if (!hasSubAnswered) {
                        optStyles = isDarkMode
                          ? "bg-[#080d1c] border-slate-800 hover:border-slate-700 text-slate-200"
                          : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800";
                      } else if (isSelected && isCorrect) {
                        optStyles =
                          "bg-emerald-950/40 border-2 border-emerald-500 text-emerald-300";
                      } else if (isSelected && !isCorrect) {
                        optStyles =
                          "bg-rose-950/40 border-2 border-rose-500 text-rose-300";
                      } else if (!isSelected && isCorrect) {
                        optStyles =
                          "bg-emerald-950/20 border border-emerald-500/60 text-emerald-400/90";
                      } else {
                        optStyles = isDarkMode
                          ? "bg-[#080d1c]/40 border-slate-800/40 text-slate-500 opacity-60"
                          : "bg-slate-50/50 border-slate-200 text-slate-400 opacity-60";
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() =>
                            onSelectOption(subQ.id, opt.key, opt.isCorrect)
                          }
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm cursor-pointer ${optStyles}`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Radio Circle */}
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? isCorrect
                                    ? "border-emerald-500 bg-emerald-500"
                                    : "border-rose-500 bg-rose-500"
                                  : isDarkMode
                                    ? "border-slate-600 bg-slate-800"
                                    : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                              )}
                            </div>

                            <span className="font-medium">
                              ({opt.key}) {opt.text}
                            </span>
                          </div>

                          {/* Icon trạng thái */}
                          {hasSubAnswered && isSelected && (
                            <span className="shrink-0">
                              {isCorrect ? (
                                <CheckCircle2
                                  size={16}
                                  className="text-emerald-400"
                                />
                              ) : (
                                <XCircle size={16} className="text-rose-400" />
                              )}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CÁC NÚT TOGGLE TIỆN ÍCH DƯỚI CÙNG: DỊCH NGHĨA, TỪ VỰNG, DẪN CHỨNG */}
      <div className="space-y-2">
        {/* Toggle 1: ✨ Dịch nghĩa câu hỏi / hội thoại */}
        <div
          className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#0b1329]/70 border-slate-800/80 hover:border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400">
            <Languages size={16} />
            <span>
              {part >= 3
                ? "Dịch nghĩa hội thoại & câu hỏi"
                : "Dịch nghĩa câu hỏi"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowTranslation((prev) => !prev)}
            className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
              isTranslationVisible
                ? "bg-sky-500 justify-end"
                : "bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Nội dung dịch nghĩa khi mở */}
        {isTranslationVisible && (
          <div
            className={`p-4 rounded-2xl border animate-fade-in text-xs sm:text-sm leading-relaxed ${
              isDarkMode
                ? "bg-[#070e20] border-sky-500/30 text-slate-300"
                : "bg-sky-50/70 border-sky-200 text-slate-800"
            }`}
          >
            <p className="font-bold text-sky-400 mb-1.5 flex items-center gap-1.5">
              <Sparkles size={14} /> Bản dịch tiếng Việt & Giải thích:
            </p>
            <p className="whitespace-pre-line">
              {sentence.vietnameseTranslation}
            </p>
          </div>
        )}

        {/* Toggle 2: 📖 Từ vựng nên học */}
        <div
          className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#0b1329]/70 border-slate-800/80 hover:border-slate-700"
              : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400">
            <BookOpen size={16} />
            <span>Từ vựng nên học</span>
          </div>

          <button
            type="button"
            onClick={() => setShowVocab((prev) => !prev)}
            className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
              showVocab
                ? "bg-amber-500 justify-end"
                : "bg-slate-700 justify-start"
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {/* Nội dung từ vựng khi mở */}
        {showVocab && sentence.vocabRecommendation && (
          <div
            className={`p-4 rounded-2xl border animate-fade-in text-xs sm:text-sm space-y-2 ${
              isDarkMode
                ? "bg-[#181308]/90 border-amber-500/30 text-amber-100"
                : "bg-amber-50/80 border-amber-200 text-amber-950"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-amber-400">
                  {sentence.vocabRecommendation.word}
                </span>
                <span className="text-xs font-mono text-amber-300/80">
                  {sentence.vocabRecommendation.phonetic}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold">
                  {sentence.vocabRecommendation.type}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handlePronounce(sentence.vocabRecommendation!.word)
                  }
                  title="Phát âm từ vựng"
                  className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 transition-colors cursor-pointer"
                >
                  <Volume2 size={14} />
                </button>

                {onAddToBasket && (
                  <button
                    type="button"
                    onClick={() => {
                      onAddToBasket(sentence.vocabRecommendation!);
                      toast.success(
                        `Đã lưu "${sentence.vocabRecommendation!.word}" vào giỏ từ!`,
                      );
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    <ShoppingBag size={12} />
                    <span>Lưu từ</span>
                  </button>
                )}
              </div>
            </div>

            <p className="font-semibold text-slate-300">
              {sentence.vocabRecommendation.meaning}
            </p>

            {sentence.vocabRecommendation.example && (
              <p className="text-xs italic text-slate-400 border-l-2 border-amber-500/40 pl-2">
                "{sentence.vocabRecommendation.example}"
              </p>
            )}
          </div>
        )}

        {/* Toggle 3: 🔍 Dẫn chứng đoạn nghe (Dành riêng cho Part 3 & 4) */}
        {part >= 3 && sentence.transcript && (
          <div
            className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
              isDarkMode
                ? "bg-[#0b1329]/70 border-slate-800/80 hover:border-slate-700"
                : "bg-white border-slate-200"
            }`}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400">
              <Sparkles size={16} />
              <span>Dẫn chứng đoạn nghe (Transcript & Evidence)</span>
            </div>

            <button
              type="button"
              onClick={() => setShowEvidenceLocal((prev) => !prev)}
              className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                isEvidenceVisible
                  ? "bg-emerald-500 justify-end"
                  : "bg-slate-700 justify-start"
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        )}

        {/* Nội dung Dẫn chứng & Transcript khi mở */}
        {part >= 3 && isEvidenceVisible && sentence.transcript && (
          <div
            className={`p-4 rounded-2xl border animate-fade-in text-xs sm:text-sm leading-relaxed space-y-2.5 ${
              isDarkMode
                ? "bg-[#051410] border-emerald-500/30 text-slate-200"
                : "bg-emerald-50/70 border-emerald-200 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} /> Lời thoại gốc & Vị trí dẫn chứng:
              </span>
            </div>

            <div className="whitespace-pre-line text-xs font-mono leading-relaxed text-slate-300">
              {sentence.transcript}
            </div>

            {sentence.evidence && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                <span className="font-bold">🎯 Dẫn chứng trực tiếp:</span>{" "}
                {sentence.evidence}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. MODAL TRỢ LÝ AI MENTOR: "HỎI BÀI" */}
      {showAIMentorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl relative ${
              isDarkMode
                ? "bg-[#0c142b] border-sky-500/40 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            {/* Nút đóng modal */}
            <button
              type="button"
              onClick={() => setShowAIMentorModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header AI Mentor */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg flex items-center gap-1.5 text-white">
                  <span>Trợ lý AI TOEIC Master</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 font-bold">
                    PRO MENTOR
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Phân tích phương pháp nghe & giải mã bẫy đề thi Part {part}
                </p>
              </div>
            </div>

            {/* Nội dung phân tích của AI */}
            <div className="space-y-3.5 text-xs sm:text-sm">
              <div
                className={`p-3.5 rounded-2xl border ${
                  isDarkMode
                    ? "bg-[#060b18] border-slate-800 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-800"
                }`}
              >
                <span className="font-bold text-sky-400 block mb-1">
                  💡 Bí quyết chọn đáp án đúng:
                </span>
                <p className="leading-relaxed">
                  {sentence.vietnameseTranslation ||
                    "Tập trung nhận diện các từ khóa chỉ hành động (V-ing) và đối tượng tương tác chính trong tranh hoặc câu hỏi."}
                </p>
              </div>

              <div
                className={`p-3.5 rounded-2xl border ${
                  isDarkMode
                    ? "bg-[#180d12] border-rose-500/30 text-rose-200"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <span className="font-bold text-rose-400 block mb-1">
                  ⚠️ Bẫy thường gặp trong ETS:
                </span>
                <p className="leading-relaxed">
                  {part === 1
                    ? "Bẫy từ phát âm tương tự (sound-alike), bẫy suy đoán sai hành động hoặc bẫy vật thể không có trong ảnh."
                    : part === 2
                      ? "Bẫy lặp lại từ trong câu hỏi (same-word trap) hoặc trả lời 'Yes/No' cho các câu hỏi bắt đầu bằng Who/Where/When."
                      : "Bẫy thông tin gây nhiễu xuất hiện ở đầu câu trước khi người nói chuyển ý (distractor shifts)."}
                </p>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAIMentorModal(false)}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-lg shadow-sky-500/20"
              >
                Đã hiểu bí quyết!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
