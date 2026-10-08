import type React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  GripVertical,
  X,
  MousePointer2,
  PenTool,
  Highlighter,
  Underline,
  Eraser,
  Square,
  Type,
  StickyNote,
  ArrowUpRight,
  Palette,
  RotateCcw,
  RotateCw,
  Eye,
  EyeOff,
  Trash2,
  BookOpen,
} from "lucide-react";
import type { AnnotatorTool } from "../annoCanvas";

interface AnnotatorToolbarProps {
  activeTool: AnnotatorTool;
  setActiveTool: (tool: AnnotatorTool) => void;
  activeColor: string;
  setActiveColor: (color: string) => void;
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onClear: () => void;
  onClose: () => void;
  onOpenNotes?: () => void;
}

const PRESET_COLORS = [
  { name: "Sky", color: "#38bdf8" },
  { name: "Yellow", color: "#facc15" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Green", color: "#34d399" },
  { name: "White", color: "#ffffff" },
];

const TOOLTIP_CLASS =
  "absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center px-4 py-2.5 rounded-xl bg-[#0c152a]/95 border border-slate-700 text-white font-bold text-base shadow-2xl whitespace-nowrap z-50 pointer-events-none animate-fade-in tracking-wide";

export const AnnotatorToolbar: React.FC<AnnotatorToolbarProps> = ({
  activeTool,
  setActiveTool,
  activeColor,
  setActiveColor,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  isVisible,
  onToggleVisibility,
  onClear,
  onClose,
  onOpenNotes,
}) => {
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

  // Vị trí kéo thả thanh Toolbar (mặc định cách lề trái 16px, cách đỉnh 80px)
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 16,
    y: 80,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Bắt đầu kéo thanh Annotator bằng chuột hoặc cảm ứng
  const handleStartDrag = (clientX: number, clientY: number) => {
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      startX: position.x,
      startY: position.y,
    };
  };

  // Lắng nghe sự kiện di chuyển chuột/touch toàn cục khi kéo
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.mouseX;
      const dy = e.clientY - dragStartRef.current.mouseY;

      const maxX = Math.max(10, window.innerWidth - 85);
      const maxY = Math.max(10, window.innerHeight - 680);

      setPosition({
        x: Math.min(maxX, Math.max(8, dragStartRef.current.startX + dx)),
        y: Math.min(maxY, Math.max(50, dragStartRef.current.startY + dy)),
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current || e.touches.length === 0) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.mouseX;
      const dy = touch.clientY - dragStartRef.current.mouseY;

      const maxX = Math.max(10, window.innerWidth - 85);
      const maxY = Math.max(10, window.innerHeight - 680);

      setPosition({
        x: Math.min(maxX, Math.max(8, dragStartRef.current.startX + dx)),
        y: Math.min(maxY, Math.max(50, dragStartRef.current.startY + dy)),
      });
    };

    const handleEndDrag = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEndDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEndDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEndDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEndDrag);
    };
  }, [isDragging]);

  // Đổi màu tiếp theo trong danh sách
  const cycleColor = useCallback(() => {
    const currentIndex = PRESET_COLORS.findIndex(
      (c) => c.color === activeColor,
    );
    const nextIndex = (currentIndex + 1) % PRESET_COLORS.length;
    setActiveColor(PRESET_COLORS[nextIndex].color);
  }, [activeColor, setActiveColor]);

  const activeToolRef = useRef(activeTool);
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  // LẮNG NGHE PHÍM TẮT TOÀN CỤC DỰA THEO CHỮ CÁI ĐẦU
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang gõ trong input, textarea hoặc modal
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      // Phím tắt theo chữ cái đầu
      if (key === "M") {
        e.preventDefault();
        setActiveTool("select");
      } else if (key === "P") {
        e.preventDefault();
        setActiveTool("pen");
      } else if (key === "H") {
        e.preventDefault();
        setActiveTool("highlighter");
      } else if (key === "U") {
        e.preventDefault();
        setActiveTool("underline");
      } else if (key === "E") {
        e.preventDefault();
        setActiveTool("eraser");
      } else if (key === "R") {
        e.preventDefault();
        setActiveTool("rect");
      } else if (key === "T") {
        e.preventDefault();
        setActiveTool("text");
      } else if (key === "N") {
        e.preventDefault();
        setActiveTool(activeToolRef.current === "note" ? "select" : "note");
      } else if (key === "A") {
        e.preventDefault();
        setActiveTool("arrow");
      } else if (key === "C") {
        e.preventDefault();
        cycleColor();
      } else if (key === "Z" && !e.ctrlKey) {
        e.preventDefault();
        onUndo();
      } else if (key === "Y" && !e.ctrlKey) {
        e.preventDefault();
        onRedo();
      } else if (key === "O") {
        e.preventDefault();
        onToggleVisibility();
      } else if (key === "D") {
        e.preventDefault();
        onClear();
      } else if (key === "B") {
        e.preventDefault();
        onOpenNotes?.();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    setActiveTool,
    cycleColor,
    onUndo,
    onRedo,
    onToggleVisibility,
    onClear,
    onOpenNotes,
    onClose,
  ]);

  return (
    <aside
      aria-label="Thanh công cụ Annotator"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      className={`fixed z-50 flex flex-col items-center bg-[#0b1328]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl w-[52px] select-none animate-fade-in transition-shadow ${
        isDragging
          ? "shadow-sky-500/20 border-sky-400/60 ring-2 ring-sky-500/30"
          : "hover:border-slate-600"
      }`}
    >
      {/* 1. Header: Nút kéo handle ::: + Nút đóng ✕ (Căn đều 2 bên, vừa vặn, đối xứng) */}
      <div className="grid grid-cols-2 items-center gap-1 w-full pb-1.5 mb-1 border-b border-slate-800/80">
        {/* Nút kéo ::: có thể di chuyển thanh toolbar */}
        <div
          onMouseDown={(e) => handleStartDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handleStartDrag(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          title="Kéo để di chuyển"
          className="relative group w-full h-6.5 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={14} />
          {/* Tooltip: Kéo để di chuyển chuẩn DauEnglish */}
          <div className={TOOLTIP_CLASS}>Kéo để di chuyển</div>
        </div>

        {/* Nút đóng ✕ */}
        <button
          type="button"
          onClick={onClose}
          title="Đóng thanh Annotator (Phím Esc)"
          className="w-full h-6.5 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 cursor-pointer transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* 2. Nhóm công cụ vẽ chính (Phím tắt theo chữ cái đầu) */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {/* 1. Chuột · phím tắt M */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("select")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "select"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <MousePointer2 size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Chuột · phím tắt M</div>
        </div>

        {/* 2. Bút vẽ · phím tắt P */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("pen")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "pen"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <PenTool size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Bút vẽ · phím tắt P</div>
        </div>

        {/* 3. Dạ quang · phím tắt H */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("highlighter")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "highlighter"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Highlighter size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Dạ quang · phím tắt H</div>
        </div>

        {/* 4. Gạch chân · phím tắt U */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("underline")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "underline"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Underline size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Gạch chân · phím tắt U</div>
        </div>

        {/* 5. Gôm tẩy · phím tắt E */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("eraser")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "eraser"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Eraser size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Gôm tẩy · phím tắt E</div>
        </div>

        {/* 6. Khung chữ nhật · phím tắt R */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("rect")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "rect"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Square size={17} />
          </button>
          <div className={TOOLTIP_CLASS}>Khung chữ nhật · phím tắt R</div>
        </div>

        {/* 7. Văn bản · phím tắt T */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("text")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "text"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Type size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Văn bản · phím tắt T</div>
        </div>

        {/* 8. Ghi chú · phím tắt N */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() =>
              setActiveTool(activeTool === "note" ? "select" : "note")
            }
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "note"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <StickyNote size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Ghi chú · phím tắt N</div>
        </div>

        {/* 9. Mũi tên · phím tắt A */}
        <div className="relative group w-full flex justify-center">
          <button
            type="button"
            onClick={() => setActiveTool("arrow")}
            className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === "arrow"
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <ArrowUpRight size={18} />
          </button>
          <div className={TOOLTIP_CLASS}>Mũi tên · phím tắt A</div>
        </div>
      </div>

      <div className="w-6 h-[1px] bg-slate-800 my-1.5" />

      {/* 3. Bảng màu Palette · phím tắt C */}
      <div className="relative group w-full flex justify-center">
        <button
          type="button"
          onClick={() => setShowColorPicker((prev) => !prev)}
          className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer relative"
        >
          <Palette size={18} />
          {/* Chấm tròn biểu thị màu đang chọn */}
          <span
            className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-slate-900 shadow-md"
            style={{ backgroundColor: activeColor }}
          />
        </button>
        <div className={TOOLTIP_CLASS}>Bảng màu · phím tắt C</div>

        {/* Popover bảng màu */}
        {showColorPicker && (
          <div className="absolute left-full ml-3 top-0 z-50 p-2.5 rounded-2xl bg-[#0c142b] border border-slate-700 shadow-2xl flex flex-col gap-2 animate-scale-up">
            {PRESET_COLORS.map((item) => (
              <button
                key={item.color}
                type="button"
                onClick={() => {
                  setActiveColor(item.color);
                  setShowColorPicker(false);
                }}
                className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
                  activeColor === item.color
                    ? "scale-125 border-white ring-2 ring-sky-500/50"
                    : "border-slate-700 hover:scale-110"
                }`}
                style={{ backgroundColor: item.color }}
                title={item.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Hoàn tác · phím tắt Z */}
      <div className="relative group w-full flex justify-center">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <RotateCcw size={17} />
        </button>
        <div className={TOOLTIP_CLASS}>Hoàn tác · phím tắt Z</div>
      </div>

      {/* 5. Làm lại · phím tắt Y */}
      <div className="relative group w-full flex justify-center">
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          <RotateCw size={17} />
        </button>
        <div className={TOOLTIP_CLASS}>Làm lại · phím tắt Y</div>
      </div>

      <div className="w-6 h-[1px] bg-slate-800 my-1.5" />

      {/* 6. Ẩn/Hiện nét vẽ · phím tắt O */}
      <div className="relative group w-full flex justify-center">
        <button
          type="button"
          onClick={onToggleVisibility}
          className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
            !isVisible
              ? "text-amber-400 bg-amber-400/15 border border-amber-400/30"
              : "text-slate-400 hover:text-white hover:bg-slate-800"
          }`}
        >
          {isVisible ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
        <div className={TOOLTIP_CLASS}>
          {isVisible ? "Ẩn nét vẽ · phím tắt O" : "Hiện nét vẽ · phím tắt O"}
        </div>
      </div>

      {/* 7. Xóa tất cả · phím tắt D */}
      <div className="relative group w-full flex justify-center">
        <button
          type="button"
          onClick={onClear}
          className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-rose-500 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
        >
          <Trash2 size={17} />
        </button>
        <div className={TOOLTIP_CLASS}>Xóa tất cả · phím tắt D</div>
      </div>

      {/* 8. Sổ tay ghi chú · phím tắt B */}
      <div className="relative group w-full flex justify-center mt-0.5">
        <button
          type="button"
          onClick={onOpenNotes}
          className="w-[38px] h-[38px] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <BookOpen size={17} />
        </button>
        <div className={TOOLTIP_CLASS}>Sổ tay ghi chú · phím tắt B</div>
      </div>
    </aside>
  );
};
