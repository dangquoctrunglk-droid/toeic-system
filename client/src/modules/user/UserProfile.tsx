import type React from "react";
import { useState } from "react";
import { useTheme } from "../../context";
import type { ProfileTabKey, UserProfileProps } from "./types";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { ProfileInfoTab } from "./components/ProfileInfoTab";
import { ChangePasswordTab } from "./components/ChangePasswordTab";
import { DevicesTab } from "./components/DevicesTab";
import { NotificationsTab } from "./components/NotificationsTab";

export const UserProfile: React.FC<UserProfileProps> = ({
  goal,
  onSaveGoal,
  onOpenGoalModal,
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<ProfileTabKey>("info");

  return (
    <div className="mt-4 mb-12">
      <div className="flex flex-col md:flex-row gap-5 lg:gap-8 items-start">
        {/* ASIDE BÊN TRÁI: ĐIỀU HƯỚNG CÁC TAB */}
        <ProfileSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isDarkMode={isDarkMode}
        />

        {/* NỘI DUNG CHÍNH BÊN PHẢI (HIỂN THỊ TƯƠNG ỨNG THEO TAB) */}
        <section className="flex-1 w-full min-w-0">
          {activeTab === "info" && (
            <ProfileInfoTab
              goal={goal}
              onSaveGoal={onSaveGoal}
              onOpenGoalModal={onOpenGoalModal}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === "password" && (
            <ChangePasswordTab isDarkMode={isDarkMode} />
          )}

          {activeTab === "devices" && <DevicesTab isDarkMode={isDarkMode} />}

          {activeTab === "notifications" && (
            <NotificationsTab isDarkMode={isDarkMode} />
          )}
        </section>
      </div>
    </div>
  );
};

export default UserProfile;
