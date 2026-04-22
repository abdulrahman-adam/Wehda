

import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../../components/productCard/ProductCard";

// import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  // On ajoute une valeur par défaut "" au cas où searchQuery serait undefined
  const { products = [], searchQuery = "" } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

 

  useEffect(() => {
    // On s'assure que products existe et n'est pas vide
    if (!products) return;

    if (searchQuery && searchQuery.trim() !== "") {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]); // S'exécute à chaque fois que searchQuery change

  return (
 <div className="mt-16 flex flex-col items-center">
  
  {/* --- SECTION TITRE CENTRÉE --- */}
  <div className="flex flex-col items-center w-full mb-8"> 
    <p className="text-2xl font-medium uppercase text-center">
      {searchQuery ? `Résultats pour : "${searchQuery}"` : "Tous nos produits"}
    </p>
    <div className="w-20 h-1 bg-blue-500 rounded-full mt-2"></div>
    
    {/* --- COMPTEUR DE PRODUITS --- */}
    <p className="text-blue-700 text-sm mt-3 italic font-bold">
      {filteredProducts.length > 0 
        ? `${filteredProducts.filter(p => p.inStock).length} produit disponible` 
        : "Aucun produit disponible"}
    </p>
  </div>

  {/* --- GRILLE DE PRODUITS --- */}
  {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 w-full">
    {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
      filteredProducts
        .filter((product) => product.inStock)
        .map((product, index) => (
          <ProductCard key={index} product={product} />
        ))
    ) : (
      <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
        <i className="bi bi-search text-3xl block mb-2"></i>
        Désolé, nous n'avons trouvé aucun produit correspondant à votre recherche.
      </div>
    )}
  </div> */}

  {/* --- GRILLE DE PRODUITS --- */}
<div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full mt-6">
  {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
    filteredProducts
      .filter((product) => product.inStock)
      .map((product, index) => (
        <ProductCard key={index} product={product} />
      ))
  ) : (
    <div className="w-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
      Désolé, nous n'avons trouvé aucun produit correspondant.
    </div>
  )}
</div>
</div>
  );
};

export default AllProducts;
