import dns from "node:dns";
import mongoose from "mongoose";
import { Question } from "../models/Question.js";
import { Vocabulary } from "../models/Vocabulary.js";
import { User } from "../models/User.js";
import { env } from "../config/enviroment.js";
import { CONNECT_DB, CLOSE_DB } from "../config/db.js";

// Fix lỗi querySrv ECONNREFUSED khi kết nối MongoDB Atlas trên Windows / Node.js
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const sampleUsers = [
  {
    fullName: "Quản Trị Viên",
    email: "admin@toeic.com",
    passwordHash: "admin123_hash_tam_thoi", // Sau này qua phần Auth sẽ băm bằng bcrypt
    role: "admin",
  },
  {
    fullName: "Đặng Quốc Trung",
    email: "trung@toeic.com",
    passwordHash: "user123_hash_tam_thoi",
    role: "student",
  },
];

const sampleVocabularies = [
  {
    word: "Contract",
    phonetic: "/ˈkɒntrækt/",
    meaning: "Hợp đồng, giao kèo",
    topic: "Business",
    level: "Basic",
    exampleSentence:
      "The company signed a three-year contract with the supplier.",
    audioUrl: "https://dict.youdao.com/dictvoice?audio=contract&type=2",
  },
  {
    word: "Negotiate",
    phonetic: "/nɪˈɡəʊʃieɪt/",
    meaning: "Đàm phán, thương lượng",
    topic: "Business",
    level: "Intermediate",
    exampleSentence: "They are trying to negotiate a better deal.",
    audioUrl: "https://dict.youdao.com/dictvoice?audio=negotiate&type=2",
  },
  {
    word: "Conference",
    phonetic: "/ˈkɒnfərəns/",
    meaning: "Hội nghị",
    topic: "Office",
    level: "Basic",
    exampleSentence: "The annual sales conference will be held in Da Nang.",
    audioUrl: "https://dict.youdao.com/dictvoice?audio=conference&type=2",
  },
  {
    word: "Invoice",
    phonetic: "/ˈɪnvɔɪs/",
    meaning: "Hóa đơn",
    topic: "Accounting",
    level: "Basic",
    exampleSentence: "Payment is due within 30 days of receiving the invoice.",
    audioUrl: "https://dict.youdao.com/dictvoice?audio=invoice&type=2",
  },
  {
    word: "Resignation",
    phonetic: "/ˌrezɪɡˈneɪʃn/",
    meaning: "Sự từ chức, thôi việc",
    topic: "Human Resources",
    level: "Advanced",
    exampleSentence: "Mr. Tanaka announced his resignation yesterday.",
    audioUrl: "https://dict.youdao.com/dictvoice?audio=resignation&type=2",
  },
];

const sampleQuestions = [
  // Part 1: Mô tả hình ảnh (Listening)
  {
    skill: "listening",
    part: 1,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    questionText:
      "Look at the picture and listen to the four statements. Select the best description.",
    options: [
      "A. Some people are sitting around a meeting table.",
      "B. The workers are painting the office wall.",
      "C. A man is cleaning the window.",
      "D. The computers are being moved to another room.",
    ],
    correctAnswer: "A",
    explanation:
      "Bức ảnh thể hiện mọi người đang ngồi xung quanh bàn họp trong văn phòng.",
  },
  // Part 2: Hỏi - Đáp (Listening)
  {
    skill: "listening",
    part: 2,
    questionText: "Where did you leave the client files?",
    options: [
      "A. On Ms. Linda’s desk.",
      "B. Yes, he is our new client.",
      "C. At around 3:00 PM.",
    ],
    correctAnswer: "A",
    explanation:
      'Câu hỏi hỏi về địa điểm ("Where"), đáp án chỉ vị trí là "On Ms. Linda’s desk".',
  },
  // Part 5: Điền vào câu (Reading)
  {
    skill: "reading",
    part: 5,
    questionText:
      "Ms. Clara requested that all expense reports be submitted ------- Friday afternoon.",
    options: ["A. before", "B. during", "C. between", "D. inside"],
    correctAnswer: "A",
    explanation:
      '"before Friday afternoon" nghĩa là trước chiều thứ Sáu, phù hợp về mặt ngữ nghĩa và ngữ pháp chỉ hạn chót.',
  },
  {
    skill: "reading",
    part: 5,
    questionText:
      "The newly introduced software operates much more ------- than the previous version.",
    options: [
      "A. efficient",
      "B. efficiently",
      "C. efficiency",
      "D. more efficient",
    ],
    correctAnswer: "B",
    explanation:
      'Cần một trạng từ (adverb) để bổ nghĩa cho động từ "operates", nên chọn "efficiently".',
  },
  // Part 7: Đọc hiểu đoạn văn (Reading)
  {
    skill: "reading",
    part: 7,
    passageText: `NOTICE TO ALL EMPLOYEES
The cafeteria on the 3rd floor will be closed this Wednesday, October 15, for scheduled maintenance and equipment upgrades. It will reopen on Thursday at 7:00 AM with our normal schedule. We apologize for any inconvenience.`,
    questionText: "Why will the cafeteria be closed on Wednesday?",
    options: [
      "A. For a company private party",
      "B. For routine maintenance",
      "C. Because of an emergency health inspection",
      "D. Due to severe weather conditions",
    ],
    correctAnswer: "B",
    explanation:
      'Trong thông báo có viết: "closed this Wednesday... for scheduled maintenance".',
  },
];

const runSeed = async () => {
  try {
    await CONNECT_DB();
    console.log(`✅ Đã kết nối database (${mongoose.connection.name}) để seed data.`);

    // Xóa sạch dữ liệu cũ của các bảng này (nếu có) để tránh trùng lặp
    await User.deleteMany({});
    await Vocabulary.deleteMany({});
    await Question.deleteMany({});
    console.log("🧹 Đã dọn dẹp các collection cũ.");

    // Thêm dữ liệu mới
    await User.insertMany(sampleUsers);
    await Vocabulary.insertMany(sampleVocabularies);
    await Question.insertMany(sampleQuestions);

    console.log("🎉 Seed dữ liệu mẫu thành công!");
    console.log(`- Đã tạo: ${sampleUsers.length} tài khoản người dùng`);
    console.log(`- Đã tạo: ${sampleVocabularies.length} từ vựng`);
    console.log(`- Đã tạo: ${sampleQuestions.length} câu hỏi TOEIC`);

    await CLOSE_DB();
    console.log("👋 Đã ngắt kết nối database.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi seed data:", error);
    process.exit(1);
  }
};

runSeed();
