import { useSelector } from "react-redux"
import { selectorIsLoggedIn, selectorUser } from "../store/authSlice"
import { Navigate } from "react-router-dom"

const ProtectedAdminRoute = ({children}) => {

    const isLoggedIn = useSelector(selectorIsLoggedIn)
    const user = useSelector(selectorUser)
    
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    if (user?.maLoaiNguoiDung !== "QuanTri") {
        return <Navigate to="/" replace />
    }

    return children
}
export default ProtectedAdminRoute