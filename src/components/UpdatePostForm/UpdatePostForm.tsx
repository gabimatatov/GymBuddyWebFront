import { FC, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './UpdatePostForm.module.css';
import postsService from '../../services/post-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import fileService from '../../services/file-service';

// Define the validation schema using Zod
const postSchema = z.object({
  title: z.string().nonempty('Title is required').max(25, 'Title must be at most 25 characters long'),
  content: z.string().nonempty('Content is required'),
  image: z.instanceof(FileList).optional(),
});

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
  const [removeImage, setRemoveImage] = useState<boolean>(false);
  const [previousImage, setPreviousImage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ title?: string; content?: string }>({});
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

        const imageUrl = post.image && post.image !== 'none' ? `${post.image}` : '/public/GymBuddyLogo.png';
        setPreviewImage(imageUrl);
        setPreviousImage(imageUrl);
        setTitle(post.title || '');
        setContent(post.content || '');
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : 'Error fetching post data.');
      }
    };

    fetchPost();
  }, [postId]);

  const handleRemoveFile = () => {
    setImageFile(null);
    setPreviewImage(previousImage);
    setRemoveImage(false);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setImageFile(file);
      setRemoveImage(false); 
    }
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    setRemoveImage(true);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // Clear previous messages
    setServerError(null);
    setSuccessMessage(null);
    setValidationErrors({});
  
    try {
      // Validate the form data using Zod
      postSchema.parse({ title, content });
  
      if (!postId) {
        setServerError('Post ID is missing!');
        return;
      }
  
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
  
      let imageFilename = '';
      if (imageFile) {
        const { request } = fileService.uploadImage(imageFile);
        const response = await request;
        imageFilename = response.data.url;
        const relativePath = imageFilename.replace('', '');
        formData.append('image', relativePath);
      }
  
      // Only mark image for removal if the imageFile is null and a remove image action was performed
      if (removeImage && !imageFile) {
        formData.append('image', 'none');
      }
  
      const { request } = postsService.updatePost(postId, formData);
      await request;
  
      setSuccessMessage('Post updated successfully!');
      setTimeout(() => {
        navigate('/ui/posts');
      }, 1500);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const newValidationErrors: { title?: string; content?: string } = {};
        error.errors.forEach((e) => {
          if (e.path[0] === 'title') {
            newValidationErrors.title = e.message;
          } else if (e.path[0] === 'content') {
            newValidationErrors.content = e.message;
          }
        });
        setValidationErrors(newValidationErrors);
      } else if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError('An error occurred.');
      }
    }
  };
  
  return (
    <div className={styles["form-container-post"]}>
      <h2 className={styles["form-title-post"]}>Update Post</h2>
      <form onSubmit={onSubmit} className={styles["form-post"]}>
        <div className={styles["form-input-post"]}>
          <label htmlFor="title" className={styles["form-label-post"]}>Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`${styles["form-control-post"]} ${validationErrors.title ? styles["is-invalid-post"] : ''}`}
            placeholder="Enter post title"
          />
          {validationErrors.title && (
            <div className={styles["text-danger"]} style={{ color: 'red' }}>
              {validationErrors.title}
            </div>
          )}
        </div>

        <div className={styles["form-input-post"]}>
          <label htmlFor="content" className={styles["form-label-post"]}>Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${styles["form-control-post"]} ${validationErrors.content ? styles["is-invalid-post"] : ''}`}
            placeholder="Write your post content"
            rows={5}
          />
          {validationErrors.content && (
            <div className={styles["text-danger"]} style={{ color: 'red' }}>
              {validationErrors.content}
            </div>
          )}
        </div>

        <div className={styles["form-input-post"]}>
          <label htmlFor="image" className={styles["form-label-post"]}></label>
          <div className={styles["image-container"]}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Image Preview"
                className={styles["image-preview"]}
              />
            ) : (
              <p>No image selected</p>
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
              <button
                type="button"
                className={styles["btn-remove-image-post"]}
                onClick={handleDeleteImage}
              >
                Delete Image
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
