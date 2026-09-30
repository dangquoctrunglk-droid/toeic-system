import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../context";
import {
  DashboardHeader,
  DashboardMetricsRow,
  SkillTrackerGrid,
  DailyGoalProgress,
  OnboardingModal,
  STUDY_GOAL_STORAGE_KEY,
  DEFAULT_STUDY_GOAL,
  type UserStudyGoal,
} from "../../modules/dashboard";

/**
 * ==============================================================================
 * TRANG HỌC VIÊN: DashboardPage.tsx (/dashboard)
 * MỤC ĐÍCH: Không gian làm việc cá nhân hóa của học viên sau khi đăng nhập:
 *   1. Tự động kích hoạt OnboardingModal khi học viên đăng nhập lần đầu tiên để hỏi:
 *      - Điểm thi thử hiện tại
 *      - Mục tiêu điểm số TOEIC kỳ vọng
 *      - Ngày thi chính thức dự kiến
 *      - Thời lượng học cam kết mỗi ngày (ví dụ 1 giờ/ngày)
 *   2. Bảng điều khiển phân tích thông minh:
 *      - Hàng ngang 4 khối: Điểm số của bạn, Điểm còn thiếu, Đếm ngược ngày thi, Động lực học
 *      - Kế hoạch 5 mục tiêu ngày hôm nay
 *      - Ma trận 8 kỹ năng & hoạt động học tập kèm bộ lọc Hôm nay/Tuần/Tháng
 *      - Lối tắt nhanh sang các trang riêng biệt: /history (Lịch sử bài làm) & /profile (Hồ sơ cá nhân)
 *   3. Tương thích toàn diện cả Light Mode và Dark Mode chuẩn TOEIC Master AI.
 * ==============================================================================
 */

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Tên hiển thị của học viên: Họ tên -> Email -> Mặc định "Học viên"
  const displayName =
    user?.fullName ||
    user?.fullname ||
    user?.email?.split("@")[0] ||
    "Học viên";

  // Key lưu trữ mục tiêu học tập theo từng tài khoản học viên đăng nhập
  const userStorageKey = user?.email
    ? `${STUDY_GOAL_STORAGE_KEY}_${user.email}`
    : STUDY_GOAL_STORAGE_KEY;

  // Khởi tạo trạng thái mục tiêu học tập từ localStorage theo tài khoản người đăng nhập
  const [studyGoal, setStudyGoal] = useState<UserStudyGoal>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Lỗi khi đọc mục tiêu học tập từ localStorage:", e);
    }
    return DEFAULT_STUDY_GOAL;
  });

  // Trạng thái hiển thị OnboardingModal (Tự động bật nếu tài khoản này chưa hoàn thành onboarding)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(userStorageKey);
      if (!saved) return true; // Lần đầu người này đăng nhập -> BẬT MODAL
      const parsed = JSON.parse(saved);
      return !parsed.hasCompletedOnboarding;
    } catch {
      return true;
    }
  });

  // Lưu trạng thái mục tiêu vào localStorage theo đúng tài khoản người đăng nhập
  const saveGoalToStorage = (newGoal: UserStudyGoal) => {
    setStudyGoal(newGoal);
    try {
      localStorage.setItem(userStorageKey, JSON.stringify(newGoal));
    } catch (e) {
      console.error("Lỗi khi lưu mục tiêu học tập:", e);
    }
  };

  // Cập nhật điểm thi thử hiện tại
  const handleUpdateCurrentScore = (newScore: number) => {
    saveGoalToStorage({ ...studyGoal, currentScore: newScore });
  };

  // Cập nhật điểm mục tiêu
  const handleUpdateTargetScore = (newScore: number) => {
    saveGoalToStorage({ ...studyGoal, targetScore: newScore });
  };

  // Cập nhật ngày thi chính thức
  const handleUpdateExamDate = (newDate: string) => {
    saveGoalToStorage({ ...studyGoal, examDate: newDate });
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-200 ${
        isDarkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* 1. KHỐI CHÀO MỪNG AI MENTOR & THÔNG TIN HỌC VIÊN */}
        <DashboardHeader
          displayName={displayName}
          goal={studyGoal}
          onOpenGoalSettings={() => setIsOnboardingOpen(true)}
        />

        {/* 2. HÀNG 4 THẺ CHỈ SỐ THỐNG NHẤT: ĐIỂM SỐ - ĐIỂM THIẾU - NGÀY THI - ĐỘNG LỰC */}
        <DashboardMetricsRow
          currentScore={studyGoal.currentScore}
          targetScore={studyGoal.targetScore}
          examDate={studyGoal.examDate}
          streakDays={studyGoal.streakDays}
          longestStreak={studyGoal.longestStreak}
          totalXP={studyGoal.totalXP}
          onUpdateCurrentScore={handleUpdateCurrentScore}
          onUpdateTargetScore={handleUpdateTargetScore}
          onUpdateExamDate={handleUpdateExamDate}
          onOpenSettings={() => setIsOnboardingOpen(true)}
        />

        {/* 4. MỤC TIÊU HỌC TẬP HÔM NAY (5 KỸ NĂNG) */}
        <DailyGoalProgress onOpenSettings={() => setIsOnboardingOpen(true)} />

        {/* 5. MA TRẬN 8 KỸ NĂNG & HOẠT ĐỘNG KÈM BỘ LỌC THỜI GIAN */}
        <SkillTrackerGrid />
      </div>

      {/* 6. MODAL ONBOARDING HỎI MỤC TIÊU LẦN ĐẦU & TÙY CHỈNH */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialGoal={studyGoal}
        onSaveGoal={saveGoalToStorage}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
