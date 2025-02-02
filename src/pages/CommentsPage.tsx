import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Get postId from URL
import Navbar from "../components/Navbar/Navbar"; // Import Navbar
import Comments from "../components/Comment/Comments"; // Import Comments component
import commentService, { Comment as CommentType } from "../services/comment-service";

const CommentsPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>(); // Extract postId from URL
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const { request, abort } = commentService.getCommentsByPostId(postId);

    request
      .then((response) => {
        setComments(response.data);
        setIsLoading(false);
      })

      .catch((error) => {
        setError("Error fetching comments:" + error.message);
        setIsLoading(false);
      });

    return abort;
  }, [postId]);

  return (
    <div>
      <Navbar />
      <div>
        {isLoading ? (
          <p>Loading comments...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <Comments comments={comments} />
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
