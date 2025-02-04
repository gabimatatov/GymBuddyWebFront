import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth/AuthContext"; // Import auth context
import commentService, { Comment } from "../../services/comment-service";
import styles from "./Comments.module.css";

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
  const { user } = useAuth(); // Get logged-in user
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = commentService.getCommentsByPostId(postId);

    request
      .then((response) => {
        const sortedComments = response.data.sort(
          (a, b) =>
            new Date(b.createdAt as string).getTime() -
            new Date(a.createdAt as string).getTime()
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
                <div className={styles["comment-owner"]}>{comment.username}</div>
                <div className={styles["comment-date"]}>
                  {formatDate(comment.createdAt as string)}
                </div>
              </div>
              <div className={styles["comment-content"]}>{comment.comment}</div>

              {/* Show buttons if the logged-in user is the comment's author */}
              {user?.username === comment.username && (
                <div className={styles["comment-actions"]}>
                  <button className={styles["edit-button"]}>Edit</button>
                  <button className={styles["delete-button"]}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
