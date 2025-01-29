import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import userService from '../../services/auth_service';
import styles from './LoginForm.module.css'

// Define the schema for login
const LoginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
});

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginForm: FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Login Data:', data);
      setSuccessMessage(null);

      // Send the login request
      const { request } = userService.login(data);
      const response = await request;

      console.log('Login successful:', response.data);

      // Reset the form after successful login
      reset();
      setServerError(null);

      // Perform any post-login actions (e.g., redirect to dashboard)
    } catch (error: any) {
      reset();
      setServerError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className={styles["form-container-login"]}>
      <div className={styles["logo-container-login"]}>
        <img src="GymBuddyLogo.png" alt="Logo" className={styles["logo-login"]} />
      </div>
      {successMessage && <div className={`${styles["alert-login"]} ${styles["alert-success-login"]}`}>{successMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className={styles["form-login"]}>
        <div className={styles["form-input-login"]}>
          <label htmlFor="email" className={styles["form-label-login"]}>Email</label>
          <input
            {...register('email')}
            type="email"
            className={`${styles["form-control-login"]} ${errors.email ? styles["is-invalid-login"] : ''}`}
            id="email"
            placeholder="Enter your email"
          />
          {errors.email && <p className={styles["text-danger-login"]}>{errors.email.message}</p>}
        </div>

        <div className={styles["form-input-login"]}>
          <label htmlFor="password" className={styles["form-label-login"]}>Password</label>
          <input
            {...register('password')}
            type="password"
            className={`${styles["form-control-login"]} ${errors.password ? styles["is-invalid-login"] : ''}`}
            id="password"
            placeholder="Enter your password"
          />
          {errors.password && <p className={styles["text-danger-login"]}>{errors.password.message}</p>}
        </div>

        {serverError && <div className={`${styles["alert-login"]} ${styles["alert-danger-login"]}`}>{serverError}</div>}

        <button type="submit" className={styles["btn-primary-login"]}>Login</button>

        <div className={styles["register-link-login"]}>
          <p>
            Don't have an account?{' '}
            <a href="/register" className={styles["link-login"]}>Register here</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;