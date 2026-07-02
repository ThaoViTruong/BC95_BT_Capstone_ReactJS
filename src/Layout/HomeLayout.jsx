import React from 'react'
import Header from '../components/Header'
import { Navigate, Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { selectorUser } from '../store/authSlice'

const HomeLayout = () => {
  const user = useSelector(selectorUser)

  if (user?.maLoaiNguoiDung === 'QuanTri') {
    return <Navigate to="/admin" replace />
  }

  return (
    <div>
      <Header />

      <Outlet />

      <Footer />
    </div>
  )
}

export default HomeLayout
