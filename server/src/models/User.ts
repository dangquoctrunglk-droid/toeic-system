import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash?: string | null;
  role: "student" | "admin";
  authType: "local" | "google";
  googleId?: string | null;
  avatar?: string | null;
  resetPasswordOtp?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: false },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    authType: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: null },
    avatar: { type: String, default: null },
    resetPasswordOtp: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("user", userSchema);
