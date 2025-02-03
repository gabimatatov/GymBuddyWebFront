import { Link } from "react-router-dom"; // Import Link from react-router-dom
import styles from "./Post.module.css";
import { FaFire, FaRegComment } from "react-icons/fa";

const DEFAULT_IMAGE = "/GymBuddyLogo.png";

// Utility function to format the date
const formatDate = (date: string | number | Date) => {
  const validDate = new Date(date);
  if (isNaN(validDate.getTime())) return "Invalid date";

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return validDate.toLocaleDateString("en-US", options);
};

// Define post type
interface PostProps {
  post: {
    _id: string;
    owner: string;
    username: string;
    title: string;
    content: string;
    image?: string;
    createdAt: string | number | Date; // Allowing string, number, or Date for createdAt
  };
  commentsCount: number; // Add commentsCount property
}

const Post: React.FC<PostProps> = ({ post, commentsCount }) => {
  return (
    <div className={styles["post-container"]}>
      {/* Post Header */}
      <div className={styles["post-header"]}>
        <div className={styles["post-owner"]}>{post.username}</div>
        <div className={styles["post-date"]}>{formatDate(post.createdAt)}</div>
      </div>
      {/* Post Image */}
      <img
        src={post.image || DEFAULT_IMAGE}
        alt={post.title}
        className={styles["post-image"]}
      />
      {/* Post Title */}
      <h2 className={styles["post-title"]}>{post.title}</h2>
      {/* Post Content */}
      <div className={styles["post-details-wrapper"]}>
        <div className={styles["post-details"]}>
          <p className={styles["post-content"]}>{post.content}</p>
        </div>
      </div>
      {/* Post Actions */}
      <div className={styles["post-actions"]}>
        <FaFire className={styles["fire-icon"]} onClick={() => console.log("Like clicked")} />
        <div className={styles["comment-container"]}>
          <Link to={`/post/${post._id}/comments`} className={styles["comment-link"]}>
            <FaRegComment className={styles["comment-icon"]} />
          </Link>
          <span className={styles["comment-count"]}>{commentsCount}</span> {/* Use commentsCount */}
        </div>
      </div>
    </div>
  );
};

export default Post;
