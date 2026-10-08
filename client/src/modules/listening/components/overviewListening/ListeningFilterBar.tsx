import { Bookmark } from "lucide-react";
import type { ListeningTabKey } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: ListeningFilterBar.tsx
 * MỤC ĐÍCH: Bộ chuyển đổi Tab chính (Nghe chép, Part 1, 2, 3, 4) và Bộ lọc năm / Ôn tập
 * THIẾT KẾ: Bám sát chuẩn ảnh mẫu:
 *   - Hàng 1: Tab viên nang tròn bo góc (Nghe chép, Part 1, 2, 3, 4)
 *   - Hàng 2: Bộ lọc năm (2026, 2024, 2023) + Nút vàng "🔖 Câu cần luyện lại"
 * ==============================================================================
 */

interface ListeningFilterBarProps {
  activeTab: ListeningTabKey;
  onTabChange: (tab: ListeningTabKey) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  showBookmarkedOnly: boolean;
  onToggleBookmarkedOnly: () => void;
  bookmarkedCount: number;
  isDarkMode: boolean;
}

const TABS: { key: ListeningTabKey; label: string }[] = [
  { key: "dictation", label: "Nghe chép" },
  { key: "part1", label: "Part 1" },
  { key: "part2", label: "Part 2" },
  { key: "part3", label: "Part 3" },
  { key: "part4", label: "Part 4" },
];

const YEARS = [2026, 2024, 2023];

export const ListeningFilterBar: React.FC<ListeningFilterBarProps> = ({
  activeTab,
  onTabChange,
  selectedYear,
  onYearChange,
  showBookmarkedOnly,
  onToggleBookmarkedOnly,
  bookmarkedCount,
  isDarkMode,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. HÀNG TAB CHÍNH (Pill Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm sm:text-[15px] whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30 scale-[1.02]"
                  : isDarkMode
                    ? "bg-[#0b1329] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/40"
                    : "bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-200 hover:bg-sky-50/50 shadow-sm"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 2. HÀNG BỘ LỌC NĂM & CÂU CẦN LUYỆN LẠI (Chỉ hiển thị ở tab Nghe chép chuẩn ảnh mẫu) */}
      {activeTab === "dictation" && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none animate-fade-in">
          {/* Các nút năm 2026, 2024, 2023 */}
          {YEARS.map((year) => {
            // Khi đang lọc "Câu cần luyện lại", không có nút năm nào được active
            const isYearActive = !showBookmarkedOnly && selectedYear === year;
            return (
              <button
                key={year}
                type="button"
                onClick={() => onYearChange(year)}
                className={`px-4 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  isYearActive
                    ? isDarkMode
                      ? "bg-sky-500/20 border border-sky-400 text-sky-400 shadow-sm"
                      : "bg-sky-50 border border-sky-400 text-sky-600 shadow-sm"
                    : isDarkMode
                      ? "bg-[#0b1329] border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm"
                }`}
              >
                {year}
              </button>
            );
          })}

          {/* Nút: 🔖 Câu cần luyện lại (Border màu vàng & Chữ màu vàng chuẩn yêu cầu) */}
          <button
            type="button"
            onClick={onToggleBookmarkedOnly}
            className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shrink-0 border ${
              showBookmarkedOnly
                ? "bg-amber-500/20 border-amber-400 text-amber-400 shadow-md shadow-amber-500/20 font-black"
                : isDarkMode
                  ? "bg-[#0b1329] border-amber-400 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 hover:border-amber-300"
                  : "bg-white border-amber-400 text-amber-500 hover:bg-amber-50 shadow-sm"
            }`}
          >
            <Bookmark
              size={15}
              className={
                showBookmarkedOnly
                  ? "fill-amber-400 text-amber-400"
                  : "text-amber-400"
              }
            />
            <span className="text-amber-400 font-bold">
              Câu cần luyện lại
            </span>
            {bookmarkedCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  showBookmarkedOnly
                    ? "bg-amber-400/30 text-amber-300 border border-amber-400/50"
                    : "bg-amber-500/20 text-amber-400 border border-amber-400/30"
                }`}
              >
                {bookmarkedCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
