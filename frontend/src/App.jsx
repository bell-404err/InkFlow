import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
    AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Container,
    Menu, MenuItem, Divider, Tooltip, Stack, Link, Snackbar, Alert,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DraftsIcon from '@mui/icons-material/Drafts';
import HomeIcon from '@mui/icons-material/Home';
import CreateIcon from '@mui/icons-material/Create';
import { getDrafts } from './helpers/draftStorage.js';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';



// Кнопка scroll-to-top
function ScrollTopButton() {
    const [show, setShow] = React.useState(false);
    React.useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return show ? (
        <IconButton
            sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                bgcolor: 'primary.main',
                color: '#fff',
                boxShadow: 3,
                zIndex: 1200,
                '&:hover': { bgcolor: 'secondary.main' }
            }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <ArrowUpwardIcon />
        </IconButton>
    ) : null;
}

export default function App() {
    const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDraftSnackbar, setShowDraftSnackbar] = useState(false);

    const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    // state
    const [showDraftDialog, setShowDraftDialog] = useState(false);

// обработчик
    const handleNewPostClick = () => {
        if (localStorage.getItem('draft')) {
            setShowDraftDialog(true);
        } else {
            navigate('/createpost');
        }
    };

    const handleConfirmNewPost = () => {
        localStorage.removeItem('draft');
        setShowDraftDialog(false);
        navigate('/createpost');
    };

    const handleCancelNewPost = () => setShowDraftDialog(false);




    // Стили для контейнера (flex column, min-height 100vh)
    const mainWrapSx = {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
    };

    return (
        <Box sx={mainWrapSx}>
            {/* ==== HEADER ==== */}
            <AppBar position="static" color="primary" elevation={3} sx={{ minHeight: 80, justifyContent: 'center' }}>
                <Toolbar sx={{ minHeight: 80, py: 1, px: { xs: 1, sm: 4 } }}>
                    {/* ЛОГОТИП */}
                    <Typography
                        variant="h3"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            fontWeight: 900,
                            letterSpacing: 2,
                            fontFamily: "'Montserrat', 'Roboto', sans-serif",
                            flexShrink: 0,
                            fontSize: { xs: 28, sm: 36, md: 48 },
                            userSelect: 'none',
                            mr: 0,
                        }}
                    >
                        InkFlow
                    </Typography>

                    {/* НАВИГАЦИЯ */}
                    <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            borderLeft: '2px solid',
                            borderColor: 'rgba(255,255,255,0.16)',
                            pl: 4,
                            ml: 3,
                            height: 48,
                            flexGrow: 1,
                        }}
                    >
                        <Button
                            component={RouterLink}
                            to="/"
                            color="inherit"
                            sx={{ fontSize: 18, fontWeight: 500, px: 2 }}
                            endIcon={<HomeIcon sx={{ ml: 1 }} />}
                        >
                            Home
                        </Button>
                        {isAuthenticated && (
                            <Button
                                color="inherit"
                                sx={{ fontSize: 18, fontWeight: 500, px: 2 }}
                                onClick={handleNewPostClick}
                                endIcon={<AddIcon />}
                            >
                                New Post
                            </Button>
                        )}
                        {isAuthenticated && (
                            <Button
                                component={RouterLink}
                                to="/createpost"
                                color="inherit"
                                sx={{ fontSize: 18, fontWeight: 500, px: 2 }}
                                endIcon={<DraftsIcon sx={{ ml: 1 }} />}
                            >
                                Draft
                            </Button>
                        )}
                    </Stack>

                    {/* ==== Аутентификация / Профиль ==== */}
                    {!isAuthenticated ? (
                        <Stack direction="row" spacing={1}>
                            <Button
                                onClick={() => loginWithRedirect()}
                                color="inherit"
                                sx={{ fontSize: 17, fontWeight: 500 }}
                            >
                                Login
                            </Button>
                            <Button
                                onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
                                color="inherit"
                                sx={{ fontSize: 17, fontWeight: 500 }}
                            >
                                Sign Up
                            </Button>
                        </Stack>
                    ) : (
                        <Box sx={{ ml: 3 }}>
                            <Tooltip title={user.name}>
                                <Button
                                    onClick={handleProfileClick}
                                    color="inherit"
                                    sx={{
                                        fontWeight: 700,
                                        fontSize: 17,
                                        borderRadius: 3,
                                        px: 2,
                                        textTransform: 'none',
                                    }}
                                    startIcon={
                                        user.picture && (
                                            <Avatar
                                                alt={user.name}
                                                src={user.picture}
                                                sx={{ width: 36, height: 36, mr: 0.5 }}
                                            />
                                        )
                                    }
                                >
                                    {user.name}
                                </Button>
                            </Tooltip>
                            <Menu
                                disableScrollLock
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    sx: {
                                        mt: 1,
                                        minWidth: 190,
                                        bgcolor: 'background.paper',
                                        borderRadius: 1,
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        navigate('/profile');
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        logout({ returnTo: window.location.origin });
                                    }}
                                >
                                    Log out
                                </MenuItem>
                                <Divider />
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                        window.open('https://github.com/', '_blank');
                                    }}
                                >
                                    About
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* ==== MAIN CONTENT ==== */}
            <Container sx={{ mt: 4, mb: 7, flex: 1, minHeight: '65vh' }}>
                <Outlet />
            </Container>

            <ScrollTopButton />

            {/* Диалог создания нового поста, если есть черновик */}
            <Dialog
                open={showDraftDialog}
                onClose={handleCancelNewPost}
            >
                <DialogTitle>Heads up!</DialogTitle>
                <DialogContent>
                    Your current draft will be lost if you continue.<br />
                    Do you really want to go ahead?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelNewPost} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmNewPost} color="primary" variant="contained" autoFocus>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ==== FOOTER ==== */}
            <Box
                component="footer"
                sx={{
                    width: '100%',
                    bgcolor: 'primary.dark',
                    color: 'primary.contrastText',
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    boxShadow: '0 -6px 32px 0 rgba(31, 38, 135, 0.15)',
                }}
            >
                <Container maxWidth="md" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 2, mb: 0.5 }}>
                            Bohdan Onopriienko
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            Student, creator of InkFlow. A project for both diploma and portfolio.<br />
                            © Copyright-Free {new Date().getFullYear()}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={2} sx={{ mt: { xs: 2, sm: 0 } }}>
                        <Tooltip title="GitHub">
                            <Link href="https://github.com/" target="_blank" rel="noopener" color="inherit">
                                <GitHubIcon fontSize="large" />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Telegram">
                            <Link href="https://t.me/" target="_blank" rel="noopener" color="inherit">
                                <TelegramIcon fontSize="large" />
                            </Link>
                        </Tooltip>
                        <Tooltip title="LinkedIn">
                            <Link href="https://www.linkedin.com/" target="_blank" rel="noopener" color="inherit">
                                <LinkedInIcon fontSize="large" />
                            </Link>
                        </Tooltip>
                        <Tooltip title="Почта">
                            <Link href="mailto:fake.email@email.com" color="inherit">
                                <EmailIcon fontSize="large" />
                            </Link>
                        </Tooltip>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );

}
