import type React from "react";
import { useState } from "react";
import { ListeningHero } from "./overviewListening/ListeningHero";
import { ListeningFilterBar } from "./overviewListening/ListeningFilterBar";
import { ListeningPartCard } from "./overviewListening/ListeningPartCard";
import { PartDetailView } from "./overviewListening/PartDetailView";
import {
  BookmarkedSentencesList,
  type BookmarkedSentenceEntry,
} from "./overviewListening/BookmarkedSentencesList";
import { PART_DETAILED_CONFIGS, getAllSentences } from "../mockData";
import type {
  ListeningTabKey,
  ListeningPart,
  TestGroupData,
  VocabItem,
} from "../types";

/**
 * ==============================================================================
 * COMPONENT: ListeningOverview.tsx
 * MỤC ĐÍCH: Giao diện tổng quan trang Luyện nghe TOEIC Listening (Chuẩn Bộ 5 Ảnh Mới)
 * CẤU TRÚC:
 *   1. Khối Hero giới thiệu với biểu tượng Tai nghe dạ quang
 *   2. Thanh Tabs (Nghe chép, Part 1, Part 2, Part 3, Part 4)
 *   3. Khi ở Tab "Nghe chép":
 *      - Bộ lọc năm (2026, 2024, 2023) + Nút "🔖 Câu cần luyện lại"
 *      - Trạng thái trống khi bấm "Câu cần luyện lại": Icon Bookmark + "Chưa có câu nào được đánh dấu"
 *      - Danh sách Test 1 & 4 thẻ Part chính
 *   4. Khi ở Tab "Part 1": 4 Level + Nhóm "Theo dạng tranh" (Tranh 1 người, nhiều người, tả cảnh, tả vật)
 *   5. Khi ở Tab "Part 2": 4 Level + Nhóm "Theo dạng câu hỏi" (Who, When, Where, Why)
 *   6. Khi ở Tab "Part 3": 4 Level + Nhóm "Dạng đặc biệt" (Bảng biểu, 3 người nói, hàm ý)
 *   7. Khi ở Tab "Part 4": 4 Level + Nhóm "Dạng đặc biệt" (Bảng biểu, hàm ý người nói)
 * ==============================================================================
 */

export interface ListeningOverviewProps {
  testGroups: TestGroupData[];
  onSelectPracticePart: (
    part: ListeningPart,
    testId: string,
    topicOrCardId?: string,
  ) => void;
  onRetryWrongQuestions?: (
    part: ListeningPart,
    testId: string,
    topicOrCardId?: string,
  ) => void;
  onResetCardProgress?: (cardId: string) => void;
  isDarkMode: boolean;
  userKey?: string;
  bookmarkedIds?: string[];
  onToggleBookmark?: (sentenceId: string) => void;
  onPracticeSentence?: (item: BookmarkedSentenceEntry) => void;
  activeTab?: ListeningTabKey;
  onTabChange?: (tab: ListeningTabKey) => void;
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  showBookmarkedOnly?: boolean;
  onShowBookmarkedOnlyChange?: (show: boolean) => void;
  savedVocabs?: VocabItem[];
}

