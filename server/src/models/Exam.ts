import { model, Schema, type Document, type Types } from "mongoose";

export interface IExam extends Document {
  title: string;
  type: "full_test" | "mini_test" | "skill_test";
  duration: number; // Thời gian làm bài (phút)
  questions: Types.ObjectId[];
  createdAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["full_test", "mini_test", "skill_test"],
      default: "mini_test",
    },
    duration: {
      type: Number,
      required: true,
    },
    questions: [
      { type: Schema.Types.ObjectId, ref: "Question", required: true },
    ],
  },
  { timestamps: true },
);

export const Exam = model<IExam>("Exam", examSchema);
