import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Pets from './pages/Pets'
import Product from './pages/Products'

import ProductDetails from './pages/ProductDetails'
import Orders from './pages/Orders'
import {Toaster} from 'react-hot-toast'
import Footer from './components/Footer'
import ContactUs from './pages/ContactUs'
import Header from './components/Header'
import Products from './pages/Products'
import ProductCategory from './pages/ProductCategory'
import Login from './components/Login'
import { useAppContext } from './context/AppContext'
import Cart from './pages/Cart'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin')
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin, setShowUserLogin } = useAppContext();
  return (
    <>
    
     {!isSellerPath && <Navbar/> }
     {showUserLogin ? <Login/> : null}
    <Toaster/>

    

     <div className={`${isSellerPath ? "" : ""}`}>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/pets' element={<Pets />}/>
        <Route path='/product' element={<Products />}/>
        <Route path='/product/:category' element={<ProductCategory />}/>
        <Route path='/product/:category/:id' element={<ProductDetails />}/>
        <Route path='/cart' element={<Cart />}/>
       
        <Route path='/orders' element={<Orders />}/>
        <Route path='/contactus' element={<ContactUs />}/>
      </Routes>
      </div>
      {!isSellerPath && <Footer/> }

    {/* {showUserLogin && <AuthForm onClose={() => setShowUserLogin(false)} />} */}
    </>
  )
}

export default App
