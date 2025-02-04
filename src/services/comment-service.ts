import { ReactNode } from "react";
import apiClient from "./api-client";

export interface Comment {
  username: ReactNode;
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

// Create a new comment
const createComment = async (commentData: { comment: string; postId: string; username: string }) => {
  try {
    const response = await apiClient.post<Comment>("/comments", {
      comment: commentData.comment,
      postId: commentData.postId,
      username: commentData.username, // Sending the username
    });
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error; // Rethrow error so it can be caught in the component
  }
};

// Delete a comment
const deleteComment = async (commentId: string) => {
  try {
    await apiClient.delete(`/comments/${commentId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error; // Rethrow error so it can be handled in the component
  }
};

export default { getCommentsByPostId, createComment, deleteComment };
