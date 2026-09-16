import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import * as writingService from "../services/writingService.js";

export const getWritingExercises = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const exercises = await writingService.fetchAllWritingExercises();
    res.status(200).json({ total: exercises.length, data: exercises });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi tải bài tập viết", error: error.message });
  }
};

export const submitWriting = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { exerciseId, content } = req.body;

    if (!userId || !exerciseId || !content) {
      res
        .status(400)
        .json({ message: "Thiếu mã bài viết hoặc nội dung bài nộp!" });
      return;
    }

    const submission = await writingService.createWritingSubmission(
      userId,
      exerciseId,
      content,
    );
    res
      .status(201)
      .json({ message: "Nộp bài viết thành công!", data: submission });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi lưu bài viết", error: error.message });
  }
};
