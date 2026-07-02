import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { movieApi } from '../../api/movieApi'
import { useMovieDetail } from '../../hooks/useMovies'

const MA_NHOM = 'GP01'

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

const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'

const labelClassName = 'mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-white'

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
  }

  return fallbackMessage
}

const buildMovieFormData = (movieForm, imageFile) => {
  const formData = new FormData()

  formData.append('maPhim', String(movieForm.maPhim))
  formData.append('tenPhim', movieForm.tenPhim.trim())
  formData.append('biDanh', movieForm.biDanh.trim() || slugifyText(movieForm.tenPhim))
  formData.append('trailer', movieForm.trailer.trim())
  formData.append('moTa', movieForm.moTa.trim())
  formData.append('maNhom', MA_NHOM)
  formData.append('ngayKhoiChieu', formatDateForApi(movieForm.ngayKhoiChieu))
  formData.append('sapChieu', String(movieForm.sapChieu))
  formData.append('dangChieu', String(movieForm.dangChieu))
  formData.append('hot', String(movieForm.hot))
  formData.append('danhGia', String(Number(movieForm.danhGia) || 0))

  if (imageFile) {
    formData.append('hinhAnh', imageFile, imageFile.name)
  }

  return formData
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
          {result.type === 'success' ? 'Completed' : 'Failed'}
        </p>
        <h3 className="mt-3 text-3xl font-bold text-white">{result.title}</h3>
        <p className="mt-4 text-base leading-8 text-white/85">{result.message}</p>
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-white/10 px-5 py-3 text-base font-medium text-white transition hover:bg-white/5"
          >
            Close
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

    setFormState({
      maPhim: movieDetail.maPhim || '',
      tenPhim: movieDetail.tenPhim || '',
      biDanh: movieDetail.biDanh || '',
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

  const updateMovieMutation = useMutation({
    mutationFn: (payload) => movieApi.updateMovie(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movieList', MA_NHOM] })
      queryClient.invalidateQueries({ queryKey: ['movieDetail', idFilm] })
      setResultPopup({
        type: 'success',
        title: 'Film updated successfully',
        message: 'The movie information has been updated with the required FormData request.',
      })
    },
    onError: (mutationError) => {
      setResultPopup({
        type: 'error',
        title: 'Film update failed',
        message: getApiMessage(mutationError.response?.data?.content, 'Unable to update the movie. Please try again.'),
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
    updateMovieMutation.mutate(buildMovieFormData(formState, imageFile))
  }

  if (isLoading) {
    return <div className="rounded-[28px] border border-white/10 bg-[#151515] px-8 py-20 text-center text-lg text-white/75">Loading film information...</div>
  }

  if (isError) {
    return (
      <div className="rounded-[28px] border border-white/10 bg-[#151515] px-8 py-20 text-center">
        <p className="text-2xl font-semibold text-red-400">Unable to load film information.</p>
        <p className="mt-3 text-lg text-white/65">{error?.message}</p>
        <Link
          to="/admin/films"
          className="mt-6 inline-flex rounded-2xl border border-white/10 px-5 py-3 text-base font-medium text-white transition hover:bg-white/5"
        >
          Back to film list
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans text-white">
      <div className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-[#151515] p-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Admin Film Edit</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Edit movie #{formState.maPhim}</h1>
          <p className="mt-3 text-base leading-8 text-white/70">
            Update the movie information on the dedicated admin page and submit it using `FormData` with the `CapNhatPhimUpload` API.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/films')}
          className="rounded-2xl border border-white/10 px-5 py-4 text-base font-medium text-white transition hover:bg-white/5"
        >
          Back to film list
        </button>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-[#101010] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <div>
              <label className={labelClassName}>Movie Name</label>
              <input
                name="tenPhim"
                value={formState.tenPhim}
                onChange={handleFieldChange}
                className={inputClassName}
                placeholder="Enter movie name"
                required
              />
            </div>

            <div>
              <label className={labelClassName}>Alias</label>
              <input
                name="biDanh"
                value={formState.biDanh}
                onChange={handleFieldChange}
                className={inputClassName}
                placeholder="Enter alias"
              />
            </div>

            <div className="xl:col-span-2">
              <label className={labelClassName}>Trailer</label>
              <input
                name="trailer"
                value={formState.trailer}
                onChange={handleFieldChange}
                className={inputClassName}
                placeholder="https://youtube.com/..."
              />
            </div>

            <div className="xl:col-span-2">
              <label className={labelClassName}>Description</label>
              <textarea
                name="moTa"
                value={formState.moTa}
                onChange={handleFieldChange}
                rows="5"
                className={inputClassName}
                placeholder="Enter movie description"
              />
            </div>

            <div>
              <label className={labelClassName}>Release Date</label>
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
              <label className={labelClassName}>Rating</label>
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
                Now Showing
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="sapChieu" checked={formState.sapChieu} onChange={handleFieldChange} className="h-5 w-5 accent-red-500" />
                Coming Soon
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#181818] px-4 py-4 text-base text-white">
                <input type="checkbox" name="hot" checked={formState.hot} onChange={handleFieldChange} className="h-5 w-5 accent-red-500" />
                Hot
              </label>
            </div>

            <div>
              <label className={labelClassName}>Poster Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-red-500/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-red-500/25"
              />
              <p className="mt-3 text-sm text-white/65">
                {imageFile ? `Selected file: ${imageFile.name}` : 'Leave empty if you want to keep the current poster.'}
              </p>
            </div>

            <div>
              <label className={labelClassName}>Current Preview</label>
              <div className="flex min-h-[250px] items-center justify-center rounded-2xl border border-white/10 bg-[#181818] p-4">
                {previewImage ? (
                  <img src={previewImage} alt={formState.tenPhim} className="max-h-[220px] rounded-2xl object-cover" />
                ) : (
                  <span className="text-sm text-white/50">No poster available</span>
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMovieMutation.isPending}
              className="rounded-2xl bg-gradient-to-b from-red-500 to-red-700 px-6 py-4 text-base font-semibold text-white transition hover:from-red-400 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {updateMovieMutation.isPending ? 'Updating...' : 'Update film'}
            </button>
          </div>
        </form>
      </div>

      <ResultPopup result={resultPopup} onClose={() => setResultPopup(null)} />
    </div>
  )
}

export default FilmEditPage
