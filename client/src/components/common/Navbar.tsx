import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Star, ArrowRight, Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../../context";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = user?.fullName || user?.fullname || user?.email?.split("@")[0] || "Học viên";
  const initial = displayName.charAt(0).toUpperCase();

  const links = [
    { label: "Khóa học", href: "#courses" },
    { label: "Luyện thi", href: "#practice" },
    { label: "Tính năng", href: "#features" },
    { label: "Đánh giá", href: "#testimonials" },
    { label: "Bảng giá", href: "#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080d1c]/90 backdrop-blur-xl border-b border-indigo-500/15 py-3 shadow-xl shadow-black/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo & Tên thương hiệu */}
        <Link to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <GraduationCap size={22} className="text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
                TOEIC<span className="text-indigo-400">Master</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide">
              ETS Prep Platform
            </span>
          </div>
        </Link>
        {/* Các liên kết menu trên máy tính */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-4 py-1.5 backdrop-blur-md">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-300 text-sm font-medium px-4 py-1.5 rounded-full hover:text-white hover:bg-indigo-500/15 transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Các nút hành động trên máy tính */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span>4.9 · 10K+ học viên</span>
          </div>

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-2">
              <div className="flex items-center gap-2.5 bg-slate-900/80 border border-indigo-500/25 px-3 py-1.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow-sm shadow-indigo-500/30">
                  {initial}
                </div>
                <div className="flex flex-col text-left leading-tight max-w-[130px]">
                  <span className="text-sm font-semibold text-white truncate">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-indigo-300 font-medium">
                    {user.role === "admin" ? "Quản trị viên" : "Học viên"}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 px-3 py-2 rounded-xl transition-all"
              >
                <LogOut size={14} />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth/signin"
                className="text-slate-300 text-sm font-medium px-4 py-2 hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
              >
                Bắt đầu miễn phí
                <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>

        {/* Nút bật/tắt menu trên điện thoại */}
        <button
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Ngăn kéo menu trên điện thoại */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0a1024]/95 border-b border-indigo-500/20 backdrop-blur-2xl px-6 py-5 flex flex-col gap-3 animate-slide-up">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-200 text-base font-medium py-2.5 border-b border-slate-800/80 hover:text-indigo-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}

          <div className="flex flex-col gap-2.5 pt-3">
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/20 p-3 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md">
                    {initial}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-bold text-white truncate">
                      {displayName}
                    </span>
                    <span className="text-xs text-indigo-300">
                      {user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="inline-flex items-center justify-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 py-2.5 rounded-xl hover:bg-red-500/20 transition-all font-medium"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/signin"
                  className="text-slate-300 text-center py-2.5 text-base font-medium hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/signup"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30"
                  onClick={() => setMobileOpen(false)}
                >
                  Bắt đầu miễn phí
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;
