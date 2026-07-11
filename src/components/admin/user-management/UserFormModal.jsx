import { FontAwesomeIcon, faXmark } from "../../../utils/fontAwesome";

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
            {helperText ? (
              <p className="mt-1 text-sm text-white/60">{helperText}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-white/60 transition-colors hover:text-white"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">
                Tài khoản
              </label>
              <input
                type="text"
                {...formik.getFieldProps("taiKhoan")}
                disabled={disableAccountField}
                placeholder="Nhập tài khoản"
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40 disabled:cursor-not-allowed disabled:opacity-60"
              />
              {formik.touched.taiKhoan && formik.errors.taiKhoan ? (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.taiKhoan}
                </p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">
                Mật khẩu
              </label>
              <input
                type="password"
                {...formik.getFieldProps("matKhau")}
                placeholder={passwordPlaceholder}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
              />
              {formik.touched.matKhau && formik.errors.matKhau ? (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.matKhau}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/85">
              Họ tên
            </label>
            <input
              type="text"
              {...formik.getFieldProps("hoTen")}
              placeholder="Nhập họ tên"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
            />
            {formik.touched.hoTen && formik.errors.hoTen ? (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.hoTen}
              </p>
            ) : null}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/85">
              Email
            </label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.email}
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">
                Số điện thoại
              </label>
              <input
                type="text"
                {...formik.getFieldProps("soDT")}
                placeholder="0901234567"
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400 placeholder:text-white/40"
              />
              {formik.touched.soDT && formik.errors.soDT ? (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.soDT}
                </p>
              ) : null}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/85">
                Loại tài khoản
              </label>
              <select
                {...formik.getFieldProps("maLoaiNguoiDung")}
                className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="KhachHang">Khách hàng</option>
                <option value="QuanTri">Quản trị</option>
              </select>
              {formik.touched.maLoaiNguoiDung &&
              formik.errors.maLoaiNguoiDung ? (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.maLoaiNguoiDung}
                </p>
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
              {isSubmitting ? "Đang xử lý..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
