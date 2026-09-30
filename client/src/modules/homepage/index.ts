/**
 * ==============================================================================
 * MODULE: Homepage (client/src/modules/homepage)
 * MỤC ĐÍCH: Tập hợp toàn bộ các component và dữ liệu cấu hình cho Trang chủ (Homepage)
 * DANH SÁCH COMPONENT:
 *   1. HeroSection: Banner chào mừng, tiêu đề chính và nút CTA
 *   2. WorkspaceMockup: Giao diện mô phỏng bàn làm việc / học tập TOEIC Master AI
 *   3. FeaturesSection: Giới thiệu hệ sinh thái 6 tính năng 4 kỹ năng
 *   4. StatsSection: Thẻ số liệu thống kê thành tích ấn tượng
 *   5. HowItWorksSection: 4 bước lộ trình học tập hiệu quả
 *   6. TestimonialsSection: Cảm nhận thực tế và điểm số của học viên
 *   7. PricingSection: Bảng giá các gói học tập minh bạch
 *   8. CTASection: Khối kêu gọi hành động đăng ký cuối trang
 * ==============================================================================
 */

export { HeroSection } from "./HeroSection";
export { WorkspaceMockup } from "./WorkspaceMockup";
export { FeaturesSection } from "./FeaturesSection";
export { StatsSection } from "./StatsSection";
export { HowItWorksSection } from "./HowItWorksSection";
export { TestimonialsSection } from "./TestimonialsSection";
export { PricingSection } from "./PricingSection";
export { CTASection } from "./CTASection";

// Xuất dữ liệu cấu hình để các trang hoặc component khác tái sử dụng nếu cần
export * from "./data";
