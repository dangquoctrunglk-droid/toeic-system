import type React from "react";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import { PracticeHeader } from "./practiceListening/PracticeHeader";
import { AudioWaveformPlayer } from "./practiceListening/AudioWaveformPlayer";
import { ETSMultipleChoiceCard } from "./practiceListening/ETSMultipleChoiceCard";
import { DictationSentenceCard } from "./practiceListening/DictationSentenceCard";
import { Part1DictationCard } from "./practiceListening/Part1DictationCard";
import { VocabularyLockedCard } from "./practiceListening/VocabularyLockedCard";
import { PracticeBottomBar } from "./practiceListening/PracticeBottomBar";
import {
  AnnotatorCanvas,
  type AnnotatorCanvasHandle,
  type AnnotatorTool,
} from "./annoCanvas";
import { AnnotatorToolbar } from "./practiceListening/AnnotatorToolbar";
import {
  SavedNotesDrawer,
  type SavedNoteItem,
} from "./practiceListening/SavedNotesDrawer";
import { ConversationTranscriptCard } from "./practiceListening/ConversationTranscriptCard";
import type {
  SentenceItem,
  PracticeMode,
  VocabItem,
  ListeningPart,
  PartPracticeProgress,
} from "../types";
import { PART_DETAILED_CONFIGS } from "../mockData";

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
  title?: string;
  initialMode?: PracticeMode;
  onJumpToSentence?: (
    sentenceId: string,
    part: ListeningPart,
    displayNumber?: string,
  ) => void;
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
  title,
  initialMode = "full",
  onJumpToSentence,
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

  // Vị trí câu hiện tại: ưu tiên initialIndex nếu hợp lệ, ngược lại khôi phục từ savedProgress.lastIndex
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (
      typeof initialIndex === "number" &&
      initialIndex >= 0 &&
      initialIndex < sentences.length
    ) {
      return initialIndex;
    }
    if (
      savedProgress &&
      typeof savedProgress.lastIndex === "number" &&
      savedProgress.lastIndex >= 0 &&
      savedProgress.lastIndex < sentences.length
    ) {
      return savedProgress.lastIndex;
    }
    return 0;
  });

  // Chế độ: khởi tạo từ initialMode ("full" trắc nghiệm ETS hoặc "dictation" nghe chép chính tả)
  const [mode, setMode] = useState<PracticeMode>(initialMode);

  // Tự động đồng bộ khi initialMode thay đổi từ bên ngoài
  useEffect(() => {
    if (initialMode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(initialMode);
    }
  }, [initialMode]);

  // Các cờ tiện ích trên header
  const [isBilingual, setIsBilingual] = useState<boolean>(false);
  const [isEvidence, setIsEvidence] = useState<boolean>(false);
  const [isAutoNext, setIsAutoNext] = useState<boolean>(true);
  const [isSFXEnabled, setIsSFXEnabled] = useState<boolean>(true);

  // Trạng thái công cụ Annotator (Thanh vẽ bên trái chuẩn DauEnglish)
  const [isAnnotatorActive, setIsAnnotatorActive] = useState<boolean>(false);
  const [annotatorTool, setAnnotatorTool] = useState<AnnotatorTool>("select");
  const [annotatorColor, setAnnotatorColor] = useState<string>("#38bdf8");
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);
  const [isAnnotatorVisible, setIsAnnotatorVisible] = useState<boolean>(true);
  const canvasHandleRef = useRef<AnnotatorCanvasHandle | null>(null);

  // Tiến độ học tập & điểm kinh nghiệm
  const [earnedXP, setEarnedXP] = useState<number>(
    () => savedProgress?.earnedXP || 0,
  );

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
  const [fallbackSavedVocabs, setFallbackSavedVocabs] = useState<VocabItem[]>(
    [],
  );
  const activeSavedVocabs = propSavedVocabs ?? fallbackSavedVocabs;

  // Tỷ lệ phân chia 2 cột màn hình (mặc định 50%, lưu vào localStorage)
  const [splitRatio, setSplitRatio] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("toeic_practice_split_ratio");
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 15 && val <= 85) {
          return val;
        }
      }
    } catch {
      // ignore
    }
    return 50;
  });
  const [isDraggingSplitter, setIsDraggingSplitter] = useState<boolean>(false);
  const mainContainerRef = useRef<HTMLElement | null>(null);

  // Kéo thanh phân chia giữa 2 cột qua lại để chỉnh bên nào rộng hơn (chuẩn DauEnglish)
  const handleSplitterStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);
  };

  useEffect(() => {
    if (!isDraggingSplitter) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const container = mainContainerRef.current;
      if (!container) return;
      if ("touches" in e && e.cancelable) {
        e.preventDefault();
      }

      const rect = container.getBoundingClientRect();
      const clientX =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientX
          : (e as MouseEvent).clientX;

      const offsetX = clientX - rect.left;
      const totalWidth = rect.width;
      if (totalWidth <= 0) return;

      // Giới hạn chiều rộng tối thiểu mỗi bên ít nhất 220px (hoặc từ 15% đến 85%)
      const minPx = Math.min(220, totalWidth * 0.2);
      const maxPx = totalWidth - minPx;
      const clampedX = Math.min(Math.max(offsetX, minPx), maxPx);
      const percentage = (clampedX / totalWidth) * 100;
      setSplitRatio(percentage);
    };

    const handleEnd = () => {
      setIsDraggingSplitter(false);
      setSplitRatio((current) => {
        try {
          localStorage.setItem(
            "toeic_practice_split_ratio",
            current.toFixed(1),
          );
        } catch {
          // ignore
        }
        return current;
      });
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDraggingSplitter]);

  // Danh sách Ghi chú đã lưu trong lộ trình học (Chuẩn 100% Ảnh 1)
  const savedNotesStorageKey = `toeic_saved_notes_${userKey}_part_${part}`;
  const [savedNotes, setSavedNotes] = useState<SavedNoteItem[]>(() => {
    try {
      const data = localStorage.getItem(savedNotesStorageKey);
      if (data !== null) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Dữ liệu ban đầu khớp chính xác Ảnh 1 mẫu DauEnglish
    const initialNotes: SavedNoteItem[] = [];
    try {
      localStorage.setItem(savedNotesStorageKey, JSON.stringify(initialNotes));
    } catch {
      // ignore
    }
    return initialNotes;
  });

  const [isSavedNotesOpen, setIsSavedNotesOpen] = useState<boolean>(false);

  const saveNotesToStorage = useCallback(
    (updatedNotes: SavedNoteItem[]) => {
      setSavedNotes(updatedNotes);
      try {
        localStorage.setItem(
          savedNotesStorageKey,
          JSON.stringify(updatedNotes),
        );
      } catch {
        // ignore
      }
    },
    [savedNotesStorageKey],
  );

  const handleAddSavedNote = useCallback(
    (note: {
      id: string;
      sentenceIndex?: number;
      content: string;
      type: "text" | "note" | "underline";
    }) => {
      const now = new Date();
      const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      setSavedNotes((prev) => {
        const existingIdx = prev.findIndex((n) => n.id === note.id);
        if (existingIdx >= 0) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            content: note.content,
          };
          saveNotesToStorage(updated);
          return updated;
        }
        const targetSent =
          sentences[note.sentenceIndex ?? currentIndex] || sentences[0];
        const newItem: SavedNoteItem = {
          id: note.id,
          sentenceIndex: note.sentenceIndex ?? currentIndex,
          sentenceId: targetSent?.id,
          displayNumber: targetSent?.displayNumber,
          part,
          formattedTime,
          content: note.content,
          type: note.type,
          badgeCount: 1,
        };
        const next = [newItem, ...prev];
        saveNotesToStorage(next);
        return next;
      });
    },
    [currentIndex, part, sentences, saveNotesToStorage],
  );

  const handleDeleteSavedNote = useCallback(
    (noteId: string) => {
      setSavedNotes((prev) => {
        const next = prev.filter((n) => n.id !== noteId);
        saveNotesToStorage(next);
        return next;
      });
      canvasHandleRef.current?.deleteNote(noteId);
      toast.success("Đã xóa ghi chú");
    },
    [saveNotesToStorage],
  );

  const handleClearAllNotes = useCallback(() => {
    setSavedNotes([]);
    saveNotesToStorage([]);
    canvasHandleRef.current?.clearAllPartData();
    toast.info("Đã xóa toàn bộ ghi chú và canvas");
  }, [saveNotesToStorage]);

  const handleDeleteSentenceNotes = useCallback(
    (sentenceIdx: number) => {
      setSavedNotes((prev) => {
        const next = prev.filter((n) => n.sentenceIndex !== sentenceIdx);
        saveNotesToStorage(next);
        return next;
      });

      const canvasStorageKey = `toeic_canvas_data_${userKey}_part_${part}`;
      try {
        const raw = localStorage.getItem(canvasStorageKey);
        if (raw) {
          const all = JSON.parse(raw);
          Object.keys(all).forEach((k) => {
            if (
              all[k]?.sentenceIndex === sentenceIdx ||
              k === `sent_${sentenceIdx}` ||
              k === sentences[sentenceIdx]?.id
            ) {
              delete all[k];
            }
          });
          localStorage.setItem(canvasStorageKey, JSON.stringify(all));
        }
      } catch {
        // ignore
      }

      if (sentenceIdx === currentIndex) {
        canvasHandleRef.current?.clear();
      }
    },
    [userKey, part, currentIndex, sentences, saveNotesToStorage],
  );

  const handleAddQuickNote = useCallback(
    (content: string) => {
      const now = new Date();
      const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
      const targetSent = sentences[currentIndex] || sentences[0];
      const newItem: SavedNoteItem = {
        id: `quick_${Date.now()}`,
        sentenceIndex: currentIndex,
        sentenceId: targetSent?.id,
        displayNumber: targetSent?.displayNumber,
        part,
        formattedTime,
        content,
        type: "note",
        badgeCount: 1,
      };
      setSavedNotes((prev) => {
        const next = [newItem, ...prev];
        saveNotesToStorage(next);
        return next;
      });
    },
    [currentIndex, part, sentences, saveNotesToStorage],
  );

  // Lắng nghe phím tắt B toàn cục để mở / đóng bảng Ghi chú đã lưu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key.toUpperCase() === "B") {
        e.preventDefault();
        setIsSavedNotesOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Câu hỏi hiện tại
  const currentSentence = sentences[currentIndex] || sentences[0];

  // Kiểm tra câu hiện tại đã được trả lời chưa
  const isCurrentSentenceAnswered: boolean = useMemo(() => {
    if (!currentSentence) return false;
    if (part <= 2) {
      return !!userAnswers[currentSentence.id];
    }
    return Boolean(
      (currentSentence.subQuestions?.length ?? 0) > 0 &&
      currentSentence.subQuestions?.every((sq) => !!userAnswers[sq.id]),
    );
  }, [currentSentence, part, userAnswers]);

  // Chỉ mở khóa hiển thị Transcript cho Part 3 & 4 khi người dùng đã chọn hết tất cả các đáp án (đủ cả 3 câu)
  const isAnswerChosen: boolean = isCurrentSentenceAnswered;

  // Khi chưa chọn đáp án hoặc chuyển sang câu chưa làm: tự động tắt Song ngữ
  useEffect(() => {
    if (!isCurrentSentenceAnswered && isBilingual) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsBilingual(false);
    }
  }, [currentIndex, isCurrentSentenceAnswered, isBilingual]);

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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === "correct") {
          // Âm thanh chúc mừng (Chime kép)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc1.frequency.exponentialRampToValueAtTime(
            880,
            ctx.currentTime + 0.15,
          ); // A5

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
          osc2.frequency.exponentialRampToValueAtTime(
            1174.66,
            ctx.currentTime + 0.3,
          ); // D6

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
          osc.frequency.exponentialRampToValueAtTime(
            180,
            ctx.currentTime + 0.2,
          );

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

  // LƯU TIẾN ĐỘ BỀN VỮNG VÀO LOCALSTORAGE & ĐỒNG BỘ VÀO CÁC THẺ TIẾN ĐỘ
  const saveProgressToStorage = useCallback(
    (
      newIndex: number,
      newAnswers = userAnswers,
      newCompleted = completedQuestionIds,
      newCorrect = correctQuestionIds,
      newXP = earnedXP,
    ) => {
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

        // ĐỒNG BỘ TIẾN ĐỘ THỰC TẾ VÀO CÁC THẺ LEVEL & CHỦ ĐỀ
        const levelStatsMap: Record<
          number,
          { completed: number; correct: number; total: number }
        > = {};
        const topicStatsMap: Record<
          string,
          { completed: number; correct: number; total: number }
        > = {};

        sentences.forEach((s) => {
          const qIds: string[] =
            s.subQuestions && s.subQuestions.length > 0
              ? s.subQuestions.map((sq) => sq.id)
              : [s.id];

          qIds.forEach((qid) => {
            const isDone = newCompleted.has(qid);
            const isRight = newCorrect.has(qid);

            if (s.level) {
              if (!levelStatsMap[s.level]) {
                levelStatsMap[s.level] = { completed: 0, correct: 0, total: 0 };
              }
              levelStatsMap[s.level].total += 1;
              if (isDone) levelStatsMap[s.level].completed += 1;
              if (isRight) levelStatsMap[s.level].correct += 1;
            }

            if (s.topicId) {
              if (!topicStatsMap[s.topicId]) {
                topicStatsMap[s.topicId] = { completed: 0, correct: 0, total: 0 };
              }
              topicStatsMap[s.topicId].total += 1;
              if (isDone) topicStatsMap[s.topicId].completed += 1;
              if (isRight) topicStatsMap[s.topicId].correct += 1;
            }
          });
        });

        // Cập nhật localStorage cho từng Level card (ví dụ: p1-l1, p1-l2...)
        const targetConfig = PART_DETAILED_CONFIGS[part];
        Object.entries(levelStatsMap).forEach(([lvl, st]) => {
          const cardId = `p${part}-l${lvl}`;
          const cKey = `toeic_card_stats_${userKey}_${cardId}`;
          const wrong = Math.max(0, st.completed - st.correct);
          const levelCard = targetConfig?.levels.find(
            (l) => l.level === Number(lvl),
          );
          const exactTotal = levelCard?.questionCount ?? st.total;
          localStorage.setItem(
            cKey,
            JSON.stringify({
              completedCount: st.completed,
              correctCount: st.correct,
              wrongCount: wrong,
              totalQuestions: exactTotal,
            }),
          );
        });

        // Cập nhật localStorage cho từng Topic card (ví dụ: p1-t1, p1-t2...)
        Object.entries(topicStatsMap).forEach(([topId, st]) => {
          const cKey = `toeic_card_stats_${userKey}_${topId}`;
          const wrong = Math.max(0, st.completed - st.correct);
          const topicCard = targetConfig?.topics.cards.find(
            (c) => c.id === topId,
          );
          const exactTotal = topicCard?.questionCount ?? st.total;
          localStorage.setItem(
            cKey,
            JSON.stringify({
              completedCount: st.completed,
              correctCount: st.correct,
              wrongCount: wrong,
              totalQuestions: exactTotal,
            }),
          );
        });
      } catch (err) {
        console.error("Failed to save progress to localStorage", err);
      }
    },
    [
      part,
      userKey,
      sentences,
      progressStorageKey,
      userAnswers,
      completedQuestionIds,
      correctQuestionIds,
      earnedXP,
    ],
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
    // Với Part 1 & 2: đã chọn rồi thì không cho chọn lại
    if (part <= 2 && userAnswers[questionKey]) {
      return;
    }
    // Với Part 3 & 4: khi đã hoàn thành toàn bộ nhóm câu rồi thì khoá lại
    if (part >= 3 && isCurrentSentenceAnswered) {
      return;
    }

    const nextAnswers = { ...userAnswers, [questionKey]: optionKey };
    setUserAnswers(nextAnswers);

    const nextCompleted = new Set(completedQuestionIds).add(questionKey);
    setCompletedQuestionIds(nextCompleted);

    let nextXP = earnedXP;
    const nextCorrect = new Set(correctQuestionIds);

    if (part <= 2) {
      if (isCorrect) {
        if (!correctQuestionIds.has(questionKey)) {
          nextCorrect.add(questionKey);
          setCorrectQuestionIds(nextCorrect);
          nextXP += 5;
          setEarnedXP(nextXP);
        }
        playSoundEffect("correct");
      } else {
        nextCorrect.delete(questionKey);
        setCorrectQuestionIds(nextCorrect);
        playSoundEffect("incorrect");
      }
    } else {
      // Part 3 & Part 4: Cập nhật câu đúng vào set
      if (isCorrect) {
        nextCorrect.add(questionKey);
      } else {
        nextCorrect.delete(questionKey);
      }
      setCorrectQuestionIds(nextCorrect);

      // Kiểm tra xem cả nhóm 3 câu đã được chọn đủ hết chưa
      const subQuestions = currentSentence.subQuestions || [];
      const isGroupNowComplete =
        subQuestions.length > 0 &&
        subQuestions.every(
          (sq) => sq.id === questionKey || !!nextAnswers[sq.id],
        );

      // CHỈ KHI NÀO LÀM XONG HẾT TOÀN BỘ CÁC CÂU TRONG NHÓM MỚI PHÁT ÂM THANH VÀ CỘNG XP!
      if (isGroupNowComplete) {
        let groupCorrectCount = 0;
        subQuestions.forEach((sq) => {
          const ans = sq.id === questionKey ? optionKey : nextAnswers[sq.id];
          const matchedOpt = sq.options?.find((o) => o.key === ans);
          if (matchedOpt?.isCorrect) {
            groupCorrectCount++;
          }
        });

        nextXP += groupCorrectCount * 5;
        setEarnedXP(nextXP);

        if (groupCorrectCount === subQuestions.length) {
          playSoundEffect("correct");
        } else {
          playSoundEffect("incorrect");
        }
      }
    }

    // Lưu ngay tiến độ vào localStorage
    saveProgressToStorage(
      currentIndex,
      nextAnswers,
      nextCompleted,
      nextCorrect,
      nextXP,
    );

    // Không tự động chuyển sang câu khác khi chọn đúng hoặc sai
    // Người dùng xem dịch nghĩa & từ vựng rồi tự bấm chuyển câu khi sẵn sàng
  };

  // Xử lý phím số: Part 2 chỉ 1-3 (A, B, C), các Part khác 1-4 (A, B, C, D)
  const handleKeyboardOptionSelect = (key: "A" | "B" | "C" | "D") => {
    if (part === 1 || part === 2) {
      if (Number(part) === 2 && key === "D") {
        return;
      }
      // Đã có đáp án cho câu hiện tại rồi thì không cho chọn lại bằng phím tắt
      if (userAnswers[currentSentence.id]) {
        return;
      }
      const matchOpt = currentSentence.options?.find((o) => o.key === key);
      if (matchOpt) {
        handleSelectOption(currentSentence.id, key, matchOpt.isCorrect);
      }
    }
  };

  // Xử lý khi hoàn thành câu trong chế độ điền từ chính tả
  const handleDictationComplete = () => {
    if (!completedQuestionIds.has(currentSentence.id)) {
      const nextCompleted = new Set(completedQuestionIds).add(
        currentSentence.id,
      );
      const nextCorrect = new Set(correctQuestionIds).add(currentSentence.id);
      const nextXP = earnedXP + 10;

      setCompletedQuestionIds(nextCompleted);
      setCorrectQuestionIds(nextCorrect);
      setEarnedXP(nextXP);
      playSoundEffect("correct");
      toast.success("Xuất sắc! Bạn đã điền chính xác câu này (+10 XP) 🎉");

      saveProgressToStorage(
        currentIndex,
        userAnswers,
        nextCompleted,
        nextCorrect,
        nextXP,
      );

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
      if (
        !activeSavedVocabs.some(
          (v) => v.word.toLowerCase() === vocab.word.toLowerCase(),
        )
      ) {
        setFallbackSavedVocabs((prev) => [...prev, vocab]);
      }
    }
  };

  // Xử lý thoát phòng luyện tập: Lưu chắc chắn tiến độ câu hiện tại trước khi thoát
  const handleExitPractice = () => {
    saveProgressToStorage(currentIndex);
    saveNotesToStorage(savedNotes);
    onExit();
  };

  // Bản đồ trạng thái câu hoàn thành để truyền xuống thanh đáy
  const completedMap = useMemo(() => {
    const map: Record<number, boolean> = {};
    sentences.forEach((s, idx) => {
      if (part >= 3 && s.subQuestions) {
        map[idx] = s.subQuestions.every((sq) =>
          completedQuestionIds.has(sq.id),
        );
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

  // Tự động đồng bộ tiêu đề thông minh theo chế độ đang làm
  const currentTitle = useMemo(() => {
    if (mode === "dictation" || mode === "check") {
      return title?.startsWith("Nghe chép")
        ? title
        : `Nghe chép chính tả · Part ${part}`;
    }
    if (title && !title.startsWith("Nghe chép")) {
      return title;
    }
    return PART_DETAILED_CONFIGS[part]?.partTitle || `Part ${part}`;
  }, [mode, title, part]);

  return (
    <div className="w-full h-screen max-h-screen flex flex-col bg-[#070d1e] text-slate-100 overflow-hidden">
      {/* 1. THANH HEADER ĐIỀU HƯỚNG TRÊN CÙNG (DÍNH LIỀN TRÊN ĐỈNH, KHÔNG BO GÓC, KHÔNG MARGIN) */}
      <PracticeHeader
        title={currentTitle}
        part={part}
        mode={mode}
        onModeChange={setMode}
        onExit={handleExitPractice}
        currentIndex={currentIndex}
        totalQuestions={sentences.length}
        isBilingual={isBilingual}
        onToggleBilingual={() => setIsBilingual((prev) => !prev)}
        canToggleBilingual={isCurrentSentenceAnswered}
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
        isAnnotatorActive={isAnnotatorActive}
        onToggleAnnotator={() => {
          setIsAnnotatorActive((prev) => {
            const next = !prev;
            toast.info(
              next
                ? "Đã kích hoạt thanh Annotator chú thích"
                : "Đã đóng Annotator",
            );
            return next;
          });
        }}
        onOpenSavedNotes={() => setIsSavedNotesOpen(true)}
      />

      {/* 2. KHÔNG GIAN BÀI THI: 2 CỘT CHIA ĐÔI MÀN HÌNH CÓ THỂ KÉO QUA LẠI ĐIỀU CHỈNH ĐỘ RỘNG (CHUẨN DAUENGLISH) */}
      <main
        ref={mainContainerRef}
        className={`w-full flex-1 relative flex flex-row overflow-hidden min-h-0 animate-fade-in ${
          isDraggingSplitter ? "select-none cursor-col-resize" : ""
        }`}
      >
        {/* Lớp bắt sự kiện kéo thanh phân chia toàn màn hình */}
        {isDraggingSplitter && (
          <div className="fixed inset-0 z-50 cursor-col-resize select-none pointer-events-auto" />
        )}

        {/* Layer Canvas vẽ tương tác Annotator phủ trên toàn bộ không gian bài làm */}
        <AnnotatorCanvas
          ref={canvasHandleRef}
          isActive={isAnnotatorActive}
          activeTool={annotatorTool}
          activeColor={annotatorColor}
          splitRatio={splitRatio}
          onCanUndoChange={setCanUndo}
          onCanRedoChange={setCanRedo}
          onVisibilityChange={setIsAnnotatorVisible}
          onToolChange={setAnnotatorTool}
          currentSentenceIndex={currentIndex}
          sentenceId={currentSentence.id}
          displayNumber={currentSentence.displayNumber}
          part={part}
          userKey={userKey}
          onAddSavedNote={handleAddSavedNote}
          onDeleteSavedNote={handleDeleteSavedNote}
        />

        {/* Thanh công cụ Annotator nổi bên trái chuẩn DauEnglish */}
        {isAnnotatorActive && (
          <AnnotatorToolbar
            activeTool={annotatorTool}
            setActiveTool={setAnnotatorTool}
            activeColor={annotatorColor}
            setActiveColor={setAnnotatorColor}
            canUndo={canUndo}
            onUndo={() => canvasHandleRef.current?.undo()}
            canRedo={canRedo}
            onRedo={() => canvasHandleRef.current?.redo()}
            isVisible={isAnnotatorVisible}
            onToggleVisibility={() =>
              canvasHandleRef.current?.toggleVisibility()
            }
            onClear={() => {
              canvasHandleRef.current?.clear();
              setSavedNotes((prev) => {
                const next = prev.filter(
                  (n) => n.sentenceIndex !== currentIndex,
                );
                saveNotesToStorage(next);
                return next;
              });
              toast.info("Đã xóa tất cả nét vẽ và ghi chú trên màn hình");
            }}
            onClose={() => setIsAnnotatorActive(false)}
            onOpenNotes={() => setIsSavedNotesOpen(true)}
          />
        )}

        {/* CỘT TRÁI: HƯỚNG DẪN + WAVEFORM AUDIO + PHÍM TẮT + ẢNH/SƠ ĐỒ */}
        <div
          style={{ width: `${splitRatio}%` }}
          className="min-w-[240px] h-full p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto flex-shrink-0"
        >
          <AudioWaveformPlayer
            sentenceText={
              Number(part) === 1 &&
              currentSentence.options &&
              currentSentence.options.length >= 4
                ? currentSentence.options
                    .map((o) => `(${o.key}) ${o.text}`)
                    .join(". ")
                : currentSentence.audioText
            }
            directionText={
              mode === "dictation" || mode === "check"
                ? "Nghe audio và gõ các từ còn thiếu vào ô trống tương ứng bên phải."
                : currentSentence.directionText
            }
            imageUrl={currentSentence.imageUrl}
            part={part}
            audioDurationSec={currentSentence.audioDuration}
            onSelectOptionKey={handleKeyboardOptionSelect}
            isDarkMode={isDarkMode}
          />

          {/* LỜI THOẠI HỘI THOẠI (TRANSCRIPT & DẪN CHỨNG) CHO PART 3 & PART 4 CHUẨN ẢNH 2 & ẢNH 3 (CHỈ HIỆN KHI ĐÃ CHỌN ĐÁP ÁN) */}
          {Number(part) >= 3 && currentSentence.transcript && isAnswerChosen && (
            <ConversationTranscriptCard
              sentence={currentSentence}
              part={part}
              isEvidence={isEvidence}
              onToggleEvidence={() => setIsEvidence((prev) => !prev)}
              isBilingual={isBilingual}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* THANH PHÂN CÁCH TRUNG TÂM: KÉO QUA LẠI ĐỂ CHỈNH BÊN NÀO RỘNG HƠN (CHUẨN DAUENGLISH) */}
        <div
          onMouseDown={handleSplitterStart}
          onTouchStart={handleSplitterStart}
          onDoubleClick={() => {
            setSplitRatio(50);
            try {
              localStorage.setItem("toeic_practice_split_ratio", "50");
            } catch {
              // ignore
            }
          }}
          title="Kéo sang trái/phải để chỉnh độ rộng 2 bên (Nháy đúp để về 50/50)"
          className="relative z-30 flex-shrink-0 w-3 -mx-1.5 flex items-center justify-center cursor-col-resize group touch-none select-none"
        >
          {/* Đường kẻ dọc */}
          <div
            className={`w-[1px] h-full transition-colors ${
              isDraggingSplitter
                ? "bg-sky-400"
                : "bg-slate-800/90 group-hover:bg-sky-500/70"
            }`}
          />

          {/* Nút gạt tay cầm ở giữa đúng theo ảnh mẫu */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-10 rounded-full border shadow-md flex items-center justify-center transition-all ${
              isDraggingSplitter
                ? "bg-sky-600 border-sky-300 scale-110 shadow-sky-500/30"
                : "bg-slate-700/90 border-slate-600/70 group-hover:bg-slate-600 group-hover:border-sky-400/80 group-hover:scale-105 active:bg-sky-600 active:border-sky-300"
            }`}
          >
            <div
              className={`w-0.5 h-4 rounded-full transition-colors ${
                isDraggingSplitter
                  ? "bg-white"
                  : "bg-slate-400 group-hover:bg-sky-200"
              }`}
            />
          </div>
        </div>

        {/* CỘT PHẢI: CÂU HỎI TRẮC NGHIỆM ETS HOẶC ĐIỀN TỪ CHÍNH TẢ */}
        <div
          style={{ width: `${100 - splitRatio}%` }}
          className="min-w-[240px] h-full p-4 sm:p-6 lg:p-8 space-y-4 overflow-y-auto flex-1 flex-shrink-0"
        >
          {Number(part) === 1 &&
          (mode === "dictation" || mode === "check") ? (
            /* Chế độ Nghe & Điền từ chuyên biệt cho Part 1 (Hiển thị đồng thời cả 4 câu A, B, C, D) */
            <div className="space-y-4">
              <Part1DictationCard
                sentences={sentences}
                currentIndex={currentIndex}
                onSelectSentence={handleSelectSentence}
                isDarkMode={isDarkMode}
                onSentenceComplete={handleDictationComplete}
                completedQuestionIds={completedQuestionIds}
                isBookmarked={isCurrentBookmarked}
                onToggleBookmark={() => onToggleBookmark?.(currentSentence.id)}
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
          ) : mode === "dictation" || mode === "check" ? (
            /* Chế độ phụ: Điền từ vào ô trống (Nghe chép chính tả Part 2, 3, 4) */
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
              isBilingualActive={isBilingual && isCurrentSentenceAnswered}
              isEvidenceActive={isEvidence}
              onAddToBasket={handleAddToBasket}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </main>

      {/* 3. THANH ĐÁY CỐ ĐỊNH: BÁO LỖI, GIỎ TỪ, TRA TỪ, < 㗊 1/27 > */}
      <PracticeBottomBar
        currentIndex={currentIndex}
        totalSentences={sentences.length}
        sentences={sentences}
        bookmarkedIds={bookmarkedIds}
        onSelectSentence={handleSelectSentence}
        completedMap={completedMap}
        correctMap={correctMap}
        savedVocabs={activeSavedVocabs}
        isDarkMode={isDarkMode}
        part={part}
        level={sentences[currentIndex]?.level || 1}
        mode={mode}
      />

      {/* 4. SỔ TAY GHI CHÚ ĐÃ LƯU TRONG LỘ TRÌNH HỌC (CHUẨN ẢNH 1 - PHÍM TẮT B) */}
      <SavedNotesDrawer
        isOpen={isSavedNotesOpen}
        onClose={() => setIsSavedNotesOpen(false)}
        notes={savedNotes}
        onSelectSentence={handleSelectSentence}
        onJumpToSentence={(sentenceId, targetPart, displayNumber) => {
          setIsSavedNotesOpen(false);
          if (onJumpToSentence) {
            onJumpToSentence(
              sentenceId,
              targetPart as ListeningPart,
              displayNumber,
            );
          }
        }}
        onDeleteNote={handleDeleteSavedNote}
        onDeleteSentenceNotes={handleDeleteSentenceNotes}
        onAddQuickNote={handleAddQuickNote}
        onClearAll={handleClearAllNotes}
        currentSentenceIndex={currentIndex}
        currentPart={part}
        userKey={userKey}
        isDarkMode={isDarkMode}
        sentences={sentences}
      />
    </div>
  );
};
