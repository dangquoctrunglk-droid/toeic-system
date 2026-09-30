import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { PracticeHeader } from "./PracticeHeader";
import { AudioWaveformPlayer } from "./AudioWaveformPlayer";
import { ETSMultipleChoiceCard } from "./ETSMultipleChoiceCard";
import { DictationSentenceCard } from "./DictationSentenceCard";
import { VocabularyLockedCard } from "./VocabularyLockedCard";
import { PracticeBottomBar } from "./PracticeBottomBar";
import type {
  SentenceItem,
  PracticeMode,
  VocabItem,
  ListeningPart,
  PartPracticeProgress,
} from "../../types";

/**
 * ==============================================================================
 * COMPONENT: ListeningPracticeRoom.tsx
 * MỤC ĐÍCH: Không gian phòng luyện nghe chính chuẩn Ảnh 1 (Part 1), Ảnh 2 (Part 2), Ảnh 3 (Part 3 & 4):
 *   1. Layout 2 cột cân xứng (Desktop):
 *      - Cột trái: Hướng dẫn (Direction) + Audio Waveform + Phím tắt + Ảnh/Sơ đồ
 *      - Cột phải: Lv.1 Badge + Nút Hỏi bài + Thẻ câu hỏi trắc nghiệm ETS + Toggles dịch nghĩa/từ vựng/dẫn chứng
 *   2. Lưu tiến độ bền vững (Progress Persistence):
 *      - Tự động lưu vị trí câu (lastIndex), đáp án đã chọn, câu hoàn thành vào localStorage
 *      - Khi người dùng thoát ra hoặc quay lại, tự động tải lại đúng vị trí đang làm dở
 *   3. Âm thanh hiệu ứng SFX (Web Audio API) & Tự động chuyển câu (Auto-advance)
 * ==============================================================================
 */

interface ListeningPracticeRoomProps {
  part: ListeningPart;
  sentences: SentenceItem[];
  onExit: () => void;
  isDarkMode: boolean;
  userKey?: string;
  bookmarkedIds?: string[];
  onToggleBookmark?: (sentenceId: string) => void;
  savedVocabs?: VocabItem[];
  onAddToBasket?: (vocab: VocabItem) => void;
  initialIndex?: number;
}

