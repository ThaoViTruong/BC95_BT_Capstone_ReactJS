import React, { useState } from "react";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { authApi } from "../api/authApi";

// ==================== Validation Schema ====================
const registerSchema = Yup.object().shape({
  taiKhoan: Yup.string()
    .trim()
    .required("Tài khoản không được để trống")
    .min(4, "Tài khoản tối thiểu 4 ký tự"),

  hoTen: Yup.string()
    .trim()
    .required("Họ tên không được để trống")
    .min(2, "Họ tên tối thiểu 2 ký tự"),

  email: Yup.string()
    .trim()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),

  soDt: Yup.string()
    .trim()
    .required("Số điện thoại không được để trống")
    .matches(/^(0\d{9}|\+84\d{9})$/, "Số điện thoại không hợp lệ"),

  matKhau: Yup.string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu tối thiểu 6 ký tự"),

  confirmMatKhau: Yup.string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([Yup.ref("matKhau")], "Mật khẩu xác nhận không khớp"),
});

// ==================== Initial Values ====================
const initialValues = {
  taiKhoan: "",
  hoTen: "",
  email: "",
  soDt: "",
  matKhau: "",
  confirmMatKhau: "",
  maNhom: "GP01",
};

// ==================== Styles ====================
const getInputClass = (hasError) =>
  `w-full bg-gray-800 text-white placeholder-gray-500 border rounded-lg px-3 py-2.5 outline-none focus:ring-2 text-sm transition-all ${
    hasError
      ? "border-red-500 focus:ring-red-400"
      : "border-gray-700 focus:ring-yellow-400"
  }`;

const labelClass = "block text-gray-400 text-xs font-medium mb-1.5";

// ==================== Reusable Fields ====================
const ErrorText = ({ children }) => (
  <p className="text-red-500 text-xs mt-1">{children}</p>
);

const TextField = ({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  formik,
}) => {
  const hasError = Boolean(formik.touched[id] && formik.errors[id]);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...formik.getFieldProps(id)}
        className={getInputClass(hasError)}
      />
      {hasError && <ErrorText>{formik.errors[id]}</ErrorText>}
    </div>
  );
};

const PasswordField = ({
  id,
  label,
  placeholder = "••••••••",
  autoComplete = "new-password",
  show,
  onToggle,
  formik,
}) => {
  const hasError = Boolean(formik.touched[id] && formik.errors[id]);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...formik.getFieldProps(id)}
          className={`${getInputClass(hasError)} pr-14`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-yellow-400 transition-colors"
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
      {hasError && <ErrorText>{formik.errors[id]}</ErrorText>}
    </div>
  );
};

// ==================== Main Component ====================
const RegisterPage = () => {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    validateOnMount: true,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");

      try {
        const payload = {
          taiKhoan: values.taiKhoan.trim(),
          hoTen: values.hoTen.trim(),
          email: values.email.trim().toLowerCase(),
          soDt: values.soDt.replace(/\s+/g, ""),
          matKhau: values.matKhau,
          maNhom: values.maNhom,
        };

        await authApi.register(payload);
        navigate("/login", { replace: true });
      } catch (error) {
        const message =
          error?.response?.data?.content ||
          error?.message ||
          "Đăng ký thất bại, vui lòng thử lại";

        setApiError(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCancel = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-3xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            🎬 MovieApp
          </Link>
          <p className="text-gray-400 text-sm mt-2">
            Tạo tài khoản để bắt đầu trải nghiệm
          </p>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 w-full shadow-2xl">
          {/* Header giống modal */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <div>
              <h3 className="text-white text-lg font-bold">Đăng ký tài khoản</h3>
              <p className="text-gray-400 text-sm mt-1">
                Điền thông tin để tạo tài khoản mới
              </p>
            </div>

           
          </div>

          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="px-6 py-5 space-y-4"
          >
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                {apiError}
              </div>
            )}

            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="taiKhoan"
                label="Tài khoản"
                placeholder="Nhập tài khoản"
                autoComplete="username"
                formik={formik}
              />

              <TextField
                id="hoTen"
                label="Họ tên"
                placeholder="Nhập họ tên"
                autoComplete="name"
                formik={formik}
              />
            </div>

            {/* Row 2 */}
            <TextField
              id="email"
              label="Email"
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              formik={formik}
            />

            {/* Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                id="soDt"
                label="Số điện thoại"
                placeholder="0901234567"
                autoComplete="tel"
                formik={formik}
              />

              <PasswordField
                id="matKhau"
                label="Mật khẩu"
                show={showPassword}
                onToggle={() => setShowPassword((prev) => !prev)}
                formik={formik}
              />
            </div>

            {/* Row 4 */}
            <PasswordField
              id="confirmMatKhau"
              label="Xác nhận mật khẩu"
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
              formik={formik}
            />

            {/* Footer actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-sm text-gray-400">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>

              <div className="flex justify-end gap-3">
                

                <button
                  type="submit"
                  disabled={
                    formik.isSubmitting || !formik.isValid || !formik.dirty
                  }
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-700 disabled:cursor-not-allowed text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  {formik.isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-gray-900"
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
                    "Đăng ký"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
