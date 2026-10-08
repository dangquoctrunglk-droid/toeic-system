---
name: mem-search
description: Tìm kiếm ngữ cảnh và truy vấn tri thức lịch sử từ bộ nhớ dài hạn, nhật ký dự án và các ghi chép kiến trúc.
---

# 🔍 Mem Search: Tìm Kiếm Ngữ Cảnh Tri Thức Dài Hạn

Kỹ năng **`mem-search`** giúp AI định vị chính xác quyết định kỹ thuật, quy ước hoặc lý do lựa chọn giải pháp trong quá khứ mà không phải đọc lại toàn bộ lịch sử chat dài dặc.

---

## 🔎 Quy Trình Tìm Kiếm Ngữ Cảnh
1. **Quét File Bộ Nhớ Cục Bộ**: Tìm kiếm trong `.agents/memory/`, `docs/adr/`, hoặc `AGENTS.md`.
2. **Tìm Kiếm Theo Từ Khóa & Ý Định**: Tìm các từ khóa: *"tại sao dùng thư viện X"*, *"lần trước sửa bug Y thế nào"*, *"quy ước đặt tên API"*.
3. **Trích Xuất Tinh Gọn**: Chỉ kéo đúng 2-3 câu trả lời mang tính quyết định đưa vào ngữ cảnh hiện tại, tiết kiệm token tối đa.
