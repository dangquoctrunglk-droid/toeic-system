import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/90 via-[#0d1633] to-slate-950 border border-indigo-500/30 p-8 sm:p-14 text-center overflow-hidden shadow-2xl shadow-black/80">
          {/* Vòng tròn ánh sáng mờ trang trí bên trong */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-6">
              <Zap size={13} className="text-cyan-400" />
              BẮT ĐẦU NGAY HÔM NAY
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-5">
              Sẵn Sàng Bứt Phá Điểm Số
              <br />
              <span className="gradient-text">TOEIC Mơ Ước Của Bạn?</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-9">
              Gia nhập cùng hơn 10,000 học viên đang nâng cao trình độ tiếng Anh mỗi ngày.
              Đăng ký tài khoản miễn phí và làm bài test 15 phút ngay bây giờ.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/auth/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white text-base font-semibold px-8 py-4 rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all"
              >
                <Zap size={18} className="text-cyan-300" />
                Đăng ký tài khoản miễn phí
              </Link>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 bg-slate-900/80 border border-indigo-500/25 text-slate-200 text-base font-semibold px-7 py-4 rounded-xl hover:bg-indigo-500/10 hover:text-white transition-all"
              >
                Xem các khóa luyện thi
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
