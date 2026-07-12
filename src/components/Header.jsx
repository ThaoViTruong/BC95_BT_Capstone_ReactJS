import { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { logout, selectorIsLoggedIn, selectorUser } from '../store/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '../hooks/useUser';

const Header = () => {
    const location = useLocation();
    const isLoggedIn = useSelector(selectorIsLoggedIn);
    const user = useSelector(selectorUser);
    const { data: profile } = useProfile(isLoggedIn);
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const adminMenuRef = useRef(null);

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const handleLogout = useCallback(() => {
        queryClient.removeQueries({ queryKey: ['profile'] });
        dispatch(logout());
    }, [dispatch, queryClient]);

    const displayName =
        profile?.hoTen || user?.hoTen || user?.taiKhoan || 'Người dùng';

    const isAdminRole = (profile?.maLoaiNguoiDung || user?.maLoaiNguoiDung) === 'QuanTri';
    const isProfileRoute = location.pathname === '/profile' || location.pathname === '/admin/profile';
    const avatarText =
        displayName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join('') || 'A';

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIsAdminMenuOpen(false);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [location.pathname]);

    useEffect(() => {
        if (!isAdminMenuOpen) {
            return undefined;
        }

        const handleClickOutside = (event) => {
            if (!adminMenuRef.current?.contains(event.target)) {
                setIsAdminMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsAdminMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isAdminMenuOpen]);

    const adminMenuItems = useMemo(() => {
        if (isProfileRoute) {
            return [
                { label: 'Trang Đặt vé', to: '/movie' },
                { label: 'Trang Quản trị', to: '/admin/films' },
            ];
        }

        return [
            { label: 'Trang Quản trị', to: '/admin/films' },
            { label: 'Hồ sơ', to: '/profile' },
        ];
    }, [isProfileRoute]);

    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-4">
                <Link
                    to="/movie"
                    className="w-fit rounded-lg p-1 text-xl font-extrabold uppercase tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 sm:text-3xl"
                >
                    CINE<span className="text-red-500">FLEX</span>
                </Link>

                <nav aria-label="Main Navigation" className="w-full sm:w-auto">
                    {isLoggedIn ? (
                        <div className="flex w-full flex-wrap items-center justify-start gap-2.5 sm:w-auto sm:justify-end sm:gap-4">
                            {isAdminRole ? (
                                <div className="relative w-full sm:w-auto" ref={adminMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdminMenuOpen((prevState) => !prevState)}
                                        className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-2 text-left transition-colors hover:bg-yellow-400/15 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 sm:w-auto sm:justify-start sm:rounded-2xl sm:px-3"
                                    >
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-gray-950 sm:h-11 sm:w-11 sm:text-base">
                                            {avatarText}
                                        </div>
                                        <div className="min-w-0 flex-1 sm:flex-none">
                                            <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                                {displayName}
                                            </p>
                                            <p className="text-[11px] text-yellow-300 sm:text-xs">
                                                Quản trị viên
                                            </p>
                                        </div>
                                    </button>

                                    {isAdminMenuOpen ? (
                                        <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-xl border border-white/10 bg-[#111827] shadow-[0_18px_48px_rgba(0,0,0,0.42)] sm:left-auto sm:right-0 sm:w-56 sm:rounded-2xl">
                                            <div className="border-b border-white/10 px-3 py-3 sm:px-4">
                                                <p className="truncate text-xs font-semibold text-white sm:text-sm">
                                                    {displayName}
                                                </p>
                                                <p className="text-[11px] text-yellow-300 sm:text-xs">
                                                    Quản trị viên
                                                </p>
                                            </div>

                                            <div className="p-1.5 sm:p-2">
                                                {adminMenuItems.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        to={item.to}
                                                        className="block rounded-lg px-3 py-2.5 text-xs font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                                                        onClick={() => setIsAdminMenuOpen(false)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="mt-1 block w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm"
                                                    onClick={handleLogout}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        to="/profile"
                                        className="text-xs text-gray-300 transition-colors hover:text-white sm:text-sm"
                                    >
                                        Xin chào,{' '}
                                        <span className="text-yellow-400 font-medium">
                                            {displayName}
                                        </span>
                                    </Link>
                                    <button
                                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 sm:px-4 sm:py-2 sm:text-sm"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex w-full flex-wrap items-center gap-2.5 sm:w-auto sm:justify-end sm:gap-6">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:py-2 sm:text-sm ${
                                        isActive
                                            ? 'text-yellow-400'
                                            : 'text-gray-300 hover:text-white'
                                    }`
                                }
                            >
                                Trang chủ
                            </NavLink>

                            <Link
                                to="/login"
                                className="rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-medium text-gray-900 transition-transform hover:bg-yellow-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-600 sm:px-4 sm:py-2 sm:text-sm"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default memo(Header);
