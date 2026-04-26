

import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../../components/productCard/ProductCard";

const AllProducts = () => {
  const { products = [], searchQuery = "" } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (!products) return;

    if (searchQuery && searchQuery.trim() !== "") {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  return (
    <div className="mt-2 flex flex-col items-center">
      
      {/* --- SECTION TITRE CENTRÉE --- */}
      <div className="flex flex-col items-center w-full mb-8"> 
        <p className="text-2xl font-medium uppercase text-center">
          {searchQuery ? `Résultats pour : "${searchQuery}"` : "Tous nos produits"}
        </p>
        <div className="w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
        
        <p className="text-blue-700 text-sm mt-3 italic font-bold">
          {filteredProducts.length > 0 
            ? `${filteredProducts.filter(p => p.inStock).length} produits disponibles` 
            : "Aucun produit disponible"}
        </p>
      </div>

      {/* --- GRID SYSTEM: 1 COLUMN (STACKED ROWS) ON MOBILE --- */}
      <div className="grid grid-cols-2 justify-items-center px-[2px] sm:flex sm:flex-wrap sm:justify-center gap-2 md:gap-8 w-full max-w-7xl mx-auto">
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts
            .filter((product) => product.inStock)
            .map((product, index) => (
              <ProductCard key={index} product={product} />
            ))
        ) : (
          <div className="col-span-2 w-full sm:max-w-md mx-auto mb-8 px-4 py-8 text-center text-sm sm:text-base text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        Désolé, nous n'avons trouvé aucun produit correspondant.
      </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;