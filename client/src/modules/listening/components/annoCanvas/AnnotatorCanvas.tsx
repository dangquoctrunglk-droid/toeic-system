import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type {
  AnnotatorCanvasHandle,
  AnnotatorCanvasProps,
  StrokeItem,
  StickyNoteItem,
  CanvasTextItem,
} from "./types";
import { redrawAllStrokes } from "./utils/canvasRenderer";
import {
  recalcTextsOnSplit,
  recalcNotesOnSplit,
  recalcStrokesOnSplit,
} from "./utils/responsiveLayout";
import { useCanvasStorage } from "./hooks/useCanvasStorage";
import { useItemDragging } from "./hooks/useItemDragging";
import { useTextUnderline } from "./hooks/useTextUnderline";
import { useCanvasDrawing } from "./hooks/useCanvasDrawing";
import { CanvasTextElement } from "./components/CanvasTextElement";
import { StickyNoteElement } from "./components/StickyNoteElement";

export const AnnotatorCanvas = forwardRef<
  AnnotatorCanvasHandle,
  AnnotatorCanvasProps
>(
  (
    {
      activeTool,
      activeColor,
      isActive,
      splitRatio = 50,
      onCanUndoChange,
      onCanRedoChange,
      onVisibilityChange,
      onToolChange,
      currentSentenceIndex = 0,
      sentenceId = "",
      displayNumber,
      part = 1,
      userKey = "guest",
      onAddSavedNote,
      onDeleteSavedNote,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [strokes, setStrokes] = useState<StrokeItem[]>([]);
    const [undoneStrokes, setUndoneStrokes] = useState<StrokeItem[]>([]);
    const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([]);
    const [canvasTexts, setCanvasTexts] = useState<CanvasTextItem[]>([]);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    // 1. Hook quản lý lưu trữ LocalStorage tự động
    const { currentKey, saveCurrentCanvasData, clearAllPartData } =
      useCanvasStorage({
        userKey,
        part,
        currentSentenceIndex,
        sentenceId,
        displayNumber,
        strokes,
        setStrokes,
        stickyNotes,
        setStickyNotes,
        canvasTexts,
        setCanvasTexts,
        setUndoneStrokes,
      });

    // 2. Hook kéo thả Sticky Notes & Text Items
    const {
      draggingNoteId,
      draggingTextId,
      hasDraggedTextRef,
      handleStartDragNote,
      handleStartDragText,
    } = useItemDragging({
      containerRef,
      splitRatio,
      stickyNotes,
      setStickyNotes,
      canvasTexts,
      setCanvasTexts,
    });

    // 3. Hook bôi đen gạch chân văn bản trực tiếp
    useTextUnderline({
      isActive,
      activeTool,
      activeColor,
      splitRatio,
      currentSentenceIndex,
      containerRef,
      setStrokes,
      setUndoneStrokes,
      onAddSavedNote,
    });

    // Vẽ toàn bộ các nét lên Canvas
    const redrawCanvas = useCallback(() => {
      redrawAllStrokes(canvasRef.current, strokes, isVisible);
    }, [strokes, isVisible]);

    // 4. Hook vẽ trực tiếp các công cụ Canvas (Pen, Highlighter, Eraser, Rect, Arrow, Underline, Note, Text)
    const { handleStart, handleMove, handleEnd, isInteractiveDrawing } =
      useCanvasDrawing({
        canvasRef,
        containerRef,
        isActive,
        activeTool,
        activeColor,
        splitRatio,
        currentSentenceIndex,
        strokes,
        setStrokes,
        setUndoneStrokes,
        setStickyNotes,
        setCanvasTexts,
        setEditingTextId,
        onToolChange,
        onAddSavedNote,
        redrawCanvas,
      });

    // Cập nhật nội dung văn bản text item
    const updateTextContent = useCallback(
      (id: string, text: string) => {
        setCanvasTexts((prev) =>
          prev.map((t) => (t.id === id ? { ...t, text } : t)),
        );
        onAddSavedNote?.({
          id,
          sentenceIndex: currentSentenceIndex,
          content: text || "...",
          type: "text",
        });
      },
      [currentSentenceIndex, onAddSavedNote],
    );

    const handleDeleteText = useCallback(
      (id: string) => {
        setCanvasTexts((prev) => prev.filter((t) => t.id !== id));
        onDeleteSavedNote?.(id);
      },
      [onDeleteSavedNote],
    );

    // Cập nhật nội dung sticky note
    const updateNoteText = useCallback(
      (id: string, text: string) => {
        setStickyNotes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, text } : n)),
        );
        if (text.trim()) {
          onAddSavedNote?.({
            id,
            sentenceIndex: currentSentenceIndex,
            content: text,
            type: "note",
          });
        }
      },
      [currentSentenceIndex, onAddSavedNote],
    );

    const handleDeleteNote = useCallback(
      (id: string) => {
        setStickyNotes((prev) => prev.filter((n) => n.id !== id));
        onDeleteSavedNote?.(id);
      },
      [onDeleteSavedNote],
    );

    // Báo ra ngoài trạng thái Undo/Redo/Visibility
    useEffect(() => {
      onCanUndoChange?.(strokes.length > 0 || stickyNotes.length > 0);
    }, [strokes.length, stickyNotes.length, onCanUndoChange]);

    useEffect(() => {
      onCanRedoChange?.(undoneStrokes.length > 0);
    }, [undoneStrokes.length, onCanRedoChange]);

    useEffect(() => {
      onVisibilityChange?.(isVisible);
    }, [isVisible, onVisibilityChange]);

    // Đồng bộ kích thước canvas theo container cha với DPR cao
    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const handleResize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        redrawCanvas();
      };

      handleResize();
      const observer = new ResizeObserver(handleResize);
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }, [redrawCanvas]);

    // Redraw khi strokes hoặc isVisible thay đổi
    useEffect(() => {
      redrawCanvas();
    }, [redrawCanvas]);

    const prevSplitRatioRef = useRef<number>(splitRatio);

    // Khi splitRatio thay đổi (kéo thanh phân cách 2 cột): tự động di chuyển các nét vẽ và ghi chú
    useEffect(() => {
      const prevRatio = prevSplitRatioRef.current;
      prevSplitRatioRef.current = splitRatio;

      const container = containerRef.current;
      if (!container) return;
      const containerWidth = container.clientWidth;
      if (containerWidth <= 0) return;

      const oldSplitX = containerWidth * (prevRatio / 100);
      const currentSplitX = containerWidth * (splitRatio / 100);
      const deltaX = currentSplitX - oldSplitX;

      if (Math.abs(deltaX) < 0.1) return;

      setCanvasTexts((prev) =>
        recalcTextsOnSplit(prev, oldSplitX, currentSplitX, containerWidth),
      );
      setStickyNotes((prev) =>
        recalcNotesOnSplit(prev, oldSplitX, currentSplitX, containerWidth),
      );
      setStrokes((prev) =>
        recalcStrokesOnSplit(prev, oldSplitX, currentSplitX),
      );
    }, [splitRatio]);

    // Undo, Redo, Clear
    const handleUndo = useCallback(() => {
      if (strokes.length > 0) {
        const last = strokes[strokes.length - 1];
        setStrokes((prev) => prev.slice(0, -1));
        setUndoneStrokes((prev) => [...prev, last]);
      } else if (canvasTexts.length > 0) {
        setCanvasTexts((prev) => prev.slice(0, -1));
      } else if (stickyNotes.length > 0) {
        setStickyNotes((prev) => prev.slice(0, -1));
      }
    }, [strokes, canvasTexts, stickyNotes]);

    const handleRedo = useCallback(() => {
      if (undoneStrokes.length > 0) {
        const last = undoneStrokes[undoneStrokes.length - 1];
        setUndoneStrokes((prev) => prev.slice(0, -1));
        setStrokes((prev) => [...prev, last]);
      }
    }, [undoneStrokes]);

    const handleClear = useCallback(() => {
      setStrokes([]);
      setUndoneStrokes([]);
      setStickyNotes([]);
      setCanvasTexts([]);
      saveCurrentCanvasData(currentKey, [], [], []);
    }, [currentKey, saveCurrentCanvasData]);

    const deleteNote = useCallback((id: string) => {
      setStickyNotes((prev) => prev.filter((n) => n.id !== id));
      setCanvasTexts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const handleToggleVisibility = useCallback(() => {
      setIsVisible((prev) => !prev);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        undo: handleUndo,
        redo: handleRedo,
        clear: handleClear,
        deleteNote,
        clearAllPartData,
        toggleVisibility: handleToggleVisibility,
        canUndo:
          strokes.length > 0 ||
          stickyNotes.length > 0 ||
          canvasTexts.length > 0,
        canRedo: undoneStrokes.length > 0,
        isVisible,
        stickyNotesCount: stickyNotes.length,
        textNotesCount: canvasTexts.length,
      }),
      [
        handleUndo,
        handleRedo,
        handleClear,
        deleteNote,
        clearAllPartData,
        handleToggleVisibility,
        strokes.length,
        stickyNotes.length,
        canvasTexts.length,
        undoneStrokes.length,
        isVisible,
      ],
    );

    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 z-20 pointer-events-none overflow-hidden ${
          !isVisible ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Lớp bắt sự kiện khi đang kéo di chuyển text/ghi chú để không bị bôi đen trang */}
        {(draggingTextId || draggingNoteId) && (
          <div className="fixed inset-0 z-50 cursor-move select-none pointer-events-auto" />
        )}

        {/* Layer Canvas vẽ tương tác */}
        <canvas
          ref={canvasRef}
          onMouseDown={isInteractiveDrawing ? handleStart : undefined}
          onMouseMove={isInteractiveDrawing ? handleMove : undefined}
          onMouseUp={isInteractiveDrawing ? handleEnd : undefined}
          onTouchStart={isInteractiveDrawing ? handleStart : undefined}
          onTouchMove={isInteractiveDrawing ? handleMove : undefined}
          onTouchEnd={isInteractiveDrawing ? handleEnd : undefined}
          className={`w-full h-full ${
            isInteractiveDrawing
              ? "pointer-events-auto cursor-crosshair"
              : "pointer-events-none"
          }`}
        />

        {/* Danh sách các phần tử văn bản trực tiếp */}
        {isVisible &&
          canvasTexts.map((textItem) => (
            <CanvasTextElement
              key={textItem.id}
              textItem={textItem}
              isEditing={editingTextId === textItem.id}
              isDragging={draggingTextId === textItem.id}
              hasDragged={hasDraggedTextRef.current}
              onStartDrag={handleStartDragText}
              onDelete={handleDeleteText}
              onUpdateText={updateTextContent}
              onStartEdit={setEditingTextId}
              onFinishEdit={() => setEditingTextId(null)}
            />
          ))}

        {/* Danh sách các Sticky Notes ghim trên màn hình */}
        {isVisible &&
          stickyNotes.map((note) => (
            <StickyNoteElement
              key={note.id}
              note={note}
              isDragging={draggingNoteId === note.id}
              onStartDrag={handleStartDragNote}
              onDelete={handleDeleteNote}
              onUpdateText={updateNoteText}
            />
          ))}
      </div>
    );
  },
);

AnnotatorCanvas.displayName = "AnnotatorCanvas";
