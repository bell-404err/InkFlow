// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#B39DDB',         // мягкий лавандовый
            contrastText: '#f5f5f5', // неярко-белый
        },
        secondary: {
            main: '#F8BBD0',         // пастельный розовый
            contrastText: '#f5f5f5',
        },
        background: {
            default: '#38304A',      // темная база
            paper: 'rgba(255,255,255,0.15)', // стеклянность
        },
        text: {
            primary: '#f5f5f5',
            secondary: '#eeeeee',
        },
    },
    shape: {
        borderRadius: 12,
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 14,
        h4: {
            fontWeight: 600,
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#38304A',
                    backgroundImage: 'linear-gradient(135deg, #6B507D 0%, #8A7090 100%)',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                },
                containedPrimary: {
                    boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
                    '&:hover': {
                        boxShadow: '0px 6px 12px rgba(0,0,0,0.3)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: 0, // Оставляем AppBar строгим
                },
            },
        },
    },
});

export default theme;
