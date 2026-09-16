import {
  Headphones,
  BookOpen,
  PenTool,
  FileText,
  Target,
  TrendingUp,
  Sparkles,
  Clock,
  Award,
  Users,
} from 'lucide-react';
import type {
  FeatureItem,
  StatItemConfig,
  StepItem,
  TestimonialItem,
  PricingPlan,
} from '../../types/homeTypes';

export const featuresData: FeatureItem[] = [
  {
    icon: Headphones,
    title: 'Luyện Listening Chuẩn ETS',
    desc: 'Hàng nghìn đoạn audio chuẩn giọng đọc US, UK, AU, CA. Tính năng nghe theo tốc độ 0.8x - 1.5x, hiển thị transcript và giải nghĩa bẫy âm.',
    color: '#6366f1',
    badge: 'Part 1 - 4',
    link: '/listening',
  },
  {
    icon: BookOpen,
    title: 'Luyện Reading Đa Dạng',
    desc: 'Kho bài đọc phong phú bám sát đề thi thật. Giải thích chi tiết cấu trúc câu, từ vựng theo ngữ cảnh và mẹo xử lý đoạn văn dài.',
    color: '#06b6d4',
    badge: 'Part 5 - 7',
    link: '/reading',
  },
  {
    icon: PenTool,
    title: 'AI Chấm Điểm Writing',
    desc: 'Công nghệ AI phân tích bài viết tức thì theo tiêu chuẩn ETS. Nhận xét ngữ pháp, nâng cấp câu văn và đề xuất từ vựng thương mại cao cấp.',
    color: '#10b981',
    badge: 'AI Smart Grader',
    link: '/writing',
  },
  {
    icon: FileText,
    title: 'Phòng Thi Thử 100% Format ETS',
    desc: 'Đề thi chuẩn 200 câu với giao diện mô phỏng phòng thi thật. Bấm giờ tự động, áp lực làm bài thực tế và trả điểm phân tích ngay sau nộp.',
    color: '#f59e0b',
    badge: 'Đề mới 2026',
    link: '/exam',
  },
  {
    icon: Target,
    title: 'Từ Vựng Spaced Repetition',
    desc: 'Hơn 3,000 từ vựng chia theo 50 chủ đề kinh doanh. Thuật toán lặp lại ngắt quãng thông minh giúp khắc sâu từ vựng vào trí nhớ dài hạn.',
    color: '#ec4899',
    badge: 'Flashcard 3D',
    link: '/vocabulary',
  },
  {
    icon: TrendingUp,
    title: 'Dự Đoán Điểm & Báo Cáo',
    desc: 'Biểu đồ radar phân tích điểm mạnh, điểm yếu theo từng phần thi. Đề xuất lộ trình luyện bài tập khắc phục lỗ hổng nhanh chóng.',
    color: '#8b5cf6',
    badge: 'AI Diagnostic',
    link: '/result',
  },
];

export const statsConfig: StatItemConfig[] = [
  { target: 10000, label: 'Học viên đã và đang theo học', prefix: '', suffix: '+', icon: Users, color: '#6366f1' },
  { target: 500, label: 'Đề thi và bài tập chuẩn ETS', prefix: '', suffix: '+', icon: FileText, color: '#06b6d4' },
  { target: 95, label: 'Học viên đạt điểm mục tiêu', prefix: '', suffix: '%', icon: Target, color: '#10b981' },
  { target: 180, label: 'Điểm tăng trung bình sau 2 tháng', prefix: '+', suffix: 'đ', icon: TrendingUp, color: '#f59e0b' },
];

export const stepsData: StepItem[] = [
  {
    num: '01',
    title: 'Làm bài test 15 phút',
    desc: 'Làm bài kiểm tra thích ứng ngắn để hệ thống xác định chính xác trình độ và lỗ hổng kiến thức hiện tại.',
    icon: Target,
    color: '#6366f1',
  },
  {
    num: '02',
    title: 'Nhận lộ trình AI tối ưu',
    desc: 'Thuật toán xây dựng lộ trình học chia theo từng ngày, tập trung 80% thời gian vào các phần bạn hay sai nhất.',
    icon: Sparkles,
    color: '#8b5cf6',
  },
  {
    num: '03',
    title: 'Luyện tập 20 phút mỗi ngày',
    desc: 'Hoàn thành bài luyện Listening, Reading, Writing micro-learning với giải thích chi tiết và AI chấm tức thì.',
    icon: Clock,
    color: '#06b6d4',
  },
  {
    num: '04',
    title: 'Chinh phục điểm thi mơ ước',
    desc: 'Thi thử trên phòng thi mô phỏng, rèn tâm lý phòng thi và tự tin đạt 750+ đến 900+ điểm ETS.',
    icon: Award,
    color: '#10b981',
  },
];

