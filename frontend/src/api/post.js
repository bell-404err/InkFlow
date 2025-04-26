import api from "./axios";

export const getPosts = () => {
    return api.get("/posts", { requiresAuth: false });
};

export const createPost = (postData) => {
    return api.post("/posts", postData);
};

export const deletePost = (postId) => {
    return api.delete(`/posts/${postId}`);
};
