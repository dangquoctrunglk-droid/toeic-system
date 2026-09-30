import type React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  RotateCcw,
  Headphones,
  BookOpen,
  Filter,
  BarChart3,
  Calendar,
} from "lucide-react";
import { useTheme, useAuth } from "../../context";
import {
  DEFAULT_EXAM_HISTORY,
  EXAM_HISTORY_STORAGE_KEY,
} from "./defaultData";
import type { ExamHistoryItem } from "./types";

/**
 * ==============================================================================
 * COMPONENT: ExamHistorySection.tsx
 * MỤC ĐÍCH: Hiển thị bảng "Lịch sử bài làm" (Test Submission History) của học viên:
 *   - Phần tiêu đề Tab chuẩn theo hình ảnh mẫu [ 🕒 Lịch sử bài làm ] viền xanh trên
 *   - Thống kê tổng quan: Tổng số bài thi, Điểm cao nhất, Điểm trung bình, Tỷ lệ đúng
 *   - Bộ lọc theo dạng bài: Tất cả, Full Test 200 câu, Mini Test, Kỹ năng nghe/đọc
 *   - Danh sách chi tiết từng lượt nộp bài: Điểm số, thời gian, nhận xét từ AI Mentor
 *   - Nút "Xem lại đáp án" và "Làm lại đề"
 * ==============================================================================
 */

interface ExamHistorySectionProps {
  onStartNewExam?: () => void;
}

