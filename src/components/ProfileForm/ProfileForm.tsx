import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import styles from "./ProfileForm.module.css";

interface User {
    username: string;
    email: string;
    avatar?: string;
}

interface FormData {
    username: string;
    avatar?: FileList;
}

const ProfileForm: FC = () => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const { register, handleSubmit, setValue } = useForm<FormData>();
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = Cookies.get("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setValue("username", parsedUser.username);
                setPreviewImage(parsedUser.avatar ? `http://localhost:3000${parsedUser.avatar}` : null);
            } catch (error) {
                console.error("Error parsing user cookie:", error);
            }
        }
    }, [setValue]);

    // Handle file selection and update the preview image
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setValue("avatar", event.target.files);
        }
    };

    // Handle file removal (clear input and preview)
    const handleRemoveFile = () => {
        if (inputFileRef.current) {
            inputFileRef.current.value = "";
        }
        setPreviewImage(user?.avatar ? `http://localhost:3000${user.avatar}` : null);
        setValue("avatar", undefined);
    };

    // Submit Form Function
    const onSubmit = (data: FormData) => {
        // Reset server messages before submitting
        setServerError("exmaple");
        // setSuccessMessage("examle");

        const updatedAvatar = data.avatar?.[0]
            ? URL.createObjectURL(data.avatar[0])
            : user?.avatar || "";

        console.log("Updated User Data:", {
            username: data.username,
            avatarUrl: updatedAvatar,
        });
    };

    return (
        <div className={styles["user-details-container"]}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 style={{ textAlign: "center", margin: "1px" }}>My Profile</h2>
                <div>
                    <div className={styles["user-details"]}>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <div className={styles["avatar-container"]}>

                                {/* Display the selected image or fallback to the stored avatar */}
                                <img
                                    src={previewImage || "/public/trainerIcon.png"}
                                    alt="User Avatar"
                                    className={styles["avatar-image-profile"]}
                                />
                                <div className={styles["avatar-buttons"]}>
                                    <button
                                        type="button"
                                        className={styles["btn-add-image-profile"]}
                                        onClick={() => inputFileRef.current?.click()}
                                    >
                                        <FontAwesomeIcon icon={faImage} className={styles["fa-l"]} />
                                    </button>
                                    <button
                                        type="button"
                                        className={styles["btn-remove-image-profile"]}
                                        onClick={handleRemoveFile}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} className={styles["fa-l"]} />
                                    </button>
                                </div>
                            </div>

                            {/* Hidden file input */}
                            <input
                                ref={(e) => {
                                    register("avatar");
                                    inputFileRef.current = e;
                                }}
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />

                            {/* User Details */}
                            <div className={styles["user-info-profile"]}>
                                <div className={styles["form-input-profile"]}>
                                    <label className={styles["form-label-profile"]}>Username:</label>
                                    <input
                                        type="text"
                                        className={styles["form-control-profile"]}
                                        value={user?.username || ""}
                                        readOnly
                                    />
                                </div>
                                <div className={styles["form-input-profile"]}>
                                    <label className={styles["form-label-profile"]}>Email: </label>
                                    <input type="email" className={styles["form-control-profile"]} value={user?.email || ""} readOnly />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separate Line */}
                    <div className={styles["separate-line"]}></div>
                </div>

                {/* Update username input */}
                <div className={styles["form-input-update-profile "]}>
                    <label htmlFor="username" className={styles["form-label-profile"]}>Username</label>
                    <input
                        type="text"
                        id="username"
                        className={styles["form-control-update-profile"]}
                        placeholder="Update your username"
                        {...register("username")}
                    />
                </div>

                {serverError && <div className={`${styles["alert-profile"]} ${styles["alert-danger-profile"]}`}>{serverError}</div>}
                {successMessage && <div className={`${styles["alert-profile"]} ${styles["alert-success-profile"]}`}>{successMessage}</div>}

                {/* Submit Button */}
                <button type="submit" className={styles["btn-edit-profile"]}>
                    Save Changes
                </button>
            </form>

            {/* Separate Line */}
            <div className={styles["separate-line"]}></div>

            {/* Scrollable Grid Container */}
            <div className={styles["scrollable-grid-container"]}>
                <div className={styles["grid"]}>
                    {Array.from({ length: 15 }).map((_, index) => (
                        <div key={index} className={styles["grid-item"]}></div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProfileForm;
