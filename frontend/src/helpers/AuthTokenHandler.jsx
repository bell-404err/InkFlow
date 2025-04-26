import {useAuth0} from "@auth0/auth0-react";
import {useEffect} from "react";

const AuthTokenHandler = () => {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();

    useEffect(() => {
        const saveToken = async () => {
            try {
                if (isAuthenticated) {
                    const token = await getAccessTokenSilently();
                    localStorage.setItem("access_token", token);
                } else {
                    localStorage.removeItem("access_token");
                }
            } catch (error) {
                console.error("Error while saving token:", error);
            }
        };
        saveToken();
    }, [isAuthenticated, getAccessTokenSilently]);

    return null;
};

export default AuthTokenHandler;
