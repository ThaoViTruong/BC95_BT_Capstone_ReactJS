import React, { useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpinner from '../components/LoadingSpinner'
import { useProfile, useUpdateUser } from '../hooks/useUser'
import { login, selectorIsLoggedIn, selectorUser } from '../store/authSlice'

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

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return 'Chưa có dữ liệu'
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

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

const ProfilePage = () => {
  const isLoggedIn = useSelector(selectorIsLoggedIn)
  const currentUser = useSelector(selectorUser)
  const dispatch = useDispatch()
  const { data: profile, isLoading, isError } = useProfile(isLoggedIn)
  const updateUserMutation = useUpdateUser()
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.info)
  const [actionMessage, setActionMessage] = useState(null)

  const tickets = profile?.thongTinDatVe || []
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  const selectedTicket = useMemo(() => {
    return tickets.find((ticket) => ticket.maVe === selectedTicketId) || tickets[0] || null
  }, [selectedTicketId, tickets])

  const avatar = profile?.hoTen?.[0]?.toUpperCase() || profile?.taiKhoan?.[0]?.toUpperCase() || 'U'
  const ticketCount = tickets.length
  const latestTicket = tickets[0]

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
      const passwordToSubmit = normalizedPassword || profile?.matKhau || currentUser?.matKhau || ''

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

        dispatch(login({
          ...(currentUser || {}),
          ...payload,
          soDT: payload.soDt,
        }))

        resetForm({
          values: {
            ...values,
            matKhau: '',
            xacNhanMatKhau: '',
          },
        })

        setActionMessage({
          type: 'success',
          text: 'Cập nhật thông tin cá nhân thành công.',
        })
      } catch (error) {
        setActionMessage({
          type: 'error',
          text: getApiMessage(error.response?.data, 'Không thể cập nhật thông tin. Vui lòng thử lại.'),
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
          <p className="mt-4 text-white/60">Vui lòng thử lại sau hoặc đăng nhập lại để tiếp tục.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
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
                    <p className="mt-2 text-sm text-white/85">{profile.email || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">Số điện thoại</p>
                    <p className="mt-2 text-sm text-white/85">{profile.soDT || 'Chưa cập nhật'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/35">Lần đặt vé gần nhất</p>
                    <p className="mt-2 text-sm text-white/85">{latestTicket ? formatDateTime(latestTicket.ngayDat) : 'Chưa có lịch sử đặt vé'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Tổng vé đã đặt</p>
                <p className="mt-2 text-3xl font-bold text-yellow-300">{ticketCount}</p>
              </div>
              <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                ← Trở về trang chủ
              </Link>
              {profile.maLoaiNguoiDung === 'QuanTri' ? (
                <Link to="/admin" className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-500">
                  ⚙️ Trang quản trị
                </Link>
              ) : null}
            </div>
          </div>
        </div>

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
                    <p className="mt-2 text-sm text-white/60">Bạn có thể chỉnh sửa thông tin cá nhân và cập nhật mật khẩu tại đây.</p>
                  </div>

                  {actionMessage ? (
                    <div className={`rounded-2xl border px-4 py-3 text-sm ${
                      actionMessage.type === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}>
                      {actionMessage.text}
                    </div>
                  ) : null}

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">Email</label>
                      <input
                        type="email"
                        {...formik.getFieldProps('email')}
                        className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                      {formik.touched.email && formik.errors.email ? (
                        <p className="mt-2 text-sm text-red-400">{formik.errors.email}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">Tài khoản</label>
                      <input
                        type="text"
                        value={formik.values.taiKhoan}
                        disabled
                        className="w-full rounded-2xl border border-white/10 bg-gray-950/70 px-4 py-3 text-sm text-white/65 outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">Họ tên</label>
                      <input
                        type="text"
                        {...formik.getFieldProps('hoTen')}
                        className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                      {formik.touched.hoTen && formik.errors.hoTen ? (
                        <p className="mt-2 text-sm text-red-400">{formik.errors.hoTen}</p>
                      ) : null}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">Mật khẩu mới</label>
                      <input
                        type="password"
                        {...formik.getFieldProps('matKhau')}
                        placeholder="********"
                        className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                      {formik.touched.matKhau && formik.errors.matKhau ? (
                        <p className="mt-2 text-sm text-red-400">{formik.errors.matKhau}</p>
                      ) : null}
                    </div>

                    {formik.values.matKhau.trim() ? (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">Xác nhận mật khẩu</label>
                        <input
                          type="password"
                          {...formik.getFieldProps('xacNhanMatKhau')}
                          placeholder="Nhập lại mật khẩu mới để xác nhận"
                          className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                        />
                        {formik.touched.xacNhanMatKhau && formik.errors.xacNhanMatKhau ? (
                          <p className="mt-2 text-sm text-red-400">{formik.errors.xacNhanMatKhau}</p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-white">Số điện thoại</label>
                      <input
                        type="text"
                        {...formik.getFieldProps('soDt')}
                        className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                      />
                      {formik.touched.soDt && formik.errors.soDt ? (
                        <p className="mt-2 text-sm text-red-400">{formik.errors.soDt}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updateUserMutation.isPending}
                      className="rounded-2xl bg-yellow-400 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updateUserMutation.isPending ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                  </div>
                </form>

                <div className="rounded-[24px] border border-white/10 bg-gray-950/60 p-6">
                  <h3 className="text-xl font-bold text-white">Thông tin hiện tại</h3>
                  <div className="mt-6 space-y-5 text-sm">
                    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/45">Email</span>
                      <span className="font-medium text-white">{profile.email || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/45">Họ tên</span>
                      <span className="font-medium text-white">{profile.hoTen || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/45">Số điện thoại</span>
                      <span className="font-medium text-white">{profile.soDT || 'Chưa cập nhật'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-3">
                      <span className="text-white/45">Tài khoản</span>
                      <span className="font-medium text-white">{profile.taiKhoan}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-white/45">Nhóm / Loại người dùng</span>
                      <span className="font-medium text-white">{profile.maNhom || 'GP00'} / {profile.maLoaiNguoiDung || 'Khách hàng'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Lịch sử đặt vé</h2>
                      <p className="mt-2 text-sm text-white/60">Chọn một vé để xem chi tiết rạp, ghế và thời gian đặt.</p>
                    </div>
                    <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">
                      {ticketCount} vé
                    </span>
                  </div>

                  {ticketCount === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-gray-950/45 px-6 py-12 text-center text-white/55">
                      Bạn chưa có lịch sử đặt vé nào.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {tickets.map((ticket) => {
                        const firstSeat = ticket.danhSachGhe?.[0]
                        const isActive = ticket.maVe === selectedTicket?.maVe
                        return (
                          <button
                            key={ticket.maVe}
                            type="button"
                            onClick={() => setSelectedTicketId(ticket.maVe)}
                            className={`w-full rounded-[24px] border p-4 text-left transition ${
                              isActive
                                ? 'border-yellow-400/45 bg-yellow-400/10'
                                : 'border-white/10 bg-gray-950/50 hover:border-yellow-400/20'
                            }`}
                          >
                            <div className="flex gap-4">
                              <img
                                src={ticket.hinhAnh}
                                alt={ticket.tenPhim}
                                className="h-28 w-20 rounded-2xl object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <h3 className="text-lg font-semibold text-white">{ticket.tenPhim}</h3>
                                    <p className="mt-1 text-sm text-white/55">{firstSeat?.tenHeThongRap || 'Chưa có thông tin rạp'}</p>
                                  </div>
                                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/65">
                                    Mã vé #{ticket.maVe}
                                  </span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
                                  <span>🗓 {formatDateTime(ticket.ngayDat)}</span>
                                  <span>🎟 {formatCurrency(ticket.giaVe)}</span>
                                  <span>⏱ {ticket.thoiLuongPhim || 0} phút</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {(ticket.danhSachGhe || []).map((seat) => (
                                    <span
                                      key={`${ticket.maVe}-${seat.maGhe}`}
                                      className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-xs font-medium text-yellow-300"
                                    >
                                      Ghế {seat.tenGhe}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-[24px] border border-white/10 bg-gray-950/60 p-6">
                  <h3 className="text-2xl font-bold text-white">Chi tiết vé đã đặt</h3>

                  {selectedTicket ? (
                    <div className="mt-6 space-y-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={selectedTicket.hinhAnh}
                          alt={selectedTicket.tenPhim}
                          className="h-36 w-24 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Bộ phim</p>
                          <h4 className="mt-2 text-2xl font-bold text-white">{selectedTicket.tenPhim}</h4>
                          <p className="mt-2 text-sm text-yellow-300">{formatCurrency(selectedTicket.giaVe)}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Ngày đặt</p>
                          <p className="mt-2 text-sm font-medium text-white">{formatDateTime(selectedTicket.ngayDat)}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Mã vé</p>
                          <p className="mt-2 text-sm font-medium text-white">#{selectedTicket.maVe}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Rạp chiếu</p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {selectedTicket.danhSachGhe?.[0]?.tenHeThongRap || 'Chưa có thông tin'}
                          </p>
                          <p className="mt-1 text-sm text-white/60">
                            {selectedTicket.danhSachGhe?.[0]?.tenCumRap || 'Chưa có cụm rạp'} — {selectedTicket.danhSachGhe?.[0]?.tenRap || 'Chưa có rạp'}
                          </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:col-span-2">
                          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Danh sách ghế</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(selectedTicket.danhSachGhe || []).map((seat) => (
                              <span
                                key={`${selectedTicket.maVe}-detail-${seat.maGhe}`}
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
