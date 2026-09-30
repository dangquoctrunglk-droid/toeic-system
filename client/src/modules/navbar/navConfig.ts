import { Headphones, BookOpen, FileText, PlayCircle } from "lucide-react";
import { VocabularyIcon } from "./NavbarIcons";
import type { NavItem } from "./types";

/**
 * ==============================================================================
 * FILE: navConfig.ts
 * MỤC ĐÍCH: Cấu hình danh sách các mục điều hướng (Menu items) hiển thị trên Navbar
 * GHI CHÚ: Khi muốn thêm, bớt hoặc sửa tên/đường dẫn của menu, chỉ cần chỉnh sửa tại đây
 * ==============================================================================
 */

/**
 * Danh sách 5 mục điều hướng chính trên cả Desktop và Mobile:
 * 1. Nghe     -> Icon Headphones (Cuộn tới phần luyện nghe #practice)
 * 2. Đọc      -> Icon BookOpen   (Cuộn tới danh mục khóa học/bài đọc #courses)
 * 3. Từ vựng  -> Icon [A] vuông  (Cuộn tới tính năng từ vựng #features)
 * 4. Đề thi   -> Icon FileText   (Cuộn tới luyện đề thi ETS #practice)
 * 5. Video    -> Icon PlayCircle (Cuộn tới video trải nghiệm học tập #demo)
 */
export const NAV_ITEMS: NavItem[] = [
  {
    label: "Nghe",
    href: "/listening",
    icon: Headphones,
  },
  {
    label: "Đọc",
    href: "#courses",
    icon: BookOpen,
  },
  {
    label: "Từ vựng",
    href: "#features",
    icon: VocabularyIcon,
  },
  {
    label: "Đề thi",
    href: "#practice",
    icon: FileText,
  },
  {
    label: "Video",
    href: "#demo",
    icon: PlayCircle,
  },
];
