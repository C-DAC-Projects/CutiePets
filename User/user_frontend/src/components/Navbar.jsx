import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { RiMenu4Fill, RiSearch2Line, RiShoppingCart2Line } from "react-icons/ri";
import { GiCrossedBones } from "react-icons/gi";
import { useAppContext } from '../context/AppContext';


const Navbar = () => {

  const [isOpen,setIsOpen] = useState(false)
  const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount} = useAppContext();
  
  useEffect(()=>{
    if(searchQuery.length > 0){
      navigate("/product")
    }
  },[searchQuery])

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 backdrop-blur'>
        <Link to='/' className='max-md:flex-1'>
            <img src={assets.Logo} alt="" className='w-36 h-auto'/>
        </Link>
        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full': 'max-md:w-0'}`}>
            <GiCrossedBones className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

            <Link onClick={() => {scrollTo(0,0), setIsOpen(false) }} to='/'>Home</Link>
            <Link onClick={() => {scrollTo(0,0), setIsOpen(false) }} to='/pets'>Pets</Link>
            <Link onClick={() => {scrollTo(0,0), setIsOpen(false) }} to='/product'>Products</Link>
            <Link onClick={() => {scrollTo(0,0), setIsOpen(false) }} to='/doctors'>Consult</Link>
            <Link onClick={() => {scrollTo(0,0), setIsOpen(false) }} to='/contactus'>Contact Us</Link>
        </div>
        <div className='flex items-center gap-8'>
          <div className='hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full'>
            <input onChange={(e)=> setSearchQuery(e.target.value)} className='py-1.5 w-full bg-transparent outline-none placeholder-gray-100' type="text" placeholder='Search products' />
            <RiSearch2Line className='max-md:hidden w-6 h-6 cursor-pointer'/>
         </div>
         <div onClick={() => navigate("/cart")} className='relative cursor-pointer'>
  <RiShoppingCart2Line className='w-6 h-6 opacity-80' />
  <span className='absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full'>
    {getCartCount()}
  </span>
</div>
            <button onClick={()=> setShowUserLogin(true)} className='px-4 py-1 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
            
        </div>

        
        <RiMenu4Fill className='max-md:ml-4 md:hidden w-8 h-7 cursor-pointer' onClick={() => setIsOpen(!isOpen) } />
      
    </div>
  )
}

export default Navbar
