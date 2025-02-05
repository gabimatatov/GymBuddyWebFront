import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../hooks/useAuth/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleLogoutClick = () => {
    setModalVisible(true);
  };

  const cancelLogout = () => {
    setModalVisible(false);
  };

  const confirmLogout = async () => {
    try {
      logout();
      setModalVisible(false);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      {/* Left side: Logo */}
      <div className={styles.logo}>
        <Link to="/profile">
          <img src="/GymBuddyLogo.png" alt="App Logo" />
        </Link>
      </div>

      {/* Center links */}
      <ul className={styles.navLinks}>
        <li>
          <Link to="/profile" className={location.pathname === '/profile' ? styles.active : ''}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/posts" className={location.pathname === '/posts' ? styles.active : ''}>
            Explore
          </Link>
        </li>
        <li>
          <Link to="/share" className={location.pathname === '/share' ? styles.active : ''}>
            Share
          </Link>
        </li>
        <li>
          <Link to="/chat" className={location.pathname === '/chat' ? styles.active : ''}>
            Chat
          </Link>
        </li>
      </ul>

      {/* Right side: Logout */}
      <ul className={styles.authLinks}>
        <li>
          <button onClick={handleLogoutClick} className={`${styles.logout} ${styles.log}`}>
            Logout
          </button>
        </li>
      </ul>

      {/* Logout Confirmation Modal */}
      {modalVisible && (
        <div className={`${styles["modal-overlay"]} ${modalVisible ? styles.show : ""}`}>
          <div className={`${styles["modal-container"]} ${modalVisible ? styles.show : ""}`}>
            <div className={styles["modal-title"]}>Are you sure you want to logout?</div>
            <div className={styles["modal-buttons"]}>
              <button className={`${styles["modal-button"]} ${styles.cancel}`} onClick={cancelLogout}>Cancel</button>
              <button className={`${styles["modal-button"]} ${styles.confirm}`} onClick={confirmLogout}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
