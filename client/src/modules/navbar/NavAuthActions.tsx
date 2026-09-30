import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  LogOut,
  ArrowRight,
  Crown,
  Clock,
  Flame,
  Bell,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
  History,
  User,
} from "lucide-react";
import { useAuth } from "../../context";
import { STUDY_GOAL_STORAGE_KEY } from "../dashboard/defaultData";

/**
 * ==============================================================================
 * COMPONENT: NavAuthActions.tsx
 * MỤC ĐÍCH: Hiển thị cụm thanh trạng thái học viên & điều hướng bên phải Navbar:
 *   1. [ 👑 PRO ]: Huy hiệu PRO xanh ngọc chuẩn hình ảnh (#00ba7c / bg-emerald-500)
 *   2. [ 🕒 0m ]: Huy hiệu thời gian học hôm nay nền navy đậm (#132247), icon & chữ xanh dương (#38bdf8)
 *   3. [ 🔥 2 ]: Huy hiệu chuỗi Streak nền đồng đen (#2f2214), icon & số vàng hổ phách (#fbbf24)
 *   4. [ ☼ / 🌙 ]: Nút đổi theme Sáng / Tối với icon mặt trời vàng tia tỏa (#fbbf24)
 *   5. [ 🔔 ]: Nút chuông thông báo màu trắng/xám kèm Popover AI tương tác
 *   6. [ ((T)) ]: Avatar học viên viền đôi phát sáng (double-ring) chữ 'T' xanh (#38bdf8), kèm Menu tài khoản
 * ==============================================================================
 */

