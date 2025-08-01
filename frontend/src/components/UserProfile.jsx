import { useAuth0 } from "@auth0/auth0-react";
import {
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Typography,
    Divider,
    Box,
} from "@mui/material";
import { useState } from "react";

import LogoutButton from "./LogoutButton";


const UserProfile = () => {
    const { user, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton onClick={handleMenuOpen}>
                <Avatar alt={user.name} src={user.picture} />
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <Box px={2} py={1}>
                    <Typography variant="subtitle1">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user.email}
                    </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={handleMenuClose}>Your profile</MenuItem>

                <MenuItem
                    onClick={() =>
                        logout({ returnTo: window.location.origin })
                    }
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserProfile;
