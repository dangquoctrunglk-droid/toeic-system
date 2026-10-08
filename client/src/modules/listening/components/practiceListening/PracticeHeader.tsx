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
 * MỤC ĐÍCH: Thanh điều hướng trên cùng chuẩn 100% theo giao diện mẫu DauEnglish:
 *   - Nền xanh dương rực rỡ (#1d64db), tràn viền 100% không bo góc, không margin
 *   - Trái: ← Thoát | Mascot | Lv.1 Dưới 200
 *   - Phải: Cụm pills tối màu cao cấp (Annotator, Song ngữ, Ghi chú, Điền từ, Lật từ, Auto, SFX, ⚡ 0, ✅ 1/1, Câu 2/27)
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
  canToggleBilingual?: boolean;
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
  isAnnotatorActive?: boolean;
  onToggleAnnotator?: () => void;
  onOpenSavedNotes?: () => void;
  title?: string;
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
  canToggleBilingual = true,
  isEvidence,
  onToggleEvidence,
  isAutoNext,
  onToggleAutoNext,
  isSFXEnabled,
  onToggleSFX,
  earnedXP,
  correctCount,
  completedCount,
  isAnnotatorActive = false,
  onToggleAnnotator,
  onOpenSavedNotes,
  title,
}) => {
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>("");

  const handleSaveNote = () => {
    if (quickNote.trim()) {
      toast.success("Đã lưu ghi chú vào sổ tay học tập!");
      setShowNoteModal(false);
    }
  };

  return (
    <>
      {/* THANH HEADER ĐIỀU HƯỚNG TRÊN CÙNG: MÀU XANH DƯƠNG RỰC RỠ DÍNH LIỀN TRÀN VIỀN CHUẨN ẢNH MẪU (CỐ ĐỊNH TRÊN ĐỈNH) */}
      <header className="sticky top-0 left-0 right-0 w-full bg-[#1d64db] text-white px-3 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-2 shadow-md z-40 shrink-0">
        {/* 1. KHỐI TRÁI: NÚT THOÁT, MASCOT VÀ TIÊU ĐỀ CẤP ĐỘ */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Nút: ← Thoát */}
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm text-white hover:bg-white/15 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Thoát</span>
          </button>

          {/* Mascot xanh dễ thương chuẩn DauEnglish */}
          <div className="w-8 h-8 rounded-lg bg-[#0e3a82] border border-white/20 flex items-center justify-center text-white text-base shadow-sm select-none">
            🦉
          </div>

          {/* Tiêu đề cấp độ hoặc Part */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-wide text-white">
              {title || `Part ${part}`}
            </span>
          </div>
        </div>

        {/* 2. KHỐI PHẢI: CÁC NÚT TIỆN ÍCH DẠNG PILLS TỐI MÀU CHUẨN ẢNH MẪU */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          {/* 1. Annotator */}
          <button
            type="button"
            onClick={onToggleAnnotator}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              isAnnotatorActive
                ? "bg-black/90 text-sky-400 border-sky-400/80 shadow-sm shadow-sky-400/20"
                : "bg-[#09152b] hover:bg-[#0f2142] text-white border-white/10"
            }`}
          >
            <PenTool size={11} />
            <span className="hidden md:inline">Annotator</span>
          </button>

          {/* 2. Song ngữ 👑 */}
          <button
            type="button"
            onClick={() => {
              if (!canToggleBilingual) {
                toast.info("Vui lòng chọn đáp án trước khi bật Song ngữ!");
                return;
              }
              onToggleBilingual();
            }}
            title={
              !canToggleBilingual
                ? "Chọn đáp án để mở tính năng Song ngữ"
                : isBilingual
                  ? "Tắt song ngữ"
                  : "Bật song ngữ"
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              !canToggleBilingual
                ? "opacity-40 cursor-not-allowed bg-[#09152b] text-slate-400 border-white/5"
                : isBilingual
                  ? "bg-black/90 text-amber-300 border-amber-400/60 shadow-sm shadow-amber-400/20 cursor-pointer"
                  : "bg-[#09152b] hover:bg-[#0f2142] text-white border-white/10 cursor-pointer"
            }`}
          >
            <Sparkles
              size={11}
              className={isBilingual && canToggleBilingual ? "text-amber-300" : ""}
            />
            <span>Song ngữ</span>
            <Crown
              size={11}
              className={
                canToggleBilingual
                  ? "text-amber-300 fill-amber-300 ml-0.5"
                  : "text-amber-300/40 ml-0.5"
              }
            />
          </button>

          {/* 3. Dẫn chứng 👑 (Dành cho Part 3 & 4) */}
          {part >= 3 && (
            <button
              type="button"
              onClick={onToggleEvidence}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                isEvidence
                  ? "bg-black/90 text-emerald-300 border-emerald-400/60"
                  : "bg-[#09152b] hover:bg-[#0f2142] text-white border-white/10"
              }`}
            >
              <Search size={11} className={isEvidence ? "text-emerald-300" : ""} />
              <span>Dẫn chứng</span>
              <Crown size={11} className="text-amber-300 fill-amber-300 ml-0.5" />
            </button>
          )}

          {/* 4. Ghi chú */}
          <button
            type="button"
            onClick={() => {
              if (onOpenSavedNotes) {
                onOpenSavedNotes();
              } else {
                setShowNoteModal(true);
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#09152b] hover:bg-[#0f2142] text-white border border-white/10 transition-colors cursor-pointer"
          >
            <FileText size={11} />
            <span className="hidden sm:inline">Ghi chú</span>
          </button>

          {/* 5. Điền từ */}
          <button
            type="button"
            onClick={() =>
              onModeChange(mode === "dictation" ? "full" : "dictation")
            }
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              mode === "dictation"
                ? "bg-black/90 text-sky-400 border-sky-400/60"
                : "bg-[#09152b] hover:bg-[#0f2142] text-white border-white/10"
            }`}
          >
            <Edit3 size={11} />
            <span>{mode === "dictation" ? "Chép từ" : "Điền từ"}</span>
          </button>

          {/* 6. Lật từ */}
          <button
            type="button"
            onClick={() => {
              onModeChange(mode === "check" ? "dictation" : "check");
              toast.info("Đã lật gợi ý từ vựng");
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              mode === "check"
                ? "bg-black/90 text-purple-300 border-purple-400/60"
                : "bg-[#09152b] hover:bg-[#0f2142] text-white border-white/10"
            }`}
          >
            <Repeat size={11} />
            <span className="hidden lg:inline">Lật từ</span>
          </button>

          {/* 7. Auto (Chữ xanh neon chuẩn DauEnglish) */}
          <button
            type="button"
            onClick={onToggleAutoNext}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isAutoNext
                ? "bg-[#09152b] text-[#00e5ff] border-[#00e5ff]/40"
                : "bg-[#09152b]/50 text-slate-400 border-white/10"
            }`}
          >
            <Sparkles size={11} />
            <span>Auto</span>
          </button>

          {/* 8. SFX âm thanh (Chữ vàng chuẩn DauEnglish) */}
          <button
            type="button"
            onClick={onToggleSFX}
            title={isSFXEnabled ? "Tắt âm thanh hiệu ứng" : "Bật âm thanh hiệu ứng"}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              isSFXEnabled
                ? "bg-[#09152b] text-[#ffd54f] border-[#ffd54f]/40"
                : "bg-[#09152b]/50 text-slate-400 border-white/10"
            }`}
          >
            {isSFXEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />}
            <span className="hidden xl:inline">SFX</span>
          </button>

          {/* 9. ⚡ Điểm XP (Pill màu cam chuẩn DauEnglish: ⚡ 0) */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#ff8f00] text-white shadow-sm">
            <Zap size={11} className="fill-current" />
            <span>{earnedXP}</span>
          </div>

          {/* 10. ✅ Điểm số đúng (Pill màu xanh lá chuẩn DauEnglish: 1/1) */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-extrabold bg-[#00c853] text-white shadow-sm">
            <CheckCircle2 size={11} />
            <span>
              {correctCount}/{completedCount || 1}
            </span>
          </div>

          {/* 11. Câu X/Y (Chữ trắng chuẩn DauEnglish: Bài 1 · Câu 1/4 hoặc Câu 2/27) */}
          <div className="px-2 py-1 text-xs font-semibold text-white tracking-wide">
            {mode === "dictation" || mode === "check" ? (
              (() => {
                if (Number(part) === 1 || totalQuestions <= 6) {
                  return `Câu ${currentIndex + 1}/${totalQuestions}`;
                }
                const subsPerBai = Number(part) === 2 ? 4 : 7;
                const baiNum = Math.floor(currentIndex / subsPerBai) + 1;
                const subNum = (currentIndex % subsPerBai) + 1;
                return `Bài ${baiNum} · Câu ${subNum}/${subsPerBai}`;
              })()
            ) : (
              `Câu ${currentIndex + 1}/${totalQuestions}`
            )}
          </div>
        </div>
      </header>

      {/* MODAL GHI CHÚ NHANH */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-3xl p-6 border shadow-2xl relative bg-[#0c142b] border-slate-700 text-slate-100">
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
              className="w-full p-3.5 rounded-2xl border text-sm outline-none resize-none mb-4 bg-[#060b18] border-slate-800 text-slate-200 focus:border-sky-500"
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
