import React from 'react'
import CategoryDrillDown from '../../components/categoryDrillDown/CategoryDrillDown'
import LatestFeatured from '../../components/latestFeatured/LatestFeatured'
import Slider from '../../components/slider/Slider'


const Home = () => {
  return (
    <div>
      <CategoryDrillDown />
      <Slider />
      <LatestFeatured />
    </div>
  )
}

export default Home