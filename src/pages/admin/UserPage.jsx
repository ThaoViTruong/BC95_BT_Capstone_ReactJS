import React, { useEffect, useState } from 'react'
import { useAddUser, useDeleteUser, useUpdateUser, useUsers } from '../../hooks/useUser'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import LoadingSpinner from '../../components/LoadingSpinner'

const MA_NHOM = 'GP01'
const PAGE_SIZE = 10

const emptyUserForm = {
  taiKhoan: '',
  matKhau: '',
  email: '',
  soDT: '',
  hoTen: '',
  maLoaiNguoiDung: 'KhachHang',
  maNhom: MA_NHOM,
}

const userFormSchema = Yup.object().shape({
  taiKhoan: Yup.string().required("Tài khoản không được để trống"),
  matKhau: Yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").required("Mật khẩu không được để trống"),
  email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
  soDT: Yup.string().required("Số điện thoại không được để trống"),
  hoTen: Yup.string().required("Họ tên không được để trống"),
  maLoaiNguoiDung: Yup.string().required("Loại người dùng không được để trống"),
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
  }

  return fallbackMessage
}

const buildPaginationItems = (currentPage, totalPages) => {
  if (totalPages <= 1) {
    return [1]
  }

  const pageSet = new Set([1, currentPage - 1, currentPage, currentPage + 1, totalPages])
  const normalizedPages = Array.from(pageSet)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((pageA, pageB) => pageA - pageB)

  const paginationItems = []

  normalizedPages.forEach((page, index) => {
    const previousPage = normalizedPages[index - 1]

    if (index > 0 && page - previousPage > 1) {
      paginationItems.push('ellipsis')
    }

    paginationItems.push(page)
  })

  return paginationItems
}

