export const MA_NHOM = 'GP01'

export const emptyMovieForm = {
  maPhim: '',
  tenPhim: '',
  trailer: '',
  moTa: '',
  ngayKhoiChieu: '',
  danhGia: 0,
  hot: false,
  dangChieu: false,
  sapChieu: false,
}

export const formatDateForInput = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().slice(0, 10)
}

export const formatDateForApi = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const [year, month, day] = dateValue.split('-')
  if (!year || !month || !day) {
    return ''
  }

  return `${day}/${month}/${year}`
}

export const getApiMessage = (content, fallbackMessage) => {
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

const normalizeMovieTitle = (movieName = '') => {
  return String(movieName || '').trim().replace(/\s+/g, ' ')
}

const createMovieAlias = (movieName = '', fallbackAlias = '') => {
  const normalizedFallbackAlias = String(fallbackAlias || '').trim()

  if (normalizedFallbackAlias) {
    return normalizedFallbackAlias
  }

  return String(movieName || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const buildMovieFormData = ({
  movieForm,
  imageFile,
  includeMovieId = false,
  fallbackAlias = '',
}) => {
  const formData = new FormData()
  const movieTitleToSubmit = normalizeMovieTitle(movieForm.tenPhim)

  if (includeMovieId) {
    formData.append('maPhim', String(movieForm.maPhim))
  }

  formData.append('tenPhim', movieTitleToSubmit)
  formData.append('biDanh', createMovieAlias(movieTitleToSubmit, fallbackAlias))
  formData.append('trailer', movieForm.trailer.trim())
  formData.append('moTa', movieForm.moTa.trim())
  formData.append('maNhom', MA_NHOM)
  formData.append('ngayKhoiChieu', formatDateForApi(movieForm.ngayKhoiChieu))
  formData.append('danhGia', String(Number(movieForm.danhGia) || 0))
  formData.append('hot', String(movieForm.hot))
  formData.append('dangChieu', String(movieForm.dangChieu))
  formData.append('sapChieu', String(movieForm.sapChieu))

  if (imageFile) {
    formData.append(includeMovieId ? 'File' : 'hinhAnh', imageFile, imageFile.name)
  }

  return formData
}
