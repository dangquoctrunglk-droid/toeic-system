---
name: database-design
description: Thiết kế cơ sở dữ liệu quan hệ (PostgreSQL/MySQL) và NoSQL (MongoDB), chuẩn hóa thực thể, chiến lược indexing và tối ưu truy vấn.
---

# 🗄️ Database Design: Thiết Kế & Tối Ưu Cơ Sở Dữ Liệu Chuyên Sâu

Kỹ năng **`database-design`** đảm bảo nền móng dữ liệu vững chắc, truy vấn tốc độ cao và toàn vẹn giao dịch ngay cả khi hệ thống đạt hàng triệu bản ghi.

---

## 🏗️ Nguyên Tắc Thiết Kế CSDL
1. **Chuẩn Hóa vs Phi Chuẩn Hóa (Normalization vs Denormalization)**:
   - Dữ liệu tài chính, user, xác thực: Chuẩn hóa 3NF để đảm bảo tính nhất quán (ACID).
   - Dữ liệu hiển thị thường xuyên đọc nhiều hơn ghi (Feed, bài luyện thi, danh sách câu hỏi): Nhúng trực tiếp hoặc lưu cache denormalized để giảm `JOIN` đắt đỏ.
2. **Chiến Lược Đánh Chỉ Mục (Indexing Strategy)**:
   - Luôn index các trường khóa ngoại, trường lọc trong mệnh đề `WHERE`, trường sắp xếp `SORT/ORDER BY`.
   - Sử dụng Compound Index theo thứ tự: Equality ➔ Range ➔ Sort (Quy tắc ESR).
3. **Mềm Dẻo Xóa (Soft Delete)**: Sử dụng cờ `deletedAt: Date | null` thay vì xóa cứng (`hard delete`) làm mất dữ liệu kiểm toán.
4. **Id Bất Biến**: Sử dụng UUID v7 (sắp xếp được theo thời gian) hoặc CUID2/ULID thay vì số nguyên tự tăng tuần tự (Auto-increment ID) để tránh lộ số lượng người dùng và hỗ trợ phân tán.
