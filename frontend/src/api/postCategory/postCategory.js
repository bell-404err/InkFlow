import api from '../axios/axios.js';

export const getCategories = () => {
    return api.get('/categories', { requiresAuth: false });
};
