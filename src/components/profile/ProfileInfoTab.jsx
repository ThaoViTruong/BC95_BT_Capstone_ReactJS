import {
  cardClassName,
  formInputClassName,
  formInputDisabledClassName,
  formLabelClassName,
} from "../../utils/profile/profileUtils";

const renderFieldError = (formik, fieldName) => {
  if (!formik.touched[fieldName] || !formik.errors[fieldName]) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-400">{formik.errors[fieldName]}</p>;
};

const ProfileInfoTab = ({ formik, updateUserMutation }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white">
        Thông tin khách hàng
      </h1>
    </div>

    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <section className={cardClassName}>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Thông tin cá nhân
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={formLabelClassName}>Họ và tên</label>
            <input
              type="text"
              {...formik.getFieldProps("hoTen")}
              placeholder="Nhập họ và tên"
              className={formInputClassName}
            />
            {renderFieldError(formik, "hoTen")}
          </div>

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
            <label className={formLabelClassName}>Số điện thoại</label>
            <input
              type="text"
              {...formik.getFieldProps("soDt")}
              placeholder="Nhập số điện thoại"
              className={formInputClassName}
            />
            {renderFieldError(formik, "soDt")}
          </div>

          <div>
            <label className={formLabelClassName}>Email</label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              placeholder="Nhập email"
              className={formInputClassName}
            />
            {renderFieldError(formik, "email")}
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-white/10 pt-6">
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {updateUserMutation.isPending
              ? "Đang lưu thông tin..."
              : "Lưu thông tin"}
          </button>
        </div>
      </section>

      <section className={cardClassName}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Đổi mật khẩu</h2>
          <p className="mt-1 text-sm text-white/55">
            Chỉ nhập khi bạn muốn thay đổi mật khẩu hiện tại.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label className={formLabelClassName}>Mật khẩu mới</label>
            <input
              type="password"
              {...formik.getFieldProps("matKhau")}
              placeholder="Để trống nếu không muốn thay đổi"
              className={formInputClassName}
            />
            {renderFieldError(formik, "matKhau")}
          </div>

          {formik.values.matKhau.trim() ? (
            <div>
              <label className={formLabelClassName}>Xác nhận mật khẩu</label>
              <input
                type="password"
                {...formik.getFieldProps("xacNhanMatKhau")}
                placeholder="Nhập lại mật khẩu mới"
                className={formInputClassName}
              />
              {renderFieldError(formik, "xacNhanMatKhau")}
            </div>
          ) : null}
        </div>
      </section>
    </form>
  </div>
);

export default ProfileInfoTab;
