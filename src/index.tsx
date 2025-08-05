import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProvider } from './contexts/AppContext'
import App from './App'
import './styles/global-clean.css'

const container = document.getElementById('root')
if (!container) throw new Error('Failed to find the root element')

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
)