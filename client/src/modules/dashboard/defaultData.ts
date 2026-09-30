import type { UserStudyGoal, DailyGoalItem, SkillActivityStat, ExamHistoryItem } from "./types";

/**
 * ==============================================================================
 * FILE: defaultData.ts
 * MỤC ĐÍCH: Cung cấp dữ liệu mặc định, các bộ preset điểm chuẩn ETS và danh sách
 *           thống kê ban đầu cho Dashboard TOEIC Master AI.
 * ==============================================================================
 */

/** Key lưu trữ dữ liệu mục tiêu học viên trong LocalStorage */
export const STUDY_GOAL_STORAGE_KEY = "toeic_master_study_goal";

/**
 * Mục tiêu mặc định đề xuất nếu học viên chưa hoàn thành Onboarding
 */
export const DEFAULT_STUDY_GOAL: UserStudyGoal = {
  currentScore: 0,
  targetScore: 0,
  examDate: "",
  dailyStudyMinutes: 0,
  hasCompletedOnboarding: false,
  streakDays: 0,
  longestStreak: 0,
  totalXP: 0,
  level: 1,
};

/**
 * Các mốc điểm mục tiêu phổ biến của kỳ thi TOEIC ETS
 */
export const TOEIC_SCORE_PRESETS = [
  {
    score: 500,
    label: "500 Căn bản",
    desc: "Tốt nghiệp ĐH & Giao tiếp cơ bản",
    color: "#38bdf8",
  },
  {
    score: 650,
    label: "650 Khá",
    desc: "Chuẩn tuyển dụng công sở",
    color: "#818cf8",
  },
  {
    score: 750,
    label: "750 Nâng cao",
    desc: "Tự tin ứng tuyển công ty đa quốc gia",
    color: "#a855f7",
  },
  {
    score: 850,
    label: "850 Chuyên gia",
    desc: "Làm việc quốc tế & học bổng du học",
    color: "#ec4899",
  },
  {
    score: 950,
    label: "950+ Bậc thầy",
    desc: "Thành thạo gần như người bản xứ",
    color: "#f59e0b",
  },
];

/**
 * Các mốc thời gian học cam kết mỗi ngày
 */
export const DAILY_STUDY_PRESETS = [
  {
    minutes: 30,
    label: "30 phút",
    tag: "Nhẹ nhàng",
    desc: "Duy trì phản xạ hàng ngày",
  },
  {
    minutes: 60,
    label: "1 giờ (60p)",
    tag: "Khuyên dùng",
    desc: "Lộ trình tối ưu chuẩn AI ETS",
    isRecommended: true,
  },
  {
    minutes: 90,
    label: "1.5 giờ (90p)",
    tag: "Cấp tốc",
    desc: "Cần bứt phá điểm số gấp",
  },
  {
    minutes: 120,
    label: "2 giờ (120p)",
    tag: "Chiến binh",
    desc: "Toàn tâm bứt phá điểm số tối đa",
  },
];

/**
 * Danh sách 5 mục tiêu học tập hàng ngày mặc định (ban đầu toàn bộ số câu = 0)
 */
export const DEFAULT_DAILY_GOALS: DailyGoalItem[] = [
  {
    id: "goal-reading",
    skill: "reading",
    title: "Đọc hiểu (Part 5 - 7)",
    current: 0,
    target: 30,
    unit: "câu",
    color: "#10b981",
    completed: false,
  },
  {
    id: "goal-listening",
    skill: "listening",
    title: "Nghe hiểu (Part 1 - 4)",
    current: 0,
    target: 30,
    unit: "câu",
    color: "#06b6d4",
    completed: false,
  },
  {
    id: "goal-vocab",
    skill: "vocabulary",
    title: "Từ vựng trọng tâm",
    current: 0,
    target: 20,
    unit: "từ",
    color: "#f59e0b",
    completed: false,
  },
  {
    id: "goal-exam",
    skill: "exam",
    title: "Luyện giải đề ETS",
    current: 0,
    target: 40,
    unit: "câu",
    color: "#6366f1",
    completed: false,
  },
  {
    id: "goal-video",
    skill: "video",
    title: "Video chiến thuật",
    current: 0,
    target: 2,
    unit: "bài",
    color: "#ec4899",
    completed: false,
  },
];

/**
 * Danh sách 8 kỹ năng & hoạt động trong ma trận học tập (ban đầu toàn bộ = 0)
 */
