import type React from "react";
import { UserProfile } from "../user";
import type { UserProfileProps } from "../user";

/**
 * ==============================================================================
 * MODULE: UserProfileSection.tsx
 * GHI CHÚ: Wrapper tương thích ngược. Toàn bộ logic đã được chuyển sang `src/modules/user`
 * và được module hoá thành từng component độc lập:
 *   - ProfileSidebar.tsx
 *   - ProfileInfoTab.tsx
 *   - ChangePasswordTab.tsx
 *   - DevicesTab.tsx
 *   - NotificationsTab.tsx
 * ==============================================================================
 */

export type UserProfileSectionProps = UserProfileProps;

export const UserProfileSection: React.FC<UserProfileSectionProps> = (props) => {
  return <UserProfile {...props} />;
};

export default UserProfileSection;
