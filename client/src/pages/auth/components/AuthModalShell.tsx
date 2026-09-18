import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

interface AuthModalShellProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export function AuthModalShell({
  isOpen,
  onClose,
  children,
}: AuthModalShellProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Khóa cuộn trang khi Modal đang mở
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSmoothClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      if (onClose) onClose();
    }, 200);
  }, [onClose]);

  // Xử lý phím ESC để đóng modal mượt mà
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isClosing) {
        handleSmoothClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isClosing, handleSmoothClose]);

  if (!isOpen && !isClosing) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 transition-opacity duration-200 ease-out ${
        isClosing
          ? "opacity-0 pointer-events-none"
          : "opacity-100 pointer-events-auto animate-modal-backdrop"
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Lớp phủ làm tối & làm mờ nền với ánh sáng trang trí */}
      <div
        className="fixed inset-0 bg-[#050814]/85 backdrop-blur-xl transition-all duration-300"
        onClick={handleSmoothClose}
        aria-hidden="true"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* Nút đóng nổi ở góc trên */}
      <button
        onClick={handleSmoothClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-8 z-50 p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-indigo-500/20 shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 group focus:outline-none cursor-pointer"
        title="Đóng (ESC)"
        aria-label="Đóng cửa sổ"
      >
        <X
          size={20}
          className="group-hover:rotate-90 transition-transform duration-200"
        />
      </button>

      {/* Khung Card Modal 2 cột chính - Dark Theme đồng bộ ứng dụng */}
      <div
        className={`relative z-10 w-full max-w-5xl rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl shadow-black/90 border border-indigo-500/20 bg-[#0a1124] grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] transform transition-all duration-200 ease-out ${
          isClosing
            ? "opacity-0 scale-95 translate-y-3"
            : "opacity-100 scale-100 translate-y-0 animate-modal-card"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
