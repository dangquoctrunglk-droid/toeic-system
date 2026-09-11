import type { Request, Response } from "express";
import { Question } from "../models/Question.js";

// Lấy danh sách câu hỏi kèm lọc theo Skill, Part và phân trang
export const getQuestions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { skill, part, page = 1, limit = 10 } = req.query;
    const filter: Record<string, any> = {};
    if (skill) {
      filter.skill = skill;
    }
    if (part) {
      filter.part = Number(part);
    }
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * pageSize;
    const [questions, total] = await Promise.all([
      Question.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Question.countDocuments(filter),
    ]);
    res.status(200).json({
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      data: questions,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách câu hỏi",
      error: error?.message || error,
    });
  }
};

// Lấy chi tiết một câu hỏi theo ID
export const getQuestionById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      res.status(404).json({ message: "Không tìm thấy câu hỏi!" });
      return;
    }
    res.status(200).json({ data: question });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi lấy câu hỏi",
      error: error?.message || error,
    });
  }
};

// Thêm câu hỏi mới vào ngân hàng đề (Chỉ Admin)
export const createQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      skill,
      part,
      passageText,
      questionText,
      options,
      correctAnswer,
      explanation,
    } = req.body;
    if (!skill || !part || !questionText || !options || !correctAnswer) {
      res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin bắt buộc của câu hỏi!",
      });
      return;
    }
    const newQuestion = await Question.create({
      skill,
      part,
      passageText,
      questionText,
      options,
      correctAnswer,
      explanation,
    });
    res.status(201).json({
      message: "Thêm câu hỏi thành công!",
      data: newQuestion,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Lỗi khi thêm câu hỏi",
      error: error.message || error,
    });
  }
};
