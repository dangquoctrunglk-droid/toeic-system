import type React from "react";
import { ShoppingBag, FileText, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import type { PracticeLevelCard } from "../types";

/**
 * ==============================================================================
 * COMPONENT: PartPracticeCard.tsx
 * MỤC ĐÍCH: Thẻ luyện tập phân cấp Level (1-4) hoặc Chủ đề chi tiết (Part 1-4)
 * THIẾT KẾ: Bám sát 100% hình ảnh thực tế của người dùng:
 *   - Viền viền dạ quang xanh cyan ở cạnh trên cùng của thẻ
 *   - Tiêu đề cấp độ/chủ đề (ví dụ: Level 1 – Dưới 200, Tranh một người, Câu hỏi Who)
 *   - Dòng phụ: "Chưa luyện tập · 27 câu"
 *   - Hàng dưới: Cụm 4 icon tiện ích bên trái (Giỏ, Giấy, Tải lại, Xóa)
 *   - Nút xanh ngọc dạ quang bên phải: "Học ngay" (Chuẩn TOEIC Master AI)
 * ==============================================================================
 */

interface PartPracticeCardProps {
  card: PracticeLevelCard;
  onStartLearning: (cardId: string) => void;
  isDarkMode: boolean;
}

export const PartPracticeCard: React.FC<PartPracticeCardProps> = ({
  card,
  onStartLearning,
  isDarkMode,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between group hover:translate-y-[-2px] hover:shadow-xl ${
        isDarkMode
          ? "bg-[#0b1329]/90 border-slate-800/90 hover:border-sky-500/40 shadow-md shadow-black/20"
          : "bg-white border-slate-200/90 hover:border-sky-300 shadow-sm hover:shadow-md"
      }`}
    >
      {/* 1. ĐƯỜNG VIỀN XANH CYAN DẠ QUANG CẠNH TRÊN (Chuẩn ảnh mẫu) */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400/30" />

      {/* 2. KHỐI TIÊU ĐỀ & SỐ LƯỢNG CÂU */}
      <div className="mb-6">
        <h3
          className={`font-black text-base sm:text-[17px] tracking-tight mb-1.5 transition-colors ${
            isDarkMode ? "text-white group-hover:text-sky-300" : "text-slate-900 group-hover:text-sky-600"
          }`}
        >
          {card.title}
        </h3>
        <p className="text-xs sm:text-[13px] font-medium text-slate-400">
          {card.statusText} · {card.questionCount} câu
        </p>
      </div>

      {/* 3. HÀNG DƯỚI CÙNG: CỤM 4 ICON TIỆN ÍCH & NÚT "HỌC NGAY" */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800/40">
        {/* Cụm 4 Icon xám nhỏ bên trái: Giỏ từ, Ghi chú, Làm lại, Xóa */}
        <div
          className={`flex items-center gap-1.5 p-1 rounded-xl border transition-colors ${
            isDarkMode
              ? "bg-[#070c1a]/80 border-slate-800/80"
              : "bg-slate-100 border-slate-200"
          }`}
        >
          <button
            type="button"
            onClick={() => toast.info("Xem giỏ từ của phần này")}
            className="p-1 rounded-lg text-slate-500 hover:text-sky-400 transition-colors cursor-pointer"
            title="Giỏ từ"
          >
            <ShoppingBag size={14} />
          </button>
          <button
            type="button"
            onClick={() => toast.info("Xem bản dịch và ghi chú")}
            className="p-1 rounded-lg text-slate-500 hover:text-sky-400 transition-colors cursor-pointer"
            title="Ghi chú"
          >
            <FileText size={14} />
          </button>
          <button
            type="button"
            onClick={() => toast.info("Đặt lại tiến độ để làm lại")}
            className="p-1 rounded-lg text-slate-500 hover:text-sky-400 transition-colors cursor-pointer"
            title="Làm lại"
          >
            <RotateCcw size={14} />
          </button>
          <button
            type="button"
            onClick={() => toast.info("Xóa dữ liệu nháp của thẻ này")}
            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            title="Xóa nháp"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Nút: Học ngay (Viền xanh ngọc emerald dạ quang chuẩn TOEIC Master AI) */}
        <button
          type="button"
          onClick={() => onStartLearning(card.id)}
          className="px-5 py-1.5 rounded-full text-xs font-black border border-emerald-500/50 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-400 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm shadow-emerald-950/20"
        >
          Học ngay
        </button>
      </div>
    </div>
  );
};
