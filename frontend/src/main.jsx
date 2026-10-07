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
import DiagnosticConfigView from './components/admin/DiagnosticConfigView.jsx'
import UserManagementView from './components/admin/UserManagementView.jsx'
import DiagnosticFlow from './components/diagnostic/DiagnosticFlow.jsx'
import DiagnosticResults from './components/diagnostic/DiagnosticResults.jsx'
import EntrevistaForm from './components/interview/EntrevistaForm.jsx'
import EntrevistaDetalhe from './components/interview/EntrevistaDetalhe.jsx'

import ConversationPresentation from './components/ConversationPresentation.jsx'
import PPEPresentation from './components/PPEPresentation.jsx'
import ResponderView from './components/diagnostic/ResponderView.jsx'
import { LucroOcultoDiagnostic } from './components/lucroOculto/LucroOcultoDiagnostic.jsx'
import { LucroOcultoTeamSurvey } from './components/lucroOculto/LucroOcultoTeamSurvey.jsx'

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
          
          {/* Mapa do Lucro Oculto */}
          <Route path="/mapa-lucro-oculto" element={<LucroOcultoDiagnostic />} />
          <Route path="/lucro-oculto" element={<LucroOcultoDiagnostic />} />
          <Route path="/equipe-atividades" element={<LucroOcultoTeamSurvey />} />
          <Route path="/mapa-lucro-oculto/equipe" element={<LucroOcultoTeamSurvey />} />
          
          {/* Conversation Tool Route */}
          <Route path="/conversa" element={<ConversationPresentation />} />
          <Route path="/ppe" element={<PPEPresentation />} />

          {/* Diagnostic Core Flow */}
          <Route path="/diagnostico/:id" element={<DiagnosticFlow />} />
          
          {/* External Respondent Route */}
          <Route path="/responder/:id" element={<ResponderView />} />

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
          <Route 
            path="/admin/diagnostico/config" 
            element={
              <ProtectedRoute>
                <DiagnosticConfigView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/usuarios" 
            element={
              <ProtectedRoute>
                <UserManagementView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/diagnostico/:id/resultados" 
            element={
              <ProtectedRoute>
                <DiagnosticResults />
              </ProtectedRoute>
            } 
          />
          {/* Entrevista Inicial — Governo Empresarial */}
          <Route
            path="/admin/entrevistas/nova"
            element={
              <ProtectedRoute>
                <EntrevistaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/entrevistas/:id/editar"
            element={
              <ProtectedRoute>
                <EntrevistaForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/entrevistas/:id"
            element={
              <ProtectedRoute>
                <EntrevistaDetalhe />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
