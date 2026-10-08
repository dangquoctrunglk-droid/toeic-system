import type { StrokeItem, AnnotatorTool } from "../types";

/**
 * Tính khoảng cách từ điểm p đến đoạn thẳng vw (phục vụ chức năng Eraser)
 */
export const distToSegment = (
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number },
): number => {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(
    p.x - (v.x + t * (w.x - v.x)),
    p.y - (v.y + t * (w.y - v.y)),
  );
};

/**
 * Vẽ một nét vẽ (StrokeItem) lên 2D context của Canvas
 */
export const renderStroke = (
  ctx: CanvasRenderingContext2D,
  stroke: StrokeItem,
): void => {
  ctx.save();

  if (stroke.type === "highlighter") {
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  } else {
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = stroke.color;
    ctx.fillStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  if (stroke.type === "pen" || stroke.type === "highlighter") {
    if (stroke.points && stroke.points.length > 1) {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
  } else if (stroke.type === "underline" && stroke.start && stroke.end) {
    ctx.beginPath();
    ctx.moveTo(stroke.start.x, stroke.start.y);
    ctx.lineTo(stroke.end.x, stroke.end.y);
    ctx.stroke();
  } else if (stroke.type === "rect" && stroke.start && stroke.end) {
    const x = Math.min(stroke.start.x, stroke.end.x);
    const y = Math.min(stroke.start.y, stroke.end.y);
    const w = Math.abs(stroke.end.x - stroke.start.x);
    const h = Math.abs(stroke.end.y - stroke.start.y);

    ctx.strokeRect(x, y, w, h);
  } else if (stroke.type === "arrow" && stroke.start && stroke.end) {
    const fromx = stroke.start.x;
    const fromy = stroke.start.y;
    const tox = stroke.end.x;
    const toy = stroke.end.y;
    const headlen = 12;
    const angle = Math.atan2(toy - fromy, tox - fromx);

    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(
      tox - headlen * Math.cos(angle - Math.PI / 6),
      toy - headlen * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      tox - headlen * Math.cos(angle + Math.PI / 6),
      toy - headlen * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();
  } else if (stroke.type === "text" && stroke.start && stroke.text) {
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(stroke.text, stroke.start.x, stroke.start.y);
  }

  ctx.restore();
};

/**
 * Xóa sạch và vẽ lại toàn bộ các nét vẽ strokes trên Canvas
 */
export const redrawAllStrokes = (
  canvas: HTMLCanvasElement | null,
  strokes: StrokeItem[],
  isVisible: boolean,
): void => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;

  ctx.clearRect(0, 0, width, height);

  if (!isVisible) return;

  strokes.forEach((stroke) => {
    renderStroke(ctx, stroke);
  });
};

/**
 * Vẽ nét xem trước tạm thời khi người dùng đang kéo chuột (Rect, Arrow, Underline)
 */
export const renderDrawingPreview = (
  canvas: HTMLCanvasElement | null,
  activeTool: AnnotatorTool,
  start: { x: number; y: number },
  current: { x: number; y: number },
  activeColor: string,
): void => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.save();
  ctx.strokeStyle = activeColor;
  ctx.fillStyle = activeColor;
  ctx.lineWidth = 2.5;

  if (activeTool === "rect") {
    const x = Math.min(start.x, current.x);
    const y = Math.min(start.y, current.y);
    const w = Math.abs(current.x - start.x);
    const h = Math.abs(current.y - start.y);
    ctx.strokeRect(x, y, w, h);
  } else if (activeTool === "arrow") {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  } else if (activeTool === "underline") {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();
  }

  ctx.restore();
};
