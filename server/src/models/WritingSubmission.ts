import { model, Schema, type Document, type Types } from "mongoose";

export interface IWritingSubmission extends Document {
  userId: Types.ObjectId;
  writingExerciseId: Types.ObjectId;
  content: string; // Bài làm của học viên
  score?: number; // Điểm đánh giá (thang điểm TOEIC Writing: 0 - 200)
  feedback?: string; // Nhận xét, sửa lỗi
  status: "submitted" | "graded"; // Đã nộp hoặc Đã chấm
  createdAt: Date;
}

const writingSubmissionSchema = new Schema<IWritingSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    writingExerciseId: {
      type: Schema.Types.ObjectId,
      ref: "WritingExercise",
      required: true,
    },
    content: { type: String, required: true },
    score: { type: Number, min: 0, max: 200 },
    feedback: { type: String },
    status: {
      type: String,
      enum: ["submitted", "graded"],
      default: "submitted",
    },
  },
  { timestamps: true },
);

export const WritingSubmission = model<IWritingSubmission>(
  "WritingSubmission",
  writingSubmissionSchema,
);
