import type React from "react";
import { useState, useMemo } from "react";
import {
  Flame,
  Target,
  Calendar,
  Edit3,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../context";
import { TOEIC_SCORE_PRESETS } from "./defaultData";

/**
 * ==============================================================================
 * COMPONENT: DashboardMetricsRow.tsx
 * MỤC ĐÍCH: Hàng ngang thống nhất 4 cột chuẩn theo thiết kế yêu cầu của người dùng:
 *   - Cột 1: ĐIỂM SỐ CỦA BẠN (Điểm hiện tại + Điểm mục tiêu + Nút chọn Preset)
 *   - Cột 2: ĐIỂM CÒN THIẾU (Vòng tròn Radial Neon lớn + Điểm bứt phá + % hoàn thành)
 *   - Cột 3: SỐ NGÀY ĐẾN NGÀY THI (Đếm ngược số ngày + Badge lịch + Chỉnh ngày thi)
 *   - Cột 4: ĐỘNG LỰC HỌC (Chuỗi ngày Streak 🔥 + AI XP trọn đời 🎯)
 * PHONG CÁCH: TOEIC Master AI (Indigo, Cyan, Deep Space Dark, Glassmorphism, Neon Glow)
 * ==============================================================================
 */

export interface DashboardMetricsRowProps {
  currentScore: number;
  targetScore: number;
  examDate: string;
  streakDays: number;
  longestStreak: number;
  totalXP: number;
  onUpdateCurrentScore: (newScore: number) => void;
  onUpdateTargetScore: (newScore: number) => void;
  onUpdateExamDate: (newDate: string) => void;
  onOpenSettings?: () => void;
}

export const DashboardMetricsRow: React.FC<DashboardMetricsRowProps> = ({
  currentScore,
  targetScore,
  examDate,
  streakDays,
  longestStreak,
  totalXP,
  onUpdateCurrentScore,
  onUpdateTargetScore,
  onUpdateExamDate,
}) => {
  const { isDarkMode } = useTheme();

  // Quản lý trạng thái mở popover chọn Preset điểm mục tiêu
  const [showPresets, setShowPresets] = useState<boolean>(false);

  // Quản lý trạng thái chỉnh sửa ngày thi trực tiếp
  const [isEditingDate, setIsEditingDate] = useState<boolean>(false);
  const [tempExamDate, setTempExamDate] = useState<string>(examDate);

  // Khoảng cách điểm cần bứt phá
  const scoreGap = Math.max(0, targetScore - currentScore);

  // Tỷ lệ phần trăm đã đạt (bảo vệ trường hợp targetScore = 0 để tránh NaN)
  const completionPercentage =
    targetScore > 0
      ? Math.min(100, Math.max(0, Math.round((currentScore / targetScore) * 100)))
      : 0;

  // Tính số ngày còn lại đến ngày thi
  const daysLeft = useMemo(() => {
    if (!examDate) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(examDate);
      if (isNaN(target.getTime())) return 0;
      target.setHours(0, 0, 0, 0);
      const diff = target.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  }, [examDate]);

  // Định dạng ngày thi hiển thị (dd/mm/yyyy)
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Chưa đặt lịch thi";
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  // Lưu ngày thi mới
  const handleSaveDate = () => {
    onUpdateExamDate(tempExamDate);
    setIsEditingDate(false);
  };

  // Tính chu vi vòng tròn SVG lớn (bán kính r = 58 -> chu vi = 2 * PI * 58 = ~364.4)
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div
      className={`rounded-3xl p-4 sm:p-5 lg:p-6 mb-10 border transition-all shadow-2xl backdrop-blur-xl ${
        isDarkMode
          ? "bg-[#0b1226]/85 border-indigo-500/25 shadow-indigo-950/40"
          : "bg-white/95 border-slate-200/90 shadow-xl shadow-indigo-500/5"
      }`}
    >
      {/* LƯỚI 4 CỘT CHÍNH TRÊN 1 HÀNG NGANG */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-stretch">
        {/* ========================================================================= */}
        {/* CỘT 1: ĐIỂM SỐ CỦA BẠN (CURRENT & TARGET SCORE)                            */}
        {/* ========================================================================= */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${
            isDarkMode
              ? "bg-[#0e1738]/60 border-indigo-500/15 hover:border-indigo-500/30"
              : "bg-slate-50/80 border-slate-200 hover:border-indigo-300"
          }`}
        >
          {/* Header cột 1 */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              ĐIỂM SỐ CỦA BẠN
            </h3>

            {/* Mục 1: Điểm thi thử hiện tại */}
            <div className="space-y-1.5 mb-5">
              <span className="text-xs font-medium text-slate-400 block">
                Điểm thi thử hiện tại
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onUpdateCurrentScore(Math.max(0, currentScore - 5))}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-base transition-all ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-indigo-500 hover:text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-500 shadow-sm"
                  }`}
                  title="Giảm 5 điểm"
                >
                  -
                </button>

                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={990}
                    step={5}
                    value={currentScore === 0 ? "" : currentScore}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onUpdateCurrentScore(
                        isNaN(val) ? 0 : Math.min(990, Math.max(0, val)),
                      );
                    }}
                    className="w-24 text-center text-3xl sm:text-4xl font-black text-cyan-400 bg-transparent outline-none tracking-tight"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateCurrentScore(
                      Math.min(targetScore || 990, (currentScore || 0) + 5),
                    )
                  }
                  className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-base transition-all ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-indigo-500 hover:text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-indigo-500 shadow-sm"
                  }`}
                  title="Tăng 5 điểm"
                >
                  +
                </button>
              </div>

              <p className="text-[11px] text-slate-500 leading-tight">
                Bạn tự đánh giá — làm đề thi thử để tự cập nhật
              </p>
            </div>

            {/* Mục 2: Điểm mục tiêu */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-400 block">
                Điểm mục tiêu
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateTargetScore(Math.max(currentScore, targetScore - 5))
                  }
                  className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-base transition-all ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-500 hover:text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-500 shadow-sm"
                  }`}
                  title="Giảm 5 điểm"
                >
                  -
                </button>

                <div className="relative">
                  <input
                    type="number"
                    min={currentScore || 0}
                    max={990}
                    step={5}
                    value={targetScore === 0 ? "" : targetScore}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      onUpdateTargetScore(
                        isNaN(val) ? 0 : Math.min(990, Math.max(0, val)),
                      );
                    }}
                    className="w-24 text-center text-3xl sm:text-4xl font-black text-emerald-400 bg-transparent outline-none tracking-tight"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onUpdateTargetScore(Math.min(990, (targetScore || 0) + 5))
                  }
                  className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-base transition-all ${
                    isDarkMode
                      ? "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-emerald-500 hover:text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-500 shadow-sm"
                  }`}
                  title="Tăng 5 điểm"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Nút chọn mốc Preset */}
          <div className="mt-3 pt-3 border-t border-slate-800/40">
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
            >
              <span>Đặt bằng preset (500/650/750/850/950) →</span>
            </button>

            {/* Dải chọn nhanh Preset khi bấm mở */}
            {showPresets && (
              <div className="flex flex-wrap gap-1.5 mt-2 animate-slide-up">
                {TOEIC_SCORE_PRESETS.map((p) => (
                  <button
                    key={p.score}
                    type="button"
                    onClick={() => {
                      onUpdateTargetScore(p.score);
                      setShowPresets(false);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                      targetScore === p.score
                        ? "bg-indigo-600 text-white border-indigo-500"
                        : isDarkMode
                          ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {p.score}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT 2: ĐIỂM CÒN THIẾU (RADIAL PROGRESS GAUGE)                             */}
        {/* ========================================================================= */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border flex flex-col items-center justify-between text-center transition-all ${
            isDarkMode
              ? "bg-[#0e1738]/60 border-indigo-500/15 hover:border-indigo-500/30"
              : "bg-slate-50/80 border-slate-200 hover:border-indigo-300"
          }`}
        >
          {/* Header cột 2 */}
          <div className="w-full text-left">
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              ĐIỂM CÒN THIẾU
            </h3>
          </div>

          {/* Vòng tròn Radial Gauge lớn */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
                <defs>
                  <linearGradient
                    id="metricsGaugeGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="60%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>

                {/* Đường ray nền */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className={isDarkMode ? "stroke-slate-800/90" : "stroke-slate-200"}
                  strokeWidth="11"
                  fill="none"
                />

                {/* Vòng tiến trình phát sáng Gradient */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="url(#metricsGaugeGradient)"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Thông số ở tâm vòng tròn */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl sm:text-4xl font-black text-cyan-400 tracking-tight">
                  +{scoreGap}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                  điểm cần đạt thêm
                </span>
              </div>
            </div>
          </div>

          {/* Footer cột 2: Tỷ lệ hoàn thành */}
          <div className="w-full pt-3 border-t border-slate-800/40">
            <span
              className={`text-xs font-semibold ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              {targetScore > 0
                ? `Hoàn thành ${completionPercentage}% mục tiêu`
                : "Chưa thiết lập mục tiêu"}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT 3: SỐ NGÀY ĐẾN NGÀY THI (EXAM COUNTDOWN)                              */}
        {/* ========================================================================= */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border flex flex-col items-center justify-between text-center transition-all ${
            isDarkMode
              ? "bg-[#0e1738]/60 border-indigo-500/15 hover:border-indigo-500/30"
              : "bg-slate-50/80 border-slate-200 hover:border-indigo-300"
          }`}
        >
          {/* Header cột 3 */}
          <div className="w-full text-left">
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              SỐ NGÀY ĐẾN NGÀY THI
            </h3>
          </div>

          {/* Số ngày đếm ngược lớn ở giữa */}
          <div className="py-4 text-center">
            <div className="text-5xl sm:text-6xl font-black text-emerald-400 tracking-tight">
              {daysLeft}
            </div>
            <span
              className={`text-sm font-bold block mt-1 ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              ngày nữa
            </span>
          </div>

          {/* Footer cột 3: Badge ngày thi & Nút chỉnh ngày */}
          <div className="w-full pt-3 border-t border-slate-800/40 flex flex-col items-center gap-1.5">
            {!isEditingDate ? (
              <>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    isDarkMode
                      ? "bg-slate-900/80 border-slate-800 text-slate-300"
                      : "bg-white border-slate-300 text-slate-700 shadow-sm"
                  }`}
                >
                  <Calendar size={13} className="text-indigo-400" />
                  <span>{formatDisplayDate(examDate)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTempExamDate(examDate);
                    setIsEditingDate(true);
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                >
                  <Edit3 size={11} />
                  <span>Chỉnh ngày thi</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5 w-full animate-slide-up">
                <input
                  type="date"
                  value={tempExamDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setTempExamDate(e.target.value)}
                  className={`flex-1 px-2 py-1 rounded-lg border text-xs font-semibold outline-none ${
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 text-white focus:border-indigo-500"
                      : "bg-white border-slate-300 text-slate-900 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={handleSaveDate}
                  className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  title="Lưu"
                >
                  <Check size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingDate(false)}
                  className="p-1 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                  title="Hủy"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CỘT 4: ĐỘNG LỰC HỌC (STREAK & XP TRỌN ĐỜI)                                */}
        {/* ========================================================================= */}
        <div
          className={`rounded-2xl p-4 sm:p-5 border flex flex-col justify-between transition-all ${
            isDarkMode
              ? "bg-[#0e1738]/60 border-indigo-500/15 hover:border-indigo-500/30"
              : "bg-slate-50/80 border-slate-200 hover:border-indigo-300"
          }`}
        >
          {/* Header cột 4 */}
          <div>
            <h3
              className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              ĐỘNG LỰC HỌC
            </h3>

            {/* Khối 1: Chuỗi ngày Streak */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Flame size={20} className="fill-amber-400 text-amber-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Chuỗi ngày
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
                    {streakDays}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    ngày
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Dài nhất: {longestStreak} ngày
                </span>
              </div>
            </div>

            {/* Đường phân cách nhẹ */}
            <div className="border-t border-slate-800/40 my-3" />

            {/* Khối 2: XP trọn đời */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                <Target size={20} className="text-indigo-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  XP trọn đời
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-cyan-400 tracking-tight">
                    {totalXP}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    XP
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Tích lũy từ khi bắt đầu
                </span>
              </div>
            </div>
          </div>

          {/* Footer cột 4: Huy hiệu cấp độ AI */}
          <div className="mt-3 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs">
            <span className="text-slate-400">Trợ lý AI TOEIC</span>
            <span className="inline-flex items-center gap-1 font-bold text-indigo-400">
              <Sparkles size={11} className="text-cyan-400" />
              <span>Chăm chỉ</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetricsRow;