const UserFormModal = ({
  title,
  submitLabel,
  formik,
  isSubmitting,
  onClose,
  disableAccountField = false,
  passwordPlaceholder,
  helperText,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {helperText ? <p className="mt-1 text-sm text-white/60">{helperText}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-white/60 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">Tài khoản</label>
              <input
                type="text"
                {...formik.getFieldProps('taiKhoan')}
                disabled={disableAccountField}
                placeholder="Nhập tài khoản"
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {formik.touched.taiKhoan && formik.errors.taiKhoan ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.taiKhoan}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">Mật khẩu</label>
              <input
                type="password"
                {...formik.getFieldProps('matKhau')}
                placeholder={passwordPlaceholder}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
              />
              {formik.touched.matKhau && formik.errors.matKhau ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.matKhau}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/85">Họ tên</label>
            <input
              type="text"
              {...formik.getFieldProps('hoTen')}
              placeholder="Nhập họ tên"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
            />
            {formik.touched.hoTen && formik.errors.hoTen ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.hoTen}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/85">Email</label>
            <input
              type="email"
              {...formik.getFieldProps('email')}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">Số điện thoại</label>
              <input
                type="text"
                {...formik.getFieldProps('soDT')}
                placeholder="0901234567"
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
              />
              {formik.touched.soDT && formik.errors.soDT ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.soDT}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">Loại tài khoản</label>
              <select
                {...formik.getFieldProps('maLoaiNguoiDung')}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="KhachHang">Khách hàng</option>
                <option value="QuanTri">Quản trị</option>
              </select>
              {formik.touched.maLoaiNguoiDung && formik.errors.maLoaiNguoiDung ? (
                <p className="mt-1 text-xs text-red-500">{formik.errors.maLoaiNguoiDung}</p>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/20 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:bg-yellow-700"
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gray-900 shadow-2xl">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-yellow-400">Xác nhận</p>
          <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/70">{description}</p>
        </div>
        <div className="flex justify-end gap-3 px-6 py-5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white/85 transition-colors hover:border-white/20 hover:text-white"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
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
      ? 'border-emerald-500/30 bg-emerald-500/10'
      : 'border-red-500/30 bg-red-500/10'

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 px-4">
      <div className={`w-full max-w-md rounded-2xl border px-6 py-5 shadow-2xl ${accentClassName}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          {result.type === 'success' ? 'Hoàn tất' : 'Thất bại'}
        </p>
        <h3 className="mt-2 text-xl font-bold text-white">{result.title}</h3>
        <p className="mt-3 text-sm leading-7 text-white/85">{result.message}</p>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:text-white"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

const UserPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [appliedKeyword, setAppliedKeyword] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [pendingEditPayload, setPendingEditPayload] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const [resultPopup, setResultPopup] = useState(null)

  const { data, isLoading } = useUsers(currentPage, PAGE_SIZE, appliedKeyword)

  const users = data?.items || []
  const totalPages = data?.totalPages ?? currentPage
  const totalCount = data?.totalCount || 0
  const paginationItems = buildPaginationItems(currentPage, totalPages)

  const addUser = useAddUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  useEffect(() => {
    if (!isLoading && currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, isLoading, totalPages])

  const addFormik = useFormik({
    initialValues: emptyUserForm,
    validationSchema: userFormSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addUser.mutateAsync({
          ...values,
          soDt: values.soDT,
        })
        resetForm()
        setIsAddModalOpen(false)
        setResultPopup({
          type: 'success',
          title: 'Thêm người dùng thành công',
          message: 'Người dùng mới đã được thêm vào hệ thống.',
        })
      } catch (error) {
        setResultPopup({
          type: 'error',
          title: 'Thêm người dùng thất bại',
          message: getApiMessage(error.response?.data?.content, 'Không thể thêm người dùng. Vui lòng thử lại.'),
        })
      }
    },
  })

  const editFormik = useFormik({
    enableReinitialize: true,
    initialValues: editingUser
      ? {
          taiKhoan: editingUser.taiKhoan || '',
          matKhau: '',
          email: editingUser.email || '',
          soDT: editingUser.soDT || '',
          hoTen: editingUser.hoTen || '',
          maLoaiNguoiDung: editingUser.maLoaiNguoiDung || 'KhachHang',
          maNhom: editingUser.maNhom || MA_NHOM,
        }
      : emptyUserForm,
    validationSchema: userFormSchema,
    onSubmit: (values) => {
      setPendingEditPayload({
        ...values,
        soDt: values.soDT,
      })
    },
  })

  const handleCloseAddModal = () => {
    addFormik.resetForm()
    setIsAddModalOpen(false)
  }

  const handleCloseEditModal = () => {
    setEditingUser(null)
    setPendingEditPayload(null)
    editFormik.resetForm()
  }

  const handleSearchUsers = (event) => {
    event.preventDefault()
    setCurrentPage(1)
    setAppliedKeyword(searchKeyword.trim())
  }

  const handleSearchKeywordChange = (event) => {
    const nextKeyword = event.target.value
    setSearchKeyword(nextKeyword)

    if (!nextKeyword.trim()) {
      setCurrentPage(1)
      setAppliedKeyword('')
    }
  }

  const handleStartEdit = (user) => {
    setPendingEditPayload(null)
    setEditingUser(user)
  }

  const handleRequestDelete = (user) => {
    setUserToDelete(user)
  }

  const handleConfirmEdit = async () => {
    if (!pendingEditPayload) {
      return
    }

    try {
      await updateUser.mutateAsync(pendingEditPayload)
      handleCloseEditModal()
      setResultPopup({
        type: 'success',
        title: 'Cập nhật người dùng thành công',
        message: 'Thông tin người dùng đã được cập nhật trên hệ thống.',
      })
    } catch (error) {
      setPendingEditPayload(null)
      setResultPopup({
        type: 'error',
        title: 'Cập nhật người dùng thất bại',
        message: getApiMessage(error.response?.data?.content, 'Không thể cập nhật người dùng. Vui lòng thử lại.'),
      })
    }
  }

  const handleConfirmDelete = async () => {
    if (!userToDelete) {
      return
    }

    try {
      await deleteUser.mutateAsync(userToDelete.taiKhoan)
      setUserToDelete(null)
      setResultPopup({
        type: 'success',
        title: 'Xóa người dùng thành công',
        message: 'Người dùng đã được xóa khỏi danh sách quản trị.',
      })
    } catch (error) {
      setUserToDelete(null)
      setResultPopup({
        type: 'error',
        title: 'Xóa người dùng thất bại',
        message: getApiMessage(error.response?.data?.content, 'Không thể xóa người dùng. Vui lòng thử lại.'),
      })
    }
  }

  return (
    <div className="font-sans text-white">
      {
        isLoading && (
          <div className='fixed inset-0 flex items-center justify-center bg-gray-950/70 z-50'>
            <LoadingSpinner />
          </div>
        )
      }

      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Danh sách người dùng</h2>
          <p className="mt-2 text-base text-white/80">
            Trang <span className="text-yellow-400 font-medium">{currentPage}</span> / {totalPages} — Tổng <span className="text-yellow-400 font-medium">{totalCount}</span> người dùng
          </p>
          {appliedKeyword ? (
            <p className="mt-2 text-sm text-white/70">
              Kết quả tìm kiếm cho: <span className="font-medium text-yellow-400">{appliedKeyword}</span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <form onSubmit={handleSearchUsers} className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchKeywordChange}
              placeholder="Tìm theo tên, tài khoản, email..."
              className="w-full rounded-2xl border border-white/10 bg-gray-800 px-4 py-3 pr-12 text-base text-white outline-none transition-all placeholder:text-white/40 focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Tìm kiếm người dùng"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6" />
                <path d="M20 20l-4.2-4.2" strokeLinecap="round" />
              </svg>
            </button>
          </form>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl bg-yellow-400 px-5 py-3 text-base font-semibold text-gray-900 transition-colors hover:bg-yellow-500">
            Thêm người dùng
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-white/10 bg-gray-800/50">
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">#</th>
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">Tài khoản</th>
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">Họ tên</th>
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">Email</th>
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">Số điện thoại</th>
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">Loại tài khoản</th>
                <th className="whitespace-nowrap px-5 py-4 text-left font-medium text-white/85">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {
                users.map((user, index) => (
                  <tr key={user.taiKhoan} className="group transition-colors hover:bg-gray-800/50">
                    <td className="px-5 py-4 text-white/70">{index + 1}</td>
                    <td className="px-5 py-4">
                      <span className="text-white font-medium">{user.taiKhoan}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold text-xs flex-shrink-0">
                          {user.hoTen?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white">{user.hoTen}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-white/85">{user.email}</td>
                    <td className="px-5 py-4 text-white/85">{user.soDT}</td>
                    <td className="px-5 py-4">
                      {
                        user.maLoaiNguoiDung === "KhachHang" ? (
                          <span className="rounded-full border border-white/10 bg-gray-800/50 px-2.5 py-1 text-xs font-medium text-white/85">
                            Khách hàng
                          </span>
                        ) : (
                          <span className="bg-yellow-400/15 text-yellow-400 border border-yellow-400/30 text-xs font-medium px-2.5 py-1 rounded-full">
                            Quản trị
                          </span>
                        )
                      }
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(user)}
                          aria-label={`Sửa người dùng ${user.taiKhoan}`}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition hover:bg-amber-400/20"
                        >
                          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 20h4l10-10-4-4L4 16v4z" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 7l4 4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(user)}
                          aria-label={`Xóa người dùng ${user.taiKhoan}`}
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
                      </div>
                    </td>
                  </tr>
                ))
              }


            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-6">

        <button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Trước
        </button>

        {paginationItems.map((item, index) =>
          item === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-sm font-medium text-white/55"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => setCurrentPage(item)}
              className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition-colors ${
                item === currentPage
                  ? 'bg-yellow-400 text-gray-900'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Sau →
        </button>
      </div>

      {
        isAddModalOpen && (
          <UserFormModal
            title="Thêm người dùng mới"
            submitLabel="Thêm người dùng"
            formik={addFormik}
            isSubmitting={addUser.isPending}
            onClose={handleCloseAddModal}
            passwordPlaceholder="••••••••"
          />
        )
      }

      {
        editingUser && (
          <UserFormModal
            title={`Cập nhật người dùng: ${editingUser.taiKhoan}`}
            submitLabel="Lưu thay đổi"
            formik={editFormik}
            isSubmitting={updateUser.isPending}
            onClose={handleCloseEditModal}
            disableAccountField
            passwordPlaceholder="Nhập mật khẩu mới hoặc hiện tại"
            helperText="Vui lòng nhập mật khẩu để xác nhận cập nhật thông tin người dùng."
          />
        )
      }

      <ConfirmActionModal
        isOpen={Boolean(pendingEditPayload)}
        title="Xác nhận cập nhật người dùng"
        description={
          pendingEditPayload
            ? `Bạn có chắc chắn muốn cập nhật thông tin của tài khoản "${pendingEditPayload.taiKhoan}" không?`
            : ''
        }
        confirmLabel="Xác nhận cập nhật"
        isSubmitting={updateUser.isPending}
        onCancel={() => setPendingEditPayload(null)}
        onConfirm={handleConfirmEdit}
      />

      <ConfirmActionModal
        isOpen={Boolean(userToDelete)}
        title="Xác nhận xóa người dùng"
        description={
          userToDelete
            ? `Bạn có chắc chắn muốn xóa tài khoản "${userToDelete.taiKhoan}" khỏi hệ thống không?`
            : ''
        }
        confirmLabel="Xóa người dùng"
        isSubmitting={deleteUser.isPending}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <ResultPopup result={resultPopup} onClose={() => setResultPopup(null)} />

    </div>
  )
}

export default UserPage
