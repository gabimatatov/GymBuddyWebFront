import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface Post {
    createdAt: string | number | Date;
    _id: string;
    title: string;
    content: string;
    owner: string;
    username: string;
    image: string;
    date: string;
}

// Get all Posts
const getAllPosts = () => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>("/posts", { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Gell Posts by Owner
const getAllPostsByOwner = (id: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>(`/posts?owner=${id}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Update Many Posts
const updatePostsByOwner = (id: string, username: string) => {
    const abortController = new AbortController();
    const request = apiClient.put(`/posts/update/${id}`, { username }, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Create Post
const createPost = (postData: Omit<Post, "_id" | "createdAt">) => {
    const abortController = new AbortController();
    const request = apiClient.post<Post>("/posts", postData, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Delete post function
const deletePost = (id: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/posts/${id}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Get Post by Id
const getPostById = (id: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Post>(`/posts/${id}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Update post
const updatePost = (id: string, postData: FormData) => {
    const abortController = new AbortController();
    const request = apiClient.put(`/posts/${id}`, postData, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

export default { getAllPosts, getAllPostsByOwner, createPost, deletePost, updatePostsByOwner, updatePost, getPostById };
