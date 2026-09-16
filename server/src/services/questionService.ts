import { Question, type IQuestion } from "../models/Question.js";

interface QuestionQuery {
  skill?: string;
  part?: number;
  page?: number;
  limit?: number;
}

export const fetchQuestions = async (query: QuestionQuery) => {
  const filter: Record<string, any> = {};

  if (query.skill) {
    filter.skill = query.skill;
  }
  if (query.part) {
    filter.part = Number(query.part);
  }

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const [questions, total] = await Promise.all([
    Question.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Question.countDocuments(filter),
  ]);

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: questions,
  };
};

export const fetchQuestionById = async (id: string) => {
  return await Question.findById(id);
};

export const addQuestion = async (questionData: Partial<IQuestion>) => {
  return await Question.create(questionData);
};
