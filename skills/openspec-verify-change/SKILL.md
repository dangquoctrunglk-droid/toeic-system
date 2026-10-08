---
name: openspec-verify-change
description: Nghiệm thu và kiểm chứng mã nguồn sau khi triển khai, đối soát từng tiêu chuẩn thành công (Success Criteria) so với đặc tả.
---

# 🎯 OpenSpec Verify Change: Nghiệm Thu & Kiểm Chứng So Khớp Đặc Tả

Kỹ năng **`openspec-verify-change`** đóng vai trò chốt chặn chất lượng: Xác minh rằng mọi điều khoản đã hứa trong `proposal.md` đều đã được hiện thực hóa trọn vẹn và không phát sinh lỗi ngầm.

---

## 📋 Bảng Kiểm Đối Soát Nghiệm Thu
1. **Đối Soát Tính Năng**: Đi qua từng mục trong `proposal.md` và kiểm tra chức năng thực tế.
2. **Kiểm Tra Build & Lint**:
   - `npm run lint` / `yarn lint` ➔ 0 lỗi.
   - `npm run build` / `yarn build` ➔ Biên dịch thành công.
3. **Kiểm Tra Luồng Dữ Liệu**: Gửi thử payload từ giao diện tới API backend, kiểm tra CSDL có lưu đúng cấu trúc không.
4. **Ký Duyệt Nghiệm Thu (Verification Sign-off)**: Ghi lại kết quả test vào phần `verification.md` trước khi tiến hành archive.
