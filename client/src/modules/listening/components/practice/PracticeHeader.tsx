import type React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  PenTool,
  Sparkles,
  FileText,
  Edit3,
  Repeat,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  Crown,
  Search,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import type { PracticeMode, ListeningPart } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: PracticeHeader.tsx
 * MỤC ĐÍCH: Thanh điều hướng trên cùng chuẩn Ảnh 1, Ảnh 2, Ảnh 3:
 *   - Trái: ← Thoát | Mascot cú xanh | Lv.1 Dưới 200
 *   - Phải:
 *     1. Annotator
 *     2. Song ngữ 👑
 *     3. Dẫn chứng 👑 (chỉ xuất hiện ở Part 3 & 4)
 *     4. Ghi chú (Modal ghi chú bài học)
 *     5. Điền từ (Chuyển chế độ sang Nghe chép chính tả hoặc Trắc nghiệm)
 *     6. Lật từ
 *     7. Auto (Tự động chuyển câu khi làm đúng)
 *     8. SFX (Bật/tắt âm thanh phản hồi)
 *     9. ⚡ 5 (Điểm XP tích luỹ)
 *     10. ✅ 1/1 (Tỉ lệ câu trả lời đúng)
 *     11. Câu 1/27 (Vị trí câu hiện tại)
 * ==============================================================================
 */

interface PracticeHeaderProps {
  part: ListeningPart;
  mode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  onExit: () => void;
  currentIndex: number;
  totalQuestions: number;
  isBilingual: boolean;
  onToggleBilingual: () => void;
  isEvidence: boolean;
  onToggleEvidence: () => void;
  isAutoNext: boolean;
  onToggleAutoNext: () => void;
  isSFXEnabled: boolean;
  onToggleSFX: () => void;
  earnedXP: number;
  correctCount: number;
  completedCount: number;
  isDarkMode: boolean;
}

