import React from "react";

/**
 * LoadingSpinner Component - Tối ưu tốc độ hiển thị
 * @param {string} size - "sm" | "md" | "lg"
 * @param {string} text - Text hiển thị (để "" nếu không muốn hiện)
 * @param {boolean} fullScreen - Full màn hình hay inline
 * @param {boolean} overlay - Nền mờ overlay
 * @param {number} delay - Delay ms trước khi hiện spinner (tránh flash khi load nhanh)
 */
const LoadingSpinner = ({
  size = "md",
  text = "Chờ xíu nghen…",
  fullScreen = true,
  overlay = true,
  delay = 200,
}) => {
  const [show, setShow] = React.useState(delay === 0);

  // Delay hiển thị: nếu API trả về < 200ms thì KHÔNG hiện spinner
  // → Tránh cảm giác "chớp tắt" khó chịu
  React.useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return null;

  const sizeConfig = {
    sm: { spinner: "w-8 h-8 border-[3px]", text: "text-xs" },
    md: { spinner: "w-14 h-14 border-4", text: "text-sm" },
    lg: { spinner: "w-20 h-20 border-[5px]", text: "text-base" },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  const spinnerContent = (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col justify-center items-center gap-4"
    >
      <div className="relative">
        <div
          className={`${config.spinner} border-gray-700/50 border-t-yellow-400 rounded-full animate-spin`}
          style={{ animationDuration: "0.8s" }}
        />
        <div
          className="absolute inset-2 border-2 border-transparent border-b-yellow-400/60 rounded-full animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.2s" }}
        />
      </div>

      {text && (
        <div className="flex flex-col items-center gap-1">
          <span className="sr-only">Loading…</span>
          <span
            className={`${config.text} font-medium text-gray-200 tracking-wide`}
          >
            {text}
          </span>
          <div className="flex gap-1 mt-1">
            <span
              className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-200 ${
          overlay ? "bg-gray-950/80 backdrop-blur-sm" : "bg-gray-950"
        }`}
      >
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="w-full min-h-[300px] flex items-center justify-center">
      {spinnerContent}
    </div>
  );
};

export default LoadingSpinner;
