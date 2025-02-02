import axios, { CanceledError } from "axios";
import Cookies from "js-cookie";

export { CanceledError };

const apiClient = axios.create({
    baseURL: "http://localhost:3000/",
    headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor to attach the token to every request
apiClient.interceptors.request.use((config) => {
    const accessToken = Cookies.get("accessToken");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
