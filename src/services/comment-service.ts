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
    signal: abortController.signal, // Pass abort signal to the request
  });
  return { request, abort: () => abortController.abort() };
};

// Create a new comment
const createComment = async (commentData: { comment: string; postId: string; username: string }, abortSignal?: AbortSignal) => {
  const abortController = new AbortController();
  try {
    const response = await apiClient.post<Comment>("/comments", {
      comment: commentData.comment,
      postId: commentData.postId,
      username: commentData.username, // Sending the username
    }, {
      signal: abortSignal || abortController.signal // Use passed abort signal or create a new one
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request aborted');
    } else {
      console.error("Error creating comment:", error);
    }
    throw error; // Rethrow error so it can be caught in the component
  }
};

// Delete a comment
const deleteComment = async (commentId: string, abortSignal?: AbortSignal) => {
  const abortController = new AbortController();
  try {
    await apiClient.delete(`/comments/${commentId}`, {
      signal: abortSignal || abortController.signal // Use passed abort signal or create a new one
    });
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request aborted');
    } else {
      console.error("Error deleting comment:", error);
    }
    throw error; // Rethrow error so it can be handled in the component
  }
};

// Update a comment
const updateComment = async (commentId: string, updatedCommentData: { comment: string }, abortSignal?: AbortSignal) => {
  const abortController = new AbortController();
  try {
    const response = await apiClient.put<Comment>(`/comments/${commentId}`, {
      comment: updatedCommentData.comment, // Updated comment content
    }, {
      signal: abortSignal || abortController.signal // Use passed abort signal or create a new one
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request aborted');
    } else {
      console.error("Error updating comment:", error);
    }
    throw error; // Rethrow error so it can be handled in the component
  }
};

// Update Many Comments by Owner (username only)
const updateCommentsByOwner = (id: string, username: string) => {
  const abortController = new AbortController();
  const request = apiClient.put(`/comments/update/${id}`, { username }, { signal: abortController.signal });
  return { request, abort: () => abortController.abort() };
};

export default { getCommentsByPostId, createComment, deleteComment, updateComment, updateCommentsByOwner };
