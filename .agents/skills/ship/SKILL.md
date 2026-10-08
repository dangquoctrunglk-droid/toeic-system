---
name: ship
description: Quy trình tự động hóa kiểm tra trước khi phát hành (Pre-flight checklist), build production, kiểm tra lint, tạo changelog và đóng gói release.
---

# 🚀 Ship: Quy Trình Đóng Gói & Phát Hành Tính Năng (Production Release)

Kỹ năng **`ship`** đảm bảo sản phẩm khi đẩy lên máy chủ production không bao giờ gặp sự cố "ở máy em chạy bình thường nhưng lên server thì hỏng".

---

## ✈️ Danh Sách Kiểm Tra Tiền Bay (Pre-flight Checklist)
Trước khi merge code hoặc release:
1. **Lint Check**: Chạy `yarn lint` / `npm run lint` ➔ Phải đạt **0 errors, 0 warnings**.
2. **Build Check**: Chạy `yarn build` / `npm run build` (bao gồm TypeScript `tsc -b`) ➔ Phải biên dịch thành công 100%.
3. **Environment Variables**: Kiểm tra toàn bộ biến môi trường `.env.example` có đầy đủ các key mới thêm không (không commit secret key thật lên git).
4. **Console Cleanliness**: Xóa sạch mọi câu lệnh debug `console.log()` tạm bợ trong code.
5. **Database Migration Safety**: Đảm bảo migration chạy được cả chiều xuôi (`up`) và chiều ngược (`down/rollback`).

---

## 📦 Quy Trình Đóng Gói 4 Bước
- **Bước 1**: Kiểm tra trạng thái Git (`git status`) đảm bảo không sót file chưa theo dõi.
- **Bước 2**: Thực hiện chạy test & build tự động.
- **Bước 3**: Tạo bản ghi Changelog tóm lược các tính năng mới, lỗi đã vá và breaking changes.
- **Bước 4**: Tạo Git Tag phiên bản (ví dụ: `v1.2.0`) và hướng dẫn lệnh deploy tương ứng.