export const ListeningPracticeRoom: React.FC<ListeningPracticeRoomProps> = ({
  part,
  sentences,
  onExit,
  isDarkMode,
  userKey = "guest",
  bookmarkedIds,
  onToggleBookmark,
  savedVocabs: propSavedVocabs,
  onAddToBasket: propOnAddToBasket,
  initialIndex = 0,
}) => {
  const progressStorageKey = `toeic_listening_progress_${userKey}_part_${part}`;

  // Đọc tiến độ đã lưu trước đó từ localStorage (nếu có)
  const savedProgress: PartPracticeProgress | null = useMemo(() => {
    try {
      const data = localStorage.getItem(progressStorageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, [progressStorageKey]);

  // Vị trí câu hiện tại: ưu tiên initialIndex nếu > 0, ngược lại khôi phục từ savedProgress.lastIndex
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (typeof initialIndex === "number" && initialIndex > 0 && initialIndex < sentences.length) {
      return initialIndex;
    }
    if (savedProgress && typeof savedProgress.lastIndex === "number" && savedProgress.lastIndex < sentences.length) {
      return savedProgress.lastIndex;
    }
    return 0;
  });

  // Chế độ: mặc định "full" (trắc nghiệm ETS chuẩn ảnh 1, 2, 3) hoặc "dictation" (nghe chép chính tả)
  const [mode, setMode] = useState<PracticeMode>("full");

  // Các cờ tiện ích trên header
  const [isBilingual, setIsBilingual] = useState<boolean>(false);
  const [isEvidence, setIsEvidence] = useState<boolean>(false);
  const [isAutoNext, setIsAutoNext] = useState<boolean>(true);
  const [isSFXEnabled, setIsSFXEnabled] = useState<boolean>(true);

  // Tiến độ học tập & điểm kinh nghiệm
  const [earnedXP, setEarnedXP] = useState<number>(() => savedProgress?.earnedXP || 0);

  // Bản đồ đáp án người dùng đã chọn: { [questionId]: "A" | "B" | "C" | "D" }
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>(
    () => savedProgress?.userAnswers || {},
  );

  // Tập hợp ID các câu đã hoàn thành
  const [completedQuestionIds, setCompletedQuestionIds] = useState<Set<string>>(
    () => new Set(savedProgress?.completedQuestions || []),
  );

  // Tập hợp ID các câu đã trả lời đúng
  const [correctQuestionIds, setCorrectQuestionIds] = useState<Set<string>>(
    () => new Set(savedProgress?.correctAnswers || []),
  );

  // Danh sách ID bookmark câu hỏi phụ (subQuestions)
  const [bookmarkedSubIds, setBookmarkedSubIds] = useState<string[]>([]);

  // Giỏ từ vựng fallback nếu prop không truyền
  const [fallbackSavedVocabs, setFallbackSavedVocabs] = useState<VocabItem[]>([]);
  const activeSavedVocabs = propSavedVocabs ?? fallbackSavedVocabs;

  // Câu hỏi hiện tại
  const currentSentence = sentences[currentIndex] || sentences[0];

  // Trạng thái đã lưu bookmark câu hiện tại
  const isCurrentBookmarked = bookmarkedIds
    ? bookmarkedIds.includes(currentSentence.id)
    : false;

  // Cập nhật câu bắt đầu khi prop initialIndex thay đổi từ bên ngoài
  useEffect(() => {
    if (
      typeof initialIndex === "number" &&
      initialIndex >= 0 &&
      initialIndex < sentences.length
    ) {
      setCurrentIndex(initialIndex);
    }
  }, [initialIndex, sentences.length]);

  // Thông báo nhẹ khi tiếp tục tiến độ dở dang
  useEffect(() => {
    if (savedProgress && savedProgress.lastIndex > 0 && initialIndex === 0) {
      toast.info(
        `Đã tiếp tục tiến độ Part ${part} tại câu ${savedProgress.lastIndex + 1}!`,
        { autoClose: 2500 },
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Phát âm thanh phản hồi SFX bằng Web Audio API
  const playSoundEffect = useCallback(
    (type: "correct" | "incorrect") => {
      if (!isSFXEnabled) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === "correct") {
          // Âm thanh chúc mừng (Chime kép)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
          osc2.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.3); // D6

          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();
          osc1.stop(ctx.currentTime + 0.35);
          osc2.stop(ctx.currentTime + 0.35);
        } else {
          // Âm thanh báo sai nhẹ nhàng
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(260, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);

          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        }
      } catch {
        // bỏ qua lỗi audio context nếu bị chặn autoplay
      }
    },
    [isSFXEnabled],
  );

  // LƯU TIẾN ĐỘ BỀN VỮNG VÀO LOCALSTORAGE
  const saveProgressToStorage = useCallback(
    (newIndex: number, newAnswers = userAnswers, newCompleted = completedQuestionIds, newCorrect = correctQuestionIds, newXP = earnedXP) => {
      try {
        const progressData: PartPracticeProgress = {
          part,
          lastIndex: newIndex,
          userAnswers: newAnswers,
          completedQuestions: Array.from(newCompleted),
          correctAnswers: Array.from(newCorrect),
          earnedXP: newXP,
          lastUpdated: new Date().toISOString(),
        };
        localStorage.setItem(progressStorageKey, JSON.stringify(progressData));
      } catch (err) {
        console.error("Failed to save progress to localStorage", err);
      }
    },
    [part, progressStorageKey, userAnswers, completedQuestionIds, correctQuestionIds, earnedXP],
  );

  // Tự động lưu khi currentIndex thay đổi
  const handleSelectSentence = (nextIndex: number) => {
    if (nextIndex >= 0 && nextIndex < sentences.length) {
      setCurrentIndex(nextIndex);
      saveProgressToStorage(nextIndex);
    }
  };

  // Xử lý chọn đáp án trong đề trắc nghiệm ETS
  const handleSelectOption = (
    questionKey: string,
    optionKey: "A" | "B" | "C" | "D",
    isCorrect: boolean,
  ) => {
    const nextAnswers = { ...userAnswers, [questionKey]: optionKey };
    setUserAnswers(nextAnswers);

    const nextCompleted = new Set(completedQuestionIds).add(questionKey);
    setCompletedQuestionIds(nextCompleted);

    let nextXP = earnedXP;
    const nextCorrect = new Set(correctQuestionIds);

    if (isCorrect) {
      if (!correctQuestionIds.has(questionKey)) {
        nextCorrect.add(questionKey);
        setCorrectQuestionIds(nextCorrect);
        nextXP += 5;
        setEarnedXP(nextXP);
      }
      playSoundEffect("correct");
    } else {
      playSoundEffect("incorrect");
    }

    // Lưu ngay tiến độ vào localStorage
    saveProgressToStorage(currentIndex, nextAnswers, nextCompleted, nextCorrect, nextXP);

    // Nếu bật Auto-advance và làm đúng ở câu đơn: tự động chuyển sang câu tiếp theo sau 1.2s
    if (isAutoNext && isCorrect && part <= 2) {
      if (currentIndex < sentences.length - 1) {
        setTimeout(() => {
          handleSelectSentence(currentIndex + 1);
        }, 1200);
      }
    }
  };

  // Xử lý phím số 1-4 trên bàn phím
  const handleKeyboardOptionSelect = (key: "A" | "B" | "C" | "D") => {
    if (part === 1 || part === 2) {
      const matchOpt = currentSentence.options?.find((o) => o.key === key);
      if (matchOpt) {
        handleSelectOption(currentSentence.id, key, matchOpt.isCorrect);
      }
    }
  };

  // Xử lý khi hoàn thành câu trong chế độ điền từ chính tả
  const handleDictationComplete = () => {
    if (!completedQuestionIds.has(currentSentence.id)) {
      const nextCompleted = new Set(completedQuestionIds).add(currentSentence.id);
      const nextCorrect = new Set(correctQuestionIds).add(currentSentence.id);
      const nextXP = earnedXP + 10;

      setCompletedQuestionIds(nextCompleted);
      setCorrectQuestionIds(nextCorrect);
      setEarnedXP(nextXP);
      playSoundEffect("correct");
      toast.success("Xuất sắc! Bạn đã điền chính xác câu này (+10 XP) 🎉");

      saveProgressToStorage(currentIndex, userAnswers, nextCompleted, nextCorrect, nextXP);

      if (isAutoNext && currentIndex < sentences.length - 1) {
        setTimeout(() => {
          handleSelectSentence(currentIndex + 1);
        }, 1500);
      }
    }
  };

  // Thêm từ vào giỏ từ
  const handleAddToBasket = (vocab: VocabItem) => {
    if (propOnAddToBasket) {
      propOnAddToBasket(vocab);
    } else {
      if (!activeSavedVocabs.some((v) => v.word.toLowerCase() === vocab.word.toLowerCase())) {
        setFallbackSavedVocabs((prev) => [...prev, vocab]);
      }
    }
  };

  // Xử lý thoát phòng luyện tập: Lưu chắc chắn tiến độ câu hiện tại trước khi thoát
  const handleExitPractice = () => {
    saveProgressToStorage(currentIndex);
    onExit();
  };

  // Bản đồ trạng thái câu hoàn thành để truyền xuống thanh đáy
  const completedMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    sentences.forEach((s, idx) => {
      if (part >= 3 && s.subQuestions) {
        map[idx] = s.subQuestions.every((sq) => completedQuestionIds.has(sq.id));
      } else {
        map[idx] = completedQuestionIds.has(s.id);
      }
    });
    return map;
  }, [sentences, completedQuestionIds, part]);

  const correctMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    sentences.forEach((s, idx) => {
      if (part >= 3 && s.subQuestions) {
        map[idx] = s.subQuestions.every((sq) => correctQuestionIds.has(sq.id));
      } else {
        map[idx] = correctQuestionIds.has(s.id);
      }
    });
    return map;
  }, [sentences, correctQuestionIds, part]);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-5 animate-fade-in pb-28 sm:pb-32">
      {/* 1. THANH HEADER ĐIỀU HƯỚNG TRÊN CÙNG (Chuẩn Ảnh 1, 2, 3) */}
      <PracticeHeader
        part={part}
        mode={mode}
        onModeChange={setMode}
        onExit={handleExitPractice}
        currentIndex={currentIndex}
        totalQuestions={sentences.length}
        isBilingual={isBilingual}
        onToggleBilingual={() => setIsBilingual((prev) => !prev)}
        isEvidence={isEvidence}
        onToggleEvidence={() => setIsEvidence((prev) => !prev)}
        isAutoNext={isAutoNext}
        onToggleAutoNext={() => setIsAutoNext((prev) => !prev)}
        isSFXEnabled={isSFXEnabled}
        onToggleSFX={() => setIsSFXEnabled((prev) => !prev)}
        earnedXP={earnedXP}
        correctCount={correctQuestionIds.size}
        completedCount={completedQuestionIds.size}
        isDarkMode={isDarkMode}
      />

      {/* 2. KHÔNG GIAN BÀI THI: BỐ CỤC 2 CỘT CÂN ĐỐI (Chuẩn Ảnh 1, Ảnh 2, Ảnh 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* CỘT TRÁI (5 đến 6 phần 12): HƯỚNG DẪN + WAVEFORM AUDIO + PHÍM TẮT + ẢNH/SƠ ĐỒ */}
        <div className="lg:col-span-6 space-y-4">
          <AudioWaveformPlayer
            sentenceText={currentSentence.audioText}
            directionText={currentSentence.directionText}
            imageUrl={currentSentence.imageUrl}
            part={part}
            audioDurationSec={currentSentence.audioDuration}
            onSelectOptionKey={handleKeyboardOptionSelect}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* CỘT PHẢI (6 đến 7 phần 12): CÂU HỎI TRẮC NGHIỆM ETS HOẶC ĐIỀN TỪ CHÍNH TẢ */}
        <div className="lg:col-span-6 space-y-4">
          {mode === "dictation" ? (
            /* Chế độ phụ: Điền từ vào ô trống (Nghe chép chính tả) */
            <div className="space-y-4">
              <DictationSentenceCard
                sentence={currentSentence}
                mode={mode}
                onSentenceComplete={handleDictationComplete}
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={() => onToggleBookmark?.(currentSentence.id)}
                isDarkMode={isDarkMode}
              />

              <VocabularyLockedCard
                vocab={currentSentence.vocabRecommendation}
                isUnlocked={completedQuestionIds.has(currentSentence.id)}
                onUnlockForce={() => {
                  setCompletedQuestionIds((prev) =>
                    new Set(prev).add(currentSentence.id),
                  );
                }}
                onAddToBasket={handleAddToBasket}
                isSavedInBasket={activeSavedVocabs.some(
                  (v) =>
                    v.word.toLowerCase() ===
                    currentSentence.vocabRecommendation?.word.toLowerCase(),
                )}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            /* Chế độ chính chuẩn ảnh: Trắc nghiệm chuẩn đề ETS Part 1, 2, 3, 4 */
            <ETSMultipleChoiceCard
              sentence={currentSentence}
              part={part}
              userAnswers={userAnswers}
              onSelectOption={handleSelectOption}
              isBookmarked={isCurrentBookmarked}
              onToggleBookmark={() => onToggleBookmark?.(currentSentence.id)}
              bookmarkedSubIds={bookmarkedSubIds}
              onToggleSubBookmark={(subId) => {
                setBookmarkedSubIds((prev) =>
                  prev.includes(subId)
                    ? prev.filter((id) => id !== subId)
                    : [...prev, subId],
                );
              }}
              isBilingualActive={isBilingual}
              isEvidenceActive={isEvidence}
              onAddToBasket={handleAddToBasket}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {/* 3. THANH ĐÁY CỐ ĐỊNH: BÁO LỖI, GIỎ TỪ, TRA TỪ, < 㗊 1/27 > */}
      <PracticeBottomBar
        currentIndex={currentIndex}
        totalSentences={sentences.length}
        onSelectSentence={handleSelectSentence}
        completedMap={completedMap}
        correctMap={correctMap}
        savedVocabs={activeSavedVocabs}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
