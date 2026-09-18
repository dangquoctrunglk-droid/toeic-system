import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { AuthModalShell } from "./components/AuthModalShell";
import { AuthMarketingBanner } from "./components/AuthMarketingBanner";
import { authService } from "../../services/authService";

export interface SigninFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SigninModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSwitchToSignup?: () => void;
}

export function SigninModal({
  isOpen = true,
  onClose,
  onSwitchToSignup,
}: SigninModalProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: SigninFormData) => {
    try {
      setServerError(null);
      await authService.login(
        {
          email: data.email,
          password: data.password,
        },
        Boolean(data.rememberMe),
      );
      alert("Đăng nhập thành công!");
      if (onClose) onClose();
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
      const message =
        errorResponse.response?.data?.message ||
        errorResponse.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      setServerError(message);
    }
  };

  const handleGoToSignup = () => {
    if (onSwitchToSignup) {
      onSwitchToSignup();
    } else {
      navigate("/auth/register");
    }
  };

  return (
    <AuthModalShell isOpen={isOpen} onClose={onClose}>
      {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
      <div className="lg:col-span-6 xl:col-span-5 bg-[#0a1124] border-b lg:border-b-0 lg:border-r border-indigo-500/15 p-7 sm:p-10 lg:p-12 flex flex-col justify-between text-slate-200">
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

          {/* Tiêu đề & Lời chào */}
          <div className="mb-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
              Đăng nhập
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Chào mừng bạn quay lại hệ thống ôn luyện TOEIC cá nhân hóa.
            </p>
          </div>

          {/* Hiển thị lỗi từ máy chủ nếu có */}
          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Biểu mẫu đăng nhập (React Hook Form) */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Ô nhập địa chỉ Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Vui lòng nhập địa chỉ email",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Địa chỉ email không hợp lệ",
                    },
                  })}
                  className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                    errors.email
                      ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-700/70 focus:border-indigo-400 focus:ring-indigo-500/20"
                  }`}
                />
                <Mail
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle size={12} />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Ô nhập Mật khẩu */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Mật khẩu
                </label>
                <a
                  href="#forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Chức năng khôi phục mật khẩu đang được xử lý.");
                  }}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu của bạn"
                  {...register("password", {
                    required: "Vui lòng nhập mật khẩu",
                    minLength: {
                      value: 6,
                      message: "Mật khẩu tối thiểu 6 ký tự",
                    },
                  })}
                  className={`w-full pl-4 pr-10 py-2.5 text-sm bg-slate-900/80 border rounded-xl hover:border-slate-600 focus:bg-slate-900 focus:outline-none focus:ring-2 text-white placeholder-slate-500 transition-all ${
                    errors.password
                      ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-700/70 focus:border-indigo-400 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label="Ẩn/hiện mật khẩu"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                  <Lock size={12} />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Hộp kiểm Ghi nhớ đăng nhập */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="signin-keep-logged-in"
                type="checkbox"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500/30 cursor-pointer accent-indigo-500"
              />
              <label
                htmlFor="signin-keep-logged-in"
                className="text-xs font-medium text-slate-300 cursor-pointer select-none"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Nút gửi biểu mẫu */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? "Đang xử lý..." : "Đăng nhập"}</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </form>

          {/* Nút đăng nhập nhanh bằng Google */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => alert("Đăng nhập với Google")}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer hover:shadow-indigo-500/10"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Tiếp tục với Google</span>
            </button>
          </div>
        </div>

        {/* Nút chuyển đổi sang Đăng ký */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>
            Chưa có tài khoản?{" "}
            <button
              type="button"
              onClick={handleGoToSignup}
              className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
            >
              Đăng ký ngay
            </button>
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: BANNER NGHỆ THUẬT */}
      <AuthMarketingBanner />
    </AuthModalShell>
  );
}

export { SigninModal as LoginModal };
export default SigninModal;
