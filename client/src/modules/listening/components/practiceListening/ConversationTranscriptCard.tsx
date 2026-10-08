import type React from "react";
import { useState, useMemo } from "react";
import { FileText, Sparkles, CheckCircle2 } from "lucide-react";
import type { SentenceItem, ListeningPart, SubQuestionItem } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: ConversationTranscriptCard.tsx
 * MỤC ĐÍCH: Hộp hiển thị Lời thoại hội thoại (Transcript & Evidence) cho Part 3 & 4
 * Nằm ở CỘT TRÁI (ngay bên dưới AudioWaveformPlayer) chuẩn 100% theo Ảnh 2 & Ảnh 3:
 *   - Ảnh 2 (Dẫn chứng TẮT):
 *       + Header: [icon Document] Transcript [Toggle Switch]
 *       + Nhãn SCRIPT và thanh dọc xanh | SCRIPT
 *       + Lời thoại song ngữ: Dòng tiếng Anh ở trên, dòng tiếng Việt ở dưới có thanh kẻ dọc xanh |
 *   - Ảnh 3 (Dẫn chứng BẬT):
 *       + Tự động định vị câu dẫn chứng trả lời cho từng câu hỏi con
 *       + Gắn huy hiệu số câu hỏi [59], [60], [61] hoặc [32], [33], [34] ngay trước câu
 *       + Tô màu nổi bật (Amber / Sky / Emerald) & gạch chân câu dẫn chứng tương ứng
 * ==============================================================================
 */

interface ConversationTranscriptCardProps {
  sentence: SentenceItem;
  part: ListeningPart;
  isEvidence: boolean;
  onToggleEvidence?: () => void;
  isBilingual?: boolean;
  isDarkMode?: boolean;
  onSelectSubQuestion?: (questionNumber: number) => void;
}

interface ParsedDialogueLine {
  id: string;
  speaker?: string;
  text: string;
  translation?: string;
  matchingSubQ?: SubQuestionItem;
  subQIndex?: number;
}

export const ConversationTranscriptCard: React.FC<
  ConversationTranscriptCardProps
