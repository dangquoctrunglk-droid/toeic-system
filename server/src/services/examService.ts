import { Exam } from "../models/Exam.js";
import { Result } from "../models/Result.js";

export const fetchAllExams = async () => {
  const exams = await Exam.find()
    .select("title type duration questions createdAt")
    .lean();
  return exams.map((exam) => {
    return {
      ...exam,
      questionsCount: exam.questions.length,
    };
  });
};

export const fetchExamDetail = async (examId: string) => {
  return await Exam.findById(examId).populate({
    path: "questions",
    select: "-createdAt -updatedAt -__v",
  });
};

export const createExam = async (examData: any) => {
  return await Exam.create(examData);
};

export const deleteExam = async (examId: string) => {
  return await Exam.findByIdAndDelete(examId);
};

export const updateExam = async (examId: string, examData: any) => {
  return await Exam.findByIdAndUpdate(examId, examData, { new: true });
};

export const gradeExamSubmission = async (
  userId: string,
  examId: string,
  answers: { questionId: string; selectedOption: string }[],
) => {
  const exam = await Exam.findById(examId).populate("questions");
  if (!exam) {
    throw new Error("Đề thi không tồn tại!");
  }

  const questionsList = exam.questions as any[];
  let correctCount = 0;
  const evaluatedAnswers: any[] = [];

  questionsList.forEach((q) => {
    const userAns = answers?.find((a) => a.questionId === q._id.toString());
    const selected = userAns ? userAns.selectedOption : "";
    const isCorrect =
      selected.trim().toUpperCase() === q.correctAnswer.trim().toUpperCase();

    if (isCorrect) correctCount += 1;

    evaluatedAnswers.push({
      questionId: q._id,
      selectedOption: selected,
      isCorrect,
    });
  });

  const totalQuestions = questionsList.length;
  const totalScore = Math.round((correctCount / totalQuestions) * 990);

  const savedResult = await Result.create({
    userId,
    examId: exam._id,
    totalScore,
    correctAnswersCount: correctCount,
    totalQuestions,
    userAnswers: evaluatedAnswers,
  });

  return {
    resultId: savedResult._id,
    totalScore,
    correctAnswersCount: correctCount,
    totalQuestions,
    evaluatedAnswers,
  };
};
