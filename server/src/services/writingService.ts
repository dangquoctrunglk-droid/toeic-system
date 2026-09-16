import { WritingExercise } from "../models/WritingExercise.js";
import { WritingSubmission } from "../models/WritingSubmission.js";

export const fetchAllWritingExercises = async () => {
  return await WritingExercise.find().sort({ createdAt: -1 });
};

export const createWritingSubmission = async (
  userId: string,
  exerciseId: string,
  content: string,
) => {
  return await WritingSubmission.create({
    userId,
    writingExerciseId: exerciseId,
    content,
    status: "submitted",
  });
};