export const ExamHistorySection: React.FC<ExamHistorySectionProps> = ({
  onStartNewExam,
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const userHistoryKey = user?.email
    ? `${EXAM_HISTORY_STORAGE_KEY}_${user.email}`
    : EXAM_HISTORY_STORAGE_KEY;

  // Lấy lịch sử làm bài từ LocalStorage
  const [historyList, setHistoryList] = useState<ExamHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(userHistoryKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_EXAM_HISTORY;
  });

  // Lắng nghe cập nhật lịch sử khi người dùng hoàn thành bài thi mới
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem(userHistoryKey);
        if (saved) {
          setHistoryList(JSON.parse(saved));
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userHistoryKey]);

  // Bộ lọc loại bài thi
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "full" | "mini" | "listening" | "reading"
  >("all");

  const filteredHistory = historyList.filter((item) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "full") return item.testType === "full";
    if (selectedFilter === "mini") return item.testType === "mini";
    if (selectedFilter === "listening")
      return item.testType === "listening" || (item.listeningScore > 0 && item.readingScore === 0);
    if (selectedFilter === "reading")
      return item.testType === "reading" || item.testType === "part" || (item.readingScore > 0 && item.listeningScore === 0);
    return true;
  });

  // Tính toán các chỉ số thống kê
  const totalTests = historyList.length;
  const highestScore =
    totalTests > 0 ? Math.max(...historyList.map((h) => h.totalScore)) : 0;
  const avgScore =
    totalTests > 0
      ? Math.round(
          historyList.reduce((acc, curr) => acc + curr.totalScore, 0) /
            totalTests,
        )
      : 0;
  const totalCorrect = historyList.reduce(
    (acc, curr) => acc + curr.correctAnswers,
    0,
  );
  const totalQuestions = historyList.reduce(
    (acc, curr) => acc + curr.totalQuestions,
    0,
  );
  const accuracyPercent =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="mt-8 mb-12">
      {/* ========================================================================= */}
      {/* 1. THANH TIÊU ĐỀ TAB: CHUẨN XÁC THEO ẢNH MẪU [ 🕒 Lịch sử bài làm ]     */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 mb-6">
        <div className="flex items-center gap-2">
          {/* Nút Tab Lịch sử bài làm với viền xanh trên chuẩn ảnh 2 */}
          <div
            className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-t-2xl font-black text-base sm:text-lg border-t-4 transition-all select-none shadow-sm ${
              isDarkMode
                ? "bg-[#0b1329] border-blue-500 text-white shadow-blue-950/40"
                : "bg-white border-blue-600 text-slate-800 shadow-slate-200/50"
            }`}
          >
            <History
              size={20}
              className={isDarkMode ? "text-blue-400 shrink-0" : "text-slate-700 shrink-0"}
            />
            <span className="tracking-tight">Lịch sử bài làm</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ml-1 ${
                isDarkMode
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {totalTests} lượt
            </span>
          </div>
        </div>

        {/* Nút Luyện đề mới */}
        <Link
          to="/exam"
          onClick={onStartNewExam}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-500 hover:text-indigo-400 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors pb-2"
        >
          <span>Luyện đề mới</span>
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 2. KHỐI THỐNG KÊ NHANH 4 CHỈ SỐ LỊCH SỬ                                   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Số bài đã nộp */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#0b1226]/80 border-indigo-500/20 text-slate-100"
              : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>Tổng số bài nộp</span>
            <CheckCircle2 size={16} className="text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">
            {totalTests}{" "}
            <span className="text-xs font-normal text-slate-400">bài</span>
          </div>
        </div>

        {/* Điểm cao nhất */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#0b1226]/80 border-indigo-500/20 text-slate-100"
              : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>Điểm cao nhất</span>
            <Award size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {highestScore}{" "}
            <span className="text-xs font-normal text-slate-400">/ 990</span>
          </div>
        </div>

        {/* Điểm trung bình */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#0b1226]/80 border-indigo-500/20 text-slate-100"
              : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>Điểm trung bình</span>
            <BarChart3 size={16} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400">
            {avgScore}{" "}
            <span className="text-xs font-normal text-slate-400">/ 990</span>
          </div>
        </div>

        {/* Tỷ lệ làm đúng */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-[#0b1226]/80 border-indigo-500/20 text-slate-100"
              : "bg-white border-slate-200 text-slate-800 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>Tỷ lệ làm đúng</span>
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {accuracyPercent}%{" "}
            <span className="text-xs font-normal text-slate-400">
              ({totalCorrect}/{totalQuestions})
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BỘ LỌC DẠNG BÀI THI                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Filter size={13} />
          <span>Lọc theo:</span>
        </span>

        {[
          { key: "all", label: "Tất cả" },
          { key: "full", label: "Full Test (200 câu)" },
          { key: "mini", label: "Mini Test (50 câu)" },
          { key: "listening", label: "Nghe hiểu (Listening)" },
          { key: "reading", label: "Đọc hiểu (Reading)" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() =>
              setSelectedFilter(
                tab.key as "all" | "full" | "mini" | "listening" | "reading",
              )
            }
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === tab.key
                ? isDarkMode
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                  : "bg-indigo-600 text-white shadow-sm"
                : isDarkMode
                  ? "bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. DANH SÁCH CHI TIẾT TỪNG LƯỢT LÀM BÀI                                  */}
      {/* ========================================================================= */}
      {filteredHistory.length === 0 ? (
        // Trạng thái trống (Empty State)
        <div
          className={`p-10 text-center rounded-3xl border ${
            isDarkMode
              ? "bg-[#0b1226]/50 border-slate-800 text-slate-400"
              : "bg-white border-slate-200 text-slate-500"
          }`}
        >
          <History size={40} className="mx-auto mb-3 text-slate-400 opacity-60" />
          <p className="font-bold text-base text-slate-300">
            Chưa có bài thi nào trong bộ lọc này
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Hãy bắt đầu một đề luyện thi ETS để theo dõi tiến độ và nhận phân tích chiến lược từ AI.
          </p>
          <Link
            to="/exam"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-md"
          >
            <span>Luyện thi thử ETS ngay</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all hover:scale-[1.005] ${
                isDarkMode
                  ? "bg-[#0b1329]/90 hover:bg-[#0e1738] border-indigo-500/20 text-slate-100 shadow-md shadow-black/20"
                  : "bg-white hover:bg-slate-50/80 border-slate-200 text-slate-900 shadow-sm"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* THÔNG TIN BÀI THI */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {/* Badge loại bài */}
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        item.testType === "full"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : item.testType === "mini"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {item.testType === "full"
                        ? "Full Test"
                        : item.testType === "mini"
                          ? "Mini Test"
                          : "Luyện Kỹ Năng"}
                    </span>

                    {/* Huy hiệu đạt mục tiêu */}
                    {item.targetAchieved ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 size={11} />
                        <span>Đạt chỉ tiêu</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Clock size={11} />
                        <span>Cần bứt phá</span>
                      </span>
                    )}

                    {/* Ngày làm bài */}
                    <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto sm:ml-0">
                      <Calendar size={12} />
                      <span>{item.completedAt}</span>
                    </span>
                  </div>

                  {/* Tên đề thi */}
                  <h3 className="font-bold text-base sm:text-lg mb-2">
                    {item.testTitle}
                  </h3>

                  {/* Phân tích câu đúng và thời gian làm bài */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-indigo-400" />
                      <span>Thời gian: {item.durationMinutes} phút</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      <span>
                        Đúng: {item.correctAnswers}/{item.totalQuestions} câu (
                        {Math.round(
                          (item.correctAnswers / item.totalQuestions) * 100,
                        )}
                        %)
                      </span>
                    </span>
                  </div>

                  {/* Nhận xét AI */}
                  {item.aiFeedback && (
                    <div
                      className={`mt-3 p-2.5 rounded-xl text-xs flex items-start gap-2 ${
                        isDarkMode
                          ? "bg-indigo-950/30 border border-indigo-500/20 text-indigo-200"
                          : "bg-indigo-50 border border-indigo-100 text-indigo-900"
                      }`}
                    >
                      <Sparkles
                        size={14}
                        className="text-cyan-400 shrink-0 mt-0.5"
                      />
                      <span>{item.aiFeedback}</span>
                    </div>
                  )}
                </div>

                {/* KHỐI ĐIỂM SỐ & NÚT HÀNH ĐỘNG */}
                <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/40 gap-3">
                  {/* Điểm tổng */}
                  <div className="text-left sm:text-right">
                    <div className="text-2xl sm:text-3xl font-black text-indigo-500 dark:text-cyan-400">
                      {item.totalScore}
                      <span className="text-xs font-normal text-slate-400">
                        {" "}
                        / 990
                      </span>
                    </div>

                    {/* Điểm chi tiết Nghe & Đọc */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      {item.listeningScore > 0 && (
                        <span className="flex items-center gap-1">
                          <Headphones size={11} className="text-sky-400" />
                          <span>LC: {item.listeningScore}</span>
                        </span>
                      )}
                      {item.readingScore > 0 && (
                        <span className="flex items-center gap-1">
                          <BookOpen size={11} className="text-emerald-400" />
                          <span>RC: {item.readingScore}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Nút Xem chi tiết & Làm lại */}
                  <div className="flex items-center gap-2">
                    <Link
                      to="/exam"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isDarkMode
                          ? "bg-slate-900/80 border-slate-700 hover:bg-slate-800 text-slate-200"
                          : "bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700"
                      }`}
                      title="Làm lại đề thi này"
                    >
                      <RotateCcw size={12} />
                      <span className="hidden sm:inline">Làm lại</span>
                    </Link>

                    <Link
                      to="/exam"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/25"
                    >
                      <span>Xem đáp án</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamHistorySection;
