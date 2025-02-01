import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const ProtectedPage = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>Welcome, {user?.username}</h1>
        <h4>{user?.email}</h4>
        <h5>{user?._id}</h5>
        <p>This is a protected page. Only logged-in users can see this.</p>

        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            marginTop: "20px",
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default ProtectedPage;
