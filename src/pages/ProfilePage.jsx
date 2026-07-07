import { useMemo, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpinner from '../components/LoadingSpinner'
import { useProfile, useUpdateUser } from '../hooks/useUser'
import { login, selectorIsLoggedIn, selectorUser } from '../store/authSlice'

const PROFILE_TABS = {
  info: 'info',
  tickets: 'tickets',
}

const TICKETS_PER_PAGE = 5

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

const formLabelClassName = 'mb-2 block text-sm font-semibold text-white'
const formInputClassName =
  'w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
const formInputDisabledClassName =
  'w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65 outline-none'
const cardClassName = 'rounded-[28px] border border-white/10 bg-[#10151f]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]'

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

const formatDate = (dateValue) => {
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
  }).format(date)
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

const getRoleLabel = (role) => {
  return role === 'QuanTri' ? 'Quản trị' : 'Khách hàng'
}

const getTicketCinemaInfo = (ticket) => {
  const firstSeat = ticket?.danhSachGhe?.[0]

  return {
    heThongRap: firstSeat?.tenHeThongRap || 'Chưa có thông tin',
    cumRap: firstSeat?.tenCumRap || 'Chưa có cụm rạp',
    rap: firstSeat?.tenRap || 'Chưa có rạp',
  }
}

const getUniqueSeats = (ticket) => {
  const seatMap = new Map()

  ;(ticket?.danhSachGhe || []).forEach((seat) => {
    const seatKey = seat?.maGhe || seat?.tenGhe

    if (!seatKey || seatMap.has(seatKey)) {
      return
    }

    seatMap.set(seatKey, seat)
  })

  return Array.from(seatMap.values())
}

const renderFieldError = (formik, fieldName) => {
  if (!formik.touched[fieldName] || !formik.errors[fieldName]) {
    return null
  }

  return <p className="mt-2 text-sm text-red-400">{formik.errors[fieldName]}</p>
}

const SummaryCard = ({ label, value, className = '' }) => (
  <div className={`rounded-2xl border border-white/10 bg-white/[0.03] p-4 ${className}`}>
    <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
    <div className="mt-2 text-sm font-medium text-white">{value}</div>
  </div>
)

