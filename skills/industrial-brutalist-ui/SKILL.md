---
name: industrial-brutalist-ui
description: Thiết kế giao diện thô mộc công nghiệp (Industrial Brutalism), phong cách trạm điều khiển kỹ thuật, terminal hacker và tactile hardware.
---

# 🏭 Industrial Brutalist UI: Kỹ Thuật Thô Mộc & Trạm Điều Khiển Hacker

Kỹ năng **`industrial-brutalist-ui`** mang lại cảm giác mạnh mẽ, chính xác và chuyên nghiệp của các bảng điều khiển công nghiệp (NASA workstation, Bloomberg Terminal, Teenage Engineering, máy CNC).

---

## ⚙️ Đặc Trưng Thị Giác
1. **Góc Vuông Tuyệt Đối**: Không bo góc (`rounded-none`) hoặc bo cực nhỏ (`rounded-sm`).
2. **Monospace & Chữ Kỹ Thuật**: Dùng font monospace (Geist Mono, JetBrains Mono, Space Mono) cho metadata, nhãn hệ thống, và các chỉ số đo lường.
3. **Đường Kẻ Lưới Kỹ Thuật (Technical Grid & Crosshairs)**:
   - Các đường kẻ phân vùng rõ rệt (`border-2 border-black` trong light mode hoặc `border-white/20` trong dark mode).
   - Ký hiệu dấu cộng góc `+`, tọa độ `[01:A]`, chỉ số hex `#0F24`.
4. **Màu Nhấn Công Nghiệp (Hazard Accents)**:
   - Vàng an toàn công nghiệp (`#eab308` / Amber-400), Cam neon hoặc Xanh phosphor (`#22c55e`).
5. **Nút Bấm Xúc Giác Nặng Đô (Hard Drop Shadows)**:
   - Đổ bóng dạng khối đặc (Brutalist hard shadow): `shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`.
   - Khi bấm (`active`): Đẩy lùi về góc để triệt tiêu bóng: `active:translate-x-1 active:translate-y-1 active:shadow-none`.

---

## 🛠️ Mã Mẫu Thực Chiến (Tailwind CSS)
```tsx
<button className="border-2 border-black bg-amber-400 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:bg-amber-300 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none">
  [ RUN_DIAGNOSTICS_SYS ]
</button>
```
