---
name: qa
description: Kỹ năng kiểm thử chất lượng toàn diện (QA/QC), săn tìm bug, test luồng hành trình người dùng, edge cases, mạng chập chờn và trạng thái rỗng.
---

# 🕵️ QA: Kiểm Thử Toàn Diện & Săn Lỗi Hệ Thống

Kỹ năng **`qa`** mô phỏng người kiểm thử khó tính nhất (adversarial testing) nhằm phát hiện mọi lỗi tiềm ẩn trước khi sản phẩm đến tay người dùng cuối.

---

## 🎯 Ma Trận 5 Góc Độ Kiểm Thử (The 5-Dimension Test Matrix)

### 1. Happy Path vs Edge Cases (Trường Hợp Biên)
- Chuỗi ký tự cực dài (1000+ từ), ký tự đặc biệt (`<script>`, emoji `🔥`, tiếng Ả Rập RTL).
- Số âm, số thập phân lẻ, số 0, hoặc giá trị cực lớn (`Number.MAX_SAFE_INTEGER`).
- Bấm nút nhiều lần liên tiếp (Double/Triple Click Spam) để kiểm tra chống gửi form trùng lặp (debounce/throttle).

### 2. Mạng Yếu & Lỗi Bất Khả Kháng (Degraded Network)
- Mô phỏng mạng chậm (Slow 3G), rớt mạng giữa lúc gửi request (Offline/Timeout).
- API trả về HTTP 500, 502, 401 (Hết hạn token), hoặc dữ liệu JSON bị biến dạng (Malformatted payload).
- UI có hiển thị màn hình báo lỗi thân thiện (Error Boundary / Fallback Screen) hay bị đơ trắng trang (White Screen of Death)?

### 3. Trạng Thái Giao Diện (The 5 States of UI)
Mọi trang hoặc component luôn phải được kiểm tra đủ 5 trạng thái:
- **Ideal State**: Có đầy đủ dữ liệu hoàn hảo.
- **Empty State**: Chưa có dữ liệu (Người dùng mới tạo tài khoản, chưa có ghi chú) ➔ Phải có hình minh họa và nút hướng dẫn bắt đầu.
- **Loading State**: Đang tải ➔ Sử dụng Skeleton Loader khớp với khung dữ liệu thực tế, tránh màn hình giật nhảy layout.
- **Error State**: Lỗi tải dữ liệu ➔ Có nút "Thử lại" (Retry).
- **Partial State**: Chỉ có 1 phần dữ liệu.

### 4. Thiết Bị & Khả Năng Truy Cập (Responsive & A11y)
- Co kéo màn hình từ 320px đến 4K xem có vỡ chữ, tràn ngang (horizontal scrollbar) không.
- Thao tác hoàn toàn bằng phím `Tab`, `Enter`, `Esc`.

---

## 📋 Mẫu Báo Cáo Bug Chuẩn (Bug Ticket)
- **Tên Bug**: [Component] Lỗi văng app khi...
- **Mức Độ**: `Critical` (Chặn luồng) / `High` / `Medium` / `Cosmetic` (Thẩm mỹ).
- **Các Bước Tái Hiện (Steps to Reproduce)**:
  1. Vào màn hình X...
  2. Bấm vào nút Y...
  3. Quan sát kết quả.
- **Kết Quả Mong Đợi (Expected)** vs **Kết Quả Thực Tế (Actual)**.
- **Đề Xuất Khắc Phục (Suggested Fix)**.
