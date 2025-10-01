import React from "react";
import "./CallQuality.css";
import { CallQualityProps } from "@/shared/types";

const CallQuality: React.FC<CallQualityProps> = ({ quality }) => {
  const getQualityConfig = (quality: string) => {
    switch (quality) {
      case "bad":
        return {
          text: "Плохо",
          className: "quality-bad",
        };
      case "good":
        return {
          text: "Хорошо",
          className: "quality-good",
        };
      case "excellent":
        return {
          text: "Отлично",
          className: "quality-excellent",
        };
      default:
        return {
          text: "Хорошо",
          className: "quality-good",
        };
    }
  };

  const config = getQualityConfig(quality);

  return (
    <div className={`call-quality ${config.className}`}>
      {config.text}
    </div>
  );
};

export default CallQuality;
