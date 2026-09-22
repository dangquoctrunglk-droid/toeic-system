import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { AuthModalShell } from "./components/AuthModalShell";
import { AuthMarketingBanner } from "./components/AuthMarketingBanner";
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

interface Step2FormData {
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  onSwitchToSignin,
}: ForgotPasswordModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [targetEmail, setTargetEmail] = useState<string>("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Bước 1: Nhập Email
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errors1, isSubmitting: isSubmitting1 },
  } = useForm<Step1FormData>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  // Form Bước 2: Nhập OTP & Mật khẩu mới
  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    getValues: getValuesStep2,
    formState: { errors: errors2, isSubmitting: isSubmitting2 },
  } = useForm<Step2FormData>({
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
    mode: "onBlur",
  });

  const onSubmitStep1 = async (data: Step1FormData) => {
    try {
      setServerError(null);
      setSuccessMsg(null);
      const res = await authService.forgotPassword(data.email);
      setTargetEmail(data.email);
      if (res.devOtp) {
        setDevOtpHint(res.devOtp);
      }
      setSuccessMsg(res.message || "Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(
          err,
          "Không thể gửi yêu cầu quên mật khẩu. Vui lòng thử lại!",
        ),
      );
    }
  };

  const onSubmitStep2 = async (data: Step2FormData) => {
    try {
      setServerError(null);
      setSuccessMsg(null);
      const res = await authService.resetPassword({
        email: targetEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      alert(res.message || "Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
      handleGoToSignin();
    } catch (err: unknown) {
      setServerError(
        getErrorMessage(
          err,
          "Đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại mã OTP!",
        ),
      );
    }
  };

  const handleGoToSignin = () => {
    if (onSwitchToSignin) {
      onSwitchToSignin();
    } else {
      navigate("/auth/signin");
    }
  };

  return (
    <AuthModalShell isOpen={isOpen} onClose={onClose}>
      {/* CỘT TRÁI: FORM QUÊN MẬT KHẨU */}
      <div className="lg:col-span-6 xl:col-span-5 bg-[#0a1124] border-b lg:border-b-0 lg:border-r border-indigo-500/15 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-slate-200 overflow-y-auto max-h-[92vh]">
        <div>
          {/* Logo & Tên thương hiệu */}
          <div className="flex items-center gap-2.5 mb-6">
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

          {/* Tiêu đề */}
          <div className="mb-5">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-2">
              <KeyRound size={26} className="text-indigo-400" />
              <span>{step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu"}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {step === 1
                ? "Nhập email của bạn, chúng tôi sẽ gửi mã OTP 6 số để xác thực tài khoản."
                : `Nhập mã xác thực đã gửi cho ${targetEmail} và tạo mật khẩu mới.`}
            </p>
          </div>

          {/* Thông báo lỗi nếu có */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Thông báo thành công / gợi ý dev OTP */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {devOtpHint && step === 2 && (
            <div className="mb-4 p-3 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-400" />
                <span>Mã OTP Dev Test:</span>
              </div>
              <span className="font-mono font-bold tracking-widest text-sm text-amber-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30">
                {devOtpHint}
              </span>
            </div>
          )}

          {/* BƯỚC 1: NHẬP EMAIL */}
          {step === 1 && (
            <form
              onSubmit={handleSubmitStep1(onSubmitStep1)}
              className="space-y-4"
              noValidate
              autoComplete="off"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Địa chỉ Email tài khoản
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting1}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting1 ? "Đang gửi mã..." : "Gửi mã xác thực OTP"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          )}

          {/* BƯỚC 2: NHẬP MÃ OTP & MẬT KHẨU MỚI */}
          {step === 2 && (
            <form
              onSubmit={handleSubmitStep2(onSubmitStep2)}
              className="space-y-3.5"
              noValidate
              autoComplete="off"
            >
              {/* Mã OTP */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Mã xác thực OTP (6 chữ số)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="VD: 123456"
                    {...registerStep2("otp", {
                      required: "Vui lòng nhập mã OTP",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Mã OTP phải gồm đúng 6 chữ số",
                      },
                    })}
                    className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white font-mono tracking-wider placeholder-slate-500 transition-all ${
                      errors2.otp
                        ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-700/70 focus:border-indigo-400 focus:ring-indigo-500/20"
                    }`}
                  />
                  <KeyRound
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
                {errors2.otp && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                    <AlertCircle size={12} />
                    <span>{errors2.otp.message}</span>
                  </p>
                )}
              </div>

              {/* Mật khẩu mới */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Tối thiểu 6 ký tự"
                    {...registerStep2("newPassword", {
                      required: "Vui lòng nhập mật khẩu mới",
                      minLength: {
                        value: 6,
                        message: "Mật khẩu phải có ít nhất 6 ký tự",
                      },
                    })}
                    className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                      errors2.newPassword
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
                {errors2.newPassword && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                    <Lock size={12} />
                    <span>{errors2.newPassword.message}</span>
                  </p>
                )}
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Xác nhận lại mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu mới"
                    {...registerStep2("confirmPassword", {
                      required: "Vui lòng xác nhận mật khẩu",
                      validate: (value) =>
                        value === getValuesStep2("newPassword") ||
                        "Mật khẩu xác nhận không khớp!",
                    })}
                    className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                      errors2.confirmPassword
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
                {errors2.confirmPassword && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-0.5">
                    <Lock size={12} />
                    <span>{errors2.confirmPassword.message}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting2}
                  className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>
                    {isSubmitting2 ? "Đang xử lý..." : "Xác nhận & Đổi mật khẩu"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-200 py-1 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Quay lại đổi email khác</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Nút chuyển về Đăng nhập */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>
            Nhớ ra mật khẩu?{" "}
            <button
              type="button"
              onClick={handleGoToSignin}
              className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Đăng nhập ngay</span>
            </button>
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: BANNER NGHỆ THUẬT */}
      <AuthMarketingBanner />
    </AuthModalShell>
  );
}

export default ForgotPasswordModal;
