import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import toast, { Toaster } from 'react-hot-toast';

import { loadConfig } from "./lib/config.js";




async function startApp(){
  // el único motivo de esta funcion es poder llamar a loadConfig primero que el render
  await loadConfig()
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Toaster position="top-center" />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )

}

startApp( )