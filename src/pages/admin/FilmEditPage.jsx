import { useState, useEffect, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { movieApi } from '../../api/movieApi'
import { useMovieDetail } from '../../hooks/useMovies'
import {
  buildMovieFormData,
  emptyMovieForm,
  formatDateForInput,
  getApiMessage,
  MA_NHOM,
} from '../../utils/admin/movieFormUtils'

const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

const labelClassName = 'mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-white'

const getImageFileName = (imageUrl, movieName) => {
  const sanitizedMovieName = String(movieName || 'poster-phim')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const matchedExtension = String(imageUrl || '').match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i)
  const fileExtension = matchedExtension?.[1]?.toLowerCase() || 'jpg'

  return `${sanitizedMovieName || 'poster-phim'}.${fileExtension}`
}

const ResultPopup = ({ result, onClose }) => {
  if (!result) {
    return null
  }

  const accentClassName =
    result.type === 'success'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      : 'border-red-500/30 bg-red-500/10 text-red-300'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-[28px] border p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] ${accentClassName}`}>
        <p className="text-sm font-semibold uppercase tracking-[0.3em]">
          {result.type === 'success' ? 'Hoàn tất' : 'Thất bại'}
        </p>
        <h3 className="mt-3 text-3xl font-bold text-white">{result.title}</h3>
        <p className="mt-4 text-base leading-8 text-white/85">{result.message}</p>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-5 py-3 text-base font-medium text-white transition hover:bg-white/5"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

const FilmEditPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { idFilm } = useParams()
  const { data: movieDetail, isLoading, isError, error } = useMovieDetail(idFilm)
  const [formState, setFormState] = useState(emptyMovieForm)
  const [imageFile, setImageFile] = useState(null)
  const [currentImage, setCurrentImage] = useState('')
  const [resultPopup, setResultPopup] = useState(null)

  useEffect(() => {
    if (!movieDetail) {
      return
    }

    const timeoutId = setTimeout(() => {
      setFormState({
        maPhim: movieDetail.maPhim || '',
        tenPhim: movieDetail.tenPhim || '',
        trailer: movieDetail.trailer || '',
        moTa: movieDetail.moTa || '',
        ngayKhoiChieu: formatDateForInput(movieDetail.ngayKhoiChieu),
        danhGia: movieDetail.danhGia ?? 0,
        hot: Boolean(movieDetail.hot),
        dangChieu: Boolean(movieDetail.dangChieu),
        sapChieu: Boolean(movieDetail.sapChieu),
      })
      setCurrentImage(movieDetail.hinhAnh || '')
      setImageFile(null)
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [movieDetail])

  const previewImage = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile)
    }

    return currentImage
  }, [currentImage, imageFile])

  useEffect(() => {
    return () => {
      if (previewImage && imageFile) {
        URL.revokeObjectURL(previewImage)
      }
    }
  }, [previewImage, imageFile])

  const getUpdateMovieErrorMessage = (mutationError) => {
    const rawMessage = getApiMessage(
      mutationError.response?.data?.content || mutationError.response?.data,
      'Không thể cập nhật phim. Vui lòng thử lại.'
    )

    return rawMessage.toLowerCase().includes('xóa')
      ? 'Không thể cập nhật phim. Vui lòng kiểm tra lại thông tin hoặc ảnh poster.'
      : rawMessage
  }

  const ensureMovieImageFile = async (nextImageFile, imageUrl, movieName) => {
    if (nextImageFile) {
      return nextImageFile
    }

    if (!imageUrl) {
      return null
    }

    try {
      const response = await fetch(imageUrl)

      if (!response.ok) {
        return null
      }

      const imageBlob = await response.blob()
      return new File([imageBlob], getImageFileName(imageUrl, movieName), { type: imageBlob.type || 'image/jpeg' })
    } catch {
      return null
    }
  }

  const updateMovieMutation = useMutation({
    mutationFn: async ({ movieForm, nextImageFile, fallbackAlias, nextCurrentImage }) => {
      const resolvedImageFile = await ensureMovieImageFile(
        nextImageFile,
        nextCurrentImage,
        movieForm.tenPhim
      )

      return movieApi.updateMovie(
        buildMovieFormData({
          movieForm,
          imageFile: resolvedImageFile,
          includeMovieId: true,
          fallbackAlias,
        })
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movieList', MA_NHOM] })
      queryClient.invalidateQueries({ queryKey: ['movieDetail', idFilm] })
      setResultPopup({
        type: 'success',
        title: 'Cập nhật phim thành công',
        message: 'Thông tin phim đã được cập nhật thành công.',
      })
    },
    onError: (mutationError) => {
      setResultPopup({
        type: 'error',
        title: 'Cập nhật phim thất bại',
        message: getUpdateMovieErrorMessage(mutationError),
      })
    },
  })

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleImageChange = (event) => {
    setImageFile(event.target.files?.[0] || null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateMovieMutation.mutate({
      movieForm: formState,
      nextImageFile: imageFile,
      nextCurrentImage: currentImage,
      fallbackAlias: movieDetail?.biDanh || '',
    })
  }

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
    <div className="space-y-8 font-sans text-white">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#151515] p-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Chỉnh sửa phim</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Cập nhật phim #{formState.maPhim}</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/films')}
          className="rounded-2xl border border-white/10 px-5 py-4 text-base font-medium text-white transition hover:bg-white/5"
        >
          Quay lại danh sách phim
        </button>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-[#101010] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
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

            <div className="xl:col-span-2">
              <label className={labelClassName}>Liên kết giới thiệu</label>
              <input
                name="trailer"
                value={formState.trailer}
                onChange={handleFieldChange}
                className={inputClassName}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="xl:col-span-2">
              <label className={labelClassName}>Mô tả</label>
              <textarea
                name="moTa"
                value={formState.moTa}
                onChange={handleFieldChange}
                rows="5"
                className={inputClassName}
                placeholder="Nhập mô tả phim"
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

            <div className="xl:col-span-2 grid gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="dangChieu" checked={formState.dangChieu} onChange={handleFieldChange} className="h-5 w-5 accent-red-500" />
                Đang chiếu
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="sapChieu" checked={formState.sapChieu} onChange={handleFieldChange} className="h-5 w-5 accent-red-500" />
                Sắp chiếu
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="hot" checked={formState.hot} onChange={handleFieldChange} className="h-5 w-5 accent-red-500" />
                Nổi bật
              </label>
            </div>

            <div>
              <label className={labelClassName}>Ảnh poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-red-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-500/25"
              />
              <p className="mt-3 text-sm text-white/65">
                {imageFile ? `Tệp đã chọn: ${imageFile.name}` : 'Để trống nếu bạn muốn giữ ảnh poster hiện tại.'}
              </p>
            </div>

            <div>
              <label className={labelClassName}>Xem trước hiện tại</label>
              <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-white/10 bg-[#181818] p-4">
                {previewImage ? (
                  <img src={previewImage} alt={formState.tenPhim} className="max-h-[220px] rounded-2xl object-cover" />
                ) : (
                  <span className="text-sm text-white/50">Chưa có poster</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/films')}
              className="rounded-2xl border border-white/10 px-5 py-4 text-base text-white transition hover:bg-white/5"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMovieMutation.isPending}
              className="rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-6 py-4 text-base font-semibold text-white transition hover:from-red-400 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateMovieMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật phim'}
            </button>
          </div>
        </form>
      </div>

      <ResultPopup result={resultPopup} onClose={() => setResultPopup(null)} />
    </div>
  )
}

export default FilmEditPage


