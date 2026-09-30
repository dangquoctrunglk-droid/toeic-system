import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, MessageCircle, Lightbulb } from "lucide-react";
import { useTheme } from "../../context";
import type { NavItem } from "./types";

/**
 * ==============================================================================
 * FILE: DesktopNav.tsx
 * MỤC ĐÍCH: Hiển thị thanh menu điều hướng trên màn hình máy tính (từ breakpoint lg trở lên)
 * BAO GỒM:
 *   1. Danh sách các tab điều hướng chính (Nghe, Đọc, Từ vựng, Đề thi, Video)
 *   2. Nút menu thả xuống "More" (Liên hệ, Đề xuất tính năng) có chức năng bấm ngoài để đóng
 * ==============================================================================
 */

/**
 * Props truyền vào DesktopNav
 * @property items - Mảng chứa các mục điều hướng (NAV_ITEMS)
 * @property onNavClick - Hàm xử lý cuộn mượt đến section tương ứng khi nhấp vào tab
 * @property onOpenContact - Hàm mở modal popup Liên hệ
 * @property onOpenSuggestion - Hàm mở modal popup Đóng góp ý kiến / Đề xuất
 */
interface DesktopNavProps {
  items: NavItem[];
  onNavClick: (href: string) => void;
  onOpenContact: () => void;
  onOpenSuggestion: () => void;
}

export const DesktopNav: React.FC<DesktopNavProps> = ({
  items,
  onNavClick,
  onOpenContact,
  onOpenSuggestion,
}) => {
  const { isDarkMode } = useTheme();

  // Trạng thái bật/tắt menu thả xuống "More"
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Hook lắng nghe sự kiện nhấp chuột bên ngoài dropdown để tự động đóng menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-7 shrink-0">
      {/* Duyệt qua từng mục menu chính */}
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            onNavClick(item.href);
          }}
          className={`flex items-center gap-2 font-medium text-sm transition-all duration-150 group shrink-0 whitespace-nowrap py-1 ${
            isDarkMode
              ? "text-slate-300 hover:text-white"
              : "text-slate-600 hover:text-indigo-600"
          }`}
        >
          {item.icon ? (
            <item.icon
              size={17}
              className={`transition-colors shrink-0 ${
                isDarkMode
                  ? "text-slate-400 group-hover:text-indigo-400"
                  : "text-slate-400 group-hover:text-indigo-600"
              }`}
            />
          ) : null}
          <span className="whitespace-nowrap">{item.label}</span>
        </a>
      ))}

      {/* Mục menu thả xuống "... More" */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
          className={`flex items-center gap-1.5 font-medium text-sm transition-colors py-1 px-2 rounded-lg whitespace-nowrap shrink-0 ${
            moreDropdownOpen
              ? isDarkMode
                ? "text-indigo-300 bg-indigo-500/10"
                : "text-indigo-600 bg-indigo-50"
              : isDarkMode
                ? "text-slate-300 hover:text-white"
                : "text-slate-600 hover:text-indigo-600"
          }`}
        >
          <MoreHorizontal size={18} className="shrink-0" />
          <span>More</span>
        </button>

        {/* Khung thả xuống chứa Liên hệ & Đề xuất */}
        {moreDropdownOpen && (
          <div
            className={`absolute right-0 mt-2 w-44 rounded-xl shadow-2xl py-1.5 z-50 animate-modal-card ${
              isDarkMode
                ? "bg-[#0d1428] border border-indigo-500/20 shadow-black/80 text-slate-200"
                : "bg-white border border-slate-200 shadow-slate-300/50 text-slate-700"
            }`}
          >
            <button
              onClick={() => {
                setMoreDropdownOpen(false);
                onOpenContact();
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left ${
                isDarkMode
                  ? "text-slate-200 hover:text-white hover:bg-indigo-600/15"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <MessageCircle size={16} className="text-indigo-400 shrink-0" />
              <span>Liên hệ</span>
            </button>
            <button
              onClick={() => {
                setMoreDropdownOpen(false);
                onOpenSuggestion();
              }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors text-left ${
                isDarkMode
                  ? "text-slate-200 hover:text-white hover:bg-indigo-600/15"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <Lightbulb size={16} className="text-amber-400 shrink-0" />
              <span>Đề xuất</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
