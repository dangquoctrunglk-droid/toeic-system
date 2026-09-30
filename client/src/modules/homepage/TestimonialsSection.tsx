import { Star, TrendingUp } from "lucide-react";
import { testimonialsData } from "./data";
import { useInView } from "../../hooks";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: TestimonialsSection.tsx (Module Homepage)
 * MỤC ĐÍCH: Trưng bày phản hồi và thành tích thực tế của học viên TOEIC Master
 * TÍNH NĂNG:
 *   - Lưới đánh giá của các học viên tiêu biểu (Sinh viên Ngoại Thương, Software Engineer, Giáo viên)
 *   - Huy hiệu điểm số tăng vọt (ví dụ: 450 -> 820)
 *   - Đánh giá 5 sao vàng và lời nhận xét trích dẫn chân thực
 * ==============================================================================
 */

export function TestimonialsSection() {
  const { ref, isInView } = useInView();
  const { isDarkMode } = useTheme();

  return (
    <section className="py-24 sm:py-32 relative" id="testimonials" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề mục */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span
            className={`inline-flex items-center gap-2 text-xs font-bold tracking-[1.5px] uppercase px-4 py-2 rounded-full mb-4 border ${
              isDarkMode
                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300"
                : "bg-indigo-50 border-indigo-200 text-indigo-700"
            }`}
          >
            <Star size={14} className="text-amber-400 fill-amber-400" />
            CẢM NHẬN THỰC TẾ
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Học Viên Nói Gì Về
            <br />
            <span className="gradient-text">Hành Trình Chinh Phục TOEIC</span>
          </h2>
          <p className={`text-base sm:text-lg ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
            Hàng nghìn bạn trẻ đã đạt điểm mục tiêu để ra trường, xin việc và thăng tiến sự nghiệp.
          </p>
        </div>

        {/* Thẻ đánh giá của học viên */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item, i) => (
            <div
              key={item.name}
              className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all border ${
                isDarkMode
                  ? "bg-[#0e162e]/70 border-indigo-500/15 hover:border-indigo-500/35 backdrop-blur-sm"
                  : "bg-white border-slate-200 hover:border-indigo-300 shadow-md shadow-slate-200/50 hover:shadow-xl"
              } ${isInView ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div>
                {/* Thông tin học viên */}
                <div className="flex items-center gap-3.5 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}99)`,
                    }}
                  >
                    {item.avatar}
                  </div>
                  <div>
                    <h3
                      className={`text-base font-bold ${
                        isDarkMode ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Huy hiệu điểm số đạt được */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-bold px-3 py-1.5 rounded-lg mb-5">
                  <TrendingUp size={14} />
                  <span>Bứt phá: {item.score} TOEIC</span>
                </div>

                {/* Lời nhận xét */}
                <p
                  className={`text-sm leading-relaxed mb-6 italic ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  &quot;{item.content}&quot;
                </p>
              </div>

              {/* Đánh giá số sao */}
              <div
                className={`flex text-amber-400 gap-1 pt-2 border-t ${
                  isDarkMode ? "border-slate-800/80" : "border-slate-100"
                }`}
              >
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} size={15} className="fill-amber-400" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default TestimonialsSection;
