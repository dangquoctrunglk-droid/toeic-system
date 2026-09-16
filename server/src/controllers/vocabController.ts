import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Vocabulary } from "../models/Vocabulary.js";
import { addVocabulary, fetchVocavilaries } from "../services/vocabService.js";

// Lấy danh sách từ vựng kèm tìm kiếm và lọc theo chủ đề
export const getVocabularies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const vocabList = await fetchVocavilaries(req.query);
    res.status(StatusCodes.OK).json(vocabList);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi lấy danh sách từ vựng", error });
  }
};
// Thêm từ vựng mới (Chỉ dành cho Admin)
export const createVocabulary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { word, phonetic, meaning, topic, level, exampleSentence, audioUrl } =
      req.body;
    if (!word || !meaning || !topic || !level || !phonetic) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin từ vựng" });
      return;
    }
    const newVocab = await addVocabulary(req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Thêm từ vựng thành công!", data: newVocab });
  } catch (error) {
    console.error("Lỗi khi tạo từ vựng:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Lỗi khi tạo từ vựng" });
  }
};
