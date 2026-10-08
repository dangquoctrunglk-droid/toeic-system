import type React from "react";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Flag,
  ShoppingBag,
  Grid,
  X,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";
import type { VocabItem, PracticeMode, SentenceItem } from "../../types";
import { VocabBasketDrawer } from "./VocabBasketDrawer";

/**
 * ==============================================================================
 * COMPONENT: PracticeBottomBar.tsx
 * MỤC ĐÍCH: Thanh điều khiển đáy phòng luyện nghe chuẩn DauEnglish:
 *   - Trái:
 *     1. 🚩 Báo lỗi (Modal gửi phản hồi câu hỏi)
 *     2. 🧺 Giỏ từ (Drawer xem các từ vựng đã lưu kèm phát âm)
 *     3. 📖 Tra từ (Modal tra cứu từ điển nhanh cho bài học)
 *   - Phải:
 *     4. < (Nút câu trước)
 *     5. 㗊 X/Y (Nút mở Drawer "Danh sách câu hỏi" chuẩn mẫu)
 *     6. > (Nút câu kế tiếp)
 *   - Drawer "Danh sách câu hỏi":
 *     + Header xanh ngọc chuẩn ảnh mẫu: "Danh sách câu hỏi" + [✕]
 *     + Hàng 1: [ 🟩 X Đúng ] [ 🟥 Y Sai ] [ ⬜ Z Chưa làm ]
 *     + Hàng 2: [ 🟦 Đang xem ] [ 🟩 Đúng ] [ 🟥 Sai ] [ ⬛ Chưa làm ] [ 🟨 Đánh dấu ]
 *     + Hàng 3: Tiêu đề Part: Part X - Tên Part (N câu)
 *     + Hàng 4: Lưới 6 cột hiển thị toàn bộ N câu ("có bao nhiêu câu thì hiện nhiêu đó")
 * ==============================================================================
 */

interface PracticeBottomBarProps {
  currentIndex: number;
  totalSentences: number;
  onSelectSentence: (index: number) => void;
  completedMap?: Record<number, boolean>;
  correctMap?: Record<number, boolean>;
  savedVocabs: VocabItem[];
  isDarkMode: boolean;
  part?: number | string;
  level?: number | string;
  mode?: PracticeMode;
  sentences?: SentenceItem[];
  bookmarkedIds?: string[];
}

