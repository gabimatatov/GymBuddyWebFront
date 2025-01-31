import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      {/* Left side: Logo */}
      <div className={styles.logo}>
        <Link to="/posts"> {/* Redirect to Home (Posts) */}
          <img src="/GymBuddyLogo.png" alt="App Logo" />
        </Link>
      </div>

      {/* Center links */}
      <ul className={styles.navLinks}>
        <li>
          <Link to="/home" className={location.pathname === '/home' ? styles.active : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/posts" className={location.pathname === '/posts' ? styles.active : ''}>
            Posts
          </Link>
        </li>
        <li>
          <Link to="/chat" className={location.pathname === '/chat' ? styles.active : ''}>
            Chat
          </Link>
        </li>
      </ul>

      {/* Right side: Login & Register */}
      <ul className={styles.authLinks}>
        <li>
          <Link to="/login" className={location.pathname === '/login' ? styles.active : ''}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" className={location.pathname === '/register' ? styles.active : ''}>
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
