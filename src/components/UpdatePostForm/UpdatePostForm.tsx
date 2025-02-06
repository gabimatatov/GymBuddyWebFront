import { FC, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePostForm.module.css';
import postsService from '../../services/post-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

interface UpdatePostFormProps {
  _id?: string; 
}

const UpdatePostForm: FC<UpdatePostFormProps> = ({ _id }) => {
    const { id: paramId } = useParams<{ id: string }>(); 
    const postId = _id || paramId; 

    const inputFileRef = useRef<HTMLInputElement | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState<boolean>(false);  // State to track image removal
    const [previousImage, setPreviousImage] = useState<string | null>(null); // Track previous image URL
    const navigate = useNavigate();

    useEffect(() => {
      if (!postId) return;

      const fetchPost = async () => {
        try {
          const { request } = postsService.getPostById(postId);
          const response = await request;
          const post = response.data;

          if (!post) {
            setServerError('Post not found.');
            return;
          }

          console.log('Fetched post:', post); // Log the current post data

          const imageUrl = post.image ? `http://localhost:3000${post.image}` : '/public/GymBuddyLogo.png';
          setPreviewImage(imageUrl);
          setPreviousImage(imageUrl); // Set the previous image
          setTitle(post.title || '');
          setContent(post.content || '');
        } catch (error: unknown) {
          if (error instanceof Error) {
            setServerError(error.message);
          } else {
            setServerError("Error fetching post data.");
          }
        }
      };

      fetchPost();
    }, [postId]);

    // Handle file removal (clear input and revert to the previous image)
    const handleRemoveFile = () => {
      // Only proceed if an image is already uploaded or previewed
      if (imageFile || previewImage === '/public/GymBuddyLogo.png') {
        if (inputFileRef.current) {
          inputFileRef.current.value = ""; // Clear the file input
        }
        setPreviewImage(previousImage); // Revert to the previous image
        setImageFile(null); // Clear the image file state
        setRemoveImage(false); // Reset the removal flag
      }
    };

    // Handle file selection and update the preview image
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl); // Set preview image
        setImageFile(file); // Set the selected file to state
        setRemoveImage(false); // Reset remove image flag when a new image is selected
      }
    };

    const onSubmit = async () => {
      try {
        setServerError(null);
        setSuccessMessage(null);

        if (!postId) {
          setServerError('Post ID is missing!');
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);

        let imageFilename = '';

        // If a new image is selected, upload it
        if (imageFile) {
          const { request } = postsService.uploadImage(imageFile);
          const response = await request;
        
          imageFilename = response.data.url;
        
          const relativePath = imageFilename.replace('http://localhost:3000', ''); // Remove the base URL
        
          console.log('Image uploaded with relative URL:', relativePath);
        
          formData.append('image', relativePath); // Append the relative path
        }

        // If the image is to be removed, append a flag or handle removal server-side
        if (removeImage) {
          const image = 'none';
          formData.append('image', image);
        }

        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        const { request } = postsService.updatePost(postId, formData);
        await request;

        setSuccessMessage('Post updated successfully!');
        setTimeout(() => {
          navigate('/posts');
        }, 1500);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setServerError(error.message);
        } else {
          setServerError("An error occurred.");
        }
      }
    };

    return (
      <div className={styles["form-container-post"]}>
        <h2 className={styles["form-title-post"]}>Update Post</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className={styles["form-post"]}>

          <div className={styles["form-input-post"]}>
            <label htmlFor="title" className={styles["form-label-post"]}>Title</label>
            <input
              type="text"
              className={styles["form-control-post"]}
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Update title
              placeholder="Enter post title"
            />
          </div>

          <div className={styles["form-input-post"]}>
            <label htmlFor="content" className={styles["form-label-post"]}>Content</label>
            <textarea
              className={styles["form-control-post"]}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)} // Update content
              placeholder="Write your post content"
              rows={5}
            />
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
          <button type="submit" className={styles["btn-primary-post"]}>Update Post</button>
        </form>
      </div>
    );
};

export default UpdatePostForm;
