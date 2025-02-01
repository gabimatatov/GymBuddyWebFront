import { useEffect, useState } from "react";
import postService, { Post, CanceledError } from "../../services/post-service";
import styles from './Posts.module.css';
import { FaFire, FaRegComment } from "react-icons/fa";

const DEFAULT_IMAGE = "/GymBuddyLogo.png";

// Utility function to format the date
const formatDate = (date: string | number | Date) => {
  const validDate = new Date(date);
  if (isNaN(validDate.getTime())) return "Invalid date";

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  return validDate.toLocaleDateString('en-US', options);
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = postService.getAllPosts();

    request
      .then((response) => {
        const sortedPosts = response.data.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
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
            <div key={post._id} className={styles["post-container"]}>
              {/* Post Header */}
              <div className={styles["post-header"]}>
                <div className={styles["post-owner"]}>{post.owner}</div>
                <div className={styles["post-date"]}>
                  {formatDate(post.createdAt)}
                </div>
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
                <FaRegComment
                  className={styles["comment-icon"]}
                  onClick={() => console.log("Comment clicked")}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
