import React from 'react'
import CategoryDrillDown from '../../components/categoryDrillDown/CategoryDrillDown'
import LatestFeatured from '../../components/latestFeatured/LatestFeatured'
import Slider from '../../components/slider/Slider'
import Hero from '../../components/hero/Hero'


const Home = () => {
  return (
    <div>
      {/* <Hero /> */}
      <CategoryDrillDown />
      <Slider />
      <LatestFeatured />
    </div>
  )
}

export default Home