import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Posts from "../components/Posts/Posts";
import styles from './PostsPage.module.css';

const PostsPage: React.FC = () => {
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
