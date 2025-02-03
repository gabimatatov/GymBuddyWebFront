import { useParams } from "react-router-dom";
import Comments from "../components/Comments/Comments";
import Navbar from "../components/Navbar/Navbar";

const CommentsPage: React.FC = () => {
  const { postId } = useParams(); // Get the postId from the URL params

  return (
    <div>
        <Navbar/>
    <div style={{ marginTop: "10rem" }}>
        <Comments postId={postId!} />
    </div>
    </div>
  );
};

export default CommentsPage;
