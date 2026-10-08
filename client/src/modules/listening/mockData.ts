import type {
  TestGroupData,
  SentenceItem,
  ListeningPart,
  PartDetailedConfig,
} from "./types";

/**
 * ==============================================================================
 * MOCK DATA: TOEIC ETS Listening
 * Dữ liệu mẫu chuẩn cấu trúc ETS Part 1 -> Part 4 và các câu luyện nghe chép chính tả
 * ==============================================================================
 */

export const MOCK_TEST_GROUPS: TestGroupData[] = [
  {
    id: "test-2026-1",
    testNumber: 1,
    testName: "Test 1",
    year: 2026,
    parts: [
      {
        part: 1,
        title: "Part 1",
        subtitle: "Mô tả hình ảnh (Photographs)",
        totalQuestions: 6,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
      {
        part: 2,
        title: "Part 2",
        subtitle: "Hỏi & Đáp (Question - Response)",
        totalQuestions: 25,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
      {
        part: 3,
        title: "Part 3",
        subtitle: "Đoạn hội thoại (Conversations)",
        totalQuestions: 39,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
      {
        part: 4,
        title: "Part 4",
        subtitle: "Bài nói chuyện ngắn (Short Talks)",
        totalQuestions: 30,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
    ],
  },
  {
    id: "test-2026-2",
    testNumber: 2,
    testName: "Test 2",
    year: 2026,
    parts: [
      {
        part: 1,
        title: "Part 1",
        subtitle: "Mô tả hình ảnh (Photographs)",
        totalQuestions: 6,
        completedQuestions: 3,
        vocabCount: 3,
        bookmarkCount: 1,
        statusText: "3/6",
        progressPercent: 50,
      },
      {
        part: 2,
        title: "Part 2",
        subtitle: "Hỏi & Đáp (Question - Response)",
        totalQuestions: 25,
        completedQuestions: 10,
        vocabCount: 6,
        bookmarkCount: 2,
        statusText: "10/25",
        progressPercent: 40,
      },
      {
        part: 3,
        title: "Part 3",
        subtitle: "Đoạn hội thoại (Conversations)",
        totalQuestions: 39,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
      {
        part: 4,
        title: "Part 4",
        subtitle: "Bài nói chuyện ngắn (Short Talks)",
        totalQuestions: 30,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
    ],
  },
  {
    id: "test-2024-1",
    testNumber: 1,
    testName: "Test 1",
    year: 2024,
    parts: [
      {
        part: 1,
        title: "Part 1",
        subtitle: "Mô tả hình ảnh (Photographs)",
        totalQuestions: 6,
        completedQuestions: 6,
        vocabCount: 8,
        bookmarkCount: 0,
        statusText: "6/6 - Hoàn thành",
        progressPercent: 100,
      },
      {
        part: 2,
        title: "Part 2",
        subtitle: "Hỏi & Đáp (Question - Response)",
        totalQuestions: 25,
        completedQuestions: 15,
        vocabCount: 12,
        bookmarkCount: 3,
        statusText: "15/25",
        progressPercent: 60,
      },
      {
        part: 3,
        title: "Part 3",
        subtitle: "Đoạn hội thoại (Conversations)",
        totalQuestions: 39,
        completedQuestions: 9,
        vocabCount: 5,
        bookmarkCount: 1,
        statusText: "9/39",
        progressPercent: 23,
      },
      {
        part: 4,
        title: "Part 4",
        subtitle: "Bài nói chuyện ngắn (Short Talks)",
        totalQuestions: 30,
        completedQuestions: 0,
        vocabCount: 0,
        bookmarkCount: 0,
        statusText: "Chưa bắt đầu",
        progressPercent: 0,
      },
    ],
  },
];

/**
 * Cấu hình chi tiết 4 Level & Dạng bài tập chuyên biệt cho từng Part (Chuẩn Ảnh mẫu mới)
 */
export const PART_DETAILED_CONFIGS: Record<ListeningPart, PartDetailedConfig> =
  {
    1: {
      part: 1,
      partTitle: "Part 1 – Mô tả hình ảnh",
      levels: [
        {
          id: "p1-l1",
          level: 1,
          title: "Level 1 – Dưới 200",
          questionCount: 2,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p1-l2",
          level: 2,
          title: "Level 2 – 200–300",
          questionCount: 2,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p1-l3",
          level: 3,
          title: "Level 3 – 300–400",
          questionCount: 1,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p1-l4",
          level: 4,
          title: "Level 4 – 400–495",
          questionCount: 1,
          statusText: "Chưa luyện tập",
        },
      ],
      topics: {
        categoryTitle: "Theo dạng tranh",
        categorySubtitle:
          "Cùng bộ câu ở trên, chia theo bức tranh mô tả gì. Mỗi câu thuộc đúng một dạng.",
        cards: [
          {
            id: "p1-t1",
            title: "Tranh một người",
            questionCount: 2,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p1-t2",
            title: "Tranh nhiều người",
            questionCount: 2,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p1-t3",
            title: "Tranh tả cảnh",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p1-t4",
            title: "Tranh tả vật",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
        ],
      },
    },
    2: {
      part: 2,
      partTitle: "Part 2 – Hỏi & Đáp",
      levels: [
        {
          id: "p2-l1",
          level: 1,
          title: "Level 1 – Dưới 200",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p2-l2",
          level: 2,
          title: "Level 2 – 200–300",
          questionCount: 4,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p2-l3",
          level: 3,
          title: "Level 3 – 300–400",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p2-l4",
          level: 4,
          title: "Level 4 – 400–495",
          questionCount: 2,
          statusText: "Chưa luyện tập",
        },
      ],
      topics: {
        categoryTitle: "Theo dạng câu hỏi",
        categorySubtitle:
          "Cùng bộ câu ở trên, chia theo dạng câu hỏi đầu tiên bạn nghe. Mỗi câu thuộc đúng một dạng.",
        cards: [
          {
            id: "p2-t1",
            title: "Câu hỏi Who",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t2",
            title: "Câu hỏi When",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t3",
            title: "Câu hỏi Where",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t4",
            title: "Câu hỏi Why",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t5",
            title: "Câu hỏi What / Which",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t6",
            title: "Câu hỏi How",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t7",
            title: "Câu hỏi Be/Do/Have",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t8",
            title: "Câu hỏi Modal verb",
            questionCount: 2,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t9",
            title: "Câu hỏi lựa chọn",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t10",
            title: "Câu hỏi đuôi",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t11",
            title: "Câu hỏi phủ định",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p2-t12",
            title: "Câu khẳng định",
            questionCount: 1,
            statusText: "Chưa luyện tập",
          },
        ],
      },
    },
    3: {
      part: 3,
      partTitle: "Part 3 – Đoạn hội thoại",
      levels: [
        {
          id: "p3-l1",
          level: 1,
          title: "Level 1 – Dưới 200",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p3-l2",
          level: 2,
          title: "Level 2 – 200–300",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p3-l3",
          level: 3,
          title: "Level 3 – 300–400",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p3-l4",
          level: 4,
          title: "Level 4 – 400–495",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
      ],
      topics: {
        categoryTitle: "Dạng đặc biệt",
        categorySubtitle:
          "Luyện riêng các dạng khó của Part 3, lấy từ bộ câu ở trên. Mỗi nhóm chỉ nằm ở một thẻ.",
        cards: [
          {
            id: "p3-t1",
            title: "Có hình / bảng biểu",
            questionCount: 6,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p3-t2",
            title: "Hội thoại 3 người nói",
            questionCount: 3,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p3-t3",
            title: "Câu hỏi hàm ý người nói",
            questionCount: 3,
            statusText: "Chưa luyện tập",
          },
        ],
      },
    },
    4: {
      part: 4,
      partTitle: "Part 4 – Bài nói chuyện ngắn",
      levels: [
        {
          id: "p4-l1",
          level: 1,
          title: "Level 1 – Dưới 200",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p4-l2",
          level: 2,
          title: "Level 2 – 200–300",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p4-l3",
          level: 3,
          title: "Level 3 – 300–400",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
        {
          id: "p4-l4",
          level: 4,
          title: "Level 4 – 400–495",
          questionCount: 3,
          statusText: "Chưa luyện tập",
        },
      ],
      topics: {
        categoryTitle: "Dạng đặc biệt",
        categorySubtitle:
          "Luyện riêng các dạng khó của Part 4, lấy từ bộ câu ở trên. Mỗi nhóm chỉ nằm ở một thẻ.",
        cards: [
          {
            id: "p4-t1",
            title: "Có hình / bảng biểu",
            questionCount: 6,
            statusText: "Chưa luyện tập",
          },
          {
            id: "p4-t2",
            title: "Câu hỏi hàm ý người nói",
            questionCount: 6,
            statusText: "Chưa luyện tập",
          },
        ],
      },
    },
  };

/**
 * ==============================================================================
 * DANH SÁCH CÂU HỎI LUYỆN NGHE CHÉP CHÍNH TẢ CHUẨN ETS TOEIC MỚI NHẤT
 * Phân chia chi tiết theo 4 Part, đầy đủ chủ đề thực tế, cấp độ Level (1-4),
 * từ vựng học thuật Business English và gợi ý ô điền thông minh.
 * ==============================================================================
 */
export const MOCK_SENTENCES_BY_PART: Record<ListeningPart, SentenceItem[]> = {
  // ----------------------------------------------------------------------------
  // PART 1: MÔ TẢ HÌNH ẢNH (Photographs) - Chuẩn ETS TOEIC mới nhất
  // ----------------------------------------------------------------------------
  1: [
    // 1. Tranh một người leo thang (Khớp chính xác Ảnh 1 mẫu)
    {
      id: "part1-q1",
      sentenceIndex: 1,
      part: 1,
      displayNumber: "1.",
      directionText: "Select the one statement that best describes what you see in the picture.",
      imageUrl: "/part1_ladder.jpg",
      topicId: "p1-t1",
      topicTitle: "Tranh một người",
      level: 1,
      audioText: "He's climbing a ladder.",
      fullSentence: "He's climbing a ladder.",
      options: [
        {
          key: "A",
          text: "He's standing on a rug.",
          isCorrect: false,
          translation: "Anh ấy đang đứng trên một tấm thảm.",
          blanks: [
            { id: "p1-q1-a-b1", word: "standing", position: 1, hint: "s" },
            { id: "p1-q1-a-b2", word: "rug", position: 4, hint: "r" }
          ]
        },
        {
          key: "B",
          text: "He's turning a doorknob.",
          isCorrect: false,
          translation: "Anh ấy đang xoay quả đấm cửa.",
          blanks: [
            { id: "p1-q1-b-b1", word: "turning", position: 1, hint: "t" },
            { id: "p1-q1-b-b2", word: "doorknob", position: 3, hint: "d" }
          ]
        },
        {
          key: "C",
          text: "He's climbing a ladder.",
          isCorrect: true,
          translation: "Anh ấy đang leo lên một cái thang.",
          blanks: [
            { id: "p1-q1-c-b1", word: "climbing", position: 1, hint: "c" },
            { id: "p1-q1-c-b2", word: "ladder", position: 3, hint: "l" }
          ]
        },
        {
          key: "D",
          text: "He's painting a wall.",
          isCorrect: false,
          translation: "Anh ấy đang sơn một bức tường.",
          blanks: [
            { id: "p1-q1-d-b1", word: "painting", position: 1, hint: "p" },
            { id: "p1-q1-d-b2", word: "wall", position: 3, hint: "w" }
          ]
        }
      ],
      correctOption: "C",
      vietnameseTranslation: "Đáp án đúng là (C): Người đàn ông đang bước lên các bậc của một chiếc thang nhôm để kiểm tra hoặc thao tác sửa chữa trong nhà.",
      vocabRecommendation: {
        word: "ladder",
        phonetic: "/ˈlæd.ər/",
        type: "danh từ",
        meaning: "Cái thang xếp, thang gấp",
        example: "The worker is climbing a ladder to repair the doorway ceiling."
      },
      blanks: [
        { id: "b1", word: "climbing", position: 1, hint: "c" },
        { id: "b2", word: "ladder", position: 3, hint: "l" }
      ]
    },

    // 2. Tranh nhiều người họp bàn làm việc
    {
      id: "part1-q2",
      sentenceIndex: 2,
      part: 1,
      displayNumber: "2.",
      directionText: "Select the one statement that best describes what you see in the picture.",
      imageUrl: "/part1_meeting.jpg",
      topicId: "p1-t2",
      topicTitle: "Tranh nhiều người",
      level: 2,
      audioText: "Colleagues are gathered around a table in a conference room.",
      fullSentence: "Colleagues are gathered around a table in a conference room.",
      options: [
        {
          key: "A",
          text: "Colleagues are gathered around a table in a conference room.",
          isCorrect: true,
          translation: "Các đồng nghiệp đang quây quần quanh bàn trong phòng họp.",
          blanks: [
            { id: "p1-q2-a-b1", word: "Colleagues", position: 0, hint: "C" },
            { id: "p1-q2-a-b2", word: "gathered", position: 2, hint: "g" },
            { id: "p1-q2-a-b3", word: "conference", position: 8, hint: "c" },
            { id: "p1-q2-a-b4", word: "room", position: 9, hint: "r" }
          ]
        },
        {
          key: "B",
          text: "Some workers are assembling office chairs.",
          isCorrect: false,
          translation: "Một số công nhân đang lắp ráp ghế văn phòng.",
          blanks: [
            { id: "p1-q2-b-b1", word: "workers", position: 1, hint: "w" },
            { id: "p1-q2-b-b2", word: "assembling", position: 3, hint: "a" },
            { id: "p1-q2-b-b3", word: "chairs", position: 5, hint: "c" }
          ]
        },
        {
          key: "C",
          text: "A presenter is turning off a projector.",
          isCorrect: false,
          translation: "Người thuyết trình đang tắt máy chiếu.",
          blanks: [
            { id: "p1-q2-c-b1", word: "presenter", position: 1, hint: "p" },
            { id: "p1-q2-c-b2", word: "turning", position: 3, hint: "t" },
            { id: "p1-q2-c-b3", word: "projector", position: 6, hint: "p" }
          ]
        },
        {
          key: "D",
          text: "Employees are packing files into boxes.",
          isCorrect: false,
          translation: "Nhân viên đang đóng gói tài liệu vào thùng.",
          blanks: [
            { id: "p1-q2-d-b1", word: "Employees", position: 0, hint: "E" },
            { id: "p1-q2-d-b2", word: "packing", position: 2, hint: "p" },
            { id: "p1-q2-d-b3", word: "boxes", position: 5, hint: "b" }
          ]
        }
      ],
      correctOption: "A",
      vietnameseTranslation: "Đáp án đúng là (A): Mọi người đang ngồi thảo luận nghiêm túc quanh bàn làm việc lớn trong phòng họp công ty.",
      vocabRecommendation: {
        word: "gather",
        phonetic: "/ˈɡæðər/",
        type: "động từ",
        meaning: "Tập trung lại, quây quần, hội họp",
        example: "Colleagues are gathered around a table to review the quarterly report."
      },
      blanks: [
        { id: "b1", word: "Colleagues", position: 0, hint: "C" },
        { id: "b2", word: "gathered", position: 2, hint: "g" },
        { id: "b3", word: "conference", position: 8, hint: "c" },
        { id: "b4", word: "room", position: 9, hint: "r" }
      ]
    },

    // 3. Tranh kỹ thuật viên sửa thiết bị
    {
      id: "part1-q3",
      sentenceIndex: 3,
      part: 1,
      displayNumber: "3.",
      directionText: "Select the one statement that best describes what you see in the picture.",
      imageUrl: "/part1_ladder.jpg",
      topicId: "p1-t1",
      topicTitle: "Tranh một người",
      level: 1,
      audioText: "The technician is repairing a piece of equipment.",
      fullSentence: "The technician is repairing a piece of equipment.",
      options: [
        {
          key: "A",
          text: "The technician is repairing a piece of equipment.",
          isCorrect: true,
          translation: "Kỹ thuật viên đang sửa chữa một thiết bị.",
          blanks: [
            { id: "p1-q3-a-b1", word: "technician", position: 1, hint: "t" },
            { id: "p1-q3-a-b2", word: "repairing", position: 3, hint: "r" },
            { id: "p1-q3-a-b3", word: "equipment", position: 7, hint: "e" }
          ]
        },
        {
          key: "B",
          text: "A customer is paying at the cash register.",
          isCorrect: false,
          translation: "Khách hàng đang thanh toán tại quầy thu ngân.",
          blanks: [
            { id: "p1-q3-b-b1", word: "customer", position: 1, hint: "c" },
            { id: "p1-q3-b-b2", word: "paying", position: 3, hint: "p" },
            { id: "p1-q3-b-b3", word: "register", position: 7, hint: "r" }
          ]
        },
        {
          key: "C",
          text: "The man is hanging a picture frame on the wall.",
          isCorrect: false,
          translation: "Người đàn ông đang treo khung ảnh lên tường.",
          blanks: [
            { id: "p1-q3-c-b1", word: "hanging", position: 3, hint: "h" },
            { id: "p1-q3-c-b2", word: "frame", position: 6, hint: "f" },
            { id: "p1-q3-c-b3", word: "wall", position: 9, hint: "w" }
          ]
        },
        {
          key: "D",
          text: "Tools are being loaded onto a delivery van.",
          isCorrect: false,
          translation: "Các dụng cụ đang được chất lên xe tải giao hàng.",
          blanks: [
            { id: "p1-q3-d-b1", word: "Tools", position: 0, hint: "T" },
            { id: "p1-q3-d-b2", word: "loaded", position: 3, hint: "l" },
            { id: "p1-q3-d-b3", word: "delivery", position: 6, hint: "d" }
          ]
        }
      ],
      correctOption: "A",
      vietnameseTranslation: "Đáp án đúng là (A): Người kỹ thuật viên đang tập trung sửa chữa thiết bị.",
      vocabRecommendation: {
        word: "equipment",
        phonetic: "/ɪˈkwɪpmənt/",
        type: "danh từ (uncountable)",
        meaning: "Trang thiết bị, máy móc dụng cụ",
        example: "All office equipment must be checked periodically by the technician."
      },
      blanks: [
        { id: "b1", word: "technician", position: 1, hint: "t" },
        { id: "b2", word: "repairing", position: 3, hint: "r" },
        { id: "b3", word: "equipment", position: 7, hint: "e" }
      ]
    },

    // 4. Tranh nhiều người: Hành khách lên tàu
    {
      id: "part1-q4",
      sentenceIndex: 4,
      part: 1,
      displayNumber: "4.",
      directionText: "Select the one statement that best describes what you see in the picture.",
      imageUrl: "/part1_ladder.jpg",
      topicId: "p1-t2",
      topicTitle: "Tranh nhiều người",
      level: 2,
      audioText: "Some passengers are boarding a commuter train.",
      fullSentence: "Some passengers are boarding a commuter train.",
      options: [
        {
          key: "A",
          text: "Some passengers are boarding a commuter train.",
          isCorrect: true,
          translation: "Một số hành khách đang lên tàu điện đi làm.",
          blanks: [
            { id: "p1-q4-a-b1", word: "passengers", position: 1, hint: "p" },
            { id: "p1-q4-a-b2", word: "boarding", position: 3, hint: "b" },
            { id: "p1-q4-a-b3", word: "commuter", position: 5, hint: "c" }
          ]
        },
        {
          key: "B",
          text: "Luggage is being stored in the overhead compartment.",
          isCorrect: false,
          translation: "Hành lý đang được cất vào khoang trên đầu.",
          blanks: [
            { id: "p1-q4-b-b1", word: "Luggage", position: 0, hint: "L" },
            { id: "p1-q4-b-b2", word: "stored", position: 3, hint: "s" },
            { id: "p1-q4-b-b3", word: "compartment", position: 7, hint: "c" }
          ]
        },
        {
          key: "C",
          text: "The conductor is checking travel tickets.",
          isCorrect: false,
          translation: "Người soát vé đang kiểm tra vé tàu.",
          blanks: [
            { id: "p1-q4-c-b1", word: "conductor", position: 1, hint: "c" },
            { id: "p1-q4-c-b2", word: "checking", position: 3, hint: "c" },
            { id: "p1-q4-c-b3", word: "tickets", position: 5, hint: "t" }
          ]
        },
        {
          key: "D",
          text: "People are waiting in line at the ticket booth.",
          isCorrect: false,
          translation: "Mọi người đang xếp hàng tại quầy vé.",
          blanks: [
            { id: "p1-q4-d-b1", word: "waiting", position: 2, hint: "w" },
            { id: "p1-q4-d-b2", word: "ticket", position: 6, hint: "t" },
            { id: "p1-q4-d-b3", word: "booth", position: 7, hint: "b" }
          ]
        }
      ],
      correctOption: "A",
      vietnameseTranslation: "Đáp án đúng là (A): Các hành khách đang bước lên toa tàu.",
      vocabRecommendation: {
        word: "commuter",
        phonetic: "/kəˈmjuːtər/",
        type: "danh từ",
        meaning: "Người đi làm hàng ngày bằng phương tiện công cộng",
        example: "Commuters experienced slight delays due to track maintenance."
      },
      blanks: [
        { id: "b1", word: "passengers", position: 1, hint: "p" },
        { id: "b2", word: "boarding", position: 3, hint: "b" },
        { id: "b3", word: "commuter", position: 5, hint: "c" }
      ]
    },

    // 5. Tranh tả vật: Hàng hóa trên kệ gỗ
    {
      id: "part1-q5",
      sentenceIndex: 5,
      part: 1,
      displayNumber: "5.",
      directionText: "Select the one statement that best describes what you see in the picture.",
      imageUrl: "/part1_ladder.jpg",
      topicId: "p1-t4",
      topicTitle: "Tranh tả vật",
      level: 3,
      audioText: "Merchandise is displayed on wooden shelves.",
      fullSentence: "Merchandise is displayed on wooden shelves.",
      options: [
        {
          key: "A",
          text: "Merchandise is displayed on wooden shelves.",
          isCorrect: true,
          translation: "Hàng hóa được trưng bày trên các kệ gỗ.",
          blanks: [
            { id: "p1-q5-a-b1", word: "Merchandise", position: 0, hint: "M" },
            { id: "p1-q5-a-b2", word: "displayed", position: 2, hint: "d" },
            { id: "p1-q5-a-b3", word: "shelves", position: 5, hint: "s" }
          ]
        },
        {
          key: "B",
          text: "Customers are browsing clothes on racks.",
          isCorrect: false,
          translation: "Khách hàng đang xem quần áo trên giá treo.",
          blanks: [
            { id: "p1-q5-b-b1", word: "Customers", position: 0, hint: "C" },
            { id: "p1-q5-b-b2", word: "browsing", position: 2, hint: "b" },
            { id: "p1-q5-b-b3", word: "racks", position: 5, hint: "r" }
          ]
        },
        {
          key: "C",
          text: "A store clerk is stocking milk cartons.",
          isCorrect: false,
          translation: "Nhân viên đang xếp các hộp sữa lên kệ.",
          blanks: [
            { id: "p1-q5-c-b1", word: "clerk", position: 2, hint: "c" },
            { id: "p1-q5-c-b2", word: "stocking", position: 4, hint: "s" },
            { id: "p1-q5-c-b3", word: "cartons", position: 6, hint: "c" }
          ]
        },
        {
          key: "D",
          text: "Shopping carts are lined up near the entrance.",
          isCorrect: false,
          translation: "Xe đẩy mua hàng được xếp thành hàng gần lối vào.",
          blanks: [
            { id: "p1-q5-d-b1", word: "Shopping", position: 0, hint: "S" },
            { id: "p1-q5-d-b2", word: "carts", position: 1, hint: "c" },
            { id: "p1-q5-d-b3", word: "entrance", position: 7, hint: "e" }
          ]
        }
      ],
      correctOption: "A",
      vietnameseTranslation: "Đáp án đúng là (A): Hàng hóa đang được trưng bày đẹp mắt trên các kệ gỗ.",
      vocabRecommendation: {
        word: "merchandise",
        phonetic: "/ˈmɜːrtʃəndaɪz/",
        type: "danh từ (uncountable)",
        meaning: "Hàng hóa trưng bày bán lẻ",
        example: "The boutique store displays premium merchandise in the window."
      },
      blanks: [
        { id: "b1", word: "Merchandise", position: 0, hint: "M" },
        { id: "b2", word: "displayed", position: 2, hint: "d" }
      ]
    },

    // 6. Tranh tả cảnh: Ghế đá ven lối đi
    {
      id: "part1-q6",
      sentenceIndex: 6,
      part: 1,
      displayNumber: "6.",
      directionText: "Select the one statement that best describes what you see in the picture.",
      imageUrl: "/part1_meeting.jpg",
      topicId: "p1-t3",
      topicTitle: "Tranh tả cảnh",
      level: 4,
      audioText: "Several wooden benches are arranged along a paved walkway.",
      fullSentence: "Several wooden benches are arranged along a paved walkway.",
      options: [
        {
          key: "A",
          text: "Trees are being planted in a public park.",
          isCorrect: false,
          translation: "Cây cối đang được trồng trong công viên.",
          blanks: [
            { id: "p1-q6-a-b1", word: "Trees", position: 0, hint: "T" },
            { id: "p1-q6-a-b2", word: "planted", position: 3, hint: "p" },
            { id: "p1-q6-a-b3", word: "park", position: 7, hint: "p" }
          ]
        },
        {
          key: "B",
          text: "Several wooden benches are arranged along a paved walkway.",
          isCorrect: true,
          translation: "Nhiều băng ghế gỗ được sắp xếp dọc theo lối đi lát gạch.",
          blanks: [
            { id: "p1-q6-b-b1", word: "wooden", position: 1, hint: "w" },
            { id: "p1-q6-b-b2", word: "benches", position: 2, hint: "b" },
            { id: "p1-q6-b-b3", word: "arranged", position: 4, hint: "a" },
            { id: "p1-q6-b-b4", word: "walkway", position: 8, hint: "w" }
          ]
        },
        {
          key: "C",
          text: "Pedestrians are crossing at an intersection.",
          isCorrect: false,
          translation: "Người đi bộ đang qua đường tại ngã tư.",
          blanks: [
            { id: "p1-q6-c-b1", word: "Pedestrians", position: 0, hint: "P" },
            { id: "p1-q6-c-b2", word: "crossing", position: 2, hint: "c" },
            { id: "p1-q6-c-b3", word: "intersection", position: 5, hint: "i" }
          ]
        },
        {
          key: "D",
          text: "Streetlights are being installed on the sidewalk.",
          isCorrect: false,
          translation: "Đèn đường đang được lắp đặt trên vỉa hè.",
          blanks: [
            { id: "p1-q6-d-b1", word: "Streetlights", position: 0, hint: "S" },
            { id: "p1-q6-d-b2", word: "installed", position: 3, hint: "i" },
            { id: "p1-q6-d-b3", word: "sidewalk", position: 6, hint: "s" }
          ]
        }
      ],
      correctOption: "B",
      vietnameseTranslation: "Đáp án đúng là (B): Các băng ghế gỗ được xếp ngay ngắn dọc lối đi lát gạch.",
      vocabRecommendation: {
        word: "paved",
        phonetic: "/peɪvd/",
        type: "tính từ",
        meaning: "Được lát gạch, lát đá phẳng phiu",
        example: "A paved walkway connects the corporate office to the garden."
      },
      blanks: [
        { id: "b1", word: "wooden", position: 1, hint: "w" },
        { id: "b2", word: "benches", position: 2, hint: "b" },
        { id: "b3", word: "arranged", position: 4, hint: "a" }
      ]
    }
  ],

  // ----------------------------------------------------------------------------
  // PART 2: HỎI & ĐÁP (Question - Response) - 3 Lựa chọn (A, B, C) Chuẩn Ảnh 2 mẫu
  // ----------------------------------------------------------------------------
  2: [
    // 1. Câu 7 (Khớp chính xác Ảnh 2 mẫu): Where did you leave the contract documents?
    {
      id: "part2-q1",
      sentenceIndex: 1,
      part: 2,
      displayNumber: "7.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t3",
      topicTitle: "Câu hỏi Where",
      level: 1,
      audioText: "Where did you leave the contract documents?",
      fullSentence: "Where did you leave the contract documents?",
      options: [
        { key: "A", text: "In the filing cabinet on the third floor.", isCorrect: true, translation: "Trong tủ hồ sơ ở tầng ba." },
        { key: "B", text: "Yes, I signed it yesterday morning.", isCorrect: false, translation: "Vâng, tôi đã ký nó sáng qua." },
        { key: "C", text: "No later than five o'clock.", isCorrect: false, translation: "Không muộn hơn 5 giờ chiều." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi: 'Bạn đã để các tài liệu hợp đồng ở đâu?' -> Đáp án (A) trả lời chính xác nơi chốn: 'Trong tủ hồ sơ ở tầng ba.' Các đáp án (B) bắt đầu bằng 'Yes' (bẫy kinh điển câu hỏi WH-question), (C) trả lời về thời gian (When).",
      vocabRecommendation: {
        word: "filing cabinet",
        phonetic: "/ˈfaɪ.lɪŋ ˌkæb.ɪ.nət/",
        type: "danh từ",
        meaning: "Tủ đựng hồ sơ tài liệu văn phòng",
        example: "The signed lease agreements are kept inside the metal filing cabinet."
      },
      blanks: [
        { id: "b1", word: "Where", position: 0, hint: "W" },
        { id: "b2", word: "contract", position: 5, hint: "c" },
        { id: "b3", word: "documents", position: 6, hint: "d" }
      ]
    },

    // 2. Câu 8: Who is responsible for organizing the annual retirement banquet?
    {
      id: "part2-q2",
      sentenceIndex: 2,
      part: 2,
      displayNumber: "8.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t1",
      topicTitle: "Câu hỏi Who",
      level: 1,
      audioText: "Who is responsible for organizing the annual retirement banquet?",
      fullSentence: "Who is responsible for organizing the annual retirement banquet?",
      options: [
        { key: "A", text: "Ms. Tanaka from human resources.", isCorrect: true, translation: "Cô Tanaka từ phòng nhân sự." },
        { key: "B", text: "At the grand ballroom downtown.", isCorrect: false, translation: "Tại phòng khánh tiết trung tâm." },
        { key: "C", text: "Yes, I'd love to join the party.", isCorrect: false, translation: "Vâng, tôi rất muốn tham gia." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi Who (Ai chịu trách nhiệm tổ chức tiệc chiêu đãi hưu trí hàng năm?) -> Đáp án (A) chỉ rõ danh tính người phụ trách (Ms. Tanaka).",
      vocabRecommendation: {
        word: "banquet",
        phonetic: "/ˈbæŋkwɪt/",
        type: "danh từ",
        meaning: "Bữa tiệc lớn, yến tiệc trang trọng",
        example: "The corporate awards banquet will be hosted at the grand ballroom."
      },
      blanks: [
        { id: "b1", word: "responsible", position: 2, hint: "r" },
        { id: "b2", word: "organizing", position: 4, hint: "o" },
        { id: "b3", word: "banquet", position: 8, hint: "b" }
      ]
    },

    // 3. Câu 9: When will the construction on the north highway be completed?
    {
      id: "part2-q3",
      sentenceIndex: 3,
      part: 2,
      displayNumber: "9.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t2",
      topicTitle: "Câu hỏi When",
      level: 1,
      audioText: "When will the construction on the north highway be completed?",
      fullSentence: "When will the construction on the north highway be completed?",
      options: [
        { key: "A", text: "By the end of next month.", isCorrect: true, translation: "Trước cuối tháng sau." },
        { key: "B", text: "Because of severe afternoon rain.", isCorrect: false, translation: "Vì trời mưa lớn buổi chiều." },
        { key: "C", text: "On the western avenue.", isCorrect: false, translation: "Trên đại lộ phía tây." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi When (Khi nào công trình trên xa lộ hoàn thành?) -> Đáp án (A) cung cấp thời hạn cụ thể (By the end of next month).",
      vocabRecommendation: {
        word: "highway",
        phonetic: "/ˈhaɪweɪ/",
        type: "danh từ",
        meaning: "Đường cao tốc, xa lộ",
        example: "Highway repairs have temporarily reduced traffic to a single lane."
      },
      blanks: [
        { id: "b1", word: "construction", position: 3, hint: "c" },
        { id: "b2", word: "highway", position: 7, hint: "h" },
        { id: "b3", word: "completed", position: 9, hint: "c" }
      ]
    },

    // 4. Câu 10: Why did the client postpone the product demonstration?
    {
      id: "part2-q4",
      sentenceIndex: 4,
      part: 2,
      displayNumber: "10.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t4",
      topicTitle: "Câu hỏi Why",
      level: 2,
      audioText: "Why did the client postpone the product demonstration?",
      fullSentence: "Why did the client postpone the product demonstration?",
      options: [
        { key: "A", text: "Their managing director had a flight delay.", isCorrect: true, translation: "Giám đốc điều hành của họ bị hoãn chuyến bay." },
        { key: "B", text: "Yes, the product is very innovative.", isCorrect: false, translation: "Vâng, sản phẩm rất đổi mới." },
        { key: "C", text: "In meeting room four.", isCorrect: false, translation: "Trong phòng họp số bốn." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi Why (Tại sao khách hàng hoãn buổi thuyết minh sản phẩm?) -> Đáp án (A) nêu lý do chính đáng: Giám đốc điều hành bị hoãn chuyến bay.",
      vocabRecommendation: {
        word: "postpone",
        phonetic: "/poʊstˈpoʊn/",
        type: "động từ",
        meaning: "Trì hoãn, lùi lịch lại sau",
        example: "The board decided to postpone the annual meeting until next Friday."
      },
      blanks: [
        { id: "b1", word: "postpone", position: 4, hint: "p" },
        { id: "b2", word: "demonstration", position: 7, hint: "d" }
      ]
    },

    // 5. Câu 11: How often do the shuttle buses depart from the main terminal?
    {
      id: "part2-q5",
      sentenceIndex: 5,
      part: 2,
      displayNumber: "11.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t5",
      topicTitle: "Câu hỏi How",
      level: 2,
      audioText: "How often do the shuttle buses depart from the main terminal?",
      fullSentence: "How often do the shuttle buses depart from the main terminal?",
      options: [
        { key: "A", text: "Every fifteen minutes on the hour.", isCorrect: true, translation: "Cứ mười lăm phút một chuyến." },
        { key: "B", text: "No, the bus is completely full.", isCorrect: false, translation: "Không, xe buýt đã đầy khách." },
        { key: "C", text: "At terminal gate number seven.", isCorrect: false, translation: "Tại cổng số bảy của nhà ga." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi How often (Bao lâu thì xe buýt tuyến xuất bến?) -> Đáp án (A) trả lời tần suất: Cứ 15 phút một chuyến.",
      vocabRecommendation: {
        word: "shuttle",
        phonetic: "/ˈʃʌtl/",
        type: "danh từ",
        meaning: "Xe buýt tuyến ngắn đưa đón qua lại định kỳ",
        example: "Complimentary shuttle service operates between the hotel and the airport."
      },
      blanks: [
        { id: "b1", word: "shuttle", position: 4, hint: "s" },
        { id: "b2", word: "depart", position: 6, hint: "d" }
      ]
    },

    // 6. Câu 12: Which catering company should we hire for the conference?
    {
      id: "part2-q6",
      sentenceIndex: 6,
      part: 2,
      displayNumber: "12.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t6",
      topicTitle: "Câu hỏi Which",
      level: 2,
      audioText: "Which catering company should we hire for the conference?",
      fullSentence: "Which catering company should we hire for the conference?",
      options: [
        { key: "A", text: "The one that offered the vegetarian options.", isCorrect: true, translation: "Bên đã đề xuất các lựa chọn món ăn chay." },
        { key: "B", text: "About one hundred participants.", isCorrect: false, translation: "Khoảng một trăm người tham gia." },
        { key: "C", text: "Yes, the food tasted delicious.", isCorrect: false, translation: "Vâng, đồ ăn có vị rất ngon." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi Which (Chúng ta nên thuê công ty tiệc nào cho hội nghị?) -> Đáp án (A) dùng đại từ thay thế 'The one' để chỉ công ty có món chay.",
      vocabRecommendation: {
        word: "catering",
        phonetic: "/ˈkeɪtərɪŋ/",
        type: "danh từ",
        meaning: "Dịch vụ nấu nướng và phục vụ tiệc sự kiện",
        example: "The catering service will provide breakfast pastries and fresh coffee."
      },
      blanks: [
        { id: "b1", word: "catering", position: 1, hint: "c" },
        { id: "b2", word: "hire", position: 5, hint: "h" }
      ]
    },

    // 7. Câu 13: Did you receive the shipment tracking number from the supplier?
    {
      id: "part2-q7",
      sentenceIndex: 7,
      part: 2,
      displayNumber: "13.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t7",
      topicTitle: "Câu hỏi Yes/No",
      level: 2,
      audioText: "Did you receive the shipment tracking number from the supplier?",
      fullSentence: "Did you receive the shipment tracking number from the supplier?",
      options: [
        { key: "A", text: "Yes, it arrived in my email this morning.", isCorrect: true, translation: "Có, nó đã được gửi vào email của tôi sáng nay." },
        { key: "B", text: "Twenty cardboard boxes in total.", isCorrect: false, translation: "Tổng cộng hai mươi thùng các-tông." },
        { key: "C", text: "To the main distribution warehouse.", isCorrect: false, translation: "Đến nhà kho phân phối chính." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi Yes/No (Bạn đã nhận được mã theo dõi lô hàng từ nhà cung cấp chưa?) -> Đáp án (A) xác nhận đã nhận qua email sáng nay.",
      vocabRecommendation: {
        word: "tracking",
        phonetic: "/ˈtrækɪŋ/",
        type: "danh từ",
        meaning: "Theo dõi hành trình vận chuyển kiện hàng",
        example: "Customers can enter the tracking number on our website to monitor delivery."
      },
      blanks: [
        { id: "b1", word: "tracking", position: 5, hint: "t" },
        { id: "b2", word: "supplier", position: 9, hint: "s" }
      ]
    },

    // 8. Câu 14: You submitted the quarterly expense report, didn't you?
    {
      id: "part2-q8",
      sentenceIndex: 8,
      part: 2,
      displayNumber: "14.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t8",
      topicTitle: "Câu hỏi đuôi (Tag Questions)",
      level: 3,
      audioText: "You submitted the quarterly expense report, didn't you?",
      fullSentence: "You submitted the quarterly expense report, didn't you?",
      options: [
        { key: "A", text: "I did that right before lunch.", isCorrect: true, translation: "Tôi đã làm việc đó ngay trước giờ ăn trưa." },
        { key: "B", text: "It was quite expensive, indeed.", isCorrect: false, translation: "Nó thực sự khá đắt đỏ." },
        { key: "C", text: "In the accounting folder.", isCorrect: false, translation: "Trong thư mục kế toán." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi đuôi (Bạn đã nộp báo cáo chi phí quý rồi phải không?) -> Đáp án (A) xác nhận hành động bằng 'I did that right before lunch.'",
      vocabRecommendation: {
        word: "quarterly",
        phonetic: "/ˈkwɔːrtərli/",
        type: "tính từ",
        meaning: "Hàng quý (3 tháng một lần)",
        example: "The finance team prepares quarterly reports for the shareholders."
      },
      blanks: [
        { id: "b1", word: "submitted", position: 1, hint: "s" },
        { id: "b2", word: "expense", position: 4, hint: "e" }
      ]
    },

    // 9. Câu 15: Would you prefer meeting on Thursday or Friday afternoon?
    {
      id: "part2-q9",
      sentenceIndex: 9,
      part: 2,
      displayNumber: "15.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t9",
      topicTitle: "Câu hỏi lựa chọn (Or Questions)",
      level: 2,
      audioText: "Would you prefer meeting on Thursday or Friday afternoon?",
      fullSentence: "Would you prefer meeting on Thursday or Friday afternoon?",
      options: [
        { key: "A", text: "Friday works much better for my schedule.", isCorrect: true, translation: "Thứ Sáu phù hợp hơn nhiều với lịch của tôi." },
        { key: "B", text: "Yes, I agree with your decision.", isCorrect: false, translation: "Vâng, tôi đồng ý với quyết định của bạn." },
        { key: "C", text: "In the second-floor conference room.", isCorrect: false, translation: "Trong phòng họp tầng hai." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu hỏi lựa chọn Or (Bạn muốn họp vào thứ Năm hay chiều thứ Sáu?) -> Đáp án (A) chọn một trong hai phương án.",
      vocabRecommendation: {
        word: "prefer",
        phonetic: "/prɪˈfɜːr/",
        type: "động từ",
        meaning: "Thích hơn, ưu tiên hơn",
        example: "Clients prefer digital invoices over printed copies."
      },
      blanks: [
        { id: "b1", word: "prefer", position: 2, hint: "p" },
        { id: "b2", word: "schedule", position: 8, hint: "s" }
      ]
    },

    // 10. Câu 16: Would you like me to proofread that contract for you?
    {
      id: "part2-q10",
      sentenceIndex: 10,
      part: 2,
      displayNumber: "16.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t10",
      topicTitle: "Lời mời & Đề nghị (Offers)",
      level: 2,
      audioText: "Would you like me to proofread that contract for you?",
      fullSentence: "Would you like me to proofread that contract for you?",
      options: [
        { key: "A", text: "That would be very helpful, thank you!", isCorrect: true, translation: "Điều đó sẽ rất hữu ích, cảm ơn bạn!" },
        { key: "B", text: "No, I haven't read the book yet.", isCorrect: false, translation: "Chưa, tôi chưa đọc cuốn sách." },
        { key: "C", text: "The print quality is sharp.", isCorrect: false, translation: "Chất lượng bản in rất nét." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Lời đề nghị giúp đỡ (Bạn có muốn tôi đọc soát lỗi bản hợp đồng đó giúp không?) -> Đáp án (A) đón nhận lịch thiệp: 'That would be very helpful, thank you!'",
      vocabRecommendation: {
        word: "proofread",
        phonetic: "/ˈpruːfriːd/",
        type: "động từ",
        meaning: "Đọc soát lỗi chính tả và ngữ pháp",
        example: "Please proofread the final proposal before sending it to the client."
      },
      blanks: [
        { id: "b1", word: "proofread", position: 5, hint: "p" },
        { id: "b2", word: "contract", position: 7, hint: "c" }
      ]
    },

    // 11. Câu 17: Don't forget to submit the revised vendor agreement today.
    {
      id: "part2-q11",
      sentenceIndex: 11,
      part: 2,
      displayNumber: "17.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t11",
      topicTitle: "Câu mệnh lệnh / Yêu cầu",
      level: 3,
      audioText: "Don't forget to submit the revised vendor agreement today.",
      fullSentence: "Don't forget to submit the revised vendor agreement today.",
      options: [
        { key: "A", text: "I've already sent it to the legal team.", isCorrect: true, translation: "Tôi đã gửi nó cho đội ngũ pháp lý rồi." },
        { key: "B", text: "About five hundred dollars per unit.", isCorrect: false, translation: "Khoảng năm trăm đô la mỗi đơn vị." },
        { key: "C", text: "Yes, I forgot my car keys.", isCorrect: false, translation: "Vâng, tôi đã quên chìa khóa xe." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Lời nhắc nhở (Đừng quên nộp hợp đồng nhà cung cấp đã sửa đổi hôm nay nhé) -> Đáp án (A) thông báo việc đã hoàn thành trước đó.",
      vocabRecommendation: {
        word: "revised",
        phonetic: "/rɪˈvaɪzd/",
        type: "tính từ",
        meaning: "Đã được chỉnh sửa, bổ sung",
        example: "Please review the revised vendor agreement before signing."
      },
      blanks: [
        { id: "b1", word: "revised", position: 5, hint: "r" },
        { id: "b2", word: "vendor", position: 6, hint: "v" }
      ]
    },

    // 12. Câu 18: The projector in conference room B is malfunctioning again.
    {
      id: "part2-q12",
      sentenceIndex: 12,
      part: 2,
      displayNumber: "18.",
      directionText: "Select the best response to the question.",
      topicId: "p2-t12",
      topicTitle: "Câu khẳng định / Trần thuật",
      level: 3,
      audioText: "The projector in conference room B is malfunctioning again.",
      fullSentence: "The projector in conference room B is malfunctioning again.",
      options: [
        { key: "A", text: "I'll call IT support right away.", isCorrect: true, translation: "Tôi sẽ gọi cho bộ phận hỗ trợ IT ngay lập tức." },
        { key: "B", text: "At three o'clock in the afternoon.", isCorrect: false, translation: "Vào lúc ba giờ chiều." },
        { key: "C", text: "A very engaging presentation.", isCorrect: false, translation: "Một bài thuyết trình rất lôi cuốn." }
      ],
      correctOption: "A",
      vietnameseTranslation: "Câu trần thuật (Máy chiếu ở phòng họp B lại bị hỏng rồi) -> Đáp án (A) đưa ra hành động khắc phục tức thì: 'Tôi sẽ gọi hỗ trợ IT ngay.'",
      vocabRecommendation: {
        word: "malfunctioning",
        phonetic: "/ˌmælˈfʌŋkʃənɪŋ/",
        type: "tính từ",
        meaning: "Bị hỏng, trục trặc kỹ thuật",
        example: "Technical support was notified that the projector is malfunctioning."
      },
      blanks: [
        { id: "b1", word: "projector", position: 1, hint: "p" },
        { id: "b2", word: "malfunctioning", position: 7, hint: "m" }
      ]
    }
  ],

  // ----------------------------------------------------------------------------
  // PART 3: ĐOẠN HỘI THOẠI (Conversations) - Chuẩn Nhóm 3 Câu (Câu 32 - 70)
  // ----------------------------------------------------------------------------
  3: [
    // 1. Nhóm câu 32 - 34: Triển lãm ghế văn phòng & Sơ đồ mặt bằng
    {
      id: "part3-q1",
      sentenceIndex: 1,
      part: 3,
      displayNumber: "32 - 34",
      groupTitle: "Nhóm câu 32 - 34 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      imageUrl: "/part3_floor_plan.jpg",
      topicId: "p3-t1",
      topicTitle: "Hội chợ & Mua sắm trang thiết bị",
      level: 1,
      audioText: "Questions 32 through 34 refer to the following conversation and floor plan. Hello, welcome to the office furniture expo. Can I help you find anything? Yes, I'm looking for ergonomic chairs for our new design studio. These executive mesh chairs are our most popular model because of their exceptional durability and lumbar support. We have tested them for thousands of hours of continuous usage. That sounds perfect. Can I get a quote for twenty units? Sure, let me contact the manufacturer directly to check bulk pricing discounts for you.",
      fullSentence: "Questions 32 through 34 refer to the following conversation and floor plan. Hello, welcome to the office furniture expo. Can I help you find anything? Yes, I'm looking for ergonomic chairs for our new design studio. These executive mesh chairs are our most popular model because of their exceptional durability and lumbar support. That sounds perfect. Can I get a quote for twenty units? Sure, let me contact the manufacturer directly to check bulk pricing discounts for you.",
      transcript: "Man: Hello, welcome to the office furniture expo. Can I help you find anything?\nWoman: Yes, I'm looking for ergonomic chairs for our new design studio.\nMan: These executive mesh chairs are our most popular model because of their exceptional durability and lumbar support. We have tested them for thousands of hours of continuous usage.\nWoman: That sounds perfect. Can I get a quote for twenty units?\nMan: Sure, let me contact the manufacturer directly to check bulk pricing discounts for you.",
      evidence: "welcome to the office furniture expo [32] | exceptional durability and lumbar support [33] | contact the manufacturer directly to check bulk pricing discounts [34]",
      vietnameseTranslation: "Người đàn ông: Xin chào, chào mừng đến với hội chợ triển lãm đồ nội thất văn phòng. Tôi có thể giúp bạn tìm gì không?\nNgười phụ nữ: Vâng, tôi đang tìm kiếm những chiếc ghế công thái học cho xưởng thiết kế mới của chúng tôi.\nNgười đàn ông: Những chiếc ghế lưới điều hành này là mẫu phổ biến nhất của chúng tôi nhờ độ bền vượt trội và hỗ trợ lưng thắt lưng. Chúng tôi đã thử nghiệm chúng qua hàng ngàn giờ sử dụng liên tục.\nNgười phụ nữ: Nghe tuyệt quá. Tôi có thể nhận báo giá cho 20 chiếc không?\nNgười đàn ông: Chắc chắn rồi, để tôi liên hệ trực tiếp với nhà sản xuất để kiểm tra mức chiết khấu giá sỉ cho bạn.",
      subQuestions: [
        {
          id: "p3-q1-32",
          questionNumber: 32,
          questionText: "Where most likely are the speakers?",
          options: [
            { key: "A", text: "At a hotel", isCorrect: false, translation: "Tại một khách sạn" },
            { key: "B", text: "At a factory", isCorrect: false, translation: "Tại một nhà máy" },
            { key: "C", text: "At a retail store", isCorrect: false, translation: "Tại một cửa hàng bán lẻ" },
            { key: "D", text: "At a trade show", isCorrect: true, translation: "Tại một triển lãm thương mại" }
          ],
          correctOption: "D",
          evidence: "welcome to the office furniture expo",
          translation: "Người nói có nhiều khả năng đang ở đâu? -> Tại một triển lãm thương mại (trade show / expo).",
          scriptQuoteEn: "Hello, welcome to the office furniture expo. Can I help you find anything?",
          scriptQuoteVi: "Xin chào, chào mừng đến với hội chợ triển lãm đồ nội thất văn phòng. Tôi có thể giúp bạn tìm gì không?",
          paraphrase: "office furniture expo = a trade show (triển lãm thương mại)."
        },
        {
          id: "p3-q1-33",
          questionNumber: 33,
          questionText: "What feature does the man emphasize about some chairs?",
          options: [
            { key: "A", text: "The color", isCorrect: false, translation: "Màu sắc" },
            { key: "B", text: "The price", isCorrect: false, translation: "Giá cả" },
            { key: "C", text: "The shape", isCorrect: false, translation: "Hình dáng" },
            { key: "D", text: "The durability", isCorrect: true, translation: "Độ bền" }
          ],
          correctOption: "D",
          evidence: "because of their exceptional durability and lumbar support",
          translation: "Người đàn ông nhấn mạnh đặc điểm gì về những chiếc ghế? -> Độ bền (durability).",
          scriptQuoteEn: "These executive mesh chairs are our most popular model because of their exceptional durability and lumbar support.",
          scriptQuoteVi: "Những chiếc ghế lưới điều hành này là mẫu phổ biến nhất của chúng tôi nhờ độ bền vượt trội và hỗ trợ lưng thắt lưng.",
          paraphrase: "exceptional durability = The durability (độ bền)."
        },
        {
          id: "p3-q1-34",
          questionNumber: 34,
          questionText: "What does the man say he will do later?",
          options: [
            { key: "A", text: "Contact a manufacturer", isCorrect: true, translation: "Liên hệ với nhà sản xuất" },
            { key: "B", text: "Review a catalogue", isCorrect: false, translation: "Xem lại danh mục sản phẩm" },
            { key: "C", text: "Send an invoice", isCorrect: false, translation: "Gửi hóa đơn" },
            { key: "D", text: "Consult with a manager", isCorrect: false, translation: "Tham khảo ý kiến người quản lý" }
          ],
          correctOption: "A",
          evidence: "let me contact the manufacturer directly to check bulk pricing discounts",
          translation: "Người đàn ông nói anh ấy sẽ làm gì sau đó? -> Liên hệ với nhà sản xuất (Contact a manufacturer).",
          scriptQuoteEn: "Sure, let me contact the manufacturer directly to check bulk pricing discounts for you.",
          scriptQuoteVi: "Chắc chắn rồi, để tôi liên hệ trực tiếp với nhà sản xuất để kiểm tra mức chiết khấu giá sỉ cho bạn.",
          paraphrase: "contact the manufacturer directly = Contact a manufacturer (liên hệ nhà sản xuất)."
        }
      ],
      vocabRecommendation: {
        word: "durability",
        phonetic: "/ˌdʊrəˈbɪləti/",
        type: "danh từ",
        meaning: "Độ bền bỉ, sức chịu đựng hao mòn tốt",
        example: "The mesh office chairs are popular due to their exceptional durability."
      },
      blanks: [
        { id: "b1", word: "furniture", position: 7, hint: "f" },
        { id: "b2", word: "ergonomic", position: 17, hint: "e" },
        { id: "b3", word: "durability", position: 28, hint: "d" }
      ]
    },

    // 2. Nhóm câu 35 - 37: Bảo trì mạng internet văn phòng & Đổi phòng họp
    {
      id: "part3-q2",
      sentenceIndex: 2,
      part: 3,
      displayNumber: "35 - 37",
      groupTitle: "Nhóm câu 35 - 37 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p3-t2",
      topicTitle: "Thiết bị kỹ thuật & Hội nghị",
      level: 2,
      audioText: "Questions 35 through 37 refer to the following conversation. Mark, do you know why the wireless internet in Building B is down? The IT department is upgrading the core routers this morning. Service should be restored by noon. Oh, I have an urgent client video conference at eleven o'clock. Can I use the conference room in Building A? Yes, that room is free until two PM. I'll reserve it for you right now.",
      fullSentence: "Mark, do you know why the wireless internet in Building B is down? The IT department is upgrading the core routers this morning. Service should be restored by noon. Can I use the conference room in Building A? Yes, that room is free until two PM. I'll reserve it for you right now.",
      transcript: "Woman: Mark, do you know why the wireless internet in Building B is down?\nMan: The IT department is upgrading the core routers this morning. Service should be restored by noon.\nWoman: Oh, I have an urgent client video conference at eleven o'clock. Can I use the conference room in Building A?\nMan: Yes, that room is free until two PM. I'll reserve it for you right now.",
      evidence: "wireless internet in Building B is down [35] | Service should be restored by noon [36] | I'll reserve it for you right now [37]",
      vietnameseTranslation: "Woman: Mark, anh có biết tại sao mạng wifi ở Tòa nhà B bị mất không?\nMan: Bộ phận IT đang nâng cấp các bộ định tuyến chính sáng nay. Dịch vụ sẽ được khôi phục vào buổi trưa.\nWoman: Ôi, tôi có cuộc họp video khẩn cấp với khách hàng lúc 11 giờ. Tôi có thể dùng phòng họp ở Tòa nhà A được không?\nMan: Vâng, phòng đó trống đến 2 giờ chiều. Tôi sẽ đặt phòng cho cô ngay bây giờ.",
      subQuestions: [
        {
          id: "p3-q2-35",
          questionNumber: 35,
          questionText: "What problem does the woman mention?",
          options: [
            { key: "A", text: "An internet outage", isCorrect: true, translation: "Mạng internet bị mất kết nối" },
            { key: "B", text: "A broken printer", isCorrect: false, translation: "Máy in bị hỏng" },
            { key: "C", text: "A delayed flight", isCorrect: false, translation: "Chuyến bay bị hoãn" },
            { key: "D", text: "A missed deadline", isCorrect: false, translation: "Bị trễ hạn chót" }
          ],
          correctOption: "A",
          evidence: "wireless internet in Building B is down",
          translation: "Người phụ nữ nhắc đến vấn đề gì? -> Mạng internet bị mất kết nối (An internet outage)."
        },
        {
          id: "p3-q2-36",
          questionNumber: 36,
          questionText: "When will the service most likely be restored?",
          options: [
            { key: "A", text: "By noon", isCorrect: true, translation: "Trước buổi trưa" },
            { key: "B", text: "Tomorrow morning", isCorrect: false, translation: "Sáng mai" },
            { key: "C", text: "Next Monday", isCorrect: false, translation: "Thứ Hai tuần tới" },
            { key: "D", text: "In twenty minutes", isCorrect: false, translation: "Trong 20 phút nữa" }
          ],
          correctOption: "A",
          evidence: "Service should be restored by noon",
          translation: "Dịch vụ sẽ được khôi phục khi nào? -> Trước buổi trưa (By noon)."
        },
        {
          id: "p3-q2-37",
          questionNumber: 37,
          questionText: "What will the man do for the woman?",
          options: [
            { key: "A", text: "Reserve a conference room", isCorrect: true, translation: "Đặt phòng hội nghị" },
            { key: "B", text: "Fix her computer", isCorrect: false, translation: "Sửa máy tính của cô ấy" },
            { key: "C", text: "Call her client", isCorrect: false, translation: "Gọi cho khách hàng của cô ấy" },
            { key: "D", text: "Order new cables", isCorrect: false, translation: "Đặt mua dây cáp mới" }
          ],
          correctOption: "A",
          evidence: "I'll reserve it for you right now",
          translation: "Người đàn ông sẽ làm gì giúp người phụ nữ? -> Đặt phòng họp (Reserve a conference room)."
        }
      ],
      vocabRecommendation: {
        word: "restore",
        phonetic: "/rɪˈstɔːr/",
        type: "động từ",
        meaning: "Khôi phục lại trạng thái bình thường",
        example: "Technicians worked swiftly to restore network connectivity."
      },
      blanks: [
        { id: "b1", word: "wireless", position: 7, hint: "w" },
        { id: "b2", word: "upgrading", position: 17, hint: "u" },
        { id: "b3", word: "reserve", position: 47, hint: "r" }
      ]
    },

    // 3. Nhóm câu 38 - 40: Tiếp nhận phỏng vấn ứng viên tuyển dụng
    {
      id: "part3-q3",
      sentenceIndex: 3,
      part: 3,
      displayNumber: "38 - 40",
      groupTitle: "Nhóm câu 38 - 40 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p3-t3",
      topicTitle: "Tuyển dụng & Phỏng vấn",
      level: 3,
      audioText: "Questions 38 through 40 refer to the following conversation. Hi Sarah, has the candidate for the senior accounting position arrived yet? Yes, Mr. Jenkins is waiting in the reception lounge. I reviewed his portfolio, and his experience with international taxation is very impressive. Excellent. Let's bring him into Interview Room 3 and begin right away.",
      fullSentence: "Has the candidate for the senior accounting position arrived yet? Yes, Mr. Jenkins is waiting in the reception lounge. His experience with international taxation is very impressive. Let's bring him into Interview Room 3 and begin right away.",
      transcript: "Man: Hi Sarah, has the candidate for the senior accounting position arrived yet?\nWoman: Yes, Mr. Jenkins is waiting in the reception lounge. I reviewed his portfolio, and his experience with international taxation is very impressive.\nMan: Excellent. Let's bring him into Interview Room 3 and begin right away.",
      evidence: "candidate for the senior accounting position [38] | experience with international taxation is very impressive [39] | bring him into Interview Room 3 [40]",
      vietnameseTranslation: "Man: Chào Sarah, ứng viên cho vị trí kế toán cấp cao đã đến chưa?\nWoman: Vâng, anh Jenkins đang đợi ở sảnh tiếp tân. Tôi đã xem qua hồ sơ của anh ấy, và kinh nghiệm về thuế quốc tế của anh ấy rất ấn tượng.\nMan: Tuyệt vời. Chúng ta hãy mời anh ấy vào Phòng phỏng vấn số 3 và bắt đầu ngay thôi.",
      subQuestions: [
        {
          id: "p3-q3-38",
          questionNumber: 38,
          questionText: "What job is the candidate applying for?",
          options: [
            { key: "A", text: "Senior accountant", isCorrect: true, translation: "Kế toán cấp cao" },
            { key: "B", text: "Marketing director", isCorrect: false, translation: "Giám đốc tiếp thị" },
            { key: "C", text: "Human resources officer", isCorrect: false, translation: "Chuyên viên nhân sự" },
            { key: "D", text: "Software developer", isCorrect: false, translation: "Lập trình viên phần mềm" }
          ],
          correctOption: "A",
          evidence: "candidate for the senior accounting position",
          translation: "Ứng viên đang nộp đơn cho vị trí nào? -> Kế toán cao cấp (Senior accountant)."
        },
        {
          id: "p3-q3-39",
          questionNumber: 39,
          questionText: "What aspect of the candidate's resume is praised?",
          options: [
            { key: "A", text: "Academic degrees", isCorrect: false, translation: "Bằng cấp học thuật" },
            { key: "B", text: "International tax experience", isCorrect: true, translation: "Kinh nghiệm thuế quốc tế" },
            { key: "C", text: "Foreign language skills", isCorrect: false, translation: "Kỹ năng ngoại ngữ" },
            { key: "D", text: "Recommendations from past managers", isCorrect: false, translation: "Thư giới thiệu từ quản lý cũ" }
          ],
          correctOption: "B",
          evidence: "experience with international taxation is very impressive",
          translation: "Đặc điểm nào trong hồ sơ của ứng viên được khen ngợi? -> Kinh nghiệm thuế quốc tế."
        },
        {
          id: "p3-q3-40",
          questionNumber: 40,
          questionText: "Where will the interview take place?",
          options: [
            { key: "A", text: "In the cafeteria", isCorrect: false, translation: "Tại căng tin" },
            { key: "B", text: "In Room 3", isCorrect: true, translation: "Tại Phòng 3" },
            { key: "C", text: "At an outside cafe", isCorrect: false, translation: "Tại quán cà phê ngoài trời" },
            { key: "D", text: "In the executive boardroom", isCorrect: false, translation: "Tại phòng họp ban điều hành" }
          ],
          correctOption: "B",
          evidence: "bring him into Interview Room 3",
          translation: "Cuộc phỏng vấn sẽ diễn ra ở đâu? -> Tại phòng 3 (In Room 3)."
        }
      ],
      vocabRecommendation: {
        word: "candidate",
        phonetic: "/ˈkændɪdeɪt/",
        type: "danh từ",
        meaning: "Ứng viên xin việc, người dự tuyển",
        example: "The hiring panel interviewed four qualified candidates this morning."
      },
      blanks: [
        { id: "b1", word: "candidate", position: 5, hint: "c" },
        { id: "b2", word: "accounting", position: 9, hint: "a" }
      ]
    },

    // 4. Nhóm câu 41 - 43: Vận chuyển hàng hóa & Hạn giao hàng
    {
      id: "part3-q4",
      sentenceIndex: 4,
      part: 3,
      displayNumber: "41 - 43",
      groupTitle: "Nhóm câu 41 - 43 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p3-t4",
      topicTitle: "Giao vận & Kho bãi",
      level: 4,
      audioText: "Questions 41 through 43 refer to the following conversation. Hello David, the client from Tokyo requested expedited shipping for the medical equipment order. Can our warehouse dispatch the crates today? If we finish packing before three PM, the courier can pick them up for overnight air freight. Great, I will notify the packing team immediately.",
      fullSentence: "The client from Tokyo requested expedited shipping for the medical equipment order. Can our warehouse dispatch the crates today? If we finish packing before three PM, the courier can pick them up for overnight air freight.",
      transcript: "Woman: Hello David, the client from Tokyo requested expedited shipping for the medical equipment order. Can our warehouse dispatch the crates today?\nMan: If we finish packing before three PM, the courier can pick them up for overnight air freight.\nWoman: Great, I will notify the packing team immediately.",
      evidence: "requested expedited shipping [41] | overnight air freight [42] | notify the packing team immediately [43]",
      vietnameseTranslation: "Woman: Xin chào David, khách hàng từ Tokyo yêu cầu giao hàng hỏa tốc cho đơn hàng thiết bị y tế. Kho của chúng ta có thể xuất các kiện hàng hôm nay không?\nMan: Nếu chúng ta đóng gói xong trước 3 giờ chiều, hãng chuyển phát có thể đến nhận hàng để chuyển phát hàng không qua đêm.\nWoman: Tuyệt vời, tôi sẽ thông báo cho đội đóng gói ngay lập tức.",
      subQuestions: [
        {
          id: "p3-q4-41",
          questionNumber: 41,
          questionText: "What did the client request?",
          options: [
            { key: "A", text: "A price discount", isCorrect: false, translation: "Giảm giá sản phẩm" },
            { key: "B", text: "Expedited shipping", isCorrect: true, translation: "Giao hàng hỏa tốc" },
            { key: "C", text: "A product refund", isCorrect: false, translation: "Hoàn tiền sản phẩm" },
            { key: "D", text: "Additional spare parts", isCorrect: false, translation: "Phụ tùng thay thế bổ sung" }
          ],
          correctOption: "B",
          evidence: "requested expedited shipping",
          translation: "Khách hàng đã yêu cầu điều gì? -> Vận chuyển nhanh/hỏa tốc (Expedited shipping)."
        },
        {
          id: "p3-q4-42",
          questionNumber: 42,
          questionText: "How will the order be transported?",
          options: [
            { key: "A", text: "By air freight", isCorrect: true, translation: "Đường hàng không" },
            { key: "B", text: "By cargo ship", isCorrect: false, translation: "Tàu chở hàng" },
            { key: "C", text: "By railway", isCorrect: false, translation: "Đường sắt" },
            { key: "D", text: "By local delivery truck", isCorrect: false, translation: "Xe tải giao hàng địa phương" }
          ],
          correctOption: "A",
          evidence: "overnight air freight",
          translation: "Đơn hàng sẽ được vận chuyển bằng phương thức nào? -> Hàng không (By air freight)."
        },
        {
          id: "p3-q4-43",
          questionNumber: 43,
          questionText: "What will the woman do next?",
          options: [
            { key: "A", text: "Contact the packing team", isCorrect: true, translation: "Liên hệ đội đóng gói" },
            { key: "B", text: "Issue an invoice", isCorrect: false, translation: "Xuất hóa đơn" },
            { key: "C", text: "Book an airline ticket", isCorrect: false, translation: "Đặt vé máy bay" },
            { key: "D", text: "Consult with a supplier", isCorrect: false, translation: "Tham khảo ý kiến nhà cung cấp" }
          ],
          correctOption: "A",
          evidence: "notify the packing team immediately",
          translation: "Người phụ nữ sẽ làm gì tiếp theo? -> Báo cho đội đóng gói (Contact the packing team)."
        }
      ],
      vocabRecommendation: {
        word: "expedited",
        phonetic: "/ˈekspədaɪtɪd/",
        type: "tính từ",
        meaning: "Được đẩy nhanh tốc độ, giao hàng hỏa tốc",
        example: "The customer paid an extra fee for expedited postal delivery."
      },
      blanks: [
        { id: "b1", word: "expedited", position: 8, hint: "e" },
        { id: "b2", word: "dispatch", position: 17, hint: "d" }
      ]
    },

    // 5. Nhóm câu 59 - 61: Cuộc họp đổi mới sản phẩm snack bar & Thiết bị sản xuất (Chuẩn 100% Ảnh 2 & 3)
    {
      id: "part3-q5",
      sentenceIndex: 5,
      part: 3,
      displayNumber: "59 - 61",
      groupTitle: "Nhóm câu 59 - 61 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p3-t1",
      topicTitle: "Đổi mới sản phẩm & Nhà xưởng",
      level: 2,
      audioText: "Questions 59 through 61 refer to the following conversation. Let's get this product-innovation meeting started. Sales of our fruit-and-nut bars have been strong, so we'd like to develop some other types of snack bars. What do you recommend, Stan? Well, we know that many people are allergic to nuts, so we should develop some snack bars without nuts. The only thing is, we'd need a separate set of equipment to avoid contamination between the two production areas. We don't have room at this facility for that. Pedro, you've been to our new production facility in Glenview, right? Is there space there for new equipment? I think there's extra space there. I'll check with the facility manager to make sure, though.",
      fullSentence: "Sales of our fruit-and-nut bars have been strong, so we'd like to develop some other types of snack bars. The only thing is, we'd need a separate set of equipment to avoid contamination between the two production areas. I'll check with the facility manager to make sure, though.",
      transcript: "W-Am: Let's get this product-innovation meeting started.\nSales of our fruit-and-nut bars have been strong, so we'd like to develop some other types of snack bars.\nWhat do you recommend, Stan?\nM-Cn: Well, we know that many people are allergic to nuts, so we should develop some snack bars without nuts.\nThe only thing is, we'd need a separate set of equipment to avoid contamination between the two production areas.\nW-Am: We don't have room at this facility for that.\nPedro, you've been to our new production facility in Glenview, right?\nIs there space there for new equipment?\nM-Au: I think there's extra space there.\nI'll check with the facility manager to make sure, though.",
      evidence: "Sales of our fruit-and-nut bars have been strong, so we'd like to develop some other types of snack bars [59] | The only thing is, we'd need a separate set of equipment to avoid contamination between the two production areas [60] | I'll check with the facility manager to make sure, though [61]",
      vietnameseTranslation: "W-Am: Hãy bắt đầu cuộc họp đổi mới sản phẩm này nào.\nDoanh số bán các thanh ngũ cốc hoa quả và hạt của chúng ta rất tốt, vì vậy chúng tôi muốn phát triển một số loại thanh ăn nhẹ khác.\nAnh Stan, anh đề xuất gì?\nM-Cn: Chà, chúng tôi biết rằng nhiều người bị dị ứng với các loại hạt, vì vậy chúng ta nên phát triển một số loại thanh ăn nhẹ không có hạt.\nVấn đề duy nhất là chúng ta sẽ cần một bộ thiết bị riêng biệt để tránh lây nhiễm chéo giữa hai khu vực sản xuất.\nW-Am: Chúng ta không có đủ chỗ tại cơ sở này cho việc đó.\nPedro, anh đã đến cơ sở sản xuất mới của chúng ta ở Glenview rồi phải không?\nCó chỗ nào ở đó cho thiết bị mới không?\nM-Au: Tôi nghĩ có thêm không gian ở đó.\nTuy nhiên, tôi sẽ hỏi quản lý cơ sở để chắc chắn.",
      subQuestions: [
        {
          id: "p3-q5-59",
          questionNumber: 59,
          questionText: "What are the speakers discussing?",
          options: [
            { key: "A", text: "Proposing a business merger", isCorrect: false, translation: "Đề xuất sáp nhập doanh nghiệp" },
            { key: "B", text: "Relocating a company's headquarters", isCorrect: false, translation: "Di dời trụ sở công ty" },
            { key: "C", text: "Developing additional products", isCorrect: true, translation: "Phát triển thêm sản phẩm" },
            { key: "D", text: "Hiring more employees", isCorrect: false, translation: "Tuyển thêm nhân viên" }
          ],
          correctOption: "C",
          evidence: "Sales of our fruit-and-nut bars have been strong, so we'd like to develop some other types of snack bars",
          translation: "Những người nói đang thảo luận về điều gì? -> Phát triển thêm sản phẩm mới (Developing additional products)."
        },
        {
          id: "p3-q5-60",
          questionNumber: 60,
          questionText: "What problem do the speakers discuss?",
          options: [
            { key: "A", text: "High ingredient costs", isCorrect: false, translation: "Chi phí nguyên liệu cao" },
            { key: "B", text: "Limited production space", isCorrect: true, translation: "Không gian sản xuất bị hạn chế" },
            { key: "C", text: "Delayed shipment of parts", isCorrect: false, translation: "Chậm trễ giao phụ tùng" },
            { key: "D", text: "Low consumer demand", isCorrect: false, translation: "Nhu cầu tiêu dùng thấp" }
          ],
          correctOption: "B",
          evidence: "The only thing is, we'd need a separate set of equipment to avoid contamination between the two production areas",
          translation: "Vấn đề nào được người nói thảo luận? -> Cần bộ thiết bị riêng và thiếu chỗ (Limited space/equipment)."
        },
        {
          id: "p3-q5-61",
          questionNumber: 61,
          questionText: "What will the man do next?",
          options: [
            { key: "A", text: "Speak with a facility manager", isCorrect: true, translation: "Nói chuyện với người quản lý cơ sở" },
            { key: "B", text: "Submit an expense report", isCorrect: false, translation: "Nộp báo cáo chi phí" },
            { key: "C", text: "Cancel an upcoming meeting", isCorrect: false, translation: "Hủy cuộc họp sắp tới" },
            { key: "D", text: "Sample some snacks", isCorrect: false, translation: "Dùng thử một số món ăn nhẹ" }
          ],
          correctOption: "A",
          evidence: "I'll check with the facility manager to make sure, though",
          translation: "Người đàn ông sẽ làm gì tiếp theo? -> Hỏi quản lý cơ sở để chắc chắn (Speak with a facility manager)."
        }
      ],
      vocabRecommendation: {
        word: "contamination",
        phonetic: "/kənˌtæmɪˈneɪʃn/",
        type: "danh từ",
        meaning: "Sự làm bẩn, sự nhiễm bẩn, lây nhiễm chéo",
        example: "A separate set of equipment was required to avoid allergen contamination."
      },
      blanks: [
        { id: "b1", word: "innovation", position: 5, hint: "i" },
        { id: "b2", word: "contamination", position: 28, hint: "c" },
        { id: "b3", word: "facility", position: 40, hint: "f" }
      ]
    },

    // 6. Nhóm câu 50 - 52: Kế hoạch dã ngoại & Hội thảo công ty (Khớp 100% Ảnh mẫu người dùng gửi)
    {
      id: "part3-q6",
      sentenceIndex: 6,
      part: 3,
      displayNumber: "50 - 52",
      groupTitle: "Nhóm câu 50 - 52 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p3-t2",
      topicTitle: "Kế hoạch sự kiện & Hội thảo",
      level: 3,
      audioText: "Questions 50 through 52 refer to the following conversation. Let's discuss the upcoming retreat for the architects at our firm. We need to decide on the schedule and workshops. Yes, they're even offering a wildlife photography workshop on the second day. I'm excited about that. That sounds wonderful. Let me reserve the conference room and verify the attendance numbers.",
      fullSentence: "Let's discuss the upcoming retreat for the architects at our firm. Yes, they're even offering a wildlife photography workshop on the second day. I'm excited about that. Let me reserve the conference room and verify the attendance numbers.",
      transcript: "Man: Let's discuss the upcoming retreat for the architects at our firm.\nWoman: Yes, they're even offering a wildlife photography workshop on the second day. I'm excited about that.\nMan: That sounds wonderful. Let me reserve the conference room and verify the attendance numbers.",
      evidence: "upcoming retreat for the architects at our firm [50] | wildlife photography workshop on the second day [51] | reserve the conference room [52]",
      vietnameseTranslation: "Man: Hãy cùng thảo luận về buổi dã ngoại sắp tới cho các kiến trúc sư tại công ty chúng ta.\nWoman: Vâng, họ thậm chí còn tổ chức một buổi hội thảo nhiếp ảnh động vật hoang dã vào ngày thứ hai. Tôi rất hào hứng về điều đó.\nMan: Nghe thật tuyệt vời. Để tôi đặt phòng hội nghị và kiểm tra lại số lượng người tham dự.",
      subQuestions: [
        {
          id: "p3-q6-50",
          questionNumber: 50,
          questionText: "What are the speakers planning?",
          options: [
            { key: "A", text: "A company retreat", isCorrect: true, translation: "Một chuyến nghỉ dưỡng công ty" },
            { key: "B", text: "An industry conference", isCorrect: false, translation: "Một hội nghị ngành" },
            { key: "C", text: "A retirement party", isCorrect: false, translation: "Một tiệc nghỉ hưu" },
            { key: "D", text: "A grand opening celebration", isCorrect: false, translation: "Một lễ khai trương" }
          ],
          correctOption: "A",
          evidence: "upcoming retreat for the architects at our firm",
          translation: "Những người nói đang lên kế hoạch gì? -> Một chuyến nghỉ dưỡng công ty",
          scriptQuoteEn: "Let's discuss the upcoming retreat for the architects at our firm.",
          scriptQuoteVi: "Hãy cùng thảo luận về buổi dã ngoại sắp tới cho các kiến trúc sư tại công ty chúng ta.",
          paraphrase: "upcoming retreat (buổi dã ngoại sắp tới) = company retreat (buổi dã ngoại của công ty)."
        },
        {
          id: "p3-q6-51",
          questionNumber: 51,
          questionText: "What are the women excited about?",
          options: [
            { key: "A", text: "Traveling to a new city", isCorrect: false, translation: "Đến một thành phố mới" },
            { key: "B", text: "Giving a product demonstration", isCorrect: false, translation: "Trình diễn sản phẩm" },
            { key: "C", text: "Meeting a guest speaker", isCorrect: false, translation: "Gặp một diễn giả khách mời" },
            { key: "D", text: "Attending a workshop", isCorrect: true, translation: "Tham dự một hội thảo" }
          ],
          correctOption: "D",
          evidence: "wildlife photography workshop on the second day",
          translation: "Những người phụ nữ hào hứng về điều gì? -> Tham dự một hội thảo",
          scriptQuoteEn: "Yes, they're even offering a wildlife photography workshop on the second day. I'm excited about that.",
          scriptQuoteVi: "Vâng, họ thậm chí còn tổ chức một buổi hội thảo nhiếp ảnh động vật hoang dã vào ngày thứ hai. Tôi rất hào hứng về điều đó.",
          paraphrase: "wildlife photography workshop (hội thảo nhiếp ảnh động vật hoang dã) = a workshop (một buổi hội thảo)."
        },
        {
          id: "p3-q6-52",
          questionNumber: 52,
          questionText: "What will the man do next?",
          options: [
            { key: "A", text: "Reserve a conference room", isCorrect: true, translation: "Đặt phòng hội nghị" },
            { key: "B", text: "Contact an airline", isCorrect: false, translation: "Liên hệ hãng hàng không" },
            { key: "C", text: "Print event schedules", isCorrect: false, translation: "In lịch trình sự kiện" },
            { key: "D", text: "Order catering supplies", isCorrect: false, translation: "Đặt đồ ăn thức uống" }
          ],
          correctOption: "A",
          evidence: "reserve the conference room",
          translation: "Người đàn ông sẽ làm gì tiếp theo? -> Đặt phòng hội nghị",
          scriptQuoteEn: "Let me reserve the conference room and verify the attendance numbers.",
          scriptQuoteVi: "Để tôi đặt phòng hội nghị và kiểm tra lại số lượng người tham dự.",
          paraphrase: "reserve the conference room (đặt phòng hội nghị) = Reserve a conference room."
        }
      ],
      vocabRecommendation: {
        word: "retreat",
        phonetic: "/rɪˈtriːt/",
        type: "danh từ",
        meaning: "Chuyến nghỉ dưỡng dã ngoại tập thể công ty",
        example: "The firm organized an annual retreat to foster team collaboration."
      },
      blanks: [
        { id: "b1", word: "retreat", position: 5, hint: "r" },
        { id: "b2", word: "workshop", position: 15, hint: "w" }
      ]
    }
  ],

  // ----------------------------------------------------------------------------
  // PART 4: BÀI NÓI CHUYỆN NGẮN (Short Talks) - Chuẩn Nhóm 3 Câu ETS TOEIC
  // ----------------------------------------------------------------------------
  4: [
    // 1. Nhóm câu 71 - 73: Tin nhắn thoại tiệm sửa chữa ô tô (Apex Automotive Repairs)
    {
      id: "part4-q1",
      sentenceIndex: 1,
      part: 4,
      displayNumber: "71 - 73",
      groupTitle: "Nhóm câu 71 - 73 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p4-t1",
      topicTitle: "Tin nhắn thoại & Dịch vụ ô tô",
      level: 1,
      audioText: "Questions 71 through 73 refer to the following telephone message. Good morning, Mr. Alvarez. This is Brenda calling from Apex Automotive Repairs. I'm calling regarding your vehicle inspection. We replaced the brake pads and the oil filter as requested. However, our technician noticed that your battery is losing charge and recommends replacing it before winter. Please call us back at 555-0192 to confirm if you want us to proceed with the battery replacement today. Thank you.",
      fullSentence: "This is Brenda calling from Apex Automotive Repairs regarding your vehicle inspection. We replaced the brake pads and the oil filter as requested. However, our technician noticed that your battery is losing charge and recommends replacing it before winter. Please call us back to confirm.",
      transcript: "Good morning, Mr. Alvarez. This is Brenda calling from Apex Automotive Repairs.\nI'm calling regarding your vehicle inspection. We replaced the brake pads and the oil filter as requested.\nHowever, our technician noticed that your battery is losing charge and recommends replacing it before winter.\nPlease call us back at 555-0192 to confirm if you want us to proceed with the battery replacement today. Thank you.",
      evidence: "Brenda calling from Apex Automotive Repairs [71] | your battery is losing charge [72] | call us back to confirm if you want us to proceed with the battery replacement [73]",
      vietnameseTranslation: "Chào buổi sáng ông Alvarez. Tôi là Brenda gọi từ tiệm sửa chữa ô tô Apex.\nTôi gọi về việc kiểm tra xe của ông. Chúng tôi đã thay má phanh và bộ lọc dầu theo yêu cầu.\nTuy nhiên, kỹ thuật viên nhận thấy bình ắc quy sắp hết điện và khuyên nên thay trước mùa đông.\nVui lòng gọi lại số 555-0192 để xác nhận nếu ông muốn chúng tôi tiến hành thay thế ắc quy hôm nay. Cảm ơn ông.",
      subQuestions: [
        {
          id: "p4-q1-71",
          questionNumber: 71,
          questionText: "Where does the speaker most likely work?",
          options: [
            { key: "A", text: "At an auto repair shop", isCorrect: true, translation: "Tại xưởng sửa xe ô tô" },
            { key: "B", text: "At an insurance agency", isCorrect: false, translation: "Tại công ty bảo hiểm" },
            { key: "C", text: "At a car rental agency", isCorrect: false, translation: "Tại điểm cho thuê xe" },
            { key: "D", text: "At a gas station", isCorrect: false, translation: "Tại trạm xăng" }
          ],
          correctOption: "A",
          evidence: "calling from Apex Automotive Repairs",
          translation: "Người nói có nhiều khả năng làm việc ở đâu? -> Tại một xưởng sửa xe ô tô (At an auto repair shop).",
          scriptQuoteEn: "Good morning, Mr. Alvarez. This is Brenda calling from Apex Automotive Repairs.",
          scriptQuoteVi: "Chào buổi sáng ông Alvarez. Tôi là Brenda gọi từ tiệm sửa chữa ô tô Apex.",
          paraphrase: "Apex Automotive Repairs (tiệm sửa xe ô tô Apex) = an auto repair shop (xưởng sửa xe ô tô)."
        },
        {
          id: "p4-q1-72",
          questionNumber: 72,
          questionText: "What problem was identified during the vehicle inspection?",
          options: [
            { key: "A", text: "A weak battery", isCorrect: true, translation: "Bình ắc quy bị yếu" },
            { key: "B", text: "A flat tire", isCorrect: false, translation: "Lốp xe bị xẹp" },
            { key: "C", text: "A cracked windshield", isCorrect: false, translation: "Kính chắn gió bị nứt" },
            { key: "D", text: "A faulty transmission", isCorrect: false, translation: "Hộp số bị lỗi" }
          ],
          correctOption: "A",
          evidence: "your battery is losing charge and recommends replacing it",
          translation: "Vấn đề gì được phát hiện trong quá trình kiểm tra xe? -> Bình ắc quy bị yếu (A weak battery).",
          scriptQuoteEn: "However, our technician noticed that your battery is losing charge and recommends replacing it before winter.",
          scriptQuoteVi: "Tuy nhiên, kỹ thuật viên nhận thấy bình ắc quy sắp hết điện và khuyên nên thay trước mùa đông.",
          paraphrase: "battery is losing charge (ắc quy sắp hết điện) = A weak battery (bình ắc quy bị yếu)."
        },
        {
          id: "p4-q1-73",
          questionNumber: 73,
          questionText: "Why is the listener asked to call back?",
          options: [
            { key: "A", text: "To authorize an additional service", isCorrect: true, translation: "Để phê duyệt dịch vụ bổ sung" },
            { key: "B", text: "To pay an outstanding balance", isCorrect: false, translation: "Để thanh toán số dư còn nợ" },
            { key: "C", text: "To schedule a pickup appointment", isCorrect: false, translation: "Để hẹn lịch lấy xe" },
            { key: "D", text: "To provide insurance details", isCorrect: false, translation: "Để cung cấp thông tin bảo hiểm" }
          ],
          correctOption: "A",
          evidence: "confirm if you want us to proceed with the battery replacement",
          translation: "Tại sao người nghe được yêu cầu gọi lại? -> Để phê duyệt dịch vụ bổ sung (thay ắc quy).",
          scriptQuoteEn: "Please call us back at 555-0192 to confirm if you want us to proceed with the battery replacement today.",
          scriptQuoteVi: "Vui lòng gọi lại số 555-0192 để xác nhận nếu ông muốn chúng tôi tiến hành thay thế ắc quy hôm nay.",
          paraphrase: "confirm if you want us to proceed with the battery replacement = To authorize an additional service (phê duyệt dịch vụ bổ sung)."
        }
      ],
      vocabRecommendation: {
        word: "inspection",
        phonetic: "/ɪnˈspekʃn/",
        type: "danh từ",
        meaning: "Sự kiểm tra kỹ thuật, đợt thanh tra giám định",
        example: "The annual vehicle safety inspection is required by state regulations."
      },
      blanks: [
        { id: "b1", word: "Automotive", position: 7, hint: "A" },
        { id: "b2", word: "inspection", position: 13, hint: "i" },
        { id: "b3", word: "battery", position: 31, hint: "b" }
      ]
    },

    // 2. Nhóm câu 74 - 76: Thông báo hoãn chuyến bay tại sân bay (Airport Announcement)
    {
      id: "part4-q2",
      sentenceIndex: 2,
      part: 4,
      displayNumber: "74 - 76",
      groupTitle: "Nhóm câu 74 - 76 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p4-t2",
      topicTitle: "Thông báo sân bay công cộng",
      level: 2,
      audioText: "Questions 74 through 76 refer to the following announcement. Attention all passengers on flight KL 284 to Vancouver. Due to adverse weather conditions over the Rocky Mountains, our departure will be delayed by approximately forty-five minutes. Please remain in the gate area. Complimentary beverages and snacks are being served at counter 12. We apologize for the inconvenience and will provide another update as soon as the flight crew receives clearance.",
      fullSentence: "Due to adverse weather conditions over the Rocky Mountains, our departure will be delayed by approximately forty-five minutes. Please remain in the gate area. Complimentary beverages and snacks are being served at counter 12.",
      transcript: "Attention all passengers on flight KL 284 to Vancouver.\nDue to adverse weather conditions over the Rocky Mountains, our departure will be delayed by approximately forty-five minutes.\nPlease remain in the gate area. Complimentary beverages and snacks are being served at counter 12.\nWe apologize for the inconvenience and will provide another update as soon as the flight crew receives clearance.",
      evidence: "our departure will be delayed by approximately forty-five minutes [74] | Due to adverse weather conditions [75] | Complimentary beverages and snacks are being served at counter 12 [76]",
      vietnameseTranslation: "Xin chú ý tất cả hành khách trên chuyến bay KL 284 đi Vancouver.\nDo điều kiện thời tiết bất lợi trên dãy núi Rocky, giờ khởi hành của chúng ta sẽ bị hoãn khoảng 45 phút.\nXin vui lòng ở lại khu vực cổng chờ. Đồ uống và đồ ăn nhẹ miễn phí đang được phục vụ tại quầy số 12.\nChúng tôi xin lỗi vì sự bất tiện này.",
      subQuestions: [
        {
          id: "p4-q2-74",
          questionNumber: 74,
          questionText: "What is the announcement mainly about?",
          options: [
            { key: "A", text: "A flight delay", isCorrect: true, translation: "Chuyến bay bị hoãn" },
            { key: "B", text: "A gate relocation", isCorrect: false, translation: "Đổi cổng ra máy bay" },
            { key: "C", text: "A baggage restriction", isCorrect: false, translation: "Giới hạn hành lý" },
            { key: "D", text: "A ticket upgrade", isCorrect: false, translation: "Nâng hạng vé" }
          ],
          correctOption: "A",
          evidence: "our departure will be delayed by approximately forty-five minutes",
          translation: "Thông báo chủ yếu về điều gì? -> Chuyến bay bị hoãn (A flight delay).",
          scriptQuoteEn: "Due to adverse weather conditions over the Rocky Mountains, our departure will be delayed by approximately forty-five minutes.",
          scriptQuoteVi: "Do điều kiện thời tiết bất lợi trên dãy núi Rocky, giờ khởi hành của chúng ta sẽ bị hoãn khoảng 45 phút.",
          paraphrase: "departure will be delayed = A flight delay (chuyến bay bị hoãn)."
        },
        {
          id: "p4-q2-75",
          questionNumber: 75,
          questionText: "What caused the delay?",
          options: [
            { key: "A", text: "Severe weather", isCorrect: true, translation: "Thời tiết khắc nghiệt" },
            { key: "B", text: "Mechanical trouble", isCorrect: false, translation: "Sự cố cơ khí" },
            { key: "C", text: "Crew shortages", isCorrect: false, translation: "Thiếu phi hành đoàn" },
            { key: "D", text: "Air traffic congestion", isCorrect: false, translation: "Tắc nghẽn không lưu" }
          ],
          correctOption: "A",
          evidence: "Due to adverse weather conditions",
          translation: "Nguyên nhân gây hoãn chuyến bay là gì? -> Thời tiết xấu (Severe weather).",
          scriptQuoteEn: "Due to adverse weather conditions over the Rocky Mountains, our departure will be delayed by approximately forty-five minutes.",
          scriptQuoteVi: "Do điều kiện thời tiết bất lợi trên dãy núi Rocky, giờ khởi hành của chúng ta sẽ bị hoãn khoảng 45 phút.",
          paraphrase: "adverse weather conditions = Severe weather (thời tiết khắc nghiệt)."
        },
        {
          id: "p4-q2-76",
          questionNumber: 76,
          questionText: "What are passengers invited to do?",
          options: [
            { key: "A", text: "Enjoy free refreshments", isCorrect: true, translation: "Thưởng thức đồ ăn nhẹ miễn phí" },
            { key: "B", text: "Board the aircraft", isCorrect: false, translation: "Lên máy bay" },
            { key: "C", text: "Check their passports", isCorrect: false, translation: "Kiểm tra hộ chiếu" },
            { key: "D", text: "Speak to customs officers", isCorrect: false, translation: "Nói chuyện với hải quan" }
          ],
          correctOption: "A",
          evidence: "Complimentary beverages and snacks are being served at counter 12",
          translation: "Hành khách được mời làm gì? -> Dùng đồ ăn thức uống miễn phí (Enjoy free refreshments).",
          scriptQuoteEn: "Complimentary beverages and snacks are being served at counter 12.",
          scriptQuoteVi: "Đồ uống và đồ ăn nhẹ miễn phí đang được phục vụ tại quầy số 12.",
          paraphrase: "Complimentary beverages and snacks = Enjoy free refreshments (thưởng thức đồ ăn nhẹ miễn phí)."
        }
      ],
      vocabRecommendation: {
        word: "complimentary",
        phonetic: "/ˌkɑːmplɪˈmentri/",
        type: "tính từ",
        meaning: "Miễn phí, đồ biếu tặng kèm theo dịch vụ",
        example: "The airline provided complimentary food vouchers during the layover."
      },
      blanks: [
        { id: "b1", word: "departure", position: 17, hint: "d" },
        { id: "b2", word: "delayed", position: 20, hint: "d" },
        { id: "b3", word: "Complimentary", position: 31, hint: "C" }
      ]
    },

    // 3. Nhóm câu 77 - 79: Diễn thuyết chào mừng diễn giả danh dự
    {
      id: "part4-q3",
      sentenceIndex: 3,
      part: 4,
      displayNumber: "77 - 79",
      groupTitle: "Nhóm câu 77 - 79 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p4-t3",
      topicTitle: "Diễn thuyết & Khách mời danh dự",
      level: 3,
      audioText: "Questions 77 through 79 refer to the following introduction. Good evening, members and distinguished guests. Tonight, it is my absolute pleasure to introduce Dr. Evelyn Hayes, chief research scientist at BioTech Innovations. Over the past decade, Dr. Hayes has led groundbreaking research in renewable energy storage. Following her presentation, she will take questions from the audience and sign copies of her newly published book in the lobby. Please give a warm round of applause for Dr. Hayes.",
      fullSentence: "Tonight, it is my absolute pleasure to introduce Dr. Evelyn Hayes. Over the past decade, Dr. Hayes has led groundbreaking research in renewable energy storage. Following her presentation, she will sign copies of her newly published book in the lobby.",
      transcript: "Good evening, members and distinguished guests. Tonight, it is my absolute pleasure to introduce Dr. Evelyn Hayes, chief research scientist at BioTech Innovations. Over the past decade, Dr. Hayes has led groundbreaking research in renewable energy storage. Following her presentation, she will take questions from the audience and sign copies of her newly published book in the lobby. Please give a warm round of applause for Dr. Hayes.",
      evidence: "introduce Dr. Evelyn Hayes [77] | groundbreaking research in renewable energy storage [78] | sign copies of her newly published book in the lobby [79]",
      vietnameseTranslation: "Lời giới thiệu diễn giả chính (Tiến sĩ Evelyn Hayes), nhà khoa học nghiên cứu tại BioTech Innovations về lưu trữ năng lượng tái tạo. Sau bài phát biểu, bà sẽ trả lời câu hỏi và ký tặng sách mới xuất bản tại sảnh chính.",
      subQuestions: [
        {
          id: "p4-q3-77",
          questionNumber: 77,
          questionText: "Who is Dr. Hayes?",
          options: [
            { key: "A", text: "A research scientist", isCorrect: true, translation: "Một nhà khoa học nghiên cứu" },
            { key: "B", text: "A university chancellor", isCorrect: false, translation: "Một hiệu trưởng đại học" },
            { key: "C", text: "A corporate lawyer", isCorrect: false, translation: "Một luật sư doanh nghiệp" },
            { key: "D", text: "A government official", isCorrect: false, translation: "Một quan chức chính phủ" }
          ],
          correctOption: "A",
          evidence: "chief research scientist at BioTech Innovations",
          translation: "Tiến sĩ Hayes là ai? -> Một nhà khoa học nghiên cứu (A research scientist).",
          scriptQuoteEn: "Tonight, it is my absolute pleasure to introduce Dr. Evelyn Hayes, chief research scientist at BioTech Innovations.",
          scriptQuoteVi: "Tối nay, tôi rất hân hạnh được giới thiệu Tiến sĩ Evelyn Hayes, nhà khoa học nghiên cứu trưởng tại BioTech Innovations.",
          paraphrase: "chief research scientist = A research scientist (nhà khoa học nghiên cứu)."
        },
        {
          id: "p4-q3-78",
          questionNumber: 78,
          questionText: "What field has Dr. Hayes worked in?",
          options: [
            { key: "A", text: "Renewable energy storage", isCorrect: true, translation: "Lưu trữ năng lượng tái tạo" },
            { key: "B", text: "Agricultural robotics", isCorrect: false, translation: "Robot nông nghiệp" },
            { key: "C", text: "Space exploration", isCorrect: false, translation: "Thám hiểm không gian" },
            { key: "D", text: "Pharmaceutical manufacturing", isCorrect: false, translation: "Sản xuất dược phẩm" }
          ],
          correctOption: "A",
          evidence: "groundbreaking research in renewable energy storage",
          translation: "Tiến sĩ Hayes hoạt động trong lĩnh vực nào? -> Lưu trữ năng lượng tái tạo.",
          scriptQuoteEn: "Over the past decade, Dr. Hayes has led groundbreaking research in renewable energy storage.",
          scriptQuoteVi: "Trong thập kỷ qua, Tiến sĩ Hayes đã dẫn đầu các nghiên cứu đột phá về lưu trữ năng lượng tái tạo.",
          paraphrase: "research in renewable energy storage = Renewable energy storage (lưu trữ năng lượng tái tạo)."
        },
        {
          id: "p4-q3-79",
          questionNumber: 79,
          questionText: "What will happen in the lobby after the talk?",
          options: [
            { key: "A", text: "A book signing", isCorrect: true, translation: "Buổi ký tặng sách" },
            { key: "B", text: "A cocktail reception", isCorrect: false, translation: "Tiệc chiêu đãi cocktail" },
            { key: "C", text: "A silent auction", isCorrect: false, translation: "Buổi đấu giá kín" },
            { key: "D", text: "A product giveaway", isCorrect: false, translation: "Phát quà tặng sản phẩm" }
          ],
          correctOption: "A",
          evidence: "sign copies of her newly published book in the lobby",
          translation: "Điều gì sẽ diễn ra tại sảnh sau buổi nói chuyện? -> Ký tặng sách (A book signing).",
          scriptQuoteEn: "Following her presentation, she will take questions from the audience and sign copies of her newly published book in the lobby.",
          scriptQuoteVi: "Sau bài thuyết trình, bà sẽ trả lời câu hỏi của khán giả và ký tặng sách mới xuất bản tại sảnh chính.",
          paraphrase: "sign copies of her newly published book = A book signing (buổi ký tặng sách)."
        }
      ],
      vocabRecommendation: {
        word: "distinguished",
        phonetic: "/dɪˈstɪŋɡwɪʃt/",
        type: "tính từ",
        meaning: "Ưu tú, xuất chúng, đáng kính trọng",
        example: "The university welcomed distinguished scholars from across the globe."
      },
      blanks: [
        { id: "b1", word: "distinguished", position: 4, hint: "d" },
        { id: "b2", word: "renewable", position: 24, hint: "r" }
      ]
    },

    // 4. Nhóm câu 80 - 82: Hướng dẫn tham quan nhà máy sản xuất (Factory Tour)
    {
      id: "part4-q4",
      sentenceIndex: 4,
      part: 4,
      displayNumber: "80 - 82",
      groupTitle: "Nhóm câu 80 - 82 (3 câu hỏi)",
      directionText: "Select the best response to each question.",
      topicId: "p4-t4",
      topicTitle: "Hướng dẫn tham quan & An toàn lao động",
      level: 4,
      audioText: "Questions 80 through 82 refer to the following factory tour guide. Welcome to the automated bottling facility of PureSpring Beverages. Before we enter the production floor, please put on these safety goggles and hard hats provided in the bins. Notice the yellow safety line painted on the floor; visitors must stay behind this line at all times. Due to high machine noise, I will be speaking through this microphone directly into your headsets. Let's begin at the assembly line.",
      fullSentence: "Welcome to the automated bottling facility. Before we enter the production floor, please put on these safety goggles and hard hats. Visitors must stay behind the yellow safety line at all times.",
      transcript: "Welcome to the automated bottling facility of PureSpring Beverages. Before we enter the production floor, please put on these safety goggles and hard hats provided in the bins. Notice the yellow safety line painted on the floor; visitors must stay behind this line at all times. Due to high machine noise, I will be speaking through this microphone directly into your headsets. Let's begin at the assembly line.",
      evidence: "automated bottling facility of PureSpring Beverages [80] | put on these safety goggles and hard hats [81] | stay behind this line at all times [82]",
      vietnameseTranslation: "Hướng dẫn an toàn trước khi vào tham quan nhà máy đóng chai tự động. Khách tham quan phải đeo kính bảo hộ, đội mũ cứng và luôn đi phía sau vạch an toàn màu vàng vẽ trên sàn.",
      subQuestions: [
        {
          id: "p4-q4-80",
          questionNumber: 80,
          questionText: "What type of facility is being toured?",
          options: [
            { key: "A", text: "A beverage bottling plant", isCorrect: true, translation: "Nhà máy đóng chai đồ uống" },
            { key: "B", text: "A semiconductor lab", isCorrect: false, translation: "Phòng thí nghiệm bán dẫn" },
            { key: "C", text: "A textile weaving mill", isCorrect: false, translation: "Xưởng dệt may" },
            { key: "D", text: "An aircraft hangar", isCorrect: false, translation: "Nhà chứa máy bay" }
          ],
          correctOption: "A",
          evidence: "automated bottling facility of PureSpring Beverages",
          translation: "Loại cơ sở nào đang được tham quan? -> Nhà máy đóng chai đồ uống.",
          scriptQuoteEn: "Welcome to the automated bottling facility of PureSpring Beverages.",
          scriptQuoteVi: "Chào mừng quý vị đến với cơ sở đóng chai tự động của PureSpring Beverages.",
          paraphrase: "bottling facility of PureSpring Beverages = A beverage bottling plant (nhà máy đóng chai đồ uống)."
        },
        {
          id: "p4-q4-81",
          questionNumber: 81,
          questionText: "What safety gear must visitors wear?",
          options: [
            { key: "A", text: "Goggles and hard hats", isCorrect: true, translation: "Kính bảo hộ và mũ cứng" },
            { key: "B", text: "Steel-toed boots", isCorrect: false, translation: "Ủng bọc thép ngón chân" },
            { key: "C", text: "Reflective vests", isCorrect: false, translation: "Áo phản quang" },
            { key: "D", text: "Latex gloves", isCorrect: false, translation: "Găng tay cao su" }
          ],
          correctOption: "A",
          evidence: "put on these safety goggles and hard hats",
          translation: "Trang bị an toàn nào du khách bắt buộc phải đeo? -> Kính bảo hộ và mũ cứng.",
          scriptQuoteEn: "Before we enter the production floor, please put on these safety goggles and hard hats provided in the bins.",
          scriptQuoteVi: "Trước khi vào khu sản xuất, vui lòng đeo kính bảo hộ và đội mũ bảo hiểm được đặt trong thùng.",
          paraphrase: "safety goggles and hard hats = Goggles and hard hats (kính bảo hộ và mũ cứng)."
        },
        {
          id: "p4-q4-82",
          questionNumber: 82,
          questionText: "What rule are visitors instructed to follow?",
          options: [
            { key: "A", text: "Stay behind the painted line", isCorrect: true, translation: "Luôn đứng sau vạch kẻ" },
            { key: "B", text: "Keep hands in their pockets", isCorrect: false, translation: "Cho hai tay vào túi áo" },
            { key: "C", text: "Avoid taking photographs", isCorrect: false, translation: "Không chụp ảnh" },
            { key: "D", text: "Turn off mobile phones", isCorrect: false, translation: "Tắt điện thoại di động" }
          ],
          correctOption: "A",
          evidence: "visitors must stay behind this line at all times",
          translation: "Du khách được hướng dẫn tuân thủ quy tắc nào? -> Luôn đi phía sau vạch an toàn kẻ trên sàn.",
          scriptQuoteEn: "Notice the yellow safety line painted on the floor; visitors must stay behind this line at all times.",
          scriptQuoteVi: "Chú ý vạch an toàn màu vàng vẽ trên sàn; khách tham quan phải luôn đi phía sau vạch này.",
          paraphrase: "visitors must stay behind this line at all times = Stay behind the painted line (luôn đứng sau vạch kẻ)."
        }
      ],
      vocabRecommendation: {
        word: "automated",
        phonetic: "/ˈɔːtəmeɪtɪd/",
        type: "tính từ",
        meaning: "Tự động hóa bằng máy móc hoặc robot",
        example: "The plant upgraded to an automated bottling assembly line last year."
      },
      blanks: [
        { id: "b1", word: "automated", position: 3, hint: "a" },
        { id: "b2", word: "goggles", position: 17, hint: "g" }
      ]
    }
  ]
};

/**
 * Lấy toàn bộ danh sách câu hỏi trong tất cả các Part (kèm Part ID)
 */
export const getAllSentences = (): (SentenceItem & { part: ListeningPart })[] => {
  return [
    ...MOCK_SENTENCES_BY_PART[1].map((s) => ({ ...s, part: 1 as ListeningPart })),
    ...MOCK_SENTENCES_BY_PART[2].map((s) => ({ ...s, part: 2 as ListeningPart })),
    ...MOCK_SENTENCES_BY_PART[3].map((s) => ({ ...s, part: 3 as ListeningPart })),
    ...MOCK_SENTENCES_BY_PART[4].map((s) => ({ ...s, part: 4 as ListeningPart })),
  ];
};

/**
 * ==============================================================================
 * DANH SÁCH CÂU HỎI NGHE CHÉP CHÍNH TẢ PART 1 (6 BÀI x 4 CÂU = 24 CÂU)
 * Cấu trúc phân tầng chuẩn:
 * - Hàng 1: Danh sách Bài ([Bài 1] đến [Bài 6]) tương ứng 6 bức tranh
 * - Hàng 2: Danh sách câu ([ 1 ] [ 2 ] [ 3 ] [ 4 ]) tương ứng 4 phương án A, B, C, D của bức tranh đó
 * ==============================================================================
 */
export const MOCK_DICTATION_PART1_SENTENCES: SentenceItem[] = [
  // --- BÀI 1: Tranh một người leo thang (/part1_ladder.jpg) ---
  {
    id: "p1-b1-s1",
    sentenceIndex: 1,
    part: 1,
    baiNumber: 1,
    subSentenceNumber: 1,
    displayNumber: "1.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "He's wearing safety glasses.",
    fullSentence: "He's wearing safety glasses.",
    vietnameseTranslation: "Anh ấy đang đeo kính bảo hộ.",
    vocabRecommendation: {
      word: "glasses",
      phonetic: "/ˈɡlæs.ɪz/",
      type: "danh từ",
      meaning: "Kính mắt bảo hộ lao động",
      example: "Workers must wear protective safety glasses in the workshop."
    },
    blanks: [
      { id: "p1-b1-s1-b1", word: "wearing", position: 1, hint: "w" },
      { id: "p1-b1-s1-b2", word: "glasses", position: 3, hint: "g" }
    ]
  },
  {
    id: "p1-b1-s2",
    sentenceIndex: 2,
    part: 1,
    baiNumber: 1,
    subSentenceNumber: 2,
    displayNumber: "2.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "He's cleaning some equipment.",
    fullSentence: "He's cleaning some equipment.",
    vietnameseTranslation: "Anh ấy đang vệ sinh thiết bị.",
    vocabRecommendation: {
      word: "equipment",
      phonetic: "/ɪˈkwɪp.mənt/",
      type: "danh từ",
      meaning: "Trang thiết bị, máy móc",
      example: "Technicians clean maintenance equipment daily."
    },
    blanks: [
      { id: "p1-b1-s2-b1", word: "He's", position: 0, hint: "H" },
      { id: "p1-b1-s2-b2", word: "equipment", position: 3, hint: "e" }
    ]
  },
  {
    id: "p1-b1-s3",
    sentenceIndex: 3,
    part: 1,
    baiNumber: 1,
    subSentenceNumber: 3,
    displayNumber: "3.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "He's climbing up a ladder.",
    fullSentence: "He's climbing up a ladder.",
    vietnameseTranslation: "Anh ấy đang leo lên một cái thang.",
    vocabRecommendation: {
      word: "ladder",
      phonetic: "/ˈlæd.ər/",
      type: "danh từ",
      meaning: "Cái thang xếp, thang gấp",
      example: "The worker is climbing up a ladder to reach the ceiling."
    },
    blanks: [
      { id: "p1-b1-s3-b1", word: "climbing", position: 1, hint: "c" },
      { id: "p1-b1-s3-b2", word: "ladder", position: 4, hint: "l" }
    ]
  },
  {
    id: "p1-b1-s4",
    sentenceIndex: 4,
    part: 1,
    baiNumber: 1,
    subSentenceNumber: 4,
    displayNumber: "4.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "He's walking around on a driveway.",
    fullSentence: "He's walking around on a driveway.",
    vietnameseTranslation: "Anh ấy đang đi lại trên đường lái xe vào nhà.",
    vocabRecommendation: {
      word: "driveway",
      phonetic: "/ˈdraɪv.weɪ/",
      type: "danh từ",
      meaning: "Đường lái xe từ cổng vào nhà",
      example: "Cars are parked along the private driveway."
    },
    blanks: [
      { id: "p1-b1-s4-b1", word: "walking", position: 1, hint: "w" },
      { id: "p1-b1-s4-b2", word: "around", position: 2, hint: "a" }
    ]
  },

  // --- BÀI 2: Tranh nhiều người họp bàn (/part1_meeting.jpg) ---
  {
    id: "p1-b2-s1",
    sentenceIndex: 5,
    part: 1,
    baiNumber: 2,
    subSentenceNumber: 1,
    displayNumber: "1.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "Colleagues are gathered around a table in a conference room.",
    fullSentence: "Colleagues are gathered around a table in a conference room.",
    vietnameseTranslation: "Các đồng nghiệp đang quây quần quanh bàn trong phòng họp.",
    vocabRecommendation: {
      word: "gather",
      phonetic: "/ˈɡæð.ər/",
      type: "động từ",
      meaning: "Tập trung lại, quây quần",
      example: "The team gathered to discuss the new project milestone."
    },
    blanks: [
      { id: "b1", word: "Colleagues", position: 0, hint: "C" },
      { id: "b2", word: "gathered", position: 2, hint: "g" },
      { id: "b3", word: "table", position: 5, hint: "t" }
    ]
  },
  {
    id: "p1-b2-s2",
    sentenceIndex: 6,
    part: 1,
    baiNumber: 2,
    subSentenceNumber: 2,
    displayNumber: "2.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "Some workers are assembling office chairs.",
    fullSentence: "Some workers are assembling office chairs.",
    vietnameseTranslation: "Một số công nhân đang lắp ráp ghế văn phòng.",
    vocabRecommendation: {
      word: "assemble",
      phonetic: "/əˈsem.bəl/",
      type: "động từ",
      meaning: "Lắp ráp đồ đạc linh kiện",
      example: "They are assembling modern ergonomic furniture."
    },
    blanks: [
      { id: "b1", word: "workers", position: 1, hint: "w" },
      { id: "b2", word: "assembling", position: 3, hint: "a" },
      { id: "b3", word: "chairs", position: 5, hint: "c" }
    ]
  },
  {
    id: "p1-b2-s3",
    sentenceIndex: 7,
    part: 1,
    baiNumber: 2,
    subSentenceNumber: 3,
    displayNumber: "3.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "A presenter is turning off a projector.",
    fullSentence: "A presenter is turning off a projector.",
    vietnameseTranslation: "Người thuyết trình đang tắt máy chiếu.",
    vocabRecommendation: {
      word: "projector",
      phonetic: "/prəˈdʒek.tər/",
      type: "danh từ",
      meaning: "Máy chiếu trình chiếu slide",
      example: "The wireless projector is mounted on the conference ceiling."
    },
    blanks: [
      { id: "b1", word: "presenter", position: 1, hint: "p" },
      { id: "b2", word: "turning", position: 3, hint: "t" },
      { id: "b3", word: "projector", position: 6, hint: "p" }
    ]
  },
  {
    id: "p1-b2-s4",
    sentenceIndex: 8,
    part: 1,
    baiNumber: 2,
    subSentenceNumber: 4,
    displayNumber: "4.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "Employees are packing files into boxes.",
    fullSentence: "Employees are packing files into boxes.",
    vietnameseTranslation: "Nhân viên đang đóng gói tài liệu vào thùng.",
    vocabRecommendation: {
      word: "pack",
      phonetic: "/pæk/",
      type: "động từ",
      meaning: "Đóng gói, xếp đồ vào thùng",
      example: "Staff are packing archival files for the office relocation."
    },
    blanks: [
      { id: "b1", word: "Employees", position: 0, hint: "E" },
      { id: "b2", word: "packing", position: 2, hint: "p" },
      { id: "b3", word: "boxes", position: 5, hint: "b" }
    ]
  },

  // --- BÀI 3: Tranh kỹ thuật viên sửa thiết bị (/part1_ladder.jpg) ---
  {
    id: "p1-b3-s1",
    sentenceIndex: 9,
    part: 1,
    baiNumber: 3,
    subSentenceNumber: 1,
    displayNumber: "1.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "The technician is repairing a piece of equipment.",
    fullSentence: "The technician is repairing a piece of equipment.",
    vietnameseTranslation: "Kỹ thuật viên đang sửa chữa một thiết bị.",
    vocabRecommendation: {
      word: "technician",
      phonetic: "/tekˈnɪʃ.ən/",
      type: "danh từ",
      meaning: "Kỹ thuật viên chuyên nghiệp",
      example: "The certified technician resolved the electrical fault."
    },
    blanks: [
      { id: "b1", word: "technician", position: 1, hint: "t" },
      { id: "b2", word: "repairing", position: 3, hint: "r" },
      { id: "b3", word: "equipment", position: 7, hint: "e" }
    ]
  },
  {
    id: "p1-b3-s2",
    sentenceIndex: 10,
    part: 1,
    baiNumber: 3,
    subSentenceNumber: 2,
    displayNumber: "2.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "A customer is paying at the cash register.",
    fullSentence: "A customer is paying at the cash register.",
    vietnameseTranslation: "Khách hàng đang thanh toán tại quầy thu ngân.",
    vocabRecommendation: {
      word: "register",
      phonetic: "/ˈredʒ.ə.stər/",
      type: "danh từ",
      meaning: "Máy tính tiền, quầy thu ngân",
      example: "The retail cashier operates an electronic cash register."
    },
    blanks: [
      { id: "b1", word: "customer", position: 1, hint: "c" },
      { id: "b2", word: "paying", position: 3, hint: "p" },
      { id: "b3", word: "register", position: 7, hint: "r" }
    ]
  },
  {
    id: "p1-b3-s3",
    sentenceIndex: 11,
    part: 1,
    baiNumber: 3,
    subSentenceNumber: 3,
    displayNumber: "3.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "The man is hanging a picture frame on the wall.",
    fullSentence: "The man is hanging a picture frame on the wall.",
    vietnameseTranslation: "Người đàn ông đang treo khung ảnh lên tường.",
    vocabRecommendation: {
      word: "frame",
      phonetic: "/freɪm/",
      type: "danh từ",
      meaning: "Khung tranh, khung ảnh",
      example: "He carefully aligned the wooden picture frame."
    },
    blanks: [
      { id: "b1", word: "hanging", position: 3, hint: "h" },
      { id: "b2", word: "frame", position: 6, hint: "f" },
      { id: "b3", word: "wall", position: 9, hint: "w" }
    ]
  },
  {
    id: "p1-b3-s4",
    sentenceIndex: 12,
    part: 1,
    baiNumber: 3,
    subSentenceNumber: 4,
    displayNumber: "4.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t1",
    topicTitle: "Tranh một người",
    level: 1,
    audioText: "Tools are being loaded onto a delivery van.",
    fullSentence: "Tools are being loaded onto a delivery van.",
    vietnameseTranslation: "Các dụng cụ đang được chất lên xe tải giao hàng.",
    vocabRecommendation: {
      word: "load",
      phonetic: "/loʊd/",
      type: "động từ",
      meaning: "Chất hàng, bốc hàng lên xe",
      example: "Heavy cargo tools were loaded safely onto the vehicle."
    },
    blanks: [
      { id: "b1", word: "Tools", position: 0, hint: "T" },
      { id: "b2", word: "loaded", position: 3, hint: "l" },
      { id: "b3", word: "delivery", position: 6, hint: "d" }
    ]
  },

  // --- BÀI 4: Tranh hành khách lên tàu (/part1_ladder.jpg) ---
  {
    id: "p1-b4-s1",
    sentenceIndex: 13,
    part: 1,
    baiNumber: 4,
    subSentenceNumber: 1,
    displayNumber: "1.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "Some passengers are boarding a commuter train.",
    fullSentence: "Some passengers are boarding a commuter train.",
    vietnameseTranslation: "Một số hành khách đang lên tàu điện đi làm.",
    vocabRecommendation: {
      word: "commuter",
      phonetic: "/kəˈmjuː.tər/",
      type: "danh từ",
      meaning: "Người đi lại hàng ngày bằng phương tiện công cộng",
      example: "Commuters gather on the platform during morning rush hour."
    },
    blanks: [
      { id: "b1", word: "passengers", position: 1, hint: "p" },
      { id: "b2", word: "boarding", position: 3, hint: "b" },
      { id: "b3", word: "train", position: 6, hint: "t" }
    ]
  },
  {
    id: "p1-b4-s2",
    sentenceIndex: 14,
    part: 1,
    baiNumber: 4,
    subSentenceNumber: 2,
    displayNumber: "2.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "Luggage is being stored in the overhead compartment.",
    fullSentence: "Luggage is being stored in the overhead compartment.",
    vietnameseTranslation: "Hành lý đang được cất vào khoang trên đầu.",
    vocabRecommendation: {
      word: "compartment",
      phonetic: "/kəmˈpɑːrt.mənt/",
      type: "danh từ",
      meaning: "Khoang chứa hành lý trên cao",
      example: "Please place carry-on luggage inside the overhead compartment."
    },
    blanks: [
      { id: "b1", word: "Luggage", position: 0, hint: "L" },
      { id: "b2", word: "stored", position: 3, hint: "s" },
      { id: "b3", word: "overhead", position: 6, hint: "o" }
    ]
  },
  {
    id: "p1-b4-s3",
    sentenceIndex: 15,
    part: 1,
    baiNumber: 4,
    subSentenceNumber: 3,
    displayNumber: "3.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "The conductor is checking travel tickets.",
    fullSentence: "The conductor is checking travel tickets.",
    vietnameseTranslation: "Người soát vé đang kiểm tra vé tàu.",
    vocabRecommendation: {
      word: "conductor",
      phonetic: "/kənˈdʌk.tər/",
      type: "danh từ",
      meaning: "Người soát vé trên tàu hoả",
      example: "The train conductor validated the boarding passes."
    },
    blanks: [
      { id: "b1", word: "conductor", position: 1, hint: "c" },
      { id: "b2", word: "checking", position: 3, hint: "c" },
      { id: "b3", word: "tickets", position: 5, hint: "t" }
    ]
  },
  {
    id: "p1-b4-s4",
    sentenceIndex: 16,
    part: 1,
    baiNumber: 4,
    subSentenceNumber: 4,
    displayNumber: "4.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t2",
    topicTitle: "Tranh nhiều người",
    level: 2,
    audioText: "People are waiting in line at the ticket booth.",
    fullSentence: "People are waiting in line at the ticket booth.",
    vietnameseTranslation: "Mọi người đang xếp hàng tại quầy vé.",
    vocabRecommendation: {
      word: "booth",
      phonetic: "/buːθ/",
      type: "danh từ",
      meaning: "Quầy nhỏ, gian hàng bán vé",
      example: "Passengers formed a neat queue at the station ticket booth."
    },
    blanks: [
      { id: "b1", word: "People", position: 0, hint: "P" },
      { id: "b2", word: "waiting", position: 2, hint: "w" },
      { id: "b3", word: "booth", position: 8, hint: "b" }
    ]
  },

  // --- BÀI 5: Tranh hàng hoá trên kệ (/part1_ladder.jpg) ---
  {
    id: "p1-b5-s1",
    sentenceIndex: 17,
    part: 1,
    baiNumber: 5,
    subSentenceNumber: 1,
    displayNumber: "1.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t4",
    topicTitle: "Tranh tả vật",
    level: 3,
    audioText: "Merchandise is displayed on wooden shelves.",
    fullSentence: "Merchandise is displayed on wooden shelves.",
    vietnameseTranslation: "Hàng hóa được trưng bày trên các kệ gỗ.",
    vocabRecommendation: {
      word: "merchandise",
      phonetic: "/ˈmɜːr.tʃən.daɪs/",
      type: "danh từ (uncountable)",
      meaning: "Hàng hóa buôn bán",
      example: "High-end retail merchandise is displayed neatly."
    },
    blanks: [
      { id: "b1", word: "Merchandise", position: 0, hint: "M" },
      { id: "b2", word: "displayed", position: 2, hint: "d" },
      { id: "b3", word: "shelves", position: 5, hint: "s" }
    ]
  },
  {
    id: "p1-b5-s2",
    sentenceIndex: 18,
    part: 1,
    baiNumber: 5,
    subSentenceNumber: 2,
    displayNumber: "2.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t4",
    topicTitle: "Tranh tả vật",
    level: 3,
    audioText: "Customers are browsing clothes on racks.",
    fullSentence: "Customers are browsing clothes on racks.",
    vietnameseTranslation: "Khách hàng đang xem quần áo trên giá treo.",
    vocabRecommendation: {
      word: "browse",
      phonetic: "/braʊz/",
      type: "động từ",
      meaning: "Xem lướt qua, ngắm nghía hàng hóa",
      example: "Shoppers spent the afternoon browsing the fashion collection."
    },
    blanks: [
      { id: "b1", word: "Customers", position: 0, hint: "C" },
      { id: "b2", word: "browsing", position: 2, hint: "b" },
      { id: "b3", word: "racks", position: 5, hint: "r" }
    ]
  },
  {
    id: "p1-b5-s3",
    sentenceIndex: 19,
    part: 1,
    baiNumber: 5,
    subSentenceNumber: 3,
    displayNumber: "3.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t4",
    topicTitle: "Tranh tả vật",
    level: 3,
    audioText: "A store clerk is stocking milk cartons.",
    fullSentence: "A store clerk is stocking milk cartons.",
    vietnameseTranslation: "Nhân viên đang xếp các hộp sữa lên kệ.",
    vocabRecommendation: {
      word: "stock",
      phonetic: "/stɑːk/",
      type: "động từ",
      meaning: "Bổ sung hàng hoá lên quầy kệ",
      example: "The grocery clerk is restocking organic juice bottles."
    },
    blanks: [
      { id: "b1", word: "clerk", position: 2, hint: "c" },
      { id: "b2", word: "stocking", position: 4, hint: "s" },
      { id: "b3", word: "cartons", position: 6, hint: "c" }
    ]
  },
  {
    id: "p1-b5-s4",
    sentenceIndex: 20,
    part: 1,
    baiNumber: 5,
    subSentenceNumber: 4,
    displayNumber: "4.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_ladder.jpg",
    topicId: "p1-t4",
    topicTitle: "Tranh tả vật",
    level: 3,
    audioText: "Shopping carts are lined up near the entrance.",
    fullSentence: "Shopping carts are lined up near the entrance.",
    vietnameseTranslation: "Xe đẩy mua hàng được xếp thành hàng gần lối vào.",
    vocabRecommendation: {
      word: "entrance",
      phonetic: "/ˈen.trəns/",
      type: "danh từ",
      meaning: "Cổng ra vào, lối đi vào",
      example: "Metal trolleys are positioned conveniently near the main entrance."
    },
    blanks: [
      { id: "b1", word: "Shopping", position: 0, hint: "S" },
      { id: "b2", word: "carts", position: 1, hint: "c" },
      { id: "b3", word: "entrance", position: 7, hint: "e" }
    ]
  },

  // --- BÀI 6: Tranh lối đi lát gạch (/part1_meeting.jpg) ---
  {
    id: "p1-b6-s1",
    sentenceIndex: 21,
    part: 1,
    baiNumber: 6,
    subSentenceNumber: 1,
    displayNumber: "1.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t3",
    topicTitle: "Tranh tả cảnh",
    level: 4,
    audioText: "Trees are being planted in a public park.",
    fullSentence: "Trees are being planted in a public park.",
    vietnameseTranslation: "Cây cối đang được trồng trong công viên.",
    vocabRecommendation: {
      word: "plant",
      phonetic: "/plænt/",
      type: "động từ",
      meaning: "Trồng cây cối",
      example: "Gardeners are planting ornamental trees along the boulevard."
    },
    blanks: [
      { id: "b1", word: "Trees", position: 0, hint: "T" },
      { id: "b2", word: "planted", position: 3, hint: "p" },
      { id: "b3", word: "park", position: 7, hint: "p" }
    ]
  },
  {
    id: "p1-b6-s2",
    sentenceIndex: 22,
    part: 1,
    baiNumber: 6,
    subSentenceNumber: 2,
    displayNumber: "2.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t3",
    topicTitle: "Tranh tả cảnh",
    level: 4,
    audioText: "Several wooden benches are arranged along a paved walkway.",
    fullSentence: "Several wooden benches are arranged along a paved walkway.",
    vietnameseTranslation: "Nhiều băng ghế gỗ được sắp xếp dọc theo lối đi lát gạch.",
    vocabRecommendation: {
      word: "paved",
      phonetic: "/peɪvd/",
      type: "tính từ",
      meaning: "Được lát gạch, lát đá phẳng phiu",
      example: "A paved walkway winds through the botanical garden."
    },
    blanks: [
      { id: "b1", word: "wooden", position: 1, hint: "w" },
      { id: "b2", word: "benches", position: 2, hint: "b" },
      { id: "b3", word: "arranged", position: 4, hint: "a" },
      { id: "b4", word: "walkway", position: 8, hint: "w" }
    ]
  },
  {
    id: "p1-b6-s3",
    sentenceIndex: 23,
    part: 1,
    baiNumber: 6,
    subSentenceNumber: 3,
    displayNumber: "3.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t3",
    topicTitle: "Tranh tả cảnh",
    level: 4,
    audioText: "Pedestrians are crossing at an intersection.",
    fullSentence: "Pedestrians are crossing at an intersection.",
    vietnameseTranslation: "Người đi bộ đang qua đường tại ngã tư.",
    vocabRecommendation: {
      word: "intersection",
      phonetic: "/ˌɪn.tərˈsek.ʃən/",
      type: "danh từ",
      meaning: "Ngã tư đường, giao lộ",
      example: "Traffic lights signal safe pedestrian crossing at the intersection."
    },
    blanks: [
      { id: "b1", word: "Pedestrians", position: 0, hint: "P" },
      { id: "b2", word: "crossing", position: 2, hint: "c" },
      { id: "b3", word: "intersection", position: 5, hint: "i" }
    ]
  },
  {
    id: "p1-b6-s4",
    sentenceIndex: 24,
    part: 1,
    baiNumber: 6,
    subSentenceNumber: 4,
    displayNumber: "4.",
    directionText: "Select the one statement that best describes what you see in the picture.",
    imageUrl: "/part1_meeting.jpg",
    topicId: "p1-t3",
    topicTitle: "Tranh tả cảnh",
    level: 4,
    audioText: "Streetlights are being installed on the sidewalk.",
    fullSentence: "Streetlights are being installed on the sidewalk.",
    vietnameseTranslation: "Đèn đường đang được lắp đặt trên vỉa hè.",
    vocabRecommendation: {
      word: "install",
      phonetic: "/ɪnˈstɔːl/",
      type: "động từ",
      meaning: "Lắp đặt, cài đặt thiết bị",
      example: "Energy-efficient LED streetlights are being installed by the city."
    },
    blanks: [
      { id: "b1", word: "Streetlights", position: 0, hint: "S" },
      { id: "b2", word: "installed", position: 3, hint: "i" },
      { id: "b3", word: "sidewalk", position: 6, hint: "s" }
    ]
  }
];

export * from "./data/dictationPart2Data";
export * from "./data/dictationPart3Data";
export * from "./data/dictationPart4Data";