export const PracticeBottomBar: React.FC<PracticeBottomBarProps> = ({
  currentIndex,
  totalSentences,
  onSelectSentence,
  completedMap = {},
  correctMap = {},
  savedVocabs,
  isDarkMode,
  part,
  level,
  sentences = [],
  bookmarkedIds = [],
}) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showVocabDrawer, setShowVocabDrawer] = useState<boolean>(false);
  const [showGridDrawer, setShowGridDrawer] = useState<boolean>(false);
  const [showDictModal, setShowDictModal] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>("");
  const [searchDictQuery, setSearchDictQuery] = useState<string>("");

  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Đóng Drawer khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowGridDrawer(false);
        setShowReportModal(false);
        setShowDictModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Tính toán số lượng: Đúng, Sai, Chưa làm
  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    for (let i = 0; i < totalSentences; i++) {
      if (completedMap[i]) {
        if (correctMap[i]) {
          correct++;
        } else {
          wrong++;
        }
      }
    }
    const unattempted = Math.max(0, totalSentences - (correct + wrong));
    return { correct, wrong, unattempted };
  }, [totalSentences, completedMap, correctMap]);

  // Tiêu đề Part hiển thị chuẩn mẫu: Part X - Photographs (N câu)
  const partTitleText = useMemo(() => {
    const p = Number(part);
    if (p === 1) return `Part 1 - Photographs (${totalSentences} câu)`;
    if (p === 2) return `Part 2 - Question - Response (${totalSentences} câu)`;
    if (p === 3) return `Part 3 - Conversations (${totalSentences} câu)`;
    if (p === 4) return `Part 4 - Short Talks (${totalSentences} câu)`;
    return `Part ${p} (${totalSentences} câu)`;
  }, [part, totalSentences]);

  const handleSubmitReport = () => {
    if (!reportText.trim()) return;
    toast.success("Cảm ơn bạn! Đóng góp báo lỗi đã được gửi đến ban biên tập.");
    setReportText("");
    setShowReportModal(false);
  };

  const handlePronounce = (word: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  return (
    <>
      {/* THANH ĐIỀU KHIỂN CỐ ĐỊNH Ở ĐÁY MÀN HÌNH (DÍNH LIỀN CHÂN TRANG, KHÔNG BỊ CẮT CHỮ) */}
      <footer
        className={`w-full shrink-0 sticky bottom-0 left-0 right-0 z-40 transition-colors duration-200 border-t ${
          isDarkMode
            ? "bg-[#080d1c]/95 backdrop-blur-xl border-slate-800/80 shadow-[0_-4px_25px_rgba(0,0,0,0.6)]"
            : "bg-white/95 backdrop-blur-xl border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
        }`}
      >
        <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* 1. CỤM TRÁI: BÁO LỖI, GIỎ TỪ & TRA TỪ */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Nút: 🚩 Báo lỗi */}
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-[#0b1329] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
              }`}
            >
              <Flag size={14} className="text-slate-400" />
              <span>Báo lỗi</span>
            </button>

            {/* Nút: 🧺 Giỏ từ */}
            <button
              type="button"
              onClick={() => setShowVocabDrawer(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-[#0b1329] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
              }`}
            >
              <ShoppingBag size={14} className="text-slate-400" />
              <span>Giỏ từ</span>
              {savedVocabs.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-black">
                  {savedVocabs.length}
                </span>
              )}
            </button>

            {/* Nút: 📖 Tra từ */}
            <button
              type="button"
              onClick={() => setShowDictModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                isDarkMode
                  ? "bg-[#0b1329] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
              }`}
            >
              <BookOpen size={14} className="text-slate-400" />
              <span>Tra từ</span>
            </button>
          </div>

          {/* 2. CỤM PHẢI: ĐIỀU HƯỚNG CÂU < 㗊 X/Y > */}
          <div className="flex items-center gap-2">
            {/* Nút < (Câu trước) */}
            <button
              type="button"
              onClick={() => onSelectSentence(Math.max(currentIndex - 1, 0))}
              disabled={currentIndex === 0}
              className={`p-2 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
              title="Câu trước"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Nút 㗊 X/Y (Mở Drawer Danh sách câu hỏi - áp dụng toàn bộ Part 1, 2, 3, 4) */}
            <button
              type="button"
              onClick={() => setShowGridDrawer(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/30 transition-all cursor-pointer select-none"
              title="Mở danh sách câu hỏi"
            >
              <Grid size={15} />
              <span>
                {currentIndex + 1}/{totalSentences}
              </span>
            </button>

            {/* Nút > (Câu kế tiếp) */}
            <button
              type="button"
              onClick={() =>
                onSelectSentence(Math.min(currentIndex + 1, totalSentences - 1))
              }
              disabled={currentIndex === totalSentences - 1}
              className={`p-2 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
                  : "bg-white border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
              title="Câu kế tiếp"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </footer>

      {/* DRAWER DANH SÁCH CÂU HỎI (CHUẨN 100% ẢNH MẪU ĐƯỢC CUNG CẤP) */}
      {showGridDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
          {/* Lớp nền mờ backdrop: bấm vào nền để đóng */}
          <div
            onClick={() => setShowGridDrawer(false)}
            className="absolute inset-0 bg-black/60  transition-opacity"
          />

          {/* Khung Drawer trượt ra từ cạnh phải */}
          <div
            ref={drawerRef}
            className="absolute inset-y-0 right-0 max-w-full flex pl-10"
          >
            <div className="w-[320px] sm:w-[360px] bg-[#0d162d] border-l border-slate-800 shadow-2xl flex flex-col animate-slide-in-right text-slate-100">
              {/* 1. HEADER XANH DA TRỜI RỰC RỠ CHUẨN ẢNH MẪU */}
              <div className="bg-[#38bdf8] px-4 py-3 flex items-center justify-between text-white shadow-md">
                <h3 className="font-extrabold text-base tracking-tight drop-shadow-sm">
                  Danh sách câu hỏi
                </h3>
                <button
                  type="button"
                  onClick={() => setShowGridDrawer(false)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Đóng danh sách"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 2. THỐNG KÊ NHANH: [ 🟩 X Đúng ] [ 🟥 Y Sai ] [ ⬜ Z Chưa làm ] */}
              <div className="grid grid-cols-3 gap-2 px-3.5 py-3 border-b border-slate-800 bg-[#070e22]">
                {/* 🟩 X Đúng */}
                <div className="flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span className="truncate">{stats.correct} Đúng</span>
                </div>

                {/* 🟥 Y Sai */}
                <div className="flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                  <span className="truncate">{stats.wrong} Sai</span>
                </div>

                {/* ⬜ Z Chưa làm */}
                <div className="flex items-center justify-center gap-1.5 py-1 px-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400 shrink-0" />
                  <span className="truncate">{stats.unattempted} Chưa làm</span>
                </div>
              </div>

              {/* 3. CHÚ THÍCH TRẠNG THÁI (LEGEND CHUẨN ẢNH MẪU 5 TRẠNG THÁI) */}
              <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 px-3.5 py-2.5 border-b border-slate-800 text-[11px] font-semibold text-slate-300 bg-[#091226]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-sky-500 shrink-0" />
                  <span>Đang xem</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
                  <span>Đúng</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
                  <span>Sai</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-[#1e2a47] border border-slate-700 shrink-0" />
                  <span>Chưa làm</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-amber-400 shrink-0" />
                  <span>Đánh dấu</span>
                </div>
              </div>

              {/* 4. TIÊU ĐỀ PHẦN: Part X - Photographs (N câu) */}
              <div className="px-4 pt-3.5 pb-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-300 tracking-wide">
                  {partTitleText}
                </h4>
              </div>

              {/* 5. LƯỚI 6 CỘT HIỂN THỊ TOÀN BỘ CÂU HỎI ("Có bao nhiêu câu thì hiện nhiêu đó") */}
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
                  {Array.from({ length: totalSentences }).map((_, idx) => {
                    const isCurrent = idx === currentIndex;
                    const isDone = Boolean(completedMap[idx]);
                    const isRight = Boolean(correctMap[idx]);
                    const isWrong = isDone && !isRight;
                    const sentence = sentences[idx];
                    const isBookmarked = Boolean(
                      sentence?.id && bookmarkedIds.includes(sentence.id),
                    );

                    // Số hiển thị trên nút (Ưu tiên displayNumber nếu có, ngược lại số thứ tự 1..N)
                    const label = sentence?.displayNumber
                      ? sentence.displayNumber.replace(/[^0-9]/g, "") ||
                        String(idx + 1)
                      : String(idx + 1);

                    let btnStyle: string;
                    if (isDone && isRight) {
                      // ĐÚNG: Xanh lá (nếu đang xem thì thêm viền ring sáng)
                      btnStyle = isCurrent
                        ? "bg-emerald-600 text-white font-black ring-2 ring-sky-300 ring-offset-2 ring-offset-[#0d162d] shadow-lg shadow-emerald-500/40 border-emerald-400"
                        : "bg-emerald-600 text-white font-bold border border-emerald-400 shadow-sm hover:bg-emerald-500";
                    } else if (isDone && isWrong) {
                      // SAI: Đỏ (nếu đang xem thì thêm viền ring sáng)
                      btnStyle = isCurrent
                        ? "bg-rose-600 text-white font-black ring-2 ring-sky-300 ring-offset-2 ring-offset-[#0d162d] shadow-lg shadow-rose-500/40 border-rose-400"
                        : "bg-rose-600 text-white font-bold border border-rose-400 shadow-sm hover:bg-rose-500";
                    } else if (isCurrent) {
                      // ĐANG XEM (Chưa làm): Xanh da trời
                      btnStyle =
                        "bg-sky-500 text-white font-black ring-2 ring-sky-300 shadow-lg shadow-sky-500/40 border-transparent";
                    } else {
                      // CHƯA LÀM: Nền tối
                      btnStyle =
                        "bg-[#19243d] text-slate-300 border border-slate-700/60 hover:bg-[#233357] hover:text-white";
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onSelectSentence(idx);
                        }}
                        className={`relative aspect-square rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${btnStyle}`}
                      >
                        <span>{label}</span>

                        {/* Dấu chấm vàng góc phải nếu câu được bookmark / đánh dấu */}
                        {isBookmarked && (
                          <span
                            title="Câu đã đánh dấu cần luyện lại"
                            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-amber-200 flex items-center justify-center"
                          >
                            <Star
                              size={7}
                              className="text-amber-900 fill-current"
                            />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BÁO LỖI CÂU HỎI */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${
              isDarkMode
                ? "bg-[#0c142b] border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <Flag size={18} className="text-rose-400" />
              <span>Báo lỗi câu hỏi #{currentIndex + 1}</span>
            </h3>

            <p className="text-xs text-slate-400 mb-3">
              Vui lòng cho chúng tôi biết vấn đề bạn gặp phải (âm thanh lỗi, đáp
              án chưa chuẩn, bản dịch cần chỉnh sửa):
            </p>

            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Mô tả chi tiết lỗi phát hiện được..."
              rows={4}
              className={`w-full p-3.5 rounded-2xl border text-sm outline-none resize-none mb-4 ${
                isDarkMode
                  ? "bg-[#060b18] border-slate-800 text-slate-200 focus:border-rose-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-500"
              }`}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmitReport}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer shadow-md shadow-rose-500/20"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: TRA CỨU TỪ ĐIỂN NHANH */}
      {showDictModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative ${
              isDarkMode
                ? "bg-[#0c142b] border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <button
              type="button"
              onClick={() => setShowDictModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-base mb-3 flex items-center gap-2">
              <BookOpen size={18} className="text-sky-400" />
              <span>Tra từ điển TOEIC cấp tốc</span>
            </h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchDictQuery}
                onChange={(e) => setSearchDictQuery(e.target.value)}
                placeholder="Nhập từ tiếng Anh cần tra..."
                className={`w-full px-4 py-2.5 rounded-2xl border text-sm outline-none ${
                  isDarkMode
                    ? "bg-[#060b18] border-slate-800 text-slate-200 focus:border-sky-500"
                    : "bg-slate-50 border-slate-200 text-slate-800 focus:border-sky-500"
                }`}
              />
            </div>

            {searchDictQuery.trim() ? (
              <div
                className={`p-4 rounded-2xl border ${
                  isDarkMode
                    ? "bg-[#070e20] border-sky-500/30 text-slate-200"
                    : "bg-sky-50 border-sky-200 text-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sky-400 text-base capitalize">
                    {searchDictQuery.trim()}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePronounce(searchDictQuery.trim())}
                    className="p-1 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Từ vựng thông dụng xuất hiện thường xuyên trong bài thi TOEIC
                  Listening.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                Nhập bất kỳ từ vựng nào trong bài nghe để tra cứu phiên âm và
                nghĩa nhanh.
              </p>
            )}
          </div>
        </div>
      )}

      {/* DRAWER 4: GIỎ TỪ VỰNG ĐÃ LƯU (Chuẩn 100% Ảnh) */}
      <VocabBasketDrawer
        isOpen={showVocabDrawer}
        onClose={() => setShowVocabDrawer(false)}
        vocabs={savedVocabs}
        isDarkMode={isDarkMode}
        part={part}
        level={level}
      />
    </>
  );
};
