import { useAuth } from '../context/AuthContext';

const ProtectedPage = () => {
  const { user } = useAuth();

  // Handle case when user is not logged in (user is null)
  if (!user) {
    return <p>Please log in to access this page.</p>;
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      {/* Access user.username */}
      <h1>Welcome, {user.username}</h1> 
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
  );
};

export default ProtectedPage;
