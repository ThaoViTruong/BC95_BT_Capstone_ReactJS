import UserRoleBadge from "./UserRoleBadge";

const UserTable = ({ users, onStartEdit, onRequestDelete }) => (
  <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
    <div className="overflow-x-auto">
      <table className="min-w-[1080px] w-full text-base">
        <thead>
          <tr className="border-b border-white/10 bg-gray-800/50">
            <th className="sticky left-0 z-20 w-14 whitespace-nowrap border-r border-white/10 bg-gray-800 px-4 py-4 text-left font-medium text-white/85">
              #
            </th>
            <th className="sticky left-14 z-20 min-w-[160px] whitespace-nowrap border-r border-white/10 bg-gray-800 px-4 py-4 text-left font-medium text-white/85 shadow-[8px_0_16px_rgba(0,0,0,0.2)]">
              Tài khoản
            </th>
            <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-white/85">
              Họ tên
            </th>
            <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-white/85">
              Email
            </th>
            <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-white/85">
              Số điện thoại
            </th>
            <th className="whitespace-nowrap px-4 py-4 text-left font-medium text-white/85">
              Loại tài khoản
            </th>
            <th className="sticky right-0 z-10 whitespace-nowrap border-l border-white/10 bg-gray-800 px-4 py-4 text-left font-medium text-white/85 shadow-[-8px_0_16px_rgba(0,0,0,0.2)]">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user, index) => (
            <tr
              key={user.taiKhoan}
              className="group transition-colors hover:bg-gray-800/50"
            >
              <td className="sticky left-0 z-10 w-14 border-r border-white/10 bg-gray-900 px-4 py-4 text-white/70 transition-colors group-hover:bg-gray-800/95">
                {index + 1}
              </td>
              <td className="sticky left-14 z-10 min-w-[160px] border-r border-white/10 bg-gray-900 px-4 py-4 shadow-[8px_0_16px_rgba(0,0,0,0.2)] transition-colors group-hover:bg-gray-800/95">
                <span className="font-medium text-white">{user.taiKhoan}</span>
              </td>
              <td className="px-4 py-4 text-white">{user.hoTen}</td>
              <td className="px-4 py-4 text-white/85">{user.email}</td>
              <td className="px-4 py-4 text-white/85">{user.soDT}</td>
              <td className="px-4 py-4">
                <UserRoleBadge role={user.maLoaiNguoiDung} />
              </td>
              <td className="sticky right-0 border-l border-white/10 bg-gray-900 px-4 py-4 shadow-[-8px_0_16px_rgba(0,0,0,0.2)] transition-colors group-hover:bg-gray-800/95">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onStartEdit(user)}
                    aria-label={`Sửa người dùng ${user.taiKhoan}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300 transition hover:bg-amber-400/20"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M4 20h4l10-10-4-4L4 16v4z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13 7l4 4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestDelete(user)}
                    aria-label={`Xóa người dùng ${user.taiKhoan}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 7h16" strokeLinecap="round" />
                      <path d="M10 11v6" strokeLinecap="round" />
                      <path d="M14 11v6" strokeLinecap="round" />
                      <path
                        d="M6 7l1 12h10l1-12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 7V4h6v3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default UserTable;
