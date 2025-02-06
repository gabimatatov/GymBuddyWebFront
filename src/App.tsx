import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from './hooks/useAuth/AuthContext';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PostsPage from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage"
import ChatPage from "./pages/ChatPage";
import CommentsPage from "./pages/CommentsPage";
import SharePage from "./pages/SharePage";
import './styles/App.css'
import UpdatePostPage from "./pages/UpdatePostPage";


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* Protected Pages */}
          <Route path="/" element={<PostsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/post/:postId/comments" element={<CommentsPage />} />
          <Route path="/update-post/:id" element={<UpdatePostPage />} />
          <Route path="/profile" element={<ProfilePage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;