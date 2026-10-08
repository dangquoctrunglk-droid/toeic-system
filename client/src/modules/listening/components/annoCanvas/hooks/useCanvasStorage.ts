import { useEffect, useRef, useCallback } from "react";
import type React from "react";
import type {
  StrokeItem,
  StickyNoteItem,
  CanvasTextItem,
  SentenceCanvasData,
} from "../types";

interface UseCanvasStorageParams {
  userKey: string;
  part: number;
  currentSentenceIndex: number;
  sentenceId?: string;
  displayNumber?: string;
  strokes: StrokeItem[];
  setStrokes: React.Dispatch<React.SetStateAction<StrokeItem[]>>;
  stickyNotes: StickyNoteItem[];
  setStickyNotes: React.Dispatch<React.SetStateAction<StickyNoteItem[]>>;
  canvasTexts: CanvasTextItem[];
  setCanvasTexts: React.Dispatch<React.SetStateAction<CanvasTextItem[]>>;
  setUndoneStrokes: React.Dispatch<React.SetStateAction<StrokeItem[]>>;
}

export const useCanvasStorage = ({
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
}: UseCanvasStorageParams) => {
  const canvasStorageKey = `toeic_canvas_data_${userKey}_part_${part}`;
  const currentKey = sentenceId || `sent_${currentSentenceIndex}`;

  const strokesRef = useRef<StrokeItem[]>(strokes);
  const stickyNotesRef = useRef<StickyNoteItem[]>(stickyNotes);
  const canvasTextsRef = useRef<CanvasTextItem[]>(canvasTexts);
  const displayNumberRef = useRef<string | undefined>(displayNumber);
  const isInitialLoadedRef = useRef<boolean>(false);
  const prevKeyRef = useRef<string>("");

  useEffect(() => {
    displayNumberRef.current = displayNumber;
  }, [displayNumber]);

  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  useEffect(() => {
    stickyNotesRef.current = stickyNotes;
  }, [stickyNotes]);

  useEffect(() => {
    canvasTextsRef.current = canvasTexts;
  }, [canvasTexts]);

  // Đọc toàn bộ dữ liệu canvas của part từ localStorage
  const readAllCanvasData = useCallback((): Record<
    string,
    SentenceCanvasData
  > => {
    try {
      const raw = localStorage.getItem(canvasStorageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, [canvasStorageKey]);

  // Lưu dữ liệu một câu vào localStorage
  const saveCurrentCanvasData = useCallback(
    (
      key: string,
      s: StrokeItem[],
      sn: StickyNoteItem[],
      ct: CanvasTextItem[],
    ) => {
      if (!key) return;
      try {
        const all = readAllCanvasData();
        if (s.length === 0 && sn.length === 0 && ct.length === 0) {
          delete all[key];
        } else {
          const now = new Date();
          const formattedTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")} ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
          all[key] = {
            sentenceIndex: currentSentenceIndex,
            sentenceId: key,
            displayNumber: displayNumberRef.current,
            part,
            strokes: s,
            stickyNotes: sn,
            canvasTexts: ct,
            lastUpdated: formattedTime,
            timestamp: Date.now(),
          };
        }
        localStorage.setItem(canvasStorageKey, JSON.stringify(all));
        try {
          window.dispatchEvent(new CustomEvent("toeic_canvas_updated"));
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Failed to save canvas data to localStorage", err);
      }
    },
    [canvasStorageKey, readAllCanvasData, currentSentenceIndex, part],
  );

  // Khi chuyển câu hoặc mount lần đầu: lưu câu cũ và khôi phục câu mới từ localStorage
  useEffect(() => {
    if (
      isInitialLoadedRef.current &&
      prevKeyRef.current &&
      prevKeyRef.current !== currentKey
    ) {
      saveCurrentCanvasData(
        prevKeyRef.current,
        strokesRef.current,
        stickyNotesRef.current,
        canvasTextsRef.current,
      );
    }

    prevKeyRef.current = currentKey;

    const all = readAllCanvasData();
    const saved = all[currentKey];
    if (saved) {
      setStrokes(saved.strokes || []);
      setStickyNotes(saved.stickyNotes || []);
      setCanvasTexts(saved.canvasTexts || []);
    } else {
      setStrokes([]);
      setStickyNotes([]);
      setCanvasTexts([]);
    }
    setUndoneStrokes([]);
    isInitialLoadedRef.current = true;
  }, [currentKey, saveCurrentCanvasData, readAllCanvasData, setStrokes, setStickyNotes, setCanvasTexts, setUndoneStrokes]);

  // Tự động lưu mỗi khi nét vẽ, sticky note hoặc text thay đổi
  useEffect(() => {
    if (!isInitialLoadedRef.current || !currentKey) return;
    saveCurrentCanvasData(currentKey, strokes, stickyNotes, canvasTexts);
  }, [strokes, stickyNotes, canvasTexts, currentKey, saveCurrentCanvasData]);

  // Lưu dữ liệu khi unmount (người dùng thoát phòng học)
  useEffect(() => {
    return () => {
      if (isInitialLoadedRef.current && prevKeyRef.current) {
        saveCurrentCanvasData(
          prevKeyRef.current,
          strokesRef.current,
          stickyNotesRef.current,
          canvasTextsRef.current,
        );
      }
    };
  }, [saveCurrentCanvasData]);

  const clearAllPartData = useCallback(() => {
    setStrokes([]);
    setUndoneStrokes([]);
    setStickyNotes([]);
    setCanvasTexts([]);
    try {
      localStorage.removeItem(canvasStorageKey);
      window.dispatchEvent(new CustomEvent("toeic_canvas_updated"));
    } catch {
      // ignore
    }
  }, [canvasStorageKey, setStrokes, setUndoneStrokes, setStickyNotes, setCanvasTexts]);

  return {
    canvasStorageKey,
    currentKey,
    saveCurrentCanvasData,
    readAllCanvasData,
    clearAllPartData,
  };
};
