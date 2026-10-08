# 🚀 AI Agent Skills Hub & Backup Repository

Kho lưu trữ chuẩn hóa toàn bộ kỹ năng (**Skills**), cấu hình quy tắc (**AGENTS.md**), và bản sắc hoạt động (**SOUL.md**) cho các Agent lập trình thông minh: **Claude Code** và **Google Antigravity (Gemini CLI)**.

Được thiết kế theo cấu trúc module tương thích chuẩn mã nguồn mở (tương tự `anthropics/skills` và `fission-ai/openspec`), hỗ trợ **324+ skills chuyên biệt**, tự động kích hoạt qua ngôn ngữ tự nhiên tiếng Việt.

---

## 📂 Cấu Trúc Thư Mục (Repository Layout)

```text
ai-agent-skills-backup/
├── AGENTS.md                  # Bản quy tắc toàn cục & bộ phân loại ý định tiếng Việt (Root)
├── SOUL.md                    # Triết lý kiến trúc, linh hồn & chuẩn mực AI Agent (Root)
├── .gitignore                 # Bỏ qua cache, file rác và log tạm
├── README.md                  # Hướng dẫn chi tiết & danh mục kỹ năng
│
├── rules/                     # Thư mục chứa quy tắc hệ thống
│   ├── AGENTS.md              # Global Rules & Intent Classifier
│   └── SOUL.md                # Senior Engineer Persona & Engineering Tenets
│
├── scripts/                   # Bộ công cụ tự động hóa triển khai
│   ├── install-to-claude.ps1      # Cài đặt / đồng bộ toàn bộ skills sang ~/.claude/
│   └── install-to-antigravity.ps1 # Cài đặt / đồng bộ plugins sang ~/.gemini/config/plugins/
│
├── skills/                    # Kho 324+ kỹ năng chuẩn hóa (Mỗi thư mục chứa SKILL.md)
│   ├── impeccable/            # Audit & trau chuốt UI đỉnh cao
│   ├── design-taste-frontend/ # Chống AI slop, nâng tầm thẩm mỹ frontend
│   ├── minimalist-ui/         # Giao diện tối giản phong cách báo chí
│   ├── industrial-brutalist-ui/ # Giao diện thô mộc, kỹ thuật
│   ├── full-output-enforcement/ # Chống viết tắt, bắt buộc code trọn vẹn
│   ├── plan-ceo-review/       # Đánh giá ý tưởng sản phẩm từ góc nhìn Founder/CEO
│   ├── plan-eng-review/       # Đánh giá kiến trúc kỹ thuật (Engineering Manager)
│   ├── qa/                    # Kiểm thử giao diện và luồng người dùng
│   ├── ship/                  # Tự động hóa đóng gói và phát hành tính năng
│   ├── code-review-skill/     # Review mã nguồn cho hơn 25+ ngôn ngữ
│   ├── claude-mem/            # Bộ nhớ dài hạn cross-session
│   ├── strategic-compact/     # Quản lý và nén ngữ cảnh chủ động
│   ├── humanizer/             # Khử giọng văn máy móc của AI, viết tự nhiên
│   ├── ui-ux-pro-max/         # Thư viện giao diện, bảng màu, typography 50+ styles
│   ├── clean-code/            # Quy chuẩn viết code tinh gọn, chuẩn SOLID
│   ├── database-design/       # Thiết kế CSDL, indexing, quan hệ thực thể
│   ├── openspec-*/            # 12 kỹ năng Spec-Driven Change Management
│   └── ...                    # Các kỹ năng Cloudflare, Vercel, WordPress, Khoa học
│
└── plugins/                   # Gói Plugins hoàn chỉnh cho Google Antigravity
    ├── antigravity-kit-plugin/
    ├── developer-power-skills/
    ├── elite-workflows-and-taste/
    ├── openspec-plugin/
    ├── social-media-skills/
    └── scientific-agent-skills/
```

---

## 🎯 Danh Mục Kỹ Năng Tinh Hoa Nổi Bật

