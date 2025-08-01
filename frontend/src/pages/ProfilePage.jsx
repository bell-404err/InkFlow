import React, { useState, useEffect, useRef } from 'react';
import {
    Typography, Box, Avatar, Stack, Tabs, Tab, Paper, Chip, CircularProgress, Button
} from '@mui/material';
import PostCard from '../components/PostCard';
import DraftsIcon from '@mui/icons-material/Drafts';
import StarIcon from '@mui/icons-material/Star';
import CreateIcon from '@mui/icons-material/Create';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from 'editorjs-paragraph-with-alignment';
import { getUserPosts, getStarredPosts } from '../api/axios/profile.js';
import DraftPreview from '../components/DraftPreview';
import { deletePost } from "../api/axios/post.js";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Вспомогательная функция для времени
function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hours = Math.floor(min / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30.44);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} ${years === 1 ? 'year' : 'years'}`;
    if (months > 0) return `${months} m.`;
    if (days > 0) return `${days} d.`;
    if (hours > 0) return `${hours} h.`;
    if (min > 0) return `${min} m.`;
    return `${sec} sec.`;
}

function DraftReadOnly({ draft }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!draft?.content) return;
        const editor = new EditorJS({
            holder: ref.current,
            readOnly: true,
            data: draft.content,
            tools: {
                header: Header,
                list: List,
                paragraph: {
                    class: Paragraph,
                    config: { defaultAlignment: 'left' },
                },
            },
            minHeight: 0,
        });
        return () => editor.destroy();
    }, [draft]);
    if (!draft) return null;
    return (
        <Box>
            <Typography variant="h6" mb={1}>
                {draft.title ? draft.title : 'Untitled'}
            </Typography>
            <Box ref={ref} sx={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 2,
                p: 2,
                mb: 2,
                minHeight: 80,
            }} />
            <Stack direction="row" spacing={2}>
                <Chip label={`Category: ${draft.category || '—'}`} />
                <Chip label={`Chars: ${JSON.stringify(draft.content?.blocks || []).length}`} />
            </Stack>
        </Box>
    );
}

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [myPosts, setMyPosts] = useState([]);
    const [starredPosts, setStarredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);
    const navigate = useNavigate();

    // ВАЖНО! Все хуки здесь, до любых return
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deletingPostId, setDeletingPostId] = useState(null);

    const draftRaw = localStorage.getItem('draft');
    const draft = draftRaw ? JSON.parse(draftRaw) : null;

    useEffect(() => {
        if (isLoading || !isAuthenticated) return;

        let isMounted = true;
        setLoading(true);
        getAccessTokenSilently().then(token => {
            Promise.all([
                getUserPosts(),
                getStarredPosts()
            ]).then(([posts, starred]) => {
                if (isMounted) {
                    setMyPosts(posts);
                    setStarredPosts(starred);
                }
            }).finally(() => {
                if (isMounted) setLoading(false);
            });
        });

        return () => { isMounted = false; };
    }, [isLoading, isAuthenticated, getAccessTokenSilently]);

    // Открыть диалог удаления
    const handleOpenDeleteDialog = (postId) => {
        setDeletingPostId(postId);
        setShowDeleteDialog(true);
    };

    // Закрыть диалог
    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false);
        setDeletingPostId(null);
    };

    // Подтвердить удаление
    const handleConfirmDelete = async () => {
        if (!deletingPostId) return;
        try {
            await deletePost(deletingPostId);
            setMyPosts(myPosts.filter(p => p.id !== deletingPostId));
            setShowDeleteDialog(false);
            setDeletingPostId(null);
        } catch {
            alert('Error while deleting');
            setShowDeleteDialog(false);
            setDeletingPostId(null);
        }
    };

    if (!isAuthenticated) return <Typography>You are not Authorized</Typography>;
    if (isLoading) return <CircularProgress />;

    const regDate = user.updated_at || user.created_at || new Date().toISOString();

    const stats = [
        {
            icon: <CalendarMonthIcon />, label: `Since: ${new Date(regDate).toLocaleDateString()}`,
            color: "secondary"
        },
        {
            icon: <AccessTimeIcon />, label: `Today's online time: ${timeAgo(regDate)}`,
            color: "primary"
        },
        {
            icon: <CreateIcon />, label: `Posts: ${myPosts.length}`,
            color: "primary"
        },
        {
            icon: <StarIcon />, label: `Starred: ${starredPosts.length}`,
            color: "secondary"
        },
    ];

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', py: 2, width: '100%' }}>
            <Paper elevation={3} sx={{
                p: 4, mb: 3, borderRadius: 1,
                display: 'flex', alignItems: 'center', gap: 4, width: '100%',
                flexWrap: { xs: 'wrap', sm: 'nowrap' }
            }}>
                <Avatar
                    src={user.picture}
                    alt={user.name}
                    sx={{ width: 96, height: 96, boxShadow: 2, mr: 3 }}
                />
                <Stack spacing={1} flex={1}>
                    <Typography variant="h4" fontWeight={700}>{user.name}</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" >
                        {stats.map((stat, i) => (
                            <Chip
                                key={i}
                                icon={stat.icon}
                                label={stat.label}
                                color={stat.color}
                                variant="outlined"
                                flex={1}
                                sx={{
                                    mb: 1,
                                    mr: 1,
                                    minWidth: 0,
                                    fontWeight: 500,
                                    fontSize: 16,
                                    '.MuiChip-icon': { fontSize: 22 },
                                    ...(stat.color === 'default' && { bgcolor: 'background.paper' }),
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Paper>

            <Paper elevation={2} sx={{ p: 1, mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={tab}
                    onChange={(_, v) => setTab(v)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': { fontWeight: 600, fontSize: 18, minHeight: 40 },
                        '& .MuiTabs-indicator': { height: 4, borderRadius: 2 }
                    }}
                >
                    <Tab icon={<CreateIcon />} label="Your Posts" />
                    <Tab icon={<StarIcon />} label="Favorites" />
                    <Tab icon={<DraftsIcon />} label="Draft" />
                </Tabs>
            </Paper>

            <Box>
                {tab === 0 && (
                    loading ? <CircularProgress /> : (
                        myPosts.length ? (
                            <Stack spacing={2}>
                                {myPosts.map(post =>
                                    <Box
                                        key={post.id}
                                        sx={{
                                            position: 'relative',
                                            pb: 5,
                                        }}
                                    >
                                        <PostCard post={post} />

                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                right: 16,
                                                bottom: 12,
                                                minWidth: 80,
                                                fontWeight: 700,
                                                zIndex: 1,
                                            }}
                                            onClick={() => handleOpenDeleteDialog(post.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                )}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">You haven't posted yet</Typography>
                        )
                    )
                )}
                {tab === 1 && (
                    loading ? <CircularProgress /> : (
                        starredPosts.length ? (
                            <Stack spacing={2}>
                                {starredPosts.map(post => <PostCard key={post.id} post={post} />)}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary">You haven't starred yet</Typography>
                        )
                    )
                )}
                {tab === 2 && (
                    draft ? (
                        <Paper sx={{ p: 3, mt: 2 }}>
                            <Typography variant="h6" mb={2}>
                                {draft.title || "Draft"}
                            </Typography>
                            <DraftPreview draft={draft} />
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 2 }}
                                onClick={() => navigate('/createpost')}
                            >
                                Continue Editing
                            </Button>
                        </Paper>
                    ) : (
                        <Typography color="text.secondary" sx={{ mt: 2 }}>Draft doesn't exist</Typography>
                    )
                )}

                <Dialog open={showDeleteDialog} onClose={handleCloseDeleteDialog}>
                    <DialogTitle>Delete Post?</DialogTitle>
                    <DialogContent>
                        Are you sure? Deleted post <b>can't</b> be restored.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            color="error"
                            variant="contained"
                            autoFocus
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}
