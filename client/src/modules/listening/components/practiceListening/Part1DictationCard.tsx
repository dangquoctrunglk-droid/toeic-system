import type React from "react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Eye, EyeOff, Sparkles, HelpCircle, X, Volume2 } from "lucide-react";
import { toast } from "react-toastify";
import type { SentenceItem, BlankField } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: Part1DictationCard.tsx
 * MỤC ĐÍCH: Khối Nghe & Điền từ chuyên biệt cho TOEIC Part 1 (Photographs)
 * ĐẶC ĐIỂM:
 *   - Luôn hiển thị đầy đủ 4 đáp án (A, B, C, D) của Bức tranh (Câu hỏi) hiện tại
 *   - Các ô input điền từ với placeholder dấu chấm ••••••• khớp độ dài từ
 *   - Nút phát âm thanh riêng cho từng phương án (A, B, C, D)
 *   - Nút "Gợi ý [Tab]" và "Mở tất cả"
 *   - Tự động nhảy ô khi gõ đúng từ
 *   - Thanh phím tắt chuẩn: Tab (gợi ý), Ctrl (phát/dừng), Shift (tua lại 3s)
 *   - Badge Lv.X và Hỏi bài (AI Mentor phân tích cả 4 câu) ở góc trên
 * ==============================================================================
 */

interface Part1DictationCardProps {
  sentences: SentenceItem[];
  currentIndex: number;
  onSelectSentence: (index: number) => void;
  isDarkMode: boolean;
  onSentenceComplete?: () => void;
  completedQuestionIds?: Set<string>;
  onToggleBookmark?: () => void;
  isBookmarked?: boolean;
}

export interface Part1Statement {
  id: string;
  key: "A" | "B" | "C" | "D" | string;
  text: string;
  translation?: string;
  isCorrect?: boolean;
  blanks: BlankField[];
}

const OPTION_LETTERS = ["A", "B", "C", "D"];

const STOP_WORDS = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
  "and", "but", "or", "is", "am", "are", "was", "were", "be", "been", "being",
  "he", "she", "it", "they", "we", "you", "his", "her", "its", "their", "our",
  "this", "that", "these", "those", "some", "any", "not"
]);

// Hàm tự động trích xuất 2-3 từ làm ô trống nếu câu chưa có sẵn blanks
function generateAutoBlanks(text: string, prefixId: string): BlankField[] {
  const words = text.split(/\s+/).filter(Boolean);
  const candidates: { word: string; clean: string; index: number }[] = [];

  words.forEach((word, idx) => {
    const clean = word.replace(/[^a-zA-Z]/g, "");
    if (clean.length >= 4 && !STOP_WORDS.has(clean.toLowerCase())) {
      candidates.push({ word, clean, index: idx });
    }
  });

  if (candidates.length === 0) {
    return [];
  }

  const count = Math.min(candidates.length, 3);
  const step = Math.max(1, Math.floor(candidates.length / count));
  const selected: { word: string; clean: string; index: number }[] = [];
  for (let i = 0; i < count; i++) {
    const pick = candidates[Math.min(i * step, candidates.length - 1)];
    if (!selected.some((s) => s.clean.toLowerCase() === pick.clean.toLowerCase())) {
      selected.push(pick);
    }
  }

  return selected.map((item, bIdx) => ({
    id: `${prefixId}_${bIdx}`,
    word: item.clean,
    position: item.index,
    hint: item.clean[0],
  }));
}

