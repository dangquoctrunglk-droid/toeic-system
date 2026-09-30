import { useAuth } from "../../context";
import DashboardPage from "../dashboard/DashboardPage";
import {
  HeroSection,
  FeaturesSection,
  StatsSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from "../../modules/homepage";

/**
 * ==============================================================================
 * TRANG CHỦ (HomePage.tsx)
 * MỤC ĐÍCH:
 *   - Nếu ĐÃ ĐĂNG NHẬP (isAuthenticated = true): Tự động hiển thị Dashboard học viên
 *   - Nếu CHƯA ĐĂNG NHẬP: Hiển thị Landing Page giới thiệu hệ sinh thái TOEIC Master AI
 * ==============================================================================
 */
export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // Khi học viên đã đăng nhập: Chuyển sang không gian làm việc cá nhân hóa Dashboard
  if (isAuthenticated) {
    return <DashboardPage />;
  }

  // Khi chưa đăng nhập: Hiển thị trang Landing Page giới thiệu
  return (
    <div className="w-full flex flex-col selection:bg-indigo-500 selection:text-white">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}


