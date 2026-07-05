import React from "react";

/**
 * LoadingSpinner Component
 * @param {string} size - "sm" | "md" | "lg" - kích thước spinner
 * @param {string} text - Text hiển thị
 * @param {boolean} fullScreen - Có full màn hình không (mặc định true)
 * @param {boolean} overlay - Có nền mờ overlay không
 */
const LoadingSpinner = ({
  size = "md",
  text = "Chờ xíu nghen…",
  fullScreen = true,
  overlay = true,
}) => {
  // Cấu hình size
  const sizeConfig = {
    sm: { spinner: "w-8 h-8 border-[3px]", text: "text-xs" },
    md: { spinner: "w-14 h-14 border-4", text: "text-sm" },
    lg: { spinner: "w-20 h-20 border-[5px]", text: "text-base" },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Nội dung spinner
  const spinnerContent = (
    <div
      role="status"
      className="flex flex-col justify-center items-center gap-4"
    >
      {/* Spinner với 2 vòng */}
      <div className="relative">
        {/* Vòng ngoài - quay chậm */}
        <div
          className={`${config.spinner} border-gray-700/50 border-t-yellow-400 rounded-full animate-spin`}
        />
        {/* Vòng trong - quay ngược lại tạo hiệu ứng */}
        <div
          className={`absolute inset-2 border-2 border-transparent border-b-yellow-400/60 rounded-full animate-spin`}
          style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
        />
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-1">
        <span className="sr-only">Loading…</span>
        <span
          className={`${config.text} font-medium text-gray-200 animate-pulse tracking-wide`}
        >
          {text}
        </span>
        {/* 3 chấm nhảy */}
        <div className="flex gap-1 mt-1">
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );

  // Chế độ full screen với overlay
  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center ${
          overlay
            ? "bg-gray-950/80 backdrop-blur-sm"
            : "bg-gray-950"
        }`}
      >
        {spinnerContent}
      </div>
    );
  }

  // Chế độ inline (dùng bên trong section nhỏ)
  return (
    <div className="w-full min-h-[300px] flex items-center justify-center">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;