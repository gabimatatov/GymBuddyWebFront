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
import UpdatePostPage from "./pages/UpdatePostPage";
import './styles/App.css'


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* Protected Pages */}
          <Route path="/" element={<PostsPage />} />
          <Route path="/ui/login" element={<LoginPage />} />
          <Route path="/ui/register" element={<RegisterPage />} />
          <Route path="/ui/posts" element={<PostsPage />} />
          <Route path="/ui/chat" element={<ChatPage />} />
          <Route path="/ui/share" element={<SharePage />} />
          <Route path="/ui/post/:postId/comments" element={<CommentsPage />} />
          <Route path="/ui/update-post/:id" element={<UpdatePostPage />} />
          <Route path="/ui/profile" element={<ProfilePage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;