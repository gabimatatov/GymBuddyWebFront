import React from "react";
import Navbar from "../components/Navbar/Navbar";
import UpdatePostForm from "../components/UpdatePostForm/UpdatePostForm";

const UpdatePostPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>
        <UpdatePostForm />
      </div>
    </div>
  );
};

export default UpdatePostPage;