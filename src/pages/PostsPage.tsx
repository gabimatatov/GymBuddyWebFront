import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Posts from "../components/Posts/Posts";
import styles from './PostsPage.module.css';

const PostsPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.postsPageWrapper}>
      <Navbar />
      <div className={styles.postsContainer}>
        <Posts />
      </div>
    </div>
  );
};

export default PostsPage;