export const DEFAULT_SKILL_STATS: SkillActivityStat[] = [
  {
    id: "study-time",
    title: "Thời gian học",
    value: "0m",
    subValue: "Hôm nay · Chưa học",
    iconName: "Clock",
    color: "#6366f1",
    actionUrl: "#time",
  },
  {
    id: "mock-test",
    title: "Luyện đề ETS",
    value: "0 câu",
    subValue: "Hôm nay · Chưa luyện",
    iconName: "FileQuestion",
    color: "#06b6d4",
    actionUrl: "/exam",
  },
  {
    id: "reading",
    title: "Đọc hiểu",
    value: "0 câu",
    subValue: "Hôm nay · Chưa luyện",
    iconName: "BookOpen",
    color: "#10b981",
    actionUrl: "/reading",
  },
  {
    id: "listening",
    title: "Nghe hiểu",
    value: "0 câu",
    subValue: "Hôm nay · Chưa luyện",
    iconName: "Headphones",
    color: "#3b82f6",
    actionUrl: "/listening",
  },
  {
    id: "speaking",
    title: "Nói (Speaking AI)",
    badge: "AI Sắp ra",
    value: "Sắp ra",
    subValue: "Phân tích ngữ điệu ETS",
    iconName: "Mic",
    color: "#a855f7",
    isComingSoon: true,
    actionUrl: "#speaking",
  },
  {
    id: "writing",
    title: "Viết (Writing AI)",
    badge: "AI Sắp ra",
    value: "Sắp ra",
    subValue: "Chấm điểm Rubric AI",
    iconName: "PenTool",
    color: "#14b8a6",
    isComingSoon: true,
    actionUrl: "/writing",
  },
  {
    id: "vocabulary",
    title: "Từ vựng cốt lõi",
    value: "0 từ",
    subValue: "Hôm nay · Chưa học từ nào",
    iconName: "BookMarked",
    color: "#f59e0b",
    actionUrl: "/vocabulary",
  },
  {
    id: "video",
    title: "Video bài giảng",
    value: "0 video",
    subValue: "Hôm nay · Chưa xem",
    iconName: "Video",
    color: "#ec4899",
    actionUrl: "#video",
  },
];

/** Key lưu trữ lịch sử làm bài thi của học viên trong LocalStorage */
export const EXAM_HISTORY_STORAGE_KEY = "toeic_master_exam_history";

/**
 * Danh sách lịch sử làm bài thi mẫu mặc định cho học viên
 */
export const DEFAULT_EXAM_HISTORY: ExamHistoryItem[] = [
  {
    id: "hist-001",
    testTitle: "ETS TOEIC 2024 - Test 01 (Full 200 câu)",
    testType: "full",
    completedAt: "25/09/2026 · 15:45",
    durationMinutes: 114,
    totalScore: 735,
    listeningScore: 385,
    readingScore: 350,
    correctAnswers: 151,
    totalQuestions: 200,
    targetAchieved: true,
    aiFeedback:
      "Tốc độ làm bài tốt (còn dư 6 phút). Nghe Part 2 đạt 92% độ chính xác. Cần chú ý cẩn thận bẫy thời thì và liên từ ở Part 5.",
  },
  {
    id: "hist-002",
    testTitle: "ETS TOEIC 2023 - Test 03 (Mini Test 50 câu)",
    testType: "mini",
    completedAt: "23/09/2026 · 20:15",
    durationMinutes: 28,
    totalScore: 690,
    listeningScore: 360,
    readingScore: 330,
    correctAnswers: 36,
    totalQuestions: 50,
    targetAchieved: false,
    aiFeedback:
      "Kỹ năng bắt từ khóa đoạn hội thoại Part 3 cần đẩy nhanh hơn. Từ vựng chuyên ngành hợp đồng & hậu cần cần ôn tập thêm.",
  },
  {
    id: "hist-003",
    testTitle: "ETS TOEIC Luyện tập chuyên sâu Part 5 (30 câu)",
    testType: "part",
    completedAt: "21/09/2026 · 09:30",
    durationMinutes: 18,
    totalScore: 760,
    listeningScore: 0,
    readingScore: 380,
    correctAnswers: 26,
    totalQuestions: 30,
    targetAchieved: true,
    aiFeedback:
      "Nắm rất vững ngữ pháp mệnh đề quan hệ rút gọn và đại từ phân bổ. Đã đạt mục tiêu đề ra!",
  },
];
