export type AnnotatorTool =
  | "select"
  | "pen"
  | "highlighter"
  | "underline"
  | "eraser"
  | "rect"
  | "arrow"
  | "text"
  | "note";

export interface StrokeItem {
  id: string;
  type: "pen" | "highlighter" | "underline" | "rect" | "arrow" | "text";
  points?: { x: number; y: number }[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  text?: string;
  color: string;
  width: number;
  side?: "left" | "right";
  relPoints?: { relX: number; y: number }[];
  relStartX?: number;
  relEndX?: number;
  relRatioPoints?: { relRatioX: number; y: number }[];
}

export interface StickyNoteItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  side?: "left" | "right";
  relX?: number;
  relRatio?: number;
}

export interface CanvasTextItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: string;
  sentenceIndex?: number;
  side?: "left" | "right";
  relX?: number;
  relRatio?: number;
}

export interface AnnotatorCanvasHandle {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  deleteNote: (noteId: string) => void;
  clearAllPartData: () => void;
  toggleVisibility: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isVisible: boolean;
  stickyNotesCount: number;
  textNotesCount: number;
}

export interface SavedNotePayload {
  id: string;
  sentenceIndex: number;
  content: string;
  type: "text" | "note" | "underline";
}

export interface AnnotatorCanvasProps {
  activeTool: AnnotatorTool;
  activeColor: string;
  isActive: boolean;
  splitRatio?: number;
  onCanUndoChange?: (canUndo: boolean) => void;
  onCanRedoChange?: (canRedo: boolean) => void;
  onVisibilityChange?: (isVisible: boolean) => void;
  onToolChange?: (tool: AnnotatorTool) => void;
  currentSentenceIndex?: number;
  sentenceId?: string;
  displayNumber?: string;
  part?: number;
  userKey?: string;
  onAddSavedNote?: (note: SavedNotePayload) => void;
  onDeleteSavedNote?: (id: string) => void;
}

export interface SentenceCanvasData {
  sentenceIndex?: number;
  sentenceId?: string;
  displayNumber?: string;
  part?: number;
  strokes: StrokeItem[];
  stickyNotes: StickyNoteItem[];
  canvasTexts: CanvasTextItem[];
  lastUpdated?: string;
  timestamp?: number;
}
