import apiClient from "./api-client";

export interface Comment {
  createdAt(createdAt: unknown): import("react").ReactNode;
  _id: string;
  owner: string;  // The author of the comment
  comment: string;  // The content of the comment
  postId: string;  // The id of the associated post
}

const getCommentsByPostId = (postId: string) => {
  const abortController = new AbortController();
  const request = apiClient.get<Comment[]>(`/comments/post/${postId}`, {
    signal: abortController.signal,
  });
  return { request, abort: () => abortController.abort() };
};

export default { getCommentsByPostId };
