import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme, useAuth, useUI } from "../../context";
import {
  ListeningOverview,
  ListeningPracticeRoom,
  MOCK_TEST_GROUPS,
  MOCK_SENTENCES_BY_PART,
  MOCK_DICTATION_PART1_SENTENCES,
  MOCK_DICTATION_PART2_SENTENCES,
  MOCK_DICTATION_PART3_SENTENCES,
  MOCK_DICTATION_PART4_SENTENCES,
  PART_DETAILED_CONFIGS,
  type ListeningPart,
  type ListeningTabKey,
  type BookmarkedSentenceEntry,
  type VocabItem,
  type PracticeMode,
} from "../../modules/listening";

/**
 * ==============================================================================
 * TRANG LUYỆN NGHE: ListeningPage.tsx (/listening)
 * MỤC ĐÍCH: Trang chuyên biệt Chinh phục TOEIC Listening từ dễ đến khó:
 *   - Chế độ 1: Tổng quan (ListeningOverview) - Bộ lọc năm, Test 1, Lưới thẻ Part 1-4,
 *     Danh sách "Câu cần luyện lại" đồng bộ bền vững qua localStorage
 *   - Chế độ 2: Phòng Luyện tập (ListeningPracticeRoom) - Nghe chép chính tả & Trắc nghiệm ETS,
 *     Dạng sóng Waveform trực quan, Ô điền từ thông minh & Tự động ẩn Navbar qua UIContext
 * ==============================================================================
 */

/**
 * Hàm đồng bộ và tính toán lại thống kê thẻ (Level & Topic) bám sát theo tiến độ thực tế trong localStorage
 * Đảm bảo Level cards và Topic cards luôn liên kết 2 chiều và chính xác 100%
 */
