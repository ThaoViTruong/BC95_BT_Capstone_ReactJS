import { FontAwesomeIcon, faUsers, faEyeSlash } from "../../utils/fontAwesome";
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

const SectionHeading = ({ icon, title, description }) => (
  <div className="mb-5 sm:mb-6">
    <div className="flex items-center gap-2.5">
      <FontAwesomeIcon icon={icon} className="text-sm text-rose-200" />
      <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
    </div>
    {description ? (
      <p className="mt-2 text-sm text-white/45">{description}</p>
    ) : null}
  </div>
);

const ProfileInfoTab = ({ formik, updateUserMutation }) => (
  <div className="space-y-6">
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <section className={cardClassName}>
        <SectionHeading icon={faUsers} title="Thông tin cá nhân" />

        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
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

        <div className="mt-5 flex justify-end border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-sm font-bold text-white transition hover:from-red-500 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3"
          >
            {updateUserMutation.isPending
              ? "Đang lưu thông tin..."
              : "Lưu thông tin"}
          </button>
        </div>
      </section>

      <section className={cardClassName}>
        <SectionHeading
          icon={faEyeSlash}
          title="Đổi mật khẩu"
          description="Chỉ nhập khi bạn muốn thay đổi mật khẩu hiện tại."
        />

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

        {formik.values.matKhau.trim() ? (
          <div className="mt-5 flex justify-end border-t border-white/10 pt-5 sm:mt-6 sm:pt-6">
            <button
              type="submit"
              disabled={updateUserMutation.isPending}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-70 sm:px-6 sm:py-3"
            >
              Cập nhật mật khẩu
            </button>
          </div>
        ) : null}
      </section>
    </form>
  </div>
);

export default ProfileInfoTab;
