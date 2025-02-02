import { FC, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
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
        <form className={styles["user-details-container"]} action="">
            <h2 style={{ alignSelf: 'center' }}>My Profile</h2>
            <div>
                <div className={styles["user-details"]}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <div className={styles["avatar-container"]}>
                            {/* Avatar Profile */}
                            <img
                                src={user?.avatar ? `http://localhost:3000${user.avatar}` : '/public/trainerIcon.png'}
                                alt="User Avatar"
                                className={styles["avatar-image-profile"]}
                            />
                            <div className={styles["avatar-buttons"]}>
                                <button className={styles["btn-add-image-register"]}>
                                    <FontAwesomeIcon icon={faImage} className={styles["fa-l"]} />
                                </button>
                                <button className={styles["btn-remove-image-register"]}>
                                    <FontAwesomeIcon icon={faTrashAlt} className={styles["fa-l"]} />
                                </button>
                            </div>
                        </div>


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
                    </div>
                </div>
                {/* Separate Line */}
                <div className={styles["separate-line"]}></div>


            </div>
            {/* Update Username input */}
            <div className={styles["form-input-profile"]}>
                <label htmlFor="username" className={styles["form-label-profile"]}>Username</label>
                <input
                    type="text"
                    className={styles["form-control-update-profile"]}
                    id="username"
                    placeholder={user?.username}
                />


                {/* 
                TODO: 1. Add form validation
                2. Add Submit Button
                3. Add Ref to Update new Image - (Image Logic)
                4. Updated User Interface
                5. Backend UpdateUser
                6. General Styling
             */}
            </div>
            {/* Separate Line */}
            <div className={styles["separate-line"]}></div>
        </form>

    );
};

export default ProfileForm;