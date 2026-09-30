import { useState } from "react";
import { X, Lightbulb, Send, CheckCircle2 } from "lucide-react";

/**
 * ==============================================================================
 * FILE: SuggestionModal.tsx
 * MỤC ĐÍCH: Hộp thoại Modal Popup cho phép học viên gửi đề xuất tính năng hoặc báo lỗi
 * CÁC TRƯỜNG NHẬP LIỆU:
 *   - Loại đề xuất (Dropdown: Tính năng mới, Giao diện/UX, Đề thi, Báo lỗi, Khác)
 *   - Tiêu đề đề xuất ngắn gọn
 *   - Mô tả chi tiết ý tưởng/góp ý
 * HIỆU ỨNG:
 *   - Nền mờ Backdrop Blur + Thẻ card Zoom-in mượt mà
 *   - Khi gửi thành công: Hiển thị icon CheckCircle2 nhấp nháy chúc mừng và lời cảm ơn
 * ==============================================================================
 */

/**
 * Props truyền vào SuggestionModal
 * @property isOpen - Trạng thái modal đang mở hay đóng
 * @property onClose - Hàm kích hoạt đóng modal (reset form)
 */
interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Trạng thái đã gửi ý kiến thành công hay chưa
  const [submitted, setSubmitted] = useState(false);

  // Không render nếu modal đang đóng
  if (!isOpen) return null;

  // Xử lý đóng modal và reset lại form
  const handleClose = () => {
    onClose();
    setSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-modal-backdrop">
      <div className="relative w-full max-w-md bg-[#0d1428] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl text-slate-100 animate-modal-card">
        {/* Nút X đóng góc trên bên phải */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
          title="Đóng hộp thoại"
        >
          <X size={20} />
        </button>

        {/* Tiêu đề Modal */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lightbulb size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gửi đề xuất & ý kiến</h3>
            <p className="text-xs text-slate-400">
              Góp phần giúp TOEIC Master AI hoàn thiện hơn
            </p>
          </div>
        </div>

        {/* Giao diện sau khi gửi thành công */}
        {submitted ? (
          <div className="py-6 flex flex-col items-center text-center">
            <CheckCircle2
              size={48}
              className="text-emerald-400 mb-3 animate-bounce"
            />
            <h4 className="text-base font-semibold text-white mb-1">
              Cảm ơn đề xuất quý giá của bạn!
            </h4>
            <p className="text-sm text-slate-400 mb-5">
              Ý kiến của bạn đã được ghi nhận vào lộ trình nâng cấp hệ thống.
            </p>
            <button
              onClick={handleClose}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : (
          /* Form nhập liệu đề xuất */
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Loại đề xuất
              </label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option value="feature">Tính năng học tập mới</option>
                <option value="ui">Giao diện & trải nghiệm người dùng</option>
                <option value="exam">Nội dung đề thi & bài tập</option>
                <option value="bug">Báo cáo lỗi kỹ thuật</option>
                <option value="other">Ý kiến khác</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tiêu đề đề xuất
              </label>
              <input
                type="text"
                required
                placeholder="VD: Thêm chế độ luyện nghe từng câu..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Mô tả chi tiết
              </label>
              <textarea
                rows={3}
                required
                placeholder="Mô tả cụ thể ý tưởng của bạn để chúng tôi dễ dàng thực hiện..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Send size={16} />
              <span>Gửi đề xuất</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
