---
name: impeccable
description: Kỹ năng trau chuốt UI đa nền tảng (Web, iOS, Android), audit spacing, micro-interactions và typography hierarchy. Giúp loại bỏ hoàn toàn AI slop, nâng tầm giao diện lên chuẩn Design Engineer cao cấp.
---

# 💎 Impeccable: Kỹ Năng Trau Chuốt UI Đa Nền Tảng & Audit Thẩm Mỹ Đỉnh Cao

Kỹ năng **`impeccable`** biến một giao diện "chạy được nhưng thô ráp, nhạt nhẽo (AI slop)" thành một sản phẩm công nghệ cao cấp (**Apple / Linear / Vercel level**). Kỹ năng này tập trung vào 4 trụ cột: **Audit Spacing (Hệ thống khoảng cách)**, **Typography Hierarchy (Phân tầng thị giác con chữ)**, **Micro-interactions (Tương tác vi mô sống động)**, và **Cross-platform Polish (Trau chuốt đa nền tảng Web, iOS, Android)**.

---

## 🎯 Khi Nào Kích Hoạt Kỹ Năng Này?
- Khi người dùng yêu cầu: *"trau chuốt UI"*, *"làm đẹp giao diện"*, *"audit spacing"*, *"tối ưu micro-interactions"*, *"sửa typography"*, *"làm giao diện sang xịn mịn hơn"*, *"đưa UI lên chuẩn Apple/Linear"*.
- Trước khi release một tính năng hoặc màn hình trọng điểm (Homepage, Learning Room, Exam Flow, Dashboard).
- Khi review pull request hoặc refactor component frontend.

---

## 📐 1. Audit Spacing & Nhịp Điệu Không Gian (Spatial Cadence)

### A. Quy Tắc 4pt / 8pt Grid Tuyệt Đối
Mọi kích thước padding, margin, gap, width, height đều phải là bội số của `4px` (hoặc `8px` cho layout lớn):
- **4px (`0.25rem` / `p-1`)**: Spacing siêu nhỏ giữa icon và text badge, border offset.
- **8px (`0.5rem` / `p-2`)**: Khoảng cách bên trong button nhỏ, item con trong list, gap giữa badge.
- **12px (`0.75rem` / `p-3`)**: Padding cho ô input tiêu chuẩn, thẻ phụ kiện.
- **16px (`1rem` / `p-4`)**: Padding cơ bản cho card di động, khoảng cách giữa các khối liên quan mật thiết.
- **24px (`1.5rem` / `p-6`)**: Padding chuẩn cho card desktop, khoảng cách giữa các phần trong một module.
- **32px / 48px / 64px (`p-8`, `p-12`, `p-16`)**: Khoảng cách ngăn cách các section lớn.

### B. Luật Gần Nhau (Law of Proximity & Optical Balance)
- **Khoảng cách bên trong (Inner Spacing)** của một thẻ luôn **nhỏ hơn** khoảng cách giữa thẻ đó với thẻ bên cạnh (**Outer Spacing**).
- **Tiêu đề và nội dung con**: `Margin-bottom` của tiêu đề (Heading) đến đoạn văn (Paragraph) phải luôn nhỏ hơn khoảng cách từ đoạn văn đến phần tử tiếp theo.
- **Optical Alignment (Canh lề quang học)**:
  - Icon hình tam giác (Play button), icon tròn hoặc mũi tên lệch tâm luôn cần offset bù trừ `1-2px` để trông cân bằng mắt người nhìn.
  - Text có dấu hoặc ký hiệu tiền tệ phải được căn chỉnh baseline chuẩn, tránh nhảy dòng.

---

## 🔤 2. Typography Hierarchy (Phân Tầng Con Chữ Chuẩn Mực)