export const ListeningOverview: React.FC<ListeningOverviewProps> = ({
  testGroups,
  onSelectPracticePart,
  onRetryWrongQuestions,
  onResetCardProgress,
  isDarkMode,
  userKey,
  bookmarkedIds = [],
  onToggleBookmark = () => {},
  onPracticeSentence = () => {},
  activeTab: controlledActiveTab,
  onTabChange: controlledOnTabChange,
  selectedYear: controlledSelectedYear,
  onYearChange: controlledOnYearChange,
  showBookmarkedOnly: controlledShowBookmarkedOnly,
  onShowBookmarkedOnlyChange: controlledOnShowBookmarkedOnlyChange,
  savedVocabs,
}) => {
  const [internalTab, setInternalTab] = useState<ListeningTabKey>("dictation");
  const [internalYear, setInternalYear] = useState<number>(2026);
  const [internalShowBookmarkedOnly, setInternalShowBookmarkedOnly] =
    useState<boolean>(false);

  const activeTab = controlledActiveTab ?? internalTab;
  const selectedYear = controlledSelectedYear ?? internalYear;
  const showBookmarkedOnly =
    controlledShowBookmarkedOnly ?? internalShowBookmarkedOnly;

  const handleTabChange = (tab: ListeningTabKey) => {
    if (controlledOnTabChange) {
      controlledOnTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const handleYearChange = (year: number) => {
    if (controlledOnYearChange) {
      controlledOnYearChange(year);
    } else {
      setInternalYear(year);
    }
  };

  const handleShowBookmarkedOnlyChange = (show: boolean) => {
    if (controlledOnShowBookmarkedOnlyChange) {
      controlledOnShowBookmarkedOnlyChange(show);
    } else {
      setInternalShowBookmarkedOnly(show);
    }
  };

  // Lọc danh sách câu hỏi đã lưu đánh dấu để hiển thị
  const allSentences = getAllSentences();
  const bookmarkedSentences = allSentences.filter((s) =>
    bookmarkedIds.includes(s.id),
  );

  // Lọc bài test theo năm được chọn
  const currentTests = testGroups.filter((t) => t.year === selectedYear);
  const activeTest = currentTests[0] || testGroups[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. KHỐI HERO BANNER */}
      <ListeningHero isDarkMode={isDarkMode} />

      {/* 2. THANH BỘ LỌC TAB VÀ NĂM */}
      <ListeningFilterBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          handleTabChange(tab);
          handleShowBookmarkedOnlyChange(false);
        }}
        selectedYear={selectedYear}
        onYearChange={(year) => {
          handleYearChange(year);
          handleShowBookmarkedOnlyChange(false);
        }}
        showBookmarkedOnly={showBookmarkedOnly}
        onToggleBookmarkedOnly={() =>
          handleShowBookmarkedOnlyChange(!showBookmarkedOnly)
        }
        bookmarkedCount={bookmarkedIds.length}
        isDarkMode={isDarkMode}
      />

      {/* 3. NỘI DUNG THAY ĐỔI THEO TAB ĐƯỢC CHỌN (CHUẨN 5 ẢNH MẪU) */}
      {activeTab === "dictation" && (
        <div className="space-y-6 animate-fade-in">
          {showBookmarkedOnly ? (
            /* HIỂN THỊ DANH SÁCH CÂU ĐÃ ĐÁNH DẤU HOẶC TRẠNG THÁI TRỐNG */
            <BookmarkedSentencesList
              items={bookmarkedSentences}
              onPracticeSentence={onPracticeSentence}
              onRemoveBookmark={onToggleBookmark}
              isDarkMode={isDarkMode}
            />
          ) : (
            /* DANH SÁCH BÀI TEST 1 VÀ 4 THẺ PART (Chuẩn Giao diện ban đầu) */
            <div className="space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 rounded-full bg-sky-400" />
                <h2
                  className={`text-lg sm:text-xl font-black tracking-tight ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  {activeTest.testName}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {activeTest.parts.map((partCard) => (
                  <ListeningPartCard
                    key={partCard.part}
                    card={partCard}
                    onStartPractice={(part) =>
                      onSelectPracticePart(part, activeTest.id)
                    }
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB PART 1 (Chuẩn Ảnh 2) */}
      {activeTab === "part1" && (
        <PartDetailView
          config={PART_DETAILED_CONFIGS[1]}
          onStartLearning={(cardId) =>
            onSelectPracticePart(1, activeTest.id, cardId)
          }
          onRetryWrong={(cardId) =>
            onRetryWrongQuestions
              ? onRetryWrongQuestions(1, activeTest.id, cardId)
              : onSelectPracticePart(1, activeTest.id, cardId)
          }
          onResetProgress={onResetCardProgress}
          isDarkMode={isDarkMode}
          userKey={userKey}
          savedVocabs={savedVocabs}
        />
      )}

      {/* TAB PART 2 (Chuẩn Ảnh 3) */}
      {activeTab === "part2" && (
        <PartDetailView
          config={PART_DETAILED_CONFIGS[2]}
          onStartLearning={(cardId) =>
            onSelectPracticePart(2, activeTest.id, cardId)
          }
          onRetryWrong={(cardId) =>
            onRetryWrongQuestions
              ? onRetryWrongQuestions(2, activeTest.id, cardId)
              : onSelectPracticePart(2, activeTest.id, cardId)
          }
          onResetProgress={onResetCardProgress}
          isDarkMode={isDarkMode}
          userKey={userKey}
          savedVocabs={savedVocabs}
        />
      )}

      {/* TAB PART 3 (Chuẩn Ảnh 4) */}
      {activeTab === "part3" && (
        <PartDetailView
          config={PART_DETAILED_CONFIGS[3]}
          onStartLearning={(cardId) =>
            onSelectPracticePart(3, activeTest.id, cardId)
          }
          onRetryWrong={(cardId) =>
            onRetryWrongQuestions
              ? onRetryWrongQuestions(3, activeTest.id, cardId)
              : onSelectPracticePart(3, activeTest.id, cardId)
          }
          onResetProgress={onResetCardProgress}
          isDarkMode={isDarkMode}
          userKey={userKey}
          savedVocabs={savedVocabs}
        />
      )}

      {/* TAB PART 4 (Chuẩn Ảnh 5) */}
      {activeTab === "part4" && (
        <PartDetailView
          config={PART_DETAILED_CONFIGS[4]}
          onStartLearning={(cardId) =>
            onSelectPracticePart(4, activeTest.id, cardId)
          }
          onRetryWrong={(cardId) =>
            onRetryWrongQuestions
              ? onRetryWrongQuestions(4, activeTest.id, cardId)
              : onSelectPracticePart(4, activeTest.id, cardId)
          }
          onResetProgress={onResetCardProgress}
          isDarkMode={isDarkMode}
          userKey={userKey}
          savedVocabs={savedVocabs}
        />
      )}
    </div>
  );
};
