import { Headphones, ChevronRight, FileText } from "lucide-react";
import type { PartCardData } from "../types";

/**
 * ==============================================================================
 * COMPONENT: ListeningPartCard.tsx
 * MỤC ĐÍCH: Thẻ hiển thị từng Part luyện thi (Part 1, 2, 3, 4) chuẩn theo ảnh mẫu:
 *   - Thanh viền tiến độ (Progress bar) ở mép trên cùng của thẻ
 *   - Tag Part 1/2/3/4 bo góc mềm
 *   - Icon số từ vựng / Bookmark góc phải trên: [A] 0
 *   - Icon Tai nghe 🎧 kèm số lượng câu (ví dụ 100 câu)
 *   - Dòng trạng thái (Chưa bắt đầu hoặc 4/100) & Nút xanh "Luyện tập >"
 * ==============================================================================
 */

interface ListeningPartCardProps {
  card: PartCardData;
  onStartPractice: (part: PartCardData["part"]) => void;
  isDarkMode: boolean;
}

export const ListeningPartCard: React.FC<ListeningPartCardProps> = ({
  card,
  onStartPractice,
  isDarkMode,
}) => {
  const isStarted = card.completedQuestions > 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 group hover:translate-y-[-2px] hover:shadow-xl ${
        isDarkMode
          ? "bg-[#0b1329]/90 border-slate-800/90 hover:border-sky-500/40 shadow-md shadow-black/20"
          : "bg-white border-slate-200/90 hover:border-sky-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* 1. THANH TIẾN ĐỘ Ở MÉP TRÊN (Top Progress Bar chuẩn mẫu) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-transparent">
        {card.progressPercent > 0 && (
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
            style={{ width: `${Math.min(card.progressPercent, 100)}%` }}
          />
        )}
      </div>

      <div>
        {/* 2. HÀNG ĐẦU: Tag Part & Icon góc phải */}
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Badge Part 1 / 2 / 3 / 4 */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border transition-colors ${
              isDarkMode
                ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                : "bg-sky-50 border-sky-200 text-sky-700"
            }`}
          >
            {card.title}
          </span>

          {/* Icon góc phải: [A] 0 (Từ vựng/Ghi chú) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
            <span className="w-4 h-4 rounded border border-slate-500/50 flex items-center justify-center text-[10px] font-black leading-none">
              A
            </span>
            <FileText size={13} className="text-slate-400" />
            <span>{card.vocabCount}</span>
          </div>
        </div>

        {/* 3. KHỐI TRUNG TÂM: Icon Tai nghe 🎧 & Số câu */}
        <div className="flex items-center gap-3 my-4">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              isDarkMode
                ? "bg-slate-800/60 text-sky-400"
                : "bg-sky-50 text-sky-600"
            }`}
          >
            <Headphones size={20} className="stroke-[2.2]" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isDarkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {card.totalQuestions}
            </span>
            <span className="text-sm font-semibold text-slate-400">câu</span>
          </div>
        </div>
      </div>

      {/* 4. HÀNG ĐÁY: Tiến độ văn bản & Nút Bấm "Luyện tập >" */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800/40">
        <span
          className={`text-xs sm:text-sm font-medium ${
            isStarted
              ? isDarkMode
                ? "text-sky-300 font-semibold"
                : "text-sky-600 font-semibold"
              : "text-slate-400"
          }`}
        >
          {card.statusText}
        </span>

        {/* Nút Luyện tập > (Chuẩn màu xanh dương pill theo ảnh mẫu) */}
        <button
          type="button"
          onClick={() => onStartPractice(card.part)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          <span>Luyện tập</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};
