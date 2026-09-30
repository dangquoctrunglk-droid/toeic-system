import type React from "react";
import { useState } from "react";
import { Calendar, Clock, Edit3, Check } from "lucide-react";
import { useTheme } from "../../context";

/**
 * ==============================================================================
 * COMPONENT: ExamCountdownCard.tsx
 * MỤC ĐÍCH: Khối đồng hồ đếm ngược ngày thi chính thức và giai đoạn chiến lược AI.
 * THIẾT KẾ ĐỘC ĐÁO & KHÁC BIỆT SO VỚI ẢNH MẪU:
 *   - Hiển thị ngày thi dạng Chronometer hiện đại với số ngày và số tuần còn lại
 *   - Cho phép nhấp chọn/chỉnh sửa ngày thi trực tiếp ngay trên thẻ
 *   - Đề xuất giai đoạn chiến thuật AI tương ứng (Ví dụ: Nước rút, Luyện đề, Nền tảng)
 * ==============================================================================
 */

interface ExamCountdownCardProps {
  examDate: string;
  onUpdateExamDate: (newDate: string) => void;
}

export const ExamCountdownCard: React.FC<ExamCountdownCardProps> = ({
  examDate,
  onUpdateExamDate,
}) => {
  const { isDarkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [tempDate, setTempDate] = useState(examDate);

  // Tính số ngày còn lại
  const calculateDays = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    if (isNaN(target.getTime())) return 0;
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const daysLeft = calculateDays(examDate);
  const weeksLeft = examDate ? (daysLeft / 7).toFixed(1) : "0";

  // Phân loại giai đoạn học tập theo số ngày còn lại
  let phaseName = "Lộ trình toàn diện";
  let phaseColor = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
  if (!examDate) {
    phaseName = "Chưa có lịch thi";
    phaseColor = "text-slate-400 bg-slate-500/10 border-slate-500/20";
  } else if (daysLeft <= 14) {
    phaseName = "Chặng nước rút ETS";
    phaseColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
  } else if (daysLeft <= 45) {
    phaseName = "Giải đề & Vá lỗ hổng";
    phaseColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
  } else if (daysLeft <= 90) {
    phaseName = "Luyện đề Part 1 - 7";
    phaseColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
  }

  // Định dạng ngày thi hiển thị (dd/mm/yyyy)
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Chưa thiết lập";
    try {
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const handleSaveDate = () => {
    onUpdateExamDate(tempDate);
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
        isDarkMode
          ? "bg-[#0b1226]/80 border-indigo-500/20 shadow-xl shadow-indigo-950/30"
          : "bg-white border-slate-200 shadow-lg shadow-slate-200/50"
      }`}
    >
      <div>
        {/* Header thẻ */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/40 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400">
              <Calendar size={18} />
            </div>
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              ĐẾM NGƯỢC NGÀY THI
            </h3>
          </div>

          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${phaseColor}`}>
            {phaseName}
          </span>
        </div>

        {/* Nội dung đếm ngược lớn */}
        <div className="text-center py-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl sm:text-6xl font-black text-emerald-400 tracking-tight">
              {daysLeft}
            </span>
            <span
              className={`text-base font-bold ${
                isDarkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              ngày nữa
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            {examDate ? (
              <>
                Tương đương ~<strong>{weeksLeft}</strong> tuần ôn tập nước rút
              </>
            ) : (
              "Vui lòng thiết lập ngày thi để đếm ngược"
            )}
          </p>
        </div>
      </div>

      {/* Footer: Hiển thị ngày thi & Nút đổi ngày thi */}
      <div className="pt-3 border-t border-slate-800/40">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock size={14} className="text-indigo-400" />
              <span>
                Ngày thi:{" "}
                <strong className={isDarkMode ? "text-white" : "text-slate-900"}>
                  {formatDisplayDate(examDate)}
                </strong>
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setTempDate(examDate);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Edit3 size={12} />
              <span>Chỉnh ngày thi</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-slide-up">
            <input
              type="date"
              value={tempDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setTempDate(e.target.value)}
              className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-semibold outline-none ${
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white focus:border-indigo-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500"
              }`}
            />
            <button
              type="button"
              onClick={handleSaveDate}
              className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              title="Lưu ngày thi"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors text-xs"
              title="Hủy"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamCountdownCard;
