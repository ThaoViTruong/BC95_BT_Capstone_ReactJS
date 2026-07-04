import { useFormik } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { authApi } from "../api/authApi";
import { login } from "../store/authSlice";

const loginSchema = Yup.object().shape({
  taiKhoan: Yup.string()
    .required("Tài khoản không được để trống")
    .min(4, "Tài khoản tối thiểu 4 ký tự"),
  matKhau: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

const LoginPage = () => {
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      try {
        const response = await authApi.login(values);
        dispatch(login(response.data.content));
        navigate("/");
      } catch (error) {
        setApiError(
          error?.response?.data?.content ||
            "Đăng nhập thất bại, vui lòng thử lại"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-yellow-400">
            🎬 MovieApp
          </Link>
          <p className="text-gray-400 mt-2">Đăng nhập để tiếp tục</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-white text-2xl font-bold mb-6">Đăng nhập</h2>

          <form onSubmit={formik.handleSubmit} >
            {apiError && (
              <div className="bg-red-500 text-white text-sm font-medium px-4 py-3 rounded mb-4">
                {apiError}
              </div>
            )}

            {/* Tài khoản */}
            <div className="mb-5">
              <label
                htmlFor="taiKhoan"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Tài khoản
              </label>
              <input
                id="taiKhoan"
                type="text"
                autoComplete="username"
                {...formik.getFieldProps("taiKhoan")}
                placeholder="Nhập tài khoản"
                className={`w-full bg-gray-700 text-white placeholder-gray-400 border rounded-lg px-4 py-3 outline-none focus:ring-2 transition-all ${
                  formik.touched.taiKhoan && formik.errors.taiKhoan
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-600 focus:ring-yellow-400"
                }`}
              />
              {formik.touched.taiKhoan && formik.errors.taiKhoan && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.taiKhoan}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="mb-6">
              <label
                htmlFor="matKhau"
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="matKhau"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...formik.getFieldProps("matKhau")}
                  placeholder="••••••••"
                  className={`w-full bg-gray-700 text-white placeholder-gray-400 border rounded-lg px-4 py-3 pr-12 outline-none focus:ring-2 transition-all ${
                    formik.touched.matKhau && formik.errors.matKhau
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-600 focus:ring-yellow-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-400 text-sm"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formik.touched.matKhau && formik.errors.matKhau && (
                <p className="text-red-400 text-sm mt-1">
                  {formik.errors.matKhau}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-yellow-600 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {formik.isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-gray-900"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;