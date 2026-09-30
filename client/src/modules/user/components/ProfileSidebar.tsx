import type React from "react";
import { Settings, User, Lock, Smartphone, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../../context";
import type { ProfileTabKey } from "../types";

interface ProfileSidebarProps {
  activeTab: ProfileTabKey;
  onTabChange: (tab: ProfileTabKey) => void;
  isDarkMode: boolean;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  activeTab,
  onTabChange,
  isDarkMode,
}) => {
  const { logout } = useAuth();
  return (
    <aside
      className="w-full h-full md:w-64 lg:w-72 shrink-0"
      aria-label="Menu tài khoản"
    >
      <div
        className={`h-full p-4 rounded-3xl border transition-all sticky top-28 ${
          isDarkMode
            ? "bg-[#0b1226]/90 border-slate-800 text-slate-100 shadow-xl shadow-black/30"
            : "bg-white border-slate-200 text-slate-900 shadow-md"
        }`}
      >
        {/* TIÊU ĐỀ: ⚙ TÀI KHOẢN (Chuẩn ảnh mẫu) */}
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
          <Settings size={16} className="text-cyan-400" />
          <span className={isDarkMode ? "text-slate-200" : "text-slate-800"}>
            TÀI KHOẢN
          </span>
        </div>

        {/* DANH SÁCH 4 MỤC MENU (Chuẩn ảnh mẫu) */}
        <div className="space-y-1.5">
          {/* 1. Thông tin cá nhân */}
          <button
            type="button"
            onClick={() => onTabChange("info")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer ${
              activeTab === "info"
                ? isDarkMode
                  ? "border-2 border-slate-200/90 bg-[#101b38] text-[#38bdf8] shadow-md shadow-blue-950/40"
                  : "border-2 border-slate-800 bg-sky-50 text-sky-700 shadow-sm"
                : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/50 border-2 border-transparent"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent"
            }`}
          >
            <User
              size={18}
              className={
                activeTab === "info" ? "text-[#38bdf8]" : "text-slate-400"
              }
            />
            <span>Thông tin cá nhân</span>
          </button>

          {/* 2. Đổi mật khẩu */}
          <button
            type="button"
            onClick={() => onTabChange("password")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer ${
              activeTab === "password"
                ? isDarkMode
                  ? "border-2 border-slate-200/90 bg-[#101b38] text-[#38bdf8] shadow-md shadow-blue-950/40"
                  : "border-2 border-slate-800 bg-sky-50 text-sky-700 shadow-sm"
                : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/50 border-2 border-transparent"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent"
            }`}
          >
            <Lock
              size={18}
              className={
                activeTab === "password" ? "text-[#38bdf8]" : "text-slate-400"
              }
            />
            <span>Đổi mật khẩu</span>
          </button>

          {/* 3. Thiết bị */}
          <button
            type="button"
            onClick={() => onTabChange("devices")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer ${
              activeTab === "devices"
                ? isDarkMode
                  ? "border-2 border-slate-200/90 bg-[#101b38] text-[#38bdf8] shadow-md shadow-blue-950/40"
                  : "border-2 border-slate-800 bg-sky-50 text-sky-700 shadow-sm"
                : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/50 border-2 border-transparent"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent"
            }`}
          >
            <Smartphone
              size={18}
              className={
                activeTab === "devices" ? "text-[#38bdf8]" : "text-slate-400"
              }
            />
            <span>Thiết bị</span>
          </button>

          {/* 4. Thông báo */}
          <button
            type="button"
            onClick={() => onTabChange("notifications")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm transition-all text-left cursor-pointer ${
              activeTab === "notifications"
                ? isDarkMode
                  ? "border-2 border-slate-200/90 bg-[#101b38] text-[#38bdf8] shadow-md shadow-blue-950/40"
                  : "border-2 border-slate-800 bg-sky-50 text-sky-700 shadow-sm"
                : isDarkMode
                  ? "text-slate-300 hover:text-white hover:bg-slate-800/50 border-2 border-transparent"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-2 border-transparent"
            }`}
          >
            <Bell
              size={18}
              className={
                activeTab === "notifications"
                  ? "text-[#38bdf8]"
                  : "text-slate-400"
              }
            />
            <span>Thông báo</span>
          </button>
        </div>

        {/* Vạch phân cách & Nút Đăng xuất */}
        <div
          className={`border-t my-3 pt-2 ${
            isDarkMode ? "border-slate-800/80" : "border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left cursor-pointer"
          >
            <LogOut size={18} className="text-rose-400" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
