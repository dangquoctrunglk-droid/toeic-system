---
name: openspec-apply-change
description: Thực thi và áp dụng thay đổi mã nguồn bám sát 100% theo tài liệu đặc tả proposal trong chu trình OpenSpec.
---

# ⚙️ OpenSpec Apply Change: Triển Khai Mã Nguồn Theo Đặc Tả

Kỹ năng **`openspec-apply-change`** biến các gạch đầu dòng trong `proposal.md` thành code thực tế chạy mượt mà trên hệ thống.

---

## 🛠️ Quy Trình Triển Khai
1. **Đọc Kỹ Proposal**: Nắm chắc danh sách file cần sửa, kiểu dữ liệu cần thêm, luồng gọi API.
2. **Triển Khai Tuần Tự Theo Từng Khối**:
   - Backend: Models ➔ Services / Controllers ➔ Routes / Middlewares.
   - Frontend: Types ➔ API Client ➔ Hooks / State ➔ UI Components.
3. **Chống Tác Dụng Phụ (Side Effects)**: Không tự ý sửa đổi các file ngoài phạm vi đã nêu trong proposal trừ khi có lý do kỹ thuật phát sinh bất khả kháng.
4. **Kiểm Tra Biên Dịch Liên Tục**: Chạy linter và compiler sau mỗi bước sửa đổi lớn.
