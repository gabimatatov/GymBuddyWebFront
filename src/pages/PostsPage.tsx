import React from "react";
import Navbar from "../components/Navbar/Navbar"; // Import Navbar
import Posts from "../components/Posts/Posts";
import Footer from "../components/Footer/Footer";

const PostsPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "140px" }}>  {/* Adjust this value depending on Navbar height */}
        <Posts />
      </div>
      <Footer />
    </div>
  );
};

export default PostsPage;
