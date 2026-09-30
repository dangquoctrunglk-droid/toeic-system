import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  RotateCw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { AuthModalShell } from "../../components/auth/AuthModalShell";
import { AuthMarketingBanner } from "../../components/auth/AuthMarketingBanner";
import { authService } from "../../services/authService";
import { getErrorMessage } from "../../utils/errorHandler";

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSwitchToSignin?: () => void;
}

interface Step1FormData {
  email: string;
}

interface Step3FormData {
  newPassword: string;
  confirmPassword: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  onSwitchToSignin,
}: ForgotPasswordModalProps) {
  const navigate = useNavigate();

  // 3 bước chuẩn workflow:
  // Bước 1: Nhập email gửi OTP
  // Bước 2: Nhập & Xác thực OTP 6 số
  // Bước 3: Tạo mật khẩu mới & Đăng nhập
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [targetEmail, setTargetEmail] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [verifiedOtp, setVerifiedOtp] = useState<string>("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Bộ đếm gửi lại mã OTP (60s)
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isResending, setIsResending] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Ẩn / hiện mật khẩu bước 3
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs cho 6 ô nhập mã OTP
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Form Bước 1: Nhập Email
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errors1, isSubmitting: isSubmitting1 },
  } = useForm<Step1FormData>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  // Form Bước 3: Nhập Mật khẩu mới
  const {
    register: registerStep3,
    handleSubmit: handleSubmitStep3,
    getValues: getValuesStep3,
    formState: { errors: errors3, isSubmitting: isSubmitting3 },
  } = useForm<Step3FormData>({
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  // Đếm ngược thời gian gửi lại mã
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Tự động focus vào ô OTP đầu tiên khi chuyển sang Bước 2
  useEffect(() => {
    if (step === 2) {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  const handleGoToSignin = () => {
    if (onSwitchToSignin) {
      onSwitchToSignin();
    } else {
      navigate("/auth/signin");
    }
  };

  // =========================================================
  // BƯỚC 1: Gửi yêu cầu OTP qua Email
  // =========================================================
  const onSubmitStep1 = async (data: Step1FormData) => {
    try {
      setServerError(null);
      setSuccessMsg(null);

      const res = await authService.forgotPassword(data.email);
      setTargetEmail(data.email);

      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }

      setSuccessMsg(
        res.message || "Mã xác thực OTP 6 số đã được gửi đến email của bạn.",
      );
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      setStep(2);
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(
          err,
          "Không thể gửi yêu cầu lấy lại mật khẩu. Vui lòng kiểm tra lại email!",
        ),
      );
    }
  };

  // Gửi lại mã OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || !targetEmail || isResending) return;
    try {
      setIsResending(true);
      setServerError(null);
      setSuccessMsg(null);

      const res = await authService.forgotPassword(targetEmail);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setSuccessMsg(
        res.message || "Mã OTP mới đã được gửi lại vào email của bạn.",
      );
      setResendCountdown(60);
      setOtpDigits(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(err, "Không thể gửi lại mã OTP. Vui lòng thử lại sau!"),
      );
    } finally {
      setIsResending(false);
    }
  };

  // Xử lý khi gõ OTP
  const handleOtpChange = (index: number, value: string) => {
    const cleanDigit = value.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanDigit;
    setOtpDigits(newDigits);

    // Tự nhảy sang ô tiếp theo
    if (cleanDigit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || "";
    }
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  // =========================================================
  // BƯỚC 2: Xác thực mã OTP
  // =========================================================
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join("");
    if (fullOtp.length !== 6) {
      setServerError("Vui lòng nhập đầy đủ mã OTP gồm 6 chữ số!");
      return;
    }

    try {
      setIsVerifyingOtp(true);
      setServerError(null);
      setSuccessMsg(null);

      const res = await authService.verifyOtp(targetEmail, fullOtp);
      setVerifiedOtp(fullOtp);
      setSuccessMsg(
        res.message || "Xác thực OTP thành công! Vui lòng tạo mật khẩu mới.",
      );
      setStep(3);
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(
          err,
          "Mã OTP không chính xác hoặc đã hết hạn. Vui lòng kiểm tra lại!",
        ),
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // =========================================================
  // BƯỚC 3: Tạo mật khẩu mới & Đăng nhập
  // =========================================================
  const onSubmitStep3 = async (data: Step3FormData) => {
    if (!verifiedOtp) {
      setServerError(
        "Phiên xác thực đã hết hạn. Vui lòng thao tác lại từ đầu!",
      );
      setStep(1);
      return;
    }

    try {
      setServerError(null);
      setSuccessMsg(null);

      const res = await authService.resetPassword({
        email: targetEmail,
        otp: verifiedOtp,
        newPassword: data.newPassword,
      });

      alert(
        res.message ||
          "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.",
      );
      if (onClose) onClose();
      handleGoToSignin();
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(err, "Đặt lại mật khẩu thất bại. Vui lòng thử lại!"),
      );
    }
  };

  return (
    <AuthModalShell isOpen={isOpen} onClose={onClose}>
      {/* CỘT TRÁI: FORM QUÊN MẬT KHẨU (ĐỒNG BỘ LAYOUT SIGNIN/SIGNUP) */}
      <div className="lg:col-span-6 xl:col-span-5 bg-[#0a1124] border-b lg:border-b-0 lg:border-r border-indigo-500/15 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-slate-200 overflow-y-auto max-h-[92vh]">
        <div>
          {/* Logo & Tên thương hiệu TOEICMaster AI */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white">
                  TOEIC<span className="text-indigo-400">Master</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
                ETS PREP PLATFORM
              </span>
            </div>
          </div>

          {/* Thanh chỉ báo bước tiến độ (Progress Stepper) */}
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step === 1
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/50"
                    : "bg-indigo-950 text-indigo-300 border border-indigo-500/40"
                }`}
              >
                1
              </span>
              <span
                className={`text-xs font-semibold ${step === 1 ? "text-white" : "text-slate-400"}`}
              >
                Gửi OTP
              </span>
            </div>
            <div className="w-8 h-0.5 bg-slate-800" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step === 2
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/50"
                    : step > 2
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-slate-800 text-slate-500"
                }`}
              >
                {step > 2 ? "✓" : "2"}
              </span>
              <span
                className={`text-xs font-semibold ${step === 2 ? "text-white" : "text-slate-400"}`}
              >
                Xác thực
              </span>
            </div>
            <div className="w-8 h-0.5 bg-slate-800" />
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  step === 3
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/50"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                3
              </span>
              <span
                className={`text-xs font-semibold ${step === 3 ? "text-white" : "text-slate-400"}`}
              >
                Mật khẩu mới
              </span>
            </div>
          </div>

          {/* Tiêu đề & Lời chào theo từng bước */}
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              {step === 1 && "Quên mật khẩu"}
              {step === 2 && "Xác thực OTP"}
              {step === 3 && "Tạo mật khẩu mới"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {step === 1 &&
                "Nhập email của bạn để nhận mã OTP 6 số khôi phục tài khoản."}
              {step === 2 &&
                "Nhập mã OTP 6 số vừa gửi tới email để tiến hành xác thực tài khoản."}
              {step === 3 &&
                "Thiết lập mật khẩu mới có ít nhất 6 ký tự để bảo vệ tài khoản."}
            </p>
          </div>

          {/* Thông báo lỗi / thành công */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 size={15} className="shrink-0 text-indigo-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================= */}
          {/* BƯỚC 1: FORM NHẬP EMAIL                                */}
          {/* ======================================================= */}
          {step === 1 && (
            <form
              onSubmit={handleSubmitStep1(onSubmitStep1)}
              className="space-y-4"
              noValidate
              autoComplete="off"
            >
              {/* Địa chỉ Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    autoComplete="off"
                    placeholder="you@example.com"
                    {...registerStep1("email", {
                      required: "Vui lòng nhập địa chỉ email",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Địa chỉ email không hợp lệ",
                      },
                    })}
                    className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                      errors1.email
                        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700/70 focus:border-indigo-400 focus:ring-indigo-500/20"
                    }`}
                  />
                  <Mail
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
                {errors1.email && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle size={12} />
                    <span>{errors1.email.message}</span>
                  </p>
                )}
              </div>

              {/* Nút gửi mã OTP */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting1}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting1
                      ? "Đang gửi mã OTP..."
                      : "Gửi mã xác thực OTP"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* BƯỚC 2: NHẬP VÀ XÁC THỰC OTP 6 SỐ                     */}
          {/* ======================================================= */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-4"
              noValidate
              autoComplete="off"
            >
              {/* Badge email nhận mã */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-400">
                  Gửi tới:{" "}
                  <strong className="text-slate-200">{targetEmail}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-indigo-400 hover:text-indigo-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={11} />
                  <span>Đổi email</span>
                </button>
              </div>

              {/* Gợi ý OTP trong chế độ Dev */}
              {devOtpHint && (
                <div
                  onClick={() => {
                    const digits = devOtpHint.split("").slice(0, 6);
                    setOtpDigits(digits);
                  }}
                  className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between cursor-pointer hover:bg-indigo-500/25 transition-all"
                  title="Bấm để tự động điền mã OTP"
                >
                  <span className="flex items-center gap-1.5">
                    <KeyRound size={13} className="text-indigo-400" />
                    <span>
                      Mã OTP test:{" "}
                      <strong className="font-mono text-white text-sm tracking-wider">
                        {devOtpHint}
                      </strong>
                    </span>
                  </span>
                  <span className="text-[10px] underline font-semibold">
                    Tự điền
                  </span>
                </div>
              )}

              {/* 6 ô nhập mã OTP */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Mã xác thực OTP (6 chữ số)
                  </label>
                  {resendCountdown > 0 ? (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Gửi lại sau {resendCountdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCw
                        size={11}
                        className={isResending ? "animate-spin" : ""}
                      />
                      <span>Gửi lại mã</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="w-full h-12 text-center text-lg font-bold bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:bg-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Nút xác thực OTP */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <ShieldCheck size={16} />
                  <span>
                    {isVerifyingOtp ? "Đang xác thực..." : "Xác thực mã OTP"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* BƯỚC 3: TẠO MẬT KHẨU MỚI & XÁC NHẬN                    */}
          {/* ======================================================= */}
          {step === 3 && (
            <form
              onSubmit={handleSubmitStep3(onSubmitStep3)}
              className="space-y-4"
              noValidate
              autoComplete="off"
            >
              {/* Thông tin tài khoản đã xác thực */}
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-400">
                  Tài khoản:{" "}
                  <strong className="text-slate-200">{targetEmail}</strong>
                </span>
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>Đã xác thực OTP</span>
                </span>
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Tối thiểu 6 ký tự"
                    {...registerStep3("newPassword", {
                      required: "Vui lòng nhập mật khẩu mới",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                      errors3.newPassword
                        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700/70 focus:border-indigo-400 focus:ring-indigo-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors3.newPassword && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <Lock size={12} />
                    <span>{errors3.newPassword.message}</span>
                  </p>
                )}
              </div>

              {/* Xác nhận lại mật khẩu mới */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Xác nhận lại mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu mới"
                    {...registerStep3("confirmPassword", {
                      required: "Vui lòng xác nhận lại mật khẩu",
                      validate: (value) =>
                        value === getValuesStep3("newPassword") ||
                        "Mật khẩu xác nhận không trùng khớp!",
                    })}
                    className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                      errors3.confirmPassword
                        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700/70 focus:border-indigo-400 focus:ring-indigo-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors3.confirmPassword && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <Lock size={12} />
                    <span>{errors3.confirmPassword.message}</span>
                  </p>
                )}
              </div>

              {/* Nút hoàn tất đổi mật khẩu */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting3}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting3
                      ? "Đang xử lý..."
                      : "Đặt lại mật khẩu & Đăng nhập"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Nút chuyển đổi sang Đăng nhập */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>
            Bạn đã nhớ lại mật khẩu?{" "}
            <button
              type="button"
              onClick={handleGoToSignin}
              className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: BANNER NGHỆ THUẬT (ĐỒNG BỘ 100% VỚI MODAL ĐĂNG NHẬP) */}
      <AuthMarketingBanner />
    </AuthModalShell>
  );
}

export default ForgotPasswordModal;
