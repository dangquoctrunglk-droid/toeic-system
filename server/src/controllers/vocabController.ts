import type { Request, Response } from "express";
import { Vocabulary } from "../models/Vocabulary.js";

// Lấy danh sách từ vựng kèm tìm kiếm và lọc theo chủ đề
export const getVocabularies = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, topic, level } = req.query;
    const filter: Record<string, any> = {};
    if (search) {
      filter.word = {
        $regex: search,
        $options: "i",
      };
    }
    if (topic) {
      filter.topic = topic;
    }
    if (level) {
      filter.level = level;
    }

    const vocabList = await Vocabulary.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ total: vocabList.length, data: vocabList });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách từ vựng", error });
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
        .status(400)
        .json({ message: "Vui lòng cung cấp đầy đủ thông tin từ vựng" });
      return;
    }
    const newVocab = await Vocabulary.create({
      word,
      phonetic,
      meaning,
      topic,
      level: level || "Basic",
      exampleSentence,
      audioUrl,
    });
    res
      .status(201)
      .json({ message: "Thêm từ vựng thành công!", data: newVocab });
  } catch (error) {
    console.error("Lỗi khi tạo từ vựng:", error);
    res.status(500).json({ message: "Lỗi khi tạo từ vựng" });
  }
};
