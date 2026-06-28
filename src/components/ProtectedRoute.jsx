import { useSelector } from "react-redux"
import { selectorIsLoggedIn } from "../store/authSlice"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = useSelector(selectorIsLoggedIn)

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute