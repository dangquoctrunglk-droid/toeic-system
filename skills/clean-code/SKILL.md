---
name: clean-code
description: Quy chuẩn viết code sạch, tinh gọn, tuân thủ nguyên lý SOLID, DRY, KISS, đặt tên biến tự giải thích và cấu trúc dễ bảo trì.
---

# 🧼 Clean Code: Tiêu Chuẩn Viết Code Tinh Gọn & Bền Vững

Kỹ năng **`clean-code`** biến mã nguồn thành một tác phẩm nghệ thuật: Dễ đọc như văn xuôi, dễ mở rộng và không để lại nợ kỹ thuật (Technical Debt).

---

## 💎 5 Nguyên Tắc Vàng
1. **Tên Biến Tự Giải Thích (Self-documenting Names)**: Không dùng tên biến tắt tối nghĩa (`data`, `temp`, `arr`, `cb`). Dùng tên biểu đạt rõ mục đích (`activeListeningSentenceList`, `isSplitterDragging`).
2. **Hàm Nhỏ & Đơn Trách Nhiệm (Single Responsibility Principle)**: Mỗi hàm chỉ làm DUY NHẤT một việc và làm thật tốt việc đó. Độ dài lý tưởng không quá 20-30 dòng.
3. **Thoát Sớm (Early Return Pattern)**: Giảm thiểu độ sâu lồng nhau của các khối `if/else` bằng cách kiểm tra điều kiện lỗi và return ngay ở đầu hàm.
4. **Không Lặp Lại Chính Mình (DRY - Don't Repeat Yourself)**: Trích xuất logic dùng chung thành hàm utility hoặc custom hook.
5. **KISS (Keep It Simple, Stupid)**: Ưu tiên giải pháp đơn giản, minh bạch nhất; không dùng kỹ thuật "ảo ma" làm đồng đội khó hiểu.
