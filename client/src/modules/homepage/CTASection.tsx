import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: CTASection.tsx (Module Homepage)
 * MỤC ĐÍCH: Khối kêu gọi hành động (Call To Action) chốt chuyển đổi ở cuối trang chủ
 * TÍNH NĂNG:
 *   - Khối banner bo cong viền lớn với ánh sáng gradient xanh tím hiện đại
 *   - Tiêu đề kích thích người học bứt phá điểm số TOEIC
 *   - Nút Đăng ký tài khoản miễn phí nổi bật và Nút xem các khóa luyện thi
 * ==============================================================================
 */

export function CTASection() {
  const { isDarkMode } = useTheme();

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`relative rounded-3xl p-8 sm:p-14 text-center overflow-hidden border transition-all duration-300 ${
            isDarkMode
              ? "bg-gradient-to-r from-indigo-950/90 via-[#0d1633] to-slate-950 border-indigo-500/30 shadow-2xl shadow-black/80"
              : "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 border-indigo-400/40 shadow-2xl shadow-indigo-500/25"
          }`}
        >
          {/* Vòng tròn ánh sáng mờ trang trí bên trong */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-6 border transition-colors ${
                isDarkMode
                  ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                  : "bg-white/15 border-white/30 text-white backdrop-blur-md"
              }`}
            >
              <Zap size={13} className={isDarkMode ? "text-cyan-400" : "text-amber-300"} />
              BẮT ĐẦU NGAY HÔM NAY
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-5 !text-white">
              Sẵn Sàng Bứt Phá Điểm Số
              <br />
              <span className={isDarkMode ? "gradient-text" : "text-cyan-200 drop-shadow-sm"}>
                TOEIC Mơ Ước Của Bạn?
              </span>
            </h2>

            <p className="text-base sm:text-lg leading-relaxed mb-9 !text-indigo-100/90">
              Gia nhập cùng hơn 10,000 học viên đang nâng cao trình độ tiếng Anh mỗi ngày.
              Đăng ký tài khoản miễn phí và làm bài test 15 phút ngay bây giờ.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/auth/signup"
                className={`inline-flex items-center gap-2 text-base font-bold px-8 py-4 rounded-xl shadow-xl hover:-translate-y-0.5 transition-all ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    : "bg-white text-indigo-700 hover:bg-slate-50 shadow-indigo-950/20 hover:text-indigo-800"
                }`}
              >
                <Zap
                  size={18}
                  className={isDarkMode ? "text-cyan-300" : "text-amber-500 fill-amber-500"}
                />
                Đăng ký tài khoản miễn phí
              </Link>
              <a
                href="#courses"
                className={`inline-flex items-center gap-2 text-base font-semibold px-7 py-4 rounded-xl hover:-translate-y-0.5 transition-all border ${
                  isDarkMode
                    ? "bg-slate-900/80 border-indigo-500/25 text-slate-200 hover:bg-indigo-500/10 hover:text-white"
                    : "bg-white/15 border-white/30 text-white hover:bg-white/25 backdrop-blur-md"
                }`}
              >
                <span>Xem các khóa luyện thi</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default CTASection;
