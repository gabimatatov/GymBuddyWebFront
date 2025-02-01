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
                console.log(storedUser);
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing user cookie:', error);
            }
        }
    }, []);

    return (
        <div className={styles["user-details-container"]}>
            <div className={styles["user-details"]}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    {/* Avatar Profile */}
                    <img
                        src={user?.avatar ? `http://localhost:3000${user.avatar}` : '/public/trainerIcon.png'}
                        alt="User Avatar"
                        className={styles["avatar-image-profile"]}
                    />

                    {/* User Details */}
                    <div className={styles["user-info-profile"]}>
                        <div className={styles["form-input-profile"]}>
                            <label className={styles["form-label-profile"]}>Username:</label>
                            <input
                                type="text"
                                className={styles["form-control-profile"]}
                                value={user?.username || ''}
                                readOnly
                            />
                        </div>
                        <div className={styles["form-input-profile"]}>
                            <label className={styles["form-label-profile"]}>Email: </label>
                            <input
                                type="email"
                                className={styles["form-control-profile"]}
                                value={user?.email || ''}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Seperate Line */}
                </div>
            </div>
        </div>

    );
};

export default ProfileForm;