import { Link } from "react-router-dom";
import { PROFILE_TABS, formatDateTime, getRoleLabel } from "../../utils/profile/profileUtils";

const SidebarTabButton = ({ isActive, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
      isActive
        ? "border-red-500/40 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_14px_30px_rgba(220,38,38,0.22)]"
        : "border-white/10 bg-white/[0.03] text-white/85 hover:border-red-400/20 hover:bg-white/[0.06]"
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
  const memberSince =
    profile?.thongTinDatVe?.[profile.thongTinDatVe.length - 1]?.ngayDat ||
    profile?.ngayTao ||
    null;

  return (
    <aside className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,20,22,0.96),rgba(16,18,22,0.98))] p-4 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-5 lg:rounded-[28px] lg:p-6">
      <div className="flex flex-col items-center text-center md:items-center lg:items-center">
        <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-red-500/30 bg-white/[0.03] text-2xl font-bold shadow-[0_0_0_6px_rgba(255,255,255,0.03)]">
          {avatar}
        </div>
          <p className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 rounded-full border border-yellow-400/20 bg-yellow-400 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-950">
            {getRoleLabel(profile.maLoaiNguoiDung)}
          </p>
        </div>
        <div className="mt-5 min-w-0">
          <p className="truncate text-xl font-black uppercase tracking-tight">
            {profile.hoTen || "Người dùng"}
          </p>
          {memberSince ? (
            <p className="mt-2 text-xs text-white/55">
              Thành viên từ {new Date(memberSince).getFullYear()}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center sm:p-4">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/50 sm:text-[10px] sm:tracking-[0.18em]">
            Tổng vé đã đặt
          </p>
          <p className="mt-2 text-3xl font-extrabold text-yellow-300">
            {ticketCount}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-center sm:p-4">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/50 sm:text-[10px] sm:tracking-[0.18em]">
            Thành viên từ
          </p>
          <p className="mt-2 text-3xl font-extrabold text-rose-200">
            {memberSince ? new Date(memberSince).getFullYear() : "----"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left sm:p-4">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/50 sm:text-[10px] sm:tracking-[0.18em]">
            Nhóm người dùng
          </p>
          <p className="mt-2 text-lg font-bold text-white">{profile.maNhom || "GP00"}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left sm:p-4">
          <p className="text-[9px] uppercase tracking-[0.12em] text-white/50 sm:text-[10px] sm:tracking-[0.18em]">
            Giao dịch gần nhất
          </p>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">
            {latestTicket ? latestTicket.tenPhim : "Chưa có lịch sử đặt vé"}
          </p>
          <p className="mt-1 text-xs text-white/75 sm:text-sm">
            {latestTicket ? formatDateTime(latestTicket.ngayDat) : "Chưa có dữ liệu"}
          </p>
        </div>
      </div>

      <div className="mt-5 hidden space-y-3 border-t border-white/10 pt-5 xl:block">
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
