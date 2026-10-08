import type React from "react";
import type { CanvasTextItem } from "../types";

interface CanvasTextElementProps {
  textItem: CanvasTextItem;
  isEditing: boolean;
  isDragging: boolean;
  hasDragged: boolean;
  onStartDrag: (id: string, clientX: number, clientY: number) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
  onStartEdit: (id: string) => void;
  onFinishEdit: () => void;
}

export const CanvasTextElement: React.FC<CanvasTextElementProps> = ({
  textItem,
  isEditing,
  isDragging,
  hasDragged,
  onStartDrag,
  onDelete,
  onUpdateText,
  onStartEdit,
  onFinishEdit,
}) => {
  return (
    <div
      style={{ left: `${textItem.x}px`, top: `${textItem.y}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={`absolute pointer-events-auto z-30 select-none ${
        isDragging
          ? "scale-[1.03] opacity-90 ring-2 ring-sky-400/80 rounded-md shadow-lg"
          : ""
      }`}
    >
      <div className="relative group">
        {/* Nút xóa đỏ tròn nhỏ góc trên bên phải - chỉ hiển thị khi hover chuột */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(textItem.id);
          }}
          title="Xóa chữ này"
          className="absolute -top-2.5 -right-2.5 w-4 h-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer z-40 transition-opacity opacity-0 group-hover:opacity-100 border border-white/40"
        >
          ✕
        </button>

        {isEditing ? (
          /* CHẾ ĐỘ NHẬP LIỆU: Viền xanh bầu trời bo góc, placeholder "Nhập rồi Enter", gõ Enter để lưu */
          <div
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).tagName !== "INPUT") {
                e.preventDefault();
                e.stopPropagation();
                onStartDrag(textItem.id, e.clientX, e.clientY);
              }
            }}
            onTouchStart={(e) => {
              if (
                (e.target as HTMLElement).tagName !== "INPUT" &&
                e.touches.length > 0
              ) {
                onStartDrag(
                  textItem.id,
                  e.touches[0].clientX,
                  e.touches[0].clientY,
                );
              }
            }}
            className="rounded-lg px-3 py-1.5 min-w-[150px] max-w-[320px] flex items-center bg-[#070e20]/95 border border-sky-400 shadow-xl ring-2 ring-sky-500/20"
          >
            <input
              autoFocus
              value={textItem.text}
              onChange={(e) => onUpdateText(textItem.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onFinishEdit();
                } else if (e.key === "Escape") {
                  onFinishEdit();
                }
              }}
              onBlur={onFinishEdit}
              placeholder="Nhập rồi Enter"
              style={{ color: textItem.color || "#f43f5e" }}
              className="bg-transparent outline-none border-none p-0 text-sm font-bold placeholder:text-slate-400 placeholder:font-normal text-left w-full select-text"
            />
          </div>
        ) : (
          /* CHẾ ĐỘ HIỂN THỊ: Chữ đậm trên nền tối tinh gọn, click để sửa lại, kéo để di chuyển */
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (!hasDragged) {
                onStartEdit(textItem.id);
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onStartDrag(textItem.id, e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                onStartDrag(
                  textItem.id,
                  e.touches[0].clientX,
                  e.touches[0].clientY,
                );
              }
            }}
            title="Click để sửa chữ, kéo để di chuyển"
            className={`rounded-md px-2 py-0.5 min-w-[28px] max-w-[400px] flex items-center justify-center bg-[#09101f]/80 hover:bg-[#09101f] ${
              isDragging ? "cursor-move" : "transition-all cursor-move"
            } border border-transparent hover:border-slate-600/50 shadow-sm select-none`}
          >
            <span
              style={{ color: textItem.color || "#f43f5e" }}
              className="text-sm font-bold tracking-wide select-none whitespace-nowrap pointer-events-none"
            >
              {textItem.text.trim() ? textItem.text : "..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
