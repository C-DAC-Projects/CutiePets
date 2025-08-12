import React from 'react'
import ProductCard from './Productcard'
import { useAppContext } from '../context/AppContext'

const CareProducts = () => {
    const {products} = useAppContext();
    const careProducts = products.filter((product) => product.category === "Care");
  return (
    <div className='mt-5 ml-4'>
        <p className='text-2xl md:text-3xl font-medium'>Care</p>
        <div className='mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6'>
            {careProducts.slice(0,5).map((product, index)=> (<ProductCard key={index} product={product}/>))}
            
        </div>
      
    </div>
  )
}

export default CareProducts