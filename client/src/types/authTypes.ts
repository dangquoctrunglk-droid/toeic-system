export interface User {
  id?: string;
  _id?: string;
  fullName?: string;
  fullname?: string;
  email: string;
  role: "student" | "admin";
  avatar?: string;
}
export interface AuthResponse {
  token?: string;
  user?: User;
  message: string;
  devOtp?: string;
}

export interface SigninInputs {
  email: string;
  password: string;
}

export interface SignupInputs {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ForgotPasswordInputs {
  email: string;
}

export interface ResetPasswordInputs {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}

export interface GoogleAuthInputs {
  credential?: string;
  email?: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

export interface GoogleCredentialResponse {
  credential?: string;
  select_by?: string;
  clientId?: string;
}

export interface GoogleIdConfiguration {
  client_id: string;
  callback?: (response: GoogleCredentialResponse) => void | Promise<void>;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  context?: string;
}

export interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void;
  prompt: (momentListener?: (promptMoment: unknown) => void) => void;
  renderButton?: (parent: HTMLElement, options?: Record<string, unknown>) => void;
  disableAutoSelect?: () => void;
  revoke?: (hint: string, done?: (done: unknown) => void) => void;
}

export interface GoogleAccounts {
  id?: GoogleAccountsId;
}

export interface GoogleOAuth {
  accounts?: GoogleAccounts;
}

declare global {
  interface Window {
    google?: GoogleOAuth;
  }
}

