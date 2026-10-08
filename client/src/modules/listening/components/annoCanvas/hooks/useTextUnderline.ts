import { useEffect } from "react";
import type React from "react";
import type { AnnotatorTool, StrokeItem, SavedNotePayload } from "../types";

interface UseTextUnderlineParams {
  isActive: boolean;
  activeTool: AnnotatorTool;
  activeColor: string;
  splitRatio: number;
  currentSentenceIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  setStrokes: React.Dispatch<React.SetStateAction<StrokeItem[]>>;
  setUndoneStrokes: React.Dispatch<React.SetStateAction<StrokeItem[]>>;
  onAddSavedNote?: (note: SavedNotePayload) => void;
}

export const useTextUnderline = ({
  isActive,
  activeTool,
  activeColor,
  splitRatio,
  currentSentenceIndex,
  containerRef,
  setStrokes,
  setUndoneStrokes,
  onAddSavedNote,
}: UseTextUnderlineParams) => {
  useEffect(() => {
    if (!isActive || activeTool !== "underline") return;

    const handleTextUnderlineSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const selectedText = selection.toString().trim();
      // CHỈ GẠCH CHÂN KHI THỰC SỰ CÓ CHỮ ĐƯỢC CHỌN
      if (!selectedText) return;

      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      const range = selection.getRangeAt(0);
      const clientRects = Array.from(range.getClientRects());
      if (clientRects.length === 0) return;

      const newStrokes: StrokeItem[] = [];
      const containerWidth = containerRect.width || 1000;
      const currentSplitX = containerWidth * (splitRatio / 100);

      clientRects.forEach((rect, idx) => {
        if (rect.width <= 1 || rect.height <= 1) return;

        const startX = rect.left - containerRect.left;
        const endX = rect.right - containerRect.left;
        // Vẽ đường gạch chân ngay dưới baseline của chữ
        const lineY = rect.bottom - 2 - containerRect.top;

        const side = startX >= currentSplitX ? "right" : "left";
        const relStartX =
          side === "right" ? startX - currentSplitX : undefined;
        const relEndX = side === "right" ? endX - currentSplitX : undefined;

        newStrokes.push({
          id: `underline_${Date.now()}_${idx}`,
          type: "underline",
          start: { x: startX, y: lineY },
          end: { x: endX, y: lineY },
          side,
          relStartX,
          relEndX,
          color: activeColor,
          width: 2.5,
        });
      });

      if (newStrokes.length > 0) {
        setStrokes((prev) => [...prev, ...newStrokes]);
        setUndoneStrokes([]);
        onAddSavedNote?.({
          id: newStrokes[0].id,
          sentenceIndex: currentSentenceIndex,
          content: selectedText,
          type: "underline",
        });
      }

      // Xóa bôi đen xanh mặc định của trình duyệt để lại đường gạch chân đẹp mắt
      selection.removeAllRanges();
    };

    window.addEventListener("mouseup", handleTextUnderlineSelection);
    window.addEventListener("touchend", handleTextUnderlineSelection);

    return () => {
      window.removeEventListener("mouseup", handleTextUnderlineSelection);
      window.removeEventListener("touchend", handleTextUnderlineSelection);
    };
  }, [
    isActive,
    activeTool,
    activeColor,
    splitRatio,
    currentSentenceIndex,
    containerRef,
    setStrokes,
    setUndoneStrokes,
    onAddSavedNote,
  ]);
};
