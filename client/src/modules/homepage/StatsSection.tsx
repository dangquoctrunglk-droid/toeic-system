import { useCountUp } from "../../hooks";
import { statsConfig } from "./data";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: StatsSection.tsx (Module Homepage)
 * MỤC ĐÍCH: Trình bày số liệu thống kê thành tích của hệ thống TOEIC Master
 * TÍNH NĂNG:
 *   - 4 thẻ số liệu thống kê (Học viên, Đề thi, Tỷ lệ đỗ, Điểm tăng trung bình)
 *   - Hiệu ứng nhảy số sống động theo thời gian thực qua hook useCountUp
 *   - Nền ánh sáng tím mờ tinh tế tạo chiều sâu
 * ==============================================================================
 */

/**
 * # Interface định nghĩa Props của thẻ thống kê đơn
 */
interface SingleStatProps {
  target: number;
  label: string;
  prefix?: string;
  suffix: string;
  icon: (typeof statsConfig)[0]["icon"];
  color: string;
}

/**
 * # Component con hiển thị một thẻ số liệu đơn với hiệu ứng đếm số
 */
function SingleStatCard({
  target,
  label,
  prefix = "",
  suffix,
  icon: Icon,
  color,
}: SingleStatProps) {
  const { count, ref } = useCountUp(target);
  const { isDarkMode } = useTheme();

  return (
    <div
      ref={ref}
      className={`text-center p-8 sm:p-10 rounded-2xl hover:-translate-y-1 transition-all border ${
        isDarkMode
          ? "bg-[#0e162e]/60 border-indigo-500/15 hover:border-indigo-500/30 backdrop-blur-sm"
          : "bg-white border-slate-200 hover:border-indigo-300 shadow-md shadow-slate-200/50"
      }`}
    >
      <div
        className="w-13 h-13 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{
          background: `${color}15`,
          color,
          border: `1px solid ${color}30`,
        }}
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
      <div
        className={`text-sm font-medium ${
          isDarkMode ? "text-slate-300" : "text-slate-600"
        }`}
      >
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
