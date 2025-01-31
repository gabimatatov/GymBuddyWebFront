import React, { useEffect } from "react";
import RegisterForm from "../components/RegisterForm/RegisterForm";
import { useAuth } from '../hooks/useAuth/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to profile if already authenticated - Currently disabled.
  // const { isAuthenticated } = useAuth();
  let { isAuthenticated } = useAuth();
  isAuthenticated = false;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
