import { useState, useRef, useEffect, useCallback } from "react";
import type React from "react";
import type { StickyNoteItem, CanvasTextItem } from "../types";
import { calcItemSideAndRelX } from "../utils/responsiveLayout";

interface UseItemDraggingParams {
  containerRef: React.RefObject<HTMLDivElement | null>;
  splitRatio: number;
  stickyNotes: StickyNoteItem[];
  setStickyNotes: React.Dispatch<React.SetStateAction<StickyNoteItem[]>>;
  canvasTexts: CanvasTextItem[];
  setCanvasTexts: React.Dispatch<React.SetStateAction<CanvasTextItem[]>>;
}

export const useItemDragging = ({
  containerRef,
  splitRatio,
  stickyNotes,
  setStickyNotes,
  canvasTexts,
  setCanvasTexts,
}: UseItemDraggingParams) => {
  const [draggingNoteId, setDraggingNoteId] = useState<string | null>(null);
  const dragNoteRef = useRef<{
    startX: number;
    startY: number;
    initialNoteX: number;
    initialNoteY: number;
  } | null>(null);

  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);
  const dragTextRef = useRef<{
    startX: number;
    startY: number;
    initialTextX: number;
    initialTextY: number;
  } | null>(null);
  const hasDraggedTextRef = useRef<boolean>(false);

  // Kéo thả di chuyển Sticky Note
  const handleStartDragNote = useCallback(
    (noteId: string, clientX: number, clientY: number) => {
      const note = stickyNotes.find((n) => n.id === noteId);
      if (!note) return;
      window.getSelection()?.removeAllRanges();
      setDraggingNoteId(noteId);
      dragNoteRef.current = {
        startX: clientX,
        startY: clientY,
        initialNoteX: note.x,
        initialNoteY: note.y,
      };
    },
    [stickyNotes],
  );

  useEffect(() => {
    if (!draggingNoteId) return;

    const updateNotePosition = (clientX: number, clientY: number) => {
      if (!dragNoteRef.current) return;
      window.getSelection()?.removeAllRanges();
      const dx = clientX - dragNoteRef.current.startX;
      const dy = clientY - dragNoteRef.current.startY;

      const maxX = Math.max(
        10,
        (containerRef.current?.clientWidth || window.innerWidth) - 80,
      );
      const maxY = Math.max(
        10,
        (containerRef.current?.clientHeight || window.innerHeight) - 60,
      );

      const newX = Math.min(
        maxX,
        Math.max(0, dragNoteRef.current.initialNoteX + dx),
      );
      const newY = Math.min(
        maxY,
        Math.max(0, dragNoteRef.current.initialNoteY + dy),
      );

      const containerWidth =
        containerRef.current?.clientWidth || window.innerWidth;
      const currentSplitX = containerWidth * (splitRatio / 100);
      const { side, relX, relRatio } = calcItemSideAndRelX(newX, currentSplitX);

      setStickyNotes((prev) =>
        prev.map((n) =>
          n.id === draggingNoteId
            ? { ...n, x: newX, y: newY, side, relX, relRatio }
            : n,
        ),
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateNotePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      if (e.cancelable) e.preventDefault();
      updateNotePosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEndDrag = () => {
      setDraggingNoteId(null);
      dragNoteRef.current = null;
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
  }, [draggingNoteId, splitRatio, containerRef, setStickyNotes]);

  // Kéo thả di chuyển Text Item
  const handleStartDragText = useCallback(
    (id: string, clientX: number, clientY: number) => {
      const textItem = canvasTexts.find((t) => t.id === id);
      if (!textItem) return;
      window.getSelection()?.removeAllRanges();
      hasDraggedTextRef.current = false;
      setDraggingTextId(id);
      dragTextRef.current = {
        startX: clientX,
        startY: clientY,
        initialTextX: textItem.x,
        initialTextY: textItem.y,
      };
    },
    [canvasTexts],
  );

  useEffect(() => {
    if (!draggingTextId) return;

    const updateTextPosition = (clientX: number, clientY: number) => {
      if (!dragTextRef.current) return;
      window.getSelection()?.removeAllRanges();
      const dx = clientX - dragTextRef.current.startX;
      const dy = clientY - dragTextRef.current.startY;
      if (Math.hypot(dx, dy) > 3) {
        hasDraggedTextRef.current = true;
      }

      const maxX = Math.max(
        10,
        (containerRef.current?.clientWidth || window.innerWidth) - 80,
      );
      const maxY = Math.max(
        10,
        (containerRef.current?.clientHeight || window.innerHeight) - 40,
      );

      const newX = Math.min(
        maxX,
        Math.max(0, dragTextRef.current.initialTextX + dx),
      );
      const newY = Math.min(
        maxY,
        Math.max(0, dragTextRef.current.initialTextY + dy),
      );

      const containerWidth =
        containerRef.current?.clientWidth || window.innerWidth;
      const currentSplitX = containerWidth * (splitRatio / 100);
      const { side, relX, relRatio } = calcItemSideAndRelX(newX, currentSplitX);

      setCanvasTexts((prev) =>
        prev.map((t) =>
          t.id === draggingTextId
            ? { ...t, x: newX, y: newY, side, relX, relRatio }
            : t,
        ),
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateTextPosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      if (e.cancelable) e.preventDefault();
      updateTextPosition(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEndDragText = () => {
      setDraggingTextId(null);
      dragTextRef.current = null;
      setTimeout(() => {
        hasDraggedTextRef.current = false;
      }, 60);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEndDragText);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEndDragText);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEndDragText);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEndDragText);
    };
  }, [draggingTextId, splitRatio, containerRef, setCanvasTexts]);

  return {
    draggingNoteId,
    draggingTextId,
    hasDraggedTextRef,
    handleStartDragNote,
    handleStartDragText,
  };
};