> = ({
  sentence,
  part: _part,
  isEvidence,
  onToggleEvidence,
  isBilingual: _isBilingual = true,
  isDarkMode = true,
  onSelectSubQuestion,
}) => {
  // Trạng thái bật/tắt hiển thị Transcript (Toggle switch bên phải header chuẩn Ảnh 2)
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Phân tích và ghép nối dòng lời thoại tiếng Anh với tiếng Việt và gắn vị trí dẫn chứng
  const parsedLines = useMemo<ParsedDialogueLine[]>(() => {
    if (!sentence.transcript) return [];

    const rawEnLines = sentence.transcript
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const rawViLines = sentence.vietnameseTranslation
      ? sentence.vietnameseTranslation
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean)
      : [];

    const subQuestions = sentence.subQuestions || [];

    // Helper chuẩn hoá chuỗi để so sánh khớp dẫn chứng
    const normalize = (str: string) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return rawEnLines.map((enLine, index) => {
      // Tách Speaker nếu có (ví dụ: "W-Am: ...", "Man: ...", "Woman: ...")
      let speaker: string | undefined = undefined;
      let textOnly = enLine;
      const speakerMatch = enLine.match(/^([A-Za-z0-9_-]+:\s*)(.+)$/);
      if (speakerMatch) {
        speaker = speakerMatch[1].trim();
        textOnly = speakerMatch[2].trim();
      }

      // Tìm dòng tiếng Việt tương ứng
      let translation = rawViLines[index];
      if (!translation && rawViLines.length === 1 && rawEnLines.length > 1) {
        // Nếu bản dịch tiếng Việt là 1 đoạn tóm tắt duy nhất
        translation = index === 0 ? rawViLines[0] : undefined;
      }

      // Kiểm tra xem dòng này có chứa dẫn chứng cho câu hỏi con nào không
      let matchingSubQ: SubQuestionItem | undefined = undefined;
      let subQIndex: number | undefined = undefined;

      const normLine = normalize(textOnly);

      for (let i = 0; i < subQuestions.length; i++) {
        const sq = subQuestions[i];
        if (sq.evidence && sq.evidence.trim()) {
          const normEvidence = normalize(sq.evidence);
          // Kiểm tra xem dòng có chứa đoạn dẫn chứng hoặc ngược lại
          if (
            normLine.includes(normEvidence) ||
            normEvidence.includes(normLine)
          ) {
            matchingSubQ = sq;
            subQIndex = i;
            break;
          }

          // Kiểm tra các cụm từ quan trọng dài >= 3 từ
          const evWords = normEvidence.split(" ").filter((w) => w.length > 2);
          if (evWords.length >= 3) {
            const samplePhrase = evWords.slice(0, 4).join(" ");
            if (normLine.includes(samplePhrase)) {
              matchingSubQ = sq;
              subQIndex = i;
              break;
            }
          }
        }
      }

      // Kiểm tra bổ sung từ trường sentence.evidence tổng hợp nếu subQ chưa bắt được
      if (!matchingSubQ && sentence.evidence) {
        const parts = sentence.evidence.split("|").map((p) => p.trim());
        for (let pIdx = 0; pIdx < parts.length; pIdx++) {
          const evPart = parts[pIdx];
          const tagMatch = evPart.match(/\[(\d+)\]/);
          if (tagMatch) {
            const qNum = parseInt(tagMatch[1], 10);
            const purePhrase = normalize(evPart.replace(/\[\d+\]/g, ""));
            if (purePhrase && normLine.includes(purePhrase)) {
              const matchedSq = subQuestions.find(
                (sq) => sq.questionNumber === qNum,
              );
              matchingSubQ =
                matchedSq ||
                ({
                  id: `auto-${qNum}`,
                  questionNumber: qNum,
                  questionText: "",
                  options: [],
                  correctOption: "A",
                } as SubQuestionItem);
              subQIndex = matchedSq ? subQuestions.indexOf(matchedSq) : pIdx;
              break;
            }
          }
        }
      }

      return {
        id: `line-${index}`,
        speaker,
        text: enLine,
        translation,
        matchingSubQ,
        subQIndex,
      };
    });
  }, [
    sentence.transcript,
    sentence.vietnameseTranslation,
    sentence.subQuestions,
    sentence.evidence,
  ]);

  if (!sentence.transcript) return null;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        isDarkMode
          ? "bg-[#0b1329]/95 border-slate-800/80 shadow-xl shadow-black/20"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      {/* 1. HEADER KHỐI TRANSCRIPT CHUẨN ẢNH 2 */}
      <div className="flex items-center justify-between p-4 sm:p-4.5 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <FileText
            size={16}
            className={isDarkMode ? "text-slate-400" : "text-slate-600"}
          />
          <span
            className={`font-bold text-sm tracking-wide ${
              isDarkMode ? "text-slate-200" : "text-slate-900"
            }`}
          >
            Transcript
          </span>

          {/* Huy hiệu nhỏ khi đang bật dẫn chứng */}
          {isEvidence && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Sparkles size={11} /> Dẫn chứng BẬT
            </span>
          )}
        </div>

        {/* Nút Toggle Switch Bật/Tắt Transcript chuẩn Ảnh 2 */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title={isOpen ? "Thu gọn Transcript" : "Mở Transcript"}
          className={`w-10 h-5.5 rounded-full transition-colors p-0.5 cursor-pointer flex items-center ${
            isOpen ? "bg-sky-500 justify-end" : "bg-slate-700 justify-start"
          }`}
        >
          <div className="w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all" />
        </button>
      </div>

      {/* 2. NỘI DUNG SCRIPT CHI TIẾT (CHUẨN ẢNH 2 & ẢNH 3) */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 animate-fade-in text-xs sm:text-sm">
          {/* Nhãn SCRIPT và thanh kẻ dọc xanh | SCRIPT chuẩn Ảnh 2 */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/40">
            <div className="space-y-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block select-none">
                SCRIPT
              </span>
              <div className="border-l-2 border-sky-400 pl-2 text-sky-400 font-semibold text-xs select-none">
                SCRIPT
              </div>
            </div>

            {/* Nút tiện ích Bật/Tắt Dẫn chứng ngay trên Transcript */}
            <button
              type="button"
              onClick={onToggleEvidence}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isEvidence
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-700/60"
              }`}
            >
              <CheckCircle2
                size={13}
                className={isEvidence ? "text-emerald-400" : "text-slate-500"}
              />
              <span>{isEvidence ? "Đang hiện dẫn chứng" : "Bật dẫn chứng"}</span>
            </button>
          </div>

          {/* Danh sách từng dòng hội thoại */}
          <div className="space-y-3.5 divide-y divide-slate-800/30">
            {parsedLines.map((line) => {
              const hasEvidence = isEvidence && !!line.matchingSubQ;
              const qIndex = line.subQIndex ?? 0;

              // Bảng màu cho từng câu hỏi con theo đúng Ảnh 3:
              // Câu 1 (e.g. 59): Badge xanh, text vàng/cam (amber)
              // Câu 2 (e.g. 60): Badge xanh, text xanh biển (sky)
              // Câu 3 (e.g. 61): Badge xanh ngọc/lá (emerald), text xanh ngọc
              const badgeBg =
                qIndex === 2
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-blue-600 hover:bg-blue-500";

              const highlightClass = hasEvidence
                ? qIndex === 0
                  ? "text-amber-300 font-semibold underline decoration-amber-400/80 decoration-2 underline-offset-4 bg-amber-500/10 px-1 py-0.5 rounded transition-colors"
                  : qIndex === 1
                    ? "text-sky-300 font-semibold underline decoration-sky-400/80 decoration-2 underline-offset-4 bg-sky-500/10 px-1 py-0.5 rounded transition-colors"
                    : "text-emerald-300 font-semibold underline decoration-emerald-400/80 decoration-2 underline-offset-4 bg-emerald-500/10 px-1 py-0.5 rounded transition-colors"
                : isDarkMode
                  ? "text-slate-200 font-medium"
                  : "text-slate-800 font-medium";

              return (
                <div key={line.id} className="pt-3 first:pt-0 space-y-1.5 select-text">
                  {/* Dòng tiếng Anh (Ảnh 2: bình thường; Ảnh 3: gắn huy hiệu [59] + highlight) */}
                  <div className="leading-relaxed flex items-baseline flex-wrap gap-1.5 select-text">
                    {/* Huy hiệu số câu hỏi [59], [60], [61] khi bật Dẫn chứng chuẩn Ảnh 3 */}
                    {hasEvidence && line.matchingSubQ && (
                      <button
                        type="button"
                        onClick={() =>
                          onSelectSubQuestion?.(line.matchingSubQ!.questionNumber)
                        }
                        title={`Dẫn chứng câu ${line.matchingSubQ.questionNumber}`}
                        className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-white font-black text-xs shadow-md mr-1 shrink-0 select-none cursor-pointer transition-transform active:scale-95 ${badgeBg}`}
                      >
                        {line.matchingSubQ.questionNumber}
                      </button>
                    )}

                    {/* Văn bản lời thoại tiếng Anh */}
                    <span className={`select-text ${highlightClass}`}>
                      {line.text}
                    </span>
                  </div>

                  {/* Dòng dịch tiếng Việt kèm thanh kẻ dọc màu xanh | chuẩn Ảnh 2 & 3 */}
                  {line.translation && (
                    <div className="border-l-2 border-sky-400/80 pl-2.5 py-0.5 mt-1 select-text">
                      <p
                        className={`text-xs sm:text-[13px] leading-relaxed font-normal select-text ${
                          isDarkMode ? "text-sky-300/90" : "text-sky-700"
                        }`}
                      >
                        {line.translation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
