import api from './axios.js';

// Получить свои посты
export async function getUserPosts() {
    const { data } = await api.get('/profile/posts');
    return data;
}

// Получить избранное
export async function getStarredPosts() {
    const { data } = await api.get('/profile/starred');
    return data;
}
