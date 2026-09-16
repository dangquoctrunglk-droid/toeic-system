import type { Request, Response } from "express";
import * as questionService from "../services/questionService.js";

export const getQuestions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await questionService.fetchQuestions(req.query);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách câu hỏi", error: error.message });
  }
};

export const getQuestionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const question = await questionService.fetchQuestionById(
      req.params.id as string,
    );
    if (!question) {
      res.status(404).json({ message: "Không tìm thấy câu hỏi!" });
      return;
    }
    res.status(200).json({ data: question });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết câu hỏi", error: error.message });
  }
};

export const createQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { skill, part, questionText, options, correctAnswer } = req.body;
    if (!skill || !part || !questionText || !options || !correctAnswer) {
      res
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc!" });
      return;
    }

    const newQuestion = await questionService.addQuestion(req.body);
    res
      .status(201)
      .json({ message: "Thêm câu hỏi thành công!", data: newQuestion });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo câu hỏi", error: error.message });
  }
};
