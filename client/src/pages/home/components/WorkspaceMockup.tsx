import {
  Sparkles,
  Target,
  Check,
  Clock,
  Flame,
  Headphones,
  BookOpen,
  PenTool,
  BarChart3,
  Mic,
  Send,
  CheckCircle2,
} from "lucide-react";

export function WorkspaceMockup() {
  return (
    <div className="relative w-full max-w-5xl mx-auto animate-slide-up [animation-delay:0.45s]">
      {/* Hào quang ánh sáng mờ bên ngoài */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/20 to-cyan-500/30 rounded-3xl blur-xl opacity-60 pointer-events-none" />

      {/* Khung ứng dụng chính */}
      <div className="relative bg-[#0b1226]/95 border border-indigo-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 overflow-hidden backdrop-blur-xl text-left">
        {/* Thanh tiêu đề cửa sổ */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0e1730] border-b border-indigo-500/15">
          <div className="flex items-center gap-3">
            {/* 3 nút điều khiển cửa sổ kiểu macOS */}
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm" />
            </div>
            <div className="h-4 w-px bg-slate-700/60 mx-1 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-300 hidden sm:inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-indigo-400" />
              TOEIC Master Studio — Lộ trình cá nhân hóa
            </span>
          </div>

          {/* Các tab chức năng của cửa sổ */}
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
            <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium shadow-sm">
              Tổng quan
            </button>
            <button className="px-3 py-1 rounded-md text-slate-400 hover:text-slate-200 hidden sm:inline-block">
              Listening
            </button>
            <button className="px-3 py-1 rounded-md text-slate-400 hover:text-slate-200 hidden sm:inline-block">
              Reading
            </button>
            <button className="px-3 py-1 rounded-md text-slate-400 hover:text-slate-200 hidden md:inline-block">
              Writing AI
            </button>
          </div>

          {/* Huy hiệu trạng thái hệ thống */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ETS 2026 Format
            </span>
          </div>
        </div>

        {/* Nội dung cửa sổ chia 2 cột */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20 sm:pb-24">
          {/* Cột trái: Kế hoạch học tập AI hàng ngày (5 cột) */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-[#111c38]/70 border border-indigo-500/15 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  Nhiệm vụ hôm nay
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                3/4 hoàn thành
              </span>
            </div>

            {/* Thanh tiến độ hoàn thành */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: "75%" }}
              />
            </div>

            {/* Danh sách nhiệm vụ */}
            <div className="flex flex-col gap-2.5 mt-1">
              {/* Nhiệm vụ 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      Part 2: Bẫy câu hỏi gián tiếp
                    </div>
                    <div className="text-[11px] text-slate-400">
                      15 câu · 100% đúng
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400">
                  +15 XP
                </span>
              </div>

              {/* Nhiệm vụ 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-200">
                      Part 5: Rút gọn mệnh đề quan hệ
                    </div>
                    <div className="text-[11px] text-slate-400">
                      20 câu · Giải thích chi tiết
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-emerald-400">
                  +20 XP
                </span>
              </div>

              {/* Nhiệm vụ 3 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                    <Sparkles size={13} className="animate-spin" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Writing Task 2: Email công vụ
                    </div>
                    <div className="text-[11px] text-indigo-300">
                      AI đang chấm điểm & feedback...
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-indigo-400">
                  Đang chấm
                </span>
              </div>

              {/* Nhiệm vụ 4 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                    <Clock size={13} />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-300">
                      Flashcard 25 từ Spaced Repetition
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Chủ đề: Corporate Finance
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  Chờ ôn
                </span>
              </div>
            </div>

            {/* Khối chuỗi ngày học tập liên tiếp */}
            <div className="mt-1 flex items-center justify-between p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">
                  Chuỗi học 15 ngày liên tiếp!
                </span>
              </div>
              <span className="text-[11px] bg-amber-500/20 px-2 py-0.5 rounded font-bold">
                Kỷ lục mới
              </span>
            </div>
          </div>

          {/* Cột phải: Dự đoán điểm số & Năng lực (7 cột) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Khối tóm tắt điểm số */}
            <div className="bg-[#111c38]/70 border border-indigo-500/15 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    DỰ ĐOÁN ĐIỂM ETS HIỆN TẠI
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl sm:text-5xl font-black text-white gradient-text leading-none">
                      785
                    </span>
                    <span className="text-sm font-semibold text-slate-400">
                      / 990 điểm
                    </span>
                    <span className="ml-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      +50 điểm tuần này
                    </span>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-400">Mục tiêu cá nhân</div>
                  <div className="text-lg font-bold text-indigo-300">
                    850 TOEIC
                  </div>
                </div>
              </div>

              {/* Thanh tiến độ điểm số */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                  style={{ width: "79.2%" }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Xuất phát: 450</span>
                <span>Hiện tại: 785</span>
                <span>Mục tiêu: 850</span>
              </div>

              {/* 4 thẻ kỹ năng Listening, Reading, Writing, Từ vựng */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
                <div className="p-3 rounded-xl bg-slate-900/70 border border-indigo-500/15">
                  <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium mb-1">
                    <Headphones size={13} />
                    Listening
                  </div>
                  <div className="text-lg font-bold text-white">410</div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    ↑ +35đ (Part 2,3)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-500/15">
                  <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium mb-1">
                    <BookOpen size={13} />
                    Reading
                  </div>
                  <div className="text-lg font-bold text-white">375</div>
                  <div className="text-[10px] text-emerald-400 font-medium">
                    ↑ +15đ (Part 5)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/15">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium mb-1">
                    <PenTool size={13} />
                    Writing
                  </div>
                  <div className="text-lg font-bold text-white">82%</div>
                  <div className="text-[10px] text-slate-400">
                    8.5/10 rubric
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/15">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-1">
                    <Target size={13} />
                    Từ vựng
                  </div>
                  <div className="text-lg font-bold text-white">1,250</div>
                  <div className="text-[10px] text-slate-400">
                    Từ đã ghi nhớ
                  </div>
                </div>
              </div>
            </div>

            {/* Biểu đồ hoạt động luyện tập 7 ngày */}
            <div className="bg-[#111c38]/70 border border-indigo-500/15 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <BarChart3 size={15} className="text-indigo-400" />
                  Thời lượng luyện tập 7 ngày qua
                </div>
                <span className="text-[11px] text-slate-400">
                  Trung bình 45 phút/ngày
                </span>
              </div>

              <div className="flex items-end gap-2.5 sm:gap-4 h-20 pt-2">
                {[
                  { day: "T2", height: "65%" },
                  { day: "T3", height: "85%" },
                  { day: "T4", height: "45%" },
                  { day: "T5", height: "95%" },
                  { day: "T6", height: "70%" },
                  { day: "T7", height: "90%" },
                  { day: "CN", height: "60%" },
                ].map((bar) => (
                  <div
                    key={bar.day}
                    className="flex-1 h-full flex flex-col items-center justify-end group"
                  >
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 via-purple-500 to-cyan-400 group-hover:brightness-125 transition-all"
                      style={{ height: bar.height }}
                    />
                    <span className="text-[10px] text-slate-400 font-medium mt-1.5">
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Thanh gợi ý hỏi đáp AI nổi */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[92%] sm:w-[80%] max-w-2xl mb-6">
          <div className="flex items-center gap-3 bg-[#0d152b]/95 border border-indigo-400/40 rounded-2xl px-4 py-3 shadow-2xl shadow-indigo-950 backdrop-blur-2xl">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-slate-300 truncate">
                Hỏi AI: &quot;Tại sao câu 112 Part 5 lại chọn phương án C thay
                vì B?&quot;
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Microphone"
              >
                <Mic size={16} />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md hover:brightness-110 transition-all"
              >
                <span>Hỏi AI</span>
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Các huy hiệu thành tích nổi trang trí */}
      <div className="absolute -top-4 -right-4 hidden lg:flex items-center gap-2.5 bg-[#0f1936]/90 border border-emerald-500/30 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-black/50 backdrop-blur-md animate-float">
        <CheckCircle2 size={18} className="text-emerald-400" />
        <span>+50 Điểm ETS Tuần Này! 🎯</span>
      </div>
      <div className="absolute top-1/2 -left-6 hidden lg:flex items-center gap-2.5 bg-[#0f1936]/90 border border-indigo-500/30 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl shadow-black/50 backdrop-blur-md animate-float-delayed">
        <Flame size={18} className="text-amber-400 fill-amber-400" />
        <span>Streak: 15 ngày liên tục 🔥</span>
      </div>
    </div>
  );
}
export default WorkspaceMockup;
