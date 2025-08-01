import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, ratePost, unratePost } from '../api/axios/post.js';
import {
    Typography, CircularProgress, Button, Divider, Chip, Stack, Box, Paper
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Output from 'editorjs-react-renderer';
import MainContainer from '../MainContainer';
import { useAuth0 } from '@auth0/auth0-react';
import Comments from '../components/Comment.jsx';

function sanitizeEditorData(data) {
    let blocks = [];
    try {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
    } catch {
        data = {};
    }
    if (Array.isArray(data)) {
        blocks = data;
    } else if (data && Array.isArray(data.blocks)) {
        blocks = data.blocks;
    }
    const validBlocks = blocks.filter(block => {
        if (!block || typeof block !== 'object' || typeof block.type !== 'string') return false;
        if ((block.type === "paragraph" || block.type === "header") && typeof block.data?.text !== "string") return false;
        if (block.type === "list" && (!Array.isArray(block.data?.items) || block.data.items.some(i => typeof i !== "string"))) return false;
        if (block.type === "linkTool" && (typeof block.data?.link !== "string")) return false;
        return true;
    });
    return { ...data, blocks: validBlocks };
}

export default function PostView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [starLoading, setStarLoading] = useState(false);

    const starsCount = post?.starsCount || 0;
    const starred = !!post?.starred;

    const fetchPost = useCallback(() => {
        setLoading(true);
        getPost(id, isAuthenticated)
            .then(res => setPost(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id, isAuthenticated]);

    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    const handleStarClick = async () => {
        if (!isAuthenticated) {
            loginWithRedirect();
            return;
        }
        setStarLoading(true);
        try {
            if (!starred) {
                await ratePost(post.id);
            } else {
                await unratePost(post.id);
            }
            fetchPost(); // обновляем post (и starred, и starsCount!)
        } catch (err) {
            console.error("Star error:", err);
        } finally {
            setStarLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (!post) {
        return (
            <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 4 }}>
                Пост не найден
            </Typography>
        );
    }

    // Здесь вызываем валидацию прямо перед рендером
    const safeContent = sanitizeEditorData(post.content);

    return (
        <MainContainer>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 960,
                    width: '100%',
                    mx: 'auto',
                    px: { xs: 2, sm: 4 },
                    py: { xs: 2, sm: 4 },
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.09)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.16)',
                    mt: { xs: 2, sm: 6 },
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{
                        textTransform: 'none',
                        mb: 3,
                        color: 'primary.contrastText',
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' },
                        borderRadius: 3,
                        px: 2,
                        py: 0.5,
                        fontWeight: 500,
                    }}
                >
                    Back
                </Button>

                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                    {post.title}
                </Typography>

                {/* Meta: author, date, stars */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ mb: 2, flexWrap: 'wrap' }}
                >
                    <Chip
                        label={post.author?.name || 'Anonymous'}
                        variant="outlined"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.12)',
                            color: 'text.primary',
                            fontWeight: 500,
                        }}
                    />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            onClick={handleStarClick}
                            disabled={starLoading}
                            sx={{
                                minWidth: 0,
                                p: 0.5,
                                bgcolor: 'transparent',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.18)',
                                },
                            }}
                        >
                            {starred
                                ? <StarIcon sx={{ fontSize: 32, color: 'warning.main', transition: 'color 0.15s' }} />
                                : <StarBorderIcon sx={{ fontSize: 32, color: 'warning.main', opacity: 0.7, transition: 'color 0.15s' }} />
                            }
                        </Button>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: 20, ml: 0.5 }}>
                            {starsCount}
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.15)' }} />

                {/* Content */}
                <Box
                    sx={{
                        '& img': {
                            maxWidth: '100%',
                            borderRadius: 2,
                            my: 2,
                            boxShadow: 3,
                        },
                        '& blockquote': {
                            pl: 2,
                            borderLeft: theme => `4px solid ${theme.palette.primary.main}`,
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            my: 2,
                        },
                        '& pre': {
                            background: theme => theme.palette.background.paper,
                            p: 2,
                            borderRadius: 2,
                            overflowX: 'auto',
                            my: 2,
                        },
                        '& a': {
                            color: 'primary.light',
                            textDecoration: 'underline',
                            transition: 'color 0.2s',
                            '&:hover': {
                                color: 'secondary.main',
                                textDecoration: 'underline wavy',
                            },
                        },
                        '& .cdx-link-tool__content': {
                            color: 'primary.light',
                        },
                        mb: 2,
                    }}
                >
                    <Output data={safeContent} />
                </Box>

                <Divider sx={{ mt: 4, mb: 2, borderColor: 'rgba(255,255,255,0.15)' }} />
                <Box sx={{ mt: 4 }}>
                    <Comments postId={post.id} />
                </Box>
            </Paper>
        </MainContainer>
    );
}
