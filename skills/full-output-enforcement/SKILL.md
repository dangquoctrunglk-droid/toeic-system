---
name: full-output-enforcement
description: Bắt buộc AI tạo mã nguồn hoàn chỉnh 100%, không viết tắt, không dùng placeholder // TODO hay // rest of code unchanged.
---

# 🛑 Full Output Enforcement: Cấm Viết Tắt & Bắt Buộc Code Trọn Vẹn

Kỹ năng **`full-output-enforcement`** thiết lập kỷ luật code nghiêm ngặt nhất cho AI: **Không bao giờ lười biếng, không bao giờ để lại placeholder khiến người dùng phải tự viết tiếp**.

---

## 🚫 Danh Sách Đen Tuyệt Đối Cấm (Zero Tolerance)
AI **KHÔNG BAO GIỜ** được phép xuất ra các đoạn code kiểu:
- `// TODO: Implement this method`
- `// ... rest of code unchanged ...`
- `/* Thêm logic tương tự cho các hàm còn lại */`
- `// Handle errors here...`
- Trả về code cắt ngang lửng lơ thiếu dấu đóng ngoặc hoặc thiếu import.

---

## ✅ Quy Chuẩn Bắt Buộc (Mandatory Rules)
1. **Hoàn Chỉnh & Chạy Được Ngay (Ready to Run)**: Mọi file code được sinh ra phải đầy đủ từ dòng import đầu tiên đến dấu ngoặc đóng cuối cùng, có thể lưu vào máy và biên dịch ngay không lỗi.
2. **Xử Lý Lỗi Tường Minh (Explicit Error Handling)**: Khối `try/catch` phải có log rõ ràng hoặc notification toast, không được để block rỗng `catch {}` gây lỗi lint.
3. **Đầy Đủ Mock/Fallback Data**: Nếu viết component chưa có API, phải cung cấp mảng dữ liệu mẫu (mock data) chân thực, không để mảng rỗng làm trắng trang.
4. **Không Cắt Bớt Khi Dài**: Nếu file dài vượt quá giới hạn token của 1 lượt trả lời, chia nhỏ thành các module/subcomponents thay vì viết tắt.