interface NavAuthActionsProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const NavAuthActions: React.FC<NavAuthActionsProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  // Hiển thị cụm trạng thái khi học viên đã đăng nhập hoặc đang ở trang /dashboard
  const isDashboard = location.pathname === "/dashboard";
  const showStatusCluster = isAuthenticated || isDashboard;

  // Quản lý trạng thái mở Dropdown Avatar và Popover Thông báo
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Người dùng hiện tại (nếu đang ở trang dashboard mà chưa đăng nhập thực thì dùng thông tin mặc định Trung)
  const activeUser = user || {
    id: "guest",
    email: "trung@toeicmaster.ai",
    fullName: "Trung",
    role: "student",
  };

  // Đọc thông tin chuỗi ngày Streak & thời gian học từ localStorage
  const [studyStats, setStudyStats] = useState(() => {
    try {
      const userKey = activeUser?.email
        ? `${STUDY_GOAL_STORAGE_KEY}_${activeUser.email}`
        : STUDY_GOAL_STORAGE_KEY;
      const saved =
        localStorage.getItem(userKey) ||
        localStorage.getItem(STUDY_GOAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          streakDays: parsed.streakDays || 2,
          todayMinutes: "0m",
        };
      }
    } catch {
      // ignore
    }
    return { streakDays: 2, todayMinutes: "0m" };
  });

  // Cập nhật lại stats khi user thay đổi hoặc có event storage
  useEffect(() => {
    const readStats = () => {
      try {
        const userKey = activeUser?.email
          ? `${STUDY_GOAL_STORAGE_KEY}_${activeUser.email}`
          : STUDY_GOAL_STORAGE_KEY;
        const saved =
          localStorage.getItem(userKey) ||
          localStorage.getItem(STUDY_GOAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setStudyStats({
            streakDays: parsed.streakDays || 2,
            todayMinutes: "0m",
          });
        }
      } catch {
        // ignore
      }
    };
    readStats();
    window.addEventListener("storage", readStats);
    return () => window.removeEventListener("storage", readStats);
  }, [activeUser?.email]);

  // Đóng dropdown khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xác định tên hiển thị ưu tiên: Họ tên -> Email -> Mặc định "Trung" (Chữ cái đầu 'T')
  const displayName =
    activeUser?.fullName ||
    activeUser?.fullname ||
    activeUser?.email?.split("@")[0] ||
    "Trung";
  const initial = displayName.charAt(0).toUpperCase() || "T";

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
      {/* Phân nhánh hiển thị dựa trên trạng thái đăng nhập hoặc trang dashboard */}
      {showStatusCluster ? (
        // =========================================================================
        // ĐÃ ĐĂNG NHẬP / DASHBOARD: HIỂN THỊ CỤM TRẠNG THÁI CHUẨN [ PRO | 0m | 🔥 2 | ☼ | 🔔 | ((T)) ]
        // =========================================================================
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0">
          {/* 1. [ 👑 PRO ]: Huy hiệu PRO màu xanh ngọc tươi (Emerald / Mint Green Pill) */}
          <Link
            to="/#pricing"
            title="Thành viên PRO TOEIC Master AI"
            className="h-7 px-2.5 rounded-full bg-[#00ba7c] hover:bg-[#00a86f] text-white font-black text-xs inline-flex items-center gap-1 shadow-sm shadow-[#00ba7c]/30 transition-all hover:scale-105 shrink-0 select-none"
          >
            <Crown size={12} className="fill-white text-white shrink-0" />
            <span className="tracking-wide">PRO</span>
          </Link>

          {/* 2. [ 🕒 0m ]: Huy hiệu thời gian học hôm nay (Navy Blue Pill) */}
          <Link
            to="/dashboard"
            title="Thời gian học hôm nay: 0m"
            className={`h-7 px-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 select-none border ${
              isDarkMode
                ? "bg-[#132247] hover:bg-[#182c5a] border-sky-500/20 text-[#38bdf8]"
                : "bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700 shadow-sm"
            }`}
          >
            <Clock
              size={13}
              className={
                isDarkMode ? "text-[#38bdf8] shrink-0" : "text-sky-600 shrink-0"
              }
            />
            <span>{studyStats.todayMinutes}</span>
          </Link>

          {/* 3. [ 🔥 2 ]: Huy hiệu Chuỗi ngày học Streak (Bronze / Amber Pill) */}
          <Link
            to="/dashboard"
            title={`Chuỗi ngày học liên tục: ${studyStats.streakDays} ngày`}
            className={`h-7 px-2.5 rounded-full text-xs font-black inline-flex items-center gap-1.5 transition-all hover:scale-105 shrink-0 select-none border ${
              isDarkMode
                ? "bg-[#2f2214] hover:bg-[#3c2b1a] border-amber-500/20 text-[#fbbf24]"
                : "bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700 shadow-sm"
            }`}
          >
            <Flame
              size={13}
              className={
                isDarkMode
                  ? "fill-[#fbbf24] text-[#fbbf24] shrink-0"
                  : "fill-amber-500 text-amber-500 shrink-0"
              }
            />
            <span>{studyStats.streakDays}</span>
          </Link>

          {/* 4. [ ☼ / 🌙 ]: Nút đổi theme Sáng/Tối với icon tia mặt trời vàng hổ phách */}
          <button
            onClick={onToggleTheme}
            title={
              isDarkMode
                ? "Chuyển sang giao diện sáng"
                : "Chuyển sang giao diện tối"
            }
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              isDarkMode
                ? "text-[#fbbf24] hover:text-amber-300 hover:bg-slate-800/50"
                : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
            }`}
          >
            {isDarkMode ? (
              <Sun size={19} className="text-[#fbbf24]" />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* 5. [ 🔔 ]: Nút Chuông thông báo (Bell) kèm Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setIsUserMenuOpen(false);
              }}
              title="Thông báo mới"
              className={`p-1.5 rounded-lg transition-colors relative shrink-0 ${
                isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/50"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
              }`}
            >
              <Bell size={18} />
            </button>

            {/* Menu Popover Thông báo AI */}
            {isNotificationOpen && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl p-4 shadow-2xl border transition-all z-50 animate-slide-up ${
                  isDarkMode
                    ? "bg-[#0b1226]/95 border-indigo-500/30 text-slate-100 shadow-indigo-950/80"
                    : "bg-white border-slate-200 text-slate-900 shadow-xl"
                } backdrop-blur-xl`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>Thông báo AI</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Vừa xong</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                    <p className="font-semibold text-cyan-300">
                      🎯 Đề xuất hôm nay
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bạn có 20 câu Part 5 và 1 bài Listening Part 3 để duy trì
                      chuỗi Streak!
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
                    <p className="font-semibold text-emerald-400">
                      🔥 Chuỗi học tập
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Chúc mừng bạn đã đạt mốc Streak {studyStats.streakDays}{" "}
                      ngày liên tiếp!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. [ ((T)) ]: Avatar chữ cái đầu viền đôi đồng tâm chuẩn ảnh mẫu kèm Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsNotificationOpen(false);
              }}
              title={`Tài khoản: ${displayName}`}
              className={`w-9 h-9 rounded-full p-[2px] border transition-all shrink-0 cursor-pointer flex items-center justify-center hover:scale-105 ${
                isDarkMode
                  ? "border-[#203c6e] hover:border-sky-400 bg-transparent"
                  : "border-indigo-300 hover:border-indigo-500 bg-transparent shadow-sm"
              }`}
            >
              <div
                className={`w-full h-full rounded-full flex items-center justify-center font-bold text-sm select-none ${
                  isDarkMode
                    ? "bg-[#132247] text-[#38bdf8]"
                    : "bg-indigo-600 text-white"
                }`}
              >
                {initial}
              </div>
            </button>

            {/* Menu Dropdown Tài khoản khi nhấp vào Avatar */}
            {isUserMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-2xl p-3 shadow-2xl border transition-all z-50 animate-slide-up ${
                  isDarkMode
                    ? "bg-[#0b1226]/95 border-indigo-500/30 text-slate-100 shadow-indigo-950/80"
                    : "bg-white border-slate-200 text-slate-900 shadow-xl"
                } backdrop-blur-xl`}
              >
                {/* Thông tin User */}
                <div className="px-3 py-2.5 border-b border-slate-800/40 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm block truncate">
                      {displayName}
                    </span>
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-[#00ba7c]/20 text-[#00ba7c] border border-[#00ba7c]/30">
                      PRO
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block truncate mt-0.5">
                    {activeUser.email}
                  </span>
                </div>

                {/* Các liên kết điều hướng */}
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isDarkMode
                        ? "text-slate-200 hover:bg-indigo-500/15 hover:text-white"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    <LayoutDashboard size={15} className="text-indigo-400" />
                    <span>Bảng điều khiển học tập</span>
                  </Link>

                  <Link
                    to="/exam"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isDarkMode
                        ? "text-slate-200 hover:bg-indigo-500/15 hover:text-white"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    <CheckCircle2 size={15} className="text-cyan-400" />
                    <span>Luyện thi thử ETS</span>
                  </Link>

                  <Link
                    to="/history"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isDarkMode
                        ? "text-slate-200 hover:bg-indigo-500/15 hover:text-white"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    <History size={15} className="text-amber-400" />
                    <span>Lịch sử bài làm</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      isDarkMode
                        ? "text-slate-200 hover:bg-indigo-500/15 hover:text-white"
                        : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    <User size={15} className="text-purple-400" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                </div>

                {/* Nút Đăng xuất */}
                <div className="border-t border-slate-800/40 mt-2 pt-1.5">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                      window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // =========================================================================
        // CHƯA ĐĂNG NHẬP: HIỂN THỊ NÚT ĐỔI THEME + ĐĂNG NHẬP & BẮT ĐẦU
        // =========================================================================
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút đổi theme Sáng/Tối */}
          <button
            onClick={onToggleTheme}
            title={
              isDarkMode
                ? "Chuyển sang giao diện sáng"
                : "Chuyển sang giao diện tối"
            }
            className={`p-2 rounded-lg transition-colors shrink-0 ${
              isDarkMode
                ? "text-[#fbbf24] hover:text-amber-300 hover:bg-slate-800/60"
                : "text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            }`}
          >
            {isDarkMode ? (
              <Sun size={18} className="text-[#fbbf24]" />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Link
            to="/auth/signin"
            className={`text-sm font-medium px-3 xl:px-4 py-2 transition-colors whitespace-nowrap shrink-0 ${
              isDarkMode
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-indigo-600"
            }`}
          >
            Đăng nhập
          </Link>
          <Link
            to="/auth/signup"
            className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-sm font-semibold px-4 xl:px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all whitespace-nowrap shrink-0"
          >
            <span>Bắt đầu miễn phí</span>
            <ArrowRight size={15} className="shrink-0" />
          </Link>
        </div>
      )}
    </div>
  );
};
