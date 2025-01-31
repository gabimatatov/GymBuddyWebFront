import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

const ProtectedPage = () => {
//   const { user, logout } = useContext(AuthContext)!;

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Welcome 🎉</h1>
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
