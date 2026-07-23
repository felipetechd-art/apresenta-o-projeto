import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Presentation from './components/Presentation.jsx'

const isPresentation = 
  window.location.pathname.includes('apresentacao') || 
  window.location.pathname.includes('presentation') || 
  window.location.search.includes('presentation') || 
  window.location.search.includes('apresentacao') ||
  window.location.hash.includes('presentation') ||
  window.location.hash.includes('apresentacao');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPresentation ? <Presentation /> : <App />}
  </StrictMode>,
)
