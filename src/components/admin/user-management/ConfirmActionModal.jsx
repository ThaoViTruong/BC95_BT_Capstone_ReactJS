const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  isSubmitting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">
            Xác nhận
          </p>
          <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{description}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/20 hover:text-white"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
