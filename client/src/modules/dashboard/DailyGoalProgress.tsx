import type React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Sliders, ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../../context";
import type { DailyGoalItem } from "./types";
import { DEFAULT_DAILY_GOALS } from "./defaultData";

/**
 * ==============================================================================
 * COMPONENT: DailyGoalProgress.tsx
 * MỤC ĐÍCH: Khối theo dõi tiến độ mục tiêu hàng ngày (Daily AI Learning Goals):
 *   - Thanh tổng quan số nhiệm vụ đã hoàn thành (ví dụ: 1/5 hoàn thành)
 *   - Danh sách 5 mục tiêu theo kỹ năng: Đọc, Nghe, Từ vựng, Luyện đề, Video
 *   - Vòng tròn và thanh tiến độ tương tác theo thời gian thực
 *   - Nút "Tùy chỉnh mục tiêu" để học viên linh hoạt điều chỉnh
 * ==============================================================================
 */

interface DailyGoalProgressProps {
  onOpenSettings: () => void;
}

export const DailyGoalProgress: React.FC<DailyGoalProgressProps> = ({
  onOpenSettings,
}) => {
  const { isDarkMode } = useTheme();
  const [goals] = useState<DailyGoalItem[]>(DEFAULT_DAILY_GOALS);

  // Đếm số mục tiêu đã hoàn thành
  const completedCount = goals.filter((g) => g.current >= g.target).length;
  const totalCount = goals.length;
  const overallPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border transition-all mb-10 ${
        isDarkMode
          ? "bg-[#0b1226]/80 border-indigo-500/20 shadow-xl shadow-indigo-950/30"
          : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
      }`}
    >
      {/* Header thẻ mục tiêu hôm nay */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/40 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                isDarkMode
                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                  : "bg-indigo-50 border-indigo-200 text-indigo-700"
              }`}
            >
              <Sparkles size={12} className="text-cyan-400" />
              <span>KẾ HOẠCH HÔM NAY</span>
            </span>
          </div>

          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight mt-2 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Mục Tiêu Học Tập Hôm Nay
          </h2>
          <p
            className={`text-xs sm:text-sm mt-0.5 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Hoàn thành trọn vẹn 5 nhiệm vụ để tích lũy thêm +50 AI XP và duy trì chuỗi Streak!
          </p>
        </div>

        {/* Huy hiệu tổng quan tiến độ */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span
              className={`text-sm font-bold block ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {completedCount}/{totalCount} hoàn thành
            </span>
            <span className="text-xs text-indigo-400 font-semibold">{overallPercent}% tiến độ</span>
          </div>

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm border ${
              completedCount > 0
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-500"
                  : "bg-slate-100 border-slate-200 text-slate-500"
            }`}
          >
            {overallPercent}%
          </div>
        </div>
      </div>

      {/* DANH SÁCH 5 MỤC TIÊU TIẾN TRÌNH CHI TIẾT */}
      <div className="space-y-4">
        {goals.map((item) => {
          const itemPercent = Math.min(100, Math.round((item.current / item.target) * 100));
          const isDone = item.current >= item.target;

          // Xác định link điều hướng cho từng kỹ năng
          let skillUrl = "/exam";
          if (item.skill === "reading") skillUrl = "/reading";
          if (item.skill === "listening") skillUrl = "/listening";
          if (item.skill === "vocabulary") skillUrl = "/vocabulary";

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDarkMode
                  ? "bg-[#0e1730]/50 border-slate-800 hover:border-slate-700"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Thông tin mục tiêu & tên kỹ năng */}
              <div className="flex items-center gap-3.5 sm:w-1/3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  <CheckCircle2 size={18} className={isDone ? "text-emerald-400" : ""} />
                </div>
                <div>
                  <h4
                    className={`text-sm font-bold ${
                      isDarkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-xs text-slate-400">
                    Mục tiêu: {item.target} {item.unit}/ngày
                  </span>
                </div>
              </div>

              {/* Thanh tiến độ ngang */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                  <span
                    className={isDarkMode ? "text-slate-300" : "text-slate-700"}
                  >
                    {item.current} / {item.target} {item.unit}
                  </span>
                  <span style={{ color: item.color }}>{itemPercent}%</span>
                </div>

                <div
                  className={`h-2.5 rounded-full overflow-hidden ${
                    isDarkMode ? "bg-slate-800" : "bg-slate-200"
                  }`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${itemPercent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>

              {/* Nút hành động nhanh */}
              <div className="sm:w-32 flex justify-end shrink-0">
                <Link
                  to={skillUrl}
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    isDone
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : isDarkMode
                        ? "bg-indigo-950/60 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20"
                        : "bg-white border-slate-200 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  <span>{isDone ? "Đã xong" : "Luyện ngay"}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER: NÚT TÙY CHỈNH MỤC TIÊU */}
      <div className="mt-6 pt-5 border-t border-slate-800/40 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Muốn điều chỉnh số lượng câu hỏi hoặc mốc thời gian học?
        </span>
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <Sliders size={14} />
          <span>Cài đặt lại mục tiêu hàng ngày</span>
        </button>
      </div>
    </div>
  );
};

export default DailyGoalProgress;
