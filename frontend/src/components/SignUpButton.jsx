import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

const SignUpButton = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={() => loginWithRedirect({ screen_hint: "signup", login_hint: "" })}
        >
            sign up
        </Button>
    );
};

export default SignUpButton;
