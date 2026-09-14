import type { Request, Response } from "express";
import { WritingExercise } from "../models/WritingExercise.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { WritingSubmission } from "../models/WritingSubmission.js";
import { User } from "../models/User.js";
import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";
import { Result } from "../models/Result.js";
// Lấy danh sách đề bài viết
export const getWritingExercises = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const exercises = await WritingExercise.find().sort({ createdAt: -1 });
    res.status(200).json({ total: exercises.length, data: exercises });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải bài tập viết", error });
  }
};
// Nộp bài viết (Học viên)
export const submitWriting = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { exerciseId, content } = req.body;
    const userId = req.user?.userId;
    if (!userId || !exerciseId || !content) {
      res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ mã đề và nội dung bài viết!",
      });
      return;
    }
    const submission = await WritingSubmission.create({
      userId,
      writingExerciseId: exerciseId,
      content,
    });
    res
      .status(201)
      .json({ message: "Nộp bài viết thành công!", data: submission });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lưu bài viết", error });
  }
};
// Thống kê tổng quan cho Admin Dashboard
export const getAdminDashboardStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const [totalUsers, totalExams, totalQuestions, totalSubmissions] =
      await Promise.all([
        User.countDocuments(),
        Exam.countDocuments(),
        Question.countDocuments(),
        Result.countDocuments(),
      ]);
    res.status(200).json({
      data: {
        totalUsers,
        totalExams,
        totalQuestions,
        totalSubmissions,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tải thống kê", error });
  }
};
