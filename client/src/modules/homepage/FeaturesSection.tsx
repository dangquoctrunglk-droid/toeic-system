import { Zap, ChevronRight } from "lucide-react";
import { featuresData } from "./data";
import { useInView } from "../../hooks";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: FeaturesSection.tsx (Module Homepage)
 * MỤC ĐÍCH: Giới thiệu hệ sinh thái các tính năng luyện thi TOEIC 4 kỹ năng
 * TÍNH NĂNG:
 *   - Lưới hiển thị 6 thẻ tính năng chuẩn ETS (Listening, Reading, Writing AI, Đề thi, Từ vựng, Báo cáo)
 *   - Mỗi thẻ có biểu tượng (Icon) tùy biến màu sắc, huy hiệu thể loại (Badge)
 *   - Hiệu ứng xuất hiện mượt mà khi người dùng cuộn đến vị trí qua hook useInView
 *   - Hiệu ứng hover nổi bật nâng thẻ và chuyển màu viền
 * ==============================================================================
 */

export function FeaturesSection() {
  const { ref, isInView } = useInView();
  const { isDarkMode } = useTheme();

  return (
    <section className="py-24 sm:py-32 relative" id="courses" ref={ref}>
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
            <Zap size={14} className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />
            HỆ SINH THÁI HỌC TOÀN DIỆN
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Mọi Công Cụ Bạn Cần Để
            <br />
            <span className="gradient-text">Chinh Phục 800+ TOEIC</span>
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              isDarkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Học thông minh hơn nhờ sự kết hợp giữa phương pháp sư phạm hiện đại
            và công nghệ trí tuệ nhân tạo cá nhân hóa theo từng cá nhân.
          </p>
        </div>

        {/* Lưới danh sách tính năng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuresData.map((feature, i) => (
            <a
              key={feature.title}
              href={feature.link}
              className={`group relative rounded-2xl p-7 sm:p-8 no-underline transition-all duration-300 flex flex-col justify-between border ${
                isDarkMode
                  ? "bg-[#0e162e]/70 border-indigo-500/15 hover:border-indigo-500/40 hover:bg-[#121c3b] hover:shadow-2xl hover:shadow-indigo-950/50 backdrop-blur-sm"
                  : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-100"
              } hover:-translate-y-1.5 ${isInView ? "animate-slide-up" : "opacity-0"}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-13 h-13 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${feature.color}15`,
                      color: feature.color,
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    <feature.icon size={26} />
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{
                      background: `${feature.color}15`,
                      color: feature.color,
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    {feature.badge}
                  </span>
                </div>
                <h3
                  className={`text-xl font-bold mb-2.5 transition-colors ${
                    isDarkMode
                      ? "text-white group-hover:text-indigo-300"
                      : "text-slate-900 group-hover:text-indigo-600"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {feature.desc}
                </p>
              </div>

              <div
                className={`flex items-center gap-1.5 text-xs font-semibold mt-6 group-hover:translate-x-1 transition-transform ${
                  isDarkMode ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                <span>Khám phá ngay</span>
                <ChevronRight size={14} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FeaturesSection;

