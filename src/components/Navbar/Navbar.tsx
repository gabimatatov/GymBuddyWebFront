import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../hooks/useAuth/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      logout();

      // After logout, redirect to login page
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

      {/* Right side: Logout (Redirects to Login) */}
      <ul className={styles.authLinks}>
        <li>
          <button onClick={handleLogout} className={`${styles.logout} ${styles.log}`}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
