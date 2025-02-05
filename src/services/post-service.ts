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

const getAllPosts = () => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>("/posts", { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

const getAllPostsByOwner = (id: string) => {
    const abortController = new AbortController();
    const request = apiClient.get<Post[]>(`/posts?owner=${id}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

const createPost = (postData: Omit<Post, "_id" | "createdAt">) => {
    const abortController = new AbortController();
    const request = apiClient.post<Post>("/posts", postData, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

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

// Delete post function
const deletePost = (id: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/posts/${id}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

export default { getAllPosts, getAllPostsByOwner, createPost, uploadImage, deletePost };
