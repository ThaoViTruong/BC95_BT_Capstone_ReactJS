import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmActionModal from '../../components/admin/film-management/ConfirmActionModal'
import { useToast } from '../../components/ToastProvider'
import { cinemaApi } from '../../api/cinemaApi'
import { useCumRapTheoHeThong, useHeThongRap } from '../../hooks/useCinema'
import { useMovieDetail } from '../../hooks/useMovies'

const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60'

const labelClassName = 'mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-white'

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

const formatDateTimeForApi = (dateTimeValue) => {
  if (!dateTimeValue) {
    return ''
  }

  const [datePart, timePart] = dateTimeValue.split('T')
  if (!datePart || !timePart) {
    return ''
  }

  const [year, month, day] = datePart.split('-')
  const normalizedTime = timePart.length === 5 ? `${timePart}:00` : timePart

  if (!year || !month || !day) {
    return ''
  }

  return `${day}/${month}/${year} ${normalizedTime}`
}

const buildShowtimePayload = (movieId, dateTimeValue, clusterCode, ticketPrice) => {
  return {
    maPhim: Number(movieId),
    ngayChieuGioChieu: formatDateTimeForApi(dateTimeValue),
    maRap: String(clusterCode),
    giaVe: Number(ticketPrice) || 0,
  }
}

const getActiveHeThongRap = (selectedHeThongRap, heThongRap) => {
  return selectedHeThongRap || heThongRap[0]?.maHeThongRap || ''
}

const getActiveCumRap = (selectedCumRap, cumRapTheoHeThong) => {
  return (
    cumRapTheoHeThong.find((cumRap) => cumRap.maCumRap === selectedCumRap)?.maCumRap ||
    cumRapTheoHeThong[0]?.maCumRap ||
    ''
  )
}

const getSelectedCumRapData = (cumRapTheoHeThong, activeCumRap) => {
  return cumRapTheoHeThong.find((cumRap) => cumRap.maCumRap === activeCumRap) || null
}

const isShowtimeFormInvalid = ({ movieId, clusterCode, dateTimeValue }) => {
  return !movieId || !clusterCode || !dateTimeValue
}

const buildCreateShowtimeVariables = ({ movieId, dateTimeValue, ticketPrice, clusterCode }) => {
  return {
    movieId,
    dateTimeValue,
    ticketPrice,
    clusterCode,
  }
}

