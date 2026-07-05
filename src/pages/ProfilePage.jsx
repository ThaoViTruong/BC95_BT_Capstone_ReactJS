import React, { useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../components/LoadingSpinner'
import { useProfile, useUpdateUser } from '../hooks/useUser'
import { login, selectorIsLoggedIn, selectorUser } from '../store/authSlice'
import axiosInstance from '../api/axiosInstance'

const PROFILE_TABS = {
  info: 'info',
  tickets: 'tickets',
}

const userInfoSchema = Yup.object({
  email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),
  hoTen: Yup.string().trim().required('Họ tên không được để trống'),
  soDt: Yup.string().trim().required('Số điện thoại không được để trống'),
  matKhau: Yup.string().test(
    'password-length',
    'Mật khẩu phải có ít nhất 6 ký tự',
    (value) => !value || value.length >= 6
  ),
  xacNhanMatKhau: Yup.string().when('matKhau', {
    is: (value) => Boolean(value?.trim()),
    then: (schema) =>
      schema
        .required('Vui lòng nhập lại mật khẩu')
        .oneOf([Yup.ref('matKhau')], 'Mật khẩu xác nhận không khớp'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

const getApiMessage = (content, fallbackMessage) => {
  if (typeof content === 'string' && content.trim()) return content
  if (content && typeof content === 'object') {
    if (typeof content.message === 'string' && content.message.trim()) return content.message
    if (typeof content.content === 'string' && content.content.trim()) return content.content
    if (content.content && typeof content.content === 'object') {
      if (typeof content.content.message === 'string' && content.content.message.trim()) {
        return content.content.message
      }
    }
  }
  return fallbackMessage
}

const formatDateTime = (dateValue) => {
  if (!dateValue) return 'Chưa có dữ liệu'
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return dateValue
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const formatCurrency = (value = 0) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value)
}

/* ✅ Hàm ghép ngayChieu + gioChieu thành chuỗi datetime */
const formatShowtime = (ngayChieu, gioChieu) => {
  if (!ngayChieu) return 'Chưa có dữ liệu'
  const dateStr = gioChieu ? `${ngayChieu}T${gioChieu}` : ngayChieu
  return formatDateTime(dateStr)
}

const formLabelClassName = 'mb-2 block text-sm font-medium text-white'
const formInputClassName =
  'w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
const formInputDisabledClassName =
  'w-full rounded-2xl border border-white/10 bg-gray-950/70 px-4 py-3 text-sm text-white/65 outline-none'
const summaryCardClassName = 'rounded-2xl border border-white/10 bg-black/20 p-4'

const renderFieldError = (formik, fieldName) => {
  if (!formik.touched[fieldName] || !formik.errors[fieldName]) return null
  return <p className="mt-2 text-sm text-red-400">{formik.errors[fieldName]}</p>
}

const ProfilePage = () => {
  const isLoggedIn = useSelector(selectorIsLoggedIn)
  const currentUser = useSelector(selectorUser)
  const dispatch = useDispatch()
  const { data: profile, isLoading, isError } = useProfile(isLoggedIn)
  const updateUserMutation = useUpdateUser()
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.info)
  const [actionMessage, setActionMessage] = useState(null)
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  const { data: allMovies } = useQuery({
    queryKey: ['allMoviesForProfile'],
    queryFn: async () => {
      const res = await axiosInstance.get('/QuanLyPhim/LayDanhSachPhim', {
        params: { maNhom: 'GP01' },
      })
      return res.data.content
    },
    staleTime: 5 * 60 * 1000,
  })

  const movieMap = useMemo(() => {
    const map = {}
    ;(allMovies || []).forEach((m) => {
      if (m?.tenPhim) map[m.tenPhim] = m.maPhim
    })
    return map
  }, [allMovies])

  const getMaPhim = (ticket) => {
    return ticket?.maPhim || movieMap[ticket?.tenPhim] || null
  }

  const tickets = profile?.thongTinDatVe || []

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => new Date(b.ngayDat) - new Date(a.ngayDat))
  }, [tickets])

  const selectedTicket = useMemo(() => {
    return (
      sortedTickets.find((ticket) => ticket.maVe === selectedTicketId) ||
      sortedTickets[0] ||
      null
    )
  }, [selectedTicketId, sortedTickets])

  const avatar =
    profile?.hoTen?.[0]?.toUpperCase() || profile?.taiKhoan?.[0]?.toUpperCase() || 'U'

  const ticketCount = useMemo(() => {
    return sortedTickets.reduce((total, ticket) => {
      return total + (ticket.danhSachGhe?.length || 0)
    }, 0)
  }, [sortedTickets])

  const latestBookingDate = useMemo(() => {
    let latest = null
    sortedTickets.forEach((ticket) => {
      const ticketDate = ticket.ngayDat ? new Date(ticket.ngayDat) : null
      if (ticketDate && !Number.isNaN(ticketDate.getTime())) {
        if (!latest || ticketDate > latest) latest = ticketDate
      }
      ;(ticket.danhSachGhe || []).forEach((seat) => {
        const seatDate = seat.ngayDat ? new Date(seat.ngayDat) : null
        if (seatDate && !Number.isNaN(seatDate.getTime())) {
          if (!latest || seatDate > latest) latest = seatDate
        }
      })
    })
    return latest
  }, [sortedTickets])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taiKhoan: profile?.taiKhoan || '',
      hoTen: profile?.hoTen || '',
      email: profile?.email || '',
      soDt: profile?.soDT || '',
      matKhau: '',
      xacNhanMatKhau: '',
      maNhom: profile?.maNhom || currentUser?.maNhom || 'GP00',
      maLoaiNguoiDung: profile?.maLoaiNguoiDung || currentUser?.maLoaiNguoiDung || 'KhachHang',
    },
    validationSchema: userInfoSchema,
    onSubmit: async (values, { resetForm }) => {
      setActionMessage(null)
      const normalizedPassword = values.matKhau.trim()
      const passwordToSubmit =
        normalizedPassword || profile?.matKhau || currentUser?.matKhau || ''
      const payload = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: passwordToSubmit,
        email: values.email.trim(),
        soDt: values.soDt.trim(),
        maNhom: values.maNhom,
        maLoaiNguoiDung: values.maLoaiNguoiDung,
        hoTen: values.hoTen.trim(),
      }
      try {
        await updateUserMutation.mutateAsync(payload)
        dispatch(login({ ...(currentUser || {}), ...payload, soDT: payload.soDt }))
        resetForm({ values: { ...values, matKhau: '', xacNhanMatKhau: '' } })
        setActionMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công.' })
      } catch (error) {
        setActionMessage({
          type: 'error',
          text: getApiMessage(
            error.response?.data,
            'Không thể cập nhật thông tin. Vui lòng thử lại.'
          ),
        })
      }
    },
  })

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/70">
        <LoadingSpinner />
      </div>
    )
  }

  if (isError || !profile) {
    return (
      <div className="min-h-screen bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-gray-800 bg-gray-900/80 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">Không thể tải thông tin cá nhân</h1>
          <p className="mt-4 text-white/60">
            Vui lòng thử lại sau hoặc đăng nhập lại để tiếp tục.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* HEADER */}
        <div className="rounded-[28px] border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-400 text-3xl font-bold text-gray-900">
                {avatar}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-bold text-white">{profile.hoTen}</h1>
                  <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                    {profile.maLoaiNguoiDung === 'QuanTri' ? 'Quản trị' : 'Khách hàng'}
                  </span>
                </div>
                <p className="mt-2 text-base text-white/60">@{profile.taiKhoan}</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">Email</p>
                    <p className="mt-2 text-sm text-white/85">
                      {profile.email || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                      Số điện thoại
                    </p>
                    <p className="mt-2 text-sm text-white/85">
                      {profile.soDT || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">
                      Lần đặt vé gần nhất
                    </p>
                    <p className="mt-2 text-sm text-white/85">
                      {latestBookingDate
                        ? formatDateTime(latestBookingDate)
                        : 'Chưa có lịch sử đặt vé'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Tổng vé đã đặt</p>
                <p className="mt-2 text-3xl font-bold text-yellow-300">{ticketCount}</p>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                ← Trở về trang chủ
              </Link>
              {profile.maLoaiNguoiDung === 'QuanTri' ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-500"
                >
                  ⚙️ Trang quản trị
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="mt-8 overflow-hidden rounded-[28px] border border-gray-800 bg-gray-900/80 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
          <div className="flex flex-wrap gap-2 border-b border-gray-800 p-4">
            <button
              type="button"
              onClick={() => setActiveTab(PROFILE_TABS.info)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === PROFILE_TABS.info
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-800 text-white/75 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Thông tin cá nhân
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(PROFILE_TABS.tickets)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === PROFILE_TABS.tickets
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-800 text-white/75 hover:bg-gray-700 hover:text-white'
              }`}
            >
              Lịch sử đặt vé
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === PROFILE_TABS.info ? (
              <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Cập nhật thông tin</h2>
                    <p className="mt-2 text-sm text-white/60">
                      Bạn có thể chỉnh sửa thông tin cá nhân và cập nhật mật khẩu tại đây.
                    </p>
                  </div>

                  {actionMessage ? (
                    <div
                      className={`rounded-2xl border px-4 py-3 text-sm ${
                        actionMessage.type === 'success'
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-300'
                      }`}
                    >
                      {actionMessage.text}
                    </div>
                  ) : null}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className={formLabelClassName}>Tài khoản</label>
                      <input
                        type="text"
                        value={formik.values.taiKhoan}
                        disabled
                        className={formInputDisabledClassName}
                      />
                    </div>
                    <div>
                      <label className={formLabelClassName}>Họ tên</label>
                      <input
                        type="text"
                        {...formik.getFieldProps('hoTen')}
                        placeholder="Nhập họ tên"
                        className={formInputClassName}
                      />
                      {renderFieldError(formik, 'hoTen')}
                    </div>
                    <div>
                      <label className={formLabelClassName}>Email</label>
                      <input
                        type="email"
                        {...formik.getFieldProps('email')}
                        placeholder="Nhập email"
                        className={formInputClassName}
                      />
                      {renderFieldError(formik, 'email')}
                    </div>
                    <div>
                      <label className={formLabelClassName}>Số điện thoại</label>
                      <input
                        type="text"
                        {...formik.getFieldProps('soDt')}
                        placeholder="Nhập số điện thoại"
                        className={formInputClassName}
                      />
                      {renderFieldError(formik, 'soDt')}
                    </div>
                    <div className="md:col-span-2">
                      <label className={formLabelClassName}>Mật khẩu mới</label>
                      <input
                        type="password"
                        {...formik.getFieldProps('matKhau')}
                        placeholder="Để trống nếu không muốn thay đổi"
                        className={formInputClassName}
                      />
                      {renderFieldError(formik, 'matKhau')}
                    </div>
                    {formik.values.matKhau.trim() ? (
                      <div className="md:col-span-2">
                        <label className={formLabelClassName}>Xác nhận mật khẩu</label>
                        <input
                          type="password"
                          {...formik.getFieldProps('xacNhanMatKhau')}
                          placeholder="Nhập lại mật khẩu mới để xác nhận"
                          className={formInputClassName}
                        />
                        {renderFieldError(formik, 'xacNhanMatKhau')}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex justify-end border-t border-white/10 pt-5">
                    <button
                      type="submit"
                      disabled={updateUserMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updateUserMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                    </button>
                  </div>
                </form>

                <div className="space-y-4 rounded-[24px] border border-white/10 bg-gray-950/60 p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Tóm tắt tài khoản</h3>
                    <p className="mt-2 text-sm text-white/60">
                      Thông tin hiện tại của tài khoản đang đăng nhập.
                    </p>
                  </div>
                  <div className={summaryCardClassName}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Họ tên</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {profile.hoTen || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div className={summaryCardClassName}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">Email</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {profile.email || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div className={summaryCardClassName}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Số điện thoại
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {profile.soDT || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div className={summaryCardClassName}>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Nhóm / Loại người dùng
                    </p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {profile.maNhom || 'GP00'} / {profile.maLoaiNguoiDung || 'Khách hàng'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* ============ TAB: LỊCH SỬ ĐẶT VÉ ============ */
              <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Lịch sử đặt vé</h2>
                      <p className="mt-2 text-sm text-white/60">
                        Chọn một vé để xem chi tiết rạp, ghế và thời gian đặt.
                      </p>
                    </div>
                  </div>

                  {ticketCount === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-gray-950/45 px-6 py-12 text-center text-white/55">
                      Bạn chưa có lịch sử đặt vé nào.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedTickets.map((ticket) => {
                        const firstSeat = ticket.danhSachGhe?.[0]
                        const isActive = ticket.maVe === selectedTicket?.maVe
                        const maPhim = getMaPhim(ticket)

                        return (
                          <div
                            key={ticket.maVe}
                            className={`w-full rounded-[24px] border p-4 text-left transition ${
                              isActive
                                ? 'border-yellow-400/45 bg-yellow-400/10'
                                : 'border-white/10 bg-gray-950/50 hover:border-yellow-400/20'
                            }`}
                          >
                            <div className="flex gap-4">
                              {/* POSTER */}
                              <Link
                                to={maPhim ? `/movie/${maPhim}` : '#'}
                                onClick={(e) => {
                                  if (!maPhim) {
                                    e.preventDefault()
                                    alert('Không tìm thấy thông tin phim này')
                                  }
                                }}
                                className="group relative flex-shrink-0"
                                title={`Xem chi tiết phim: ${ticket.tenPhim}`}
                              >
                                <img
                                  src={ticket.hinhAnh}
                                  alt={ticket.tenPhim}
                                  className="h-28 w-20 rounded-2xl object-cover transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-yellow-500/30"
                                />
                                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                  <span className="px-1 text-center text-[10px] font-bold leading-tight text-yellow-400">
                                    Xem
                                    <br />
                                    chi tiết
                                  </span>
                                </div>
                              </Link>

                              {/* PHẦN INFO */}
                              <button
                                type="button"
                                onClick={() => setSelectedTicketId(ticket.maVe)}
                                className="min-w-0 flex-1 cursor-pointer text-left"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-lg font-semibold text-white">
                                      {ticket.tenPhim}
                                    </h3>
                                    <p className="mt-1 text-sm text-white/55">
                                      {firstSeat?.tenHeThongRap || 'Chưa có thông tin rạp'}
                                    </p>
                                  </div>
                                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/65">
                                    Mã vé #{ticket.maVe}
                                  </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
                                  <span>🗓 Đặt lúc: {formatDateTime(ticket.ngayDat)}</span>
                                  <span>
                                    🎟{' '}
                                    {formatCurrency(
                                      ticket.giaVe * (ticket.danhSachGhe?.length || 1)
                                    )}
                                  </span>
                                  {/* ✅ Suất chiếu trong card */}
                                  {firstSeat?.ngayChieu && (
                                    <span>
                                      🎬 Suất chiếu:{' '}
                                      {formatShowtime(firstSeat.ngayChieu, firstSeat.gioChieu)}
                                    </span>
                                  )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {(ticket.danhSachGhe || []).map((seat, idx) => (
                                    <span
                                      key={`${ticket.maVe}-${seat.maGhe}-${idx}`}
                                      className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-300"
                                    >
                                      Ghế {seat.tenGhe}
                                    </span>
                                  ))}
                                </div>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* ============ PANEL CHI TIẾT ============ */}
                <div className="rounded-[24px] border border-white/10 bg-gray-950/60 p-6">
                  <h3 className="text-2xl font-bold text-white">Chi tiết vé đã đặt</h3>

                  {selectedTicket ? (
                    <div className="mt-6 space-y-5">
                      <div className="flex items-start gap-4">
                        {(() => {
                          const maPhimDetail = getMaPhim(selectedTicket)
                          return (
                            <Link
                              to={maPhimDetail ? `/movie/${maPhimDetail}` : '#'}
                              onClick={(e) => {
                                if (!maPhimDetail) {
                                  e.preventDefault()
                                  alert('Không tìm thấy thông tin phim này')
                                }
                              }}
                              className="group relative flex-shrink-0"
                              title={`Xem chi tiết phim: ${selectedTicket.tenPhim}`}
                            >
                              <img
                                src={selectedTicket.hinhAnh}
                                alt={selectedTicket.tenPhim}
                                className="h-36 w-24 rounded-2xl object-cover transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-yellow-500/30"
                              />
                              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="px-1 text-center text-xs font-bold text-yellow-400">
                                  Xem
                                  <br />
                                  chi tiết
                                </span>
                              </div>
                            </Link>
                          )
                        })()}

                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                            Bộ phim
                          </p>
                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {selectedTicket.tenPhim}
                          </h4>
                          <p className="mt-2 text-sm text-yellow-300">
                            {formatCurrency(
                              selectedTicket.giaVe * (selectedTicket.danhSachGhe?.length || 1)
                            )}
                          </p>
                          <p className="mt-1 text-xs text-white/45">
                            {selectedTicket.danhSachGhe?.length || 1} ghế ×{' '}
                            {formatCurrency(selectedTicket.giaVe)}/ghế
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className={summaryCardClassName}>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Ngày đặt
                          </p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {formatDateTime(selectedTicket.ngayDat)}
                          </p>
                        </div>

                        <div className={summaryCardClassName}>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Mã vé</p>
                          <p className="mt-2 text-sm font-medium text-white">
                            #{selectedTicket.maVe}
                          </p>
                        </div>

                        {/* ✅ Card suất chiếu trong panel chi tiết */}
                        {selectedTicket.danhSachGhe?.[0]?.ngayChieu && (
                          <div className={`${summaryCardClassName} sm:col-span-2`}>
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                              Suất chiếu
                            </p>
                            <p className="mt-2 text-sm font-medium text-white">
                              {formatShowtime(
                                selectedTicket.danhSachGhe[0].ngayChieu,
                                selectedTicket.danhSachGhe[0].gioChieu
                              )}
                            </p>
                          </div>
                        )}

                        <div className={`${summaryCardClassName} sm:col-span-2`}>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Rạp chiếu
                          </p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {selectedTicket.danhSachGhe?.[0]?.tenHeThongRap || 'Chưa có thông tin'}
                          </p>
                          <p className="mt-1 text-sm text-white/60">
                            {selectedTicket.danhSachGhe?.[0]?.tenCumRap || 'Chưa có cụm rạp'} 
                            
                          </p>
                        </div>

                        <div className={`${summaryCardClassName} sm:col-span-2`}>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                            Danh sách ghế
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(selectedTicket.danhSachGhe || []).map((seat, idx) => (
                              <span
                                key={`${selectedTicket.maVe}-detail-${seat.maGhe}-${idx}`}
                                className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-xs font-medium text-yellow-300"
                              >
                                Ghế {seat.tenGhe}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-12 text-center text-white/50">
                      Chọn một vé ở danh sách bên trái để xem chi tiết.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage