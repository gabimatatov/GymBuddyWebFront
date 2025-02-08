import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface Like {
    owner: string;
    postId: string;
}

// Create Like
const CreateLike = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.post("/likes", { postId }, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Delete Like
const DeleteLike = (postId: string) => {
    const abortController = new AbortController();
    const request = apiClient.delete(`/likes/${postId}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
};

// Get Like 
const getLikeByOwner = (postId: string, userId: string) => {
    const abortController = new AbortController();
    const request = apiClient.get(`/likes/${postId}/${userId}`, { signal: abortController.signal });
    return { request, abort: () => abortController.abort() };
}

export default { CreateLike, DeleteLike, getLikeByOwner };
