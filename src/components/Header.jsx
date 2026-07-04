import React, { useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logout, selectorIsLoggedIn, selectorUser } from '../store/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useProfile } from '../hooks/useUser'

const Header = () => {
    const isLoggedIn = useSelector(selectorIsLoggedIn)
    const user = useSelector(selectorUser)
    const { data: profile } = useProfile(isLoggedIn)

    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    // 1. Tối ưu: Dùng useCallback để tránh tạo lại function mỗi khi component re-render
    const handleLogout = useCallback(() => {
        // Cân nhắc dùng queryClient.clear() nếu bạn muốn xóa TẤT CẢ cache khi logout
        queryClient.removeQueries({ queryKey: ['profile'] });
        dispatch(logout());
    }, [dispatch, queryClient]);
    const queryClient = useQueryClient()
    const displayName = profile?.hoTen || user?.hoTen || user?.taiKhoan || 'Người dùng'
    const avatarText = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('') || 'U'

    return (
        // 2. UX: Thêm `sticky top-0 z-50` để header luôn ghim ở trên cùng khi cuộn trang
        <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link 
                    to="/" 
                    className="text-2xl font-bold text-yellow-400 tracking-wide focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg p-1"
                >
                    🎬 CapstoneMovie
                </Link>

                {/* 3. Accessibility: Thêm aria-label cho thẻ nav */}
                <nav aria-label="Main Navigation" className="flex items-center">
                    {isLoggedIn ? (
                        <div className='flex gap-4 items-center'>
                            <Link
                                to="/profile"
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                {/* 4. UX: Thêm fallback 'Bạn' phòng trường hợp user.hoTen bị null/undefined */}
                                Xin chào, <span className="text-yellow-400 font-medium">{user?.hoTen || 'Bạn'}</span>
                            </Link>
                            <button
                                className="bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-all text-white"
                                onClick={handleLogout}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        // 5. UI Fix: Thêm `flex gap-6 items-center` để "Trang chủ" và "Đăng nhập" không bị dính vào nhau
                        <div className='flex gap-6 items-center'>
                            {/* 6. UX: Dùng NavLink thay vì Link để đổi màu khi đang ở đúng trang chủ (Active state) */}
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => 
                                    `text-sm font-medium transition-colors ${isActive ? 'text-yellow-400' : 'text-gray-300 hover:text-white'}`
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

// 7. Tối ưu: Dùng React.memo để ngăn Header re-render không cần thiết nếu props không đổi 
// (đặc biệt hữu ích nếu Header nằm trong Layout bọc toàn bộ app)
export default memo(Header);