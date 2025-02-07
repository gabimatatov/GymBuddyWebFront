import { useAuth } from '../hooks/useAuth/AuthContext';
import { Navigate } from 'react-router-dom';
import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Chat from '../components/Chat/Chat';

const ChatPage: React.FC = () => {

  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "120px" }}>
      <Chat/>
      </div>
    </div>
  );
};

export default ChatPage;
