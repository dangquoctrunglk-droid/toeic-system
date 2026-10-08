import type React from "react";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  X,
  Search,
  StickyNote,
  Type,
  Underline,
  Square,
  ArrowUpRight,
  PenTool,
  Trash2,
  BookOpen,
  ArrowRight,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";
import type {
  StrokeItem,
  StickyNoteItem,
  CanvasTextItem,
  SentenceCanvasData,
} from "../annoCanvas";
import type { SentenceItem, ListeningPart } from "../../types";
import { MOCK_SENTENCES_BY_PART } from "../../mockData";

/**
 * ==============================================================================
 * COMPONENT: SavedNotesDrawer.tsx
 * MỤC ĐÍCH: Khối ngăn kéo hiển thị toàn bộ "Ghi chú đã lưu" trong lộ trình học
 *   - Kích hoạt qua phím tắt B hoặc nút Sổ tay (BookOpen) trên thanh Annotator
 *   - Chuẩn 100% theo Ảnh mẫu DauEnglish:
 *     + Tiêu đề: "Ghi chú đã lưu" · "Trong lộ trình học"
 *     + Ô tìm kiếm: "Tìm trong note/text..."
 *     + Gom gọn toàn bộ toolbar annotations của từng câu thành 1 Card duy nhất:
 *       [Câu X] [Part Y]                 17:34:21 2/10/2026
 *       [▢ 1] [↗ 5] [T 1] [📄 2] [U 1]
 *     + Bấm vào card sẽ tự động nhảy đến đúng câu đó trong phòng luyện
 * ==============================================================================
 */

export interface SavedNoteItem {
  id: string;
  sentenceIndex: number;
  sentenceId?: string;
  displayNumber?: string;
  part: number;
  formattedTime: string;
  content: string;
  type: "note" | "text" | "underline";
  badgeCount?: number;
  timestamp?: number;
}

export interface QuestionNoteGroup {
  id: string;
  sentenceIndex: number;
  sentenceId?: string;
  displayNumber?: string;
  part: number;
  formattedTime: string;
  timestamp: number;
  rectCount: number; // ▢
  arrowCount: number; // ↗
  textCount: number; // T
  noteCount: number; // 📄
  underlineCount: number; // U
  penCount: number; // ✏️
  previewContent?: string;
  totalToolsCount: number;
}

interface SavedNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: SavedNoteItem[];
  onSelectSentence: (sentenceIndex: number) => void;
  onJumpToSentence?: (
    sentenceId: string,
    part: number,
    displayNumber?: string,
  ) => void;
  onDeleteNote?: (noteId: string) => void;
  onDeleteSentenceNotes?: (sentenceIndex: number) => void;
  onAddQuickNote?: (content: string) => void;
  onClearAll?: () => void;
  currentSentenceIndex: number;
  currentPart: number;
  userKey?: string;
  isDarkMode?: boolean;
  sentences?: SentenceItem[];
}

