import api from "../axios/axios.js";

export const getCommentsByPost = (postId) =>
    api.get(`/get/${postId}`);

export const createComment = ({ content, postId, parentId }) =>
    api.post(`/create/${postId}`, { content, postId, parentId });

export const deleteComment = (id) =>
    api.delete(`/delete/${id}`);