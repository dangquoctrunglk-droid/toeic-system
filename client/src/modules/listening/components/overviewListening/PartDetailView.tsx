import type React from "react";
import { PartPracticeCard } from "././PartPracticeCard";
import type { PartDetailedConfig } from "../../types";

/**
 * ==============================================================================
 * COMPONENT: PartDetailView.tsx
 * MỤC ĐÍCH: Khung hiển thị chi tiết khi chọn tab Part 1, Part 2, Part 3, Part 4 (Chuẩn Ảnh 2, 3, 4, 5)
 * CẤU TRÚC:
 *   1. Lưới 4 Thẻ phân cấp Level (Level 1 Dưới 200, Level 2 200-300, Level 3 300-400, Level 4 400-495)
 *   2. Tiêu đề nhóm chủ đề chuyên biệt (Theo dạng tranh / Theo dạng câu hỏi / Dạng đặc biệt)
 *   3. Dòng mô tả giải thích ngắn
 *   4. Lưới các thẻ chủ đề chi tiết (Tranh một người, Tranh nhiều người, Câu hỏi Who/When/Where/Why, Có hình bảng biểu,...)
 * ==============================================================================
 */

import type { VocabItem } from "../../types";

interface PartDetailViewProps {
  config: PartDetailedConfig;
  onStartLearning: (cardId: string) => void;
  onRetryWrong?: (cardId: string) => void;
  onResetProgress?: (cardId: string) => void;
  isDarkMode: boolean;
  userKey?: string;
  savedVocabs?: VocabItem[];
}

export const PartDetailView: React.FC<PartDetailViewProps> = ({
  config,
  onStartLearning,
  onRetryWrong,
  onResetProgress,
  isDarkMode,
  userKey,
  savedVocabs,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. KHỐI 4 CẤP ĐỘ LEVEL 1 - 4 (1 hàng ngang 4 cột trên màn hình lớn) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {config.levels.map((levelCard) => (
          <PartPracticeCard
            key={levelCard.id}
            card={levelCard}
            part={config.part}
            onStartLearning={onStartLearning}
            onRetryWrong={onRetryWrong}
            onResetProgress={onResetProgress}
            isDarkMode={isDarkMode}
            userKey={userKey}
            savedVocabs={savedVocabs}
          />
        ))}
      </div>

      {/* 2. KHỐI THEO CHỦ ĐỀ / DẠNG CÂU HỎI / DẠNG ĐẶC BIỆT */}
      <div className="space-y-4 pt-2">
        <div>
          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight mb-1.5 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {config.topics.categoryTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {config.topics.categorySubtitle}
          </p>
        </div>

        {/* Lưới các thẻ chủ đề tương ứng (1 hàng ngang 4 cột trên màn hình lớn) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {config.topics.cards.map((topicCard) => (
            <PartPracticeCard
              key={topicCard.id}
              card={topicCard}
              part={config.part}
              onStartLearning={onStartLearning}
              onRetryWrong={onRetryWrong}
              onResetProgress={onResetProgress}
              isDarkMode={isDarkMode}
              userKey={userKey}
              savedVocabs={savedVocabs}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
