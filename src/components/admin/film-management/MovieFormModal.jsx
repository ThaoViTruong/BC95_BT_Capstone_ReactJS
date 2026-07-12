const MovieFormModal = ({
  title,
  description,
  formState,
  imageFile,
  isSubmitting,
  onClose,
  onSubmit,
  onFieldChange,
  onImageChange,
  labelClassName,
  inputClassName,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm sm:py-8">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[32px] border border-white/10 bg-[#101010] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">
              {title}
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {description}
            </h3>
            <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Tạo phim mới với poster, ngày phát hành, trailer và trạng thái
              trình chiếu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-5 py-4 text-base text-white transition hover:bg-white/5"
          >
            Đóng
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-6 sm:mt-8">
          <div className="grid gap-5 sm:gap-6 xl:grid-cols-2">
            <div>
              <label className={labelClassName}>Tên phim</label>
              <input
                name="tenPhim"
                value={formState.tenPhim}
                onChange={onFieldChange}
                className={inputClassName}
                placeholder="Nhập tên phim"
                required
              />
            </div>
            <div>
              <label className={labelClassName}>Ngày phát hành</label>
              <input
                type="date"
                name="ngayKhoiChieu"
                value={formState.ngayKhoiChieu}
                onChange={onFieldChange}
                className={inputClassName}
                required
              />
            </div>
            <div>
              <label className={labelClassName}>Đánh giá</label>
              <input
                type="number"
                min="0"
                max="10"
                name="danhGia"
                value={formState.danhGia}
                onChange={onFieldChange}
                className={inputClassName}
              />
            </div>
            <div className="xl:col-span-2">
              <label className={labelClassName}>Liên kết giới thiệu</label>
              <input
                name="trailer"
                value={formState.trailer}
                onChange={onFieldChange}
                className={inputClassName}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="xl:col-span-2">
              <label className={labelClassName}>Mô tả</label>
              <textarea
                name="moTa"
                value={formState.moTa}
                onChange={onFieldChange}
                rows="5"
                className={inputClassName}
                placeholder="Nhập mô tả phim"
              />
            </div>
            <div>
              <label className={labelClassName}>Ảnh poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full rounded-2xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-red-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-500/25 sm:px-5 sm:py-4 sm:text-base"
              />
              <p className="mt-3 text-sm text-white/65">
                {imageFile
                  ? `Đã chọn tệp: ${imageFile.name}`
                  : "Vui lòng chọn ảnh poster trước khi tạo phim."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input
                  type="checkbox"
                  name="hot"
                  checked={formState.hot}
                  onChange={onFieldChange}
                  className="h-5 w-5 accent-red-500"
                />
                Nổi bật
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input
                  type="checkbox"
                  name="dangChieu"
                  checked={formState.dangChieu}
                  onChange={onFieldChange}
                  className="h-5 w-5 accent-red-500"
                />
                Đang chiếu
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input
                  type="checkbox"
                  name="sapChieu"
                  checked={formState.sapChieu}
                  onChange={onFieldChange}
                  className="h-5 w-5 accent-red-500"
                />
                Sắp chiếu
              </label>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 px-5 py-4 text-base text-white transition hover:bg-white/5"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 text-base font-semibold text-white transition hover:from-red-400 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Đang xử lý..." : "Thêm phim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieFormModal;
