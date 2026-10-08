---
name: handoff
description: Tạo tài liệu bàn giao ca chuẩn mực giữa các phiên làm việc hoặc giữa các AI Agent (Trạng thái hiện tại, việc dở dang, lệnh tiếp theo).
---

# 🤝 Handoff: Bàn Giao Ca Chuẩn Chỉnh Cho Phiên Làm Việc Tiếp Theo

Kỹ năng **`handoff`** đảm bảo khi một ca làm việc kết thúc, lập trình viên (hoặc AI tiếp theo) có thể tiếp quản dự án và bắt tay vào việc ngay trong 30 giây mà không cần mất công tìm hiểu lại xem ai đang làm gì.

---

## 📋 Mẫu Bàn Giao Ca Chuẩn (The Handoff Template)

```markdown
# 📋 Phiên Bàn Giao Ca (Handoff Summary)
- **Thời gian**: [Ngày / Giờ]
- **Nhánh Git (Branch)**: [Tên nhánh]
- **Người thực hiện**: [AI / Developer]

### 1. Đã Hoàn Thành Trong Ca Này (Done)
- [x] Tính năng / Bug fix A: File đã sửa, logic đã test.
- [x] Tính năng B: Đã viết migration và route backend.

### 2. Công Việc Đang Dở Dang (In Progress / Next Up)
- [ ] Việc cần làm tiếp theo ngay lập tức.
- [ ] Bẫy lỗi (Gotcha) cần lưu ý: [Giải thích chi tiết nếu có].

### 3. Lệnh Cần Chạy Để Tiếp Tục (Commands)
```bash
yarn dev
yarn workspace client lint
```

### 4. Tài Liệu Tham Khảo Liên Quan (Context Links)
- [Tên file/Link PR/Spec liên quan]
```