### 1. Thẩm Mỹ Giao Diện & Chống "AI Slop"
- **`impeccable`**: Kỹ năng trau chuốt UI đa nền tảng (Web, iOS, Android), audit spacing, micro-interactions và typography hierarchy.
- **`design-taste-frontend`**: Khắc phục các giao diện AI nhạt nhẽo (generic gradient, card vô hồn), áp dụng ngôn ngữ thiết kế độc bản.
- **`minimalist-ui` & `industrial-brutalist-ui`**: Hai phong cách thiết kế thời thượng: Tối giản sang trọng kiểu tạp chí hoặc phong cách kỹ thuật thô mộc.
- **`full-output-enforcement`**: Loại bỏ vĩnh viễn thói quen viết tắt `// TODO: tự code tiếp` của AI.

### 2. Quy Trình Phối Hợp Đa Vai Trò (GStack Engine)
- **`plan-ceo-review`**: Đánh giá tính khả thi kinh doanh, giá trị cốt lõi sản phẩm dưới lăng kính Founder.
- **`plan-eng-review`**: Thẩm định độ mở rộng, bảo mật, bẫy hiệu năng và tính ổn định kiến trúc.
- **`qa` & `ship`**: Kiểm thử toàn diện hành trình người dùng và thực hiện quy trình đóng gói ra mắt (ship code).

### 3. Tối Ưu Bộ Nhớ & Ngữ Cảnh (Memory & Context)
- **`claude-mem` & `mem-search`**: Nhớ lịch sử quyết định qua từng phiên làm việc, không bị "mất trí nhớ" khi khởi động lại.
- **`strategic-compact`**: Chủ động phân tích và nén token để AI không bao giờ bị nghẽn context khi dự án phình to.
- **`handoff`**: Tạo tài liệu bàn giao ca chuẩn chỉnh cho phiên làm việc tiếp theo.

### 4. Phát Triển Phần Mềm Định Hướng Đặc Tả (Spec-Driven Development)
- **`openspec-*`**: Bộ 12 kỹ năng quản lý thay đổi phần mềm theo chu trình: `explore` ➔ `propose` ➔ `apply` ➔ `verify` ➔ `archive`.

### 5. Sáng Tạo Nội Dung & Tự Nhiên Hóa Ngôn Ngữ
- **`humanizer`**: Lọc bỏ mọi mẫu câu máy móc, sáo rỗng, chuyển văn phong AI thành giọng điệu chân thực của con người.
- **`post-writer` & `content-matrix`**: Lên ý tưởng ma trận 32+ chủ đề và viết bài đa nền tảng (LinkedIn, Facebook, Threads).

---

## ⚡ Hướng Dẫn Cài Đặt & Sử Dụng

### Dành cho Claude Code:
Chạy script PowerShell để sao chép toàn bộ skills và thiết lập rules:
```powershell
.\scripts\install-to-claude.ps1
```

### Dành cho Google Antigravity (Gemini CLI):
Chạy script PowerShell để kích hoạt toàn bộ Plugins và Intent Classifier:
```powershell
.\scripts\install-to-antigravity.ps1
```

---

## 🗣️ Điều Khiển Tự Nhiên Bằng Tiếng Việt

Bạn không cần nhớ tên file tiếng Anh. Nhờ cơ chế nhận diện ý định tại `AGENTS.md`, bạn chỉ cần trò chuyện tự nhiên:
- *"Trau chuốt lại UI trang này cho thật đẳng cấp"* ➔ Tự động gọi `impeccable`.
- *"Review code PR này dưới góc nhìn founder"* ➔ Tự động gọi `plan-ceo-review`.
- *"Nén ngữ cảnh lại để tránh tràn token"* ➔ Tự động gọi `strategic-compact`.
- *"Viết code đầy đủ, không để placeholder"* ➔ Tự động gọi `full-output-enforcement`.
- *"Sửa bài viết này cho tự nhiên, khử mùi AI"* ➔ Tự động gọi `humanizer`.

---
*Kho lưu trữ được đồng bộ và cập nhật ngày 02/10/2026.*
