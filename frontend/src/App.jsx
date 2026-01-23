import { useState } from 'react'
import {NavBar} from "./components/navbar/NavBar.jsx"
import { Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage.jsx';
import { Inventory } from './pages/Inventory.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import PublicRoute from './components/auth/PublicRoute.jsx';
import { isAuthenticated } from './lib/auth.js';
import { Navigate } from "react-router-dom"
import { ItemPage } from './pages/ItemPage.jsx';
import { Cart } from './pages/Cart.jsx';
import { SaleDetail } from './pages/SaleDetail.jsx';

import { ScannerProvider } from "./scanner/ScannerContext"
import { useScannerListener } from "./scanner/useScannerListener"
import { SaleHistory } from './pages/SaleHistory.jsx';


function App() {
  
  function ScannerListenerMount() {
    useScannerListener()
    return null
  }
  
  return (
    <ScannerProvider>
      <ScannerListenerMount />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated()
              ? <Navigate to="/home" replace />
              : <Navigate to="/auth" replace />
          }// dirigido a home o login segun si hay token o no
        />
        <Route path='/Home' element={<HomePage></HomePage>}></Route>
        <Route path='/auth' element={
          <PublicRoute>
            <AuthPage></AuthPage>
          </PublicRoute>
        } //Evito que se pueda volver a login si ya existe el token 
        ></Route>
        <Route path='/cart' element={<Cart></Cart>}></Route>
        <Route path='/inventory' element={<Inventory></Inventory>}></Route>
        <Route path='/item/' element={<ItemPage></ItemPage>}></Route>
        <Route path='/item/:sku' element={<ItemPage></ItemPage>}></Route>
        <Route path='/sales/' element={<SaleHistory/>}></Route>
        <Route path='/sales/:saleId' element={<SaleDetail/>}></Route>
      </Routes>
     
    </ScannerProvider>
  )
}

export default App
