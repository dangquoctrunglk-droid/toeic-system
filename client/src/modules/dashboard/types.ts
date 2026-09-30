/**
 * ==============================================================================
 * MODULE: Dashboard Types (types.ts)
 * MỤC ĐÍCH: Định nghĩa toàn bộ kiểu dữ liệu cho giao diện học tập Dashboard và
 *           luồng Onboarding thiết lập mục tiêu học viên TOEIC Master AI.
 * ==============================================================================
 */

/**
 * Mục tiêu học tập cá nhân hóa của học viên
 * Lưu trữ trong LocalStorage hoặc cơ sở dữ liệu người dùng
 */
export interface UserStudyGoal {
  /** Điểm thi thử hoặc điểm đánh giá hiện tại (10 - 990) */
  currentScore: number;
  /** Điểm mục tiêu kỳ vọng đạt được (10 - 990) */
  targetScore: number;
  /** Ngày thi chính thức dự kiến (chuỗi định dạng YYYY-MM-DD) */
  examDate: string;
  /** Thời lượng học cam kết mỗi ngày (tính theo phút, ví dụ: 30, 45, 60, 90, 120) */
  dailyStudyMinutes: number;
  /** Trạng thái đã hoàn thành thiết lập mục tiêu lần đầu hay chưa */
  hasCompletedOnboarding: boolean;
  /** Chuỗi ngày học liên tục (Streak) */
  streakDays: number;
  /** Kỷ lục chuỗi ngày học dài nhất */
  longestStreak: number;
  /** Điểm kinh nghiệm AI XP tích lũy */
  totalXP: number;
  /** Cấp độ học viên (ví dụ: Level 1, Level 2, ...) */
  level: number;
}

/**
 * Dữ liệu nhiệm vụ học tập hàng ngày
 */
export interface DailyGoalItem {
  id: string;
  skill: "reading" | "listening" | "vocabulary" | "exam" | "video" | "writing" | "speaking";
  title: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  completed: boolean;
}

/**
 * Thống kê hoạt động của một kỹ năng hoặc công cụ học tập
 */
export interface SkillActivityStat {
  id: string;
  title: string;
  badge?: string;
  value: string | number;
  subValue: string;
  iconName: string;
  color: string;
  isComingSoon?: boolean;
  actionUrl: string;
}

/**
 * Các khoảng thời gian hỗ trợ trong bộ lọc thống kê Dashboard
 */
export type TimeFilterPeriod = "today" | "week" | "month" | "all";

/**
 * Kiểu dữ liệu cho một lượt thi / làm bài trong lịch sử học viên
 */
export interface ExamHistoryItem {
  id: string;
  testTitle: string;
  testType: "full" | "mini" | "listening" | "reading" | "part";
  completedAt: string;
  durationMinutes: number;
  totalScore: number;
  listeningScore: number;
  readingScore: number;
  correctAnswers: number;
  totalQuestions: number;
  targetAchieved: boolean;
  aiFeedback: string;
}
