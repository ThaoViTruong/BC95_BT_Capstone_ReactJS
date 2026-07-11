import { Link } from "react-router-dom";
import { PROFILE_TABS, formatDateTime, getRoleLabel } from "../../utils/profile/profileUtils";

const SidebarTabButton = ({ isActive, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
      isActive
        ? "border-yellow-400/30 bg-yellow-400/90 text-gray-950 shadow-[0_14px_30px_rgba(250,204,21,0.15)]"
        : "border-white/10 bg-white/[0.03] text-white/85 hover:border-yellow-400/20 hover:bg-white/[0.06]"
    }`}
  >
    {label}
  </button>
);

const ProfileSidebar = ({
  profile,
  activeTab,
  setActiveTab,
  ticketCount,
  latestTicket,
}) => {
  const avatar =
    profile?.hoTen?.[0]?.toUpperCase() ||
    profile?.taiKhoan?.[0]?.toUpperCase() ||
    "U";
  const isCustomerRole = profile?.maLoaiNguoiDung !== "QuanTri";

  return (
    <aside className="rounded-[28px] border border-white/10 bg-gradient-to-b from-[#0f1b34] via-[#10203b] to-[#12284a] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/35 bg-white/[0.03] text-2xl font-bold">
          {avatar}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl font-bold">
            {profile.hoTen || "Người dùng"}
          </p>
          <p className="mt-2 inline-flex rounded-full border border-yellow-400/15 bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">
            {getRoleLabel(profile.maLoaiNguoiDung)}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-white/10 bg-[#162845]/85 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">
            Tổng vé đã đặt
          </p>
          <p className="mt-2 text-3xl font-extrabold text-yellow-200">
            {ticketCount}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#162845]/85 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-white/70">
            Nhóm người dùng
          </p>
          <p className="mt-2 text-lg font-bold">{profile.maNhom || "GP00"}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#162845]/85 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">
          Giao dịch gần nhất
        </p>
        <p className="mt-2 text-sm font-semibold text-white">
          {latestTicket ? latestTicket.tenPhim : "Chưa có lịch sử đặt vé"}
        </p>
        <p className="mt-1 text-sm text-white/75">
          {latestTicket ? formatDateTime(latestTicket.ngayDat) : "Chưa có dữ liệu"}
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
        {isCustomerRole ? (
          <Link
            to="/"
            className="block w-full rounded-2xl border border-red-400/35 bg-gradient-to-r from-red-600 to-rose-600 px-4 py-4 text-left text-sm font-semibold text-white shadow-[0_14px_30px_rgba(220,38,38,0.28)] transition hover:-translate-y-0.5 hover:from-red-500 hover:to-rose-500 hover:shadow-[0_18px_36px_rgba(220,38,38,0.38)] focus:outline-none focus:ring-2 focus:ring-red-300/50"
          >
            Về trang chủ
          </Link>
        ) : null}
      </div>
    </aside>
  );
};

export default ProfileSidebar;
