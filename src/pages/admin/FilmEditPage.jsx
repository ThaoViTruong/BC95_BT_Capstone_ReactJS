import { Link } from 'react-router-dom'
import ConfirmActionModal from '../../components/admin/film-management/ConfirmActionModal'
import { useFilmEditPage } from '../../hooks/admin/useFilmEditPage'

const inputClassName =
  'w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

const labelClassName = 'mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/90'

const FilmEditPage = () => {
  const {
    navigate,
    isLoading,
    isError,
    error,
    formState,
    imageFile,
    previewImage,
    isConfirmUpdateOpen,
    updateMovieMutation,
    setIsConfirmUpdateOpen,
    handleFieldChange,
    handleImageChange,
    handleSubmit,
    handleConfirmUpdate,
  } = useFilmEditPage()

  if (isLoading) {
    return <div className="rounded-[28px] border border-white/10 bg-[#151515] px-8 py-20 text-center text-lg text-white/75">Đang tải thông tin phim...</div>
  }

  if (isError) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#151515] px-8 py-20 text-center">
        <p className="text-2xl font-semibold text-red-400">Không thể tải thông tin phim.</p>
        <p className="mt-3 text-lg text-white/65">{error?.message}</p>
        <Link
          to="/admin/films"
          className="mt-6 inline-flex rounded-2xl border border-white/10 px-5 py-3 text-base font-medium text-white transition hover:bg-white/5"
        >
          Quay lại danh sách phim
        </Link>
      </div>
    )
  }

  return (
    <div className="font-sans text-white">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[30px] border border-white/10 bg-[#101010] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-4 border-b border-white/10 bg-[#141414] px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-400">Chỉnh sửa phim</p>
              <h1 className="mt-2 text-3xl font-bold text-white">Cập nhật phim #{formState.maPhim}</h1>
              <p className="mt-1 text-sm text-white/60">Điều chỉnh nhanh thông tin phim và poster trong một màn hình.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/admin/films')}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Quay lại danh sách phim
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
              <label className={labelClassName}>Tên phim</label>
              <input
                name="tenPhim"
                value={formState.tenPhim}
                onChange={handleFieldChange}
                className={inputClassName}
                placeholder="Nhập tên phim"
                required
              />
                </div>

                <div>
                  <label className={labelClassName}>Ngày khởi chiếu</label>
                  <input
                    type="date"
                    name="ngayKhoiChieu"
                    value={formState.ngayKhoiChieu}
                    onChange={handleFieldChange}
                    className={inputClassName}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                <div>
              <label className={labelClassName}>Liên kết giới thiệu</label>
              <input
                name="trailer"
                value={formState.trailer}
                onChange={handleFieldChange}
                className={inputClassName}
                placeholder="https://youtube.com/..."
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
                    onChange={handleFieldChange}
                    className={inputClassName}
                    placeholder="0 - 10"
                  />
                </div>
              </div>

              <div>
              <label className={labelClassName}>Mô tả</label>
              <textarea
                name="moTa"
                value={formState.moTa}
                onChange={handleFieldChange}
                rows="4"
                className={inputClassName}
                placeholder="Nhập mô tả phim"
              />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white">
                  <input type="checkbox" name="dangChieu" checked={formState.dangChieu} onChange={handleFieldChange} className="h-4 w-4 accent-red-500" />
                  Đang chiếu
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white">
                  <input type="checkbox" name="sapChieu" checked={formState.sapChieu} onChange={handleFieldChange} className="h-4 w-4 accent-red-500" />
                  Sắp chiếu
                </label>
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white">
                  <input type="checkbox" name="hot" checked={formState.hot} onChange={handleFieldChange} className="h-4 w-4 accent-red-500" />
                  Nổi bật
                </label>
              </div>
            </div>

            <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#151515] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">Poster phim</p>
              <div className="mt-4 flex min-h-[260px] items-center justify-center rounded-2xl border border-white/10 bg-[#181818] p-3">
                {previewImage ? (
                  <img src={previewImage} alt={formState.tenPhim} className="max-h-[240px] rounded-2xl object-cover" />
                ) : (
                  <span className="text-sm text-white/50">Chưa có poster</span>
                )}
              </div>

              <div className="mt-4">
                <label className={labelClassName}>Ảnh poster</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-xl border border-white/10 bg-[#181818] px-4 py-3 text-sm text-white outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-red-500/15 file:px-3 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-red-500/25"
                />
                <p className="mt-3 text-xs leading-6 text-white/65">
                  {imageFile ? `Tệp đã chọn: ${imageFile.name}` : 'Để trống nếu bạn muốn giữ ảnh poster hiện tại.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end lg:col-span-2">
              <button
                type="button"
                onClick={() => navigate('/admin/films')}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/5"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={updateMovieMutation.isPending}
                className="rounded-xl border border-red-300/30 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(239,68,68,0.35)] transition hover:-translate-y-0.5 hover:from-red-400 hover:via-red-500 hover:to-rose-500 hover:shadow-[0_20px_50px_rgba(239,68,68,0.45)] focus:outline-none focus:ring-2 focus:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {updateMovieMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật phim'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmActionModal
        isOpen={isConfirmUpdateOpen}
        title="Xác nhận cập nhật phim"
        description={`Bạn có chắc chắn muốn cập nhật thông tin phim "${formState.tenPhim || `#${formState.maPhim}`}" không?`}
        confirmLabel="Xác nhận cập nhật"
        isSubmitting={updateMovieMutation.isPending}
        onCancel={() => setIsConfirmUpdateOpen(false)}
        onConfirm={handleConfirmUpdate}
      />
    </div>
  )
}

export default FilmEditPage


