import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useTheme } from "../context";
import {
  NAV_ITEMS,
  NavbarBrand,
  DesktopNav,
  NavAuthActions,
  MobileMenuDrawer,
  ContactModal,
  SuggestionModal,
  GoogleOneTap,
} from "../modules/navbar";

export function Navbar() {
  // Trạng thái thanh Navbar khi người dùng cuộn chuột quá 20px (đổi màu nền & thêm viền mờ)
  const [scrolled, setScrolled] = useState(false);

  // Trạng thái mở/đóng ngăn kéo menu trên Mobile & Tablet (< 1024px)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lấy trạng thái giao diện Sáng / Tối từ ThemeContext
  const { isDarkMode, toggleTheme } = useTheme();

  // Trạng thái hiển thị Modal Liên hệ
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Trạng thái hiển thị Modal Đề xuất ý kiến
  const [suggestionModalOpen, setSuggestionModalOpen] = useState(false);

  // Lắng nghe thao tác cuộn trang để cập nhật hiệu ứng nền Navbar
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useNavigate();

  // Xử lý khi người dùng nhấp chọn tab điều hướng: đóng menu mobile & điều hướng hoặc cuộn mượt đến section
  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Khung thanh điều hướng cố định (Fixed Navbar) */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? scrolled || mobileOpen
              ? "bg-[#080d1c]/95 backdrop-blur-xl border-b border-indigo-500/15 shadow-xl shadow-black/40 text-slate-100"
              : "bg-[#080d1c]/85 backdrop-blur-md border-b border-slate-800/60 text-slate-100"
            : scrolled || mobileOpen
              ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-md shadow-slate-200/60 text-slate-900"
              : "bg-white/85 backdrop-blur-md border-b border-slate-200/60 text-slate-900"
        }`}
      >
        <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between h-16">
          {/* 1. Logo & Tên thương hiệu TOEIC Master AI */}
          <NavbarBrand />

          {/* 2. Danh sách các tab menu điều hướng trên máy tính */}
          <DesktopNav
            items={NAV_ITEMS}
            onNavClick={handleNavClick}
            onOpenContact={() => setContactModalOpen(true)}
            onOpenSuggestion={() => setSuggestionModalOpen(true)}
          />

          {/* 3. Cụm thanh trạng thái học viên & Đăng nhập bên phải */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <NavAuthActions
              isDarkMode={isDarkMode}
              onToggleTheme={toggleTheme}
            />

            {/* Nút Hamburger bật/tắt mở ngăn kéo menu trên Mobile & Tablet (< 1024px) */}
            <div className="flex lg:hidden items-center shrink-0 ml-1">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-1.5 rounded-lg focus:outline-none transition-colors shrink-0 border ${
                  isDarkMode
                    ? "text-slate-300 hover:text-white border-slate-800 bg-slate-900/50 hover:bg-slate-800/60"
                    : "text-slate-700 hover:text-slate-900 border-slate-200 bg-slate-100 hover:bg-slate-200"
                }`}
                aria-label="Toggle Menu"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* 5. Ngăn kéo menu trên Mobile & Tablet (Drawer) */}
        <MobileMenuDrawer
          isOpen={mobileOpen}
          items={NAV_ITEMS}
          onNavClick={handleNavClick}
          onClose={() => setMobileOpen(false)}
          onOpenContact={() => setContactModalOpen(true)}
          onOpenSuggestion={() => setSuggestionModalOpen(true)}
        />
      </nav>

      {/* 6. Hộp thoại Popup Liên hệ hỗ trợ */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* 7. Hộp thoại Popup Đóng góp ý kiến & Đề xuất */}
      <SuggestionModal
        isOpen={suggestionModalOpen}
        onClose={() => setSuggestionModalOpen(false)}
      />

      {/* 8. Tự động hiển thị Google One Tap ở góc phải màn hình khi chưa đăng nhập */}
      <GoogleOneTap />
    </>
  );
}

export default Navbar;
