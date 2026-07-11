import { MA_NHOM, emptyMovieForm, getApiMessage } from './movieFormUtils'

const padNumber = (value) => String(value).padStart(2, '0')

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

export const emptyMovieEditForm = {
  ...emptyMovieForm,
}

export const formatMovieDateForInput = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const normalizedDateValue = String(dateValue)

  if (/^\d{4}-\d{2}-\d{2}/.test(normalizedDateValue)) {
    return normalizedDateValue.slice(0, 10)
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return `${date.getFullYear()}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`
}

export const formatMovieDateForApi = (dateValue) => {
  if (!dateValue) {
    return ''
  }

  const [year, month, day] = String(dateValue).split('-')

  if (!year || !month || !day) {
    return ''
  }

  return `${day}/${month}/${year}`
}

export const createMovieEditForm = (movieDetail) => {
  if (!movieDetail) {
    return emptyMovieEditForm
  }

  return {
    maPhim: movieDetail.maPhim || '',
    tenPhim: movieDetail.tenPhim || '',
    trailer: movieDetail.trailer || '',
    moTa: movieDetail.moTa || '',
    ngayKhoiChieu: formatMovieDateForInput(movieDetail.ngayKhoiChieu),
    danhGia: movieDetail.danhGia ?? 0,
    hot: Boolean(movieDetail.hot),
    dangChieu: Boolean(movieDetail.dangChieu),
    sapChieu: Boolean(movieDetail.sapChieu),
  }
}

const getImageFileNameFromUrl = (imageUrl = '') => {
  if (!imageUrl) {
    return ''
  }

  const normalizedUrl = String(imageUrl).split('?')[0]
  const segments = normalizedUrl.split('/')

  return segments[segments.length - 1] || ''
}

const buildMovieUpdateBaseFields = ({ movieForm, originalMovie }) => {
  const normalizedTitle = normalizeMovieTitle(movieForm.tenPhim)

  return {
    maPhim: Number(originalMovie?.maPhim ?? movieForm.maPhim ?? 0),
    tenPhim: normalizedTitle,
    biDanh: createMovieAlias(normalizedTitle, originalMovie?.biDanh || ''),
    trailer: String(movieForm.trailer || '').trim(),
    moTa: String(movieForm.moTa || '').trim(),
    maNhom: originalMovie?.maNhom || MA_NHOM,
    ngayKhoiChieu: formatMovieDateForApi(movieForm.ngayKhoiChieu),
    danhGia: Number(movieForm.danhGia) || 0,
    hot: Boolean(movieForm.hot),
    dangChieu: Boolean(movieForm.dangChieu),
    sapChieu: Boolean(movieForm.sapChieu),
    hinhAnh: originalMovie?.hinhAnh || '',
  }
}

const createMovieImageUploadFile = (movieName, imageFile) => {
  if (!imageFile) {
    return null
  }

  const originalExtension = imageFile.name.includes('.')
    ? imageFile.name.slice(imageFile.name.lastIndexOf('.')).toLowerCase()
    : '.jpg'
  const safeExtension = /^\.[a-z0-9]+$/i.test(originalExtension) ? originalExtension : '.jpg'
  const safeMovieName = createMovieAlias(movieName, '') || 'poster-phim'
  const nextFileName = `${safeMovieName}-${Date.now()}${safeExtension}`

  return new File([imageFile], nextFileName, {
    type: imageFile.type || 'image/jpeg',
    lastModified: imageFile.lastModified || Date.now(),
  })
}

export const buildMovieUpdatePayload = ({ movieForm, originalMovie }) => {
  return buildMovieUpdateBaseFields({
    movieForm,
    originalMovie,
  })
}

export const buildMovieUpdateUploadFormData = ({
  movieForm,
  originalMovie,
  imageFile,
  currentImage,
}) => {
  const updateFields = buildMovieUpdateBaseFields({
    movieForm,
    originalMovie,
  })
  const uploadFile = createMovieImageUploadFile(updateFields.tenPhim, imageFile)
  const currentImageFileName = getImageFileNameFromUrl(currentImage || updateFields.hinhAnh)
  const formData = new FormData()

  formData.append('maPhim', String(updateFields.maPhim))
  formData.append('tenPhim', updateFields.tenPhim)
  formData.append('biDanh', updateFields.biDanh)
  formData.append('trailer', updateFields.trailer)
  formData.append('moTa', updateFields.moTa)
  formData.append('maNhom', updateFields.maNhom)
  formData.append('ngayKhoiChieu', updateFields.ngayKhoiChieu)
  formData.append('danhGia', String(updateFields.danhGia))
  formData.append('hot', String(updateFields.hot))
  formData.append('dangChieu', String(updateFields.dangChieu))
  formData.append('sapChieu', String(updateFields.sapChieu))

  if (uploadFile) {
    formData.append('hinhAnh', uploadFile, uploadFile.name)
    formData.append('File', uploadFile, uploadFile.name)
  } else if (currentImageFileName) {
    formData.append('hinhAnh', currentImageFileName)
  }

  return formData
}

export const getMovieUpdateErrorMessage = (mutationError) => {
  const rawMessage = getApiMessage(
    mutationError.response?.data?.content || mutationError.response?.data,
    'Không thể cập nhật phim. Vui lòng thử lại.'
  )

  return rawMessage.toLowerCase().includes('xóa')
    ? 'Không thể cập nhật phim. Vui lòng kiểm tra lại thông tin hoặc ảnh poster.'
    : rawMessage
}
