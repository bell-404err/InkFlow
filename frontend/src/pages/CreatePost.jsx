import {useState, useEffect, useRef} from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import LinkTool from '@editorjs/link';
import ImageTool from '@editorjs/image';
import Paragraph from 'editorjs-paragraph-with-alignment';
import {useAuth0} from '@auth0/auth0-react';
import {createPost} from '../api/axios/post.js';
import {getCategories} from '../api/postCategory/postCategory.js';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';

import {
    Typography, TextField, Button, Stack, Box, FormControl,
    InputLabel, Select, MenuItem, Chip, Snackbar, Alert
} from '@mui/material';
import MainContainer from '../MainContainer';

const AUTOSAVE_INTERVAL = 150_000;

const getEditorContent = (draft) => {
    if (!draft || !draft.content || !Array.isArray(draft.content.blocks)) {
        return {blocks: []};
    }
    return draft.content;
};

const CreatePost = () => {
    const {user, isAuthenticated, loginWithRedirect, isLoading, getAccessTokenSilently} = useAuth0();

    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [editorReady, setEditorReady] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'info'});
    const [lastSaved, setLastSaved] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const navigate = useNavigate();

    const editorRef = useRef(null);
    const savedData = useRef(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) loginWithRedirect();
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then(token => {
                localStorage.setItem('access_token', token);
            }).catch(console.error);
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        const raw = localStorage.getItem('draft');
        if (raw) {
            try {
                const data = JSON.parse(raw);
                savedData.current = data;
                setTitle(data?.title || '');
                setSelectedCategory(data?.category || '');
            } catch {
                savedData.current = undefined;
            }
        } else {
            savedData.current = undefined;
        }
    }, []);

    const countWords = (blocks) => {
        if (!blocks) return 0;
        return blocks
            .map(block => {
                if (block.type === "paragraph" && block.data?.text)
                    return block.data.text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
                if (block.type === "header" && block.data?.text)
                    return block.data.text.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
                return 0;
            })
            .reduce((a, b) => a + b, 0);
    };

    useEffect(() => {
        const editor = new EditorJS({
            holder: 'editorjs',
            data: getEditorContent(savedData.current),
            tools: {
                header: Header,
                list: List,
                linkTool: {
                    class: LinkTool,
                    config: {endpoint: 'http://localhost:4000/api/fetch-url'},
                },
                image: {
                    class: ImageTool,
                    config: {
                        field: 'image',
                        endpoints: {byFile: 'http://localhost:4000/api/upload'},
                    },
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                    config: {
                        defaultAlignment: 'left',
                        alignments: ['left', 'center', 'right'],
                        placeholder: "Start writing your amazing post here...",
                    },
                },
            },
            autofocus: true,
            minHeight: 0,
            onReady: () => setEditorReady(true),
            onChange: async () => {
                const data = await editor.save();
                setWordCount(countWords(data.blocks));
            },
            placeholder: "Start writing your amazing post here...",
        });

        editorRef.current = editor;
        if (savedData.current?.content?.blocks)
            setWordCount(countWords(savedData.current.content.blocks));

        return () => {
            saveDraft();
            editor.destroy();
            editorRef.current = null;
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            saveDraft();
        }, AUTOSAVE_INTERVAL);
        return () => clearInterval(interval);
    }, [title, selectedCategory, editorReady]);

    const saveDraft = async () => {
        if (!editorRef.current) return;
        try {
            const content = await editorRef.current.save();
            const data = {title, category: selectedCategory, content};
            localStorage.setItem('draft', JSON.stringify(data));
            setLastSaved(Date.now());
            setWordCount(countWords(content.blocks));
        } catch (error) {
            throw error;
        }
    };

    const clearForm = () => {
        setTitle('');
        setSelectedCategory('');
        setWordCount(0);
        localStorage.removeItem('draft');
        setLastSaved(null);
        editorRef.current?.clear?.();
    };

    const handleSubmit = async () => {
        const editor = editorRef.current;
        if (!editor) return;
        setIsSaving(true);
        try {
            const content = await editor.save();
            const response = await createPost({
                title,
                categoryId: selectedCategory,
                content,
                authorId: user.sub,
                userName: user.name,
            });
            setSnackbar({open: true, message: 'Post created successfully!', severity: 'success'});
            clearForm();
            if (response?.data?.id) {
                navigate(`/post/${response.data.id}`);
            }
        } catch (err) {
            console.error('Error creating post', err);
            setSnackbar({open: true, message: 'Failed to create post.', severity: 'error'});
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseSnackbar = () => setSnackbar(prev => ({...prev, open: false}));

    const getTimeAgo = () => {
        if (!lastSaved) return '';
        const seconds = Math.floor((Date.now() - lastSaved) / 1000);
        if (seconds < 60) return `${seconds} sec ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
        return `${Math.floor(seconds / 3600)} h ago`;
    };

    return (
        <MainContainer>
            <Typography variant="h4" component="h1" gutterBottom>
                From mind to page, Let your ink flow!
            </Typography>

            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Header"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                    <FormControl required sx={{minWidth: 180}}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            label="Category"
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>

                <Box
                    id="editorjs"
                    sx={{
                        minHeight: 240,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 1,
                        p: 2,
                        mt: 1
                    }}
                />

                <Stack direction="row" alignItems="center" spacing={2} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip
                            label={lastSaved ? `Draft saved • ${getTimeAgo()}` : 'Draft not saved yet'}
                            color={lastSaved ? 'success' : 'default'}
                            size="small"
                        />
                        <Tooltip title="Save Draft">
                            <span>
                                <IconButton
                                    color="primary"
                                    size="small"
                                    onClick={saveDraft}
                                    disabled={isSaving || !editorReady}
                                    sx={{
                                        ml: 1,
                                        bgcolor: 'background.paper',
                                        border: '1.5px solid',
                                        borderColor: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                        },
                                        transition: '0.18s',
                                    }}
                                >
                                    <SaveIcon fontSize="small"/>
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {wordCount} words • Reading time: {Math.max(1, Math.ceil(wordCount / 200))} min
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="secondary" onClick={clearForm} disabled={isSaving}>
                        Stat Over
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!title.trim() || !selectedCategory || !editorReady || isSaving}
                    >
                        {isSaving ? 'Creating your amazing post…' : 'Public'}
                    </Button>
                </Stack>
            </Stack>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainContainer>
    );
};

export default CreatePost;
