import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
}
export interface UpdatedUser {
    username?: string;
    avatar?: string;
}

// Register User Service
const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', user, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Logout User Service
const logout = (refreshToken: string) => {
    const abortController = new AbortController();
    const request = apiClient.post('/auth/logout', { refreshToken }, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Login User Service
const login = (credentials: { email: string; password: string }) => {
    const abortController = new AbortController();
    const request = apiClient.post<{
        refreshToken: string;
        accessToken: string;
        _id: string;
        username: string;
        email: string;
        avatar: string;
    }>('/auth/login', credentials, { signal: abortController.signal });

    request
        .then(response => {
            console.log('Access Token:', response.data.accessToken);
            console.log('Refresh Token:', response.data.refreshToken);
            console.log('User ID:', response.data._id);
        })
        .catch(error => {
            console.log('Error during login:', error.response?.data || error.message);
        });

    return { request, abort: () => abortController.abort() };
};

// Upload Avatar Image Service
const uploadImage = (img: File) => {
    const formData = new FormData();

    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': `${img.type}`,
        },
    });
    return { request };
};

// Update User Service
const updateUser = (updatedUser: UpdatedUser) => {
    const abortController = new AbortController();
    const request = apiClient.put<{
        username: string;
        avatar: string;
    }>("/auth/user", updatedUser, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

export default { register, login, uploadImage, updateUser, logout };
