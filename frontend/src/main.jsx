import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './assets/base.css'
import './assets/prose.css'
import './assets/chatLayout.css'
import './assets/chatComponents.css'
import './assets/askAboutThis.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
