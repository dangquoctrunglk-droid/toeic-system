import type React from "react";
import { Link } from "react-router-dom";
import { MascotLogo } from "./NavbarIcons";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * FILE: NavbarBrand.tsx
 * MỤC ĐÍCH: Hiển thị Logo linh vật và Tên thương hiệu "TOEIC Master AI"
 * - Nằm ở góc trái thanh Navbar
 * - Nhấp vào sẽ chuyển hướng người dùng về trang chủ (Link to="/")
 * ==============================================================================
 */
export const NavbarBrand: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 no-underline group shrink-0 whitespace-nowrap"
      title="TOEIC Master AI - Về trang chủ"
    >
      {/* Biểu tượng Linh vật chú mèo cử nhân */}
      <div className="relative group-hover:scale-105 transition-transform shrink-0">
        <MascotLogo className="w-9 h-9 drop-shadow-md" />
      </div>

      {/* Tên thương hiệu kèm nhãn AI */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className={`text-lg sm:text-xl font-bold tracking-tight transition-colors whitespace-nowrap ${
            isDarkMode
              ? "text-white group-hover:text-indigo-200"
              : "text-slate-900 group-hover:text-indigo-600"
          }`}
        >
          TOEIC{" "}
          <span className={isDarkMode ? "text-indigo-400" : "text-indigo-600"}>
            Master
          </span>
        </span>
        <span
          className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded border shrink-0 ${
            isDarkMode
              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
              : "bg-indigo-50 text-indigo-600 border-indigo-200"
          }`}
        >
          AI
        </span>
      </div>
    </Link>
  );
};
