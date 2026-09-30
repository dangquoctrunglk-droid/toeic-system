import type React from "react";
import { useState } from "react";
import {
  Flag,
  ShoppingBag,
  Grid,
  X,
  Volume2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { toast } from "react-toastify";
import type { VocabItem } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: PracticeBottomBar.tsx
 * MỤC ĐÍCH: Thanh điều khiển dưới đáy phòng luyện nghe chuẩn Ảnh 1, Ảnh 2, Ảnh 3:
 *   - Trái:
 *     1. 🚩 Báo lỗi (Modal gửi phản hồi câu hỏi)
 *     2. 🧺 Giỏ từ (Drawer xem các từ vựng đã lưu kèm phát âm)
 *     3. 📖 Tra từ (Modal tra cứu từ điển nhanh cho bài học)
 *   - Phải:
 *     4. < (Nút câu trước)
 *     5. 㗊 1/27 (Nút xanh lá mở Lưới chọn nhanh câu hỏi 1 -> N)
 *     6. > (Nút câu kế tiếp)
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
}

export const PracticeBottomBar: React.FC<PracticeBottomBarProps> = ({
  currentIndex,
  totalSentences,
  onSelectSentence,
  completedMap = {},
  correctMap = {},
  savedVocabs,
  isDarkMode,
}) => {
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showVocabDrawer, setShowVocabDrawer] = useState<boolean>(false);
  const [showGridModal, setShowGridModal] = useState<boolean>(false);
  const [showDictModal, setShowDictModal] = useState<boolean>(false);
  const [reportText, setReportText] = useState<string>("");
  const [searchDictQuery, setSearchDictQuery] = useState<string>("");

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
      {/* THANH ĐIỀU KHIỂN CỐ ĐỊNH Ở ĐÁY MÀN HÌNH */}
      <footer
        className={`fixed bottom-0 left-0 right-0 z-40 transition-colors duration-200 border-t ${
          isDarkMode
            ? "bg-[#080d1c]/95 backdrop-blur-xl border-slate-800/80 shadow-[0_-4px_25px_rgba(0,0,0,0.6)]"
            : "bg-white/95 backdrop-blur-xl border-slate-200 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
        }`}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
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

            {/* Nút: 📖 Tra từ (Chuẩn ảnh 1, 2, 3) */}
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

          {/* 2. CỤM PHẢI: ĐIỀU HƯỚNG CÂU < 㗊 1/27 > */}
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

            {/* Nút 㗊 1/27 (Pill xanh lá mở modal lưới câu hỏi - Chuẩn ảnh 1, 2, 3) */}
            <button
              type="button"
              onClick={() => setShowGridModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
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

      {/* MODAL 1: LƯỚI CHỌN NHANH CÂU HỎI (QUESTION PALETTE) */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 border shadow-2xl relative ${
              isDarkMode
                ? "bg-[#0c142b] border-slate-700 text-slate-100"
                : "bg-white border-slate-300 text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base flex items-center gap-2">
                <Grid size={18} className="text-emerald-400" />
                <span>Danh sách câu hỏi ({totalSentences} câu)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowGridModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Lưới các nút 1, 2, 3 ... N */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5 max-h-[380px] overflow-y-auto p-2 my-4">
              {Array.from({ length: totalSentences }).map((_, idx) => {
                const isCurrent = idx === currentIndex;
                const isDone = completedMap[idx];
                const isRight = correctMap[idx];

                let btnStyles = "";
                if (isCurrent) {
                  btnStyles =
                    "bg-sky-500 text-white font-black ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0c142b] shadow-md shadow-sky-500/30";
                } else if (isDone && isRight) {
                  btnStyles =
                    "bg-emerald-600/30 border border-emerald-500/60 text-emerald-400 font-bold";
                } else if (isDone && !isRight) {
                  btnStyles =
                    "bg-rose-600/30 border border-rose-500/60 text-rose-400 font-bold";
                } else {
                  btnStyles = isDarkMode
                    ? "bg-[#060b18] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectSentence(idx);
                      setShowGridModal(false);
                    }}
                    className={`h-10 rounded-xl flex items-center justify-center text-xs transition-all cursor-pointer ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Chú thích màu sắc */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-sky-500" />
                <span>Đang làm</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span>Làm đúng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Làm sai</span>
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
              Vui lòng cho chúng tôi biết vấn đề bạn gặp phải (âm thanh lỗi, đáp án chưa chuẩn, bản dịch cần chỉnh sửa):
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
                  Từ vựng thông dụng xuất hiện thường xuyên trong bài thi TOEIC Listening.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">
                Nhập bất kỳ từ vựng nào trong bài nghe để tra cứu phiên âm và nghĩa nhanh.
              </p>
            )}
          </div>
        </div>
      )}

      {/* DRAWER 4: GIỎ TỪ VỰNG ĐÃ LƯU */}
      {showVocabDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className={`w-full max-w-md h-full p-6 border-l shadow-2xl flex flex-col justify-between ${
              isDarkMode
                ? "bg-[#0c142b] border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="font-black text-base flex items-center gap-2">
                  <ShoppingBag size={18} className="text-amber-400" />
                  <span>Giỏ từ vựng ({savedVocabs.length})</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowVocabDrawer(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {savedVocabs.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  <ShoppingBag size={32} className="mx-auto mb-2 opacity-40" />
                  <p>Chưa có từ vựng nào trong giỏ từ.</p>
                  <p className="mt-1">
                    Hãy bấm "Lưu từ" ở thẻ từ vựng để ôn tập sau!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
                  {savedVocabs.map((v, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-2xl border transition-colors ${
                        isDarkMode
                          ? "bg-[#060b18] border-slate-800/80"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400 text-sm">
                            {v.word}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            {v.phonetic}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePronounce(v.word)}
                          className="p-1 rounded-lg bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 transition-colors"
                        >
                          <Volume2 size={13} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-300">{v.meaning}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowVocabDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer text-center"
            >
              Đóng giỏ từ
            </button>
          </div>
        </div>
      )}
    </>
  );
};
