import { useEffect, useState } from "react";
import postService, { Post as PostType, CanceledError } from "../../services/post-service";
import commentService from "../../services/comment-service";
import Post from "../Post/Post";
import styles from "./Posts.module.css";

interface PostsProps {
  id?: string;
}

const Posts = ({ id }: PostsProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [commentsCount, setCommentsCount] = useState<{ [postId: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = id
      ? postService.getAllPostsByOwner(id)
      : postService.getAllPosts();

    request
      .then((response) => {
        const sortedPosts = response.data.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(sortedPosts);

        const initialCommentCounts = sortedPosts.reduce((acc, post) => {
          acc[post._id] = 0;
          return acc;
        }, {} as { [postId: string]: number });

        setCommentsCount(initialCommentCounts);

        const commentPromises = sortedPosts.map(async (post) => {
          try {
            const { request: commentRequest } = commentService.getCommentsByPostId(post._id);
            const commentResponse = await commentRequest;
            const comments = commentResponse.data;

            setCommentsCount((prev) => ({
              ...prev,
              [post._id]: Array.isArray(comments) && comments.length > 0 ? comments.length : 0,
            }));
          } catch (error) {
            console.error(`Error fetching comments for post ${post._id}:`, error);
            setCommentsCount((prev) => ({
              ...prev,
              [post._id]: 0,
            }));
          }
        });

        Promise.all(commentPromises).then(() => {
          setIsLoading(false);
        });
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          setError(error.message);
          setIsLoading(false);
        }
      });

    return abort;
  }, [id]);

  if (isLoading) return <p className={styles["loading-text"]}>Loading posts...</p>;
  if (error) return <p className={styles["error-text"]}>Error: {error}</p>;

  return (
    <div className={styles["posts-container"]}>
      {posts.length === 0 ? (
        <p className={styles["no-posts-text"]}>No posts yet</p>
      ) : (
        <div className={styles["posts-grid"]}>
          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              commentsCount={commentsCount[post._id] ?? 0} // Pass the comment count
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
