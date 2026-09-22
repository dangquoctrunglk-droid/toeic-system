// Cấu hình biến môi trường cho Frontend (Vite)
// Lưu ý: Trên trình duyệt (Vite), không dùng dotenv hay process.env (Node.js) mà dùng import.meta.env

export const env = {
  GOOGLE_CLIENT_ID:
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "533985869776-8uo8m21r8bbf2dol33t06fe5n2tspk5i.apps.googleusercontent.com",
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1",
};