const syncPartCardStats = (part: ListeningPart, userKey: string) => {
  const allSentences =
    MOCK_SENTENCES_BY_PART[part] || MOCK_SENTENCES_BY_PART[1];
  const config = PART_DETAILED_CONFIGS[part];
  if (!config) return;

  const progressKey = `toeic_listening_progress_${userKey}_part_${part}`;
  let completedSet = new Set<string>();
  let correctSet = new Set<string>();

  try {
    const raw = localStorage.getItem(progressKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      completedSet = new Set(parsed.completedQuestions || []);
      correctSet = new Set(parsed.correctAnswers || []);
    }
  } catch {
    // ignore
  }

  const levelStatsMap: Record<
    number,
    { completed: number; correct: number; total: number }
  > = {};
  const topicStatsMap: Record<
    string,
    { completed: number; correct: number; total: number }
  > = {};

  allSentences.forEach((s) => {
    const qIds =
      s.subQuestions && s.subQuestions.length > 0
        ? s.subQuestions.map((sq) => sq.id)
        : [s.id];

    qIds.forEach((qid) => {
      const isDone = completedSet.has(qid);
      const isRight = correctSet.has(qid);

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

  // Cập nhật lại localStorage cho TẤT CẢ các thẻ Level của part này
  config.levels.forEach((lvlCard) => {
    const st = levelStatsMap[lvlCard.level] || {
      completed: 0,
      correct: 0,
      total: lvlCard.questionCount,
    };
    const wrong = Math.max(0, st.completed - st.correct);
    const cKey = `toeic_card_stats_${userKey}_${lvlCard.id}`;
    try {
      localStorage.setItem(
        cKey,
        JSON.stringify({
          completedCount: st.completed,
          correctCount: st.correct,
          wrongCount: wrong,
          totalQuestions: lvlCard.questionCount,
        }),
      );
    } catch {
      // ignore
    }
  });

  // Cập nhật lại localStorage cho TẤT CẢ các thẻ Topic của part này
  config.topics.cards.forEach((topCard) => {
    const st = topicStatsMap[topCard.id] || {
      completed: 0,
      correct: 0,
      total: topCard.questionCount,
    };
    const wrong = Math.max(0, st.completed - st.correct);
    const cKey = `toeic_card_stats_${userKey}_${topCard.id}`;
    try {
      localStorage.setItem(
        cKey,
        JSON.stringify({
          completedCount: st.completed,
          correctCount: st.correct,
          wrongCount: wrong,
          totalQuestions: topCard.questionCount,
        }),
      );
    } catch {
      // ignore
    }
  });
};

const ListeningPageContent: React.FC<{ userKey: string }> = ({ userKey }) => {
  const { isDarkMode } = useTheme();
  const { setIsPracticeMode } = useUI();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabStorageKey = `toeic_listening_active_tab_${userKey}`;
  const bookmarkStorageKey = `toeic_listening_bookmarks_${userKey}`;

  // Trạng thái: Đang ở giao diện Tổng quan hay Phòng Luyện tập
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [activePart, setActivePart] = useState<ListeningPart>(1);
  const [initialSentenceIndex, setInitialSentenceIndex] = useState<number>(0);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [practiceTitle, setPracticeTitle] = useState<string>("");
  const [practiceMode, setPracticeMode] = useState<PracticeMode>("full");

  // Tab đang chọn ở giao diện tổng quan (Nghe chép, Part 1, Part 2, Part 3, Part 4)
  // Đồng bộ qua URL query params (?tab=part1) và localStorage
  const urlTab = searchParams.get("tab");
  const validTabs: readonly string[] = [
    "dictation",
    "part1",
    "part2",
    "part3",
    "part4",
  ];
  const activeTab: ListeningTabKey = (
    urlTab && validTabs.includes(urlTab)
      ? urlTab
      : (() => {
          try {
            const saved = localStorage.getItem(tabStorageKey);
            if (saved && validTabs.includes(saved)) {
              return saved;
            }
          } catch {
            // ignore
          }
          return "dictation";
        })()
  ) as ListeningTabKey;

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState<boolean>(false);

  // Xử lý chuyển tab trên thanh bộ lọc (Nghe chép / Part 1 / Part 2 / Part 3 / Part 4)
  const handleTabChange = (newTab: ListeningTabKey) => {
    try {
      localStorage.setItem(tabStorageKey, newTab);
    } catch (e) {
      console.error("Failed to save activeTab to localStorage", e);
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newTab === "dictation") {
          next.delete("tab");
        } else {
          next.set("tab", newTab);
        }
        return next;
      },
      { replace: true },
    );
  };

  // Tự động đồng bộ trạng thái Luyện tập / Học ngay vào UIContext để ẩn Navbar
  useEffect(() => {
    setIsPracticeMode(isPracticing);
    return () => {
      setIsPracticeMode(false);
    };
  }, [isPracticing, setIsPracticeMode]);

  // Tự động kiểm tra và đồng bộ hai chiều Level & Topic từ tiến độ thực tế khi đổi tab / mở trang
  useEffect(() => {
    const parts: ListeningPart[] = [1, 2, 3, 4];
    parts.forEach((p) => syncPartCardStats(p, userKey));
  }, [userKey, activeTab]);

  // Danh sách ID các câu đã đánh dấu "Cần luyện lại" (Lưu bền vững vào localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Key giỏ từ của thẻ đang luyện tập (hoặc Level 1 của Part hiện tại nếu luyện chung)
  const currentBasketKey = `toeic_listening_basket_${userKey}_${
    selectedCardId || `p${activePart}-l1`
  }`;

  // Danh sách từ vựng trong giỏ từ của thẻ đang luyện tập
  const [savedVocabs, setSavedVocabs] = useState<VocabItem[]>(() => {
    try {
      const saved = localStorage.getItem(currentBasketKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    if ((selectedCardId || `p${activePart}-l1`) === "p1-l1") {
      return [
        {
          word: "ladder",
          phonetic: "/ˈlæd.ər/",
          type: "danh từ",
          meaning: "Cái thang xếp, thang gấp",
          example:
            "The worker is climbing a ladder to repair the doorway ceiling.",
        },
        {
          word: "gather",
          phonetic: "/ˈɡæðər/",
          type: "động từ",
          meaning: "Tập trung lại, quây quần, hội họp",
          example:
            "Colleagues are gathered around a table to review the quarterly report.",
        },
        {
          word: "repair",
          phonetic: "/rɪˈpeər/",
          type: "động từ",
          meaning: "Sửa chữa, phục hồi",
          example: "He is repairing the equipment on the wall.",
        },
      ];
    }
    return [];
  });

  // Tự động tải giỏ từ tương ứng với thẻ đang được chọn
  useEffect(() => {
    try {
      const saved = localStorage.getItem(currentBasketKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSavedVocabs(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }
    if ((selectedCardId || `p${activePart}-l1`) === "p1-l1") {
      setSavedVocabs([]);
    }
  }, [currentBasketKey, selectedCardId, activePart]);

  // Lưu tự động bookmarks vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(bookmarkStorageKey, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
  }, [bookmarkedIds, bookmarkStorageKey]);

  // Xử lý bật/tắt bookmark một câu
  const handleToggleBookmark = (sentenceId: string) => {
    setBookmarkedIds((prev) => {
      const isAlreadySaved = prev.includes(sentenceId);
      if (isAlreadySaved) {
        toast.info("Đã bỏ đánh dấu câu");
        return prev.filter((id) => id !== sentenceId);
      } else {
        toast.success("Đã lưu câu vào danh sách cần luyện lại");
        return [...prev, sentenceId];
      }
    });
  };

  // Thêm từ vựng vào giỏ từ riêng của thẻ đang luyện
  const handleAddToBasket = (vocab: VocabItem) => {
    setSavedVocabs((prev) => {
      if (prev.some((v) => v.word.toLowerCase() === vocab.word.toLowerCase())) {
        toast.info(`Từ "${vocab.word}" đã có trong giỏ từ`);
        return prev;
      }
      const next = [...prev, vocab];
      try {
        localStorage.setItem(currentBasketKey, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save vocabs to card basket", e);
      }
      toast.success(`Đã thêm từ "${vocab.word}" vào giỏ từ`);
      return next;
    });
    setResetVersion((v) => v + 1);
  };

  // Xử lý khi nhấn nút "Luyện tập >" ở bất kỳ Part hoặc "Học ngay" ở Thẻ Level / Chủ đề
  const handleStartPractice = (
    part: ListeningPart,
    _testId?: string,
    topicOrCardId?: string,
  ) => {
    setActivePart(part);
    setSelectedCardId(topicOrCardId || null);

    const config = PART_DETAILED_CONFIGS[part];
    if (activeTab === "dictation") {
      setPracticeMode("dictation");
      setPracticeTitle(`Nghe chép chính tả · Part ${part}`);
    } else {
      setPracticeMode("full");
      if (topicOrCardId && config) {
        const levelCard = config.levels.find((l) => l.id === topicOrCardId);
        const topicCard = config.topics.cards.find(
          (c) => c.id === topicOrCardId,
        );
        if (levelCard) {
          setPracticeTitle(levelCard.title);
        } else if (topicCard) {
          setPracticeTitle(topicCard.title);
        } else {
          setPracticeTitle(config.partTitle || `Part ${part}`);
        }
      } else if (config) {
        setPracticeTitle(config.partTitle || `Part ${part}`);
      } else {
        setPracticeTitle(`Part ${part}`);
      }
    }

    if (!topicOrCardId) {
      // Khôi phục tiến độ câu đang làm dở từ localStorage khi luyện toàn bộ Part
      try {
        const saved = localStorage.getItem(
          `toeic_listening_progress_${userKey}_part_${part}`,
        );
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.lastIndex === "number" && parsed.lastIndex >= 0) {
            setInitialSentenceIndex(parsed.lastIndex);
          } else {
            setInitialSentenceIndex(0);
          }
        } else {
          setInitialSentenceIndex(0);
        }
      } catch {
        setInitialSentenceIndex(0);
      }
    } else {
      setInitialSentenceIndex(0);
    }
    setIsPracticing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý khi nhấn "Luyện câu này ngay" trong danh sách bookmark
  const handlePracticeSentence = (item: BookmarkedSentenceEntry) => {
    const partSentences = MOCK_SENTENCES_BY_PART[item.part] || [];
    const idx = partSentences.findIndex((s) => s.id === item.id);
    setActivePart(item.part);
    setSelectedCardId(null);
    const targetMode = activeTab === "dictation" ? "dictation" : "full";
    setPracticeMode(targetMode);
    setPracticeTitle(
      targetMode === "dictation"
        ? `Nghe chép chính tả · Part ${item.part}`
        : PART_DETAILED_CONFIGS[item.part]?.partTitle || `Part ${item.part}`,
    );
    setInitialSentenceIndex(idx >= 0 ? idx : 0);
    setIsPracticing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý chuyển thẳng đến câu hỏi cụ thể (từ SavedNotesDrawer sổ tay ghi chú)
  const handleJumpToSentence = (
    sentenceId: string,
    targetPart: ListeningPart,
    displayNumber?: string,
  ) => {
    const partSentences = MOCK_SENTENCES_BY_PART[targetPart] || [];
    let idx = partSentences.findIndex((s) => s.id === sentenceId);
    if (idx < 0 && displayNumber) {
      const cleanNum = displayNumber.replace(/[^0-9]/g, "");
      idx = partSentences.findIndex(
        (s) => s.displayNumber?.replace(/[^0-9]/g, "") === cleanNum,
      );
    }
    const targetSentence = idx >= 0 ? partSentences[idx] : undefined;

    setActivePart(targetPart);
    const config = PART_DETAILED_CONFIGS[targetPart];
    const levelCard = targetSentence?.level
      ? config?.levels.find((l) => l.level === targetSentence.level)
      : undefined;

    if (selectedCardId && levelCard) {
      setSelectedCardId(levelCard.id);
      setPracticeTitle(levelCard.title);
      const levelSentences = partSentences.filter(
        (s) => s.level === levelCard.level,
      );
      const lvlIdx = levelSentences.findIndex(
        (s) => s.id === (targetSentence?.id || sentenceId),
      );
      setInitialSentenceIndex(lvlIdx >= 0 ? lvlIdx : 0);
    } else {
      setSelectedCardId(null);
      setPracticeTitle(config?.partTitle || `Part ${targetPart}`);
      setInitialSentenceIndex(idx >= 0 ? idx : 0);
    }

    setPracticeMode("full");
    setIsPracticing(true);
    setResetVersion((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Thoát phòng luyện tập quay lại Tổng quan và cập nhật ngay tiến độ
  const handleExitPractice = () => {
    setIsPracticing(false);
    setSelectedCardId(null);
    setResetVersion((v) => v + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý khi nhấn nút Làm lại / Luyện lại câu sai từ thẻ cấp độ
  const handleRetryWrongQuestions = (
    part: ListeningPart,
    _testId: string,
    topicOrCardId?: string,
  ) => {
    setActivePart(part);
    setSelectedCardId(topicOrCardId || null);
    setPracticeMode(activeTab === "dictation" ? "dictation" : "full");

    const config = PART_DETAILED_CONFIGS[part];
    if (topicOrCardId && config) {
      const levelCard = config.levels.find((l) => l.id === topicOrCardId);
      const topicCard = config.topics.cards.find((c) => c.id === topicOrCardId);
      if (levelCard) {
        setPracticeTitle(`${levelCard.title} (Làm lại câu sai)`);
      } else if (topicCard) {
        setPracticeTitle(`${topicCard.title} (Làm lại câu sai)`);
      } else {
        setPracticeTitle(config.partTitle || `Part ${part}`);
      }
    } else if (config) {
      setPracticeTitle(config.partTitle || `Part ${part}`);
    } else {
      setPracticeTitle(`Part ${part}`);
    }

    // TÌM VÀ ĐẶT LẠI CÁC CÂU LÀM SAI VỀ TRẠNG THÁI "CHƯA CÓ ĐÁP ÁN"
    const allPartSentences =
      MOCK_SENTENCES_BY_PART[part] || MOCK_SENTENCES_BY_PART[1];
    let cardSentences = allPartSentences;
    if (topicOrCardId && config) {
      const levelCard = config.levels.find((l) => l.id === topicOrCardId);
      const topicCard = config.topics.cards.find((c) => c.id === topicOrCardId);
      if (levelCard) {
        cardSentences = allPartSentences.filter(
          (s) => s.level === levelCard.level,
        );
      } else if (topicCard) {
        cardSentences = allPartSentences.filter(
          (s) => s.topicId === topicOrCardId,
        );
      }
    }

    const progressKey = `toeic_listening_progress_${userKey}_part_${part}`;
    let targetSentenceIndex = 0;

    try {
      const rawProgress = localStorage.getItem(progressKey);
      if (rawProgress) {
        const parsed = JSON.parse(rawProgress);
        const userAnswers = parsed.userAnswers || {};
        const completedQuestions: string[] = parsed.completedQuestions || [];
        const correctAnswers: string[] = parsed.correctAnswers || [];

        const completedSet = new Set(completedQuestions);
        const correctSet = new Set(correctAnswers);
        const wrongQIds = new Set<string>();

        cardSentences.forEach((s) => {
          const qIds =
            s.subQuestions && s.subQuestions.length > 0
              ? s.subQuestions.map((sq) => sq.id)
              : [s.id];

          qIds.forEach((qid) => {
            // Câu sai là câu đã làm hoặc đã có đáp án nhưng không nằm trong danh sách câu đúng
            if (
              (completedSet.has(qid) || userAnswers[qid] !== undefined) &&
              !correctSet.has(qid)
            ) {
              wrongQIds.add(qid);
            }
          });
        });

        if (wrongQIds.size > 0) {
          // 1. Xoá câu trả lời đã chọn để câu trở về trạng thái "chưa có đáp án"
          const nextAnswers = { ...userAnswers };
          wrongQIds.forEach((qid) => {
            delete nextAnswers[qid];
          });

          // 2. Bỏ khỏi danh sách đã hoàn thành để có thể làm lại
          const nextCompleted = completedQuestions.filter(
            (qid) => !wrongQIds.has(qid),
          );

          parsed.userAnswers = nextAnswers;
          parsed.completedQuestions = nextCompleted;
          parsed.lastUpdated = new Date().toISOString();

          localStorage.setItem(progressKey, JSON.stringify(parsed));

          // 3. Tìm câu hỏi sai đầu tiên để điều hướng trực tiếp vào câu đó
          const firstWrongIdx = cardSentences.findIndex((s) => {
            const qIds =
              s.subQuestions && s.subQuestions.length > 0
                ? s.subQuestions.map((sq) => sq.id)
                : [s.id];
            return qIds.some((qid) => wrongQIds.has(qid));
          });
          if (firstWrongIdx >= 0) {
            targetSentenceIndex = firstWrongIdx;
          }

          // 4. Đồng bộ lại thống kê của card này trong localStorage (xoá wrongCount)
          if (topicOrCardId) {
            const cKey = `toeic_card_stats_${userKey}_${topicOrCardId}`;
            const rawCardStats = localStorage.getItem(cKey);
            if (rawCardStats) {
              const parsedStats = JSON.parse(rawCardStats);
              localStorage.setItem(
                cKey,
                JSON.stringify({
                  ...parsedStats,
                  completedCount: parsedStats.correctCount || 0,
                  wrongCount: 0,
                }),
              );
            }
          }
        }
      }
    } catch (err) {
      console.error("Lỗi khi reset câu sai:", err);
    }

    setInitialSentenceIndex(targetSentenceIndex);
    setResetVersion((v) => v + 1);
    setIsPracticing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Biến đếm version để kích hoạt re-render toàn diện khi xóa bỏ câu đã làm
  const [resetVersion, setResetVersion] = useState<number>(0);

  // Xử lý khi nhấn nút Thùng rác xóa tiến độ từ một thẻ (Level hoặc Topic)
  // Đảm bảo: Chỉ xoá các câu hỏi liên quan, các câu không liên quan giữ nguyên
  // và tự động tính toán lại, đồng bộ thống kê cho toàn bộ các thẻ còn lại (Level & Topic)
  const handleResetCardProgress = (cardId: string) => {
    const targetPart: ListeningPart = (
      cardId.startsWith("p") ? Number(cardId.slice(1, 2)) : activePart
    ) as ListeningPart;

    const allSentences =
      MOCK_SENTENCES_BY_PART[targetPart] || MOCK_SENTENCES_BY_PART[1];
    const config = PART_DETAILED_CONFIGS[targetPart];

    const levelCard = config?.levels.find((l) => l.id === cardId);
    const topicCard = config?.topics.cards.find((c) => c.id === cardId);

    // Xác định các câu hỏi cần xoá
    let sentencesToDelete = allSentences;
    if (levelCard) {
      sentencesToDelete = allSentences.filter(
        (s) => s.level === levelCard.level,
      );
    } else if (topicCard) {
      sentencesToDelete = allSentences.filter((s) => s.topicId === cardId);
    }

    const qIdsToDelete = new Set<string>();
    sentencesToDelete.forEach((s) => {
      const qIds =
        s.subQuestions && s.subQuestions.length > 0
          ? s.subQuestions.map((sq) => sq.id)
          : [s.id];
      qIds.forEach((qid) => qIdsToDelete.add(qid));
    });

    const progressKey = `toeic_listening_progress_${userKey}_part_${targetPart}`;
    // eslint-disable-next-line no-useless-assignment
    let remainingCompleted: string[] = [];
    // eslint-disable-next-line no-useless-assignment
    let remainingCorrect: string[] = [];

    try {
      const rawProgress = localStorage.getItem(progressKey);
      if (rawProgress) {
        const parsed = JSON.parse(rawProgress);
        const userAnswers = parsed.userAnswers || {};
        const completedQuestions: string[] = parsed.completedQuestions || [];
        const correctAnswers: string[] = parsed.correctAnswers || [];

        // 1. Chỉ xoá câu trả lời của các câu thuộc thẻ bị xoá
        const nextAnswers: Record<string, string> = {};
        Object.entries(userAnswers).forEach(([qid, ans]) => {
          if (!qIdsToDelete.has(qid)) {
            nextAnswers[qid] = ans as string;
          }
        });

        // 2. Chỉ loại bỏ các câu thuộc thẻ bị xoá khỏi danh sách hoàn thành và đúng
        remainingCompleted = completedQuestions.filter(
          (qid) => !qIdsToDelete.has(qid),
        );
        remainingCorrect = correctAnswers.filter(
          (qid) => !qIdsToDelete.has(qid),
        );

        parsed.userAnswers = nextAnswers;
        parsed.completedQuestions = remainingCompleted;
        parsed.correctAnswers = remainingCorrect;
        parsed.lastUpdated = new Date().toISOString();

        localStorage.setItem(progressKey, JSON.stringify(parsed));
      }

      // 3. TÍNH TOÁN LẠI ĐỒNG BỘ THỐNG KÊ CHO TOÀN BỘ CÁC THẺ LEVEL & TOPIC
      syncPartCardStats(targetPart, userKey);
    } catch (e) {
      console.error("Lỗi khi xoá và đồng bộ tiến độ thẻ:", e);
    }

    setResetVersion((v) => v + 1);
  };

  // Cập nhật động số câu đã hoàn thành trên thẻ tổng quan theo tiến độ thực tế
  const dynamicTestGroups = MOCK_TEST_GROUPS.map((group, groupIdx) => {
    if (groupIdx === 0) {
      const updatedParts = group.parts.map((p) => {
        try {
          const raw = localStorage.getItem(
            `toeic_listening_progress_${userKey}_part_${p.part}`,
          );
          if (raw) {
            const parsed = JSON.parse(raw);
            const doneCount = parsed.completedQuestions?.length || 0;
            const totalQ = p.totalQuestions || 24;
            const pct = Math.min(100, Math.round((doneCount / totalQ) * 100));
            return {
              ...p,
              completedQuestions: doneCount,
              statusText:
                doneCount > 0 ? `${doneCount}/${totalQ}` : p.statusText,
              progressPercent: Math.max(p.progressPercent, pct),
            };
          }
        } catch {
          // ignore
        }
        return p;
      });
      return { ...group, parts: updatedParts };
    }
    return group;
  });

  const currentSentences = useMemo(() => {
    if (practiceMode === "dictation" && !selectedCardId) {
      if (activePart === 1) return MOCK_DICTATION_PART1_SENTENCES;
      if (activePart === 2) return MOCK_DICTATION_PART2_SENTENCES;
      if (activePart === 3) return MOCK_DICTATION_PART3_SENTENCES;
      if (activePart === 4) return MOCK_DICTATION_PART4_SENTENCES;
    }

    const allPartSentences =
      practiceMode === "dictation"
        ? activePart === 1
          ? MOCK_DICTATION_PART1_SENTENCES
          : activePart === 2
          ? MOCK_DICTATION_PART2_SENTENCES
          : activePart === 3
          ? MOCK_DICTATION_PART3_SENTENCES
          : MOCK_DICTATION_PART4_SENTENCES
        : MOCK_SENTENCES_BY_PART[activePart] || MOCK_SENTENCES_BY_PART[1];

    if (!selectedCardId) {
      return allPartSentences;
    }

    const config = PART_DETAILED_CONFIGS[activePart];
    const levelCard = config?.levels.find((l) => l.id === selectedCardId);
    if (levelCard) {
      const filtered = allPartSentences.filter(
        (s) => s.level === levelCard.level,
      );
      return filtered.length > 0 ? filtered : allPartSentences;
    }

    const topicCard = config?.topics.cards.find((c) => c.id === selectedCardId);
    if (topicCard) {
      const filtered = allPartSentences.filter(
        (s) => s.topicId === selectedCardId,
      );
      return filtered.length > 0 ? filtered : allPartSentences;
    }

    return allPartSentences;
  }, [activePart, selectedCardId, practiceMode]);

  return (
    <div
      className={`${
        isPracticing
          ? "w-full h-screen overflow-hidden bg-[#070d1e]"
          : "min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12"
      } transition-all duration-200 ${
        isDarkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      <div className={isPracticing ? "w-full h-full" : "max-w-[1400px] mx-auto"}>
        {!isPracticing ? (
          <ListeningOverview
            key={`overview-${resetVersion}`}
            testGroups={dynamicTestGroups}
            onSelectPracticePart={handleStartPractice}
            onRetryWrongQuestions={handleRetryWrongQuestions}
            onResetCardProgress={handleResetCardProgress}
            isDarkMode={isDarkMode}
            userKey={userKey}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onPracticeSentence={handlePracticeSentence}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            showBookmarkedOnly={showBookmarkedOnly}
            onShowBookmarkedOnlyChange={setShowBookmarkedOnly}
            savedVocabs={savedVocabs}
          />
        ) : (
          <ListeningPracticeRoom
            key={`practice-${activePart}-${selectedCardId || "all"}-${practiceMode}-${resetVersion}`}
            title={practiceTitle}
            part={activePart}
            sentences={currentSentences}
            onExit={handleExitPractice}
            isDarkMode={isDarkMode}
            userKey={userKey}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            savedVocabs={savedVocabs}
            onAddToBasket={handleAddToBasket}
            initialIndex={initialSentenceIndex}
            initialMode={practiceMode}
            onJumpToSentence={handleJumpToSentence}
          />
        )}
      </div>
    </div>
  );
};

export const ListeningPage: React.FC = () => {
  const { user } = useAuth();
  const userKey = user?.email || user?._id || user?.id || "guest";
  return <ListeningPageContent key={userKey} userKey={userKey} />;
};

export default ListeningPage;
