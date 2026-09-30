import type React from "react";
import { Headphones, Sparkles } from "lucide-react";

/**
 * ==============================================================================
 * COMPONENT: ListeningHero.tsx
 * MỤC ĐÍCH: Khối Banner Hero trang Luyện nghe TOEIC Listening (Chuẩn hình ảnh mẫu)
 * HIỆU ỨNG: Chữ Gradient Cyan/Blue, Thẻ Tai nghe dạ quang nổi bật, Khung bo tròn viền mờ
 * ==============================================================================
 */

interface ListeningHeroProps {
  isDarkMode: boolean;
}

export const ListeningHero: React.FC<ListeningHeroProps> = ({ isDarkMode }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-r from-[#0b1329]/95 via-[#0e1738]/90 to-[#0b1329]/95 border-sky-500/20 shadow-2xl shadow-blue-950/40"
          : "bg-gradient-to-r from-sky-50/80 via-blue-50/60 to-indigo-50/80 border-sky-200 shadow-lg shadow-sky-100"
      }`}
    >
      {/* Hiệu ứng hào quang nền mờ (Ambient Glow) */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          {/* Badge nhỏ: ✨ Luyện nghe TOEIC */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 border transition-colors ${
              isDarkMode
                ? "bg-sky-500/15 border-sky-500/30 text-sky-300"
                : "bg-sky-100 border-sky-300 text-sky-700"
            }`}
          >
            <Sparkles size={14} className="text-sky-400" />
            <span>Luyện nghe TOEIC</span>
          </div>

          {/* Tiêu đề chính lớn */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
            <span className={isDarkMode ? "text-white" : "text-slate-900"}>
              Chinh phục{" "}
            </span>
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              TOEIC Listening
            </span>
            <span className={isDarkMode ? "text-white" : "text-slate-900"}>
              {" "}
              từ dễ đến khó
            </span>
          </h1>

          {/* Dòng mô tả ngắn */}
          <p
            className={`mt-3 text-sm sm:text-base font-medium max-w-xl ${
              isDarkMode ? "text-slate-300/90" : "text-slate-600"
            }`}
          >
            Nghe chép chính tả và luyện Part 1–4 theo 4 cấp độ.
          </p>
        </div>

        {/* Khối Thẻ Icon Tai Nghe Phát Sáng Lớn bên phải (Chuẩn hình ảnh mẫu) */}
        <div className="self-start md:self-center shrink-0">
          <div
            className={`relative group w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-0.5 transition-transform duration-300 hover:scale-105 ${
              isDarkMode
                ? "bg-gradient-to-br from-sky-400 to-blue-600 shadow-xl shadow-sky-500/25"
                : "bg-gradient-to-br from-sky-400 to-blue-500 shadow-lg shadow-sky-200"
            }`}
          >
            <div
              className={`w-full h-full rounded-[22px] flex items-center justify-center transition-colors ${
                isDarkMode ? "bg-[#0b1329]" : "bg-white"
              }`}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <Headphones size={32} className="stroke-[2.2]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
