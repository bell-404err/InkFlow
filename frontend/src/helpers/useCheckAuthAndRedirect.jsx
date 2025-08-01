import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router"

const useCheckAuthAndRedirect = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0()
    // const navigate = useNavigate()

    return () => {
        if (!isAuthenticated) {
            // navigate("/login")
            loginWithRedirect();
            return false
        }
        return true
    }
}

export default useCheckAuthAndRedirect
