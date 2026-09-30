import type React from "react";
import { useState } from "react";
import { Bell, CheckCircle2, Save } from "lucide-react";
import { useAuth } from "../../../context";

interface NotificationsTabProps {
  isDarkMode: boolean;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  isDarkMode,
}) => {
  const { user } = useAuth();
  const userEmail = user?.email || "dangquoctrunglk@gmail.com";

  const [notifyDaily, setNotifyDaily] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [notifyWeeklyEmail, setNotifyWeeklyEmail] = useState(true);
  const [notifyNewTests, setNotifyNewTests] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [notifySaved, setNotifySaved] = useState(false);

  const handleSaveNotifications = () => {
    try {
      localStorage.setItem(
        `toeic_user_notif_${userEmail}`,
        JSON.stringify({
          notifyDaily,
          reminderTime,
          notifyWeeklyEmail,
          notifyNewTests,
          soundEffects,
        }),
      );
    } catch {
      // ignore
    }
    setNotifySaved(true);
    setTimeout(() => setNotifySaved(false), 3000);
  };

  return (
    <div
      className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDarkMode
          ? "bg-[#0b1329]/90 border-slate-800 text-slate-100 shadow-xl"
          : "bg-white border-slate-200 text-slate-900 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-800/40">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
          <Bell size={20} />
        </div>
        <div>
          <h3 className="font-bold text-lg">
            Cài đặt thông báo &amp; Nhắc nhở
          </h3>
          <p className="text-xs text-slate-400">
            Tùy chọn cách thức TOEIC Master AI gửi thông báo để bạn luôn duy trì
            động lực học
          </p>
        </div>
      </div>

      {notifySaved && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-slide-up">
          <CheckCircle2 size={18} className="shrink-0" />
          <span className="text-sm font-semibold">
            Đã lưu cài đặt thông báo của bạn thành công!
          </span>
        </div>
      )}

      <div className="space-y-4 max-w-2xl text-xs sm:text-sm">
        {/* 1. Nhắc học hàng ngày */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <div className="font-bold text-sm">Nhắc nhở học tập hàng ngày</div>
            <div className="text-xs text-slate-400 mt-0.5">
              Gửi thông báo đẩy qua trình duyệt để duy trì chuỗi Streak mỗi ngày
            </div>
            {notifyDaily && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">Giờ nhắc:</span>
                <select
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-cyan-400"
                      : "bg-white border-slate-300 text-indigo-600"
                  }`}
                >
                  <option value="07:00">07:00 Sáng (Khởi động)</option>
                  <option value="12:30">12:30 Trưa (Nghỉ trưa)</option>
                  <option value="19:30">19:30 Tối</option>
                  <option value="20:00">20:00 Tối (Khuyên dùng)</option>
                  <option value="21:30">21:30 Đêm</option>
                </select>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setNotifyDaily(!notifyDaily)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              notifyDaily ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                notifyDaily ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* 2. Báo cáo tuần qua Email */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <div className="font-bold text-sm">
              Báo cáo tiến độ tuần từ AI Mentor
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Gửi bản tin tổng kết số câu đúng, kỹ năng còn yếu vào sáng Chủ
              Nhật
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotifyWeeklyEmail(!notifyWeeklyEmail)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              notifyWeeklyEmail ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                notifyWeeklyEmail ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* 3. Đề thi mới & Cập nhật */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <div className="font-bold text-sm">
              Cập nhật đề thi ETS &amp; Mẹo TOEIC
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Nhận thông tin khi có đề thi thử mới hoặc mẹo giải đề từ chuyên
              gia
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNotifyNewTests(!notifyNewTests)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              notifyNewTests ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                notifyNewTests ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* 4. Âm thanh khi làm bài */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
            isDarkMode
              ? "bg-slate-900/60 border-slate-800"
              : "bg-slate-50 border-slate-200"
          }`}
        >
          <div>
            <div className="font-bold text-sm">
              Hiệu ứng âm thanh khi làm bài
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Phát âm thanh khích lệ khi hoàn thành câu hỏi và đạt mốc điểm mới
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSoundEffects(!soundEffects)}
            className={`w-12 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer ${
              soundEffects ? "bg-indigo-600" : "bg-slate-700"
            }`}
          >
            <span
              className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                soundEffects ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveNotifications}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 cursor-pointer"
          >
            <Save size={15} />
            <span>Lưu cài đặt thông báo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
