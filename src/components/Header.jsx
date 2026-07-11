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
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link
                    to="/movie"
                    className="text-3xl font-extrabold uppercase tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-1"
                >
                    CINE<span className="text-red-500">FLEX</span>
                </Link>

                <nav aria-label="Main Navigation" className="flex items-center">
                    {isLoggedIn ? (
                        <div className="flex gap-4 items-center">
                            {isAdminRole ? (
                                <div className="relative" ref={adminMenuRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsAdminMenuOpen((prevState) => !prevState)}
                                        className="flex items-center gap-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 px-3 py-2 text-left transition-colors hover:bg-yellow-400/15 focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
                                    >
                                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-base font-bold text-gray-950">
                                            {avatarText}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {displayName}
                                            </p>
                                            <p className="text-xs text-yellow-300">
                                                Quản trị viên
                                            </p>
                                        </div>
                                    </button>

                                    {isAdminMenuOpen ? (
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
                                                {adminMenuItems.map((item) => (
                                                    <Link
                                                        key={item.label}
                                                        to={item.to}
                                                        className="block rounded-xl px-4 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                                                        onClick={() => setIsAdminMenuOpen(false)}
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                                <button
                                                    type="button"
                                                    className="mt-1 block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
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
                                        className="text-sm text-gray-300 hover:text-white transition-colors"
                                    >
                                        Xin chào,{' '}
                                        <span className="text-yellow-400 font-medium">
                                            {displayName}
                                        </span>
                                    </Link>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all text-white"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-6 items-center">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `text-sm font-medium transition-colors ${
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
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-600"
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
