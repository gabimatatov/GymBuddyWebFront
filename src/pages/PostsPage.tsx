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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h1 style={{
            marginBottom: '15px',
            marginTop: '0px'
          }}>Welcome to the GymBuddy Community!</h1>
          <p style={{
            marginTop: '0px',
          }}>
            Connect with fellow fitness enthusiasts, share your progress, and stay motivated!
            <br />
            Post your workouts, ask questions, and support each other on your fitness journey.
          </p>
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default PostsPage;
