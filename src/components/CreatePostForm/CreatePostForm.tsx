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
  const { user } = useAuth(); // Get the authenticated user
  const navigate = useNavigate(); // Navigate for redirection

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
      setSuccessMessage(null); // Reset success message before submitting

      if (!user?.username) {
        setServerError('User not authenticated. Please log in.');
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('username', user.username);

      let imageFilename = ''; // This will store the image filename to send in the post data

      // Check if there is an image and upload it
      if (data.image && data.image.length > 0) {
        // Upload the image first and get the filename from the server
        const imageFile = data.image[0];
        const { request } = postsService.uploadImage(imageFile);
        const response = await request;

        // The server should return the filename or URL of the saved image
        imageFilename = response.data.url; // Assuming the server returns the image URL

        console.log('Image uploaded with URL:', imageFilename);

        // Add the image filename (URL) to the form data
        formData.append('image', imageFilename);
      }

      // Call the createPost function
      const { request, abort } = postsService.createPost(formData);
      await request;

      // Set success message after successful post creation
      setSuccessMessage('Post created successfully!');

      // Reset the form after successful submission
      reset();

      // Redirect to the posts page after a short delay
      setTimeout(() => {
        navigate('/posts'); // Redirect to the posts page
      }, 1500); // Delay before redirecting (optional)
    } catch (error: any) {
      setServerError(error.message || 'An error occurred. Please try again.');
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Preview Image */}
            {previewImage && (
              <img
                src={previewImage}
                alt="Image Preview"
                className={styles["image-preview"]}
              />
            )}
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
