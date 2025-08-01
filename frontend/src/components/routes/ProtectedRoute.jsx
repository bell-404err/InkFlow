import { useAuth0 } from "@auth0/auth0-react"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const { isLoading, isAuthenticated } = useAuth0()

    if (isLoading) return <p>Завантаження...</p>
    if (!isAuthenticated) return <Navigate to="/login" />

    return children
}

export default ProtectedRoute;