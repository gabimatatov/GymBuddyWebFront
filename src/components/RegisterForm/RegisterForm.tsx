import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import userService, { User } from '../../services/auth_service';
import trainerIcon from '../../assets/icons/trainerIcon.png';
import styles from './RegisterForm.module.css'

// Define the schema for registration
const RegisterSchema = z.object({
  username: z.string().nonempty('Username is required'),
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
  img: z
    .any()
    .optional(),
  confirmPassword: z.string().nonempty('Please confirm your password'),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: "custom",
      path: ["confirmPassword"],
      message: "Passwords don't match",
    });
  }
});

type RegisterFormData = z.infer<typeof RegisterSchema>;

const RegisterForm: FC = () => {

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const inputFileRef: { current: HTMLInputElement | null } = { current: null }
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [serverError, setServerError] = useState<string | null>(null);
  const [img] = watch(["img"])

  useEffect(() => {
    if (img != null && img[0]) {
      setSelectedImage(img[0])
    } else {
      setSelectedImage(null);
    }
  }, [img])

  const { ref, ...restRegisterParams } = register("img")

  const onSubmit = async (data: RegisterFormData) => {
    // Reset server error before submitting
    setServerError(null);

    console.log('Register Data:', data);

    let relativeUrl = undefined;

    if (data.img && data.img[0]) {
      try {
        // Step 1: Upload the image
        const { request: uploadRequest } = userService.uploadImage(data.img[0]);
        const uploadResponse = await uploadRequest;
        console.log('Image uploaded:', uploadResponse.data);

        // Step 2: Clean the URL to remove the base part
        relativeUrl = new URL(uploadResponse.data.url).pathname;
        console.log('Relative URL:', relativeUrl);
      } catch (error: any) {
        setServerError(error.response?.data?.message || 'An error occurred while uploading image');
        return;
      }
    }

    // Step 3: Create the user object with the avatar if uploaded
    const user: User = {
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: relativeUrl ?? undefined,
    };

    try {
      // Step 4: Register the user
      const { request: registerRequest } = userService.register(user);
      const registerResponse = await registerRequest;
      console.log('User registered:', registerResponse.data);

      // Redirect to login page with success message
      navigate('/login', { state: { successMessage: 'Registered Successfully!' } });

    } catch (error: any) {
      // Display error message (alert logic)
      setServerError(error.response?.data?.message || 'An error occurred');

      // Clear all form inputs
      reset();
      setSelectedImage(null);
    }
  };

  return (
    <div className={styles["form-container-register"]}>
      <div className={styles["logo-container-register"]}>
        <img src="GymBuddyLogo.png" alt="Logo" className={styles["logo-register"]} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={styles["form-register"]}>

        {/* Full name input */}
        <div className={styles["form-input-register"]}>
          <label htmlFor="username" className={styles["form-label-register"]}>Username</label>
          <input
            {...register('username')}
            type="text"
            className={`${styles["form-control-register"]} ${errors.username ? styles["is-invalid-register"] : ''}`}
            id="username"
            placeholder="Enter your username"
          />
          {errors.username && <p className={styles["text-danger-register"]}>{errors.username.message}</p>}
        </div>

        {/* Email input */}
        <div className={styles["form-input-register"]}>
          <label htmlFor="email" className={styles["form-label-register"]}>Email</label>
          <input
            {...register('email')}
            type="email"
            className={`${styles["form-control-register"]} ${errors.email ? styles["is-invalid-register"] : ''}`}
            id="email"
            placeholder="Enter your email"
          />
          {errors.email && <p className={styles["text-danger-register"]}>{errors.email.message}</p>}
        </div>

        {/* Password input */}
        <div className={styles["form-input-register"]}>
          <label htmlFor="password" className={styles["form-label-register"]}>Password</label>
          <input
            {...register('password')}
            type="password"
            className={`${styles["form-control-register"]} ${errors.password ? styles["is-invalid-register"] : ''}`}
            id="password"
            placeholder="Enter your password"
          />
          {errors.password && <p className={styles["text-danger-register"]}>{errors.password.message}</p>}
        </div>

        {/* Confirm password input */}
        <div className={styles["form-input-register"]}>
          <label htmlFor="confirmPassword" className={styles["form-label-register"]}>Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className={`${styles["form-control-register"]} ${errors.confirmPassword ? styles["is-invalid-register"] : ''}`}
            id="confirmPassword"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className={styles["text-danger-register"]}>{errors.confirmPassword.message}</p>}
        </div>

        {/* Avatar selection input */}
        <div className={styles["form-input-register"]}>
          <label htmlFor="avatar" className={styles["form-label-register"]}>Avatar Selection</label>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem', width: '335px' }}>
            <div>
              <img
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '5%',
                  objectFit: 'cover',
                  border: '2px solid #ccc',
                }}
                src={selectedImage ? URL.createObjectURL(selectedImage) : trainerIcon}
                alt="Avatar Holder"
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', width: '100%' }}>
              <button
                type="button"
                className={styles["btn-add-image-register"]}
                onClick={() => inputFileRef.current?.click()}
              >
                <FontAwesomeIcon icon={faImage} className={styles["fa-l"]} /> Upload
              </button>
              <button
                type="button"
                className={styles["btn-remove-image-register"]}
                onClick={() => {
                  setSelectedImage(null);
                  if (inputFileRef.current) {
                    inputFileRef.current.value = '';
                  }
                }}
              >
                <FontAwesomeIcon icon={faTrashAlt} className={styles["fa-l"]} /> Remove
              </button>
            </div>

            <input
              ref={(item) => {
                inputFileRef.current = item;
                ref(item);
              }}
              {...restRegisterParams}
              style={{ display: 'none' }}
              type="file"
              accept="image/png, image/jpeg"
            />
          </div>
        </div>

        <button type="submit" className={styles["btn-primary-register"]}>Register</button>
        {serverError && <div className={`${styles["alert-register"]} ${styles["alert-danger-register"]}`}>{serverError}</div>}
      </form>

      <div className={styles["login-link-register"]}>
        <p>
          Already have an account?{' '}
          <a href="/login" className={styles["link-register"]}>Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
