import React from 'react'
import Header from '../components/Header'
import Categories from '../components/Categories'
import Care from '../components/Care'
import Slider from '../components/Slider'
import NewsLetter from '../components/NewsLetter'
import Food from '../components/Food'
import Footer from '../components/Footer'
import CareProducts from '../components/CareProducts'
import Pets from '../components/Pets'

const Home = () => {
  return (
    <div className='mt-1'>
      <Header />
      <Slider />
      <Categories />
      <Pets />
      <Care />
      <Food />
      <CareProducts />
      <NewsLetter />
     
    </div>
  )
}

export default Home
