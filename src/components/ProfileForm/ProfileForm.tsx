import { FC, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import styles from './ProfileForm.module.css';

interface User {
  username: string;
  email: string;
  avatar?: string;
}

const ProfileForm: FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }
  }, []);

  return (
    <div className={styles["form-container-profile"]}>
      <div className={styles["logo-container-profile"]}>
        <img src="GymBuddyLogo.png" alt="Logo" className={styles["logo-profile"]} />
      </div>
      <div className={styles["form-profile"]}>
        <div className={styles["form-input-profile"]}>
          <label className={styles["form-label-profile"]}>Username</label>
          <input
            type="text"
            className={styles["form-control-profile"]}
            value={user?.username || ''}
            readOnly
          />
        </div>

        <div className={styles["form-input-profile"]}>
          <label className={styles["form-label-profile"]}>Email</label>
          <input
            type="email"
            className={styles["form-control-profile"]}
            value={user?.email || ''}
            readOnly
          />
        </div>

        <div className={styles["form-input-profile"]} style={{ textAlign: 'center' }}>
          <label className={styles["form-label-profile"]}>Avatar</label>
          <div>
            <img
              src={user?.avatar ? `http://localhost:3000${user.avatar}` : 'default-avatar.png'}
              alt="User Avatar"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ccc',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;