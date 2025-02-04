import { useState } from "react";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import commentService from "../../services/comment-service";
import styles from './CommentForm.module.css';

interface CommentFormProps {
  postId: string;
  onSubmit: (commentData: { comment: string; postId: string; username: string }) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSubmit }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    setError("");

    const commentData = {
      comment,
      postId,
      username: typeof user?.username === "string" ? user.username : "Anonymous", // Ensure username is a string
    };

    try {
      const createdComment = await commentService.createComment(commentData);
      console.log("Created Comment:", createdComment);
      onSubmit({
        comment: createdComment.comment,
        postId: createdComment.postId,
        username: typeof createdComment.username === "string" ? createdComment.username : "Anonymous",
      });
      setComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleAddComment} className={styles.form}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts..."
            className={styles.input}
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default CommentForm;
