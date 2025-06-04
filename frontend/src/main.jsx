import './index.css'
import { StrictMode } from 'react'
import router from './routes/index.jsx'
import { Toaster } from 'react-hot-toast'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="bottom-right" />
    <RouterProvider router={router} />
  </StrictMode>,
)