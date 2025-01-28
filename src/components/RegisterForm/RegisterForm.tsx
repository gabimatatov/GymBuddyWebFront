import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import userService, { User } from '../../services/auth_service';
import trainerIcon from '../../assets/icons/trainerIcon.png';
import './RegisterForm.moudle.css';

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
      name: data.name,
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
    <div className="form-container">
      <div className="logo-container">
        <img src="GymBuddyLogo.png" alt="Logo" className="logo" />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>

        {/* full name input */}
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

        {/* email input */}
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

        {/* password input */}
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

        {/* confirm password input */}
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

        {/* avatar selection input */}
        <div className="form-input">
          <label htmlFor="avatar" className="form-label">Avatar Selection</label>
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
                className="btn-add-image"
                onClick={() => inputFileRef.current?.click()}
              ><FontAwesomeIcon icon={faImage} className='fa-l' /> Upload</button>
              <button
                type="button"
                className="btn-remove-image"
                onClick={() => {
                  setSelectedImage(null);
                  if (inputFileRef.current) {
                    inputFileRef.current.value = '';
                  }
                }}
              ><FontAwesomeIcon icon={faTrashAlt} className='fa-l' /> Remove</button>
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
        <button type="submit" className="btn btn-primary">Register</button>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
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
