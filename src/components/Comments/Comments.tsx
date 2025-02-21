import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import commentService, { Comment } from "../../services/comment-service";
import styles from "./Comments.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

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

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
  const [editedComment, setEditedComment] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const { request, abort } = commentService.getCommentsByPostId(postId);

    request
      .then((response) => {
        const sortedComments = response.data.sort(
          (a, b) =>
            new Date(b.createdAt as unknown as string).getTime() -
            new Date(a.createdAt as unknown as string).getTime()
        );

        setComments(sortedComments);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          setError(error.message);
        }
        setIsLoading(false);
      });

    return () => abort();
  }, [postId]);

  // Handle delete comment
  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setModalVisible(true);
  };

  const confirmDelete = () => {
    if (commentToDelete) {
      commentService.deleteComment(commentToDelete)
        .then(() => {
          // Remove the deleted comment from state
          setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentToDelete));
          setModalVisible(false);
        })
        .catch((error) => {
          console.error("Error deleting comment:", error);
          setError("An error occurred while deleting the comment.");
          setModalVisible(false);
        });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  // Toggle edit mode
  const toggleEditMode = (commentId: string, commentText: string) => {
    setEditMode((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
    setEditedComment((prev) => ({ ...prev, [commentId]: commentText }));
  };

  // Handle input change
  const handleCommentChange = (commentId: string, value: string) => {
    setEditedComment((prev) => ({ ...prev, [commentId]: value }));
  };

  // Handle update
  const handleUpdateComment = (commentId: string) => {
    const updatedComment = editedComment[commentId];

    commentService.updateComment(commentId, { comment: updatedComment })
      .then((updatedCommentData) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? { ...comment, comment: updatedCommentData.comment } : comment
          )
        );
        setEditMode((prev) => ({ ...prev, [commentId]: false }));
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
        setError("An error occurred while updating the comment.");
      });
  };

  if (isLoading) return <p className={styles["loading-text"]}>Loading comments...</p>;
  if (error) return <p className={styles["error-text"]}>Error: {error}</p>;

  return (
    <div className={styles["comments-container"]}>
      {comments.length === 0 ? (
        <p className={styles["no-comments-text"]}>No comments yet.</p>
      ) : (
        <div className={styles["comments-list"]}>
          {comments.map((comment) => (
            <div key={comment._id} className={styles["comment-item"]}>
              <div className={styles["comment-header"]}>
                <div className={styles["comment-left"]}>
                  <div className={styles["comment-owner"]}>{comment.username}</div>
                  {user?.username === comment.username && (
                    <div className={styles["comment-actions"]}>
                      <button className={styles["edit-button"]} onClick={() => toggleEditMode(comment._id, comment.comment)}>
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                      <button
                        className={styles["delete-button"]}
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  )}
                </div>
                <div className={styles["comment-date"]}>
                  {formatDate(comment.createdAt as unknown as string)}
                </div>
              </div>
              {editMode[comment._id] ? (
                <div className={styles["comment-content"]}>
                  <textarea
                    value={editedComment[comment._id] || ""}
                    onChange={(e) => handleCommentChange(comment._id, e.target.value)}
                    className={styles["comment-edit-input"]}
                  />
                  <div className={styles["comment-edit-actions"]}>
                    <button
                      className={styles["save-button"]}
                      onClick={() => handleUpdateComment(comment._id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles["comment-content"]}>{comment.comment}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalVisible && (
        <div className={`${styles["modal-overlay"]} ${modalVisible ? styles.show : ""}`}>
          <div className={`${styles["modal-container"]} ${modalVisible ? styles.show : ""}`}>
            <div className={styles["modal-title"]}>Are you sure you want to delete this comment?</div>
            <div className={styles["modal-buttons"]}>
              <button className={`${styles["modal-button"]} ${styles.cancel}`} onClick={cancelDelete}>Cancel</button>
              <button className={`${styles["modal-button"]} ${styles.confirm}`} onClick={confirmDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
