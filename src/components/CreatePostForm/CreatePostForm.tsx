import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePostForm.module.css';
import postsService from '../../services/post-service';
import { useAuth } from "../../hooks/useAuth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// Define the schema for creating a post
const CreatePostSchema = z.object({
  title: z.string().nonempty('Title is required'),
  content: z.string().nonempty('Content is required'),
  image: z.instanceof(FileList).optional(),
});

type CreatePostFormData = z.infer<typeof CreatePostSchema>;

const CreatePostForm: FC = () => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreatePostFormData>({
    resolver: zodResolver(CreatePostSchema),
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle file selection and update the preview image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setValue("image", event.target.files);
    }
  };

  // Handle file removal (clear input and preview)
  const handleRemoveFile = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = "";
    }
    setPreviewImage(null);
    setValue("image", undefined);
  };

  const onSubmit = async (data: CreatePostFormData) => {
    try {
      setServerError(null);
      setSuccessMessage(null);
  
      if (!user?.username) {
        setServerError('User not authenticated. Please log in.');
        return;
      }
  
      // Prepare the data to be sent to the backend
      const postData = {
        title: data.title,
        content: data.content,
        username: user.username,
        image: data.image ? data.image[0].name : '',
        owner: user.username,
        date: new Date().toISOString(),
      };
  
      // Check if there is an image and upload it
      if (data.image && data.image.length > 0) {
        const imageFile = data.image[0];
        const { request } = postsService.uploadImage(imageFile);
        const response = await request;
  
        const imagePath = new URL(response.data.url).pathname; // Extracts "/storage/filename"
        
        postData.image = imagePath; // Set the image path as a string URL
        setPreviewImage(`http://localhost:3000${imagePath}`);
      }
  
      // Call the createPost function with the correct data
      const { request } = postsService.createPost(postData);
      await request;
  
      setSuccessMessage('Post created successfully!');
      reset();
  
      setTimeout(() => {
        navigate('/posts');
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("An error occurred. Please try again.");
      }
    }
  };
  


  return (
    <div className={styles["form-container-post"]}>
      <h2 className={styles["form-title-post"]}>Create a Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["form-post"]}>
        <div className={styles["form-input-post"]}>
          <label htmlFor="title" className={styles["form-label-post"]}>Title</label>
          <input
            {...register('title')}
            type="text"
            className={`${styles["form-control-post"]} ${errors.title ? styles["is-invalid-post"] : ''}`}
            id="title"
            placeholder="Enter post title"
          />
          {errors.title && <p className={styles["text-danger-post"]}>{errors.title.message}</p>}
        </div>

        <div className={styles["form-input-post"]}>
          <label htmlFor="content" className={styles["form-label-post"]}>Content</label>
          <textarea
            {...register('content')}
            className={`${styles["form-control-post"]} ${errors.content ? styles["is-invalid-post"] : ''}`}
            id="content"
            placeholder="Write your post content"
            rows={5}
          />
          {errors.content && <p className={styles["text-danger-post"]}>{errors.content.message}</p>}
        </div>

        <div className={styles["form-input-post"]}>
          <label htmlFor="image" className={styles["form-label-post"]}>Image (optional)</label>
          <div className={styles["image-container"]}>
            {/* Preview Image */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Image Preview"
                className={styles["image-preview"]}
              />
            )}
            {/* Image Buttons */}
            <div className={styles["image-buttons"]}>
              <button
                type="button"
                className={styles["btn-add-image-post"]}
                onClick={() => inputFileRef.current?.click()}
              >
                <FontAwesomeIcon icon={faImage} className={styles["fa-l"]} />
              </button>
              <button
                type="button"
                className={styles["btn-remove-image-post"]}
                onClick={handleRemoveFile}
              >
                <FontAwesomeIcon icon={faTrashAlt} className={styles["fa-l"]} />
              </button>
            </div>
          </div>
          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {serverError && <div className={`${styles["alert-post"]} ${styles["alert-danger-post"]}`}>{serverError}</div>}
        {successMessage && <div className={`${styles["alert-post"]} ${styles["alert-success-post"]}`}>{successMessage}</div>}

        <button type="submit" className={styles["btn-primary-post"]}>Create Post</button>
      </form>
    </div>
  );
};

export default CreatePostForm;
