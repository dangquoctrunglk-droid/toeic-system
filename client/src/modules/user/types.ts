/**
 * ==============================================================================
 * MODULE: types.ts
 * MỤC ĐÍCH: Định nghĩa types, interfaces cho toàn bộ các module trong trang User Profile
 * ==============================================================================
 */

import type { UserStudyGoal } from "../dashboard/types";

export type ProfileTabKey = "info" | "password" | "devices" | "notifications";

export type DeviceType = "desktop" | "mobile" | "tablet";

export interface RememberedDevice {
  id: string;
  name: string;
  registeredAt: string;
  type: DeviceType;
}

export interface CurrentDevice {
  name: string;
  lastActive: string;
}

export interface UserPersonalFormData {
  fullName: string;
  phoneNumber: string;
  birthDate: string;
  gender: "male" | "female" | "other";
}

export interface UserNotificationSettings {
  notifyDaily: boolean;
  reminderTime: string;
  notifyWeeklyEmail: boolean;
  notifyNewTests: boolean;
  soundEffects: boolean;
}

export interface UserProfileProps {
  goal: UserStudyGoal;
  onSaveGoal: (newGoal: UserStudyGoal) => void;
  onOpenGoalModal?: () => void;
}
