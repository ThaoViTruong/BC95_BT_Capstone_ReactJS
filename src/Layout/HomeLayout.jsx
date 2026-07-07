import Header from '../components/Header'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import { useSelector } from 'react-redux'
import { selectorUser } from '../store/authSlice'

const HomeLayout = () => {
  const user = useSelector(selectorUser)
  const location = useLocation()

  const isProfileRoute = location.pathname === '/profile' || location.pathname === '/thongtincanhan'

  if (user?.maLoaiNguoiDung === 'QuanTri' && !isProfileRoute) {
    return <Navigate to="/admin/films" replace />
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

