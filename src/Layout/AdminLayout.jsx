import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
    FontAwesomeIcon,
    faClapperboard,
    faClock,
    faUsers,
    faBars,
    faXmark,
} from '../utils/fontAwesome'
import { logout, selectorIsLoggedIn, selectorUser } from '../store/authSlice'
import { useProfile } from '../hooks/useUser'

const AdminLayout = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const user = useSelector(selectorUser)
    const isLoggedIn = useSelector(selectorIsLoggedIn)
    const { data: profile } = useProfile(isLoggedIn)
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const accountMenuRef = useRef(null)

    const displayName =
        profile?.hoTen || user?.hoTen || user?.taiKhoan || 'Quản trị viên'
    const avatarText =
        displayName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join('') || 'A'

    const navLinkClassName = ({ isActive }) => {
        return isActive
            ? 'flex items-center gap-4 px-5 py-3 lg:py-4 rounded-2xl text-base lg:text-lg font-semibold transition-all bg-yellow-400 text-gray-900'
            : 'flex items-center gap-4 px-5 py-3 lg:py-4 rounded-2xl text-base lg:text-lg font-semibold transition-all text-white hover:bg-gray-800'
    }

    const handleLogout = () => {
        queryClient.refetchQueries({ queryKey: ['profile'] })
        dispatch(logout())
    }

    // Đóng menu / sidebar khi đổi route
    useEffect(() => {
        setIsAccountMenuOpen(false)
        setIsSidebarOpen(false)
    }, [location.pathname])

    // Khóa scroll khi sidebar mobile mở
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isSidebarOpen])

    useEffect(() => {
        if (!isAccountMenuOpen) return undefined

        const handleClickOutside = (event) => {
            if (!accountMenuRef.current?.contains(event.target)) {
                setIsAccountMenuOpen(false)
            }
        }

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsAccountMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscape)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isAccountMenuOpen])

    const accountMenuItems = useMemo(() => {
        if (location.pathname === '/admin/profile') {
            return [
                { label: 'Trang Đặt vé', to: '/movie' },
                { label: 'Trang Quản trị', to: '/admin/films' },
            ]
        }
        return [
            { label: 'Trang Đặt vé', to: '/movie' },
            { label: 'Hồ sơ', to: '/admin/profile' },
        ]
    }, [location.pathname])

    return (
        <div className="min-h-screen bg-gray-950 flex font-sans text-white relative">
            {/* Overlay khi mở sidebar trên mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed lg:static top-0 left-0 h-full z-50
                    w-72 flex-shrink-0 bg-gray-900 border-r border-gray-800
                    flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0
                `}
            >
                <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
                    <Link
                        to="/movie"
                        className="inline-block text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-white transition-opacity hover:opacity-85"
                    >
                        CINE<span className="text-red-500">FLEX</span>
                    </Link>
                    {/* Nút đóng sidebar trên mobile */}
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-white text-xl p-2 hover:bg-gray-800 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-5 space-y-2 overflow-y-auto">
                    <p className="text-white text-xs lg:text-sm uppercase tracking-widest px-5 mb-4">
                        Quản lý
                    </p>
                    <NavLink to="/admin/users" className={navLinkClassName}>
                        <FontAwesomeIcon icon={faUsers} className="text-lg lg:text-xl" />
                        Người dùng
                    </NavLink>
                    <NavLink to="/admin/films" className={navLinkClassName}>
                        <FontAwesomeIcon icon={faClapperboard} className="text-lg lg:text-xl" />
                        Phim
                    </NavLink>
                    <NavLink to="/admin/showtimes" className={navLinkClassName}>
                        <FontAwesomeIcon icon={faClock} className="text-lg lg:text-xl" />
                        Lịch chiếu
                    </NavLink>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0 w-full">
                {/* HEADER */}
                <header className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-3 lg:py-5 flex items-center justify-between flex-shrink-0 gap-3">
                    {/* Nút hamburger + logo mobile */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-white text-xl p-2 hover:bg-gray-800 rounded-lg"
                            aria-label="Mở menu"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <Link
                            to="/movie"
                            className="lg:hidden text-lg sm:text-xl font-extrabold uppercase tracking-tight text-white"
                        >
                            CINE<span className="text-red-500">FLEX</span>
                        </Link>
                    </div>

                    {/* Account menu */}
                    <div className="flex items-center gap-3 lg:gap-5">
                        <div className="relative" ref={accountMenuRef}>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsAccountMenuOpen((prevState) => !prevState)
                                }
                                className="flex items-center gap-2 sm:gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-2 sm:px-3 py-2 text-left transition-colors hover:bg-yellow-400/15 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                            >
                                {/* Tên - ẩn trên mobile nhỏ */}
                                <div className="hidden sm:block min-w-0 text-right max-w-[140px]">
                                    <p className="truncate text-sm font-semibold text-white">
                                        {displayName}
                                    </p>
                                    <p className="text-xs text-yellow-300">
                                        Quản trị viên
                                    </p>
                                </div>
                                <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-yellow-400 text-sm sm:text-base font-bold text-gray-950">
                                    {avatarText}
                                </div>
                            </button>

                            {isAccountMenuOpen ? (
                                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-[0_18px_48px_rgba(0,0,0,0.42)]">
                                    <div className="border-b border-white/10 px-4 py-3">
                                        <p className="truncate text-sm font-semibold text-white">
                                            {displayName}
                                        </p>
                                        <p className="text-xs text-yellow-300">
                                            Quản trị viên
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        {accountMenuItems.map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className="block rounded-xl px-4 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                                                onClick={() =>
                                                    setIsAccountMenuOpen(false)
                                                }
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="mt-1 block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </header>

                {/* MAIN */}
                <main className="flex-1 p-4 sm:p-6 lg:p-7 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout