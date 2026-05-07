import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
<<<<<<< HEAD
import { NotificationProvider } from './context/NotificationContext'
=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
<<<<<<< HEAD
        <NotificationProvider>
          <App />
        </NotificationProvider>
=======
        <App />
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
<<<<<<< HEAD

=======
>>>>>>> 0bcc2838d85c6a3e0a21a5db252a0a31061ad87a
