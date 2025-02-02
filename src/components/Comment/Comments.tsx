import React from "react";
import { Comment as CommentType } from "../../services/comment-service";
import styles from "./Comments.module.css"; // Create a CSS file for styling

interface CommentsProps {
  comments: CommentType[];
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  return (
    <div className={styles["comments-container"]}>
      <h2>Comments</h2>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className={styles["comment"]}>
            <strong>{comment.owner}</strong>
            <p>{comment.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
