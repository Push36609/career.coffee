import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#3b2314',
          color: '#fdf8f0',
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
        },
        success: { iconTheme: { primary: '#c97d1e', secondary: '#fdf8f0' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#fdf8f0' } },
      }}
    />
  </React.StrictMode>,
)
