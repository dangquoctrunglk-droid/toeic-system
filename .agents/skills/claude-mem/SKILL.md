---
name: claude-mem
description: Bộ nhớ dài hạn cross-session cho AI, lưu trữ các quyết định kiến trúc, quy chuẩn mã nguồn và tiến độ công việc giữa các phiên làm việc.
---

# 🧠 Claude Mem: Bộ Nhớ Dài Hạn Cross-Session Cho AI Agent

Kỹ năng **`claude-mem`** giải quyết triệt để vấn đề "mất trí nhớ" (Amnesia) của AI mỗi khi người dùng tắt terminal hoặc mở cuộc trò chuyện mới.

---

## 📌 Cấu Trúc Bộ Nhớ Bền Vững
Bộ nhớ được tổ chức thành file markdown tinh gọn nằm trong project (`.agents/memory/ACTIVE_CONTEXT.md` hoặc `MEMORY.md`):
1. **User Preferences**: Thói quen code của người dùng (thích viết hàm mũi tên, dùng TypeScript strict, giao diện dark mode, tone giọng súc tích).
2. **Architecture Decisions (ADR)**: Các quyết định kỹ thuật bất biến (ví dụ: dùng Tailwind v4, không dùng styled-components; xác thực bằng JWT HttpOnly cookie).
3. **Current State & Roadblocks**: Tính năng đang làm dở, những bẫy lỗi cần tránh để phiên sau không lặp lại sai lầm.

---

## 🔄 Vòng Lặp Vận Hành (Read-Update Cycle)
- **Khi Bắt Đầu Phiên**: Đọc file bộ nhớ trước tiên để khôi phục toàn bộ ngữ cảnh mà không cần người dùng giải thích lại từ đầu.
- **Khi Kết Thúc / Đạt Cột Mốc**: Tự động cập nhật 3-5 gạch đầu dòng ngắn gọn vào bộ nhớ.
