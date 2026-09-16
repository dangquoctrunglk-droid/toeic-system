import { Star, TrendingUp } from 'lucide-react';
import { testimonialsData } from '../data';
import { useInView } from '../../../hooks';

export function TestimonialsSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 sm:py-32 relative" id="testimonials" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-[1.5px] uppercase px-4 py-2 rounded-full mb-4">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            CẢM NHẬN THỰC TẾ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-5">
            Học Viên Nói Gì Về
            <br />
            <span className="gradient-text">Hành Trình Chinh Phục TOEIC</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Hàng nghìn bạn trẻ đã đạt điểm mục tiêu để ra trường, xin việc và thăng tiến sự nghiệp.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item, i) => (
            <div
              key={item.name}
              className={`bg-[#0e162e]/70 border border-indigo-500/15 rounded-2xl p-7 sm:p-8 flex flex-col justify-between hover:border-indigo-500/35 hover:-translate-y-1.5 transition-all backdrop-blur-sm ${
                isInView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div>
                {/* User info */}
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
                    <h3 className="text-base font-bold text-white">{item.name}</h3>
                    <p className="text-xs text-slate-400">{item.role}</p>
                  </div>
                </div>

                {/* Score badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg mb-5">
                  <TrendingUp size={14} />
                  <span>Bứt phá: {item.score} TOEIC</span>
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-300 leading-relaxed mb-6 italic">
                  &quot;{item.content}&quot;
                </p>
              </div>

              {/* Stars */}
              <div className="flex text-amber-400 gap-1 pt-2 border-t border-slate-800/80">
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
