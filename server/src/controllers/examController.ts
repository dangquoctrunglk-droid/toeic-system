import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Exam } from "../models/Exam.js";
import { Result } from "../models/Result.js";
import * as examService from "../services/examService.js";
// Lấy danh sách tất cả các đề thi
export const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await examService.fetchAllExams();
    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tải danh sách đề thi", error });
  }
};
// Lấy nội dung đề thi để làm bài (Ẩn đáp án đúng để chống gian lận)
export const getExamById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const exam = await examService.fetchExamDetail(req.params.id);
    if (!exam) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đề thi!" });
      return;
    }
    res.status(StatusCodes.OK).json({ data: exam });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tải chi tiết đề thi", error });
  }
};

// Tạo đề thi mới (Admin)
export const createExam = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, type, duration, questionIds } = req.body;
    if (!title || !duration || !questionIds || !questionIds.length) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message:
          "Vui lòng cung cấp đầy đủ tên đề, thời gian và danh sách câu hỏi!",
      });
      return;
    }
    const newExam = await examService.createExam({
      title,
      type: type || "mini_test",
      duration,
      questions: questionIds,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Tạo đề thi thành công!", data: newExam });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tạo đề thi", error });
  }
};
// Nộp bài và chấm điểm tự động
export const submitExam = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId; // Từ authMiddleware
    if (!userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Không xác thực được người dùng!" });
      return;
    }
    const evaluation = await examService.gradeExamSubmission(
      userId,
      req.params.id as string,
      req.body.answers,
    );

    res.status(StatusCodes.OK).json({
      message: "Nộp bài thành công!",
      data: evaluation,
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi nộp bài", error });
  }
};