const FilmShowtimePage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { idFilm } = useParams()
  const { data: movieDetail, isLoading, isError, error } = useMovieDetail(idFilm)
  const { data: heThongRap = [], isLoading: isLoadingHeThongRap } = useHeThongRap()
  const [selectedHeThongRap, setSelectedHeThongRap] = useState('')
  const [selectedCumRap, setSelectedCumRap] = useState('')
  const [ngayChieuGioChieu, setNgayChieuGioChieu] = useState('')
  const [giaVe, setGiaVe] = useState(75000)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const activeHeThongRap = getActiveHeThongRap(selectedHeThongRap, heThongRap)
  const { data: cumRapTheoHeThong = [], isLoading: isLoadingCumRap } = useCumRapTheoHeThong(activeHeThongRap)
  const activeCumRap = getActiveCumRap(selectedCumRap, cumRapTheoHeThong)

  const selectedCumRapData = useMemo(
    () => getSelectedCumRapData(cumRapTheoHeThong, activeCumRap),
    [activeCumRap, cumRapTheoHeThong]
  )

  const createShowtimeMutation = useMutation({
    mutationFn: ({ movieId, dateTimeValue, ticketPrice, clusterCode }) =>
      cinemaApi.createShowtime(buildShowtimePayload(movieId, dateTimeValue, clusterCode, ticketPrice)),
    onSuccess: () => {
      setIsConfirmModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['lichChieuHeThongRap'] })
      queryClient.invalidateQueries({ queryKey: ['adminShowtimeSystem'] })
      queryClient.invalidateQueries({ queryKey: ['movieShowtimes', movieDetail?.maPhim] })
      showToast({
        type: 'success',
        title: 'Tạo lịch chiếu thành công',
        message: 'Lịch chiếu mới đã được tạo cho bộ phim này.',
      })
      navigate('/admin/showtimes')
    },
    onError: (mutationError) => {
      showToast({
        type: 'error',
        title: 'Tạo lịch chiếu thất bại',
        message: getApiMessage(mutationError.response?.data, 'Không thể tạo lịch chiếu. Vui lòng thử lại.'),
      })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    if (
      isShowtimeFormInvalid({
        movieId: movieDetail?.maPhim,
        clusterCode: selectedCumRapData?.maCumRap,
        dateTimeValue: ngayChieuGioChieu,
      })
    ) {
      showToast({
        type: 'error',
        title: 'Thiếu thông tin',
        message: 'Vui lòng chọn đầy đủ hệ thống rạp, cụm rạp, ngày chiếu giờ chiếu và giá vé.',
      })
      return
    }

    setIsConfirmModalOpen(true)
  }

  const handleConfirmCreateShowtime = () => {
    if (!movieDetail?.maPhim || !selectedCumRapData?.maCumRap || !ngayChieuGioChieu) {
      setIsConfirmModalOpen(false)
      return
    }

    createShowtimeMutation.mutate(buildCreateShowtimeVariables({
      movieId: movieDetail.maPhim,
      dateTimeValue: ngayChieuGioChieu,
      ticketPrice: giaVe,
      clusterCode: selectedCumRapData.maCumRap,
    }))
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
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-400">Tạo lịch chiếu</p>
          <h1 className="mt-3 text-4xl font-bold text-white">{movieDetail?.tenPhim}</h1>
          <p className="mt-3 text-base leading-8 text-white/70">
            Chọn hệ thống rạp, cụm rạp, thời gian chiếu và giá vé để tạo lịch chiếu mới cho bộ phim.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/films')}
          className="rounded-2xl border border-white/10 px-5 py-4 text-base font-medium text-white transition hover:bg-white/5"
        >
          Quay lại danh sách phim
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-32px border border-white/10 bg-[#101010] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <div className="overflow-hidden rounded-24px border border-white/10 bg-[#181818]">
            <img src={movieDetail?.hinhAnh} alt={movieDetail?.tenPhim} className="h-full w-full object-cover" />
          </div>
          <div className="mt-5 space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-white/50">Mã phim</p>
            <p className="text-2xl font-bold text-yellow-300">#{movieDetail?.maPhim}</p>
            <p className="text-sm leading-7 text-white/70">{movieDetail?.moTa || 'Chưa có mô tả phim.'}</p>
          </div>
        </div>

        <div className="rounded-32px border border-white/10 bg-[#101010] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <div>
                <label className={labelClassName}>Hệ thống rạp</label>
                <select
                  value={activeHeThongRap}
                  onChange={(event) => setSelectedHeThongRap(event.target.value)}
                  className={inputClassName}
                  disabled={isLoadingHeThongRap || heThongRap.length === 0}
                >
                  {heThongRap.length === 0 ? (
                    <option value="">Không có hệ thống rạp</option>
                  ) : (
                    heThongRap.map((heThong) => (
                      <option key={heThong.maHeThongRap} value={heThong.maHeThongRap}>
                        {heThong.tenHeThongRap}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className={labelClassName}>Cụm rạp</label>
                <select
                  value={activeCumRap}
                  onChange={(event) => setSelectedCumRap(event.target.value)}
                  className={inputClassName}
                  disabled={!activeHeThongRap || isLoadingCumRap || cumRapTheoHeThong.length === 0}
                >
                  {cumRapTheoHeThong.length === 0 ? (
                    <option value="">Không có cụm rạp</option>
                  ) : (
                    cumRapTheoHeThong.map((cumRap) => (
                      <option key={cumRap.maCumRap} value={cumRap.maCumRap}>
                        {cumRap.tenCumRap}
                      </option>
                    ))
                  )}
                </select>
                {selectedCumRapData ? (
                  <p className="mt-3 text-sm text-white/60">
                    Địa chỉ cụm rạp: <span className="font-medium text-yellow-300">{selectedCumRapData.diaChi}</span>
                  </p>
                ) : null}
              </div>

              <div>
                <label className={labelClassName}>Ngày chiếu giờ chiếu</label>
                <input
                  type="datetime-local"
                  value={ngayChieuGioChieu}
                  onChange={(event) => setNgayChieuGioChieu(event.target.value)}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label className={labelClassName}>Giá vé</label>
                <input
                  type="number"
                  min="75000"
                  max="150000"
                  step="5000"
                  value={giaVe}
                  onChange={(event) => setGiaVe(event.target.value)}
                  className={inputClassName}
                  placeholder="Nhập giá vé"
                  required
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#181818] px-5 py-4 text-sm leading-7 text-white/65">
              {selectedCumRapData ? (
                <>
                  <p>
                    Cụm rạp đã chọn: <span className="font-medium text-white">{selectedCumRapData.tenCumRap}</span>
                  </p>
                  <p>
                    Địa chỉ: <span className="font-medium text-white">{selectedCumRapData.diaChi}</span>
                  </p>
                  <p>
                    Giá trị `maRap` gửi lên hệ thống: <span className="font-medium text-white">{selectedCumRapData.maCumRap}</span>
                  </p>
                </>
              ) : (
                <p>Vui lòng chọn cụm rạp phù hợp để tiếp tục tạo lịch chiếu.</p>
              )}
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
                disabled={createShowtimeMutation.isPending}
                className="rounded-2xl border border-red-300/30 bg-gradient-to-r from-red-500 via-red-600 to-rose-600 px-7 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(239,68,68,0.35)] transition hover:-translate-y-0.5 hover:from-red-400 hover:via-red-500 hover:to-rose-500 hover:shadow-[0_20px_50px_rgba(239,68,68,0.45)] focus:outline-none focus:ring-2 focus:ring-red-400/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {createShowtimeMutation.isPending ? 'Đang tạo...' : 'Tạo lịch chiếu'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        title="Xác nhận tạo lịch chiếu"
        description={`Bạn có chắc muốn tạo lịch chiếu cho phim "${movieDetail?.tenPhim}" tại cụm rạp "${selectedCumRapData?.tenCumRap || 'Chưa chọn'}" vào lúc "${formatDateTimeForApi(ngayChieuGioChieu) || 'Chưa chọn'}" với giá vé ${Number(giaVe || 0).toLocaleString('vi-VN')} VNĐ không?`}
        confirmLabel="Xác nhận tạo"
        isSubmitting={createShowtimeMutation.isPending}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmCreateShowtime}
      />
    </div>
  )
}

export default FilmShowtimePage


