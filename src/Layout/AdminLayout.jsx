import { useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FontAwesomeIcon, faClapperboard, faClock, faUsers } from '../utils/fontAwesome'
import { logout, selectorIsLoggedIn, selectorUser } from '../store/authSlice'
import { useProfile } from '../hooks/useUser'

const AdminLayout = () => {
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const user = useSelector(selectorUser)
    const isLoggedIn = useSelector(selectorIsLoggedIn)
    const { data: profile } = useProfile(isLoggedIn)
    const displayName = profile?.hoTen || user?.hoTen || user?.taiKhoan || 'Quản trị viên'
    const avatarText = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('') || 'A'

    const navLinkClassName = ({isActive}) => {
        return isActive ?
        "flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all bg-yellow-400 text-gray-900"
        : "flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-semibold transition-all text-white hover:bg-gray-800"
    }

    const handleLogout = () => {
        queryClient.refetchQueries({queryKey: ['profile']})
        dispatch(logout())
    }

    return (
        <div className="min-h-screen bg-gray-950 flex font-sans text-white">
            <aside className="w-72 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="px-7 py-6 border-b border-gray-800">
                    <span className="text-3xl font-extrabold uppercase tracking-tight text-white">CINE<span className="text-red-500">FLEX</span></span>
                </div>
                <nav className="flex-1 px-4 py-5 space-y-2">
                    <p className="text-white text-sm uppercase tracking-widest px-5 mb-4">Quản lý</p>
                    <NavLink to="/admin/users" className={navLinkClassName}>
                        <FontAwesomeIcon icon={faUsers} className="text-xl" />
                        Người dùng
                    </NavLink>
                    <NavLink to="/admin/films" className={navLinkClassName}>
                        <FontAwesomeIcon icon={faClapperboard} className="text-xl" />
                        Phim
                    </NavLink>
                    <NavLink to="/admin/showtimes" className={navLinkClassName}>
                        <FontAwesomeIcon icon={faClock} className="text-xl" />
                        Lịch chiếu
                    </NavLink>
                </nav>
            </aside>
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-gray-900 border-b border-gray-800 px-8 py-5 flex items-center justify-between flex-shrink-0">
                    <div className="text-2xl font-semibold text-white"></div>
                    <div className="flex items-center gap-5">
                        <Link to="/admin/profile" className="text-right transition-opacity hover:opacity-80">
                            <p className="text-white text-lg font-medium">{displayName}</p>
                            <p className="text-white text-sm">Quản trị viên</p>
                        </Link>
                        <Link
                            to="/admin/profile"
                            className="w-11 h-11 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 font-bold text-lg flex-shrink-0 transition-transform hover:scale-105"
                            aria-label="Trang cá nhân"
                        >
                            {avatarText}
                        </Link>
                        <button
                            onClick = {handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white text-lg font-medium px-5 py-3 rounded-xl transition-colors">
                            Đăng xuất
                        </button>
                    </div>
                </header>
                <main className="flex-1 p-7 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>

    )
}

export default AdminLayout

