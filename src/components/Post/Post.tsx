import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFire, FaRegComment } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import styles from "./Post.module.css";
import likesService from "../../services/likes-service";

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
  const [isLiked, setIsLiked] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (user?._id) {
        try {
          const { request: likedRequest } = likesService.getLikeByOwner(post._id, user._id);
          const likedResponse = await likedRequest;

          // Set isLiked state this post
          setIsLiked((prev) => {
            console.log("Previous state:", prev);
            console.log("New state:", likedResponse.data.liked);
            return likedResponse.data.liked;
          });

        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      }
    };

    fetchLikeStatus();
  }, [user, post._id]);  // Re-run if user or post._id changes

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

  const handleLike = async (postId: string) => {
    try {
      if (isLiked) {
        await likesService.DeleteLike(postId);
        setIsLiked(false);
        console.log("Like removed successfully!");
      } else {
        await likesService.CreateLike(postId);
        setIsLiked(true);
        console.log("Like added successfully!");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
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
        src={post.image && post.image !== 'none' ? `http://localhost:3000${post.image}` : "GymBuddyLogo.png"}
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
        <FaFire className={styles["fire-icon"]} onClick={() => handleLike(post._id)} style={{ color: isLiked ? "#ff4500" : "" }}/>

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
              disabled={loading}
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
