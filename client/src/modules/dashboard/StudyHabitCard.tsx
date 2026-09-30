import type React from "react";
import { Flame, Zap, ChevronRight } from "lucide-react";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: StudyHabitCard.tsx
 * MỤC ĐÍCH: Quản lý thói quen học tập cam kết mỗi ngày (Study Rhythm),
 *           chuỗi ngày học Streak và điểm kinh nghiệm AI XP.
 * THIẾT KẾ ĐỘC ĐÁO:
 *   - Hiển thị rõ cam kết thời gian học mỗi ngày (ví dụ 60 phút = 1 giờ/ngày)
 *   - Thanh năng lượng thói quen học tập hôm nay
 *   - Ngọn lửa Streak rực sáng kích thích động lực bền bỉ
 * ==============================================================================
 */

interface StudyHabitCardProps {
  dailyMinutes: number;
  streakDays: number;
  longestStreak: number;
  totalXP: number;
  onOpenSettings: () => void;
}

export const StudyHabitCard: React.FC<StudyHabitCardProps> = ({
  dailyMinutes,
  streakDays,
  longestStreak,
  totalXP,
  onOpenSettings,
}) => {
  const { isDarkMode } = useTheme();

  // Khởi tạo thời gian đã học hôm nay ban đầu = 0 phút
  const studiedTodayMinutes = 0;
  const progressPercent =
    dailyMinutes > 0
      ? Math.min(100, Math.round((studiedTodayMinutes / dailyMinutes) * 100))
      : 0;

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
        isDarkMode
          ? "bg-[#0b1226]/80 border-indigo-500/20 shadow-xl shadow-indigo-950/30"
          : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
      }`}
    >
      <div>
        {/* Header thẻ */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
              <Flame size={18} className="fill-amber-400" />
            </div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              KỶ LUẬT & ĐỘNG LỰC
            </h3>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {dailyMinutes > 0 ? `Mỗi ngày ${dailyMinutes} phút` : "Chưa đặt cam kết"}
          </span>
        </div>

        {/* 2 chỉ số chính: Streak & XP */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* Ô Chuỗi ngày học Streak */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDarkMode
                ? "bg-[#0e1730]/70 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
              <Flame size={14} className="fill-amber-400" />
              <span>Chuỗi ngày</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-amber-400 tracking-tight">
                {streakDays}
              </span>
              <span className="text-xs text-slate-400 font-medium">ngày</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Dài nhất: {longestStreak} ngày
            </span>
          </div>

          {/* Ô AI XP Tích lũy */}
          <div
            className={`p-3.5 rounded-2xl border ${
              isDarkMode
                ? "bg-[#0e1730]/70 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold mb-1">
              <Zap size={14} className="fill-cyan-400" />
              <span>AI XP Trọn đời</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-cyan-400 tracking-tight">
                {totalXP}
              </span>
              <span className="text-xs text-slate-400 font-medium">XP</span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Tích lũy từ bài làm
            </span>
          </div>
        </div>

        {/* Tiến độ cam kết thời gian học hôm nay */}
        <div className="space-y-1.5 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-semibold ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Thời gian học hôm nay:
            </span>
            <span className="font-bold text-indigo-400">
              {studiedTodayMinutes} / {dailyMinutes} phút ({progressPercent}%)
            </span>
          </div>

          <div
            className={`h-2 rounded-full overflow-hidden ${
              isDarkMode ? "bg-slate-800" : "bg-slate-200"
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer: Nút đổi thời gian học */}
      <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Mục tiêu:{" "}
          {dailyMinutes === 0
            ? "Chưa thiết lập"
            : dailyMinutes >= 60
              ? `${(dailyMinutes / 60).toFixed(1)} giờ/ngày`
              : `${dailyMinutes} phút/ngày`}
        </span>
        <button
          type="button"
          onClick={onOpenSettings}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Đổi cam kết</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default StudyHabitCard;
