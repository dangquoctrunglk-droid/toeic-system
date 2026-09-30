import type React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Lightbulb, ArrowRight, LogOut } from "lucide-react";
import { useAuth, useTheme } from "../../context";
import type { NavItem } from "./types";

/**
 * ==============================================================================
 * FILE: MobileMenuDrawer.tsx
 * MỤC ĐÍCH: Ngăn kéo menu trượt mở từ trên xuống dành riêng cho Mobile & Tablet (< 1024px)
 * THIẾT KẾ: Bám sát chuẩn ảnh giao diện Mobile mẫu:
 *   1. Danh sách 5 mục chính (Nghe, Đọc, Từ vựng, Đề thi, Video)
 *   2. Vạch kẻ ngang phân cách 1
 *   3. Hai mục phụ mở rộng (Liên hệ, Đề xuất)
 *   4. Vạch kẻ ngang phân cách 2
 *   5. Nút Đăng nhập & Nút bấm lớn full-width "Bắt đầu miễn phí" (hoặc Thông tin User)
 * ==============================================================================
 */

/**
 * Props truyền vào MobileMenuDrawer
 * @property isOpen - Trạng thái ngăn kéo đang mở hay đóng
 * @property items - Mảng chứa danh sách mục menu chính (NAV_ITEMS)
 * @property onNavClick - Hàm xử lý cuộn trang khi bấm chọn tab
 * @property onClose - Hàm đóng ngăn kéo menu
 * @property onOpenContact - Hàm mở modal Liên hệ
 * @property onOpenSuggestion - Hàm mở modal Đóng góp ý kiến
 */
interface MobileMenuDrawerProps {
  isOpen: boolean;
  items: NavItem[];
  onNavClick: (href: string) => void;
  onClose: () => void;
  onOpenContact: () => void;
  onOpenSuggestion: () => void;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  items,
  onNavClick,
  onClose,
  onOpenContact,
  onOpenSuggestion,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode } = useTheme();

  // Nếu menu đang ở trạng thái đóng thì không render DOM
  if (!isOpen) return null;

  // Lấy tên hiển thị của học viên
  const displayName =
    user?.fullName ||
    user?.fullname ||
    user?.email?.split("@")[0] ||
    "Học viên";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`lg:hidden border-b px-5 pt-3 pb-6 flex flex-col animate-modal-backdrop shadow-2xl transition-colors duration-200 ${
        isDarkMode
          ? "bg-[#080d1c] border-indigo-500/20 text-slate-100"
          : "bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800"
      }`}
    >
      {/* 1. Danh sách các mục điều hướng chính */}
      <div className="flex flex-col">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => {
              e.preventDefault();
              onNavClick(item.href);
            }}
            className={`flex items-center gap-3 py-3 font-medium text-[15px] transition-colors ${
              isDarkMode
                ? "text-slate-200 hover:text-indigo-400"
                : "text-slate-700 hover:text-indigo-600"
            }`}
          >
            {item.icon ? (
              <item.icon
                size={18}
                className={
                  isDarkMode
                    ? "text-slate-400 shrink-0"
                    : "text-slate-500 shrink-0"
                }
              />
            ) : null}
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* 2. Đường phân cách 1 */}
      <div
        className={`border-t my-2 ${
          isDarkMode ? "border-slate-800/80" : "border-slate-200"
        }`}
      />

      {/* 3. Các mục More trên Mobile: Liên hệ & Đề xuất */}
      <div className="flex flex-col">
        <button
          onClick={() => {
            onClose();
            onOpenContact();
          }}
          className={`flex items-center gap-3 py-3 font-medium text-[15px] transition-colors text-left ${
            isDarkMode
              ? "text-slate-200 hover:text-indigo-400"
              : "text-slate-700 hover:text-indigo-600"
          }`}
        >
          <MessageCircle size={18} className="text-indigo-500 shrink-0" />
          <span>Liên hệ</span>
        </button>
        <button
          onClick={() => {
            onClose();
            onOpenSuggestion();
          }}
          className={`flex items-center gap-3 py-3 font-medium text-[15px] transition-colors text-left ${
            isDarkMode
              ? "text-slate-200 hover:text-indigo-400"
              : "text-slate-700 hover:text-indigo-600"
          }`}
        >
          <Lightbulb size={18} className="text-amber-500 shrink-0" />
          <span>Đề xuất</span>
        </button>
      </div>

      {/* 4. Đường phân cách 2 */}
      <div
        className={`border-t my-2 ${
          isDarkMode ? "border-slate-800/80" : "border-slate-200"
        }`}
      />

      {/* 5. Khu vực tài khoản / Đăng nhập & Đăng ký dưới đáy menu */}
      {isAuthenticated && user ? (
        // Đã đăng nhập: Thẻ hồ sơ học viên & Nút Đăng xuất
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:scale-[1.01] ${
              isDarkMode
                ? "bg-slate-900/90 border-indigo-500/20 text-white hover:border-indigo-500/50"
                : "bg-slate-100 border-slate-200 text-slate-800 hover:border-indigo-300"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shrink-0">
              {initial}
            </div>
            <div className="flex flex-col text-left truncate">
              <span
                className={`text-sm font-bold truncate ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {displayName}
              </span>
              <span
                className={`text-xs truncate ${
                  isDarkMode ? "text-indigo-300" : "text-indigo-600"
                }`}
              >
                {user.email} · Đến Bảng học tập
              </span>
            </div>
          </Link>
          <div className="border-t border-slate-800/40 mt-2 pt-1.5">
            <button
              onClick={() => {
                onClose();
                logout();
                window.location.href = "/";
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      ) : (
        // Chưa đăng nhập: Nút chữ Đăng nhập & Nút lớn Bắt đầu miễn phí
        <div className="flex flex-col gap-3 pt-2">
          <Link
            to="/auth/signin"
            className={`font-medium text-base py-2 transition-colors ${
              isDarkMode
                ? "text-slate-200 hover:text-white"
                : "text-slate-700 hover:text-indigo-600"
            }`}
            onClick={onClose}
          >
            Đăng nhập
          </Link>
          <Link
            to="/auth/signup"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl text-center shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
            onClick={onClose}
          >
            <span>Bắt đầu miễn phí</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};
