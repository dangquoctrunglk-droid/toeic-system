import type React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ForgotPasswordModal, SigninModal, SignupModal } from "../pages/auth";
import { useAuth, useTheme } from "../context";

export const MainLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra người dùng đã đăng nhập chưa
  const isUserLoggedIn = Boolean(isAuthenticated || user);

  const isSigninRoute = location.pathname === "/auth/signin";
  const isSignupRoute = location.pathname === "/auth/signup";
  const isForgotPasswordRoute = location.pathname === "/auth/forgot-password";

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-indigo-500 selection:text-white ${
        isDarkMode ? "bg-[#080d1c] text-slate-100" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      {/* Navbar cố định ở đầu trang */}
      <Navbar />

      {/* Vùng nội dung tràn màn hình chuẩn theme */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer ở cuối trang: chỉ hiển thị cho khách vãng lai khi chưa đăng nhập */}
      {!isUserLoggedIn && <Footer />}

      {/* Modal Đăng nhập */}
      <SigninModal
        key="signin-modal"
        isOpen={isSigninRoute}
        onClose={handleClose}
        onSwitchToSignup={() => navigate("/auth/signup")}
        onSwitchToForgotPassword={() => navigate("/auth/forgot-password")}
      />

      {/* Modal Đăng ký */}
      <SignupModal
        key="signup-modal"
        isOpen={isSignupRoute}
        onClose={handleClose}
        onSwitchToSignin={() => navigate("/auth/signin")}
      />

      {/* Modal Quên mật khẩu */}
      <ForgotPasswordModal
        key="forgot-password-modal"
        isOpen={isForgotPasswordRoute}
        onClose={handleClose}
        onSwitchToSignin={() => navigate("/auth/signin")}
      />
    </div>
  );
};
