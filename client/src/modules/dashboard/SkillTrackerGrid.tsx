import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  FileQuestion,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  BookMarked,
  Video,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../../context";
import type { TimeFilterPeriod } from "./types";
import { DEFAULT_SKILL_STATS } from "./defaultData";

/**
 * ==============================================================================
 * COMPONENT: SkillTrackerGrid.tsx
 * MỤC ĐÍCH: Ma trận 8 thẻ kỹ năng và hoạt động học tập kèm bộ lọc thời gian:
 *   - Tab chuyển đổi: Hôm nay / Tuần này / Tháng này / Tất cả
 *   - 8 thẻ dịch vụ AI: Thời gian học, Luyện đề, Đọc, Nghe, Nói AI, Viết AI, Từ vựng, Video
 * THIẾT KẾ ĐỘC ĐÁO & KHÁC BIỆT:
 *   - Màu sắc theo chuẩn thiết kế TOEIC Master AI (Glassmorphism, viền màu kỹ năng)
 *   - Các thẻ có liên kết điều hướng trực tiếp vào từng module học tập
 * ==============================================================================
 */

// Ánh xạ tên icon sang React Component Lucide
const ICON_MAP: Record<string, React.ElementType> = {
  Clock,
  FileQuestion,
  BookOpen,
  Headphones,
  Mic,
  PenTool,
  BookMarked,
  Video,
};

export const SkillTrackerGrid: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState<TimeFilterPeriod>("today");

  const filterTabs: { id: TimeFilterPeriod; label: string }[] = [
    { id: "today", label: "Hôm nay" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
    { id: "all", label: "Toàn thời gian" },
  ];

  return (
    <div className="mb-10">
      {/* THANH TAB BỘ LỌC THỜI GIAN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Hoạt Động & Kỹ Năng{" "}
            <span className="gradient-text">TOEIC Master</span>
          </h2>
          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Theo dõi khối lượng luyện tập thực tế trên toàn bộ 4 kỹ năng chuẩn ETS
          </p>
        </div>

        {/* Cụm nút bấm chọn Tab */}
        <div
          className={`flex items-center gap-1 p-1 rounded-2xl border self-start sm:self-auto ${
            isDarkMode
              ? "bg-[#0b1226]/80 border-slate-800"
              : "bg-slate-100 border-slate-200 shadow-inner"
          }`}
        >
          {filterTabs.map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* LƯỚI 8 THẺ KỸ NĂNG & CÔNG CỤ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEFAULT_SKILL_STATS.map((item) => {
          const IconComponent = ICON_MAP[item.iconName] || Clock;

          return (
            <Link
              key={item.id}
              to={item.actionUrl}
              className={`group p-5 rounded-2xl border transition-all flex flex-col justify-between hover:-translate-y-1 ${
                isDarkMode
                  ? "bg-[#0b1226]/80 border-indigo-500/15 hover:border-indigo-500/40 hover:bg-[#0e1730] shadow-lg shadow-indigo-950/20"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 shadow-md shadow-slate-200/50"
              }`}
            >
              <div>
                {/* Hàng biểu tượng & Huy hiệu */}
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${item.color}15`,
                      color: item.color,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <IconComponent size={20} />
                  </div>

                  {item.badge && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{
                        background: `${item.color}15`,
                        color: item.color,
                        border: `1px solid ${item.color}30`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Tiêu đề & Giá trị số */}
                <h3
                  className={`text-xs font-semibold ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  {item.title}
                </h3>
                <div
                  className={`text-2xl font-black tracking-tight mt-1 mb-1 transition-colors ${
                    isDarkMode ? "text-white group-hover:text-indigo-300" : "text-slate-900 group-hover:text-indigo-600"
                  }`}
                >
                  {item.value}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{item.subValue}</p>
              </div>

              {/* Mũi tên điều hướng nhỏ ở góc dưới */}
              <div className="pt-3 mt-3 border-t border-slate-800/40 flex items-center justify-between text-[11px] font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Vào luyện ngay</span>
                <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SkillTrackerGrid;
