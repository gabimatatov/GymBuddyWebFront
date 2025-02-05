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
  const { user } = useAuth(); // Access the logged-in user
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null); // Store post ID for deletion

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const handleDelete = () => {
    if (postToDelete) {
      onDelete(postToDelete);
      setModalVisible(false);
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

        {/* Conditionally render Update and Delete buttons if the logged-in user is the post's owner */}
        {user?.username === post.username && (
          <div className={styles["post-actions-buttons"]}>
            <button className={styles["btn-update-post"]} onClick={() => onUpdate(post._id)}>
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            <button
              className={styles["btn-delete-post"]}
              onClick={() => showDeleteModal(post._id)}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {modalVisible && (
        <div className={`${styles["modal-overlay"]} ${modalVisible ? styles.show : ""}`}>
          <div className={`${styles["modal-container"]} ${modalVisible ? styles.show : ""}`}>
            <div className={styles["modal-title"]}>Are you sure you want to delete this post?</div>
            <div className={styles["modal-buttons"]}>
              <button className={`${styles["modal-button"]} ${styles.cancel}`} onClick={cancelDelete}>
                Cancel
              </button>
              <button className={`${styles["modal-button"]} ${styles.confirm}`} onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
