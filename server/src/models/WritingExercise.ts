import { Document, model, Schema } from "mongoose";

export interface IWritingExercise extends Document {
  part: number; // Part 1: Viết câu theo tranh, Part 2: Trả lời email, Part 3: Viết luận
  title: string; // Tiêu đề phần thi (ví dụ: "Part 1: Picture Description", "Part 2: Email Response", "Part 3: Essay Writing")
  prompt: string; // Nội dung câu hỏi / đề bài
  imageUrl?: string; // Ảnh (nếu là Part 1)
  requiredKeywords?: string[]; // Từ khóa bắt buộc phải dùng (nếu có)
  suggestedAnswer?: string; // Bài mẫu tham khảo
  createdAt: Date;
}

const writingExerciseSchema = new Schema<IWritingExercise>(
  {
    part: { type: Number, required: true, min: 1, max: 3 },
    title: { type: String, required: true, trim: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String },
    requiredKeywords: [{ type: String }],
    suggestedAnswer: { type: String },
  },
  { timestamps: true },
);

export const WritingExercise = model<IWritingExercise>(
  "WritingExercise",
  writingExerciseSchema,
);
