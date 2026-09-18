import { useCountUp } from '../../../hooks';
import { statsConfig } from '../data';

interface SingleStatProps {
  target: number;
  label: string;
  prefix?: string;
  suffix: string;
  icon: (typeof statsConfig)[0]['icon'];
  color: string;
}

function SingleStatCard({ target, label, prefix = '', suffix, icon: Icon, color }: SingleStatProps) {
  const { count, ref } = useCountUp(target);

  return (
    <div
      ref={ref}
      className="text-center p-8 sm:p-10 bg-[#0e162e]/60 border border-indigo-500/15 rounded-2xl hover:border-indigo-500/30 hover:-translate-y-1 transition-all backdrop-blur-sm"
    >
      <div
        className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
      >
        <Icon size={26} />
      </div>
      <div
        className="text-4xl sm:text-5xl font-black tracking-tight mb-2"
        style={{ color }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm font-medium text-slate-300">
        {label}
      </div>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Nền hiệu ứng ánh sáng tím mờ */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Lưới 4 thẻ thống kê ấn tượng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsConfig.map((stat, i) => (
            <SingleStatCard
              key={i}
              target={stat.target}
              label={stat.label}
              prefix={stat.prefix}
              suffix={stat.suffix}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
export default StatsSection;
