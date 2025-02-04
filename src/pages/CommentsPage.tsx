// src/pages/CommentsPage.tsx
import { useParams } from "react-router-dom";
import { useState } from "react";
import Comments from "../components/Comments/Comments";
import Navbar from "../components/Navbar/Navbar";
import CommentForm from "../components/CommentForm/CommentForm";

const CommentsPage: React.FC = () => {
  const { postId } = useParams(); // Get the postId from the URL params
  const [refreshKey, setRefreshKey] = useState(0); // To trigger a re-fetch of comments

  const handleAddComment = (newComment: { comment: string; postId: string; username: string }) => {
    console.log("New Comment Data:", newComment);

    // After successfully adding the comment, trigger a refresh
    setRefreshKey((prev) => prev + 1); // Trigger re-fetch of comments
  };

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "7rem"}}>
        <Comments postId={postId!} key={refreshKey} />
        <CommentForm postId={postId!} onSubmit={handleAddComment} />
      </div>
    </div>
  );
};

export default CommentsPage;
