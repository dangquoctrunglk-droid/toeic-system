import { Schema, model, Document } from "mongoose";
export interface IVocabulary extends Document {
  word: string;
  phonetic: string;
  meaning: string;
  topic: string;
  level: string; // 'Basic' | 'Intermediate' | 'Advanced'
  exampleSentence: string;
  audioUrl?: string;
  createdAt: Date;
}

const vocabularySchema = new Schema<IVocabulary>(
  {
    word: { type: String, required: true, trim: true },
    phonetic: { type: String, required: true },
    meaning: { type: String, required: true },
    topic: { type: String, required: true },
    level: { type: String, default: "Basic" },
    exampleSentence: { type: String, required: true },
    audioUrl: { type: String },
  },
  { timestamps: true },
);

export const Vocabulary = model<IVocabulary>("vocabulary", vocabularySchema);
