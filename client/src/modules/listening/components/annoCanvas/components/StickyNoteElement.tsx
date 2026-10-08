import type React from "react";
import type { StickyNoteItem } from "../types";

interface StickyNoteElementProps {
  note: StickyNoteItem;
  isDragging: boolean;
  onStartDrag: (id: string, clientX: number, clientY: number) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
}

export const StickyNoteElement: React.FC<StickyNoteElementProps> = ({
  note,
  isDragging,
  onStartDrag,
  onDelete,
  onUpdateText,
}) => {
  return (
    <div
      style={{ left: `${note.x}px`, top: `${note.y}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={`absolute pointer-events-auto z-30 p-2.5 rounded-xl bg-amber-200 text-amber-950 shadow-xl border border-amber-300 w-48 transition-shadow animate-scale-up ${
        isDragging
          ? "ring-2 ring-amber-500 shadow-2xl opacity-95 scale-[1.02]"
          : ""
      }`}
    >
      {/* Header thanh kéo di chuyển ghi chú */}
      <div
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onStartDrag(note.id, e.clientX, e.clientY);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          if (e.touches.length > 0) {
            onStartDrag(note.id, e.touches[0].clientX, e.touches[0].clientY);
          }
        }}
        title="Nhấn giữ và kéo để di chuyển ghi chú"
        className="flex items-center justify-between pb-1 mb-1 border-b border-amber-300/60 cursor-grab active:cursor-grabbing select-none"
      >
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
          ::: Ghi chú
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          title="Xóa ghi chú này"
          className="text-amber-800 hover:text-rose-600 cursor-pointer text-xs font-bold px-1 rounded hover:bg-amber-300/50 transition-colors"
        >
          ✕
        </button>
      </div>

      <textarea
        value={note.text}
        onChange={(e) => onUpdateText(note.id, e.target.value)}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        rows={2}
        className="w-full text-xs bg-transparent outline-none resize-none font-medium text-amber-950 placeholder-amber-700 select-text"
        placeholder="Nội dung ghi chú..."
      />
    </div>
  );
};
