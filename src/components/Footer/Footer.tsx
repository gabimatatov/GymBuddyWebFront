import React from "react";
import styles from './footer.module.css'; // Import CSS module styles

const Footer: React.FC = () => {
  return (
    <div className={styles['login-page-footer-container']}>
      <footer className={styles.footer}>
        <p>2025 GymBuddy. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Footer;
