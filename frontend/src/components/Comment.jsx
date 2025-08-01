import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Stack,
    IconButton,
    CircularProgress,
    Collapse
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import { getCommentsByPost, createComment, deleteComment } from '../api/comment/comment.js';
import { useAuth0 } from '@auth0/auth0-react';

// Вспомогалка для дерева (можно вынести)
function buildCommentTree(comments) {
    const map = {};
    const roots = [];
    comments.forEach(comment => {
        map[comment.id] = { ...comment, children: [] };
    });
    comments.forEach(comment => {
        if (comment.parentId) {
            map[comment.parentId]?.children.push(map[comment.id]);
        } else {
            roots.push(map[comment.id]);
        }
    });
    return roots;
}

function CommentItem({ comment, currentUserId, onReply, onDelete }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [replyLoading, setReplyLoading] = useState(false);
    const [showChildren, setShowChildren] = useState(false); // управляет показом дочерних

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;
        setReplyLoading(true);
        await onReply(replyText, comment.id);
        setReplyText('');
        setShowReply(false);
        setReplyLoading(false);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2, mb: 1,
                ml: comment.parentId ? 3 : 0,
                bgcolor: comment.parentId ? 'background.paper' : 'rgba(255,255,255,0.10)',
                borderLeft: comment.parentId ? `3px solid #B39DDB` : undefined,
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {comment.author?.name || 'Anonymous'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString('ru-RU', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                </Typography>
                {comment.author?.id === currentUserId && (
                    <IconButton
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                        onClick={() => onDelete(comment.id)}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
                <IconButton
                    size="small"
                    color={showReply ? "secondary" : "primary"}
                    sx={{
                        ml: 1,
                        color: "#fff",
                        opacity: 0.9,
                        '&:hover': {
                            color: "#F8BBD0",
                            opacity: 1,
                            backgroundColor: 'rgba(179,157,219,0.13)',
                        }
                    }}
                    onClick={() => setShowReply(v => !v)}
                >
                    <ReplyIcon fontSize="small" />
                </IconButton>
            </Stack>
            <Typography variant="body1" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {comment.content}
            </Typography>

            <Collapse in={showReply}>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <TextField
                        size="small"
                        autoFocus
                        fullWidth
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Your reply..."
                        disabled={replyLoading}
                        variant="outlined"
                        sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        endIcon={<SendIcon />}
                        onClick={handleReplySubmit}
                        disabled={replyLoading}
                    >Reply</Button>
                </Stack>
            </Collapse>

            {/* Show reply */}
            {comment.children && comment.children.length > 0 && !showChildren && (
                <Button
                    variant="text"
                    size="small"
                    sx={{
                        mt: 1,
                        ml: 1,
                        pl: 0,
                        color: "#fff",
                        fontWeight: 500,
                        textTransform: 'none',
                        fontSize: 14,
                        '&:hover': {
                            color: "#F8BBD0",
                            backgroundColor: 'rgba(179,157,219,0.07)',
                        }
                    }}
                    onClick={() => setShowChildren(true)}
                >
                    Show Reply's ({comment.children.length})
                </Button>
            )}

            {/* child comment only if they exist */}
            {comment.children && comment.children.length > 0 && showChildren && (
                <Box sx={{ mt: 1 }}>
                    {comment.children.map(child => (
                        <CommentItem
                            key={child.id}
                            comment={child}
                            currentUserId={currentUserId}
                            onReply={onReply}
                            onDelete={onDelete}
                        />
                    ))}
                </Box>
            )}
        </Paper>
    );
}


export default function Comments({ postId }) {
    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const [comments, setComments] = useState([]);
    const [tree, setTree] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [posting, setPosting] = useState(false);

    const fetchComments = () => {
        setLoading(true);
        getCommentsByPost(postId)
            .then(res => {
                setComments(res.data);
                setTree(buildCommentTree(res.data));
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line
    }, [postId]);

    const handleAdd = async () => {
        if (!isAuthenticated) return loginWithRedirect();
        if (!text.trim()) return;
        setPosting(true);
        await createComment({ content: text, postId });
        setText('');
        fetchComments();
        setPosting(false);
    };

    const handleReply = async (replyText, parentId) => {
        if (!isAuthenticated) return loginWithRedirect();
        if (!replyText.trim()) return;
        await createComment({ content: replyText, postId, parentId });
        fetchComments();
    };

    const handleDelete = async (id) => {
        if (!isAuthenticated) return loginWithRedirect();
        await deleteComment(id);
        fetchComments();
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Comments ({comments.length})
            </Typography>

            {/* Добавить новый комментарий */}
            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        multiline
                        minRows={1}
                        maxRows={5}
                        fullWidth
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Write something…"
                        disabled={posting}
                        variant="outlined"
                        sx={{ bgcolor: 'background.default', borderRadius: 2 }}
                    />
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleAdd}
                        disabled={posting}
                    >
                        Send
                    </Button>
                </Stack>
            </Paper>

            {/* Comments List*/}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                tree.length === 0
                    ? <Typography color="text.secondary">Nobody has written anything yet — be the first!</Typography>
                    : tree.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={user?.sub}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))
            )}
        </Box>
    );
}
