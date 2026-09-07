import { Document, model, Schema } from "mongoose";
export interface IQuestion extends Document {
  skill: "listening" | "reading";
  part: number; // 1 đến 7
  passageText?: string; // Đoạn văn cho Part 6, 7
  audioUrl?: string; // Link file nghe cho Part 1-4
  imageUrl?: string; // Link ảnh cho Part 1 hoặc bảng biểu Part 3, 7
  questionText: string;
  options: string[]; // Danh sách 4 lựa chọn [A, B, C, D]
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation?: string; // Lời giải thích
  createdAt: Date;
}

const questionSchema = new Schema<IQuestion>(
  {
    skill: { type: String, enum: ["listening", "reading"], required: true },
    part: { type: Number, required: true, min: 1, max: 7 },
    passageText: { type: String },
    audioUrl: { type: String },
    imageUrl: { type: String },
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String },
  },
  { timestamps: true },
);

export const Question = model<IQuestion>("question", questionSchema);
