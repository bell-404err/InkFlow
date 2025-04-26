import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4000/api",
});

// Интерсептор запросов
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        // Только если не указан флаг requiresAuth: false
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
