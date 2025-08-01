import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token && config.requiresAuth !== false) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
