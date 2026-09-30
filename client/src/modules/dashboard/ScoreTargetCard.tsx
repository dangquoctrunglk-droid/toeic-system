import type React from "react";
import { Target } from "lucide-react";
import { useTheme } from "../../context";
import { TOEIC_SCORE_PRESETS } from "./defaultData";

/**
 * ==============================================================================
 * COMPONENT: ScoreTargetCard.tsx
 * MỤC ĐÍCH: Trực quan hóa tương tác giữa "Điểm thi thử hiện tại" và "Điểm mục tiêu",
 *           đồng thời đo lường "Điểm còn thiếu cần bứt phá" bằng vòng tròn Gradient Radial.
 * THIẾT KẾ ĐỘC ĐÁO & KHÁC BIỆT SO VỚI ẢNH MẪU:
 *   - Ghép thành 1 khối phân tích thông minh liên hoàn (Unified Analytics Card)
 *   - Thanh trượt tiến trình điểm số từ Hiện tại đến Mục tiêu
 *   - Vòng tròn SVG Gradient Neon động đo lường tỷ lệ hoàn thành chặng đường
 *   - Nút chọn nhanh các preset chuẩn ETS không bị đơn điệu
 * ==============================================================================
 */

interface ScoreTargetCardProps {
  currentScore: number;
  targetScore: number;
  onUpdateCurrentScore: (newScore: number) => void;
  onUpdateTargetScore: (newScore: number) => void;
}

export const ScoreTargetCard: React.FC<ScoreTargetCardProps> = ({
  currentScore,
  targetScore,
  onUpdateCurrentScore,
  onUpdateTargetScore,
}) => {
  const { isDarkMode } = useTheme();

  // Khoảng cách điểm cần bứt phá
  const scoreGap = Math.max(0, targetScore - currentScore);

  // Tỷ lệ phần trăm đã đạt (bảo vệ trường hợp targetScore = 0 để tránh NaN)
  const completionPercentage =
    targetScore > 0
      ? Math.min(100, Math.max(0, Math.round((currentScore / targetScore) * 100)))
      : 0;

  // Tính chu vi vòng tròn SVG (bán kính r = 54 -> chu vi = 2 * PI * 54 = ~339.29)
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
        isDarkMode
          ? "bg-[#0b1226]/80 border-indigo-500/20 shadow-xl shadow-indigo-950/30"
          : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
      }`}
    >
      {/* Header của thẻ */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-indigo-400 shrink-0">
            <Target size={18} />
          </div>
          <div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              CHỈ SỐ BỨT PHÁ ĐIỂM SỐ
            </h3>
            <span
              className={`text-[11px] block ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              So sánh điểm thi thử & mục tiêu
            </span>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          +{scoreGap} Điểm
        </span>
      </div>

      {/* THÂN THẺ: TỐI ƯU GỌN GÀNG CHO KHỐI 1 CỘT TRONG HÀNG 3 THẺ */}
      <div className="space-y-3.5 mb-4">
        {/* Hàng 1: 2 ô điểm hiện tại và mục tiêu đặt cạnh nhau */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Ô 1: Điểm thi thử hiện tại */}
          <div
            className={`p-3 rounded-2xl border ${
              isDarkMode
                ? "bg-[#0e1730]/70 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[11px] font-semibold ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Điểm hiện tại
              </span>
              <span className="text-[10px] text-indigo-400 font-bold">Thi thử</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateCurrentScore(Math.max(0, currentScore - 5))}
                className={`w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center transition-colors shrink-0 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                -
              </button>
              <div className="flex-1 relative">
                <input
                  type="number"
                  min={0}
                  max={990}
                  step={5}
                  value={currentScore === 0 ? "" : currentScore}
                  placeholder="0"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateCurrentScore(isNaN(val) ? 0 : Math.min(990, Math.max(0, val)));
                  }}
                  className="w-full text-center py-0.5 px-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-black text-xl text-indigo-400 tracking-tight outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                onClick={() => onUpdateCurrentScore(Math.min(targetScore || 990, (currentScore || 0) + 5))}
                className={`w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center transition-colors shrink-0 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Ô 2: Điểm mục tiêu */}
          <div
            className={`p-3 rounded-2xl border ${
              isDarkMode
                ? "bg-[#0e1730]/70 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-[11px] font-semibold ${
                  isDarkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                Mục tiêu
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">Target</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onUpdateTargetScore(Math.max(currentScore, targetScore - 5))}
                className={`w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center transition-colors shrink-0 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                -
              </button>
              <div className="flex-1 relative">
                <input
                  type="number"
                  min={currentScore || 0}
                  max={990}
                  step={5}
                  value={targetScore === 0 ? "" : targetScore}
                  placeholder="0"
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    onUpdateTargetScore(isNaN(val) ? 0 : Math.min(990, Math.max(0, val)));
                  }}
                  className="w-full text-center py-0.5 px-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 font-black text-xl text-emerald-400 tracking-tight outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="button"
                onClick={() => onUpdateTargetScore(Math.min(990, (targetScore || 0) + 5))}
                className={`w-7 h-7 rounded-lg border text-sm font-bold flex items-center justify-center transition-colors shrink-0 ${
                  isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-sm"
                }`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Hàng 2: Vòng tròn Radial Gauge và Chỉ số bứt phá */}
        <div
          className={`p-3 rounded-2xl border flex items-center gap-3.5 ${
            isDarkMode
              ? "bg-[#0e1730]/50 border-indigo-500/20"
              : "bg-indigo-50/50 border-indigo-100"
          }`}
        >
          {/* Vòng tròn SVG nhỏ gọn */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="scoreGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={isDarkMode ? "stroke-slate-800" : "stroke-slate-200"}
                strokeWidth="11"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#scoreGaugeGradient)"
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] font-black text-cyan-400">
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Thông điệp bứt phá */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-cyan-400">
                +{scoreGap}
              </span>
              <span
                className={`text-xs font-semibold ${
                  isDarkMode ? "text-slate-300" : "text-slate-700"
                }`}
              >
                điểm bứt phá
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5 truncate">
              {targetScore > 0
                ? `Đạt ${completionPercentage}% chặng đường mục tiêu`
                : "Chưa thiết lập điểm mục tiêu"}
            </span>
          </div>
        </div>

        {/* Hàng 3: Mốc preset nhanh chuẩn ETS */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-[11px] font-semibold ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Mốc Preset nhanh:
            </span>
            <span className="text-[10px] text-slate-500">ETS Scale</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {TOEIC_SCORE_PRESETS.map((preset) => (
              <button
                key={preset.score}
                type="button"
                onClick={() => onUpdateTargetScore(preset.score)}
                className={`py-1 rounded-lg text-xs font-bold border transition-all text-center ${
                  targetScore === preset.score
                    ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                    : isDarkMode
                      ? "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {preset.score}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Chú thích lộ trình */}
      <div className="pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-400">
        <span>
          Hoàn thành:{" "}
          <strong className={isDarkMode ? "text-white" : "text-slate-900"}>
            {completionPercentage}%
          </strong>
        </span>
        <span>~{Math.max(1, Math.round(scoreGap / 2.5))} buổi học</span>
      </div>
    </div>
  );
};

export default ScoreTargetCard;
