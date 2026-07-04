import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authApi } from '../api/authApi'
import { login } from '../store/authSlice'
import registerBackground from '../assets/bg-register.jpg'

const MA_NHOM = 'GP01'

const loginSchema = Yup.object({
  taiKhoan: Yup.string().trim().required('Tài khoản không được để trống'),
  matKhau: Yup.string().required('Mật khẩu không được để trống'),
})

const registerSchema = Yup.object({
  taiKhoan: Yup.string().trim().required('Tài khoản không được để trống'),
  hoTen: Yup.string().trim().required('Họ tên không được để trống'),
  matKhau: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu không được để trống'),
  nhapLaiMatKhau: Yup.string()
    .oneOf([Yup.ref('matKhau')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu'),
  email: Yup.string()
    .trim()
    .email('Email không đúng định dạng')
    .required('Email không được để trống'),
  soDt: Yup.string()
    .trim()
    .matches(/^[0-9]{8,15}$/, 'Số điện thoại phải từ 8 đến 15 chữ số')
    .required('Số điện thoại không được để trống'),
})

const inputClassName =
  'w-full border border-white/25 bg-slate-800/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'

const tabClassName =
  'flex-1 border-b-2 px-4 py-4 text-center text-sm font-bold uppercase tracking-wide transition'

const navLinks = [
  { label: 'Phim', to: '/movie' },
  { label: 'Rạp', to: '/cinema' },
  { label: 'Ưu đãi', to: '/' },
]

const footerSections = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Phim đang chiếu', to: '/movie' },
      { label: 'Lịch chiếu', to: '/cinema' },
      { label: 'Ưu đãi', to: '/' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Trung tâm trợ giúp', to: '/' },
      { label: 'Liên hệ', to: '/' },
      { label: 'Câu hỏi thường gặp', to: '/' },
    ],
  },
  {
    title: 'Chính sách',
    links: [
      { label: 'Chính sách bảo mật', to: '/' },
      { label: 'Điều khoản dịch vụ', to: '/' },
    ],
  },
]

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

