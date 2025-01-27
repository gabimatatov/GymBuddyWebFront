import apiClient, { CanceledError } from "./api-client";

export { CanceledError }

export interface User {
    _id?: string;
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

// Chcek 
// const checkUser = (user: User) => {
//     const abortController = new AbortController();
//     const request = apiClient.post<User>('/auth/register', user, { signal: abortController.signal });
//     return { request, abort: () => abortController.abort() }
// }

// Register User Service
const register = (user: User) => {
    const abortController = new AbortController();
    const request = apiClient.post<User>('/auth/register', user, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() }
}


// Upload Avatar Image Service
const uploadImage = (img: File) => {
    const formData = new FormData();

    formData.append("file", img);
    const request = apiClient.post('/file?file=' + img.name, formData, {
        headers: {
            'Content-Type': `${img.type}`
        }
    })
    return { request }
}

// Update User Service
const updateUser = (userId: string, updatedUser: User) => {
    const abortController = new AbortController();
    const request = apiClient.put<User>(`/auth/user/${userId}`, updatedUser, {
        signal: abortController.signal,
    });
    return { request, abort: () => abortController.abort() };
};

export default { register, uploadImage, updateUser }