import { Paper, Box, Typography, Stack, Chip, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { Link as RouterLink } from 'react-router-dom';

// Хелпер для удаления html тегов и сущностей
function stripHtml(html) {
    // Удаляем html-теги
    let text = html.replace(/<[^>]+>/g, '');
    // Заменяем наиболее частые html-сущности
    text = text.replace(/&nbsp;|&#160;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
    // Можно добавить еще, если встретишь другие
    return text;
}

// "n минут назад" и т.д.
function getRelativeTime(date) {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'только что';
    if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
    if (diff < 3 * 86400) return `${Math.floor(diff / 86400)} дн назад`;
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function PostCard({ post }) {
    // Склеиваем ВСЕ параграфы и чистим их, затем обрезаем до 300 символов
    let preview = '';
    try {
        if (post.content?.blocks) {
            preview = post.content.blocks
                .filter(b => b.type === 'paragraph')
                .map(b => stripHtml(b.data.text))
                .join(' ')
                .replace(/\s+/g, ' ')    // убираем лишние пробелы
                .trim();
            if (preview.length > 600) {
                preview = preview.slice(0, 600).trim() + '...';
            }
        }
    } catch {}

    return (
        <Paper
            elevation={3}
            sx={{
                mb: 3,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 1,
                minHeight: 120,
                maxHeight: 350,
                overflow: 'hidden',
                position: 'relative',
                background: 'rgba(255,255,255,0.12)',
                boxShadow: '0 4px 24px rgba(50,30,70,0.12)'
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mr: 1 }}>
                    {post.author?.name || 'Anonymous'}
                </Typography>
                <Chip
                    size="small"
                    label={getRelativeTime(post.createdAt)}
                    sx={{ ml: 1, fontSize: 13, bgcolor: 'background.default', color: 'text.secondary' }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="В избранном у пользователей">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <StarIcon sx={{ color: 'warning.main', fontSize: 24, opacity: 0.9 }} />
                            <Typography sx={{ fontWeight: 500 }}>{post.starsCount || 0}</Typography>
                        </Stack>
                    </Tooltip>
                </Stack>
            </Box>
            <Typography
                component={RouterLink}
                to={`/post/${post.id}`}
                variant="h5"
                sx={{
                    color: 'primary.contrastText',
                    fontWeight: 800,
                    mb: 1,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'none' }
                }}
            >
                {post.title}
            </Typography>
            {preview && (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: 0,
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 6, // максимум 3 строки, остальное - ...
                        overflow: 'hidden',
                    }}
                >
                    {preview}
                </Typography>
            )}
        </Paper>
    );
}
