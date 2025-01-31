import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Import Navbar
import Posts from "../components/Posts/Posts";
import Footer from "../components/Footer/Footer";

const PostsPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div>  
        <Posts />
      </div>
      <Footer />
    </div>
  );
};

export default PostsPage;
