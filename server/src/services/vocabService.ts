import { Vocabulary, type IVocabulary } from "../models/Vocabulary.js";

interface VocabQuery {
  search?: string;
  topic?: string;
  lever?: string;
}
export const fetchVocavilaries = async (query: VocabQuery) => {
  const filter: Record<string, any> = {};

  if (query.search) {
    filter.word = { $regex: query.search, $options: "i" };
  }

  if (query.topic) {
    filter.topic = { $regex: query.topic, $options: "i" };
  }

  if (query.lever) {
    filter.level = { $regex: query.lever, $options: "i" };
  }
  const vocabList = await Vocabulary.find(filter).sort({ createdAt: -1 });

  return { total: vocabList.length, data: vocabList };
};

export const addVocabulary = async (vocabData: Partial<IVocabulary>) => {
  return await Vocabulary.create(vocabData);
};
