import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, History, Sparkles } from "lucide-react";
import { useAuth, useTheme } from "../../context";
import { ExamHistorySection } from "../../modules/dashboard";

/**
 * ==============================================================================
 * TRANG RIÊNG: HistoryPage.tsx (/history)
 * MỤC ĐÍCH: Trang riêng biệt hiển thị toàn bộ Lịch sử làm bài thi của học viên:
 *   - Điều hướng Breadcrumb quay lại Bảng điều khiển học tập
 *   - Khối tiêu đề trang Lịch sử làm bài thi TOEIC ETS
 *   - Nhúng ExamHistorySection chuẩn giao diện mẫu
 * ==============================================================================
 */

export const HistoryPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !user) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 xl:px-12 transition-colors duration-200 ${
        isDarkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      <div className="max-w-[1300px] mx-auto">
        {/* THANH ĐIỀU HƯỚNG BREADCRUMB */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/dashboard"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border transition-all ${
              isDarkMode
                ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-slate-50 shadow-sm"
            }`}
          >
            <ArrowLeft size={15} />
            <span>Quay lại Bảng điều khiển</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link
              to="/dashboard"
              className="hover:text-indigo-400 transition-colors flex items-center gap-1"
            >
              <LayoutDashboard size={13} />
              <span>Dashboard</span>
            </Link>
            <span>/</span>
            <span className="text-blue-500 font-bold flex items-center gap-1">
              <History size={13} />
              <span>Lịch sử bài làm</span>
            </span>
          </div>
        </div>

        {/* TIÊU ĐỀ TRANG LỊCH SỬ BÀI LÀM */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border mb-8 transition-all relative overflow-hidden ${
            isDarkMode
              ? "bg-gradient-to-r from-[#0b1329] via-[#080d1c] to-[#0f1738] border-blue-500/25 shadow-xl shadow-blue-950/20"
              : "bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border-blue-200/80 shadow-md"
          }`}
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                  <Sparkles size={12} className="text-cyan-400 animate-pulse" />
                  <span>HỆ THỐNG ĐÁNH GIÁ ETS TOEIC</span>
                </span>
              </div>
              <h1
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isDarkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Lịch Sử Làm Bài &amp; Phân Tích Điểm
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Theo dõi tiến độ nâng điểm, xem lại chi tiết bài làm, giải thích AI và rèn luyện những phần câu hỏi còn yếu.
              </p>
            </div>
          </div>
        </div>

        {/* NỘI DUNG CHI TIẾT LỊCH SỬ BÀI LÀM */}
        <ExamHistorySection />
      </div>
    </div>
  );
};

export default HistoryPage;
