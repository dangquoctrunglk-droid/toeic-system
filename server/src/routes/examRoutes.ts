import { Router } from "express";
import {
  getExams,
  getExamById,
  createExam,
  submitExam,
} from "../controllers/examController.js";
import { requireAdmin, verifyToken } from "../middlewares/authMiddleware.js";

export const examRoutes = Router();
// Xem danh sách đề và thông tin làm bài
examRoutes.get("/", getExams);
examRoutes.get("/:id", getExamById);
// Thao tác bảo vệ (Cần Token)
examRoutes.post("/", verifyToken, requireAdmin, createExam); // Chỉ Admin tạo đề
examRoutes.post("/:id/submit", verifyToken, submitExam); // Học viên nộp bài
