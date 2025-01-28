import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import userService from '../../services/auth_service';
import './LoginForm.moudle.css';

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
    <div className="form-container">
      <div className="logo-container">
        <img src="GymBuddyLogo.png" alt="Logo" className="logo" />
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-input">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            {...register('email')}
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-danger">{errors.email.message}</p>}
        </div>
        
        <div className="form-input">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            {...register('password')}
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-danger">{errors.password.message}</p>}
        </div>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <button type="submit" className="btn btn-primary m-3">Login</button>

        <div className="register-link">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="link">Register here</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;