const SidebarTabButton = ({ isActive, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
      isActive
        ? 'border-yellow-400/30 bg-yellow-400/90 text-gray-950 shadow-[0_14px_30px_rgba(250,204,21,0.15)]'
        : 'border-white/10 bg-white/[0.03] text-white/85 hover:border-yellow-400/20 hover:bg-white/[0.06]'
    }`}
  >
    {label}
  </button>
)

const ProfileSidebar = ({ profile, activeTab, setActiveTab, ticketCount, latestTicket }) => {
  const avatar = profile?.hoTen?.[0]?.toUpperCase() || profile?.taiKhoan?.[0]?.toUpperCase() || 'U'

  return (
    <aside className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0f1b34] via-[#10203b] to-[#12284a] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/35 bg-white/[0.03] text-2xl font-bold">
          {avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-bold">{profile.hoTen || 'Người dùng'}</p>
          <p className="mt-2 inline-flex rounded-full border border-yellow-400/15 bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
            {getRoleLabel(profile.maLoaiNguoiDung)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-white/10 bg-[#162845]/85 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">Tổng vé đã đặt</p>
          <p className="mt-2 text-3xl font-extrabold text-yellow-200">{ticketCount}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#162845]/85 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">Nhóm người dùng</p>
          <p className="mt-2 text-lg font-bold">{profile.maNhom || 'GP00'}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#162845]/85 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">Giao dịch gần nhất</p>
        <p className="mt-2 text-sm font-semibold text-white">
          {latestTicket ? latestTicket.tenPhim : 'Chưa có lịch sử đặt vé'}
        </p>
        <p className="mt-1 text-sm text-white/75">
          {latestTicket ? formatDateTime(latestTicket.ngayDat) : 'Chưa có dữ liệu'}
        </p>
      </div>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-6">
        <SidebarTabButton
          isActive={activeTab === PROFILE_TABS.info}
          label="Thông tin khách hàng"
          onClick={() => setActiveTab(PROFILE_TABS.info)}
        />
        <SidebarTabButton
          isActive={activeTab === PROFILE_TABS.tickets}
          label="Lịch sử mua hàng"
          onClick={() => setActiveTab(PROFILE_TABS.tickets)}
        />
      </div>

    </aside>
  )
}

const ProfileInfoTab = ({ formik, actionMessage, updateUserMutation }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white">Thông tin khách hàng</h1>
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

    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <section className={cardClassName}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Thông tin cá nhân</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={formLabelClassName}>Họ và tên</label>
            <input
              type="text"
              {...formik.getFieldProps('hoTen')}
              placeholder="Nhập họ và tên"
              className={formInputClassName}
            />
            {renderFieldError(formik, 'hoTen')}
          </div>

          <div>
            <label className={formLabelClassName}>Tài khoản</label>
            <input type="text" value={formik.values.taiKhoan} disabled className={formInputDisabledClassName} />
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
        </div>

        <div className="mt-6 flex justify-end border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {updateUserMutation.isPending ? 'Đang lưu thông tin...' : 'Lưu thông tin'}
          </button>
        </div>
      </section>

      <section className={cardClassName}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Đổi mật khẩu</h2>
          <p className="mt-1 text-sm text-white/55">Chỉ nhập khi bạn muốn thay đổi mật khẩu hiện tại.</p>
        </div>

        <div className="grid gap-5">
          <div>
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
            <div>
              <label className={formLabelClassName}>Xác nhận mật khẩu</label>
              <input
                type="password"
                {...formik.getFieldProps('xacNhanMatKhau')}
                placeholder="Nhập lại mật khẩu mới"
                className={formInputClassName}
              />
              {renderFieldError(formik, 'xacNhanMatKhau')}
            </div>
          ) : null}
        </div>
      </section>
    </form>
  </div>
)

const TicketDetailModal = ({ selectedTicket, onClose }) => {
  if (!selectedTicket) {
    return null
  }

  const cinemaInfo = getTicketCinemaInfo(selectedTicket)
  const uniqueSeats = getUniqueSeats(selectedTicket)
  const seatLabels = uniqueSeats.map((seat) => `Ghế ${seat.tenGhe}`)
  const roomName = cinemaInfo.rap !== 'Chưa có rạp' ? cinemaInfo.rap : 'Chưa có thông tin'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[28px] border border-white/10 bg-gradient-to-br from-[#071227] via-[#08111f] to-[#050b17] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-white transition hover:border-red-500/50 hover:bg-red-500/15 hover:text-red-300"
          aria-label="Đóng chi tiết vé"
        >
          ×
        </button>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="mx-auto w-full max-w-[220px] lg:mx-0">
            <img
              src={selectedTicket.hinhAnh}
              alt={selectedTicket.tenPhim}
              className="h-[320px] w-full rounded-[28px] object-cover shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300/80">Chi tiết vé</p>
            <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">{selectedTicket.tenPhim}</h3>
            <p className="mt-3 text-3xl font-black text-yellow-300">{formatCurrency(selectedTicket.giaVe)}</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SummaryCard label="Mã đặt vé" value={`#${selectedTicket.maVe}`} className="border-white/10 bg-white/[0.03]" />
              <SummaryCard
                label="Thời gian"
                value={formatDateTime(selectedTicket.ngayDat)}
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Phòng chiếu"
                value={roomName}
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Số vé"
                value={`${uniqueSeats.length} vé`}
                className="border-white/10 bg-white/[0.03]"
              />
              <SummaryCard
                label="Rạp"
                value={
                  <>
                    <p>{cinemaInfo.heThongRap}</p>
                    <p className="mt-1 text-sm text-white/60">{cinemaInfo.cumRap}</p>
                  </>
                }
                className="border-white/10 bg-white/[0.03] md:col-span-2"
              />
              <SummaryCard
                label="Số ghế"
                value={seatLabels.length ? seatLabels.join(', ') : 'Chưa có dữ liệu ghế'}
                className="border-white/10 bg-white/[0.03] md:col-span-2"
              />
            </div>

            <div className="mt-6 border-t border-dashed border-yellow-400/20 pt-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-red-200/70">Tổng tiền</p>
                  <p className="mt-2 text-4xl font-black text-yellow-300">{formatCurrency(selectedTicket.giaVe)}</p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Đóng chi tiết vé
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileTicketsTab = ({
  tickets,
  ticketCount,
  selectedTicket,
  onSelectTicket,
  activePage,
  totalPages,
  onPreviousPage,
  onNextPage,
  onSelectPage,
}) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white">Lịch sử mua hàng</h1>
    </div>

    <div className={cardClassName}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Danh sách đơn đã mua</h2>
        </div>
        <span className="inline-flex rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 text-sm font-semibold text-yellow-300">
          Hiển thị {tickets.length} / {ticketCount} đơn
        </span>
      </div>

      {ticketCount === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 px-6 py-14 text-center text-white/55">
          Bạn chưa có lịch sử mua hàng.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="min-w-full overflow-hidden rounded-2xl">
              <thead>
                <tr className=" text-left text-sm font-bold text-white">
                  <th className="px-5 py-4">Mã vé</th>
                  <th className="px-5 py-4">Phim</th>
                  <th className="px-5 py-4">Rạp</th>
                  <th className="px-5 py-4">Ngày đặt</th>
                  <th className="px-5 py-4">Tổng cộng</th>
                  <th className="px-5 py-4 text-right">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => {
                  const cinemaInfo = getTicketCinemaInfo(ticket)
                  const isActive = selectedTicket?.maVe === ticket.maVe

                  return (
                    <tr
                      key={ticket.maVe}
                      className={`border-t border-white/10 text-sm text-white/85 ${
                        isActive ? 'bg-yellow-400/10' : 'bg-black/15'
                      }`}
                    >
                      <td className="px-5 py-4 font-semibold">#{ticket.maVe}</td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white">{ticket.tenPhim}</div>
                        <div className="mt-1 text-xs text-white/50">{ticket.thoiLuongPhim || 0} phút</div>
                      </td>
                      <td className="px-5 py-4">{cinemaInfo.heThongRap}</td>
                      <td className="px-5 py-4">{formatDate(ticket.ngayDat)}</td>
                      <td className="px-5 py-4 font-semibold text-yellow-300">{formatCurrency(ticket.giaVe)}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectTicket(ticket.maVe)}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            isActive
                              ? 'bg-yellow-400 text-gray-900'
                              : 'border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.12]'
                          }`}
                        >
                          Xem vé
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6 xl:flex-row xl:items-center xl:justify-between">
            <p className="text-sm text-white/70">
              Trang <span className="font-semibold text-white">{activePage}</span> / {totalPages} - tổng cộng {ticketCount} đơn
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onPreviousPage}
                disabled={activePage === 1}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => onSelectPage(page)}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    page === activePage
                      ? 'bg-yellow-400 text-gray-900'
                      : 'border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.1]'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={onNextPage}
                disabled={activePage === totalPages}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)

const ProfilePage = () => {
  const isLoggedIn = useSelector(selectorIsLoggedIn)
  const currentUser = useSelector(selectorUser)
  const dispatch = useDispatch()
  const { data: profile, isLoading, isError } = useProfile(isLoggedIn)
  const updateUserMutation = useUpdateUser()
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.info)
  const [actionMessage, setActionMessage] = useState(null)
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [currentTicketPage, setCurrentTicketPage] = useState(1)

  const tickets = useMemo(() => {
    const ticketList = profile?.thongTinDatVe || []

    return [...ticketList].sort((ticketA, ticketB) => {
      const timeA = new Date(ticketA.ngayDat || 0).getTime()
      const timeB = new Date(ticketB.ngayDat || 0).getTime()

      if (timeA !== timeB) {
        return timeB - timeA
      }

      return Number(ticketB.maVe || 0) - Number(ticketA.maVe || 0)
    })
  }, [profile?.thongTinDatVe])
  const ticketCount = tickets.length
  const latestTicket = tickets[0] || null
  const totalTicketPages = Math.max(1, Math.ceil(ticketCount / TICKETS_PER_PAGE))
  const activeTicketPage = Math.min(currentTicketPage, totalTicketPages)
  const paginatedTickets = useMemo(() => {
    const startIndex = (activeTicketPage - 1) * TICKETS_PER_PAGE
    return tickets.slice(startIndex, startIndex + TICKETS_PER_PAGE)
  }, [activeTicketPage, tickets])
  const selectedTicket = useMemo(() => {
    return tickets.find((ticket) => ticket.maVe === selectedTicketId) || null
  }, [selectedTicketId, tickets])

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

        dispatch(
          login({
            ...(currentUser || {}),
            ...payload,
            soDT: payload.soDt,
          })
        )

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
      <div className="min-h-screen bg-[#050d26] px-4 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-[#10151f]/95 px-6 py-12 text-center">
          <h1 className="text-3xl font-bold">Không thể tải thông tin cá nhân</h1>
          <p className="mt-4 text-white/60">Vui lòng thử lại sau hoặc đăng nhập lại để tiếp tục.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_bottom,_rgba(99,70,178,0.45),_transparent_35%),linear-gradient(135deg,#041230_0%,#06153a_55%,#07132b_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
          <ProfileSidebar
            profile={profile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            ticketCount={ticketCount}
            latestTicket={latestTicket}
          />

          <section className="min-w-0">
            {activeTab === PROFILE_TABS.info ? (
              <ProfileInfoTab
                formik={formik}
                actionMessage={actionMessage}
                updateUserMutation={updateUserMutation}
              />
            ) : (
              <ProfileTicketsTab
                tickets={paginatedTickets}
                ticketCount={ticketCount}
                selectedTicket={selectedTicket}
                onSelectTicket={setSelectedTicketId}
                activePage={activeTicketPage}
                totalPages={totalTicketPages}
                onPreviousPage={() => setCurrentTicketPage((prev) => Math.max(prev - 1, 1))}
                onNextPage={() => setCurrentTicketPage((prev) => Math.min(prev + 1, totalTicketPages))}
                onSelectPage={setCurrentTicketPage}
              />
            )}
          </section>
        </div>
      </div>

      <TicketDetailModal selectedTicket={selectedTicket} onClose={() => setSelectedTicketId(null)} />
    </div>
  )
}

export default ProfilePage
