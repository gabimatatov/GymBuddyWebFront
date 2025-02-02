import { useEffect, useState } from "react";
import postService, { Post as PostType, CanceledError } from "../../services/post-service";
import Post from "../Post/Post"; // Import Post component
import styles from "./Posts.module.css";

const Posts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = postService.getAllPosts();

    request
      .then((response) => {
        const sortedPosts = response.data.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setPosts(sortedPosts);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          setError(error.message);
          setIsLoading(false);
        }
      });

    return abort;
  }, []);

  if (isLoading) return <p className={styles["loading-text"]}>Loading posts...</p>;
  if (error) return <p className={styles["error-text"]}>Error: {error}</p>;

  return (
    <div className={styles["posts-container"]}>
      {posts.length === 0 ? (
        <p className={styles["no-posts-text"]}>No posts available</p>
      ) : (
        <div className={styles["posts-grid"]}>
          {posts.map((post) => (
            <Post key={post._id} post={{ ...post, createdAt: new Date(post.createdAt).toISOString() }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
