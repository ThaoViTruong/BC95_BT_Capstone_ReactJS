const UserRoleBadge = ({ role }) => {
  if (role === "KhachHang") {
    return (
      <span className="rounded-full border border-white/10 bg-gray-800/50 px-2.5 py-1 text-xs font-medium text-white/85">
        Khách hàng
      </span>
    );
  }

  return (
    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/15 px-2.5 py-1 text-xs font-medium text-yellow-400">
      Quản trị
    </span>
  );
};

export default UserRoleBadge;
