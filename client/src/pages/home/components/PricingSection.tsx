import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { pricingPlans } from '../data';
import { useInView } from '../../../hooks';

export function PricingSection() {
  const { ref, isInView } = useInView();

  return (
    <section className="py-24 sm:py-32 relative" id="pricing" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề mục */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold tracking-[1.5px] uppercase px-4 py-2 rounded-full mb-4">
            <Award size={14} className="text-indigo-400" />
            BẢNG GIÁ MINH BẠCH
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-5">
            Đầu Tư Thông Minh Cho
            <br />
            <span className="gradient-text">Tương Lai Sự Nghiệp</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Chọn gói học phù hợp với quỹ thời gian và mục tiêu điểm số của bạn.
            Hủy bất kỳ lúc nào.
          </p>
        </div>

        {/* Lưới thẻ bảng giá */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-6">
          {pricingPlans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-[#101938] border-2 border-indigo-500/50 shadow-2xl shadow-indigo-950/80 lg:-translate-y-3'
                  : 'bg-[#0e162e]/70 border border-indigo-500/15 hover:border-indigo-500/35 backdrop-blur-sm'
              } ${isInView ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Huy hiệu gói phổ biến nhất */}
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-indigo-500/40 whitespace-nowrap">
                  GÓI ĐƯỢC CHỌN NHIỀU NHẤT
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">{plan.desc}</p>

                {/* Hiển thị mức giá */}
                <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-slate-800">
                  <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                    {plan.price}
                  </span>
                  {plan.unit && (
                    <span className="text-sm font-semibold text-slate-400">
                      {plan.unit}
                    </span>
                  )}
                </div>

                {/* Danh sách tính năng của gói */}
                <ul className="flex flex-col gap-3.5 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2
                        size={17}
                        className="shrink-0 mt-0.5"
                        style={{ color: plan.popular ? '#22d3ee' : '#10b981' }}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nút kêu gọi hành động */}
              {plan.ctaLink.startsWith('/') ? (
                <Link
                  to={plan.ctaLink}
                  className={`w-full py-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110'
                      : 'bg-slate-900 border border-indigo-500/25 text-slate-200 hover:bg-indigo-500/10 hover:text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <a
                  href={plan.ctaLink}
                  className={`w-full py-4 rounded-xl text-center text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-110'
                      : 'bg-slate-900 border border-indigo-500/25 text-slate-200 hover:bg-indigo-500/10 hover:text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={15} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default PricingSection;
