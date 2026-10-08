---
name: strategic-compact
description: Quản lý và nén ngữ cảnh chủ động, phân tích token, loại bỏ dữ liệu rác để tránh tràn context window và duy trì độ sắc bén của AI.
---

# 📦 Strategic Compact: Quản Lý & Nén Ngữ Cảnh Chủ Động

Kỹ năng **`strategic-compact`** giữ cho AI luôn ở trạng thái tư duy sắc bén nhất bằng cách chủ động nén lịch sử trò chuyện khi phiên làm việc phình to.

---

## ⚡ Khi Nào Kích Hoạt?
- Khi cuộc trò chuyện kéo dài trên 30-40 lượt tương tác hoặc số lượng token tiêu thụ vượt quá 60-70% dung lượng Context Window.
- Khi người dùng nhận thấy AI bắt đầu quên các chi tiết đã thảo luận ở đầu phiên hoặc trả lời chậm chạp.

---

## 🧹 Quy Trình 3 Bước Nén Ngữ Cảnh (The Compaction Workflow)
1. **Phân Loại & Lọc Bỏ (Pruning Trash Tokens)**:
   - Loại bỏ các log lỗi terminal dài hàng trăm dòng đã được giải quyết.
   - Loại bỏ các đoạn code nháp / code thử nghiệm đã bị ghi đè.
2. **Trích Xuất Hạt Nhân (Core Essence Extraction)**:
   - Những file nào đã chỉnh sửa thành công?
   - Quyết định kiến trúc nào đã được chốt?
   - Trạng thái kiểm thử hiện tại (đã test pass những gì)?
3. **Tổng Hợp Bản Tóm Lược Tinh Hoa (Executive Context Snapshot)**:
   - Tạo bản snapshot ngắn gọn (dưới 500 token) chứa toàn bộ linh hồn của phiên làm việc để làm điểm tựa tiếp tục nhiệm vụ mới mà không bị mất dấu.
