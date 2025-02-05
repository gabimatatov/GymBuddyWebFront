import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaRegComment } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import styles from "./Post.module.css";

interface PostProps {
  post: {
    _id: string;
    username: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
  };
  commentsCount: number;
  onUpdate: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({ post, commentsCount, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const formatDate = (date: string) => {
    const validDate = new Date(date);

    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return validDate.toLocaleString("en-US", options);
  };

  const handleDelete = async () => {
    if (postToDelete && !loading) {
      try {
        setLoading(true);
        onDelete(postToDelete);
        setModalVisible(false);
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const showDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <div className={styles["post-container"]}>
      {/* Post Header */}
      <div className={styles["post-header"]}>
        <div className={styles["post-owner"]}>{post.username}</div>
        <div className={styles["post-date"]}>{formatDate(post.createdAt)}</div>
      </div>

      {/* Post Image */}
      <img
        src={post.image || "GymBuddyLogo.png"}
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
          <span className={styles["comment-count"]}>{commentsCount}</span>
        </div>

        {/* Update and Delete buttons */}
        {user?.username === post.username && (
          <div className={styles["post-actions-buttons"]}>
            <button className={styles["btn-update-post"]} onClick={() => onUpdate(post._id)}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            <button
              className={styles["btn-delete-post"]}
              onClick={() => showDeleteModal(post._id)}
              disabled={loading} // Disable button while deleting
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {modalVisible && (
        <div className={`${styles["modal-overlay"]} ${modalVisible ? styles.show : ""}`}>
          <div className={`${styles["modal-container"]} ${modalVisible ? styles.show : ""}`}>
            <div className={styles["modal-title"]}>Are you sure you want to delete this post?</div>
            <div className={styles["modal-buttons"]}>
              <button className={`${styles["modal-button"]} ${styles.cancel}`} onClick={cancelDelete}>
                Cancel
              </button>
              <button
                className={`${styles["modal-button"]} ${styles.confirm}`}
                onClick={handleDelete}
                disabled={loading} // Disable confirm button while deleting
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
