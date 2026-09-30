import type React from "react";
import {
  Sparkles,
  Bot,
  Flame,
  Zap,
  Crown,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../context";
import type { UserStudyGoal } from "./types";

/**
 * ==============================================================================
 * COMPONENT: DashboardHeader.tsx
 * MỤC ĐÍCH: Phần chào đón học viên cá nhân hóa bằng Trí Tuệ Nhân Tạo AI Mentor:
 *   - Lời chào theo tên học viên và phân tích phong độ học tập
 *   - Khối AI Mentor Hologram với câu cố vấn lộ trình chiến lược theo thời gian thực
 *   - Huy hiệu thành viên PRO AI, chuỗi ngày học Streak ngọn lửa và điểm kinh nghiệm XP
 *   - Nút "Cài đặt lại mục tiêu" để mở lại Onboarding Modal bất cứ lúc nào
 * ==============================================================================
 */

interface DashboardHeaderProps {
  displayName: string;
  goal: UserStudyGoal;
  onOpenGoalSettings: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  displayName,
  goal,
  onOpenGoalSettings,
}) => {
  const { isDarkMode } = useTheme();

  const scoreGap = Math.max(0, goal.targetScore - goal.currentScore);

  // Định dạng hiển thị thời gian học linh hoạt theo số phút / giờ
  const formatStudyTime = (minutes: number) => {
    if (!minutes || minutes <= 0) return "0 phút";
    if (minutes === 60) return "60 phút";
    if (minutes > 60 && minutes % 60 === 0) return `${minutes} phút`;
    if (minutes > 60) return `${minutes} phút`;
    return `${minutes} phút`;
  };

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-8 lg:p-9 mb-8 border transition-all overflow-hidden ${
        isDarkMode
          ? "bg-gradient-to-r from-[#0d1533] via-[#091024] to-[#0d1b38] border-indigo-500/25 shadow-2xl shadow-indigo-950/40"
          : "bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-cyan-50/50 border-indigo-200/80 shadow-xl shadow-indigo-100/50"
      }`}
    >
      {/* Vòng tròn ánh sáng hào quang mờ phía sau */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* KHỐI TRÁI: LỜI CHÀO & PHÂN TÍCH TIẾN ĐỘ AI */}
        <div className="flex-1 max-w-2xl">
          {/* Huy hiệu hệ thống AI Mentor */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
                isDarkMode
                  ? "bg-indigo-950/80 border-indigo-500/30 text-indigo-300"
                  : "bg-indigo-100 border-indigo-200 text-indigo-800"
              }`}
            >
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              <span>TOEIC MASTER AI MENTOR</span>
            </span>

            {/* Huy hiệu gói Pro */}
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm">
              <Crown size={12} className="fill-slate-950" />
              <span>PRO MEMBER</span>
            </span>

            {/* Cấp độ học viên */}
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isDarkMode
                  ? "bg-slate-800/80 text-slate-300"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              <ShieldCheck size={12} className="text-indigo-400" />
              <span>Level {goal.level}</span>
            </span>
          </div>

          {/* Tiêu đề chào mừng */}
          <h1
            className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2.5 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Chào {displayName}, sẵn sàng bứt phá{" "}
            <span className="gradient-text">
              {goal.targetScore > 0
                ? `${goal.targetScore} TOEIC`
                : "Mục Tiêu TOEIC"}
            </span>{" "}
            nhé! 🚀
          </h1>

          <p
            className={`text-sm sm:text-base leading-relaxed mb-5 ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {goal.targetScore > 0 ? (
              <>
                Mỗi ngày cam kết {formatStudyTime(goal.dailyStudyMinutes)} luyện
                tập. Bạn đang cách đích đến{" "}
                <strong className="text-cyan-400 font-bold">
                  +{scoreGap} điểm
                </strong>{" "}
                — AI đã tối ưu hóa đề thi hôm nay cho bạn!
              </>
            ) : (
              <>
                Chào mừng bạn đến với TOEIC Master AI! Hãy hoàn tất thiết lập
                mục tiêu cá nhân để hệ thống khởi tạo lộ trình học tập tối ưu
                cho bạn.
              </>
            )}
          </p>

          {/* Hàng nút chỉ số nhanh */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Chuỗi ngày học Streak */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                isDarkMode
                  ? "bg-slate-900/80 border-amber-500/30 text-amber-400"
                  : "bg-amber-50 border-amber-200 text-amber-800"
              }`}
            >
              <Flame
                size={15}
                className="fill-amber-400 text-amber-400 animate-bounce"
              />
              <span>Streak: {goal.streakDays} ngày</span>
            </div>

            {/* Điểm kinh nghiệm AI XP */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                isDarkMode
                  ? "bg-slate-900/80 border-cyan-500/30 text-cyan-300"
                  : "bg-cyan-50 border-cyan-200 text-cyan-800"
              }`}
            >
              <Zap size={14} className="fill-cyan-400 text-cyan-400" />
              <span>{goal.totalXP} AI XP</span>
            </div>

            {/* Nút bấm chỉnh sửa lại mục tiêu */}
            <button
              type="button"
              onClick={onOpenGoalSettings}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                isDarkMode
                  ? "bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 hover:text-white"
                  : "bg-white border-slate-200 text-indigo-700 hover:bg-indigo-50 shadow-sm"
              }`}
            >
              <Sliders size={13} />
              <span>Tùy chỉnh mục tiêu</span>
            </button>
          </div>
        </div>

        {/* KHỐI PHẢI: AI MENTOR HOLOGRAM BUBBLE (Thay thế chú mèo bằng AI Studio công nghệ cao) */}
        <div className="shrink-0 flex items-center gap-4 lg:max-w-xs">
          {/* Avatar biểu tượng AI Hologram với viền chuyển động */}
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 relative">
              <Bot size={34} className="animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#091024] animate-ping" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#091024]" />
            </div>
          </div>

          {/* Hộp thoại bong bóng lời khuyên AI */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border text-xs leading-relaxed transition-all shadow-sm ${
              isDarkMode
                ? "bg-slate-900/90 border-indigo-500/30 text-slate-200 shadow-indigo-950/50"
                : "bg-white border-slate-200 text-slate-700 shadow-slate-200/70"
            }`}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-500 mb-1">
              <Sparkles size={11} />
              <span>Lời khuyên hôm nay</span>
            </div>
            &quot;Duy trì 20 câu Part 5 & 1 bài Listening Part 3 để củng cố ngữ
            pháp mệnh đề quan hệ nhé!&quot;
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
