import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      {/* Left side: Logo */}
      <div className={styles.logo}>
        <Link to="/profile"> {/* Redirect to Home (Posts) */}
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
          <Link to="/chat" className={location.pathname === '/chat' ? styles.active : ''}>
            Chat
          </Link>
        </li>
      </ul>

      {/* Right side: Logout (Redirects to Login) */}
      <ul className={styles.authLinks}>
        <li>
          <Link to="/login" className={styles.logout}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
