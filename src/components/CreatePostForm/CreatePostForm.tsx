import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import styles from './CreatePostForm.module.css';
import postsService from '../../services/post-service';
import { useAuth } from "../../hooks/useAuth/AuthContext";

// Define the schema for creating a post
const CreatePostSchema = z.object({
  title: z.string().nonempty('Title is required'),
  content: z.string().nonempty('Content is required'),
  image: z.instanceof(FileList).optional(),
});

type CreatePostFormData = z.infer<typeof CreatePostSchema>;

const CreatePostForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormData>({
    resolver: zodResolver(CreatePostSchema),
  });

  const { user } = useAuth(); // Get the authenticated user
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state
  const navigate = useNavigate(); // Navigate for redirection

  console.log("User:", user); // Debugging: Check if user exists

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

      // Check if there is an image and append it
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
        console.log('Image name:', data.image[0].name); // Log the image name safely
      }

      // Log the data being sent
      console.log('Sending the following data to create the post:');
      console.log({
        title: data.title,
        content: data.content,
        username: user.username,
        image: data.image && data.image.length > 0 ? data.image[0].name : null,
      });

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
          <input
            {...register('image')}
            type="file"
            className={styles["form-control-post"]}
            id="image"
            accept="image/*"
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
