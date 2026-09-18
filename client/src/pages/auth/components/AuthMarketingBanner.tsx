import { useState, useEffect } from "react";
import { Sparkles, Award } from "lucide-react";
import studentHeadphone from "../../../assets/student_headphone.jpg";
import studentMale from "../../../assets/student_male.jpg";

const SLIDES = [
  {
    title: "Bứt Phá Điểm Số TOEIC Cùng AI",
    desc: "Chẩn đoán chính xác lỗ hổng ngữ pháp và từ vựng, tự động đề xuất bài tập tối ưu theo chuẩn cấu trúc ETS 2026.",
    action: "Khám phá lộ trình AI",
    badge: "Mục tiêu 850+",
  },
  {
    title: "Listening Lab & AI Pronounce",
    desc: "Luyện nghe phản xạ giọng Anh - Mỹ - Úc - Canada với phân tích sóng âm và transcript tương tác tức thì.",
    action: "Thử luyện nghe ngay",
    badge: "Listening tối đa 495đ",
  },
  {
    title: "Kho 3,000+ Từ Vựng Trọng Tâm",
    desc: "Ghi nhớ siêu tốc bằng kỹ thuật Spaced Repetition kết hợp ngữ cảnh đề thi thật ETS hàng năm.",
    action: "Bắt đầu học từ vựng",
    badge: "Ghi nhớ lâu hơn gấp 3 lần",
  },
];

export function AuthMarketingBanner() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lg:col-span-6 xl:col-span-7 bg-[#060c1d] relative overflow-hidden p-7 sm:p-10 lg:p-12 flex flex-col justify-between text-white select-none">
      {/* LỚP HÌNH HỌC NGHỆ THUẬT */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Cánh lá gradient ngọc bích sang xanh cyan góc trên trái */}
        <div className="absolute -top-10 left-8 sm:left-12 w-44 h-72 rounded-full bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-500 transform -rotate-12 opacity-95 shadow-2xl" />

        {/* Hình bán nguyệt xanh navy góc trên phải */}
        <div className="absolute top-0 right-14 w-56 h-56 rounded-full bg-[#121f47] opacity-80" />

        {/* Vòng tròn đỏ san hô lớn ôm lấy học viên đeo tai nghe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[55%] w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-[#ff3b30] shadow-2xl flex items-center justify-center z-10" />

        {/* Các góc phần tư cung tròn xanh đậm bên phải */}
        <div className="absolute top-12 -right-8 w-48 h-48 rounded-full bg-[#172958]" />
        <div className="absolute top-44 right-12 w-32 h-32 rounded-full bg-[#0d1c42]" />

        {/* Đường cong đỏ bên trái */}
        <div className="absolute top-1/2 -left-6 -translate-y-8 w-36 h-24 rounded-full bg-[#ff3b30] opacity-95" />

        {/* Bong bóng hình học vàng hổ phách góc dưới trái */}
        <div className="absolute bottom-20 -left-6 w-24 h-24 rounded-full bg-amber-500/80 blur-[1px]" />

        {/* Vòng tròn điểm xuyết xanh cyan */}
        <div className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />

        {/* Cánh lá gradient xanh ngọc góc dưới phải */}
        <div className="absolute top-52 right-0 w-32 h-44 rounded-full bg-gradient-to-t from-emerald-500 to-teal-400 opacity-90" />

        {/* Khối hình học tối phía dưới */}
        <div className="absolute -bottom-16 right-16 w-60 h-60 rounded-full bg-[#0f1d44] opacity-90" />
      </div>

      {/* HÌNH ẢNH HỌC VIÊN THỰC TẾ LỒNG TRÊN CÁC KHỐI HÌNH HỌC */}
      {/* Học viên nam đội mũ beret ở khung tròn phía trên */}
      <div className="absolute top-5 left-1/2 -translate-x-[30%] z-20">
        <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-xl ring-2 ring-white/50 overflow-hidden group hover:scale-105 transition-transform duration-300">
          <img
            src={studentMale}
            alt="TOEIC Achiever"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Nữ học viên đeo tai nghe vàng học Listening ở trung tâm */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-[55%] z-20">
        <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden p-1.5 ring-4 ring-white/40 shadow-2xl group hover:scale-[1.02] transition-transform duration-300">
          <img
            src={studentHeadphone}
            alt="Student studying TOEIC with headphones"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Huy hiệu điểm số TOEIC 920 ở góc trên phải */}
      <div className="absolute top-24 right-4 sm:right-6 z-20">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-xl ring-2 ring-white/40 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex flex-col items-center justify-center text-center p-1 shadow-inner">
            <span className="text-[10px] font-bold text-amber-300 leading-tight">
              TOEIC
            </span>
            <span className="text-sm sm:text-base font-black text-white leading-none">
              920
            </span>
            <span className="text-[8px] text-cyan-200">ETS 2026</span>
          </div>
        </div>
      </div>

      {/* Huy hiệu thành tích +250đ Listening ở góc dưới phải */}
      <div className="absolute bottom-28 right-3 sm:right-5 z-20">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-white/20 backdrop-blur-md shadow-xl ring-2 ring-white/40 overflow-hidden flex items-center justify-center bg-slate-900/80">
          <div className="flex flex-col items-center justify-center text-center">
            <Award size={18} className="text-amber-400 mb-0.5" />
            <span className="text-[9px] font-bold text-white leading-none">
              +250đ
            </span>
            <span className="text-[8px] text-emerald-400 font-medium">
              Listening
            </span>
          </div>
        </div>
      </div>

      {/* Huy hiệu nổi thông tin mục tiêu ở góc trên */}
      <div className="relative z-20 flex justify-end">
        <div className="inline-flex items-center gap-1.5 bg-indigo-950/80 border border-indigo-400/40 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-lg">
          <Sparkles size={12} className="text-cyan-400 animate-pulse" />
          <span>{SLIDES[activeSlide].badge}</span>
        </div>
      </div>

      {/* KHU VỰC NỘI DUNG DƯỚI (Tiêu đề, nút hành động & chấm chuyển slide) */}
      <div className="relative z-20 pt-48 sm:pt-56">
        <div className="max-w-md">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            {SLIDES[activeSlide].title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 font-normal">
            {SLIDES[activeSlide].desc}
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => alert(`Xem chi tiết: ${SLIDES[activeSlide].title}`)}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 transition-all hover:scale-105 cursor-pointer"
            >
              {SLIDES[activeSlide].action}
            </button>
          </div>
        </div>

        {/* Các chấm tròn chỉ báo slide chuyển đổi */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeSlide === idx
                  ? "w-6 h-2 bg-white shadow-sm"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
