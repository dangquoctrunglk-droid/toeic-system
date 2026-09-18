import { Link } from 'react-router-dom';
import { Sparkles, Zap, Play, Star, Award } from 'lucide-react';
import { WorkspaceMockup } from './WorkspaceMockup';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 lg:pt-36 lg:pb-32 overflow-hidden flex flex-col items-center justify-center">
      {/* Ánh sáng nền & Hiệu ứng không gian */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Ánh sáng tỏa tròn lớn ở giữa trên */}
        <div className="absolute w-[700px] h-[500px] rounded-full bg-indigo-600/20 blur-[130px] -top-[150px] left-1/2 -translate-x-1/2 animate-pulse-glow" />
        {/* Ánh sáng tím bên trái */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-[120px] top-1/4 -left-[100px] animate-pulse-glow-slow" />
        {/* Ánh sáng xanh cyan bên phải */}
        <div className="absolute w-[450px] h-[450px] rounded-full bg-cyan-500/15 blur-[120px] top-1/3 -right-[100px] animate-pulse-glow-accent" />
        {/* Họa tiết lưới toạ độ */}
        <div className="absolute inset-0 hero-grid-bg" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center text-center">
        {/* Huy hiệu giới thiệu hình viên thuốc */}
        <div className="animate-slide-up inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-[1.5px] uppercase px-4 py-2 rounded-full shadow-lg shadow-indigo-950/40 mb-8 backdrop-blur-md">
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span>HỆ THỐNG LUYỆN THI TOEIC THẾ HỆ MỚI VỚI AI</span>
        </div>

        {/* Tiêu đề chính lớn */}
        <h1 className="animate-slide-up text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Chinh Phục Điểm Số TOEIC
          <br />
          <span className="gradient-text">Bứt Phá Từ Lộ Trình AI</span>
        </h1>

        {/* Tiêu đề phụ */}
        <p className="animate-slide-up text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 [animation-delay:0.15s]">
          Chẩn đoán chính xác lỗ hổng ngữ pháp và từ vựng, tự động đề xuất bài tập
          Listening, Reading, Writing tối ưu. Rút ngắn 50% thời gian ôn luyện
          chuẩn cấu trúc ETS 2026.
        </p>

        {/* Các nút kêu gọi hành động (CTA) */}
        <div className="animate-slide-up flex flex-wrap items-center justify-center gap-4 mb-12 [animation-delay:0.25s]">
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
          >
            <Zap size={18} className="text-cyan-300" />
            Bắt đầu luyện thi miễn phí
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 bg-slate-900/80 border border-indigo-500/25 text-slate-200 text-base font-semibold px-7 py-4 rounded-xl hover:bg-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-0.5 backdrop-blur-md transition-all"
          >
            <Play size={17} className="text-indigo-400 fill-indigo-400/20" />
            Xem trải nghiệm học tập
          </a>
        </div>

        {/* Bằng chứng xã hội & Đánh giá học viên */}
        <div className="animate-slide-up flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-400 mb-16 [animation-delay:0.35s]">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#080d1c]">
                A
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#080d1c]">
                M
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#080d1c]">
                H
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-[#080d1c]">
                K
              </div>
            </div>
            <span>
              <strong className="text-white font-semibold">10,000+</strong> học viên tin dùng
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400" />
              ))}
            </div>
            <span>
              <strong className="text-white font-semibold">4.9/5</strong> điểm đánh giá
            </span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-700 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Award size={17} className="text-emerald-400" />
            <span>
              <strong className="text-white font-semibold">95%</strong> đạt mục tiêu cam kết
            </span>
          </div>
        </div>

        {/* Khung mô phỏng không gian học tập (Workspace Preview) */}
        <WorkspaceMockup />
      </div>
    </section>
  );
}
export default HeroSection;
