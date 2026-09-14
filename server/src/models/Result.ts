import { Document, model, Schema, Types } from "mongoose";

export interface IUserAnswer extends Document {
  questionId: Types.ObjectId;
  selectedOption: string;
  isCorrect: boolean;
}
export interface IResult extends Document {
  userId: Types.ObjectId;
  examId: Types.ObjectId;
  totalScore: number;
  correctAnswersCount: number;
  totalQuestions: number;
  userAnswers: IUserAnswer[];
  createdAt: Date;
}

const resultSchema = new Schema<IResult>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    totalScore: { type: Number, default: 0 },
    correctAnswersCount: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    userAnswers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedOption: { type: String },
        isCorrect: { type: Boolean },
      },
    ],
  },
  { timestamps: true },
);

export const Result = model<IResult>("Result", resultSchema);
