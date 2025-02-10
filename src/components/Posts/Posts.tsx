import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postService, { Post as PostType, CanceledError } from "../../services/post-service";
import commentService from "../../services/comment-service";
import Post from "../Post/Post";
import styles from "./Posts.module.css";

interface PostsProps {
  id?: string;
}

const Posts = ({ id }: PostsProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [commentsCount, setCommentsCount] = useState<{ [postId: string]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"date_desc" | "date_asc" | "likes">("date_desc"); // Default: Newest first
  const navigate = useNavigate();

  useEffect(() => {
    const { request, abort } = id
      ? postService.getAllPostsByOwner(id)
      : postService.getAllPosts();

    request
      .then((response) => {
        const sortedPosts = [...response.data];

        sortedPosts.sort((a, b) => {
          if (sortOrder === "date_desc") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          } else if (sortOrder === "date_asc") {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          } else if (sortOrder === "likes") {
            return b.likesCount - a.likesCount; // Sort by most likes
          }
          return 0;
        });

        setPosts(sortedPosts);

        const initialCommentCounts = sortedPosts.reduce((acc, post) => {
          acc[post._id] = 0;
          return acc;
        }, {} as { [postId: string]: number });

        setCommentsCount(initialCommentCounts);

        const commentPromises = sortedPosts.map(async (post) => {
          try {
            const { request: commentRequest } = commentService.getCommentsByPostId(post._id);
            const commentResponse = await commentRequest;
            const comments = commentResponse.data;

            setCommentsCount((prev) => ({
              ...prev,
              [post._id]: Array.isArray(comments) && comments.length > 0 ? comments.length : 0,
            }));
          } catch (error) {
            console.error(`Error fetching comments for post ${post._id}:`, error);
            setCommentsCount((prev) => ({
              ...prev,
              [post._id]: 0,
            }));
          }
        });

        Promise.all(commentPromises).then(() => {
          setIsLoading(false);
        });
      })
      .catch((error) => {
        if (!(error instanceof CanceledError)) {
          setError(error.message);
          setIsLoading(false);
        }
      });

    return abort;
  }, [id, sortOrder]); // Re-run effect when sortOrder changes

  if (isLoading) return <p className={styles["loading-text"]}>Loading posts...</p>;
  if (error) return <p className={styles["error-text"]}>Error: {error}</p>;

  const handleUpdate = (postId: string) => {
    console.log(`Update post with ID: ${postId}`);
    navigate(`/update-post/${postId}`);
  };

  const handleDelete = async (postId: string) => {
    try {
      await postService.deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setCommentsCount((prev) => {
        const updatedCounts = { ...prev };
        delete updatedCounts[postId];
        return updatedCounts;
      });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className={styles["posts-container"]}>
      {/* Sorting Filter */}
      <div className={styles["filter-container"]}>
        <label htmlFor="sortOrder">Sort by:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "date_desc" | "date_asc" | "likes")}
          className={styles["sort-dropdown"]}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="likes">Most Likes</option>
        </select>
      </div>

      {posts.length === 0 ? (
        <p className={styles["no-posts-text"]}>No posts yet</p>
      ) : (
        <div className={styles["posts-grid"]}>
          {posts.map((post) => (
            <Post
              key={post._id}
              post={{
                ...post,
                createdAt: new Date(post.createdAt).toISOString(),
              }}
              commentsCount={commentsCount[post._id] ?? 0}
              likesCount={post.likesCount}
              onUpdate={() => handleUpdate(post._id)}
              onDelete={() => handleDelete(post._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
