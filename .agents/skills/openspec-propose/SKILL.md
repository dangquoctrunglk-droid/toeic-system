---
name: openspec-propose
description: Khởi tạo đề xuất đặc tả thay đổi phần mềm (Change Proposal) theo chu trình OpenSpec trước khi viết code thật.
---

# 📝 OpenSpec Propose: Lập Đề Xuất Đặc Tả Thay Đổi Phần Mềm

Kỹ năng **`openspec-propose`** áp dụng triết lý *Spec-First Development*: **Viết đặc tả rõ ràng trước, lập trình bám sát sau**, loại bỏ hoàn toàn tình trạng code nhầm hướng, hiểu sai yêu cầu.

---

## 📑 Cấu Trúc File Proposal (`openspec/changes/<change-name>/proposal.md`)

1. **Why (Bối Cảnh & Động Lực)**: Vấn đề cần giải quyết là gì? Tại sao giải pháp này lại cần thiết?
2. **What (Đặc Tả Kỹ Thuật)**:
   - Các API endpoints mới / thay đổi (Input / Output schema).
   - Thay đổi mô hình dữ liệu (Database Schema / Models).
   - Luồng giao diện người dùng (UI Components & State).
3. **Impact Analysis (Phân Tích Tác Động)**: Có ảnh hưởng gì tới các tính năng cũ đang chạy không? Có breaking change không?
4. **Step-by-Step Execution Plan**: Danh sách các đầu việc cụ thể sẽ thực hiện tuần tự.
5. **Success Metrics**: Tiêu chuẩn nghiệm thu định lượng để coi là hoàn thành.
