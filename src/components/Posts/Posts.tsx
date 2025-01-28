import { useEffect, useState } from "react";
import postService, { Post, CanceledError } from "../../services/post-service";
import styles from "./Posts.module.css"; // Importing styles as a module

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = postService.getAllPosts();

    request
      .then((response) => {
        setPosts(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          setError(error.message);
          setIsLoading(false);
        }
      });

    return abort; // Cleanup on unmount or request cancellation
  }, []);

  if (isLoading) return <p className={styles["loading-text"]}>Loading posts...</p>;
  if (error) return <p className={styles["error-text"]}>Error: {error}</p>;

  return (
    <div className={styles["posts-container"]}>
      <h1 className={styles["page-title"]}>Posts</h1>
      {posts.length === 0 ? (
        <p className={styles["no-posts-text"]}>No posts available</p>
      ) : (
        <div className={styles["posts-grid"]}>
          {posts.map((post) => (
            <div key={post._id} className={styles["post-container"]}>
              <div className={styles["post-card"]}>
                <div className={styles["post-details"]}>
                  <p className={styles["post-title"]}>{post.title}</p>
                  <p className={styles["post-content"]}>{post.content}</p>
                  <p className={styles["post-owner"]}>
                    <strong>Owner:</strong> {post.owner}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
