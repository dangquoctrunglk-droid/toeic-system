import type React from "react";
import type { NavIconProps } from "./types";

/**
 * ==============================================================================
 * FILE: NavbarIcons.tsx
 * MỤC ĐÍCH: Chứa các Icon SVG tùy biến được vẽ thủ công cho Navbar:
 *   1. MascotLogo: Linh vật chú mèo đội mũ cử nhân tốt nghiệp TOEIC Master AI
 *   2. VocabularyIcon: Biểu tượng ô vuông chữ [A] đại diện cho phần Từ vựng
 * ==============================================================================
 */

/**
 * Component hiển thị linh vật (Mascot) thương hiệu TOEIC Master AI:
 * - Chú mèo xanh/tím dễ thương với đôi tai vểnh, má hồng, mắt to tròn
 * - Đội mũ cử nhân tốt nghiệp màu đen-xanh navy với nút khuy và tua vàng
 * - Tông màu gradient: Xanh dương (#60a5fa) sang Indigo tím (#4f46e5)
 */
export const MascotLogo: React.FC<{ className?: string }> = ({
  className = "w-9 h-9",
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tai trái & Tai phải */}
      <path
        d="M 22 38 L 13 18 C 13 18 27 22 32 30 Z"
        fill="#4f46e5"
        stroke="#3730a3"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M 20 34 L 16 22 C 16 22 25 24 28 29 Z"
        fill="#818cf8"
        opacity="0.6"
      />
      <path
        d="M 78 38 L 87 18 C 87 18 73 22 68 30 Z"
        fill="#4f46e5"
        stroke="#3730a3"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M 80 34 L 84 22 C 84 22 75 24 72 29 Z"
        fill="#818cf8"
        opacity="0.6"
      />

      {/* Khuôn mặt */}
      <circle cx="50" cy="56" r="38" fill="url(#mascot-head-gradient)" />

      {/* Má hồng */}
      <ellipse cx="27" cy="65" rx="6" ry="3.5" fill="#f472b6" opacity="0.65" />
      <ellipse cx="73" cy="65" rx="6" ry="3.5" fill="#f472b6" opacity="0.65" />

      {/* Đôi mắt to tròn long lanh */}
      <ellipse cx="36" cy="54" rx="5.5" ry="7" fill="#0f172a" />
      <circle cx="34.5" cy="51.5" r="2.2" fill="white" />
      <circle cx="38" cy="56.5" r="1.1" fill="white" />

      <ellipse cx="64" cy="54" rx="5.5" ry="7" fill="#0f172a" />
      <circle cx="62.5" cy="51.5" r="2.2" fill="white" />
      <circle cx="66" cy="56.5" r="1.1" fill="white" />

      {/* Nụ cười vui tươi */}
      <path
        d="M 43 63 Q 50 69 57 63"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Mũ cử nhân (Mortarboard) */}
      <polygon
        points="50,13 88,25 50,37 12,25"
        fill="#0f172a"
        stroke="#312e81"
        strokeWidth="1.5"
      />
      <path
        d="M 31 31.5 L 31 40 C 31 46 69 46 69 40 L 69 31.5"
        fill="#0f172a"
        stroke="#312e81"
        strokeWidth="1.5"
      />
      {/* Khuy mũ và tua vàng */}
      <circle cx="50" cy="25" r="2.5" fill="#fbbf24" />
      <path
        d="M 50 25 Q 70 27 75 38"
        stroke="#fbbf24"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="75" cy="39" r="2.4" fill="#f59e0b" />

      {/* Bộ màu chuyển sắc cho khuôn mặt linh vật */}
      <defs>
        <linearGradient
          id="mascot-head-gradient"
          x1="20"
          y1="20"
          x2="80"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60a5fa" />
          <stop offset="0.5" stopColor="#4f46e5" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * Component hiển thị Icon "Từ vựng" hình ô vuông bo góc chứa chữ [A]
 * GHI CHÚ QUAN TRỌNG:
 * - Sử dụng thuộc tính cứng width={size}, height={size} kết hợp style để cố định kích thước
 * - Ngăn chặn lỗi SVG tự động giãn to 100% khi nhận class CSS bên ngoài
 */
export const VocabularyIcon: React.FC<NavIconProps> = ({
  size = 18,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M8.5 16.5l3.5-9 3.5 9" />
      <path d="M9.5 13.5h5" />
    </svg>
  );
};
