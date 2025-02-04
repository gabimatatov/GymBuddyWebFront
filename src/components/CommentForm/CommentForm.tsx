// src/components/CommentForm/CommentForm.tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import commentService from "../../services/comment-service"; // Import the comment service

interface CommentFormProps {
  postId: string; // Pass postId from parent component
  onSubmit: (commentData: { comment: string; postId: string; username: string }) => void; // Pass onSubmit function from parent
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSubmit }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState(""); // State for the comment
  const [isSubmitting, setIsSubmitting] = useState(false); // State for managing the submit button's disabled state
  const [error, setError] = useState<string>(""); // Error state for handling errors

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return; // Prevent submission if the comment is empty

    setIsSubmitting(true); // Disable button during submission
    setError(""); // Clear previous errors

    const commentData = {
      comment,
      postId,
      username: user?.username || "Anonymous", // Use username from auth context or default to "Anonymous"
    };

    try {
      // Use the commentService to create a new comment
      const createdComment = await commentService.createComment(commentData);
      
      console.log("Created Comment:", createdComment); // Log the created comment (you can remove this later)
      onSubmit(createdComment); // Pass the created comment back to parent component

      setComment(""); // Clear the input field after successful submission
    } catch (error) {
      console.error("Error creating comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false); // Enable button after submission attempt
    }
  };

  return (
    <div>
      <form onSubmit={handleAddComment} style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="comment-input"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error if any */}
    </div>
  );
};

export default CommentForm;
