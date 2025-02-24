import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import CreatePostForm from "../components/CreatePostForm/CreatePostForm";

const SharePage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/ui/login" />;
  }


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
