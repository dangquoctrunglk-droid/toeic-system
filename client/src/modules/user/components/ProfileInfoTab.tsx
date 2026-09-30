import type React from "react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  ShieldCheck,
  Crown,
  Flame,
  Zap,
  Target,
  Sliders,
  Save,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../../context";
import type { UserStudyGoal } from "../../dashboard/types";
import {
  TOEIC_SCORE_PRESETS,
  DAILY_STUDY_PRESETS,
} from "../../dashboard/defaultData";
import {
  profileInfoSchema,
  type ProfileInfoSchemaType,
} from "../../../schemas";

interface ProfileInfoTabProps {
  goal: UserStudyGoal;
  onSaveGoal: (newGoal: UserStudyGoal) => void;
  onOpenGoalModal?: () => void;
  isDarkMode: boolean;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  goal,
  onSaveGoal,
  onOpenGoalModal,
  isDarkMode,
}) => {
  const { user, setUser } = useAuth();
  const userEmail = user?.email || "dangquoctrunglk@gmail.com";

  // Đọc thông tin cá nhân đã lưu từ LocalStorage nếu có
  const savedExtra = useMemo(() => {
    try {
      const raw = localStorage.getItem(`toeic_user_profile_${userEmail}`);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore
    }
    return null;
  }, [userEmail]);

  const initialFullName =
    savedExtra?.fullName ||
    user?.fullName ||
    user?.fullname ||
    user?.email?.split("@")[0] ||
    "Trung Đặng";

  // Khởi tạo react-hook-form với Zod Schema Validation
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInfoSchemaType>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      fullName: initialFullName,
      phoneNumber: savedExtra?.phoneNumber || "",
      birthDate: savedExtra?.birthDate || "",
      gender: savedExtra?.gender || "male",
      currentScore: goal.currentScore || 450,
      targetScore: goal.targetScore || 750,
      examDate: goal.examDate || "2026-11-20",
      dailyMinutes: goal.dailyStudyMinutes || 60,
    },
  });

  const watchedFullName =
    useWatch({ control, name: "fullName" }) || initialFullName;
  const watchedTargetScore =
    useWatch({ control, name: "targetScore" }) ?? goal.targetScore ?? 750;
  const watchedDailyMinutes =
    useWatch({ control, name: "dailyMinutes" }) ?? goal.dailyStudyMinutes ?? 60;
  const initial = (watchedFullName.charAt(0) || "T").toUpperCase();

  const onSubmit = (data: ProfileInfoSchemaType) => {
    const updatedGoal: UserStudyGoal = {
      ...goal,
      currentScore: data.currentScore,
      targetScore: data.targetScore,
      examDate: data.examDate || "",
      dailyStudyMinutes: data.dailyMinutes,
    };
    onSaveGoal(updatedGoal);

    try {
      const extraProfile = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber || "",
        birthDate: data.birthDate || "",
        gender: data.gender,
      };
      localStorage.setItem(
        `toeic_user_profile_${userEmail}`,
        JSON.stringify(extraProfile),
      );

      // Cập nhật người dùng trong Context và LocalStorage để thanh Navbar hiển thị tên mới
      if (user) {
        const updatedUser = {
          ...user,
          fullName: data.fullName,
          fullname: data.fullName,
          name: data.fullName,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch {
      // ignore
    }

    // Cập nhật giá trị mặc định mới cho form để không bị revert
    reset(data);

    toast.success("Đã lưu và cập nhật thông tin hồ sơ của bạn thành công!");
  };

  const onError = (formErrors: typeof errors) => {
    console.warn("Validation errors in ProfileInfoTab:", formErrors);
    toast.error("Vui lòng kiểm tra lại các trường thông tin chưa hợp lệ!");
  };

  return (
    <div className="space-y-6">

      {/* Thẻ Hero Tổng quan hồ sơ */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border transition-all relative overflow-hidden ${
          isDarkMode
            ? "bg-gradient-to-r from-[#0d1633] via-[#091024] to-[#121430] border-indigo-500/25 shadow-xl shadow-indigo-950/20"
            : "bg-gradient-to-r from-purple-50/70 via-indigo-50/50 to-white border-indigo-200/80 shadow-md"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
          {/* Avatar viền đôi phát sáng */}
          <div className="relative group shrink-0">
            <div
              className={`w-20 h-20 rounded-full p-[2.5px] border-2 transition-all flex items-center justify-center shadow-lg ${
                isDarkMode
                  ? "border-indigo-500/60 bg-[#080d1c] shadow-indigo-950/60"
                  : "border-indigo-400 bg-white shadow-indigo-200"
              }`}
            >
              <div
                className={`w-full h-full rounded-full flex items-center justify-center font-black text-2xl select-none ${
                  isDarkMode
                    ? "bg-[#132247] text-cyan-400"
                    : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white"
                }`}
              >
                {initial}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white border-2 border-[#091024] shadow-sm">
              <ShieldCheck size={13} />
            </div>
          </div>

          {/* Thông tin chính */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-sm">
                <Crown size={12} className="fill-slate-950" />
                <span>PRO MEMBER</span>
              </span>

              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                Đã xác thực
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mb-3.5 flex items-center justify-center sm:justify-start gap-2">
              <Mail size={13} />
              <span>{userEmail}</span>
            </p>

            {/* Chỉ số nhanh */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <div
                className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  isDarkMode
                    ? "bg-slate-900/80 border-amber-500/30 text-amber-400"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                <Flame size={13} className="fill-amber-400" />
                <span>Streak: {goal.streakDays} ngày</span>
              </div>

              <div
                className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  isDarkMode
                    ? "bg-slate-900/80 border-cyan-500/30 text-cyan-300"
                    : "bg-cyan-50 border-cyan-200 text-cyan-800"
                }`}
              >
                <Zap size={13} className="fill-cyan-400" />
                <span>{goal.totalXP} AI XP</span>
              </div>

              <div
                className={`px-3 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                  isDarkMode
                    ? "bg-slate-900/80 border-indigo-500/30 text-indigo-300"
                    : "bg-indigo-50 border-indigo-200 text-indigo-800"
                }`}
              >
                <Target size={13} className="text-indigo-400" />
                <span>Mục tiêu: {watchedTargetScore} TOEIC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Thông tin cá nhân & Kế hoạch học tập với Zod Schema */}
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="space-y-6"
        noValidate
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CỘT 1: THÔNG TIN CÁ NHÂN */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDarkMode
                ? "bg-[#0b1329]/90 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-900 shadow-sm"
            }`}
          >
            <div className="flex items-center gap-2 pb-3.5 mb-4 border-b border-slate-800/40">
              <User size={17} className="text-cyan-400" />
              <h3 className="font-bold text-sm sm:text-base">
                Thông tin cá nhân
              </h3>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1 text-slate-400">
                  Họ và tên
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  placeholder="Nhập họ và tên..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
                    errors.fullName
                      ? "border-rose-500 bg-rose-500/10 text-rose-200"
                      : isDarkMode
                        ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.fullName.message}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-400">
                  Địa chỉ Email (Google Account)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={userEmail}
                    disabled
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium opacity-80 cursor-not-allowed ${
                      isDarkMode
                        ? "bg-slate-900/50 border-slate-800 text-slate-400"
                        : "bg-slate-100 border-slate-200 text-slate-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-400">
                  Số điện thoại liên hệ
                </label>
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="0912 345 678"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
                    errors.phoneNumber
                      ? "border-rose-500 bg-rose-500/10 text-rose-200"
                      : isDarkMode
                        ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.phoneNumber.message}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-400">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    {...register("birthDate")}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
                      errors.birthDate
                        ? "border-rose-500 bg-rose-500/10 text-rose-200"
                        : isDarkMode
                          ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                          : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{errors.birthDate.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-400">
                    Giới tính
                  </label>
                  <select
                    {...register("gender")}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
                      isDarkMode
                        ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
                    }`}
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* CỘT 2: MỤC TIÊU & LỘ TRÌNH TOEIC ETS */}
          <div
            className={`p-6 rounded-3xl border transition-all ${
              isDarkMode
                ? "bg-[#0b1329]/90 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-900 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800/40">
              <div className="flex items-center gap-2">
                <Target size={17} className="text-indigo-400" />
                <h3 className="font-bold text-sm sm:text-base">
                  Mục tiêu &amp; Kế hoạch TOEIC
                </h3>
              </div>
              {onOpenGoalModal && (
                <button
                  type="button"
                  onClick={onOpenGoalModal}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Sliders size={12} />
                  <span>Chi tiết</span>
                </button>
              )}
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-400">
                    Điểm thi thử hiện tại
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={990}
                    step={5}
                    {...register("currentScore", { valueAsNumber: true })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-base font-black text-indigo-400 transition-all outline-none ${
                      errors.currentScore
                        ? "border-rose-500 bg-rose-500/10"
                        : isDarkMode
                          ? "bg-slate-900/80 border-slate-700 focus:border-cyan-400"
                          : "bg-slate-50 border-slate-200 focus:border-indigo-600 focus:bg-white"
                    }`}
                  />
                  {errors.currentScore && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{errors.currentScore.message}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-400">
                    Mục tiêu kỳ vọng
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={990}
                    step={5}
                    {...register("targetScore", { valueAsNumber: true })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-base font-black text-cyan-400 transition-all outline-none ${
                      errors.targetScore
                        ? "border-rose-500 bg-rose-500/10"
                        : isDarkMode
                          ? "bg-slate-900/80 border-slate-700 focus:border-cyan-400"
                          : "bg-slate-50 border-slate-200 focus:border-cyan-600 focus:bg-white"
                    }`}
                  />
                  {errors.targetScore && (
                    <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle size={13} />
                      <span>{errors.targetScore.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Chọn nhanh mốc điểm */}
              <div>
                <label className="block font-semibold mb-1 text-slate-400 text-xs">
                  Chọn nhanh mốc điểm mục tiêu:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {TOEIC_SCORE_PRESETS.map((preset) => (
                    <button
                      key={preset.score}
                      type="button"
                      onClick={() =>
                        setValue("targetScore", preset.score, {
                          shouldValidate: true,
                        })
                      }
                      className={`py-1.5 rounded-lg text-xs font-black transition-all border cursor-pointer ${
                        watchedTargetScore === preset.score
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm"
                          : isDarkMode
                            ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {preset.score}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-400">
                  Ngày thi chính thức dự kiến
                </label>
                <input
                  type="date"
                  {...register("examDate")}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all outline-none ${
                    errors.examDate
                      ? "border-rose-500 bg-rose-500/10 text-rose-200"
                      : isDarkMode
                        ? "bg-slate-900/80 border-slate-700 text-white focus:border-cyan-400"
                        : "bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600 focus:bg-white"
                  }`}
                />
                {errors.examDate && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.examDate.message}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-400">
                  Thời lượng cam kết học mỗi ngày
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {DAILY_STUDY_PRESETS.map((p) => (
                    <button
                      key={p.minutes}
                      type="button"
                      onClick={() =>
                        setValue("dailyMinutes", p.minutes, {
                          shouldValidate: true,
                        })
                      }
                      className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                        watchedDailyMinutes === p.minutes
                          ? "bg-indigo-600 text-white border-indigo-500 shadow-sm"
                          : isDarkMode
                            ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800"
                            : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <div className="font-bold text-xs">{p.label}</div>
                    </button>
                  ))}
                </div>
                {errors.dailyMinutes && (
                  <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle size={13} />
                    <span>{errors.dailyMinutes.message}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 cursor-pointer"
          >
            <Save size={16} />
            <span>Lưu cập nhật hồ sơ</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileInfoTab;
