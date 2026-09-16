import { Zap, ChevronRight } from 'lucide-react';
import { featuresData } from '../data';
import { useInView } from '../../../hooks';

export function FeaturesSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 sm:py-32 relative" id="courses" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-[1.5px] uppercase px-4 py-2 rounded-full mb-4">
            <Zap size={14} className="text-indigo-400" />
            HỆ SINH THÁI HỌC TOÀN DIỆN
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-5">
            Mọi Công Cụ Bạn Cần Để
            <br />
            <span className="gradient-text">Chinh Phục 800+ TOEIC</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Học thông minh hơn nhờ sự kết hợp giữa phương pháp sư phạm hiện đại
            và công nghệ trí tuệ nhân tạo cá nhân hóa theo từng cá nhân.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuresData.map((feature, i) => (
            <a
              key={feature.title}
              href={feature.link}
              className={`group relative bg-[#0e162e]/70 border border-indigo-500/15 rounded-2xl p-7 sm:p-8 no-underline transition-all duration-300 hover:border-indigo-500/40 hover:bg-[#121c3b] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-950/50 backdrop-blur-sm flex flex-col justify-between ${
                isInView ? 'animate-slide-up' : 'opacity-0'
              }`}
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

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {feature.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-sm font-semibold text-indigo-400 group-hover:text-cyan-300 group-hover:gap-2.5 transition-all">
                <span>Khám phá ngay</span>
                <ChevronRight size={16} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
export default FeaturesSection;