const AuthTabsPage = ({ activeTab = 'login' }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loginError, setLoginError] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState('')

  const loginFormik = useFormik({
    initialValues: {
      taiKhoan: '',
      matKhau: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoginError('')

      try {
        const response = await authApi.login({
          taiKhoan: values.taiKhoan.trim(),
          matKhau: values.matKhau,
        })

        const loggedInUser = response.data.content

        dispatch(login(loggedInUser))
        navigate(loggedInUser?.maLoaiNguoiDung === 'QuanTri' ? '/admin' : '/', { replace: true })
      } catch (error) {
        setLoginError(getApiMessage(error.response?.data?.content, 'Đăng nhập thất bại. Vui lòng thử lại.'))
      } finally {
        setSubmitting(false)
      }
    },
  })

  const registerFormik = useFormik({
    initialValues: {
      taiKhoan: '',
      hoTen: '',
      matKhau: '',
      nhapLaiMatKhau: '',
      email: '',
      soDt: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setRegisterError('')
      setRegisterSuccess('')

      const payload = {
        taiKhoan: values.taiKhoan.trim(),
        matKhau: values.matKhau,
        email: values.email.trim(),
        soDt: values.soDt.trim(),
        maNhom: MA_NHOM,
        hoTen: values.hoTen.trim(),
      }

      try {
        const response = await authApi.register(payload)
        setRegisterSuccess('Đã đăng kí tài khoản thành công!')
        resetForm()
        setTimeout(() => {
          navigate('/login')
        }, 1200)
      } catch (error) {
        setRegisterError(getApiMessage(error.response?.data?.content, 'Đăng ký thất bại. Vui lòng thử lại.'))
      } finally {
        setSubmitting(false)
      }
    },
  })

  const renderError = (formik, fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName] ? (
      <p className="mt-2 text-sm text-red-400">{formik.errors[fieldName]}</p>
    ) : null

  return (
    <div className="min-h-screen bg-[#080c18] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col border-x border-violet-500/40">
        <header className="border-b border-violet-500/30 bg-[#050816]/95">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/movie" className="text-2xl font-extrabold uppercase tracking-tight text-white">
              CINE<span className="text-red-500">FLEX</span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
              {navLinks.map((item) => (
                <Link key={item.label} to={item.to} className="transition hover:text-yellow-400">
                  {item.label}
                </Link>
              ))}
            </nav>

          </div>
        </header>

        <main className="flex-1">
          <div className="grid h-full grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
            <div
              className="relative hidden lg:flex items-end overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(rgba(6, 10, 24, 0.45), rgba(6, 10, 24, 0.82)), url(${registerBackground})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            >
              <div className="w-full p-12">
                <p className="mb-3 text-sm uppercase tracking-[0.4em] text-yellow-400">CineFlex</p>
                <h1 className="max-w-md text-5xl font-bold uppercase leading-tight">
                  Mở khóa <span className="text-red-500">trải nghiệm</span> điện ảnh
                </h1>
                <p className="mt-5 max-w-md text-base leading-7 text-gray-200">
                  Tham gia ngay để nhận những ưu đãi độc quyền và đặt vé nhanh chóng nhất.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
              <div className="w-full max-w-2xl overflow-hidden border border-white/10 bg-black/70 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                <div className="grid grid-cols-2 bg-[#1a1a1a]">
                  <Link
                    to="/login"
                    className={`${tabClassName} ${
                      activeTab === 'login'
                        ? 'border-yellow-400 bg-[#202938] text-white'
                        : 'border-transparent text-gray-400 hover:bg-[#1f2430] hover:text-white'
                    }`}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    className={`${tabClassName} ${
                      activeTab === 'register'
                        ? 'border-yellow-400 bg-[#202938] text-white'
                        : 'border-transparent text-gray-400 hover:bg-[#1f2430] hover:text-white'
                    }`}
                  >
                    Đăng ký
                  </Link>
                </div>

                <div className="bg-[#181818]/95 p-6 sm:p-8 md:p-10">
                  {activeTab === 'login' ? (
                    <div>
                      <h2 className="text-3xl font-bold text-white">Đăng nhập</h2>
                      <p className="mt-3 text-sm text-gray-400">Đăng nhập để tiếp tục trải nghiệm hệ thống đặt vé.</p>

                      <form onSubmit={loginFormik.handleSubmit} autoComplete="off" className="mt-8 space-y-5">
                        {loginError ? (
                          <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {loginError}
                          </div>
                        ) : null}

                        <div>
                          <label htmlFor="login-taiKhoan" className="mb-2 block text-sm font-medium text-white">
                            Tài khoản <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="login-taiKhoan"
                            type="text"
                            placeholder="Nhập tài khoản"
                            autoComplete="off"
                            className={inputClassName}
                            {...loginFormik.getFieldProps('taiKhoan')}
                          />
                          {renderError(loginFormik, 'taiKhoan')}
                        </div>

                        <div>
                          <label htmlFor="login-matKhau" className="mb-2 block text-sm font-medium text-white">
                            Mật khẩu <span className="text-red-400">*</span>
                          </label>
                          <input
                            id="login-matKhau"
                            type="password"
                            placeholder="Nhập mật khẩu"
                            autoComplete="new-password"
                            className={inputClassName}
                            {...loginFormik.getFieldProps('matKhau')}
                          />
                          {renderError(loginFormik, 'matKhau')}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" className="h-4 w-4 border border-white/20 bg-transparent accent-yellow-400" />
                            <span>Lưu mật khẩu đăng nhập</span>
                          </label>
                          <span className="text-yellow-400">Quên mật khẩu?</span>
                        </div>

                        <button
                          type="submit"
                          disabled={loginFormik.isSubmitting}
                          className="w-full bg-yellow-400 px-6 py-3 text-base font-bold uppercase tracking-wide text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {loginFormik.isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>

                        <p className="text-center text-sm text-gray-400">
                          Chưa có tài khoản?{' '}
                          <Link to="/register" className="font-semibold text-yellow-400 hover:text-yellow-300">
                            Đăng ký ngay
                          </Link>
                        </p>
                      </form>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-3xl font-bold text-white">Đăng ký</h2>
                      <p className="mt-3 text-sm text-gray-400">Tạo tài khoản mới để trở thành một phần của CINEFLEX.</p>

                      <form onSubmit={registerFormik.handleSubmit} autoComplete="off" className="mt-8 space-y-5">
                        {registerError ? (
                          <div className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {registerError}
                          </div>
                        ) : null}

                        {registerSuccess ? (
                          <div className="border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                            {registerSuccess}
                          </div>
                        ) : null}

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                          <div>
                            <label htmlFor="register-taiKhoan" className="mb-2 block text-sm font-medium text-white">
                              Tài khoản <span className="text-red-400">*</span>
                            </label>
                            <input
                              id="register-taiKhoan"
                              type="text"
                              placeholder="Tên đăng nhập"
                              autoComplete="off"
                              className={inputClassName}
                              {...registerFormik.getFieldProps('taiKhoan')}
                            />
                            {renderError(registerFormik, 'taiKhoan')}
                          </div>

                          <div>
                            <label htmlFor="register-hoTen" className="mb-2 block text-sm font-medium text-white">
                              Họ tên <span className="text-red-400">*</span>
                            </label>
                            <input
                              id="register-hoTen"
                              type="text"
                              placeholder="Nguyễn Văn A"
                              autoComplete="off"
                              className={inputClassName}
                              {...registerFormik.getFieldProps('hoTen')}
                            />
                            {renderError(registerFormik, 'hoTen')}
                          </div>

                          <div>
                            <label htmlFor="register-matKhau" className="mb-2 block text-sm font-medium text-white">
                              Mật khẩu <span className="text-red-400">*</span>
                            </label>
                            <input
                              id="register-matKhau"
                              type="password"
                              placeholder="Nhập mật khẩu"
                              autoComplete="new-password"
                              className={inputClassName}
                              {...registerFormik.getFieldProps('matKhau')}
                            />
                            {renderError(registerFormik, 'matKhau')}
                          </div>

                          <div>
                            <label htmlFor="register-nhapLaiMatKhau" className="mb-2 block text-sm font-medium text-white">
                              Nhập lại mật khẩu <span className="text-red-400">*</span>
                            </label>
                            <input
                              id="register-nhapLaiMatKhau"
                              type="password"
                              placeholder="Nhập lại mật khẩu"
                              autoComplete="new-password"
                              className={inputClassName}
                              {...registerFormik.getFieldProps('nhapLaiMatKhau')}
                            />
                            {renderError(registerFormik, 'nhapLaiMatKhau')}
                          </div>

                          <div>
                            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-white">
                              Email <span className="text-red-400">*</span>
                            </label>
                            <input
                              id="register-email"
                              type="email"
                              placeholder="example@gmail.com"
                              autoComplete="off"
                              className={inputClassName}
                              {...registerFormik.getFieldProps('email')}
                            />
                            {renderError(registerFormik, 'email')}
                          </div>

                          <div>
                            <label htmlFor="register-soDt" className="mb-2 block text-sm font-medium text-white">
                              Số điện thoại <span className="text-red-400">*</span>
                            </label>
                            <input
                              id="register-soDt"
                              type="text"
                              placeholder="0901234567"
                              autoComplete="off"
                              className={inputClassName}
                              {...registerFormik.getFieldProps('soDt')}
                            />
                            {renderError(registerFormik, 'soDt')}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={registerFormik.isSubmitting}
                          className="w-full bg-yellow-400 px-6 py-3 text-base font-bold uppercase tracking-wide text-black transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {registerFormik.isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>

                        <p className="text-center text-sm text-gray-400">
                          Đã có tài khoản?{' '}
                          <Link to="/login" className="font-semibold text-yellow-400 hover:text-yellow-300">
                            Đăng nhập ngay
                          </Link>
                        </p>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-violet-500/30 bg-black/90 px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <Link to="/movie" className="text-2xl font-extrabold uppercase tracking-tight text-white">
                CINE<span className="text-red-500">FLEX</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
                Trở về danh sách phim để khám phá các suất chiếu mới nhất và đặt vé nhanh hơn.
              </p>
              <p className="mt-4 text-sm text-gray-500">© 2026 CINEFLEX Giải trí. Bảo lưu mọi quyền.</p>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-bold uppercase tracking-wide text-yellow-400">{section.title}</h3>
                <div className="mt-4 space-y-3">
                  {section.links.map((item) => (
                    <Link key={item.label} to={item.to} className="block text-sm text-gray-300 transition hover:text-white">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AuthTabsPage