### A. Tỷ Lệ Type Scale Chuẩn (Major Third: 1.25 hoặc Perfect Fourth: 1.333)
1. **Display / Hero**: `32px` - `48px` (Font-weight: `800` - `900`, Tracking: `-0.03em / tracking-tight`, Line-height: `1.1`).
2. **H1 (Page Title)**: `24px` - `28px` (Font-weight: `700`, Tracking: `-0.025em`, Line-height: `1.25`).
3. **H2 (Section Header)**: `20px` - `22px` (Font-weight: `600`, Tracking: `-0.02em`, Line-height: `1.3`).
4. **H3 (Card Header)**: `16px` - `18px` (Font-weight: `600`, Tracking: `-0.01em`, Line-height: `1.4`).
5. **Body (Nội dung chính)**: `14px` - `15px` (Font-weight: `400` - `500`, Line-height: `1.5` - `1.6`).
6. **Caption / Metadata / Badges**: `11px` - `12px` (Font-weight: `600`, Tracking: `+0.04em / tracking-wider`, Thường viết `UPPERCASE`).

### B. Tracking (Letter-spacing) Đảo Nghịch
- Chữ **càng to** (Headings, Display) ➔ Tracking **càng âm** (tighter: `-0.02em` đến `-0.04em`) để chữ kết dính, sang trọng.
- Chữ **càng nhỏ** (Labels, Badges, All-caps) ➔ Tracking **càng dương** (wider: `+0.03em` đến `+0.06em`) để dễ đọc và thanh thoát.

### C. Độ Tương Phản Màu Chữ (Contrast Hierarchy)
- **Primary Text**: Độ tương phản tối đa (Dark mode: `text-slate-100` / `#f8fafc`, Light mode: `text-slate-900` / `#0f172a`).
- **Secondary Text**: Hướng dẫn, mô tả phụ (Dark mode: `text-slate-400` / `#94a3b8`, Light mode: `text-slate-600` / `#475569`).
- **Muted / Tertiary Text**: Timestamp, metadata (Dark mode: `text-slate-500` / `#64748b`, Light mode: `text-slate-400` / `#94a3b8`).
- **Accent Text**: Từ khóa quan trọng, highlight (Cyan/Sky/Indigo Tailored: `text-sky-400`, `text-indigo-400`).

---

## ✨ 3. Micro-interactions & Tactile Feel (Tương Tác Vi Mô)

Mỗi tương tác click/hover phải đem lại cảm giác xúc giác (tactile feeling) chân thực:

### A. Các Trạng Thái Phải Có Cho Mọi Nút & Card
1. **Default**: Trạng thái nghỉ thanh lịch, viền mờ tinh tế (`border-slate-800/80` hoặc `border-slate-200/80`).
2. **Hover**:
   - Tăng độ sáng viền hoặc thêm hiệu ứng glow nhẹ: `hover:border-sky-500/50 hover:bg-slate-800/40`.
   - Nâng nhẹ bề mặt: `hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200`.
3. **Active (Khi click/chạm ngón tay)**:
   - Co nhẹ để tạo cảm giác nhấn cơ học (Tactile press): `active:scale-[0.97] duration-75`.
4. **Focus-visible**:
   - Outline rõ ràng bằng màu nhấn: `focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2`.
5. **Disabled**:
   - `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`.

### B. Easing Curve Chuyên Nghiệp (Thay Vì Linear)
- Không dùng animation đều đều kiểu máy móc (`linear` hay `ease-in`).
- Sử dụng **Spring Curve** hoặc **Custom Bezier**:
  - Bung mở modal / Drawer: `cubic-bezier(0.16, 1, 0.3, 1)` (Out-Expo).
  - Thu vào / Đóng: `cubic-bezier(0.7, 0, 0.84, 0)`.
  - Phản hồi nút bấm: `duration-150 ease-out`.

---

## 📱 4. Cross-Platform Polish (Web, iOS, Android)

