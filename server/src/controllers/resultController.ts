import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Result } from "../models/Result.js";
import { User } from "../models/User.js";
import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

// Lấy lịch sử làm bài của học viên đang đăng nhập
export const getUserHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          "Không tìm thấy thông tin người dùng hoặc phiên đăng nhập không hợp lệ",
      });
      return;
    }

    const history = await Result.find({ userId })
      .populate("examId", "title type duration")
      .sort({ createdAt: -1 });
    res.status(200).json({ total: history.length, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: "Lỗi server" });
  }
};
// Thống kê tổng quan cho Admin Dashboard
export const getAdminDashBoardStats = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const [totalUsers, totalExams, totalQuestions, totalSubmissions] =
      await Promise.all([
        User.countDocuments({ role: "student" }),
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
    res.status(500).json({ message: "Lỗi khi tải dữ liệu thống kê", error });
  }
};
