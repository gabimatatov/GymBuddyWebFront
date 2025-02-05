import React from "react";
import Navbar from "../components/Navbar/Navbar";
import CreatePostForm from "../components/CreatePostForm/CreatePostForm";

const SharePage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>
      <CreatePostForm/>
      </div>
    </div>
  );
};

export default SharePage;
