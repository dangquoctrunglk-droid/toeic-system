import type React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components/common";
import { SigninModal, SignupModal } from "../pages/auth";

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginRoute =
    location.pathname === "/auth/login" || location.pathname === "/login";
  const isRegisterRoute =
    location.pathname === "/auth/register" || location.pathname === "/register";

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080d1c] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navbar cố định ở đầu trang */}
      <Navbar />

      {/* Vùng nội dung tràn màn hình chuẩn theme */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer ở cuối trang */}
      <Footer />

      {/* Modal Đăng nhập */}
      <SigninModal
        key="signin-modal"
        isOpen={isLoginRoute}
        onClose={handleClose}
        onSwitchToSignup={() => navigate("/auth/register")}
      />

      {/* Modal Đăng ký */}
      <SignupModal
        key="signup-modal"
        isOpen={isRegisterRoute}
        onClose={handleClose}
        onSwitchToSignin={() => navigate("/auth/login")}
      />
    </div>
  );
};
