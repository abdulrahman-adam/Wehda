import React from "react";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../productCard/ProductCard";

const LatestFeatured = () => {
  const { products } = useAppContext();

  // Filter only in-stock products
  const displayProducts = products.filter((p) => p.inStock).slice(0, 8);

  return (
    <div className="mt-10 px-0 sm:px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight">
          Nouveautés
        </h2>
        <div className="h-[2px] flex-1 bg-gray-100 ml-4 hidden sm:block"></div>
      </div>

      {/* MOBILE: grid-cols-1 (One column, creating vertical rows)
          DESKTOP: sm:grid-cols-2 lg:grid-cols-4 
      */}
     <div className="grid grid-cols-2 justify-items-center gap-2 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-[2px] w-full">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LatestFeatured;