### A. Web & PWA
- **Scrollbar**: Loại bỏ thanh cuộn xám xấu xí mặc định; thay bằng custom scrollbar siêu mảnh (`w-1.5`, `rounded-full`, màu mờ).
- **Prevent Text Selection Glitches**: Các nút điều hướng, toolbar, canvas, card lật phải có `select-none` để tránh vô tình bôi đen xanh khi tương tác nhanh.
- **Overscroll Behavior**: Sử dụng `overscroll-contain` ở modal / drawer để không làm cuộn trang chính bên dưới.

### B. iOS Safari & Human Interface Guidelines
- **Safe Area Insets**: Hỗ trợ notch tai thỏ và home indicator: `pb-[env(safe-area-inset-bottom)]`, `pt-[env(safe-area-inset-top)]`.
- **Dynamic Island & Touch Targets**: Vùng chạm ngón tay tối thiểu `44x44px` (Touch target size).
- **Haptic Simulation**: Cảm giác rung ảo phản hồi khi bấm nút hoàn thành, nộp bài, hoặc chọn đáp án đúng.
- **Backdrop Blur (Glassmorphism)**: `backdrop-blur-md bg-slate-900/80` tái hiện giao diện iOS nguyên bản.

### C. Android Material 3 Guidelines
- **Touch Targets**: Tối thiểu `48x48dp`.
- **Ripple Effect**: Phản hồi sóng loang chạm nhẹ nhàng, không chói mắt.
- **Contrast Adaptation**: Giữ độ tương phản WCAG AA ngay cả dưới ánh sáng mặt trời mạnh.

---

## 📋 5. Bảng Checklist Audit Nhanh (Impeccable Audit Rubric)

| Tiêu Chí | Kiểm Tra | Điểm Đạt Chuẩn |
| :--- | :--- | :--- |
| **Grid & Spacing** | Khoảng cách có chia hết cho 4/8px không? Thẻ có bị dính sát mép không? | Các padding/gap đồng nhất, không dùng số lẻ vô căn cứ. |
| **Visual Hierarchy** | Người dùng có nhận ra đâu là điểm quan trọng nhất trong 3 giây không? | Tiêu đề đậm rõ, nội dung phụ dịu mắt, nút CTA nổi bật nhất. |
| **Micro-interaction** | Nút có hiệu ứng co lại khi bấm (`active:scale-[0.98]`) và đổi viền khi hover không? | Mọi phần tử bấm được đều có phản hồi thị giác tức thì. |
| **Touch Ergonomics** | Vùng chạm trên màn hình cảm ứng có đủ lớn (`≥ 44px`) không? | Ngón tay bấm dễ dàng, không bị chạm nhầm nút bên cạnh. |
| **Dark Mode Depth** | Nền tối có chiều sâu (Surface Elevation) thay vì một màu đen xì `#000` không? | Sử dụng dải Slate (`#0b1329` ➔ `#1e293b`) tạo tầng lớp không gian. |
| **Font Rendering** | Text có bật khử răng cưa `antialiased` không? Dấu cách dòng có thoáng không? | Text sắc nét, `leading-relaxed`, không bị bí bách. |

---

## 🛠️ 6. Quy Trình 4 Bước Thực Thi (Actionable Workflow)

1. **Khảo sát & Đo đạc (Measure)**: Soi mã nguồn CSS / Tailwind, liệt kê các padding, gap, font-size đang bị lệch chuẩn hoặc không đồng bộ.
2. **Thiết lập Design Tokens**: Chuẩn hóa biến màu nhấn, font scale, border radius (`rounded-xl` / `rounded-2xl` cho card hiện đại).
3. **Trau chuốt Tương tác (Enrich Interactivity)**: Bổ sung transitions, hover glow, active press, tooltips hướng dẫn, custom scrollbar.
4. **Kiểm thử Đa Màn Hình (Cross-Device Testing)**: Kiểm tra ở các breakpoint Desktop (1440px), Laptop (1024px), Tablet (768px) và Mobile (375px/390px).
