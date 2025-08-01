// src/main.jsx
import { createRoot } from 'react-dom/client';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { RouterProvider } from 'react-router';
import App from './App.jsx';
import router from './router/router.jsx';
import AuthProvider from './providers/Auth0Provider/Auth0Provider.jsx';
import AuthTokenHandler from './helpers/authTokenHandler.jsx';
import theme from './theme.js';
import './index.css';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <AuthTokenHandler />
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </AuthProvider>
);
