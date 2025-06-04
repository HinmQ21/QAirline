import '@/index.css'
import { StrictMode } from 'react'
import router from '@/routes/index.jsx'
import { Toaster } from 'react-hot-toast'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { serviceContainer, ServiceContext } from '@/context/ServiceContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="bottom-right" />
    <ServiceContext.Provider value={serviceContainer}>
      <RouterProvider router={router} />
    </ServiceContext.Provider>
  </StrictMode>,
)