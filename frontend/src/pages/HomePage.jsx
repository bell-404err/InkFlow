import React, {useEffect, useState} from 'react';
import {getPosts} from '../api/axios/post.js';
import {getCategories} from '../api/postCategory/postCategory.js';
import {
    Typography,
    Paper,
    Box,
    Stack,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import MainContainer from '../MainContainer';
import {useNavigate} from 'react-router-dom';
import PostCard from "../components/PostCard.jsx";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setCat] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        getCategories()
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        setLoading(true);
        getPosts({categoryId: selectedCategory, sortBy})
            .then(res => setPosts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selectedCategory, sortBy]);

    if (loading) {
        return (
            <MainContainer>
                <Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
                    <CircularProgress/>
                </Box>
            </MainContainer>
        );
    }

    return (
        <MainContainer
            sx={{
                width: '90vw',
                mx: 'auto',
                px: {xs: 1, md: 4},
            }}>
            <Box sx={{display: 'flex', gap: 4, py: 4}}>
                <Paper
                    elevation={1}
                    sx={{
                        width: 240,
                        minWidth: 200,
                        maxWidth: 270,
                        flexShrink: 0,
                        borderRadius: 1,
                        p: 2,
                        bgcolor: 'background.paper',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: 'fit-content',
                        alignSelf: 'flex-start',
                    }}
                >
                    <Typography variant="h6" sx={{fontWeight: 600}}>
                        Category
                    </Typography>
                    <List dense>
                        <ListItemButton
                            selected={selectedCategory === ''}
                            onClick={() => setCat('')}
                            sx={{borderRadius: 2}}
                        >
                            <ListItemText primary="Explore All"/>
                        </ListItemButton>
                        {categories.map(cat => (
                            <ListItemButton
                                key={cat.id}
                                selected={selectedCategory === cat.id}
                                onClick={() => setCat(cat.id)}
                                sx={{borderRadius: 2}}
                            >
                                <ListItemText primary={cat.name}/>
                            </ListItemButton>
                        ))}
                    </List>
                    <Divider sx={{my: 1}}/>
                    <FormControl fullWidth>
                        <InputLabel id="sort-label">Sort by</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sortBy}
                            label="Сортировка"
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <MenuItem value="newest">Newest</MenuItem>
                            <MenuItem value="oldest">Oldest</MenuItem>
                            <MenuItem value="top">Most rated</MenuItem>
                        </Select>
                    </FormControl>
                </Paper>

                <Box sx={{flexGrow: 1, minWidth: 0}}>
                    <Typography variant="h4" sx={{fontWeight: 700, mb: 3}}>
                        {selectedCategory
                            ? `You're exploring ${categories.find(c => c.id === selectedCategory)?.name}, have fun!`
                            : 'All posts'}
                    </Typography>
                    <Stack>
                        {posts.map(post => (
                            <PostCard key={post.id} post={post}/>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </MainContainer>
    );
}
