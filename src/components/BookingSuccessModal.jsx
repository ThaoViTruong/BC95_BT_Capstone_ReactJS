import React, { useEffect } from "react";

const BookingSuccessModal = ({ isOpen, onConfirm, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 
                 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-white to-gray-50 
                   rounded-3xl shadow-2xl max-w-md w-full 
                   overflow-hidden animate-scaleIn"
      >
        {/* ============ TOP DECORATION - Dải màu gradient ============ */}
        <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500" />

        {/* ============ CLOSE BUTTON ============ */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center 
                     rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 
                     transition-all hover:rotate-90 duration-300 z-10"
          aria-label="Đóng"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pt-10">
          {/* ============ ICON CHECK ANIMATION ============ */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Vòng tròn ping */}
              <div className="absolute inset-0 rounded-full bg-green-400/30 animate-ping" />
              <div className="absolute inset-0 rounded-full bg-green-400/20 animate-pulse" />
              
              {/* Vòng tròn chính */}
              <div className="relative w-24 h-24 rounded-full 
                              bg-gradient-to-br from-green-400 to-emerald-500 
                              flex items-center justify-center 
                              shadow-xl shadow-green-500/40">
                <svg
                  className="w-14 h-14 text-white animate-checkDraw"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* ============ TITLE + DESCRIPTION ============ */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3 
                           bg-gradient-to-r from-green-600 to-emerald-600 
                           bg-clip-text text-transparent">
              Đặt vé thành công!
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              🎉 Cảm ơn bạn đã đặt vé. <br />
              Bạn có thể kiểm tra thông tin trong{" "}
              <span className="font-semibold text-gray-700">
                lịch sử đặt vé
              </span>
              .
            </p>
          </div>

          {/* ============ INFO CARD - Thông báo nhỏ ============ */}
          <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 
                          flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 
                            flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" 
                   stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-blue-900 leading-relaxed">
              Vé điện tử đã được lưu vào tài khoản. Vui lòng đến rạp trước 
              <span className="font-bold"> 15 phút</span> để nhận vé.
            </p>
          </div>

          {/* ============ BUTTONS ============ */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-5 rounded-xl 
                         border-2 border-gray-200 
                         text-gray-700 font-semibold text-sm
                         hover:bg-gray-50 hover:border-gray-300 
                         active:scale-95 transition-all duration-200"
            >
              🎬 Tiếp tục đặt vé
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-5 rounded-xl 
                         bg-gradient-to-r from-blue-500 to-indigo-600 
                         hover:from-blue-600 hover:to-indigo-700 
                         text-white font-bold text-sm
                         shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60
                         active:scale-95 transition-all duration-200
                         flex items-center justify-center gap-2"
            >
              Xem lịch sử
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" 
                   stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        @keyframes scaleIn { 
          from { opacity: 0; transform: scale(0.85) translateY(20px); } 
          to { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes checkDraw { 
          from { stroke-dashoffset: 50; opacity: 0; } 
          to { stroke-dashoffset: 0; opacity: 1; } 
        }
        .animate-fadeIn { 
          animation: fadeIn 0.25s ease-out; 
        }
        .animate-scaleIn { 
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
        }
        .animate-checkDraw { 
          stroke-dasharray: 50; 
          animation: checkDraw 0.6s ease-out 0.3s both; 
        }
      `}</style>
    </div>
  );
};

export default BookingSuccessModal;