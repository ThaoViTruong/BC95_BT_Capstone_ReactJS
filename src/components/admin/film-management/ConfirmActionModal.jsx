const ConfirmActionModal = ({
  isOpen,
  title,
  description,
  confirmLabel,
  isSubmitting,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#101010] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.3em] text-red-400">
          Xác nhận thao tác
        </p>
        <h3 className="mt-3 text-3xl font-bold text-white">{title}</h3>
        <p className="mt-4 text-base leading-8 text-white/75">{description}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-white/10 px-5 py-4 text-base text-white transition hover:bg-white/5"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-2xl bg-red-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
