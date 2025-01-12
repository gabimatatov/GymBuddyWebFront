// src/components/AuthForm.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";

type FormInputs = {
  fullName?: string;
  email: string;
  password: string;
};

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();

  const handleFormSwitch = (): void => {
    setIsLogin(!isLogin);
    reset(); // Reset form data when switching
  };

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(isLogin ? "Login Data:" : "Register Data:", data);
    alert(`${isLogin ? "Logged in" : "Registered"} successfully!`);
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-header bg-white border-bottom d-flex justify-content-around">
          <button 
            className={`btn ${isLogin ? "btn-success" : "btn-outline-success"}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`btn ${!isLogin ? "btn-success" : "btn-outline-success"}`} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        <div className="card-body">
          <h5 className="card-title text-center">{isLogin ? "Login" : "Register"}</h5>
          <form onSubmit={handleSubmit(onSubmit)}>
            {!isLogin && (
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`} 
                  {...register("fullName", { required: !isLogin && "Full name is required" })}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email" 
                className={`form-control ${errors.email ? "is-invalid" : ""}`} 
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className={`form-control ${errors.password ? "is-invalid" : ""}`} 
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>
            <button type="submit" className="btn btn-success w-100">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;