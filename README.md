toeic-system/
├── client/ # Frontend (React + TypeScript + Tailwind)
│ ├── src/
│ │ ├── assets/ # Ảnh minh hoạ, biểu tượng, audio mẫu
│ │ ├── components/ # Các component tái sử dụng
│ │ │ ├── common/ # Button, Input, Modal, Navbar, Footer, Pagination
│ │ │ └── exam/ # Timer, AudioPlayer, QuestionCard, AnswerSheet
│ │ ├── context/ # Lưu trạng thái (AuthContext, ExamContext)
│ │ ├── layouts/ # Layout cho Client và Layout cho Admin
│ │ │ ├── MainLayout.tsx
│ │ │ └── AdminLayout.tsx
│ │ ├── pages/ # Các màn hình theo mục tiêu đề tài
│ │ │ ├── auth/ # Login, Register
│ │ │ ├── home/ # Trang chủ giới thiệu
│ │ │ ├── listening/ # Luyện tập kỹ năng Nghe
│ │ │ ├── reading/ # Luyện tập kỹ năng Đọc
│ │ │ ├── writing/ # Luyện tập kỹ năng Viết
│ │ │ ├── vocabulary/ # Học và tra cứu từ vựng
│ │ │ ├── exam/ # Danh sách đề thi và màn hình làm bài
│ │ │ ├── result/ # Xem kết quả bài thi vừa làm
│ │ │ ├── profile/ # Thông tin cá nhân & Lịch sử làm bài
│ │ │ └── admin/ # Dashboard, Quản lý câu hỏi, Đề thi, User...
│ │ ├── services/ # Gọi API backend (axios/fetch)
│ │ └── types/ # Khai báo TypeScript types/interfaces
│ ├── .env
│ └── package.json
│
└── server/ # Backend (ExpressJS + TypeScript + MongoDB)
├── src/
│ ├── config/ # Kết nối MongoDB (db.ts)
│ ├── controllers/ # Xử lý logic nghiệp vụ
│ │ ├── auth.controller.ts
│ │ ├── question.controller.ts
│ │ ├── exam.controller.ts
│ │ ├── writing.controller.ts
│ │ ├── vocab.controller.ts
│ │ ├── result.controller.ts
│ │ └── admin.controller.ts
│ ├── middlewares/ # Middleware kiểm tra token JWT, phân quyền Admin
│ ├── models/ # Mongoose Schemas (User, Question, Exam, ...)
│ ├── routes/ # Khai báo các đường dẫn API (/api/v1/...)
│ ├── utils/ # Hàm tiện ích (thang tính điểm TOEIC, response chuẩn)
│ └── server.ts # File chạy chính của server
├── .env
└── package.json
