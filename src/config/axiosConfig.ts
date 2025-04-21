import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("refreshToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // 자동 로그아웃 처리 같은 것 가능
        }
        return Promise.reject(error);
    }
);

export default apiClient;