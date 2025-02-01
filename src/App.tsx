import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth/AuthContext';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostsPage from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage"
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import './styles/App.css'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/chat" element={<ChatPage/>} />
          <Route path="/home" element={<HomePage/>} />

          {/* Protected Pages */}
          <Route path="/profile" element={<ProfilePage />} />

      </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;