import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon, faBars, faClapperboard, faClock, faUsers, faXmark } from '../utils/fontAwesome'
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

    const navLinkClassName = ({isActive}) => {
        return isActive ?
        "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all bg-yellow-400 text-gray-900 sm:gap-4 sm:px-5 sm:py-4 sm:rounded-2xl sm:text-lg"
        : "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all text-white hover:bg-gray-800 sm:gap-4 sm:px-5 sm:py-4 sm:rounded-2xl sm:text-lg"
    }

    const handleLogout = () => {
        queryClient.refetchQueries({ queryKey: ['profile'] })
        dispatch(logout())
    }

    // Đóng menu / sidebar khi đổi route
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsAccountMenuOpen(false)
            setIsSidebarOpen(false)
        }, 0)

        return () => clearTimeout(timeoutId)
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
        <div className="min-h-screen bg-gray-950 font-sans text-white xl:flex">
            {isSidebarOpen ? (
                <button
                    type="button"
                    aria-label="Đóng menu quản trị"
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 xl:hidden"
                />
            ) : null}
            <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-gray-800 bg-gray-900 transition-transform duration-300 sm:w-72 xl:static xl:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="border-b border-gray-800 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex items-center justify-between gap-4">
                        <Link
                            to="/movie"
                            className="inline-block text-2xl font-extrabold uppercase tracking-tight text-white transition-opacity hover:opacity-85 sm:text-3xl"
                        >
                            CINE<span className="text-red-500">FLEX</span>
                        </Link>
                        <button
                            type="button"
                            aria-label="Đóng menu"
                            onClick={() => setIsSidebarOpen(false)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/5 sm:h-11 sm:w-11 sm:rounded-2xl xl:hidden"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                </div>
                <nav className="flex-1 space-y-2 px-3 py-4 sm:px-4 sm:py-5">
                    <p className="mb-3 px-4 text-xs uppercase tracking-widest text-white sm:mb-4 sm:px-5 sm:text-sm">Quản lý</p>
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
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-gray-800 bg-gray-900 px-3 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/5 sm:h-11 sm:w-11 sm:rounded-2xl xl:hidden"
                            aria-label="Mở menu quản trị"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                        <div className="text-base font-semibold text-white sm:text-2xl">Bảng điều khiển</div>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-5">
                        <div className="relative w-full max-w-[220px] sm:max-w-[260px]" ref={accountMenuRef}>
                            <button
                                type="button"
                                onClick={() => setIsAccountMenuOpen((prevState) => !prevState)}
                                className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-2 text-left transition-colors hover:bg-yellow-400/15 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 sm:rounded-2xl sm:px-3"
                            >
                                <div className="min-w-0 flex-1 text-left sm:text-right">
                                    <p className="truncate text-xs font-semibold text-white sm:text-sm">{displayName}</p>
                                    <p className="text-[11px] text-yellow-300 sm:text-xs">Quản trị viên</p>
                                </div>
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-gray-950 sm:h-11 sm:w-11 sm:text-base">
                                    {avatarText}
                                </div>
                            </button>

                            {isAccountMenuOpen ? (
                                <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-[0_18px_48px_rgba(0,0,0,0.42)] sm:w-56 sm:rounded-2xl">
                                    <div className="border-b border-white/10 px-3 py-3 sm:px-4">
                                        <p className="truncate text-xs font-semibold text-white sm:text-sm">{displayName}</p>
                                        <p className="text-[11px] text-yellow-300 sm:text-xs">Quản trị viên</p>
                                    </div>

                                    <div className="p-1.5 sm:p-2">
                                        {accountMenuItems.map((item) => (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className="block rounded-lg px-3 py-2.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                                                onClick={() => setIsAccountMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-7">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout