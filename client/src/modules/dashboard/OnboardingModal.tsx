import type React from "react";
import { useState, useMemo } from "react";
import {
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  X,
  AlertTriangle,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../../context";
import type { UserStudyGoal } from "./types";
import { TOEIC_SCORE_PRESETS, DAILY_STUDY_PRESETS } from "./defaultData";

/**
 * ==============================================================================
 * COMPONENT: OnboardingModal.tsx
 * MỤC ĐÍCH: Hộp thoại Wizard 4 bước BẮT BUỘC khi học viên đăng nhập lần đầu tiên.
 *           Toàn bộ số liệu khởi tạo ban đầu = 0 để học viên tự nhập:
 *           1. Điểm thi thử hiện tại (Current Score: bắt buộc từ 10 - 990)
 *           2. Mục tiêu điểm số TOEIC kỳ vọng (Target Score: bắt buộc >= Current Score)
 *           3. Ngày thi chính thức dự kiến (Exam Date: bắt buộc chọn ngày tương lai)
 *           4. Thời gian cam kết học mỗi ngày (Study Time: bắt buộc > 0 phút)
 * ĐẶC ĐIỂM:
 *   - BẮT BUỘC: Không cho phép bỏ qua hay đóng modal khi chưa hoàn tất lần đầu.
 *   - Tất cả giá trị ban đầu là 0 / rỗng, người dùng có thể nhập trực tiếp bằng bàn phím
 *     hoặc bấm nút tăng giảm, preset chọn nhanh.
 *   - Nút "Tiếp theo" bị vô hiệu hóa kèm cảnh báo rõ ràng nếu người dùng chưa nhập.
 * ==============================================================================
 */

interface OnboardingModalProps {
  /** Trạng thái mở/đóng modal */
  isOpen: boolean;
  /** Dữ liệu mục tiêu ban đầu (nếu có) */
  initialGoal?: UserStudyGoal;
  /** Hàm callback lưu mục tiêu đã chọn */
  onSaveGoal: (updatedGoal: UserStudyGoal) => void;
  /** Hàm callback đóng modal */
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialGoal,
  onSaveGoal,
  onClose,
}) => {
  const { isDarkMode } = useTheme();

  // Kiểm tra xem đây có phải là lần đầu onboarding hay không (chưa hoàn tất)
  const isFirstTime = !initialGoal?.hasCompletedOnboarding;

  // Quản lý bước hiện tại (1 -> 4)
  const [step, setStep] = useState<number>(1);

  // Trạng thái các câu trả lời - KHỞI TẠO BẰNG 0 ĐỂ NGƯỜI DÙNG TỰ NHẬP
  const [currentScore, setCurrentScore] = useState<number>(
    initialGoal?.currentScore ?? 0,
  );
  const [targetScore, setTargetScore] = useState<number>(
    initialGoal?.targetScore ?? 0,
  );
  const [examDate, setExamDate] = useState<string>(initialGoal?.examDate ?? "");
  const [dailyMinutes, setDailyMinutes] = useState<number>(
    initialGoal?.dailyStudyMinutes ?? 0,
  );

  // Hiệu ứng cảnh báo khi người dùng cố tình click ra ngoài lớp phủ
  const [shakePrompt, setShakePrompt] = useState<boolean>(false);

  // Tính số ngày còn lại đến ngày thi qua useMemo
  const daysLeft = useMemo(() => {
    if (!examDate) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const target = new Date(examDate);
      if (isNaN(target.getTime())) return 0;
      target.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - today.getTime();
      return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    } catch {
      return 0;
    }
  }, [examDate]);

  if (!isOpen) return null;

  // Điều kiện kiểm tra tính hợp lệ của từng bước (BẮT BUỘC PHẢI NHẬP)
  const isStep1Valid = currentScore >= 10 && currentScore <= 990;
  const isStep2Valid =
    targetScore >= 10 && targetScore <= 990 && targetScore >= currentScore;
  const isStep3Valid = examDate !== "" && daysLeft >= 0;
  const isStep4Valid = dailyMinutes >= 15 && dailyMinutes <= 480;

  const scoreGap = Math.max(0, targetScore - currentScore);

  // Xử lý khi bấm nút "Kích hoạt Lộ Trình AI"
  const handleComplete = () => {
    if (!isStep1Valid || !isStep2Valid || !isStep3Valid || !isStep4Valid) {
      return;
    }

    const finalGoal: UserStudyGoal = {
      currentScore,
      targetScore,
      examDate,
      dailyStudyMinutes: dailyMinutes,
      hasCompletedOnboarding: true,
      streakDays: initialGoal?.streakDays || 1,
      longestStreak: initialGoal?.longestStreak || 1,
      totalXP: initialGoal?.totalXP || 100,
      level: initialGoal?.level || 1,
    };
    onSaveGoal(finalGoal);
    onClose();
  };

  // Chọn nhanh ngày thi theo khoảng tháng (1, 2, 3, 6 tháng)
  const handleQuickExamDate = (months: number) => {
    const future = new Date();
    future.setMonth(future.getMonth() + months);
    setExamDate(future.toISOString().split("T")[0]);
  };

  // Xử lý khi nhấn vào backdrop bên ngoài modal
  const handleBackdropClick = () => {
    if (isFirstTime) {
      // Nếu là lần đầu: không cho phép đóng, rung lắc nhẹ để báo bắt buộc
      setShakePrompt(true);
      setTimeout(() => setShakePrompt(false), 600);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Lớp phủ hậu cảnh mờ (Backdrop) */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Khung Modal chính (Card Container) */}
      <div
        className={`relative w-full max-w-2xl rounded-3xl p-6 sm:p-9 shadow-2xl transition-all border ${
          shakePrompt ? "animate-shake ring-4 ring-rose-500/50" : ""
        } ${
          isDarkMode
            ? "bg-[#0b1226]/95 border-indigo-500/30 shadow-indigo-950/80 text-slate-100"
            : "bg-white border-slate-200 shadow-2xl shadow-indigo-500/15 text-slate-900"
        } backdrop-blur-xl z-10 animate-modal-card`}
      >
        {/* Nút đóng modal ở góc trên - Chỉ hiển thị khi KHÔNG PHẢI lần đầu */}
        {!isFirstTime ? (
          <button
            type="button"
            onClick={onClose}
            className={`absolute top-5 right-5 p-2 rounded-xl border transition-colors ${
              isDarkMode
                ? "border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60"
                : "border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Đóng"
          >
            <X size={18} />
          </button>
        ) : (
          <div
            className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-400"
            title="Thiết lập bắt buộc lần đầu để tạo lộ trình AI"
          >
            <Lock size={12} />
            <span>Bắt buộc hoàn thành</span>
          </div>
        )}

        {/* Header: Huy hiệu AI Mentor & Tiêu đề */}
        <div className="mb-6">
          <div
            className={`inline-flex items-center gap-2 text-xs font-bold tracking-[1.5px] uppercase px-3.5 py-1.5 rounded-full mb-3 border ${
              isDarkMode
                ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                : "bg-indigo-50 border-indigo-200 text-indigo-700"
            }`}
          >
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>AI ONBOARDING WIZARD 2026</span>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-black tracking-tight leading-snug ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Thiết Lập Lộ Trình{" "}
            <span className="gradient-text">TOEIC Master AI</span>
          </h2>
          <p
            className={`text-sm mt-1.5 ${
              isDarkMode ? "text-slate-400" : "text-slate-600"
            }`}
          >
            Vui lòng nhập 4 thông số mục tiêu để trợ lý AI cá nhân hóa bài tập
            Listening, Reading và dự đoán điểm chính xác.
          </p>
        </div>

        {/* Thanh tiến trình 4 bước (Step Indicator) */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[1, 2, 3, 4].map((stepNumber) => {
            const isActive = step >= stepNumber;
            const isCurrent = step === stepNumber;
            return (
              <div key={stepNumber} className="flex flex-col gap-1">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-sm"
                      : isDarkMode
                        ? "bg-slate-800"
                        : "bg-slate-200"
                  }`}
                />
                <span
                  className={`text-[14px] font-semibold transition-colors ${
                    isCurrent
                      ? "text-indigo-500 font-bold"
                      : isActive
                        ? isDarkMode
                          ? "text-slate-300"
                          : "text-slate-700"
                        : "text-slate-500"
                  }`}
                >
                  {stepNumber === 1 && "1. Điểm hiện tại"}
                  {stepNumber === 2 && "2. Mục tiêu"}
                  {stepNumber === 3 && "3. Ngày thi"}
                  {stepNumber === 4 && "4. Thời gian"}
                </span>
              </div>
            );
          })}
        </div>

        {/* NỘI DUNG TỪNG BƯỚC */}
        <div className="min-h-[290px] flex flex-col justify-center">
          {/* ========================================================================= */}
          {/* BƯỚC 1: ĐIỂM THI THỬ HIỆN TẠI (CURRENT SCORE)                             */}
          {/* ========================================================================= */}
          {step === 1 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label
                  htmlFor="current-score-input"
                  className={`block text-base font-bold mb-1.5 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  1. Điểm thi thử hoặc ước lượng hiện tại của bạn là bao nhiêu?
                </label>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Bắt buộc nhập từ 10 đến 990 điểm. Bạn có thể tự gõ số điểm
                  hoặc chọn mức ước lượng bên dưới.
                </p>
              </div>

              {/* Ô hiển thị số điểm lớn và nhập liệu trực tiếp */}
              <div
                className={`p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${
                  !isStep1Valid
                    ? isDarkMode
                      ? "bg-[#0e1730]/70 border-rose-500/40"
                      : "bg-rose-50/50 border-rose-300"
                    : isDarkMode
                      ? "bg-[#0e1730]/70 border-indigo-500/30"
                      : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentScore((prev) => Math.max(10, prev - 5))
                    }
                    className={`w-11 h-11 rounded-xl text-xl font-bold flex items-center justify-center border transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500 hover:text-white"
                        : "bg-white border-slate-300 text-slate-800 hover:border-indigo-400 shadow-sm"
                    }`}
                  >
                    -
                  </button>

                  <div className="relative">
                    <input
                      id="current-score-input"
                      type="number"
                      min={10}
                      max={990}
                      step={5}
                      value={currentScore === 0 ? "" : currentScore}
                      placeholder="0"
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setCurrentScore(
                          isNaN(val) ? 0 : Math.min(990, Math.max(0, val)),
                        );
                      }}
                      className={`w-36 text-center text-4xl sm:text-5xl font-black tracking-tight py-2 px-3 rounded-xl border outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-900/90 border-indigo-500/30 text-cyan-400 focus:border-cyan-400"
                          : "bg-white border-slate-300 text-indigo-600 focus:border-indigo-500 shadow-sm"
                      }`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentScore((prev) => Math.min(990, (prev || 0) + 5))
                    }
                    className={`w-11 h-11 rounded-xl text-xl font-bold flex items-center justify-center border transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500 hover:text-white"
                        : "bg-white border-slate-300 text-slate-800 hover:border-indigo-400 shadow-sm"
                    }`}
                  >
                    +
                  </button>
                </div>
                <div className="flex">
                  <span
                    className={`block text-[15px] font-semibold mt-1 text-center uppercase tracking-wider ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    / 990 Điểm TOEIC
                  </span>
                </div>

                {/* Hướng dẫn nhập */}
                <div className="text-center sm:text-right">
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-lg ${
                      isStep1Valid
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                    }`}
                  >
                    {isStep1Valid ? "✓ Điểm hợp lệ" : "⚠️ Cần nhập > 0"}
                  </span>
                </div>
              </div>

              {/* Thông báo bắt buộc nếu chưa nhập */}
              {!isStep1Valid && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
                  <AlertTriangle
                    size={15}
                    className="shrink-0 text-amber-400"
                  />
                  <span>
                    <strong>Bắt buộc nhập:</strong> Vui lòng nhập số điểm thi
                    thử hiện tại (10 - 990 điểm) hoặc bấm chọn nhanh mức ước
                    lượng bên dưới.
                  </span>
                </div>
              )}

              {/* Mốc chọn nhanh điểm hiện tại */}
              <div>
                <span
                  className={`text-xs font-bold block mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Hoặc bấm chọn nhanh mức điểm hiện tại:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[250, 350, 450, 550, 650, 750].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setCurrentScore(sc)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        currentScore === sc
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25"
                          : isDarkMode
                            ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {sc} điểm
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BƯỚC 2: MỤC TIÊU ĐIỂM SỐ KỲ VỌNG (TARGET SCORE)                            */}
          {/* ========================================================================= */}
          {step === 2 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label
                  htmlFor="target-score-input"
                  className={`block text-base font-bold mb-1.5 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  2. Mục tiêu điểm số TOEIC bạn muốn chinh phục là bao nhiêu?
                </label>
                <p
                  className={`text-xs ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Bắt buộc nhập điểm mục tiêu (phải lớn hơn hoặc bằng điểm hiện
                  tại {currentScore} điểm).
                </p>
              </div>

              {/* Ô gõ trực tiếp điểm mục tiêu */}
              <div
                className={`p-4 rounded-xl flex items-center justify-between gap-3 border ${
                  isDarkMode
                    ? "bg-[#0e1730]/70 border-indigo-500/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Tự nhập mục tiêu:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    id="target-score-input"
                    type="number"
                    min={Math.max(10, currentScore)}
                    max={990}
                    step={5}
                    value={targetScore === 0 ? "" : targetScore}
                    placeholder="Nhập điểm..."
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setTargetScore(
                        isNaN(val) ? 0 : Math.min(990, Math.max(0, val)),
                      );
                    }}
                    className={`w-40 h-12 text-center text-xl font-semibold py-1.5 px-3 rounded-lg border outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-indigo-500/30 text-purple-400 focus:border-purple-400"
                        : "bg-white border-slate-300 text-indigo-600 focus:border-indigo-500"
                    }`}
                  />
                  <span className="text-xl font-semibold text-slate-400">
                    / 990 Điểm
                  </span>
                </div>
              </div>

              {/* Lưới các bộ preset điểm mục tiêu chuẩn ETS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TOEIC_SCORE_PRESETS.map((preset) => {
                  const isSelected = targetScore === preset.score;
                  const isBelowCurrent =
                    currentScore > 0 && preset.score < currentScore;
                  return (
                    <button
                      key={preset.score}
                      type="button"
                      disabled={isBelowCurrent}
                      onClick={() => setTargetScore(preset.score)}
                      className={`p-3 rounded-xl text-left border transition-all flex items-start gap-3 ${
                        isBelowCurrent
                          ? "opacity-40 cursor-not-allowed bg-slate-900/20 border-slate-800"
                          : isSelected
                            ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/30"
                            : isDarkMode
                              ? "border-slate-800 bg-[#0e1730]/50 hover:border-slate-700 hover:bg-[#0e1730]"
                              : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div
                        className="w-11 h-10 rounded-lg flex items-center justify-center font-bold text-white shrink-0 text-xs shadow-sm"
                        style={{ backgroundColor: preset.color }}
                      >
                        {preset.score}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-md font-bold ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {preset.label}
                          </h4>
                          {isSelected && (
                            <CheckCircle2
                              size={15}
                              className="text-indigo-500 shrink-0"
                            />
                          )}
                        </div>
                        <p
                          className={`text-[12px] mt-0.5 line-clamp-1 ${
                            isDarkMode ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {preset.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Thông báo hợp lệ / không hợp lệ */}
              {!isStep2Valid && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
                  <AlertTriangle
                    size={15}
                    className="shrink-0 text-amber-400"
                  />
                  <span>
                    {targetScore === 0
                      ? "Bắt buộc nhập: Vui lòng chọn hoặc nhập điểm mục tiêu bạn muốn đạt."
                      : `Điểm mục tiêu (${targetScore}) phải lớn hơn hoặc bằng điểm thi thử hiện tại (${currentScore}).`}
                  </span>
                </div>
              )}

              {/* Thẻ hiển thị chênh lệch điểm */}
              {isStep2Valid && (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isDarkMode
                      ? "bg-slate-900/60 border-indigo-500/20 text-slate-300"
                      : "bg-indigo-50/80 border-indigo-200 text-indigo-900"
                  }`}
                >
                  <span className="text-sm">
                    Khoảng cách cần bứt phá: <strong>{currentScore}</strong> →{" "}
                    <strong>{targetScore}</strong>
                  </span>
                  <span className="font-bold text-lg text-cyan-400">
                    +{scoreGap} điểm
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* BƯỚC 3: NGÀY THI CHÍNH THỨC DỰ KIẾN (EXAM DATE)                            */}
          {/* ========================================================================= */}
          {step === 3 && (
            <div className="space-y-5 animate-slide-up">
              <div>
                <label
                  htmlFor="exam-date-input"
                  className={`block text-lg font-bold mb-1.5 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  3. Bạn dự kiến sẽ thi TOEIC vào ngày nào?
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Bắt buộc chọn ngày thi để hệ thống đếm ngược và phân chia thời
                  gian ôn tập theo từng tuần.
                </p>
              </div>

              {/* Ô chọn ngày thi và hiển thị đếm ngược */}
              <div
                className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
                  isDarkMode
                    ? "bg-[#0e1730]/70 border-indigo-500/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="space-y-2 w-full sm:w-auto">
                  <span
                    className={`block text-sm font-semibold ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    Chọn ngày thi trên lịch:
                  </span>
                  <div className="relative">
                    <input
                      id="exam-date-input"
                      type="date"
                      value={examDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setExamDate(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border font-semibold text-sm outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white focus:border-indigo-500"
                          : "bg-white border-slate-300 text-slate-900 focus:border-indigo-500 shadow-sm"
                      }`}
                    />
                  </div>
                </div>

                {/* Thẻ đếm ngược nổi bật */}
                <div className="text-center sm:text-right shrink-0">
                  <div className="text-4xl sm:text-5xl font-black text-cyan-400 tracking-tight">
                    {examDate ? daysLeft : 0}
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider block mt-0.5 ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {examDate
                      ? `Ngày còn lại (~${Math.max(1, Math.round(daysLeft / 7))} tuần)`
                      : "Chưa chọn ngày thi"}
                  </span>
                </div>
              </div>

              {/* Cảnh báo nếu chưa chọn ngày */}
              {!isStep3Valid && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
                  <AlertTriangle
                    size={15}
                    className="shrink-0 text-amber-400"
                  />
                  <span>
                    <strong>Bắt buộc chọn:</strong> Vui lòng chọn ngày thi trên
                    lịch hoặc bấm chọn nhanh mốc thời gian dưới đây.
                  </span>
                </div>
              )}

              {/* Lựa chọn mốc thời gian nhanh */}
              <div>
                <span
                  className={`text-sm font-bold block mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Hoặc bấm chọn nhanh mốc dự kiến:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { label: "1 Tháng nữa", months: 1 },
                    { label: "2 Tháng nữa", months: 2 },
                    { label: "3 Tháng nữa", months: 3 },
                    { label: "6 Tháng nữa", months: 6 },
                  ].map((item) => (
                    <button
                      key={item.months}
                      type="button"
                      onClick={() => handleQuickExamDate(item.months)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                        isDarkMode
                          ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-indigo-500"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* BƯỚC 4: THỜI GIAN CAM KẾT HỌC MỖI NGÀY (DAILY STUDY TIME)                  */}
          {/* ========================================================================= */}
          {step === 4 && (
            <div className="space-y-4 animate-slide-up">
              <div>
                <label
                  htmlFor="daily-minutes-input"
                  className={`block text-lg font-bold mb-1.5 ${
                    isDarkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  4. Mỗi ngày bạn có thể dành bao nhiêu thời gian để học?
                </label>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Bắt buộc chọn thời gian học mỗi ngày (tối thiểu 15 phút).
                </p>
              </div>

              {/* Nhập số phút tùy ý */}
              <div
                className={`p-3.5 rounded-xl flex items-center justify-between gap-3 border ${
                  isDarkMode
                    ? "bg-[#0e1730]/70 border-indigo-500/20"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Hoặc tự nhập số phút/ngày:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    id="daily-minutes-input"
                    type="number"
                    min={15}
                    max={480}
                    step={15}
                    value={dailyMinutes === 0 ? "" : dailyMinutes}
                    placeholder="0"
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setDailyMinutes(
                        isNaN(val) ? 0 : Math.min(480, Math.max(0, val)),
                      );
                    }}
                    className={`w-28 text-center text-lg font-black py-1 px-3 rounded-lg border outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-900 border-indigo-500/30 text-amber-400 focus:border-amber-400"
                        : "bg-white border-slate-300 text-indigo-600 focus:border-indigo-500"
                    }`}
                  />
                  <span className="text-sm font-semibold text-slate-400">
                    phút/ngày
                  </span>
                </div>
              </div>

              {/* Danh sách các mốc thời gian */}
              <div className="space-y-2">
                {DAILY_STUDY_PRESETS.map((item) => {
                  const isSelected = dailyMinutes === item.minutes;
                  return (
                    <button
                      key={item.minutes}
                      type="button"
                      onClick={() => setDailyMinutes(item.minutes)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30"
                          : isDarkMode
                            ? "border-slate-800 bg-[#0e1730]/50 hover:border-slate-700"
                            : "border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? "bg-indigo-600 text-white"
                              : isDarkMode
                                ? "bg-slate-800 text-slate-300"
                                : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          <Clock size={15} />
                        </div>
                        <div className="text-left">
                          <span
                            className={`text-xs font-bold block ${
                              isDarkMode ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span
                            className={`text-[11px] ${
                              isDarkMode ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {item.desc}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.isRecommended && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Khuyên dùng
                          </span>
                        )}
                        {isSelected && (
                          <CheckCircle2 size={16} className="text-indigo-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Thông báo bắt buộc nếu chưa chọn thời gian */}
              {!isStep4Valid && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs">
                  <AlertTriangle
                    size={15}
                    className="shrink-0 text-amber-400"
                  />
                  <span>
                    <strong>Bắt buộc chọn:</strong> Vui lòng chọn hoặc nhập thời
                    gian bạn cam kết học mỗi ngày (tối thiểu 15 phút).
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* NÚT ĐIỀU HƯỚNG BƯỚC (FOOTER ACTIONS) */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                isDarkMode
                  ? "border-slate-800 text-slate-300 hover:bg-slate-800/60"
                  : "border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Quay lại
            </button>
          ) : isFirstTime ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium">
              <ShieldCheck size={14} />
              <span>Bước 1 / 4 (Bắt buộc thiết lập)</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDarkMode
                  ? "border-slate-800 text-slate-400 hover:bg-slate-800"
                  : "border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              Hủy bỏ
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              disabled={
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
              }
              onClick={() => setStep((prev) => prev + 1)}
              className={`inline-flex items-center gap-2 font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all ${
                (step === 1 && !isStep1Valid) ||
                (step === 2 && !isStep2Valid) ||
                (step === 3 && !isStep3Valid)
                  ? "opacity-40 cursor-not-allowed bg-slate-700 text-slate-400 shadow-none"
                  : "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
              }`}
            >
              <span>Tiếp theo</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              disabled={!isStep4Valid}
              onClick={handleComplete}
              className={`inline-flex items-center gap-2 font-bold text-sm px-7 py-3 rounded-xl shadow-lg transition-all ${
                !isStep4Valid
                  ? "opacity-40 cursor-not-allowed bg-slate-700 text-slate-400 shadow-none"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
              }`}
            >
              <CheckCircle2 size={17} />
              <span>Hoàn tất & Bắt đầu </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
