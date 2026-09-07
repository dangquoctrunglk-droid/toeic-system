import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
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
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("user", userSchema);
