import type React from "react";
import { useState, useRef, useEffect } from "react";
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
  onAddToBasket,
  isDarkMode,
}) => {
  // Toggles độc lập cho Dịch nghĩa câu hỏi & Từ vựng nên học
  const [showTranslation, setShowTranslation] = useState<boolean>(false);
  const [showVocab, setShowVocab] = useState<boolean>(false);
  const [showAIMentorModal, setShowAIMentorModal] = useState<boolean>(false);

  // Quản lý toggle đóng/mở riêng biệt cho Dịch câu hỏi & Giải thích chi tiết của từng câu con trong Part 3 & 4
  const [closedTransSubIds, setClosedTransSubIds] = useState<string[]>([]);
  const [closedExplSubIds, setClosedExplSubIds] = useState<string[]>([]);

  const toggleSubTranslation = (subId: string) => {
    setClosedTransSubIds((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId],
    );
  };

  const toggleSubExplanation = (subId: string) => {
    setClosedExplSubIds((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId],
    );
  };

  const prevSentenceIdRef = useRef<string>(sentence.id);

  // Tự động mở Dịch nghĩa & Từ vựng khi đã chọn đáp án, và reset trạng thái khi chuyển câu mới
  useEffect(() => {
    const isAnswered: boolean = Boolean(
      part <= 2
        ? !!userAnswers[sentence.id]
        : (sentence.subQuestions?.length ?? 0) > 0 &&
            sentence.subQuestions?.every((sq) => !!userAnswers[sq.id]),
    );

    if (prevSentenceIdRef.current !== sentence.id) {
      prevSentenceIdRef.current = sentence.id;
      // Chuyển sang câu mới: nếu đã làm rồi thì mở, chưa làm thì đóng
      setClosedTransSubIds([]);
      setClosedExplSubIds([]);
      setShowTranslation(isAnswered);
      setShowVocab(isAnswered);
      return;
    }

    // Nếu ở cùng một câu và vừa mới hoàn thành chọn đáp án
    if (isAnswered) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowTranslation(true);
      setShowVocab(true);
    }
  }, [sentence.id, sentence.subQuestions, part, userAnswers]);

  // Hiệu ứng phát âm từ vựng
  const handlePronounce = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  // Helper trích xuất thông tin dịch câu hỏi và giải thích chi tiết chuẩn format mẫu
  const getSubQuestionDetails = (
    subQ: NonNullable<SentenceItem["subQuestions"]>[number],
    currentSentence: SentenceItem,
  ) => {
    // 1. Dịch câu hỏi (bỏ phần đáp án sau '->' nếu có)
    let questionTrans = subQ.translation || "";
    if (questionTrans.includes("->")) {
      questionTrans = questionTrans.split("->")[0].trim();
    }
    questionTrans = questionTrans.replace(/^Dịch:\s*/i, "").trim();

    // 2. Script quote: Ưu tiên subQ.scriptQuoteEn -> subQ.evidence -> tìm câu trong transcript
    let scriptQuoteEn = subQ.scriptQuoteEn || "";
    if (!scriptQuoteEn && subQ.evidence) {
      if (currentSentence.transcript) {
        const lines = currentSentence.transcript.split("\n");
        const found = lines.find((l) =>
          l.toLowerCase().includes(subQ.evidence!.toLowerCase().slice(0, 15)),
        );
        scriptQuoteEn = found
          ? found.replace(/^[A-Za-z]+:\s*/, "").trim()
          : subQ.evidence;
      } else {
        scriptQuoteEn = subQ.evidence;
      }
    }

    // 3. Script quote tiếng Việt
    const scriptQuoteVi = subQ.scriptQuoteVi || "";

    // 4. Paraphrase
    const correctOpt = subQ.options.find((o) => o.isCorrect);
    let paraphraseText = subQ.paraphrase || "";
    if (!paraphraseText && subQ.evidence && correctOpt) {
      paraphraseText = `${subQ.evidence} = ${correctOpt.text}${
        correctOpt.translation ? ` (${correctOpt.translation})` : ""
      }`;
    }

    return {
      questionTrans,
      scriptQuoteEn,
      scriptQuoteVi,
      paraphraseText,
    };
  };

  // Trạng thái đã hoàn thành câu hỏi hiện tại
  const isCurrentAnswered: boolean = Boolean(
    part <= 2
      ? !!userAnswers[sentence.id]
      : (sentence.subQuestions?.length ?? 0) > 0 &&
          sentence.subQuestions?.every((sq) => !!userAnswers[sq.id]),
  );

  // Lựa chọn hiện tại cho câu đơn (Part 1 hoặc Part 2)
  const singleAnswer = userAnswers[sentence.id];

  return (
    <div className="space-y-4">
      {/* 1. THANH TIÊU ĐỀ PHỤ: BADGE LEVEL VÀ NÚT HỎI BÀI */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#1877f2] text-white tracking-wide shadow-sm">
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
          className={`rounded-2xl p-5 border transition-all duration-200 ${
            isDarkMode
              ? "bg-[#0a1224] border-sky-950/80 shadow-xl shadow-black/20"
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
                  ? "bg-[#080e1d] border-slate-800/90 hover:border-sky-500/50 hover:bg-[#0c162e] text-slate-200"
                  : "bg-slate-50 border-slate-200 hover:border-sky-400 hover:bg-sky-50/40 text-slate-800";
              } else if (isSelected && isCorrectAnswer) {
                cardStyles =
                  "bg-emerald-950/30 border-2 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/10";
              } else if (isSelected && !isCorrectAnswer) {
                cardStyles =
                  "bg-rose-950/30 border-2 border-rose-500 text-rose-200 shadow-md shadow-rose-500/10";
              } else if (!isSelected && isCorrectAnswer) {
                cardStyles =
                  "bg-emerald-950/20 border-2 border-emerald-500/80 text-emerald-300";
              } else {
                cardStyles = isDarkMode
                  ? "bg-[#080e1d]/80 border-slate-800 text-slate-300"
                  : "bg-slate-50/60 border-slate-200 text-slate-500";
              }

              return (
                <div
                  key={opt.key}
                  role="button"
                  tabIndex={hasAnswered ? -1 : 0}
                  onClick={() => {
                    if (hasAnswered) return; // Đã chọn đáp án rồi thì không được chọn lại
                    const sel = window.getSelection();
                    if (sel && sel.toString().trim().length > 0) {
                      return; // Bôi đen gạch chân chữ hoặc copy chữ, không kích hoạt chọn đáp án
                    }
                    onSelectOption(sentence.id, opt.key, opt.isCorrect);
                    setShowTranslation(true);
                    setShowVocab(true);
                  }}
                  onKeyDown={(e) => {
                    if (!hasAnswered && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      onSelectOption(sentence.id, opt.key, opt.isCorrect);
                      setShowTranslation(true);
                      setShowVocab(true);
                    }
                  }}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 select-text ${
                    hasAnswered ? "cursor-default" : "cursor-pointer"
                  } ${cardStyles}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 select-text">
                    {/* Luôn hiển thị Radio Circle / Check / X chuẩn DauEnglish */}
                    <div
                      className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors select-none ${
                        hasAnswered && isSelected && !isCorrectAnswer
                          ? "border-rose-500 bg-rose-500 text-white font-bold text-[10px]"
                          : hasAnswered && isCorrectAnswer
                            ? "border-emerald-500 bg-emerald-500 text-white font-bold text-[11px]"
                            : isSelected
                              ? "border-sky-500 bg-sky-500"
                              : isDarkMode
                                ? "border-slate-500/80 bg-transparent"
                                : "border-slate-300 bg-transparent"
                      }`}
                    >
                      {hasAnswered && isSelected && !isCorrectAnswer ? (
                        <span>✕</span>
                      ) : hasAnswered && isCorrectAnswer ? (
                        <span>✓</span>
                      ) : isSelected ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      ) : null}
                    </div>

                    {/* Nội dung câu hoặc nhãn chữ */}
                    <div className="flex-1 min-w-0 select-text">
                      <div className="font-semibold text-sm sm:text-base leading-relaxed select-text">
                        {!hasAnswered ? (
                          <span className="select-text">({opt.key})</span>
                        ) : (
                          <span className="select-text">
                            ({opt.key}) {opt.text}
                          </span>
                        )}
                      </div>

                      {/* Hiển thị dịch nghĩa từng đáp án khi đã chọn đáp án và bật Song ngữ ("nhảy lên đáp án cho gọn" chuẩn Ảnh 3) */}
                      {hasAnswered && isBilingualActive && opt.translation && (
                        <div className="mt-1.5 flex items-start border-l-2 border-sky-400 pl-2.5 py-0.5 select-text">
                          <p
                            className={`text-xs sm:text-sm font-normal select-text ${
                              isDarkMode ? "text-sky-300" : "text-sky-700"
                            }`}
                          >
                            {opt.translation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Icon Check hoặc X khi đã chọn */}
                  {hasAnswered && isSelected && (
                    <div className="shrink-0 select-none">
                      {isCorrectAnswer ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <XCircle size={18} className="text-rose-400" />
                      )}
                    </div>
                  )}
                </div>
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
              const isSubBookmarked = bookmarkedSubIds.includes(subQ.id);
              const isTransOpen = !closedTransSubIds.includes(subQ.id);
              const isExplOpen = !closedExplSubIds.includes(subQ.id);
              const subDetails = getSubQuestionDetails(subQ, sentence);

              return (
                <div key={subQ.id} className="pt-5 first:pt-0 space-y-3.5">
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

                  {/* Dịch câu hỏi nếu bật song ngữ (chuẩn Part 2 & 3 - khi đã chọn đáp án và bật Song ngữ) */}
                  {isCurrentAnswered && isBilingualActive && subDetails.questionTrans && (
                    <div className="mt-1 flex items-start border-l-2 border-sky-400 pl-2.5 py-0.5 select-text">
                      <p
                        className={`text-xs sm:text-sm select-text ${
                          isDarkMode ? "text-sky-300" : "text-sky-700"
                        }`}
                      >
                        {subDetails.questionTrans}
                      </p>
                    </div>
                  )}

                  {/* 4 lựa chọn Radio chuẩn ảnh mẫu */}
                  <div className="space-y-2">
                    {subQ.options.map((opt) => {
                      const isSelected = currentSubAnswer === opt.key;
                      const isCorrect = opt.isCorrect;

                      // eslint-disable-next-line no-useless-assignment
                      let optStyles = "";
                      if (!isCurrentAnswered) {
                        // CHƯA LÀM XONG CẢ NHÓM: CHỈ HIỂN THỊ TRẠNG THÁI ĐÃ CHỌN (KHÔNG HIỆN ĐÁP ÁN ĐÚNG HAY XANH/ĐỎ)
                        if (isSelected) {
                          optStyles = isDarkMode
                            ? "bg-sky-950/30 border-2 border-sky-500 text-sky-200 shadow-sm shadow-sky-500/10"
                            : "bg-sky-50 border-2 border-sky-500 text-sky-900 shadow-sm";
                        } else {
                          optStyles = isDarkMode
                            ? "bg-[#080d1c] border-slate-800 hover:border-slate-700 text-slate-200"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800";
                        }
                      } else {
                        // ĐÃ LÀM XONG HẾT TOÀN BỘ CÂU TRONG NHÓM: CHẤM ĐIỂM VÀ HIỆN ĐÁP ÁN ĐÚNG THEO ẢNH MẪU
                        if (isSelected && isCorrect) {
                          optStyles = isDarkMode
                            ? "bg-emerald-950/20 border border-emerald-500/90 text-emerald-300"
                            : "bg-emerald-50 border-2 border-emerald-500 text-emerald-900";
                        } else if (isSelected && !isCorrect) {
                          optStyles = isDarkMode
                            ? "bg-rose-950/20 border border-rose-500/90 text-rose-300"
                            : "bg-rose-50 border-2 border-rose-500 text-rose-900";
                        } else if (!isSelected && isCorrect) {
                          optStyles = isDarkMode
                            ? "bg-emerald-950/20 border border-emerald-500/80 text-emerald-300"
                            : "bg-emerald-50 border border-emerald-500/80 text-emerald-900";
                        } else {
                          optStyles = isDarkMode
                            ? "bg-[#080d1c] border-slate-800/80 text-slate-200"
                            : "bg-slate-50/50 border-slate-200 text-slate-600";
                        }
                      }

                      return (
                        <div
                          key={opt.key}
                          role="button"
                          tabIndex={isCurrentAnswered ? -1 : 0}
                          onClick={() => {
                            if (isCurrentAnswered) return; // Đã hoàn thành cả nhóm câu rồi thì khoá lại
                            const sel = window.getSelection();
                            if (sel && sel.toString().trim().length > 0) {
                              return; // Bôi đen gạch chân chữ hoặc copy chữ, không kích hoạt chọn đáp án
                            }
                            onSelectOption(subQ.id, opt.key, opt.isCorrect);

                            // Nếu tất cả câu con đã hoàn thành xong thì mở dịch nghĩa & từ vựng
                            const willBeComplete = (
                              sentence.subQuestions || []
                            ).every(
                              (sq) => sq.id === subQ.id || !!userAnswers[sq.id],
                            );
                            if (willBeComplete) {
                              setShowTranslation(true);
                              setShowVocab(true);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (
                              !isCurrentAnswered &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              onSelectOption(subQ.id, opt.key, opt.isCorrect);
                            }
                          }}
                          className={`w-full text-left px-3.5 py-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs sm:text-sm select-text ${
                            isCurrentAnswered
                              ? "cursor-default"
                              : "cursor-pointer"
                          } ${optStyles}`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0 select-text">
                            {/* Radio Circle chuẩn ảnh: Có dấu check ✓ màu xanh khi đúng */}
                            <div
                              className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors select-none text-[10px] font-bold ${
                                !isCurrentAnswered
                                  ? isSelected
                                    ? "border-sky-500 bg-sky-500"
                                    : isDarkMode
                                      ? "border-slate-600 bg-slate-800"
                                      : "border-slate-300 bg-white"
                                  : isSelected && isCorrect
                                    ? "border-emerald-500 bg-transparent text-emerald-400"
                                    : isSelected && !isCorrect
                                      ? "border-rose-500 bg-rose-500 text-white"
                                      : !isSelected && isCorrect
                                        ? "border-emerald-500 bg-transparent text-emerald-400"
                                        : isDarkMode
                                          ? "border-slate-700 bg-transparent text-transparent"
                                          : "border-slate-300 bg-transparent text-transparent"
                              }`}
                            >
                              {!isCurrentAnswered ? (
                                isSelected ? (
                                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                ) : null
                              ) : isCorrect ? (
                                <span>✓</span>
                              ) : isSelected ? (
                                <span>✕</span>
                              ) : null}
                            </div>

                            <div className="flex-1 min-w-0 select-text">
                              <span className="font-semibold select-text">
                                ({opt.key}) {opt.text}
                              </span>

                              {/* Hiển thị dịch nghĩa từng đáp án khi đã chọn đáp án và bật Song ngữ (đưa lên như part 2) */}
                              {isCurrentAnswered && isBilingualActive && opt.translation && (
                                <div className="mt-1.5 flex items-start border-l-2 border-sky-400 pl-2.5 py-0.5 select-text">
                                  <p
                                    className={`text-xs sm:text-sm font-normal select-text ${
                                      isDarkMode ? "text-sky-300" : "text-sky-700"
                                    }`}
                                  >
                                    {opt.translation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 2 BOX RIÊNG BIỆT: DỊCH CÂU HỎI & GIẢI THÍCH CHI TIẾT (CHUẨN 100% ẢNH MẪU) */}
                  {isCurrentAnswered && (
                    <div className="space-y-3 pt-2">
                      {/* Box 1: Dịch câu hỏi (Chỉ hiển thị khi KHÔNG bật song ngữ, vì khi bật song ngữ bản dịch đã được đưa lên trên như Part 2) */}
                      {!isBilingualActive && (
                        <div
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            isDarkMode
                              ? "bg-[#0b1329] border-slate-800/80 shadow-md shadow-black/20"
                              : "bg-white border-slate-200 shadow-sm"
                          }`}
                        >
                          <div className="p-3.5 sm:p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400">
                              <Languages size={16} />
                              <span>Dịch câu hỏi</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleSubTranslation(subQ.id)}
                              title={
                                isTransOpen
                                  ? "Thu gọn dịch câu hỏi"
                                  : "Mở dịch câu hỏi"
                              }
                              className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                                isTransOpen
                                  ? "bg-sky-500 justify-end"
                                  : isDarkMode
                                    ? "bg-slate-700 justify-start"
                                    : "bg-slate-300 justify-start"
                              }`}
                            >
                              <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                            </button>
                          </div>

                          {isTransOpen && (
                            <div
                              className={`border-t px-3.5 sm:px-4 py-3.5 space-y-2 text-xs sm:text-sm leading-relaxed ${
                                isDarkMode
                                  ? "border-slate-800/80"
                                  : "border-slate-100"
                              }`}
                            >
                              {subDetails.questionTrans && (
                                <p
                                  className={`font-semibold text-sm leading-snug ${
                                    isDarkMode
                                      ? "text-slate-100"
                                      : "text-slate-800"
                                  }`}
                                >
                                  {subDetails.questionTrans}
                                </p>
                              )}

                              <div className="space-y-1.5 pt-1">
                                {subQ.options.map((opt) => (
                                  <div
                                    key={opt.key}
                                    className={`leading-relaxed text-xs sm:text-sm ${
                                      opt.isCorrect
                                        ? "text-emerald-400 font-semibold"
                                        : isDarkMode
                                          ? "text-slate-300 font-normal"
                                          : "text-slate-600 font-normal"
                                    }`}
                                  >
                                    <span>
                                      {opt.key}. {opt.translation || opt.text}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Box 2: Giải thích chi tiết */}
                      <div
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isDarkMode
                            ? "bg-[#0b1329] border-slate-800/80 shadow-md shadow-black/20"
                            : "bg-white border-slate-200 shadow-sm"
                        }`}
                      >
                        <div className="p-3.5 sm:p-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400">
                            <Sparkles size={16} />
                            <span>Giải thích chi tiết</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleSubExplanation(subQ.id)}
                            title={
                              isExplOpen
                                ? "Thu gọn giải thích chi tiết"
                                : "Mở giải thích chi tiết"
                            }
                            className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                              isExplOpen
                                ? "bg-sky-500 justify-end"
                                : isDarkMode
                                  ? "bg-slate-700 justify-start"
                                  : "bg-slate-300 justify-start"
                            }`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                          </button>
                        </div>

                        {isExplOpen && (
                          <div
                            className={`border-t p-3 sm:p-3.5 ${
                              isDarkMode
                                ? "border-slate-800/80"
                                : "border-slate-100"
                            }`}
                          >
                            <div
                              className={`rounded-xl border p-3.5 sm:p-4 space-y-2.5 text-xs sm:text-sm leading-relaxed ${
                                isDarkMode
                                  ? "bg-[#070e20] border-sky-950/80 text-slate-200"
                                  : "bg-sky-50/70 border-sky-200 text-slate-800"
                              }`}
                            >
                              <div className="font-bold text-sky-400 flex items-center gap-1.5 pb-0.5">
                                <BookOpen size={15} />
                                <span>
                                  Giải thích (Câu {subQ.questionNumber})
                                </span>
                              </div>

                              {subDetails.scriptQuoteEn && (
                                <p className="leading-relaxed">
                                  <strong
                                    className={
                                      isDarkMode
                                        ? "text-slate-300 font-semibold"
                                        : "text-slate-700 font-semibold"
                                    }
                                  >
                                    Script:
                                  </strong>{" "}
                                  <span>"{subDetails.scriptQuoteEn}"</span>
                                  {subDetails.scriptQuoteVi && (
                                    <span
                                      className={
                                        isDarkMode
                                          ? "text-slate-300"
                                          : "text-slate-600"
                                      }
                                    >
                                      {" "}
                                      ({subDetails.scriptQuoteVi})
                                    </span>
                                  )}
                                </p>
                              )}

                              {subDetails.paraphraseText && (
                                <p className="leading-relaxed">
                                  <strong
                                    className={
                                      isDarkMode
                                        ? "text-slate-300 font-semibold"
                                        : "text-slate-700 font-semibold"
                                    }
                                  >
                                    Paraphrase:
                                  </strong>{" "}
                                  <span>{subDetails.paraphraseText}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. CÁC NÚT TOGGLE TIỆN ÍCH DƯỚI CÙNG: DỊCH NGHĨA (PART 1 & 2) VÀ TỪ VỰNG */}
      {isCurrentAnswered && (
        <div className="space-y-2 animate-fade-in">
          {/* Toggle 1: ✨ Dịch nghĩa câu hỏi - chỉ dành riêng cho Part 1 & 2 (Part 3 & 4 đã có box dịch riêng từng câu) */}
          {part <= 2 && !isBilingualActive && (
            <>
              <div
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isDarkMode
                    ? "bg-[#0b1329]/70 border-slate-800/80 hover:border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-400">
                  <Languages size={16} />
                  <span>Dịch nghĩa câu hỏi</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTranslation((prev) => !prev)}
                  className={`w-11 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                    showTranslation
                      ? "bg-sky-500 justify-end"
                      : "bg-slate-700 justify-start"
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </button>
              </div>

              {/* Nội dung dịch nghĩa khi mở */}
              {showTranslation && (
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl border animate-fade-in text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                    isDarkMode
                      ? "bg-[#070e20] border-sky-500/30 text-slate-300"
                      : "bg-sky-50/70 border-sky-200 text-slate-800"
                  }`}
                >
                  {sentence.options ? (
                    <div className="space-y-2">
                      {sentence.options.map((opt) => {
                        const isCorrect = opt.isCorrect;
                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-colors ${
                              isCorrect
                                ? "bg-emerald-950/30 border-emerald-500/80 text-emerald-300 font-medium"
                                : "bg-[#0a1428] border-slate-800/80 text-slate-300"
                            }`}
                          >
                            {isCorrect && (
                              <div className="w-4.5 h-4.5 rounded-full border border-emerald-500 bg-emerald-500 text-white flex items-center justify-center shrink-0 text-[10px] font-black">
                                ✓
                              </div>
                            )}
                            <span>
                              ({opt.key}) {opt.translation || opt.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-sky-400 mb-1.5 flex items-center gap-1.5">
                        <Sparkles size={14} /> Bản dịch tiếng Việt & Giải thích:
                      </p>
                      <p className="whitespace-pre-line">
                        {sentence.vietnameseTranslation}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Toggle 2: 📖 Từ vựng nên học */}
          {sentence.vocabRecommendation && (
            <>
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
              {showVocab && (
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
            </>
          )}
        </div>
      )}

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
