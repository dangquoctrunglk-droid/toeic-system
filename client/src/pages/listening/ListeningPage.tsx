import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTheme, useAuth } from "../../context";
import {
  ListeningOverview,
  ListeningPracticeRoom,
  MOCK_TEST_GROUPS,
  MOCK_SENTENCES_BY_PART,
  type ListeningPart,
  type BookmarkedSentenceEntry,
  type VocabItem,
} from "../../modules/listening";

/**
 * ==============================================================================
 * TRANG LUYỆN NGHE: ListeningPage.tsx (/listening)
 * MỤC ĐÍCH: Trang chuyên biệt Chinh phục TOEIC Listening từ dễ đến khó:
 *   - Chế độ 1: Tổng quan (ListeningOverview) - Bộ lọc năm, Test 1, Lưới thẻ Part 1-4,
 *     Danh sách "Câu cần luyện lại" đồng bộ bền vững qua localStorage
 *   - Chế độ 2: Phòng Luyện tập (ListeningPracticeRoom) - Nghe chép chính tả,
 *     Dạng sóng Waveform trực quan, Ô điền từ thông minh & Thẻ từ vựng khóa/mở
 * ==============================================================================
 */

export const ListeningPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const userKey = user?.email || user?._id || user?.id || "guest";
  const bookmarkStorageKey = `toeic_listening_bookmarks_${userKey}`;
  const basketStorageKey = `toeic_listening_basket_${userKey}`;

  // Trạng thái: Đang ở giao diện Tổng quan hay Phòng Luyện tập
  const [isPracticing, setIsPracticing] = useState<boolean>(false);
  const [activePart, setActivePart] = useState<ListeningPart>(1);
  const [initialSentenceIndex, setInitialSentenceIndex] = useState<number>(0);

  // Danh sách ID các câu đã đánh dấu "Cần luyện lại" (Lưu bền vững vào localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(bookmarkStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Danh sách từ vựng đã lưu vào giỏ từ (Lưu bền vững vào localStorage)
  const [savedVocabs, setSavedVocabs] = useState<VocabItem[]>(() => {
    try {
      const saved = localStorage.getItem(basketStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Đồng bộ lại khi tài khoản người dùng thay đổi
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem(bookmarkStorageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookmarkedIds(savedBm ? JSON.parse(savedBm) : []);
      const savedBk = localStorage.getItem(basketStorageKey);
      setSavedVocabs(savedBk ? JSON.parse(savedBk) : []);
    } catch {
      // ignore
    }
  }, [bookmarkStorageKey, basketStorageKey]);

  // Lưu tự động bookmarks vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(bookmarkStorageKey, JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error("Failed to save bookmarks to localStorage", e);
    }
  }, [bookmarkedIds, bookmarkStorageKey]);

  // Lưu tự động giỏ từ vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(basketStorageKey, JSON.stringify(savedVocabs));
    } catch (e) {
      console.error("Failed to save vocabs to localStorage", e);
    }
  }, [savedVocabs, basketStorageKey]);

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

  // Thêm từ vựng vào giỏ từ
  const handleAddToBasket = (vocab: VocabItem) => {
    setSavedVocabs((prev) => {
      if (prev.some((v) => v.word.toLowerCase() === vocab.word.toLowerCase())) {
        toast.info(`Từ "${vocab.word}" đã có trong giỏ từ`);
        return prev;
      }
      toast.success(`Đã thêm từ "${vocab.word}" vào giỏ từ`);
      return [...prev, vocab];
    });
  };

  // Xử lý khi nhấn nút "Luyện tập >" ở bất kỳ Part hoặc "Học ngay" ở Chủ đề nào
  const handleStartPractice = (
    part: ListeningPart,
    _testId?: string,
    topicOrCardId?: string,
  ) => {
    setActivePart(part);
    if (topicOrCardId) {
      const partSentences = MOCK_SENTENCES_BY_PART[part] || [];
      const matchIdx = partSentences.findIndex(
        (s) => s.topicId === topicOrCardId || s.id === topicOrCardId,
      );
      setInitialSentenceIndex(matchIdx >= 0 ? matchIdx : 0);
    } else {
      // Khôi phục tiến độ câu đang làm dở từ localStorage
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
    }
    setIsPracticing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý khi nhấn "Luyện câu này ngay" trong danh sách bookmark
  const handlePracticeSentence = (item: BookmarkedSentenceEntry) => {
    const partSentences = MOCK_SENTENCES_BY_PART[item.part] || [];
    const idx = partSentences.findIndex((s) => s.id === item.id);
    setActivePart(item.part);
    setInitialSentenceIndex(idx >= 0 ? idx : 0);
    setIsPracticing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Thoát phòng luyện tập quay lại Tổng quan
  const handleExitPractice = () => {
    setIsPracticing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              statusText: doneCount > 0 ? `${doneCount}/${totalQ}` : p.statusText,
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

  const currentSentences =
    MOCK_SENTENCES_BY_PART[activePart] || MOCK_SENTENCES_BY_PART[1];

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-200 ${
        isDarkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        {!isPracticing ? (
          <ListeningOverview
            testGroups={dynamicTestGroups}
            onSelectPracticePart={handleStartPractice}
            isDarkMode={isDarkMode}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onPracticeSentence={handlePracticeSentence}
          />
        ) : (
          <ListeningPracticeRoom
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
          />
        )}
      </div>
    </div>
  );
};

export default ListeningPage;
