import { useEffect, useState } from "react";
import postService, { Post, CanceledError } from "../services/post-service";
import styles from '../styles/Posts.module.css';
import { FaFire } from "react-icons/fa";

const DEFAULT_IMAGE = "/GymBuddyLogo.png";

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
              {/* Post Header */}
              <div className={styles["post-header"]}>
                <div className={styles["post-owner"]}>{post.owner}</div>
              </div>
              {/* Post Image */}
              <img
                src={post.image || DEFAULT_IMAGE}
                alt={post.title}
                className={styles["post-image"]}
              />
              {/* Post Content */}
              <div className={styles["post-details"]}>
                <p className={styles["post-title"]}>{post.title}</p>
                <p className={styles["post-content"]}>{post.content}</p>
              </div>
              {/* Post Actions */}
              <div className={styles["post-actions"]}>
                <FaFire
                  className={styles["fire-icon"]}
                  onClick={() => console.log("Like clicked")}
                />
                <button className={styles["action-button"]}>Comment</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
