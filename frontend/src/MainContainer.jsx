// MainContainer.jsx
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Стилизованный компонент на основе Box, использует тему
const MainContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: theme.breakpoints.values.lg + 'px', // ограничиваем ширину, например по точке lg (~1200px)
    margin: '0 auto',              // центрируем по горизонтали
    padding: theme.spacing(4, 2),   // отступы: вертикально 4*8px, горизонтально 2*8px
    backgroundColor: theme.palette.background.paper, // фон - как у Paper (стеклянный эффект)
    borderRadius: theme.shape.borderRadius, // скругленные углы из темы
    boxShadow: theme.shadows[4],   // мягкая тень для приподнятого эффекта
}));

export default MainContainer;
