---
name: code-review-skill
description: Quy trình rà soát mã nguồn (Code Review) chuyên sâu, phát hiện bẫy hiệu năng, lỗ hổng bảo mật, lỗi logic và code smell.
---

# 🧐 Code Review Skill: Rà Soát Mã Nguồn Chuyên Sâu

Kỹ năng **`code-review-skill`** thực hiện kiểm tra đa tầng cho mọi Pull Request hoặc file mã nguồn trước khi merge.

---

## 🔍 Bảng Kiểm 5 Tầng Soi Lỗi (5-Layer Code Review)
1. **Lỗi Logic & Bẫy Chạy Ngầm (Logic Bugs & Regressions)**:
   - Có trường hợp biến `null` hoặc `undefined` gây crash runtime không?
   - Mảng rỗng hoặc index `-1` có được kiểm tra an toàn không?
2. **Hiệu Năng & Tối Ưu Render (Performance & React Purity)**:
   - Các hàm gọi trong render / `useMemo` có bị impure (`Date.now()`, `Math.random()`) không?
   - Mảng dependency của `useEffect` / `useCallback` có đầy đủ hoặc bị thừa không?
   - Có re-render không cần thiết trên danh sách lớn không (thiếu `React.memo` hoặc `key` không duy nhất)?
3. **Bảo Mật (Security Vulnerabilities)**:
   - Có hardcode API key, mật khẩu, JWT secret trong code không?
   - Có nguy cơ XSS qua `dangerouslySetInnerHTML` không?
4. **Chuẩn Mực Kiểu Dữ Liệu (TypeScript Strictness)**:
   - Cấm dùng `any` lạm dụng; phải có kiểu dữ liệu cụ thể hoặc `unknown` có type guard.
5. **Khả Năng Đọc & Tinh Gọn (Readability)**:
   - Code có dễ hiểu không? Có comment giải thích các quyết định phi trực giác (non-obvious decisions) không?
