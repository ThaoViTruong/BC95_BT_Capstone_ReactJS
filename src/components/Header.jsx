import React, { useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logout, selectorIsLoggedIn, selectorUser } from '../store/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '../hooks/useUser';

const Header = () => {
    const isLoggedIn = useSelector(selectorIsLoggedIn);
    const user = useSelector(selectorUser);
    const { data: profile } = useProfile(isLoggedIn);

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const handleLogout = useCallback(() => {
        queryClient.removeQueries({ queryKey: ['profile'] });
        dispatch(logout());
    }, [dispatch, queryClient]);

    const displayName =
        profile?.hoTen || user?.hoTen || user?.taiKhoan || 'Người dùng';

    const avatarText =
        displayName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0]?.toUpperCase())
            .join('') || 'U';

    return (
        // ⭐ SỬA: Bỏ "sticky top-0 z-50" → header sẽ cuộn theo trang
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-3xl font-extrabold uppercase tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-1"
                >
                    CINE<span className="text-red-500">FLEX</span>
                </Link>

                <nav aria-label="Main Navigation" className="flex items-center">
                    {isLoggedIn ? (
                        <div className="flex gap-4 items-center">
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