import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { Exam } from "../models/Exam.js";
import { Result } from "../models/Result.js";

// Lấy danh sách tất cả các đề thi
export const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const exams = await Exam.find()
      .select("title type duration questions createdAt")
      .lean();
    const data = exams.map((exam) => ({
      ...exam,
      totalQuestions: exam.questions.length,
    }));
    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tải danh sách đề thi", error });
  }
};
// Lấy nội dung đề thi để làm bài (Ẩn đáp án đúng để chống gian lận)
export const getExamById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const exam = await Exam.findById(id).populate({
      path: "questions",
      select: " -correctAnswer -explanation ",
    }); // Ẩn đáp án và giải thích
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
    const newExam = await Exam.create({
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
    const { id } = req.params;
    const { answers } = req.body; // Mảng: [{ questionId: string, selectedOption: string }]
    const userId = req.user?.userId; // Từ authMiddleware
    if (!userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Không xác thực được người dùng!" });
      return;
    }
    const exam = await Exam.findById(id).populate("questions");
    if (!exam) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Không tìm thấy đề thi!" });
      return;
    }
    if (!answers || answers.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Không có câu trả lời!" });
      return;
    }
    const questionsList = exam.questions as any[];
    let correctCount = 0;
    const evaluatedAnswers: any[] = [];
    // Chấm điểm từng câu dựa trên đáp án chuẩn trong DB
    questionsList.forEach((q) => {
      const userAnswerObj = answers?.find(
        (a: any) => a.questionId === q._id.toString(),
      );
      const selected = userAnswerObj ? userAnswerObj.selectedOption : "";
      const isCorrect =
        selected.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();

      if (isCorrect) {
        correctCount += 1;
      }
      evaluatedAnswers.push({
        questionId: q._id,
        selectedOption: selected,
        isCorrect,
      });
    });
    // Tính điểm theo thang mẫu (tỉ lệ phần trăm hoặc quy đổi)
    const totalQuestions = questionsList.length;
    const totalScore = Math.round((correctCount / totalQuestions) * 990);
    // Lưu kết quả vào DB
    const saveResult = await Result.create({
      userId,
      examId: exam._id,
      totalScore,
      correctAnswersCount: correctCount,
      totalQuestions,
      userAnswers: evaluatedAnswers,
    });

    res.status(StatusCodes.OK).json({
      message: "Nộp bài thành công!",
      data: {
        resultId: saveResult._id,
        totalScore,
        correctAnswersCount: correctCount,
        totalQuestions,
        evaluatedAnswers,
      },
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi nộp bài", error });
  }
};
