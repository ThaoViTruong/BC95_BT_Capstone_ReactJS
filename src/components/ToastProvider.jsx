import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon, faXmark } from "../utils/fontAwesome";

const TOAST_DURATION = 2000;

const ToastContext = createContext(null);

const toastTypeConfig = {
  success: {
    accentClassName:
      "border-emerald-400/40 bg-[#0b1f1a] text-white shadow-[0_16px_50px_rgba(16,185,129,0.22)]",
    badgeClassName: "bg-emerald-400/25 text-emerald-100",
    title: "Thành công",
  },
  error: {
    accentClassName:
      "border-red-400/40 bg-[#2a1114] text-white shadow-[0_16px_50px_rgba(239,68,68,0.22)]",
    badgeClassName: "bg-red-400/25 text-red-100",
    title: "Thất bại",
  },
};

const ToastViewport = ({ toast, onClose }) => {
  if (!toast) {
    return null;
  }

  const toastConfig = toastTypeConfig[toast.type] || toastTypeConfig.success;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[120] w-[min(92vw,380px)]">
      <div
        className={`pointer-events-auto overflow-hidden rounded-2xl border transition-all duration-300 ${toastConfig.accentClassName}`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="min-w-0 flex-1">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${toastConfig.badgeClassName}`}
            >
              {toast.title || toastConfig.title}
            </span>
            <p className="mt-2 text-sm font-semibold leading-6 text-white">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/10 px-2 py-1 text-xs font-semibold text-white/85 transition hover:bg-white/20 hover:text-white"
            aria-label="Đóng thông báo"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef(null);

  const clearToastTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearToastTimer();
    setToast(null);
  }, [clearToastTimer]);

  const showToast = useCallback(
    ({ type = "success", title, message }) => {
      clearToastTimer();
      setToast({
        id: Date.now(),
        type,
        title,
        message,
      });

      timeoutRef.current = setTimeout(() => {
        setToast(null);
        timeoutRef.current = null;
      }, TOAST_DURATION);
    },
    [clearToastTimer],
  );

  useEffect(() => {
    return () => {
      clearToastTimer();
    };
  }, [clearToastTimer]);

  const contextValue = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport toast={toast} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast phải được dùng bên trong ToastProvider");
  }

  return context;
};
