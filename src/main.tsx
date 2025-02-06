import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='575609668931-adrcn0ilb7vvlvda6mmiknm6n1t3mcat.apps.googleusercontent.com'>
    <StrictMode>
      <App />
    </StrictMode >
  </GoogleOAuthProvider>
)
