import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import toast, { Toaster } from 'react-hot-toast';

import { loadConfig } from "./lib/config.js";
import { initApi } from "./lib/axios.js";

async function startApp(){

  await loadConfig()
  initApi()
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Toaster position="top-center" />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )

}
