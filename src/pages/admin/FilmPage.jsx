import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { movieApi } from '../../api/movieApi'
import { useMovieList } from '../../hooks/useMovies'

const MA_NHOM = 'GP01'
const ITEMS_PER_PAGE = 8

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'dangChieu', label: 'Đang chiếu' },
  { value: 'sapChieu', label: 'Sắp chiếu' },
  { value: 'hot', label: 'Nổi bật' },
]

const emptyMovieForm = {
  maPhim: '',
  tenPhim: '',
  biDanh: '',
  trailer: '',
  moTa: '',
  ngayKhoiChieu: '',
  danhGia: 0,
  hot: false,
  dangChieu: false,
  sapChieu: false,
}

const labelClassName = 'mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-white'
const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Chưa cập nhật'
  }

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật'
  }

  return date.toLocaleDateString('vi-VN')
}

const formatDateForInput = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}

const formatDateForApi = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const [year, month, day] = dateValue.split('-')
  if (!year || !month || !day) {
    return ''
  }

  return `${day}/${month}/${year}`
}

const truncateText = (text, maxLength = 140) => {
  if (!text) {
    return 'Chưa có mô tả.'
  }

  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength).trim()}...`
}

const slugifyText = (text) => {
  if (!text) {
    return ''
  }

  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const getApiMessage = (content, fallbackMessage) => {
  if (typeof content === 'string' && content.trim()) {
    return content
  }

  if (content && typeof content === 'object') {
    if (typeof content.message === 'string' && content.message.trim()) {
      return content.message
    }

    if (typeof content.content === 'string' && content.content.trim()) {
      return content.content
    }

    if (content.content && typeof content.content === 'object') {
      if (typeof content.content.message === 'string' && content.content.message.trim()) {
        return content.content.message
      }
    }
  }

  return fallbackMessage
}

const buildMovieFormData = (movieForm, imageFile, includeMovieId) => {
  const formData = new FormData()

  if (includeMovieId) {
    formData.append('maPhim', movieForm.maPhim)
  }

  formData.append('tenPhim', movieForm.tenPhim.trim())
  formData.append('biDanh', movieForm.biDanh.trim() || slugifyText(movieForm.tenPhim))
  formData.append('trailer', movieForm.trailer.trim())
  formData.append('moTa', movieForm.moTa.trim())
  formData.append('maNhom', MA_NHOM)
  formData.append('ngayKhoiChieu', formatDateForApi(movieForm.ngayKhoiChieu))
  formData.append('danhGia', String(Number(movieForm.danhGia) || 0))
  formData.append('hot', String(movieForm.hot))
  formData.append('dangChieu', String(movieForm.dangChieu))
  formData.append('sapChieu', String(movieForm.sapChieu))

  if (imageFile) {
    formData.append('hinhAnh', imageFile, imageFile.name)
  }

  return formData
}

const buildMoviePayload = (movieForm, currentImage) => {
  return {
    maPhim: Number(movieForm.maPhim),
    tenPhim: movieForm.tenPhim.trim(),
    biDanh: movieForm.biDanh.trim() || slugifyText(movieForm.tenPhim),
    trailer: movieForm.trailer.trim(),
    moTa: movieForm.moTa.trim(),
    maNhom: MA_NHOM,
    ngayKhoiChieu: formatDateForApi(movieForm.ngayKhoiChieu),
    danhGia: Number(movieForm.danhGia) || 0,
    hot: movieForm.hot,
    dangChieu: movieForm.dangChieu,
    sapChieu: movieForm.sapChieu,
    hinhAnh: currentImage || '',
  }
}

const MovieFormModal = ({
  mode,
  title,
  description,
  formState,
  imageFile,
  isSubmitting,
  onClose,
  onSubmit,
  onFieldChange,
  onImageChange,
}) => {
  const submitLabel = mode === 'add' ? 'Thêm phim' : 'Lưu thay đổi'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-[32px] border border-white/10 bg-[#101010] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-red-400">{title}</p>
            <h3 className="mt-3 text-4xl font-bold text-white">{description}</h3>
            <p className="mt-3 text-base leading-8 text-white/75">
              {mode === 'add'
                ? 'Tạo phim mới với poster, ngày phát hành, trailer và trạng thái trình chiếu.'
                : 'Cập nhật thông tin phim và lưu nội dung mới nhất lên hệ thống quản trị.'}
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

        <form onSubmit={onSubmit} className="mt-8 space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
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
              <label className={labelClassName}>Bí danh</label>
              <input
                name="biDanh"
                value={formState.biDanh}
                onChange={onFieldChange}
                className={inputClassName}
                placeholder="Nhập bí danh"
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
                placeholder="Chọn ngày phát hành"
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
                placeholder="Nhập điểm đánh giá"
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
              <label className={labelClassName}>{mode === 'add' ? 'Ảnh poster' : 'Ảnh poster mới'}</label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageChange}
                className="w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-red-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-500/25"
              />
              <p className="mt-3 text-sm text-white/65">
                {imageFile
                  ? `Đã chọn tệp: ${imageFile.name}`
                  : mode === 'add'
                    ? 'Vui lòng chọn ảnh poster trước khi tạo phim.'
                    : 'Để trống nếu muốn giữ nguyên ảnh hiện tại.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="hot" checked={formState.hot} onChange={onFieldChange} className="h-5 w-5 accent-red-500" />
                Nổi bật
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="dangChieu" checked={formState.dangChieu} onChange={onFieldChange} className="h-5 w-5 accent-red-500" />
                Đang chiếu
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="sapChieu" checked={formState.sapChieu} onChange={onFieldChange} className="h-5 w-5 accent-red-500" />
                Sắp chiếu
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
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
              className="rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-6 py-4 text-base font-semibold text-white transition hover:from-red-400 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Đang xử lý...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

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
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#101010] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <p className="text-sm uppercase tracking-[0.3em] text-red-400">Xác nhận thao tác</p>
        <h3 className="mt-3 text-3xl font-bold text-white">{title}</h3>
        <p className="mt-4 text-base leading-8 text-white/75">
          {description}
        </p>

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
            {isSubmitting ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
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
          {result.type === 'success' ? 'Hoàn tất' : 'Không thành công'}
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

const FilmPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: movies = [], isLoading, isError, error } = useMovieList(MA_NHOM)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [actionMessage, setActionMessage] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addForm, setAddForm] = useState(emptyMovieForm)
  const [addImageFile, setAddImageFile] = useState(null)
  const [editingMovie, setEditingMovie] = useState(null)
  const [editForm, setEditForm] = useState(emptyMovieForm)
  const [editImageFile, setEditImageFile] = useState(null)
  const [pendingEditRequest, setPendingEditRequest] = useState(null)
  const [movieToDelete, setMovieToDelete] = useState(null)
  const [resultPopup, setResultPopup] = useState(null)

  const movieStats = useMemo(
    () => ({
      total: movies.length,
      dangChieu: movies.filter((movie) => movie.dangChieu).length,
      sapChieu: movies.filter((movie) => movie.sapChieu).length,
      hot: movies.filter((movie) => movie.hot).length,
    }),
    [movies]
  )

  const filteredMovies = useMemo(() => {
    const normalizedKeyword = searchValue.trim().toLowerCase()

    return movies.filter((movie) => {
      const matchesKeyword =
        normalizedKeyword === '' ||
        movie.tenPhim?.toLowerCase().includes(normalizedKeyword) ||
        String(movie.maPhim).includes(normalizedKeyword)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'dangChieu' && movie.dangChieu) ||
        (statusFilter === 'sapChieu' && movie.sapChieu) ||
        (statusFilter === 'hot' && movie.hot)

      return matchesKeyword && matchesStatus
    })
  }, [movies, searchValue, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / ITEMS_PER_PAGE))

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredMovies, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchValue, statusFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const refreshMovieList = () => {
    queryClient.invalidateQueries({ queryKey: ['movieList', MA_NHOM] })
  }

  const resetAddState = () => {
    setIsAddModalOpen(false)
    setAddForm(emptyMovieForm)
    setAddImageFile(null)
  }

  const resetEditState = () => {
    setEditingMovie(null)
    setEditForm(emptyMovieForm)
    setEditImageFile(null)
    setPendingEditRequest(null)
  }

  const handleFormFieldChange = (setter) => (event) => {
    const { name, value, type, checked } = event.target
    setter((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (setter) => (event) => {
    setter(event.target.files?.[0] || null)
  }

  const addMovieMutation = useMutation({
    mutationFn: (formData) => movieApi.addMovie(formData),
    onSuccess: () => {
      setActionMessage({ type: 'success', text: 'Thêm phim thành công.' })
      resetAddState()
      refreshMovieList()
    },
    onError: (mutationError) => {
      setActionMessage({
        type: 'error',
        text: getApiMessage(mutationError.response?.data, 'Thêm phim thất bại. Vui lòng thử lại.'),
      })
    },
  })

  const updateMovieMutation = useMutation({
    mutationFn: ({ payload, requestType }) => {
      if (requestType === 'upload') {
        return movieApi.updateMovie(payload)
      }

      return movieApi.updateMovieInfo(payload)
    },
    onSuccess: () => {
      setPendingEditRequest(null)
      resetEditState()
      refreshMovieList()
      setResultPopup({
        type: 'success',
        title: 'Cập nhật phim thành công',
        message: 'Thông tin phim đã được lưu thành công trên hệ thống.',
      })
    },
    onError: (mutationError) => {
      setPendingEditRequest(null)
      setResultPopup({
        type: 'error',
        title: 'Cập nhật phim thất bại',
        message: getApiMessage(mutationError.response?.data, 'Cập nhật phim thất bại. Vui lòng thử lại.'),
      })
    },
  })

  const deleteMovieMutation = useMutation({
    mutationFn: (maPhim) => movieApi.deleteMovie(maPhim),
    onSuccess: () => {
      setMovieToDelete(null)
      refreshMovieList()
      setResultPopup({
        type: 'success',
        title: 'Xóa phim thành công',
        message: 'Bộ phim đã được xóa khỏi danh sách quản trị.',
      })
    },
    onError: (mutationError) => {
      setMovieToDelete(null)
      setResultPopup({
        type: 'error',
        title: 'Xóa phim thất bại',
        message: getApiMessage(mutationError.response?.data, 'Xóa phim thất bại. Vui lòng thử lại.'),
      })
    },
  })

  const handleOpenAddModal = () => {
    setActionMessage(null)
    setIsAddModalOpen(true)
  }

  const handleStartEdit = (movie) => {
    setActionMessage(null)
    navigate(`/admin/films/edit/${movie.maPhim}`)
  }

  const handleOpenShowtime = (movie) => {
    setActionMessage(null)
    navigate(`/admin/films/showtime/${movie.maPhim}`)
  }

  const handleRequestDelete = (movie) => {
    setActionMessage(null)
    setMovieToDelete(movie)
  }

  const handleSubmitAdd = (event) => {
    event.preventDefault()
    setActionMessage(null)

    if (!addImageFile) {
      setActionMessage({ type: 'error', text: 'Vui lòng chọn ảnh poster trước khi thêm phim.' })
      return
    }

    addMovieMutation.mutate(buildMovieFormData(addForm, addImageFile, false))
  }

  const handleSubmitEdit = (event) => {
    event.preventDefault()
    setActionMessage(null)

    const requestType = editImageFile ? 'upload' : 'info'
    const payload = editImageFile
      ? buildMovieFormData(editForm, editImageFile, true)
      : buildMoviePayload(editForm, editingMovie?.hinhAnh)

    setPendingEditRequest({
      requestType,
      payload,
      movieName: editForm.tenPhim.trim() || editingMovie?.tenPhim || 'bộ phim này',
    })
  }

  const handleConfirmEdit = () => {
    if (!pendingEditRequest) {
      return
    }

    updateMovieMutation.mutate({
      payload: pendingEditRequest.payload,
      requestType: pendingEditRequest.requestType,
    })
  }

  const handleConfirmDelete = () => {
    if (!movieToDelete) {
      return
    }

    setActionMessage(null)
    deleteMovieMutation.mutate(movieToDelete.maPhim)
  }

  const renderMovieTags = (movie) => {
    const tags = []

    if (movie.biDanh) {
      tags.push({
        label: movie.biDanh,
        className: 'border border-yellow-500/20 bg-yellow-500/10 text-yellow-300',
      })
    }

    if (movie.hot) {
      tags.push({
        label: 'Nổi bật',
        className: 'border border-red-500/20 bg-red-500/10 text-red-300',
      })
    }

    if (movie.dangChieu) {
      tags.push({
        label: 'Đang chiếu',
        className: 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
      })
    }

    if (movie.sapChieu) {
      tags.push({
        label: 'Sắp chiếu',
        className: 'border border-sky-500/20 bg-sky-500/10 text-sky-300',
      })
    }

    return (
      <div className="mt-4 flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <span key={`${movie.maPhim}-${tag.label}`} className={`rounded-full px-3 py-1.5 text-sm font-medium ${tag.className}`}>
            {tag.label}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans text-white">
      <section className="space-y-8">

        {actionMessage ? (
          <div
            className={`rounded-2xl border px-5 py-4 text-base ${
              actionMessage.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}
          >
            {actionMessage.text}
          </div>
        ) : null}

        <div className="grid gap-5 xl:grid-cols-4">
          <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Tổng số phim</p>
            <p className="mt-4 text-4xl font-bold text-white">{movieStats.total}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Đang chiếu</p>
            <p className="mt-4 text-4xl font-bold text-yellow-300">{movieStats.dangChieu}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Sắp chiếu</p>
            <p className="mt-4 text-4xl font-bold text-sky-300">{movieStats.sapChieu}</p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Nổi bật</p>
            <p className="mt-4 text-4xl font-bold text-red-300">{movieStats.hot}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#151515] p-6">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px_180px] xl:items-end">
            <div>
              <label htmlFor="film-search" className={labelClassName}>Tìm kiếm</label>
              <input
                id="film-search"
                type="text"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm bằng tên hoặc ID  của phim..."
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="film-status" className={labelClassName}>Trạng thái</label>
              <select
                id="film-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className={inputClassName}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-4 py-4 text-base font-semibold text-white transition hover:from-red-400 hover:to-red-600"
            >
              <span className="text-lg">+</span>
              <span>Thêm phim</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#121212] shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="flex flex-col gap-4 border-b border-white/10 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">

            <p className="text-lg text-white/75">
              Hiển thị <span className="font-semibold text-yellow-300">{paginatedMovies.length}</span> / {filteredMovies.length} phim
            </p>
          </div>

          {isLoading ? <div className="px-8 py-20 text-center text-lg text-white/75">Tải danh sách phim...</div> : null}

          {isError ? (
            <div className="px-8 py-20 text-center">
              <p className="text-2xl font-semibold text-red-400">Không thể tải danh sách phim.</p>
              <p className="mt-3 text-lg text-white/65">{error?.message}</p>
            </div>
          ) : null}

          {!isLoading && !isError ? (
            <>
              <div className="hidden grid-cols-[120px_120px_minmax(220px,1fr)_minmax(300px,1.2fr)_180px] gap-6 border-b border-white/10 bg-[#0e0e0e] px-8 py-5 text-sm font-semibold uppercase tracking-[0.25em] text-white xl:grid">
                <span>ID</span>
                <span>Hình ảnh</span>
                <span>Tên phim</span>
                <span>Mô tả</span>
                <span className="text-right">Hành động</span>
              </div>

              {filteredMovies.length === 0 ? (
                <div className="px-8 py-20 text-center text-lg text-white/75">Không có phim nào phù hợp với bộ lọc hiện tại.</div>
              ) : (
                <div className="divide-y divide-white/10">
                  {paginatedMovies.map((movie) => (
                    <div
                      key={movie.maPhim}
                      className="grid gap-6 px-8 py-7 xl:grid-cols-[120px_120px_minmax(220px,1fr)_minmax(300px,1.2fr)_180px] xl:items-start"
                    >
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">ID</p>
                        <p className="mt-2 text-2xl font-bold text-red-300">#{movie.maPhim}</p>
                        <p className="mt-3 text-sm text-white/65">Phát hành: {formatDate(movie.ngayKhoiChieu)}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">Hình ảnh</p>
                        <div className="mt-2 h-32 w-24 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
                          <img src={movie.hinhAnh} alt={movie.tenPhim} className="h-full w-full object-cover" />
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">Tên phim</p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">{movie.tenPhim}</h3>
                        {renderMovieTags(movie)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">Mô tả</p>
                        <p className="mt-2 text-lg leading-8 text-white/80">{truncateText(movie.moTa)}</p>
                        <p className="mt-4 text-sm text-white/65">Đánh giá: {movie.danhGia ?? 0}/10</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white xl:hidden">Hành động</p>
                        <div className="mt-2 flex items-center gap-2 xl:justify-end">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(movie)}
                            aria-label={`Sửa phim ${movie.tenPhim}`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition hover:bg-amber-400/20"
                          >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 20h4l10-10-4-4L4 16v4z" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M13 7l4 4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRequestDelete(movie)}
                            aria-label={`Xóa phim ${movie.tenPhim}`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                          >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M4 7h16" strokeLinecap="round" />
                              <path d="M10 11v6" strokeLinecap="round" />
                              <path d="M14 11v6" strokeLinecap="round" />
                              <path d="M6 7l1 12h10l1-12" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M9 7V4h6v3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenShowtime(movie)}
                            aria-label={`Tạo lịch chiếu cho phim ${movie.tenPhim}`}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400/20"
                          >
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M8 3v4" strokeLinecap="round" />
                              <path d="M16 3v4" strokeLinecap="round" />
                              <path d="M4 9h16" strokeLinecap="round" />
                              <rect x="4" y="5" width="16" height="15" rx="2" />
                              <path d="M12 12v5" strokeLinecap="round" />
                              <path d="M9.5 14.5H14.5" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredMovies.length > 0 ? (
                <div className="flex flex-col gap-5 border-t border-white/10 px-8 py-6 xl:flex-row xl:items-center xl:justify-between">
                  <p className="text-base text-white/75">
                    Trang <span className="font-semibold text-white">{currentPage}</span> / {totalPages} - tổng cộng {filteredMovies.length} phim
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="rounded-2xl border border-white/10 px-4 py-3 text-base text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'border border-white/10 text-white hover:bg-white/5'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="rounded-2xl border border-white/10 px-4 py-3 text-base text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </section>

      {isAddModalOpen ? (
        <MovieFormModal
          mode="add"
          title="Thêm phim"
          description="Tạo phim mới"
          formState={addForm}
          imageFile={addImageFile}
          isSubmitting={addMovieMutation.isPending}
          onClose={resetAddState}
          onSubmit={handleSubmitAdd}
          onFieldChange={handleFormFieldChange(setAddForm)}
          onImageChange={handleFileChange(setAddImageFile)}
        />
      ) : null}

      {editingMovie ? (
        <MovieFormModal
          mode="edit"
          title="Sửa phim"
          description={editingMovie.tenPhim}
          formState={editForm}
          imageFile={editImageFile}
          isSubmitting={updateMovieMutation.isPending}
          onClose={resetEditState}
          onSubmit={handleSubmitEdit}
          onFieldChange={handleFormFieldChange(setEditForm)}
          onImageChange={handleFileChange(setEditImageFile)}
        />
      ) : null}

      <ConfirmActionModal
        isOpen={Boolean(pendingEditRequest)}
        title="Xác nhận cập nhật phim"
        description={
          pendingEditRequest
            ? `Bạn có chắc chắn muốn cập nhật thông tin của phim "${pendingEditRequest.movieName}" không?`
            : ''
        }
        confirmLabel="Xác nhận cập nhật"
        isSubmitting={updateMovieMutation.isPending}
        onCancel={() => setPendingEditRequest(null)}
        onConfirm={handleConfirmEdit}
      />

      <ConfirmActionModal
        isOpen={Boolean(movieToDelete)}
        title={movieToDelete?.tenPhim || 'Xóa phim'}
        description="Hành động này sẽ xóa vĩnh viễn phim khỏi danh sách quản trị. Vui lòng xác nhận trước khi tiếp tục."
        confirmLabel="Xóa phim"
        isSubmitting={deleteMovieMutation.isPending}
        onCancel={() => setMovieToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <ResultPopup result={resultPopup} onClose={() => setResultPopup(null)} />
    </div>
  )
}

export default FilmPage
