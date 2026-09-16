import { Globe } from 'lucide-react';
import { stepsData } from '../data';
import { useInView } from '../../../hooks';

export function HowItWorksSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 sm:py-32 relative" id="practice" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-[1.5px] uppercase px-4 py-2 rounded-full mb-4">
            <Globe size={14} className="text-indigo-400" />
            PHƯƠNG PHÁP HỌC HIỆU QUẢ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-5">
            4 Bước Đơn Giản Để
            <br />
            <span className="gradient-text">Cán Đích Mục Tiêu TOEIC</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Học có kế hoạch rõ ràng mỗi ngày, không lan man, không lãng phí thời gian.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stepsData.map((step, i) => (
            <div
              key={step.num}
              className={`relative p-8 rounded-2xl bg-[#0e162e]/50 border border-indigo-500/15 text-center flex flex-col items-center hover:border-indigo-500/35 hover:-translate-y-1 transition-all ${
                isInView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div
                className="text-xs font-black tracking-[2px] mb-4 px-3 py-1 rounded-full"
                style={{ background: `${step.color}20`, color: step.color }}
              >
                BƯỚC {step.num}
              </div>

              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  background: `${step.color}15`,
                  color: step.color,
                  border: `1px solid ${step.color}30`,
                }}
              >
                <step.icon size={28} />
              </div>

              <h3 className="text-lg font-bold text-white mb-2.5">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default HowItWorksSection;
