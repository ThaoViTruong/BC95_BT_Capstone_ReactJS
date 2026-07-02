import React, { useState } from 'react'
import { useProfile } from '../hooks/useUser'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectorIsLoggedIn } from '../store/authSlice'

const ProfilePage = () => {
    const isLoggedIn = useSelector(selectorIsLoggedIn)
    const { data: profile, isLoading, isError } = useProfile(isLoggedIn)
    const [user, setUser] = useState(profile)

    const avatar = profile?.hoTen[0].toUpperCase()
    return (
        <div className="min-h-screen bg-gray-950 text-white">

            {
                isLoading && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-950/70 z-50">
                        <LoadingSpinner />
                    </div>
                )
            }

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center text-gray-900 text-3xl font-bold flex-shrink-0">
                            {avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-white">{profile?.hoTen}</h1>
                            </div>
                            <p className="text-gray-400 text-sm">@{profile?.taiKhoan}</p>
                        </div>
                        {
                            profile?.maLoaiNguoiDung === "QuanTri" && (
                                <Link to="/admin" className="flex-shrink-0 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                                    ⚙️ Trang quản trị
                                </Link>
                            )
                        }

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-800">
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Email</p>
                            <p className="text-white text-sm">{profile?.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Số điện thoại</p>
                            <p className="text-white text-sm">{profile?.soDT}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Role</p>
                            <p className="text-white text-sm">{profile?.maLoaiNguoiDung}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">
                        Lịch sử đặt vé
                        <span className="text-gray-500 text-sm font-normal ml-2">(2 vé)</span>
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-400/30 transition-colors">
                            <div className="flex gap-4 p-4">
                                <img src="https://movienew.cybersoft.edu.vn/hinhanh/cua-lai-vo-bau_gp01.jpg" alt="Cua lại vợ bầu" className="w-20 h-28 object-cover rounded-xl flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                        <h3 className="text-white font-semibold text-lg leading-tight">Cua lại vợ bầu</h3>
                                        <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">75.000 ₫</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                                        <span>🗓 19/11/2025 21:11</span>
                                        <span>⏱ 120 phút</span>
                                        <span className="text-gray-600">Mã vé: #133463</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1.5">
                                            📍 BHD Star Cineplex - 3/2 — Rạp 5
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 80</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 79</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-yellow-400/30 transition-colors">
                            <div className="flex gap-4 p-4">
                                <img src="https://movienew.cybersoft.edu.vn/hinhanh/bo-giaa_gp01.jpg" alt="Bố già" className="w-20 h-28 object-cover rounded-xl flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                        <h3 className="text-white font-semibold text-lg leading-tight">Bố già</h3>
                                        <span className="text-yellow-400 font-bold text-sm whitespace-nowrap">125.000 ₫</span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                                        <span>🗓 22/11/2025 02:41</span>
                                        <span>⏱ 120 phút</span>
                                        <span className="text-gray-600">Mã vé: #133484</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1.5">
                                            📍 CNS - Hai Bà Trưng — Rạp 8
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 47</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 48</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 41</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 112</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 111</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 128</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 95</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 136</span>
                                            <span className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs font-medium px-2 py-0.5 rounded">Ghế 137</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProfilePage
