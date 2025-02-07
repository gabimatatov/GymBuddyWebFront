import apiClient, { CanceledError } from "./api-client";

export { CanceledError };

export interface ChatMessage {
  content: string;
  owner: string;
  username: string;
}

// Create a chat message
const createChatMessage = (chatData: { content: string; username: string }) => {
  const abortController = new AbortController();
  const request = apiClient.post("/chat", chatData, { signal: abortController.signal });
  
  return { request, abort: () => abortController.abort() };
};

export default { createChatMessage };
