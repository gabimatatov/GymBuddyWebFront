import { useEffect, useState } from "react";
import commentService, { Comment } from "../../services/comment-service";
import styles from "./Comments.module.css";

// Utility function to format the date (same as in Post component)
const formatDate = (date: unknown) => {
  if (!date) return "Unknown date"; // Handle missing date
  const validDate = new Date(date as string);
  if (isNaN(validDate.getTime())) return "Invalid date"; // Handle invalid dates

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { request, abort } = commentService.getCommentsByPostId(postId);

    request
      .then((response) => {
        // Sort comments by `createdAt` in descending order (latest first)
        const sortedComments = response.data.sort(
          (a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()
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
                <div className={styles["comment-owner"]}>{comment.owner}</div>
                <div className={styles["comment-date"]}>
                  {formatDate(comment.createdAt)}
                </div>
              </div>
              <div className={styles["comment-content"]}>{comment.comment}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
