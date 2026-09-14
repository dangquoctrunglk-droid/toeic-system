export interface User {
  id: string;
  fullname: string;
  email: string;
  role: "student" | "admin";
}
export interface AuthResponse {
  token?: string;
  user: User;
  message: string;
}

export interface LoginInputs {
  email: string;
  password: string;
}

export interface RegisterInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
