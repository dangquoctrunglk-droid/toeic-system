import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../context";
import {
  changePasswordSchema,
  type ChangePasswordSchemaType,
} from "../../../schemas";

interface ChangePasswordTabProps {
  isDarkMode: boolean;
}

export const ChangePasswordTab: React.FC<ChangePasswordTabProps> = ({
  isDarkMode,
}) => {
  const { user } = useAuth();
  const userEmail = user?.email || "dangquoctrunglk@gmail.com";

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ChangePasswordSchemaType) => {
    try {
      console.log(
        "Cập nhật mật khẩu thành công với Zod validation:",
        data.newPassword,
      );
      reset();
      toast.success(
        "Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.",
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi cập nhật mật khẩu";
      toast.error(msg);
    }
  };

  const onError = () => {
    toast.error("Vui lòng kiểm tra lại các trường mật khẩu chưa chính xác!");
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDarkMode
          ? "bg-[#0b1329]/90 border-slate-800 text-slate-100 shadow-xl"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800/40">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
          <Lock size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Đổi mật khẩu bảo vệ</h3>
          <p className="text-xs text-slate-400">
            Cập nhật mật khẩu định kỳ để giữ an toàn cho tài khoản và lộ trình
            học tập của bạn
          </p>
        </div>
      </div>

      {/* Hộp thoại thông tin tài khoản Google OAuth */}
      <div
        className={`mb-6 p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${
          isDarkMode
            ? "bg-indigo-950/20 border-indigo-500/30 text-indigo-300"
            : "bg-indigo-50 border-indigo-200 text-indigo-900"
        }`}
      >
        <KeyRound size={18} className="shrink-0 text-cyan-400 mt-0.5" />
        <div>
          <span className="font-bold">Tài khoản liên kết Google:</span> Bạn đang
          sử dụng đăng nhập an toàn bằng tài khoản Google (
          <strong>{userEmail}</strong>). Bạn có thể đặt thêm mật khẩu độc lập để
          đăng nhập trực tiếp bằng email &amp; mật khẩu bất cứ lúc nào.
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-4 max-w-lg"
        noValidate
      >
        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-400">
            Mật khẩu hiện tại (nếu có)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("currentPassword")}
              placeholder="Nhập mật khẩu hiện tại..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
                isDarkMode
                  ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-400">
            Mật khẩu mới (tối thiểu 8 ký tự, có chữ và số)
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("newPassword")}
            placeholder="Nhập mật khẩu mới..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
              errors.newPassword
                ? "border-rose-500 bg-rose-500/10 text-rose-200"
                : isDarkMode
                  ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
            }`}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{errors.newPassword.message}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-slate-400">
            Xác nhận mật khẩu mới
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Nhập lại mật khẩu mới..."
            className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
              errors.confirmPassword
                ? "border-rose-500 bg-rose-500/10 text-rose-200"
                : isDarkMode
                  ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                  : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle size={13} />
              <span>{errors.confirmPassword.message}</span>
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            <Lock size={15} />
            <span>Cập nhật mật khẩu mới</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
