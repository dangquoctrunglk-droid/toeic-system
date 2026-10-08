---
name: design-taste-frontend
description: Khắc phục các giao diện AI nhạt nhẽo (generic gradient, card vô hồn), áp dụng ngôn ngữ thiết kế độc bản, bảng màu bespoke và layout đẳng cấp.
---

# 🎨 Design Taste Frontend: Chống "AI Slop" & Nâng Tầm Thẩm Mỹ Độc Bản

Kỹ năng **`design-taste-frontend`** giúp AI lập trình thoát khỏi tư duy tạo giao diện "AI rập khuôn" (AI Slop: nền tím xanh generic, nút bo tròn lòe loẹt, thẻ card bóng bẩy vô hồn) để tiến thẳng tới đẳng cấp của các Design Studio hàng đầu thế giới (Linear, Stripe, Apple, Teenage Engineering, Raycast).

---

## 🚫 Nhận Diện & Loại Bỏ "AI Slop" (Các Lỗi Thường Gặp Của AI)

1. **AI Slop #1: Gradient tím-xanh ngọc lặp đi lặp lại** (`from-indigo-500 via-purple-500 to-pink-500`).
   - ➔ **Khắc phục**: Dùng bảng màu tinh chế (Bespoke Palette). Dark mode dùng nền chì/đá phiến (`#090d16`, `#0b1329`) kết hợp 1 màu nhấn sắc bén (Emerald-400, Sky-400, hoặc Amber-400).
2. **AI Slop #2: Đổ bóng mờ ảo quá đà** (`shadow-2xl shadow-indigo-500/50`).
   - ➔ **Khắc phục**: Dùng viền siêu mảnh (1px border với `border-slate-800` hoặc `border-white/10`) kết hợp subtle inner shadow để tạo chiều sâu kiến trúc.
3. **AI Slop #3: Card nằm trôi nổi vô nghĩa trên nền**.
   - ➔ **Khắc phục**: Sử dụng bố cục dạng lưới Bento (Bento Grid), chia rãnh rõ ràng, có phân tầng tỷ lệ khung hình (1x1, 2x1, 2x2).
4. **AI Slop #4: Typography lộn xộn, thiếu cá tính**.
   - ➔ **Khắc phục**: Font pairing có chủ đích. Kết hợp font Sans-serif kỹ thuật hiện đại (Inter, Plus Jakarta Sans, Outfit) với Monospace tinh tế cho số liệu/code (JetBrains Mono, Fira Code).

---

## 🏛️ 4 Ngôn Ngữ Thiết Kế Đỉnh Cao

### 1. The Linear / Dark Mode Precision (Kỹ nghệ chính xác cao)
- **Đặc trưng**: Nền tối sâu thẳm, viền vi lượng (`border-white/[0.08]`), đường kẻ phụ hairline, glow cục bộ mờ ảo phía sau đối tượng chính.
- **Micro-detail**:
  ```tsx
  <div className="relative rounded-2xl border border-white/[0.08] bg-slate-900/60 p-6 backdrop-blur-xl shadow-[0_0_1px_1px_rgba(255,255,255,0.05)_inset]">
    <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
  </div>
  ```

### 2. The Editorial Swiss Style (Phong cách Báo chí / Tạp chí Thụy Sĩ)
- **Đặc trưng**: Trọng tâm vào con chữ lớn, khoảng trắng hào phóng (negative space), căn lề dạng lưới báo chí, đen trắng tối giản + 1 điểm nhấn màu duy nhất.
- **Micro-detail**: Headline `tracking-tighter`, `font-serif` cổ điển phối cùng `font-sans` hình học.

### 3. Teenage Engineering / Hardware Feel (Cảm giác Thiết bị Phần cứng)
- **Đặc trưng**: Lấy cảm hứng từ thiết bị điện tử cổ điển: nút gạt xúc giác, màn hình LED dot-matrix, nhãn in dập nổi, góc bo nhỏ (`rounded-md`), thông số kỹ thuật in đậm.

---

## 📋 Tiêu Chuẩn Frontend Thực Chiến
- **Contrast Guard**: Đảm bảo tỷ lệ tương phản văn bản luôn đạt WCAG AA (≥ 4.5:1) và AAA (≥ 7:1) cho text đọc lâu.
- **Subtle Surface Elevation**: Không dùng một màu đen tuyệt đối `#000000`, chia 3 tầng bề mặt:
  - Base: `#080c15`
  - Elevated Card: `#0e1626`
  - Popover / Modal: `#141f36`
- **Tương tác có trọng lượng**: Mỗi nút bấm đều có âm vang xúc giác (`active:scale-[0.98] transition-transform`).
