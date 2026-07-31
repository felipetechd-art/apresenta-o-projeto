import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import App from './App.jsx'
import Presentation from './components/Presentation.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Admin Views
import AdminLoginView from './components/admin/AdminLoginView.jsx'
import ForgotPasswordView from './components/admin/ForgotPasswordView.jsx'
import ClientManagementView from './components/admin/ClientManagementView.jsx'
import ProtectedRoute from './components/admin/ProtectedRoute.jsx'
import ClientMagicLoginView from './components/ClientMagicLoginView.jsx'

// Helper for legacy axion mode
const RootRoute = () => {
  const showAxion = 
    window.location.search.includes('axion') || 
    window.location.hash.includes('axion');
  
  return showAxion ? <App /> : <Presentation />;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Presentation Route */}
          <Route path="/" element={<RootRoute />} />
          
          {/* Client Magic Link Access */}
          <Route path="/painel" element={<ClientMagicLoginView />} />
          
          {/* Admin Public Routes */}
          <Route path="/admin/login" element={<AdminLoginView />} />
          <Route path="/admin/esqueci-senha" element={<ForgotPasswordView />} />
          
          {/* Admin Protected Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <ClientManagementView />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
