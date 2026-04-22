import React from 'react'
import Slider from '../../components/slider/Slider'
import ProductCard from '../../components/productCard/ProductCard'
import TreeProductList from '../../components/treeProductList/TreeProductList'

const Home = () => {
  return (
    <div>
      <Slider />
      {/* <ProductCard /> */}
      <TreeProductList />
    </div>
  )
}

export default Home