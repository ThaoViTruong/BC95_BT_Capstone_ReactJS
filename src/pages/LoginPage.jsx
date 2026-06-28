import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { authApi } from '../api/authApi'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

const loginSchema = Yup.object().shape({
    taiKhoan: Yup.string().required("Tài khoản không được để trống"),
    matKhau: Yup.string().required("Mật khẩu không được để trống")
})

const LoginPage = () => {
    const [apiError, setApiError] = useState("")

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            taiKhoan: "",
            matKhau: ""
        },
        validationSchema: loginSchema,

        onSubmit: async (values) => {
            setApiError("") 
            try {
                const response = await authApi.login(values)

                dispatch(login(response.data.content))

                navigate("/") 
            } catch (error) {
                console.log(error)
                setApiError(error.response?.data?.content)
            }
        }
    })

    return (
        <div>
            <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <a href="/" className="text-3xl font-bold text-yellow-400">🎬 MovieApp</a>
                        <p className="text-gray-400 mt-2">Đăng nhập để tiếp tục</p>
                    </div>
                    {/* Form Card */}
                    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
                        <h2 className="text-white text-2xl font-bold mb-6">Đăng nhập</h2>
                        <form onSubmit={formik.handleSubmit}>

                            {
                                apiError && (
                                    <div className="bg-red-500 text-white text-sm font-medium px-4 py-3 rounded mb-4">
                                        {apiError}
                                    </div>
                                )
                            }
                            <div className="mb-5">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Tài khoản</label>
                                <input
                                    type="text"
                                    {...formik.getFieldProps("taiKhoan")}
                                    placeholder="Nhập tài khoản"
                                    className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                />

                                {formik.touched.taiKhoan && formik.errors.taiKhoan && (
                                    <p class="text-red-400 text-sm mt-1">{formik.errors.taiKhoan}</p>
                                )}
                                
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Mật khẩu</label>
                                <input
                                    type="password"
                                    {...formik.getFieldProps("matKhau")}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                                />
                                {formik.touched.matKhau && formik.errors.matKhau && (
                                    <p class="text-red-400 text-sm mt-1">{formik.errors.matKhau}</p>
                                )}
                                
                            </div>
                            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                                Đăng nhập
                            </button>
                        </form>
                        <p className="text-center text-gray-400 text-sm mt-6">
                            Chưa có tài khoản?
                            <a href="/" className="text-yellow-400 hover:underline">Khám phá phim ngay</a>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LoginPage
