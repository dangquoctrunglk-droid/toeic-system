/**
 * ==============================================================================
 * MODULE: Listening - Types
 * MỤC ĐÍCH: Định nghĩa toàn bộ kiểu dữ liệu cho phân hệ Luyện nghe TOEIC Listening
 * (Nghe chép chính tả, Part 1, Part 2, Part 3, Part 4, Chế độ luyện tập, Từ vựng)
 * ==============================================================================
 */

export type ListeningPart = 1 | 2 | 3 | 4;

export type ListeningTabKey = "dictation" | "part1" | "part2" | "part3" | "part4";

export type PracticeMode = "dictation" | "check" | "full";

export interface VocabItem {
  word: string;
  phonetic: string;
  meaning: string;
  type: string;
  example: string;
}

export interface BlankField {
  id: string;
  word: string;
  position: number;
  hint?: string;
}

export interface QuestionOption {
  key: "A" | "B" | "C" | "D";
  text: string;
  isCorrect: boolean;
  translation?: string;
}

export interface SubQuestionItem {
  id: string;
  questionNumber: number;
  questionText: string;
  options: QuestionOption[];
  correctOption: "A" | "B" | "C" | "D";
  translation?: string;
  vocabRecommendation?: VocabItem;
  evidence?: string;
}

export interface SentenceItem {
  id: string;
  sentenceIndex: number;
  audioText: string;
  fullSentence: string;
  audioDuration?: number;
  blanks: BlankField[];
  vocabRecommendation?: VocabItem;
  topicId?: string;
  topicTitle?: string;
  level?: 1 | 2 | 3 | 4;
  // Các trường mở rộng chuẩn đề ETS mới (Part 1, 2, 3, 4)
  part?: ListeningPart;
  displayNumber?: string;
  directionText?: string;
  imageUrl?: string;
  // Dành cho Part 1 & 2 (Câu đơn):
  options?: QuestionOption[];
  correctOption?: "A" | "B" | "C" | "D";
  vietnameseTranslation?: string;
  optionsTranslation?: Record<string, string>;
  // Dành cho Part 3 & 4 (Nhóm hội thoại / Bài nói 3 câu):
  groupTitle?: string;
  subQuestions?: SubQuestionItem[];
  transcript?: string;
  evidence?: string;
}

export interface PartPracticeProgress {
  part: ListeningPart;
  lastIndex: number;
  userAnswers: Record<string, string>;
  completedQuestions: string[];
  correctAnswers: string[];
  earnedXP: number;
  lastUpdated: string;
}


export interface PartCardData {
  part: ListeningPart;
  title: string;
  subtitle: string;
  totalQuestions: number;
  completedQuestions: number;
  vocabCount: number;
  bookmarkCount: number;
  statusText: string;
  progressPercent: number;
}

export interface TestGroupData {
  id: string;
  testNumber: number;
  testName: string;
  year: number;
  parts: PartCardData[];
}

export interface PracticeLevelCard {
  id: string;
  title: string;
  questionCount: number;
  statusText: string;
}

export interface PracticeTopicCategory {
  categoryTitle: string;
  categorySubtitle: string;
  cards: PracticeLevelCard[];
}

export interface PartDetailedConfig {
  part: ListeningPart;
  levels: PracticeLevelCard[];
  topics: PracticeTopicCategory;
}
