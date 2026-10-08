import type { CanvasTextItem, StickyNoteItem, StrokeItem } from "../types";

/**
 * Tính toán side (left/right), relX và relRatio cho phần tử dựa theo vị trí chia cột splitRatio
 */
export const calcItemSideAndRelX = (
  x: number,
  currentSplitX: number,
): {
  side: "left" | "right";
  relX: number;
  relRatio?: number;
} => {
  const side = x >= currentSplitX ? "right" : "left";
  const relX = side === "right" ? x - currentSplitX : x;
  const relRatio =
    side === "left" && currentSplitX > 0 ? x / currentSplitX : undefined;
  return { side, relX, relRatio };
};

/**
 * Tái định vị các Text Items khi tỷ lệ chia cột splitRatio thay đổi
 */
export const recalcTextsOnSplit = (
  texts: CanvasTextItem[],
  oldSplitX: number,
  currentSplitX: number,
  containerWidth: number,
): CanvasTextItem[] => {
  return texts.map((t) => {
    const side = t.side || (t.x >= oldSplitX ? "right" : "left");
    if (side === "right") {
      const relX = t.relX !== undefined ? t.relX : t.x - oldSplitX;
      const newX = currentSplitX + relX;
      return {
        ...t,
        side: "right",
        relX,
        x: Math.max(currentSplitX + 10, Math.min(containerWidth - 50, newX)),
      };
    } else {
      const ratio =
        t.relRatio !== undefined
          ? t.relRatio
          : oldSplitX > 0
            ? t.x / oldSplitX
            : 0.5;
      const newX = currentSplitX * ratio;
      return {
        ...t,
        side: "left",
        relRatio: ratio,
        x: Math.max(10, Math.min(Math.max(10, currentSplitX - 40), newX)),
      };
    }
  });
};

/**
 * Tái định vị các Sticky Notes khi tỷ lệ chia cột splitRatio thay đổi
 */
export const recalcNotesOnSplit = (
  notes: StickyNoteItem[],
  oldSplitX: number,
  currentSplitX: number,
  containerWidth: number,
): StickyNoteItem[] => {
  return notes.map((n) => {
    const side = n.side || (n.x >= oldSplitX ? "right" : "left");
    if (side === "right") {
      const relX = n.relX !== undefined ? n.relX : n.x - oldSplitX;
      const newX = currentSplitX + relX;
      return {
        ...n,
        side: "right",
        relX,
        x: Math.max(currentSplitX + 10, Math.min(containerWidth - 80, newX)),
      };
    } else {
      const ratio =
        n.relRatio !== undefined
          ? n.relRatio
          : oldSplitX > 0
            ? n.x / oldSplitX
            : 0.5;
      const newX = currentSplitX * ratio;
      return {
        ...n,
        side: "left",
        relRatio: ratio,
        x: Math.max(10, Math.min(Math.max(10, currentSplitX - 120), newX)),
      };
    }
  });
};

/**
 * Tái định vị và co dãn các nét vẽ Strokes khi tỷ lệ chia cột splitRatio thay đổi
 */
export const recalcStrokesOnSplit = (
  strokes: StrokeItem[],
  oldSplitX: number,
  currentSplitX: number,
): StrokeItem[] => {
  return strokes.map((s) => {
    let side = s.side;
    if (!side) {
      const refX = s.points?.[0]?.x ?? s.start?.x ?? 0;
      side = refX >= oldSplitX ? "right" : "left";
    }

    if (side === "right") {
      const relStartX =
        s.relStartX !== undefined
          ? s.relStartX
          : s.start
            ? s.start.x - oldSplitX
            : undefined;
      const relEndX =
        s.relEndX !== undefined
          ? s.relEndX
          : s.end
            ? s.end.x - oldSplitX
            : undefined;
      const relPoints =
        s.relPoints ||
        s.points?.map((p) => ({ relX: p.x - oldSplitX, y: p.y }));

      return {
        ...s,
        side: "right",
        relStartX,
        relEndX,
        relPoints,
        start:
          s.start && relStartX !== undefined
            ? { ...s.start, x: currentSplitX + relStartX }
            : s.start,
        end:
          s.end && relEndX !== undefined
            ? { ...s.end, x: currentSplitX + relEndX }
            : s.end,
        points: relPoints
          ? relPoints.map((rp) => ({
              x: currentSplitX + rp.relX,
              y: rp.y,
            }))
          : s.points,
      };
    } else {
      const scaleFactor = oldSplitX > 0 ? currentSplitX / oldSplitX : 1;
      return {
        ...s,
        side: "left",
        start: s.start ? { ...s.start, x: s.start.x * scaleFactor } : s.start,
        end: s.end ? { ...s.end, x: s.end.x * scaleFactor } : s.end,
        points: s.points
          ? s.points.map((p) => ({
              x: p.x * scaleFactor,
              y: p.y,
            }))
          : s.points,
      };
    }
  });
};
