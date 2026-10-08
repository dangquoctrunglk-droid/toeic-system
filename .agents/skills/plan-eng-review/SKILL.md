---
name: plan-eng-review
description: Thẩm định kiến trúc kỹ thuật từ góc nhìn Engineering Manager và Principal Architect (Khả năng mở rộng, bảo mật, điểm nghẽn hiệu năng, SPOF).
---

# 🛡️ Plan Eng Review: Thẩm Định Kiến Trúc Kỹ Thuật (EM & Principal Architect)

Kỹ năng **`plan-eng-review`** đóng vai trò là chốt chặn kỹ thuật tối cao: Soi chiếu mọi đề xuất kiến trúc dưới lăng kính ổn định, chịu tải, bảo mật và khả năng bảo trì lâu dài.

---

## 🔬 6 Tiêu Chí Thẩm Định Kỹ Thuật
1. **Khả Năng Mở Rộng & Chịu Tải (Scalability & Bottlenecks)**:
   - Truy vấn CSDL có bị N+1 không? Có đánh chỉ mục (Index) đúng các trường `where`/`sort` không?
   - Bộ nhớ RAM / CPU có nguy cơ bị rò rỉ (memory leak) do event listener chưa gỡ không?
2. **Điểm Lỗi Đơn Độc (Single Point of Failure - SPOF)**:
   - Nếu dịch vụ bên thứ 3 (OpenAI, Cloudflare, S3) bị sập hoặc nghẽn mạng, hệ thống có cơ chế Fallback / Circuit Breaker không?
3. **Bảo Mật & Toàn Vẹn Dữ Liệu (Security & Data Integrity)**:
   - Các API có xác thực token JWT và kiểm tra quyền (Authorization/RBAC) không?
   - Đầu vào người dùng có qua sanitize / Zod schema validation chống XSS và NoSQL/SQL Injection không?
4. **Tính Tiến Hóa Ngược (Backward Compatibility & Migration Safety)**:
   - Thay đổi schema CSDL có làm đứt gãy các phiên bản app cũ đang chạy trên thiết bị người dùng không?
5. **Độ Phức Tạp Mã Nguồn (Maintainability & Over-engineering)**:
   - Có đang lạm dụng Design Pattern phức tạp khi chỉ cần 1 hàm đơn giản?
6. **Chiến Lược Giám Sát & Rollback (Observability & Revert Plan)**:
   - Có log lỗi rõ ràng (Sentry/Winston) không? Nếu tính năng bị lỗi production, có cờ tắt bật (Feature Flag) để rollback tức thì không?

---

## 📋 Cấu Trúc Báo Cáo Eng Review
- **Đánh Giá Khả Thi**: `SẴN SÀNG TRIỂN KHAI` / `YÊU CẦU SỬA ĐỔI KIẾN TRÚC` / `RỦI RO CAO`.
- **Rủi Ro Trọng Điểm (Red Flags)**: Các điểm nghẽn hoặc lỗ hổng tiềm ẩn.
- **Phương Án Khắc Phục (Actionable Mitigation)**: Đoạn mã hoặc giải pháp kiến trúc thay thế cụ thể.
