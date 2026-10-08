import { useRef, useCallback } from "react";
import type React from "react";
import type {
  AnnotatorTool,
  StrokeItem,
  StickyNoteItem,
  CanvasTextItem,
  SavedNotePayload,
} from "../types";
import { distToSegment, renderDrawingPreview } from "../utils/canvasRenderer";
import { calcItemSideAndRelX } from "../utils/responsiveLayout";

interface UseCanvasDrawingParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  activeTool: AnnotatorTool;
  activeColor: string;
  splitRatio: number;
  currentSentenceIndex: number;
  strokes: StrokeItem[];
  setStrokes: React.Dispatch<React.SetStateAction<StrokeItem[]>>;
  setUndoneStrokes: React.Dispatch<React.SetStateAction<StrokeItem[]>>;
  setStickyNotes: React.Dispatch<React.SetStateAction<StickyNoteItem[]>>;
  setCanvasTexts: React.Dispatch<React.SetStateAction<CanvasTextItem[]>>;
  setEditingTextId: React.Dispatch<React.SetStateAction<string | null>>;
  onToolChange?: (tool: AnnotatorTool) => void;
  onAddSavedNote?: (note: SavedNotePayload) => void;
  redrawCanvas: () => void;
}

export const useCanvasDrawing = ({
  canvasRef,
  containerRef,
  isActive,
  activeTool,
  activeColor,
  splitRatio,
  currentSentenceIndex,
  setStrokes,
  setUndoneStrokes,
  setStickyNotes,
  setCanvasTexts,
  setEditingTextId,
  onToolChange,
  onAddSavedNote,
  redrawCanvas,
}: UseCanvasDrawingParams) => {
  const isDrawingRef = useRef<boolean>(false);
  const currentPointsRef = useRef<{ x: number; y: number }[]>([]);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);

  // Lấy tọa độ chuột/touch tương đối với canvas
  const getPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    },
    [canvasRef],
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isActive || activeTool === "select" || activeTool === "underline") {
        return;
      }

      const pos = getPos(e);
      const container = containerRef.current;
      const containerWidth = container?.clientWidth || 1000;
      const currentSplitX = containerWidth * (splitRatio / 100);

      // Thêm Sticky Note
      if (activeTool === "note") {
        const noteX = Math.max(10, pos.x - 60);
        const { side, relX, relRatio } = calcItemSideAndRelX(
          noteX,
          currentSplitX,
        );

        const newNote: StickyNoteItem = {
          id: `note_${Date.now()}`,
          x: noteX,
          y: Math.max(10, pos.y - 30),
          side,
          relX,
          relRatio,
          text: "",
          color: activeColor,
        };
        setStickyNotes((prev) => [...prev, newNote]);
        onAddSavedNote?.({
          id: newNote.id,
          sentenceIndex: currentSentenceIndex,
          content: "Ghi chú dán",
          type: "note",
        });
        return;
      }

      // Thêm văn bản trực tiếp (Text box)
      if (activeTool === "text") {
        const textX = Math.max(10, pos.x - 20);
        const { side, relX, relRatio } = calcItemSideAndRelX(
          textX,
          currentSplitX,
        );

        const now = new Date();
        const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
        const newText: CanvasTextItem = {
          id: `text_${Date.now()}`,
          x: textX,
          y: Math.max(10, pos.y - 15),
          side,
          relX,
          relRatio,
          text: "",
          color: activeColor || "#f43f5e",
          createdAt: formattedTime,
          sentenceIndex: currentSentenceIndex,
        };
        setCanvasTexts((prev) => [...prev, newText]);
        setEditingTextId(newText.id);
        onToolChange?.("select");
        onAddSavedNote?.({
          id: newText.id,
          sentenceIndex: currentSentenceIndex,
          content: "...",
          type: "text",
        });
        return;
      }

      // Tẩy xóa nét vẽ (Eraser)
      if (activeTool === "eraser") {
        const threshold = 18;
        setStrokes((prev) =>
          prev.filter((stroke) => {
            if (stroke.points) {
              return !stroke.points.some(
                (p) => Math.hypot(p.x - pos.x, p.y - pos.y) < threshold,
              );
            }
            if (stroke.start && stroke.end) {
              return distToSegment(pos, stroke.start, stroke.end) >= threshold;
            }
            return true;
          }),
        );
        isDrawingRef.current = true;
        return;
      }

      isDrawingRef.current = true;
      startPointRef.current = pos;
      currentPointsRef.current = [pos];
    },
    [
      isActive,
      activeTool,
      activeColor,
      splitRatio,
      currentSentenceIndex,
      getPos,
      containerRef,
      setStickyNotes,
      setCanvasTexts,
      setEditingTextId,
      setStrokes,
      onToolChange,
      onAddSavedNote,
    ],
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current || !isActive || activeTool === "select") return;
      const pos = getPos(e);

      if (activeTool === "eraser") {
        const threshold = 18;
        setStrokes((prev) =>
          prev.filter((stroke) => {
            if (stroke.points) {
              return !stroke.points.some(
                (p) => Math.hypot(p.x - pos.x, p.y - pos.y) < threshold,
              );
            }
            if (stroke.start && stroke.end) {
              return distToSegment(pos, stroke.start, stroke.end) >= threshold;
            }
            return true;
          }),
        );
        return;
      }

      if (activeTool === "pen" || activeTool === "highlighter") {
        currentPointsRef.current.push(pos);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const pts = currentPointsRef.current;
        if (pts.length > 1) {
          ctx.save();
          if (activeTool === "highlighter") {
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 14;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
          } else {
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = activeColor;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
          }
          ctx.beginPath();
          ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
          ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
          ctx.stroke();
          ctx.restore();
        }
      } else if (
        activeTool === "rect" ||
        activeTool === "arrow" ||
        activeTool === "underline"
      ) {
        redrawCanvas();
        if (startPointRef.current) {
          renderDrawingPreview(
            canvasRef.current,
            activeTool,
            startPointRef.current,
            pos,
            activeColor,
          );
        }
      }
    },
    [isActive, activeTool, activeColor, getPos, redrawCanvas, canvasRef, setStrokes],
  );

  const handleEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;

      const pos = getPos(e);
      const start = startPointRef.current;

      const container = containerRef.current;
      const containerWidth = container?.clientWidth || 1000;
      const currentSplitX = containerWidth * (splitRatio / 100);

      if (activeTool === "pen" || activeTool === "highlighter") {
        if (currentPointsRef.current.length > 0) {
          const firstX = currentPointsRef.current[0].x;
          const side = firstX >= currentSplitX ? "right" : "left";
          const relPoints =
            side === "right"
              ? currentPointsRef.current.map((p) => ({
                  relX: p.x - currentSplitX,
                  y: p.y,
                }))
              : undefined;

          const newStroke: StrokeItem = {
            id: `stroke_${Date.now()}`,
            type: activeTool,
            points: [...currentPointsRef.current],
            side,
            relPoints,
            color: activeColor,
            width: activeTool === "highlighter" ? 14 : 3,
          };
          setStrokes((prev) => [...prev, newStroke]);
          setUndoneStrokes([]);
        }
      } else if (activeTool === "rect" && start) {
        const side = start.x >= currentSplitX ? "right" : "left";
        const relStartX =
          side === "right" ? start.x - currentSplitX : undefined;
        const relEndX = side === "right" ? pos.x - currentSplitX : undefined;

        const newStroke: StrokeItem = {
          id: `rect_${Date.now()}`,
          type: "rect",
          start,
          end: pos,
          side,
          relStartX,
          relEndX,
          color: activeColor,
          width: 2.5,
        };
        setStrokes((prev) => [...prev, newStroke]);
        setUndoneStrokes([]);
      } else if (activeTool === "arrow" && start) {
        const side = start.x >= currentSplitX ? "right" : "left";
        const relStartX =
          side === "right" ? start.x - currentSplitX : undefined;
        const relEndX = side === "right" ? pos.x - currentSplitX : undefined;

        const newStroke: StrokeItem = {
          id: `arrow_${Date.now()}`,
          type: "arrow",
          start,
          end: pos,
          side,
          relStartX,
          relEndX,
          color: activeColor,
          width: 2.5,
        };
        setStrokes((prev) => [...prev, newStroke]);
        setUndoneStrokes([]);
      } else if (activeTool === "underline" && start) {
        const side = start.x >= currentSplitX ? "right" : "left";
        const relStartX =
          side === "right" ? start.x - currentSplitX : undefined;
        const relEndX = side === "right" ? pos.x - currentSplitX : undefined;

        const newStroke: StrokeItem = {
          id: `line_${Date.now()}`,
          type: "underline",
          start,
          end: pos,
          side,
          relStartX,
          relEndX,
          color: activeColor,
          width: 2.5,
        };
        setStrokes((prev) => [...prev, newStroke]);
        setUndoneStrokes([]);
      }

      currentPointsRef.current = [];
      startPointRef.current = null;
    },
    [
      activeTool,
      activeColor,
      splitRatio,
      getPos,
      containerRef,
      setStrokes,
      setUndoneStrokes,
    ],
  );

  const isInteractiveDrawing =
    isActive && activeTool !== "select" && activeTool !== "underline";

  return {
    handleStart,
    handleMove,
    handleEnd,
    isInteractiveDrawing,
  };
};
