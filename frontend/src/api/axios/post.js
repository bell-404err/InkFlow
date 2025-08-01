import api from "./axios.js";

export const getPosts = ({ categoryId, sortBy } = {}) => {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (sortBy)    params.sortBy    = sortBy;

    return api.get('/posts', {
        requiresAuth: false,
        params,
    });
};


export const ratePost = (postId) => {
    return api.post('/star', { postId });
};

export const unratePost = (postId) => {
    return api.post('/unstar', { postId });
};

export const getPost = (id, requiresAuth = true) => {
    return api.get(`/posts/${id}`, { requiresAuth });
};

export const getCategories = () => {
    return api.get('/categories', { requiresAuth: false });
};

export const createPost = (postData) => {
    return api.post("/posts", postData);
};

export const deletePost = (postId) => {
    return api.delete(`/posts/${postId}`);
};

// api/axios/post.js
export const updatePost = (postId, data) => {
    return api.put(`/posts/${postId}`, data); // requiresAuth: true
};

