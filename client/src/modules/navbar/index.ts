/**
 * ==============================================================================
 * FILE: index.ts (Barrel Export)
 * MỤC ĐÍCH: Xuất khẩu toàn bộ các component, icon, cấu hình và types của Navbar
 * GIÚP: Việc import vào Navbar.tsx hay các file khác trở nên gọn gàng:
 *       import { NavbarBrand, DesktopNav, NAV_ITEMS } from "./navbarComponents";
 * ==============================================================================
 */

// 1. Định nghĩa kiểu dữ liệu (NavItem, NavIconProps)
export * from "./types";

// 2. Các icon SVG tùy biến (MascotLogo, VocabularyIcon)
export * from "./NavbarIcons";

// 3. Cấu hình danh sách mục menu điều hướng (NAV_ITEMS)
export * from "./navConfig";

// 4. Logo Mascot và Tên thương hiệu
export * from "./NavbarBrand";

// 5. Thanh điều hướng và Dropdown More trên máy tính
export * from "./DesktopNav";

// 6. Cụm nút Theme, Đăng nhập, Bắt đầu và User Profile
export * from "./NavAuthActions";

// 7. Ngăn kéo menu trên thiết bị di động & tablet
export * from "./MobileMenuDrawer";

// 8. Hộp thoại Popup Liên hệ hỗ trợ
export * from "./ContactModal";

// 9. Hộp thoại Popup Đóng góp ý kiến & Đề xuất tính năng
export * from "./SuggestionModal";

// 10. Tự động hiển thị Google One Tap khi chưa đăng nhập
export * from "./GoogleOneTap";
