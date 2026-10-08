---
name: openspec-archive-change
description: Lưu trữ và đóng đề xuất thay đổi sau khi đã triển khai và nghiệm thu thành công trong chu trình OpenSpec.
---

# 📦 OpenSpec Archive Change: Lưu Trữ & Đóng Đề Xuất Thay Đổi

Kỹ năng **`openspec-archive-change`** thực hiện khép lại vòng đời của một tính năng: Di chuyển thư mục từ `openspec/changes/<change-name>/` sang `openspec/archive/` kèm dấu thời gian hoàn thành.

---

## 🏁 Các Bước Lưu Trữ
1. **Kiểm Tra Điều Kiện Tiên Quyết**: Đảm bảo bước `verify` đã hoàn thành và code đã được merge vào nhánh chính.
2. **Cập Nhật Trạng Thái**: Đánh dấu `status: archived` và ghi nhận ngày hoàn thành.
3. **Cập Nhật Tài Liệu Tổng (Global Spec / Architecture Docs)**: Đưa các schema mới hoặc API mới vào tài liệu kiến trúc chính của dự án.
4. **Di Chuyển File**: Đóng gói vào thư mục `openspec/archive/<YYYY-MM-DD-change-name>/`.