export const SavedNotesDrawer: React.FC<SavedNotesDrawerProps> = ({
  isOpen,
  onClose,
  notes,
  onSelectSentence,
  onJumpToSentence,
  onDeleteNote,
  onDeleteSentenceNotes,
  onAddQuickNote,
  onClearAll,
  currentSentenceIndex,
  currentPart,
  userKey = "guest",
  isDarkMode = true,
  sentences = [],
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newNoteInput, setNewNoteInput] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Danh sách toàn bộ câu của Part này (để phân giải câu chính xác ngay cả khi phòng luyện đang lọc theo Level)
  const masterSentences = useMemo(
    () => MOCK_SENTENCES_BY_PART[currentPart as ListeningPart] || sentences,
    [currentPart, sentences],
  );

  // Helper format ngày giờ chuẩn thực tế
  const formatDateTime = (ts?: number) => {
    if (!ts) return "";
    const d = new Date(ts);
    const time = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
    const date = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    return `${time} ${date}`;
  };

  // Helper lấy nhãn hiển thị câu hỏi (Ưu tiên displayNumber e.g. "14", "7", "32 - 34")
  const getSentenceLabel = useCallback(
    (item: {
      sentenceIndex: number;
      sentenceId?: string;
      displayNumber?: string;
    }) => {
      if (item.displayNumber) {
        const cleaned = item.displayNumber.replace(/[^0-9-]/g, "").trim();
        if (cleaned) return cleaned;
      }
      if (item.sentenceId) {
        const found =
          sentences.find((s) => s.id === item.sentenceId) ||
          masterSentences.find((s) => s.id === item.sentenceId);
        if (found?.displayNumber) {
          const cleaned = found.displayNumber.replace(/[^0-9-]/g, "").trim();
          if (cleaned) return cleaned;
        }
        if (found?.sentenceIndex) return String(found.sentenceIndex);
      }
      if (sentences[item.sentenceIndex]) {
        const s = sentences[item.sentenceIndex];
        if (s.displayNumber) {
          const cleaned = s.displayNumber.replace(/[^0-9-]/g, "").trim();
          if (cleaned) return cleaned;
        }
        if (s.sentenceIndex) return String(s.sentenceIndex);
      }
      if (masterSentences[item.sentenceIndex]) {
        const s = masterSentences[item.sentenceIndex];
        if (s.displayNumber) {
          const cleaned = s.displayNumber.replace(/[^0-9-]/g, "").trim();
          if (cleaned) return cleaned;
        }
        if (s.sentenceIndex) return String(s.sentenceIndex);
      }
      return String(item.sentenceIndex + 1);
    },
    [sentences, masterSentences],
  );

  const currentSentence = sentences[currentSentenceIndex];
  const currentSentenceLabel = useMemo(
    () =>
      getSentenceLabel({
        sentenceIndex: currentSentenceIndex,
        sentenceId: currentSentence?.id,
        displayNumber: currentSentence?.displayNumber,
      }),
    [currentSentenceIndex, currentSentence, getSentenceLabel],
  );

  // Tổng hợp dữ liệu toolbar và ghi chú theo từng câu (Mỗi câu làm gọn thành 1 card chuẩn mẫu DauEnglish)
  const questionGroups = useMemo(() => {
    if (!isOpen) return [];
    void refreshKey;

    const canvasStorageKey = `toeic_canvas_data_${userKey}_part_${currentPart}`;
    let canvasData: Record<string, SentenceCanvasData> = {};
    try {
      const raw = localStorage.getItem(canvasStorageKey);
      if (raw) canvasData = JSON.parse(raw);
    } catch {
      // ignore
    }

    // Dùng key là string (sentenceId / displayNumber) để không bao giờ bị gộp nhầm câu giữa các Level
    const groupMap = new Map<string, QuestionNoteGroup>();

    const findOriginalSentence = (
      key?: string,
      sId?: string,
      dNum?: string,
      sIdx?: number,
    ) => {
      if (sId) {
        const match =
          sentences.find((s) => s.id === sId) ||
          masterSentences.find((s) => s.id === sId);
        if (match) return match;
      }
      if (key && key.startsWith("part")) {
        const match =
          sentences.find((s) => s.id === key) ||
          masterSentences.find((s) => s.id === key);
        if (match) return match;
      }
      if (dNum) {
        const clean = dNum.replace(/[^0-9]/g, "");
        if (clean) {
          const match =
            sentences.find(
              (s) => s.displayNumber?.replace(/[^0-9]/g, "") === clean,
            ) ||
            masterSentences.find(
              (s) => s.displayNumber?.replace(/[^0-9]/g, "") === clean,
            );
          if (match) return match;
        }
      }
      if (typeof sIdx === "number" && sIdx >= 0) {
        if (masterSentences[sIdx]) return masterSentences[sIdx];
        if (sentences[sIdx]) return sentences[sIdx];
      }
      return undefined;
    };

    // 1. Quét dữ liệu canvas từ localStorage
    Object.entries(canvasData).forEach(([key, val]) => {
      if (!val || typeof val !== "object") return;
      let rawIdx =
        typeof val.sentenceIndex === "number" ? val.sentenceIndex : -1;
      if (rawIdx < 0 && key.startsWith("sent_")) {
        const parsed = parseInt(key.replace("sent_", ""), 10);
        if (!isNaN(parsed)) rawIdx = parsed;
      }

      const matched = findOriginalSentence(
        key,
        val.sentenceId,
        val.displayNumber,
        rawIdx,
      );
      const sentenceId = val.sentenceId || matched?.id;
      const displayNumber = val.displayNumber || matched?.displayNumber;
      const sentenceIdx = matched
        ? masterSentences.findIndex((m) => m.id === matched.id)
        : rawIdx >= 0
        ? rawIdx
        : 0;

      const groupKey =
        sentenceId ||
        (displayNumber
          ? `num_${displayNumber.replace(/[^0-9]/g, "")}`
          : `idx_${sentenceIdx}`);

      const strokes: StrokeItem[] = Array.isArray(val.strokes)
        ? val.strokes
        : [];
      const stickyNotes: StickyNoteItem[] = Array.isArray(val.stickyNotes)
        ? val.stickyNotes
        : [];
      const canvasTexts: CanvasTextItem[] = Array.isArray(val.canvasTexts)
        ? val.canvasTexts
        : [];

      const rectCount = strokes.filter((s) => s.type === "rect").length;
      const arrowCount = strokes.filter((s) => s.type === "arrow").length;
      const underlineCount = strokes.filter(
        (s) => s.type === "underline",
      ).length;
      const penCount = strokes.filter(
        (s) => s.type === "pen" || s.type === "highlighter",
      ).length;
      const textCount =
        canvasTexts.filter(
          (t) =>
            t &&
            typeof t.text === "string" &&
            t.text.trim().length > 0 &&
            t.text.trim() !== "...",
        ).length +
        strokes.filter((s) => s.type === "text" && s.text?.trim()).length;
      const noteCount = stickyNotes.length;

      const totalTools =
        rectCount +
        arrowCount +
        textCount +
        noteCount +
        underlineCount +
        penCount;
      if (totalTools === 0) return;

      const timestamp = typeof val.timestamp === "number" ? val.timestamp : 0;
      const lastUpdated = val.lastUpdated || formatDateTime(timestamp);

      let previewContent: string | undefined = undefined;
      const noteWithText = stickyNotes.find(
        (n) => n.text && n.text.trim() && n.text.trim() !== "...",
      );
      if (noteWithText) {
        previewContent = noteWithText.text.trim();
      } else {
        const textWithContent = canvasTexts.find(
          (t) => t.text && t.text.trim() && t.text.trim() !== "...",
        );
        if (textWithContent) {
          previewContent = textWithContent.text.trim();
        } else {
          const underlineWithText = strokes.find(
            (s) => s.type === "underline" && s.text && s.text.trim(),
          );
          if (underlineWithText?.text) {
            previewContent = underlineWithText.text.trim();
          }
        }
      }

      groupMap.set(groupKey, {
        id: `group_${groupKey}`,
        sentenceIndex: sentenceIdx,
        sentenceId,
        displayNumber,
        part: val.part || currentPart,
        formattedTime: lastUpdated,
        timestamp,
        rectCount,
        arrowCount,
        textCount,
        noteCount,
        underlineCount,
        penCount,
        previewContent,
        totalToolsCount: totalTools,
      });
    });

    // 2. Quét mảng notes (từ Sổ tay ghi chú hoặc quick note)
    notes.forEach((n) => {
      const matched = findOriginalSentence(
        n.id,
        n.sentenceId,
        n.displayNumber,
        n.sentenceIndex,
      );
      const sentenceId = n.sentenceId || matched?.id;
      const displayNumber = n.displayNumber || matched?.displayNumber;
      const sentenceIdx = matched
        ? masterSentences.findIndex((m) => m.id === matched.id)
        : typeof n.sentenceIndex === "number"
        ? n.sentenceIndex
        : 0;

      const groupKey =
        sentenceId ||
        (displayNumber
          ? `num_${displayNumber.replace(/[^0-9]/g, "")}`
          : `idx_${sentenceIdx}`);

      const existing = groupMap.get(groupKey);
      const isQuickNote = Boolean(n.id && n.id.startsWith("quick_"));

      if (existing) {
        if (!existing.sentenceId && sentenceId) {
          existing.sentenceId = sentenceId;
        }
        if (!existing.displayNumber && displayNumber) {
          existing.displayNumber = displayNumber;
        }
        if (
          (!existing.previewContent ||
            existing.previewContent === "Ghi chú dán" ||
            existing.previewContent === "...") &&
          n.content &&
          n.content.trim() &&
          n.content.trim() !== "..."
        ) {
          existing.previewContent = n.content.trim();
        }
        if (isQuickNote) {
          existing.noteCount += n.badgeCount || 1;
          existing.totalToolsCount += n.badgeCount || 1;
          if (n.content && n.content.trim()) {
            existing.previewContent = n.content.trim();
          }
        } else if (n.type === "note" && existing.noteCount === 0) {
          existing.noteCount += n.badgeCount || 1;
          existing.totalToolsCount += n.badgeCount || 1;
        } else if (n.type === "underline" && existing.underlineCount === 0) {
          existing.underlineCount += n.badgeCount || 1;
          existing.totalToolsCount += n.badgeCount || 1;
        } else if (n.type === "text" && existing.textCount === 0) {
          existing.textCount += n.badgeCount || 1;
          existing.totalToolsCount += n.badgeCount || 1;
        }
      } else {
        const underlineCount = n.type === "underline" ? n.badgeCount || 1 : 0;
        const textCount = n.type === "text" ? n.badgeCount || 1 : 0;
        const noteCount = n.type === "note" ? n.badgeCount || 1 : 1;
        const total = underlineCount + textCount + noteCount;

        const noteTimestamp = n.timestamp || 0;
        groupMap.set(groupKey, {
          id: `group_${groupKey}`,
          sentenceIndex: sentenceIdx,
          sentenceId,
          displayNumber,
          part: n.part || currentPart,
          formattedTime:
            n.formattedTime ||
            (noteTimestamp ? formatDateTime(noteTimestamp) : ""),
          timestamp: noteTimestamp,
          rectCount: 0,
          arrowCount: 0,
          textCount,
          noteCount,
          underlineCount,
          penCount: 0,
          previewContent: n.content || undefined,
          totalToolsCount: total,
        });
      }
    });

    // 3. Chuyển Map thành Array và sắp xếp theo thời gian mới nhất lên đầu
    const list = Array.from(groupMap.values());
    list.sort((a, b) => b.timestamp - a.timestamp);
    return list;
  }, [userKey, currentPart, notes, isOpen, refreshKey, sentences, masterSentences]);

  // Lắng nghe sự kiện Escape để đóng drawer và CustomEvent để cập nhật dữ liệu tự động
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    const handleCanvasUpdate = () => {
      setRefreshKey((k) => k + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toeic_canvas_updated", handleCanvasUpdate);
    window.addEventListener("storage", handleCanvasUpdate);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toeic_canvas_updated", handleCanvasUpdate);
      window.removeEventListener("storage", handleCanvasUpdate);
    };
  }, [isOpen, onClose]);

  // Lọc ghi chú theo từ khóa tìm kiếm (hỗ trợ tìm cả có dấu và không dấu)
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return questionGroups;
    const rawQ = searchQuery.toLowerCase().trim();
    const cleanQ = rawQ
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");

    return questionGroups.filter((g) => {
      const label = getSentenceLabel(g);
      const matchQuestion =
        `câu ${label}`.includes(rawQ) ||
        `cau ${label}`.includes(cleanQ) ||
        label === rawQ ||
        String(g.sentenceIndex + 1) === rawQ;
      const matchPart =
        `part ${g.part}`.includes(rawQ) || `phan ${g.part}`.includes(cleanQ);
      const matchContent = g.previewContent
        ? g.previewContent.toLowerCase().includes(rawQ) ||
          g.previewContent
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(cleanQ)
        : false;
      return matchQuestion || matchPart || matchContent;
    });
  }, [questionGroups, searchQuery, getSentenceLabel]);

  const handleCreateNote = () => {
    if (!newNoteInput.trim()) return;
    onAddQuickNote?.(newNoteInput.trim());
    setNewNoteInput("");
    setShowAddForm(false);
    setRefreshKey((k) => k + 1);
    toast.success(`Đã thêm ghi chú cho Câu ${currentSentenceLabel}!`);
  };

  const handleDeleteGroup = (sentenceIdx: number) => {
    const group = questionGroups.find((g) => g.sentenceIndex === sentenceIdx);
    const label = group ? getSentenceLabel(group) : String(sentenceIdx + 1);
    if (onDeleteSentenceNotes) {
      onDeleteSentenceNotes(sentenceIdx);
    } else if (onDeleteNote) {
      onDeleteNote(`sent_${sentenceIdx}`);
    }
    setRefreshKey((k) => k + 1);
    toast.success(`Đã xóa tất cả ghi chú của Câu ${label}`);
  };

  const handleCardClick = (group: QuestionNoteGroup) => {
    const label = getSentenceLabel(group);
    const currentSentence = sentences[currentSentenceIndex];

    // 1. Kiểm tra chính xác xem có đúng là câu đang mở trên màn hình không
    const isSameSentence =
      (group.sentenceId &&
        currentSentence?.id &&
        group.sentenceId === currentSentence.id) ||
      (group.displayNumber &&
        currentSentence?.displayNumber &&
        group.displayNumber.replace(/[^0-9]/g, "") ===
          currentSentence.displayNumber.replace(/[^0-9]/g, ""));

    if (isSameSentence) {
      toast.info(`Bạn đang ở Câu ${label}`);
      onClose();
      return;
    }

    // 2. Tìm vị trí câu trong mảng sentences của bài luyện hiện tại
    let targetIndex = -1;
    if (group.sentenceId) {
      targetIndex = sentences.findIndex((s) => s.id === group.sentenceId);
    }
    if (targetIndex < 0 && group.displayNumber) {
      const cleanNum = group.displayNumber.replace(/[^0-9]/g, "");
      targetIndex = sentences.findIndex(
        (s) => s.displayNumber?.replace(/[^0-9]/g, "") === cleanNum,
      );
    }

    // 3. Nếu tìm thấy câu trong bài luyện hiện tại -> Chuyển câu!
    if (targetIndex >= 0 && targetIndex < sentences.length) {
      onSelectSentence(targetIndex);
      toast.info(`Đã chuyển đến Câu ${label}`);
      onClose();
      return;
    }

    // 4. Nếu câu này thuộc Level khác và có callback onJumpToSentence -> Chuyển phòng luyện sang câu đó!
    if (onJumpToSentence && (group.sentenceId || group.displayNumber)) {
      onJumpToSentence(
        group.sentenceId || "",
        group.part || currentPart,
        group.displayNumber,
      );
      toast.info(`Đã chuyển đến Câu ${label}`);
      onClose();
      return;
    }

    // 5. Nếu không thể chuyển -> Cảnh báo rõ ràng
    toast.warning(
      `Câu ${label} thuộc cấp độ khác trong Part ${group.part || currentPart} (không có trong bài luyện Level ${currentSentence?.level || ""} hiện tại)`,
    );
  };

  const handleClearAllGroupNotes = () => {
    onClearAll?.();
    setRefreshKey((k) => k + 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in select-none">
      {/* Lớp nền tối (không làm mờ chữ phía sau) */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 transition-opacity"
      />

      {/* Drawer trượt từ bên phải sang chuẩn DauEnglish */}
      <div
        className={`relative z-10 w-full max-w-[390px] h-full flex flex-col shadow-2xl border-l transition-all animate-slide-in-right ${
          isDarkMode
            ? "bg-[#0b1329] border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* 1. Header drawer: Ghi chú đã lưu / Trong lộ trình học & Nút ✕ */}
        <div className="p-5 pb-3 flex items-start justify-between border-b border-slate-800/60">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              <BookOpen size={18} className="text-sky-400" />
              <span>Ghi chú đã lưu</span>
            </h2>
            <p
              className={`text-xs mt-0.5 font-medium ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Trong lộ trình học
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            title="Đóng bảng ghi chú (Phím Esc hoặc B)"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* 2. Ô tìm kiếm note/text chuẩn Ảnh mẫu */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm trong note/text..."
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm outline-none transition-all border ${
                isDarkMode
                  ? "bg-[#060c1c] border-sky-500/40 text-slate-100 placeholder:text-slate-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
                  : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-sky-500"
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 3. Thanh thêm ghi chú nhanh cho câu hiện tại */}
        <div className="px-4 py-1">
          {!showAddForm ? (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-sky-500/40 text-xs font-bold text-sky-400 hover:bg-sky-500/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Thêm ghi chú cho Câu {currentSentenceLabel}</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-[#070e20] border border-sky-500/40 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                <span>Ghi chú Câu {currentSentenceLabel}</span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Hủy
                </button>
              </div>
              <textarea
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder="Nhập nội dung cần ghi nhớ, bẫy nghe..."
                rows={2}
                autoFocus
                className="w-full p-2 rounded-lg bg-[#0b1329] border border-slate-700 text-xs text-slate-200 outline-none resize-none focus:border-sky-400 select-text"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCreateNote}
                  className="px-3 py-1 rounded-lg bg-sky-500 text-white font-bold text-xs hover:bg-sky-400 cursor-pointer shadow-sm"
                >
                  Lưu
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. Danh sách các Card gom gọn theo từng câu chuẩn 100% Ảnh mẫu DauEnglish */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2.5">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <BookOpen size={32} className="mx-auto text-slate-600 mb-2" />
              <p className="text-xs font-bold text-slate-400">
                {searchQuery
                  ? "Không tìm thấy ghi chú phù hợp"
                  : "Chưa có ghi chú nào được lưu"}
              </p>
              <p className="text-[11px] text-slate-500 max-w-[240px] mx-auto leading-relaxed">
                Nhấn phím{" "}
                <kbd className="px-1 py-0.5 rounded bg-slate-800 text-sky-400 font-mono">
                  T
                </kbd>{" "}
                để đặt chữ hoặc{" "}
                <kbd className="px-1 py-0.5 rounded bg-slate-800 text-sky-400 font-mono">
                  N
                </kbd>{" "}
                để dán giấy ghi chú lên màn hình.
              </p>
              {onClearAll && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClearAllGroupNotes}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 cursor-pointer transition-colors"
                  >
                    Xóa sạch ghi chú & canvas trên màn hình
                  </button>
                </div>
              )}
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isCurrent =
                group.sentenceId && currentSentence?.id
                  ? group.sentenceId === currentSentence.id
                  : group.sentenceIndex === currentSentenceIndex;
              const label = getSentenceLabel(group);

              return (
                <div
                  key={group.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCardClick(group)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(group);
                    }
                  }}
                  className={`w-full text-left rounded-2xl p-3.5 border transition-all duration-150 cursor-pointer group select-text relative ${
                    isCurrent
                      ? "bg-[#0f1d3d] border-sky-500/70 shadow-md shadow-sky-500/10 ring-1 ring-sky-500/40"
                      : isDarkMode
                        ? "bg-[#0a1224] border-slate-800/90 hover:border-slate-700 hover:bg-[#0e172e]"
                        : "bg-slate-50 border-slate-200 hover:border-sky-300"
                  }`}
                >
                  {/* Hàng 1: [Câu X] [Part Y]                  Thời gian */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#1877f2] text-white shadow-xs">
                        Câu {label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          isDarkMode
                            ? "bg-slate-800/80 text-slate-300 border-slate-700/60"
                            : "bg-slate-200 text-slate-700 border-slate-300"
                        }`}
                      >
                        Part {group.part || currentPart}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-400">
                      {group.formattedTime}
                    </span>
                  </div>

                  {/* Hàng 2 (nếu có preview text): Nội dung chữ */}
                  {group.previewContent && (
                    <p
                      className={`text-xs leading-relaxed line-clamp-2 mb-2 font-medium select-text ${
                        isDarkMode ? "text-slate-200" : "text-slate-800"
                      }`}
                    >
                      {group.previewContent}
                    </p>
                  )}

                  {/* Hàng 3: Gom gọn toàn bộ toolbar badges của 1 câu chuẩn 100% Ảnh mẫu */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* 1. Khung chữ nhật [▢ X] */}
                      {group.rectCount > 0 && (
                        <div
                          title={`${group.rectCount} khung chữ nhật`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#131d36] text-slate-200 border border-slate-700/70 text-[11px] font-bold shadow-xs"
                        >
                          <Square size={11} className="text-slate-300" />
                          <span>{group.rectCount}</span>
                        </div>
                      )}

                      {/* 2. Mũi tên [↗ X] */}
                      {group.arrowCount > 0 && (
                        <div
                          title={`${group.arrowCount} mũi tên`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0f2347] text-sky-300 border border-sky-500/40 text-[11px] font-bold shadow-xs"
                        >
                          <ArrowUpRight size={12} className="text-sky-400" />
                          <span>{group.arrowCount}</span>
                        </div>
                      )}

                      {/* 3. Văn bản trực tiếp [T X] */}
                      {group.textCount > 0 && (
                        <div
                          title={`${group.textCount} đoạn chữ`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0d2a22] text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shadow-xs"
                        >
                          <Type size={11} className="text-emerald-400" />
                          <span>{group.textCount}</span>
                        </div>
                      )}

                      {/* 4. Giấy dán Sticky Note [📄 X] */}
                      {group.noteCount > 0 && (
                        <div
                          title={`${group.noteCount} ghi chú dán`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2b2210] text-amber-300 border border-amber-500/40 text-[11px] font-bold shadow-xs"
                        >
                          <StickyNote
                            size={11}
                            className="text-amber-400 fill-amber-400/20"
                          />
                          <span>{group.noteCount}</span>
                        </div>
                      )}

                      {/* 5. Gạch chân từ vựng [U X] */}
                      {group.underlineCount > 0 && (
                        <div
                          title={`${group.underlineCount} đoạn gạch chân`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1f1938] text-purple-300 border border-purple-500/40 text-[11px] font-bold shadow-xs"
                        >
                          <Underline size={11} className="text-purple-400" />
                          <span>{group.underlineCount}</span>
                        </div>
                      )}

                      {/* 6. Bút vẽ / Dạ quang [✏️ X] */}
                      {group.penCount > 0 && (
                        <div
                          title={`${group.penCount} nét vẽ`}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2b182b] text-pink-300 border border-pink-500/40 text-[11px] font-bold shadow-xs"
                        >
                          <PenTool size={11} className="text-pink-400" />
                          <span>{group.penCount}</span>
                        </div>
                      )}
                    </div>

                    {/* Nút Đến câu & Nút xóa câu này */}
                    <div className="flex items-center gap-2 ml-2 shrink-0">
                      <span className="text-[11px] text-sky-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        <span>Đến câu</span>
                        <ArrowRight size={11} />
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.sentenceIndex);
                        }}
                        title={`Xóa tất cả ghi chú Câu ${label}`}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 5. Footer: Tổng số câu có ghi chú & Phím tắt */}
        <div className="p-3 px-5 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between bg-[#070d1e]">
          <div className="flex items-center gap-2">
            <span>
              Tổng cộng:{" "}
              <strong className="text-white">{questionGroups.length}</strong>{" "}
              câu có ghi chú
            </span>
            {onClearAll && questionGroups.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllGroupNotes}
                className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline cursor-pointer font-medium"
              >
                (Xóa tất cả)
              </button>
            )}
          </div>
          <span className="flex items-center gap-1">
            <span>Đóng:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              B
            </kbd>
            <span>hoặc</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              Esc
            </kbd>
          </span>
        </div>
      </div>
    </div>
  );
};
