import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Presentation from './components/Presentation.jsx'

// Show Axion screens only if explicitly requested via URL parameter or hash
const showAxion = 
  window.location.search.includes('axion') || 
  window.location.hash.includes('axion');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {showAxion ? <App /> : <Presentation />}
  </StrictMode>,
)
