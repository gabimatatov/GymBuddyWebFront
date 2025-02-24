import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import ProfileForm from '../components/ProfileForm/ProfileForm';

const ProtectedPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/ui/login" />;
  }

  return (
    <>
      <Navbar />
      <ProfileForm />
    </>
  );
};

export default ProtectedPage;
