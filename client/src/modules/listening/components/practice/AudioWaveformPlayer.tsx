import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize2,
} from "lucide-react";
import type { ListeningPart } from "../../types";

interface AudioWaveformPlayerProps {
  sentenceText: string;
  directionText?: string;
  imageUrl?: string;
  part?: ListeningPart;
  audioDurationSec?: number;
  onSelectOptionKey?: (key: "A" | "B" | "C" | "D") => void;
  isDarkMode: boolean;
}

// 52 thanh waveform thể hiện biên độ âm thanh
const WAVEFORM_BARS = [
  6, 12, 22, 28, 24, 32, 26, 18, 26, 32, 34, 28, 22, 20, 16, 6, 6, 8, 10, 22,
  28, 34, 30, 24, 28, 32, 30, 24, 26, 34, 22, 8, 6, 8, 16, 26, 32, 28, 24, 30,
  10, 6, 8, 22, 30, 34, 28, 22, 16, 10, 6, 4,
];

export const AudioWaveformPlayer: React.FC<AudioWaveformPlayerProps> = ({
  sentenceText,
  directionText,
  imageUrl,
  part = 1,
  audioDurationSec,
  onSelectOptionKey,
  isDarkMode,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0); // 0 to 100
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);

  // Tính toán thời lượng ước tính của âm thanh dựa trên số từ hoặc prop
  const totalSeconds =
    audioDurationSec ||
    (part === 1
      ? 23
      : part === 2
        ? 19
        : Math.max(35, Math.min(77, sentenceText.split(" ").length * 0.9)));

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Dừng phát âm thanh
  const stopAudio = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    setCurrentTimeSec(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // Bắt đầu phát âm thanh
  const playAudio = useCallback(() => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(sentenceText);
    utterance.lang = "en-US";
    utterance.rate = speed;

    const voices = window.speechSynthesis.getVoices();
    const enVoice =
      voices.find(
        (v) =>
          v.lang.startsWith("en") &&
          (v.name.includes("Google") || v.name.includes("Natural")),
      ) || voices.find((v) => v.lang.startsWith("en"));

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      const estDurationMs = (totalSeconds * 1000) / speed;
      const step = 100;
      let elapsedMs = 0;

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = window.setInterval(() => {
        elapsedMs += step;
        const curSec = Math.min(Math.floor(elapsedMs / 1000), totalSeconds);
        setCurrentTimeSec(curSec);
        const p = Math.min((elapsedMs / estDurationMs) * 100, 100);
        setProgress(p);
      }, step);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setCurrentTimeSec(totalSeconds);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTimeSec(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [sentenceText, speed, totalSeconds]);

  // Đổi trạng thái Play / Pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopAudio();
    } else {
      playAudio();
    }
  }, [isPlaying, playAudio, stopAudio]);

  // Tua lùi 3 giây
  const handleRewind3s = useCallback(() => {
    stopAudio();
    playAudio();
  }, [stopAudio, playAudio]);

  // Tua tới 5 giây
  const handleForward5s = useCallback(() => {
    setCurrentTimeSec((prev) => Math.min(prev + 5, totalSeconds));
  }, [totalSeconds]);

  // Thay đổi tốc độ 0.75x -> 1x -> 1.25x -> 1.5x
  const handleCycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (isPlaying) {
      stopAudio();
      setTimeout(playAudio, 100);
    }
  };

  // Dừng âm thanh khi chuyển câu
  useEffect(() => {
    stopAudio();
  }, [sentenceText, stopAudio]);

  // Lắng nghe các phím tắt bàn phím toàn cục (Ctrl, Shift, 1-4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang gõ trong ô input / textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Phím Ctrl: Phát / Dừng
      if (e.key === "Control") {
        e.preventDefault();
        togglePlay();
      }
      // Phím Shift: Tua lại 3s
      else if (e.key === "Shift") {
        e.preventDefault();
        handleRewind3s();
      }
      // Phím 1, 2, 3, 4: Chọn đáp án A, B, C, D
      else if (["1", "2", "3", "4"].includes(e.key) && onSelectOptionKey) {
        e.preventDefault();
        const map: Record<string, "A" | "B" | "C" | "D"> = {
          "1": "A",
          "2": "B",
          "3": "C",
          "4": "D",
        };
        onSelectOptionKey(map[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, handleRewind3s, onSelectOptionKey]);

  // Format giây thành dạng mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  // Tiêu đề hướng dẫn mặc định theo Part
  const defaultDirection =
    part === 1
      ? "Select the one statement that best describes what you see in the picture."
      : part === 2
        ? "Select the best response to the question."
        : "Select the best response to each question.";

  return (
    <div className="space-y-4">
      {/* 1. TIÊU ĐỀ HƯỚNG DẪN CỦA ĐỀ THI (Chuẩn ảnh 1, 2, 3) */}
      <h2
        className={`font-bold text-sm sm:text-base leading-snug px-1 tracking-tight ${
          isDarkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        {directionText || defaultDirection}
      </h2>

      {/* 2. KHUNG TRÌNH PHÁT WAVEFORM ÂM THANH */}
      <div
        className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-200 ${
          isDarkMode
            ? "bg-[#0b1329]/95 border-slate-800/80 shadow-xl shadow-black/20"
            : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Nút Play / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? "Tạm dừng âm thanh (Ctrl)" : "Phát âm thanh (Ctrl)"}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer shadow-lg ${
              isPlaying
                ? "bg-amber-500 text-black shadow-amber-500/30 scale-105"
                : "bg-sky-500 hover:bg-sky-400 text-white shadow-sky-500/30"
            }`}
          >
            {isPlaying ? (
              <Pause size={20} className="fill-current" />
            ) : (
              <Play size={20} className="fill-current ml-0.5" />
            )}
          </button>

          {/* Dải sóng âm Waveform tương tác */}
          <div
            onClick={togglePlay}
            className={`flex-1 h-12 rounded-xl flex items-center justify-between px-3 cursor-pointer select-none overflow-hidden relative transition-colors ${
              isDarkMode ? "bg-[#060b18]" : "bg-sky-50/60"
            }`}
            title="Nhấp để phát hoặc dừng âm thanh"
          >
            {/* Lớp quét tiến trình màu xanh */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-sky-500/15 transition-all duration-100 pointer-events-none"
              style={{ width: `${progress}%` }}
            />

            {WAVEFORM_BARS.map((height, idx) => {
              const barProg = (idx / WAVEFORM_BARS.length) * 100;
              const isPassed = barProg <= progress;
              const isDot = height <= 6;

              return (
                <div
                  key={idx}
                  className="flex items-center justify-center h-full px-[1px]"
                >
                  {isDot ? (
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-150 ${
                        isPassed
                          ? "bg-sky-400 scale-125 shadow-sm shadow-sky-400/50"
                          : isDarkMode
                            ? "bg-slate-700"
                            : "bg-slate-300"
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isPassed
                          ? "bg-sky-400 shadow-sm shadow-sky-400/50"
                          : isDarkMode
                            ? "bg-slate-700/80"
                            : "bg-slate-300"
                      } ${isPlaying && isPassed ? "animate-pulse" : ""}`}
                      style={{ height: `${height}px` }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Thời gian hiển thị: 00:18 / 00:23 */}
          <div className="shrink-0 font-mono text-xs sm:text-sm font-semibold tracking-wide text-slate-400">
            <span
              className={isDarkMode ? "text-slate-200" : "text-slate-800"}
            >
              {formatTime(currentTimeSec)}
            </span>{" "}
            / {formatTime(totalSeconds)}
          </div>
        </div>

        {/* Thanh công cụ phụ: Tua 3s, Tua 5s, Tốc độ 1x */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800/40 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            {/* Tua lại 3s */}
            <button
              type="button"
              onClick={handleRewind3s}
              className={`flex items-center gap-1 hover:text-sky-400 transition-colors cursor-pointer ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <RotateCcw size={13} />
              <span>3s</span>
            </button>

            {/* Tua tới 5s */}
            <button
              type="button"
              onClick={handleForward5s}
              className={`flex items-center gap-1 hover:text-sky-400 transition-colors cursor-pointer ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <RotateCw size={13} />
              <span>5s</span>
            </button>
          </div>

          {/* Điều chỉnh tốc độ 1x */}
          <button
            type="button"
            onClick={handleCycleSpeed}
            className={`px-2 py-0.5 rounded-lg font-bold font-mono transition-colors cursor-pointer ${
              isDarkMode
                ? "bg-slate-800 text-slate-300 hover:text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* 3. DẢI PHÍM TẮT NHANH (Chuẩn ảnh 1, 2, 3) */}
      <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400 px-1 font-medium select-none">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono text-[10px] border border-slate-700">
            Ctrl
          </kbd>
          <span>Phát/Dừng</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono text-[10px] border border-slate-700">
            Shift
          </kbd>
          <span>Tua lại 3s</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 font-mono text-[10px] border border-slate-700">
            1-4
          </kbd>
          <span>Chọn đáp án</span>
        </div>
      </div>

      {/* 4. KHỐI HÌNH ẢNH / SƠ ĐỒ MẶT BẰNG (Hiển thị cho Part 1 & Part 3/4 có ảnh) */}
      {imageUrl && (
        <div
          className={`relative rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300 group flex items-center justify-center ${
            isDarkMode
              ? "bg-[#0b1329]/95 border-slate-800/80 shadow-xl shadow-black/20"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <img
            src={imageUrl}
            alt="Đề thi TOEIC Listening"
            className="w-full max-h-[360px] sm:max-h-[420px] object-contain rounded-2xl mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Nút phóng to ảnh */}
          <button
            type="button"
            onClick={() => setIsImageZoomed(true)}
            title="Xem hình ảnh kích thước lớn"
            className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 cursor-pointer backdrop-blur-sm"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      )}

      {/* MODAL PHÓNG TO HÌNH ẢNH */}
      {isImageZoomed && imageUrl && (
        <div
          onClick={() => setIsImageZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={imageUrl}
              alt="Phóng to đề thi"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
};
