import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import './RegisterForm.css';

// Define the schema for registration
const RegisterSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .nonempty('Password is required'),
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
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Register Data:', data);
  };

  return (
    <div className="form-container">
      <div className="logo-container">
        <img src="GymBuddyLogo.png" alt="Logo" className="logo" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-input">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            {...register('name')}
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </div>

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
        
        <div className="form-input">
          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
          <input
            {...register('confirmPassword')}
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
        </div>
        
        <button type="submit" className="btn btn-primary m-3">Register</button>
      </form>
      <div className="login-link">
        <p>
          Already have an account?{' '}
          <a href="/login" className="link">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
