import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { router } from './router'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { ContractHolderProvider } from './contexts/ContractHolderContext'
import './index.css'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <AuthProvider>
            <ContractHolderProvider>
              <RouterProvider router={router} />
            </ContractHolderProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </React.StrictMode>,
  )
}