export const Part1DictationCard: React.FC<Part1DictationCardProps> = ({
  sentences,
  currentIndex,
  isDarkMode,
  onSentenceComplete,
}) => {
  // Câu hỏi / Bức tranh hiện tại
  const currentSentence = sentences[currentIndex] || sentences[0];
  const currentLevel = currentSentence?.level || 1;

  // Lấy ĐẦY ĐỦ 4 câu (A, B, C, D) của Bức tranh hiện tại
  const currentStatements = useMemo<Part1Statement[]>(() => {
    if (!currentSentence) return [];

    // TRƯỜNG HỢP 1: Bức tranh chuẩn ETS có mảng 4 options (A, B, C, D)
    if (currentSentence.options && currentSentence.options.length >= 2) {
      return currentSentence.options.map((opt, idx) => {
        const letter = (opt.key || OPTION_LETTERS[idx] || String(idx + 1)) as string;
        const rowId = `${currentSentence.id}_opt_${letter}`;

        let blanks = opt.blanks;
        if (!blanks || blanks.length === 0) {
          if (opt.isCorrect && currentSentence.blanks && currentSentence.blanks.length > 0) {
            blanks = currentSentence.blanks;
          } else {
            blanks = generateAutoBlanks(opt.text, `${rowId}_b`);
          }
        }

        return {
          id: rowId,
          key: letter,
          text: opt.text,
          translation: opt.translation,
          isCorrect: opt.isCorrect,
          blanks,
        };
      });
    }

    // TRƯỜNG HỢP 2: Dữ liệu phẳng dạng mảng các câu con có baiNumber
    const activeBai = currentSentence.baiNumber || Math.floor(currentIndex / 4) + 1;
    const baiItems = sentences.filter((s) => s.baiNumber === activeBai);
    const targetItems =
      baiItems.length >= 2
        ? baiItems
        : sentences.slice((activeBai - 1) * 4, activeBai * 4);

    return targetItems.map((s, idx) => {
      const letter = OPTION_LETTERS[idx] || String(idx + 1);
      const text = s.fullSentence || s.audioText || "";
      const blanks =
        s.blanks && s.blanks.length > 0
          ? s.blanks
          : generateAutoBlanks(text, `${s.id}_b`);

      return {
        id: s.id,
        key: letter,
        text,
        translation: s.vietnameseTranslation,
        isCorrect: idx === 0,
        blanks,
      };
    });
  }, [currentSentence, currentIndex, sentences]);

  // Quản lý giá trị nhập cho từng blank ID
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [focusedBlankId, setFocusedBlankId] = useState<string | null>(null);
  const [activeRowKey, setActiveRowKey] = useState<string>("A");
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Reset inputs khi chuyển sang Bức tranh khác
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUserInputs({});
    setRevealedIds(new Set());
    setFocusedBlankId(null);
    setActiveRowKey("A");
  }, [currentSentence?.id]);

  // Danh sách toàn bộ các blanks trong 4 câu của Bức tranh hiện tại (A -> B -> C -> D)
  const allCardBlanks = useMemo(() => {
    return currentStatements.flatMap((s) => s.blanks);
  }, [currentStatements]);

  // Phát âm thanh riêng cho một câu được click
  const playRowAudio = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const enVoice =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Google") || v.name.includes("Natural")),
        ) || voices.find((v) => v.lang.startsWith("en"));
      if (enVoice) {
        utterance.voice = enVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Xử lý khi người dùng gõ vào một ô trống
  const handleInputChange = (
    blankId: string,
    targetWord: string,
    val: string,
  ) => {
    setUserInputs((prev) => ({ ...prev, [blankId]: val }));

    const normalizedTarget = targetWord
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const normalizedUser = val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    // Nếu gõ đúng từ
    if (normalizedUser === normalizedTarget && normalizedTarget.length > 0) {
      const currentIdx = allCardBlanks.findIndex((b) => b.id === blankId);
      if (currentIdx >= 0 && currentIdx < allCardBlanks.length - 1) {
        // Tự động chuyển focus sang ô tiếp theo
        const nextBlank = allCardBlanks[currentIdx + 1];
        inputRefs.current[nextBlank.id]?.focus();
      } else {
        // Đã hoàn thành ô cuối cùng của bài
        onSentenceComplete?.();
        toast.success("Xuất sắc! Bạn đã điền chính xác tất cả các từ trong tranh.");
      }
    }
  };

  // Hành động: Gợi ý 1 từ (Tab)
  const handleHintWord = useCallback(() => {
    let targetBlank: BlankField | undefined;
    if (focusedBlankId) {
      const b = allCardBlanks.find((item) => item.id === focusedBlankId);
      const isFilledCorrect =
        userInputs[b?.id || ""]?.trim().toLowerCase() ===
        b?.word.toLowerCase();
      if (b && !isFilledCorrect && !revealedIds.has(b.id)) {
        targetBlank = b;
      }
    }

    if (!targetBlank) {
      targetBlank = allCardBlanks.find((b) => {
        const isFilledCorrect =
          userInputs[b.id]?.trim().toLowerCase() === b.word.toLowerCase();
        return !isFilledCorrect && !revealedIds.has(b.id);
      });
    }

    if (targetBlank) {
      const bId = targetBlank.id;
      const bWord = targetBlank.word;
      setRevealedIds((prev) => new Set(prev).add(bId));
      setUserInputs((prev) => ({ ...prev, [bId]: bWord }));

      // Chuyển focus sang ô kế tiếp
      const nextIdx = allCardBlanks.findIndex((item) => item.id === bId) + 1;
      if (nextIdx < allCardBlanks.length) {
        setTimeout(() => {
          inputRefs.current[allCardBlanks[nextIdx].id]?.focus();
        }, 50);
      } else {
        onSentenceComplete?.();
      }
    }
  }, [allCardBlanks, focusedBlankId, userInputs, revealedIds, onSentenceComplete]);

  // Hành động: Mở tất cả các từ trong bài
  const handleRevealAll = () => {
    const nextInputs = { ...userInputs };
    const nextRevealed = new Set(revealedIds);

    allCardBlanks.forEach((b) => {
      nextInputs[b.id] = b.word;
      nextRevealed.add(b.id);
    });

    setUserInputs(nextInputs);
    setRevealedIds(nextRevealed);
    onSentenceComplete?.();
    toast.info("Đã mở tất cả các từ gợi ý");
  };

  // Lắng nghe các phím tắt: Tab (gợi ý), Ctrl (phát/dừng), Shift (tua lại 3s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        handleHintWord();
        return;
      }

      if (e.key === "Control") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("toeic_audio_toggle_play"));
        return;
      }

      if (e.key === "Shift") {
        e.preventDefault();
        window.dispatchEvent(
          new CustomEvent("toeic_audio_rewind", { detail: { seconds: 3 } }),
        );
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleHintWord]);

  return (
    <div className="w-full space-y-3 animate-fade-in select-none">
      {/* 1. HÀNG TRÊN: BADGE LEVEL VÀ NÚT HỎI BÀI */}
      <div className="flex items-center justify-between px-1">
        {/* Badge Level: Lv.1 */}
        <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-sky-500 text-white shadow-md shadow-sky-500/25 tracking-wide">
          Lv.{currentLevel}
        </span>

        {/* Nút: ❔ Hỏi bài (AI Mentor) */}
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            isDarkMode
              ? "bg-[#0b1428] border-sky-500/30 text-sky-400 hover:text-white hover:border-sky-400 hover:bg-sky-500/10"
              : "bg-white border-sky-300 text-sky-600 hover:text-sky-800 shadow-sm"
          }`}
        >
          <HelpCircle size={15} className="text-sky-400" />
          <span>Hỏi bài</span>
        </button>
      </div>

      {/* 2. CARD CHÍNH: NGHE & ĐIỀN TỪ (HIỂN THỊ ĐỦ CẢ 4 ĐÁP ÁN A, B, C, D) */}
      <div
        className={`p-5 sm:p-6 rounded-2xl border shadow-xl transition-colors space-y-4 ${
          isDarkMode
            ? "bg-[#070e22] border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-900 shadow-md"
        }`}
      >
        {/* Header trong card: Nghe & Điền từ: .......... [ Gợi ý Tab ] [ Mở tất cả ] */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800/60">
          <h3 className="font-extrabold text-sm sm:text-base text-sky-400 tracking-tight">
            Nghe &amp; Điền từ:
          </h3>

          <div className="flex items-center gap-2">
            {/* Nút: 👁 Gợi ý [Tab] */}
            <button
              type="button"
              onClick={handleHintWord}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-sky-500/10 border-sky-500/30 text-sky-300 hover:bg-sky-500/20"
                  : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
              }`}
              title="Phím tắt: Tab để gợi ý từ hiện tại"
            >
              <Eye size={13} />
              <span>Gợi ý</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 border border-sky-400/30 text-sky-200">
                Tab
              </kbd>
            </button>

            {/* Nút: 🚫 Mở tất cả */}
            <button
              type="button"
              onClick={handleRevealAll}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-amber-500/10 border-amber-400/30 text-amber-400 hover:bg-amber-500/20"
                  : "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
              }`}
            >
              <EyeOff size={13} />
              <span>Mở tất cả</span>
            </button>
          </div>
        </div>

        {/* 3. KHU VỰC 4 CÂU A, B, C, D (HIỂN THỊ ĐỒNG THỜI TOÀN BỘ 4 ĐÁP ÁN) */}
        <div className="space-y-3 pt-1">
          {currentStatements.map((stmt) => {
            const isRowActive = activeRowKey === stmt.key;
            const words = stmt.text.split(" ").filter(Boolean);
            const blanks = stmt.blanks || [];

            return (
              <div
                key={stmt.id}
                onClick={() => {
                  setActiveRowKey(stmt.key);
                }}
                className={`flex items-start sm:items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  isRowActive
                    ? isDarkMode
                      ? "bg-sky-500/10 border-sky-500/40 ring-1 ring-sky-500/30"
                      : "bg-sky-50/80 border-sky-300 ring-1 ring-sky-400/40"
                    : isDarkMode
                      ? "bg-[#0b1428]/60 border-slate-800/80 hover:bg-[#0e1a34] hover:border-slate-700"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {/* Chữ cái A, B, C, D kèm nút nghe riêng câu */}
                <div className="flex items-center gap-1.5 shrink-0 pt-0.5 sm:pt-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRowKey(stmt.key);
                      playRowAudio(stmt.text);
                    }}
                    title={`Nghe riêng câu (${stmt.key})`}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                      isRowActive
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/30 hover:bg-sky-400 scale-105"
                        : isDarkMode
                          ? "bg-[#111c33] border border-slate-700/80 text-slate-300 hover:text-sky-300 hover:border-sky-500/50"
                          : "bg-slate-200 border border-slate-300 text-slate-700 hover:bg-sky-100"
                    }`}
                  >
                    {stmt.key}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveRowKey(stmt.key);
                      playRowAudio(stmt.text);
                    }}
                    title={`Phát âm câu (${stmt.key})`}
                    className="p-1 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>

                {/* Nội dung câu và các ô điền từ */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm sm:text-base font-medium leading-relaxed flex-1">
                  {words.map((word, wIdx) => {
                    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
                    const punctuation = word.replace(/[a-zA-Z0-9]/g, "");

                    const blank = blanks.find(
                      (b) =>
                        b.word.toLowerCase() === cleanWord.toLowerCase() &&
                        (typeof b.position !== "number" || b.position === wIdx),
                    );

                    if (!blank) {
                      return (
                        <span
                          key={wIdx}
                          className={`${
                            isDarkMode ? "text-slate-200" : "text-slate-800"
                          } whitespace-pre`}
                        >
                          {word}
                        </span>
                      );
                    }

                    const currentVal = userInputs[blank.id] || "";
                    const isRevealed = revealedIds.has(blank.id);
                    const isCorrect =
                      currentVal.trim().toLowerCase() ===
                      blank.word.toLowerCase();

                    const dotsPlaceholder = "•".repeat(
                      Math.max(blank.word.length, 4),
                    );
                    const inputWidthPx = Math.max(
                      blank.word.length * 12 + 28,
                      75,
                    );

                    let inputStyle = isDarkMode
                      ? "bg-[#060e22] border-sky-500/40 text-white focus:border-sky-400 focus:bg-[#0c1836]"
                      : "bg-slate-50 border-sky-400 text-slate-900 focus:bg-white";
                    if (isCorrect) {
                      inputStyle =
                        "border-emerald-500/80 bg-emerald-500/10 text-emerald-300 font-bold";
                    } else if (isRevealed) {
                      inputStyle =
                        "border-purple-400/80 bg-purple-500/10 text-purple-300 font-bold";
                    }

                    return (
                      <span
                        key={wIdx}
                        className="inline-flex items-center gap-0.5"
                      >
                        <input
                          ref={(el) => {
                            inputRefs.current[blank.id] = el;
                          }}
                          type="text"
                          value={isRevealed ? blank.word : currentVal}
                          placeholder={dotsPlaceholder}
                          style={{ width: `${inputWidthPx}px` }}
                          onFocus={() => {
                            setFocusedBlankId(blank.id);
                            setActiveRowKey(stmt.key);
                          }}
                          onChange={(e) =>
                            handleInputChange(
                              blank.id,
                              blank.word,
                              e.target.value,
                            )
                          }
                          className={`h-9 px-2 rounded-xl border text-center text-xs sm:text-sm font-semibold tracking-wide outline-none transition-all duration-150 ${inputStyle}`}
                        />
                        {punctuation && (
                          <span
                            className={
                              isDarkMode ? "text-slate-300" : "text-slate-700"
                            }
                          >
                            {punctuation}
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. DÒNG NHẮC NHỞ BỘ GÕ TIẾNG VIỆT */}
        <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-400 italic">
          <span className="not-italic">💡</span>
          <span>Tắt bộ gõ tiếng Việt để tự chuyển ô khi điền đúng</span>
        </div>

        {/* 5. KHỐI HƯỚNG DẪN PHÍM TẮT (CHUẨN ẢNH MẪU ĐÁY CARD) */}
        <div
          className={`p-3 rounded-xl border flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium transition-colors ${
            isDarkMode
              ? "bg-[#101c36]/75 border-sky-500/20 text-sky-200"
              : "bg-sky-50/80 border-sky-200 text-sky-800"
          }`}
        >
          <span className="font-extrabold text-sky-400">Phím tắt:</span>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded font-mono text-[11px] font-bold bg-black/60 border border-slate-700 text-white shadow-sm">
              Tab
            </kbd>
            <span className="text-slate-300">gợi ý từ</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded font-mono text-[11px] font-bold bg-black/60 border border-slate-700 text-white shadow-sm">
              Ctrl
            </kbd>
            <span className="text-slate-300">phát/dừng</span>
          </div>

          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded font-mono text-[11px] font-bold bg-black/60 border border-slate-700 text-white shadow-sm">
              Shift
            </kbd>
            <span className="text-slate-300">tua lại 3s</span>
          </div>
        </div>
      </div>

      {/* 6. MODAL AI MENTOR GIẢI THÍCH CHI TIẾT */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl relative ${
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
              <span>AI Mentor Giải Thích 4 Phương Án (Câu {currentIndex + 1})</span>
            </div>

            <div className="space-y-3.5 text-sm text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <p className="text-xs text-slate-400">
                Phân tích chi tiết 4 câu mô tả bức tranh để bạn nắm vững cấu trúc
                và các bẫy thường gặp trong TOEIC Part 1:
              </p>

              {currentStatements.map((s) => (
                <div
                  key={s.id}
                  className={`p-3 rounded-2xl border space-y-1.5 ${
                    s.isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-[#070d1e] border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full font-bold text-xs flex items-center justify-center ${
                        s.isCorrect
                          ? "bg-emerald-500 text-white"
                          : "bg-sky-500 text-white"
                      }`}
                    >
                      {s.key}
                    </span>
                    <span className="font-semibold text-white text-xs sm:text-sm">
                      {s.text}
                    </span>
                    {s.isCorrect && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold ml-auto">
                        Đúng
                      </span>
                    )}
                  </div>
                  {s.translation && (
                    <p className="text-xs text-sky-300 pl-7">
                      👉 {s.translation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAiModal(false)}
              className="w-full mt-5 py-2.5 rounded-xl font-bold text-xs bg-sky-500 hover:bg-sky-400 text-white transition-all shadow-md shadow-sky-500/20"
            >
              Đã hiểu bài học
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
