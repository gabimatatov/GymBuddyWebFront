import apiClient, { CanceledError } from "./api-client"

export { CanceledError }

export interface Post {
    _id: string,
    title: string,
    content: string,
    owner: string,
    image: string,
    date: string // Add the date property (assuming it's a string, or you can change it to Date if you prefer)
}

const getAllPosts = () => {
    const abortController = new AbortController()
    const request = apiClient.get<Post[]>("/posts", { signal: abortController.signal })
    return { request, abort: () => abortController.abort() }
}

export default { getAllPosts }
