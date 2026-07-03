import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout, selectorIsLoggedIn, selectorUser } from '../store/authSlice'
import { useQueryClient } from '@tanstack/react-query'
import { useProfile } from '../hooks/useUser'

const Header = () => {
    const isLoggedIn = useSelector(selectorIsLoggedIn)
    const user = useSelector(selectorUser)
    const { data: profile } = useProfile(isLoggedIn)

    const dispatch = useDispatch()

    const queryClient = useQueryClient()
    const displayName = profile?.hoTen || user?.hoTen || user?.taiKhoan || 'Người dùng'
    const avatarText = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase())
        .join('') || 'U'

    const handleLogout = () => {
        queryClient.removeQueries({queryKey: ['profile']})
        dispatch(logout())
    }
    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-yellow-400 tracking-wide">🎬 Rạp Phim</Link>
                <nav className="flex items-center gap-6">
                    {
                        isLoggedIn ? (
                            <div className='flex gap-4 items-center'>
                                <Link
                                    to="/profile"
                                    className="text-right transition-opacity hover:opacity-80"
                                >
                                    <p className="text-sm text-gray-300">Xin chào, <span className="text-yellow-400 font-medium">{displayName}</span></p>
                                    <p className="text-xs text-gray-400">Trang cá nhân</p>
                                </Link>
                                <Link
                                    to="/profile"
                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-gray-900 transition-transform hover:scale-105"
                                    aria-label="Trang cá nhân"
                                >
                                    {avatarText}
                                </Link>
                                <button
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white"
                                    onClick={handleLogout}
                                >Đăng xuất</button>
                            </div>
                        ) : (
                            <div>
                                <Link to="/login" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Đăng nhập
                                </Link>
                            </div>
                        )
                    }
                </nav>
            </div>
        </header>

    )
}

export default Header
