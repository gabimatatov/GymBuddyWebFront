/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../hooks/useAuth/AuthContext";
import styles from "./ProfileForm.module.css";
import userService from '../../services/auth_service';
import Posts from "../Posts/Posts";

interface FormData {
    username?: string;
    avatar?: FileList;
}

const ProfileForm: FC = () => {
    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { register, handleSubmit, setValue } = useForm<FormData>();
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { user, updateUserSession } = useAuth();

    // Get User Data
    useEffect(() => {
        if (user) {
            try {
                console.log(user); // To Delete
                setValue("username", user.username);
                setPreviewImage(user.avatar ? `http://localhost:3000${user.avatar}` : null);
            } catch (error) {
                console.error("Error parsing user cookie:", error);
            }
        }
    }, [setValue, user]);

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
    const onSubmit = async (data: FormData) => {
        // Reset server messages before submitting
        setServerError(null);
        setSuccessMessage(null);

        let updatedAvatar = user?.avatar || "";

        if (data.avatar?.[0]) {
            try {
                // Step 1: Upload the image to the server
                const { request: uploadRequest } = userService.uploadImage(data.avatar[0]);
                const uploadResponse = await uploadRequest;
                console.log('Image uploaded:', uploadResponse.data);

                // Step 2: Extract the relative URL from the server's response
                updatedAvatar = new URL(uploadResponse.data.url).pathname;

            } catch (error: any) {
                setServerError(error.response?.data?.message || 'An error occurred while uploading image');
                return;
            }
        }

        // Step 3: Now, send the updated data (including username and avatar URL) to update the user profile
        const updatedUserData = {
            ...(data.username !== user?.username && { username: data.username }),
            ...(updatedAvatar !== user?.avatar && { avatar: updatedAvatar }),
        };
        
        if (Object.keys(updatedUserData).length === 0) {
            setSuccessMessage("No changes detected.");
            return;
        }

        try {
            // Update the user profile with new data
            const { request: updateRequest } = await userService.updateUser(updatedUserData);
            const updateResponse = await updateRequest;

            console.log('Profile update response:', updateResponse.data);

            updateUserSession(updateResponse.data)
            setSuccessMessage("Profile updated successfully!");
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'An error occurred while updating profile');
        }
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

            {/* Scrollable My Posts Container */}
            <div className={styles["scrollable-grid-container"]}>
                {/* <Posts /> */}
                <Posts id={user?._id} />
            </div>

        </div>
    );
};

export default ProfileForm;