export const testimonialsData: TestimonialItem[] = [
  {
    name: 'Nguyễn Minh Anh',
    role: 'Sinh viên Đại học Ngoại Thương',
    score: '450 → 820',
    content:
      'Chỉ sau 2 tháng luyện tập theo lộ trình AI của TOEIC Master, mình đã tăng từ 450 lên 820 điểm. Hệ thống chỉ rõ mình yếu nhất Part 3 và Part 7 và cho các bài tập bổ trợ cực kỳ trúng tủ.',
    avatar: 'MA',
    color: '#6366f1',
  },
  {
    name: 'Trần Đức Huy',
    role: 'Software Engineer tại FPT',
    score: '550 → 905',
    content:
      'Giao diện dark mode siêu mượt, học trên laptop hay điện thoại lúc rảnh đều tiện. Phần giải thích chi tiết ngữ pháp Part 5 giúp mình không còn bị lừa bởi các bẫy quen thuộc của đề thi ETS.',
    avatar: 'DH',
    color: '#06b6d4',
  },
  {
    name: 'Lê Thị Thu Hà',
    role: 'Giáo viên Tiếng Anh Trung Học',
    score: '680 → 950',
    content:
      'Mình thường xuyên giới thiệu TOEIC Master cho các học sinh ôn thi đại học và chứng chỉ. Đề thi mô phỏng bấm giờ rất sát thực tế, phần AI chấm Writing cực kỳ ấn tượng và chi tiết.',
    avatar: 'TH',
    color: '#10b981',
  },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Cơ Bản (Miễn Phí)',
    price: '0',
    desc: 'Trải nghiệm nền tảng và bài test chẩn đoán đầu vào',
    popular: false,
    color: '#64748b',
    features: [
      '5 bài luyện tập Listening & Reading / ngày',
      'Bài test chẩn đoán năng lực 15 phút',
      'Flashcard 500 từ vựng cơ bản',
      'Xem đáp án và giải thích câu đơn giản',
      'Theo dõi tiến độ học tập cơ bản',
    ],
    cta: 'Bắt đầu miễn phí',
    ctaLink: '/auth/register',
  },
  {
    name: 'TOEIC Master Pro',
    price: '199.000',
    unit: 'đ/tháng',
    desc: 'Lộ trình AI toàn diện cho người cần bứt phá điểm số gấp',
    popular: true,
    color: '#6366f1',
    features: [
      'Luyện tập không giới hạn 4 kỹ năng',
      'AI chấm điểm bài Writing & chi tiết rubric ETS',
      '50+ bộ đề thi thử full format 200 câu',
      'Lộ trình học cá nhân hóa cập nhật hàng ngày',
      'Giải thích chi tiết chuyên sâu toàn bộ câu hỏi',
      'Audio phát âm đa ngữ bản xứ (US, UK, AU, CA)',
      'Hỗ trợ giải đáp thắc mắc 24/7 với AI Chatbot',
    ],
    cta: 'Nâng cấp gói Pro',
    ctaLink: '/auth/register',
  },
  {
    name: 'Trường học & Doanh nghiệp',
    price: 'Liên hệ',
    unit: '',
    desc: 'Giải pháp đào tạo tiếng Anh và quản lý tiến độ cho tổ chức',
    popular: false,
    color: '#06b6d4',
    features: [
      'Bao gồm toàn bộ tính năng của gói Pro',
      'Dashboard quản lý lớp học và giảng viên',
      'Báo cáo phân tích trình độ từng nhân sự/học viên',
      'Tùy biến bộ đề và ngân hàng câu hỏi riêng',
      'Tích hợp API và hệ thống LMS nhà trường',
      'Dedicated Account Manager hỗ trợ triển khai',
    ],
    cta: 'Liên hệ tư vấn',
    ctaLink: '/auth/register',
  },
];
