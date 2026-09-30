import type React from "react";

/**
 * ==============================================================================
 * FILE: types.ts
 * MỤC ĐÍCH: Định nghĩa các kiểu dữ liệu (Types / Interfaces) dùng chung cho Navbar
 * ==============================================================================
 */

/**
 * Interface cho thuộc tính truyền vào các Icon trên thanh Navbar
 * @property size - Kích thước của icon tính theo pixel (VD: 17, 18)
 * @property className - Các class CSS / Tailwind bổ sung để tùy biến màu sắc, hiệu ứng
 */
export interface NavIconProps {
  size?: number;
  className?: string;
}

/**
 * Interface đại diện cho một mục điều hướng trên thanh Navbar (Menu Item)
 * @property label - Tên hiển thị của mục menu (VD: "Nghe", "Đọc", "Từ vựng")
 * @property href - Đường dẫn liên kết hoặc id neo cuộn trang (VD: "#practice", "#courses")
 * @property icon - Component biểu tượng hiển thị kèm theo chữ (nhận size và className)
 */
export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<NavIconProps>;
}