export const PracticeHeader: React.FC<PracticeHeaderProps> = ({
  part,
  mode,
  onModeChange,
  onExit,
  currentIndex,
  totalQuestions,
  isBilingual,
  onToggleBilingual,
  isEvidence,
  onToggleEvidence,
  isAutoNext,
  onToggleAutoNext,
  isSFXEnabled,
  onToggleSFX,
  earnedXP,
  correctCount,
  completedCount,
  isDarkMode,
}) => {
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>("");
  const [isAnnotatorActive, setIsAnnotatorActive] = useState<boolean>(false);

  const handleSaveNote = () => {
    if (quickNote.trim()) {
      toast.success("Đã lưu ghi chú vào sổ tay học tập!");
      setShowNoteModal(false);
    }
  };

  return (
    <>
      <header
        className={`w-full py-2.5 px-3 sm:px-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-wrap items-center justify-between gap-3 ${
          isDarkMode
            ? "bg-[#0b1329]/95 border-slate-800/80 shadow-lg shadow-black/20"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        {/* 1. KHỐI TRÁI: NÚT THOÁT, MASCOT VÀ TIÊU ĐỀ CẤP ĐỘ */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Nút: ← Thoát */}
          <button
            type="button"
            onClick={onExit}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              isDarkMode
                ? "text-slate-300 hover:text-white hover:bg-slate-800/80"
                : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ArrowLeft size={16} />
            <span>Thoát</span>
          </button>

          {/* Mascot cú xanh dễ thương */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-base shadow-md shadow-sky-500/30 select-none">
            🦉
          </div>

          {/* Tiêu đề cấp độ: Lv.1 Dưới 200 */}
          <div className="flex flex-col">
            <span
              className={`font-black text-xs sm:text-sm tracking-wide ${
                isDarkMode ? "text-slate-100" : "text-slate-900"
              }`}
            >
              Lv.1 Dưới 200
            </span>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">
              Part {part}
            </span>
          </div>
        </div>

        {/* 2. KHỐI PHẢI: CÁC NÚT TIỆN ÍCH DẠNG PILLS CHUẨN ẢNH MẪU */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* 1. Annotator */}
          <button
            type="button"
            onClick={() => {
              setIsAnnotatorActive((prev) => !prev);
              toast.info(
                !isAnnotatorActive
                  ? "Đã kích hoạt chế độ bút vẽ chú thích"
                  : "Đã tắt chế độ bút vẽ",
              );
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isAnnotatorActive
                ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool size={12} />
            <span className="hidden md:inline">Annotator</span>
          </button>

          {/* 2. Song ngữ 👑 */}
          <button
            type="button"
            onClick={onToggleBilingual}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isBilingual
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/10"
                : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={12} className={isBilingual ? "text-amber-400" : ""} />
            <span>Song ngữ</span>
            <Crown size={11} className="text-amber-400 fill-amber-400 ml-0.5" />
          </button>

          {/* 3. Dẫn chứng 👑 (Chỉ dành cho Part 3 & 4 chuẩn ảnh 3) */}
          {part >= 3 && (
            <button
              type="button"
              onClick={onToggleEvidence}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                isEvidence
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                  : isDarkMode
                    ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              <Search size={12} className={isEvidence ? "text-emerald-400" : ""} />
              <span>Dẫn chứng</span>
              <Crown size={11} className="text-amber-400 fill-amber-400 ml-0.5" />
            </button>
          )}

          {/* 4. Ghi chú */}
          <button
            type="button"
            onClick={() => setShowNoteModal(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText size={12} />
            <span className="hidden sm:inline">Ghi chú</span>
          </button>

          {/* 5. Chuyển chế độ: Điền từ vs Trắc nghiệm */}
          <button
            type="button"
            onClick={() =>
              onModeChange(mode === "dictation" ? "full" : "dictation")
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              mode === "dictation"
                ? "bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/20"
                : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 size={12} />
            <span>{mode === "dictation" ? "Chép từ" : "Điền từ"}</span>
          </button>

          {/* 6. Lật từ */}
          <button
            type="button"
            onClick={() => {
              onModeChange(mode === "check" ? "dictation" : "check");
              toast.info("Đã lật gợi ý từ vựng");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              mode === "check"
                ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                : isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900"
            }`}
          >
            <Repeat size={12} />
            <span className="hidden lg:inline">Lật từ</span>
          </button>

          {/* 7. Auto (Pill xanh lá chuẩn ảnh mẫu) */}
          <button
            type="button"
            onClick={onToggleAutoNext}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black border transition-colors cursor-pointer ${
              isAutoNext
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                : "bg-slate-800/40 text-slate-500 border-slate-800"
            }`}
          >
            <Sparkles size={11} />
            <span>Auto</span>
          </button>

          {/* 8. SFX âm thanh */}
          <button
            type="button"
            onClick={onToggleSFX}
            title={isSFXEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isSFXEnabled
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-slate-900 border-slate-800 text-slate-500"
            }`}
          >
            {isSFXEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
            <span className="hidden xl:inline">SFX</span>
          </button>

          {/* 9. ⚡ Điểm XP / Streak (Pill màu vàng cam chuẩn ảnh 1) */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-amber-500 text-black shadow-sm shadow-amber-500/20">
            <Zap size={12} className="fill-current" />
            <span>{earnedXP}</span>
          </div>

          {/* 10. ✅ Điểm số đúng (Pill màu xanh lá chuẩn ảnh 1: 1/1 hoặc 0/0) */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <CheckCircle2 size={12} />
            <span>
              {correctCount}/{completedCount}
            </span>
          </div>

          {/* 11. Câu X/Y (Pill màu xanh dương nhạt chuẩn ảnh 1: Câu 1/27) */}
          <div className="px-2.5 py-1 rounded-xl text-xs font-black bg-sky-500/20 text-sky-400 border border-sky-500/30">
            Câu {currentIndex + 1}/{totalQuestions}
          </div>
        </div>
      </header>

      {/* MODAL GHI CHÚ NHANH */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${
              isDarkMode
                ? "bg-[#0c142b] border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowNoteModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <FileText size={18} className="text-sky-400" />
              <span>Ghi chú câu hỏi này</span>
            </h3>

            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Nhập bẫy phát âm, từ vựng hoặc mẹo cần nhớ cho câu này..."
              rows={4}
              className={`w-full p-3.5 rounded-2xl border text-sm outline-none resize-none mb-4 ${
                isDarkMode
                  ? "bg-[#060b18] border-slate-800 text-slate-200 focus:border-sky-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-500"
              }`}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs cursor-pointer shadow-md shadow-sky-500/20"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
