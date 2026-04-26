import React from "react";
import { Link } from "react-router-dom"; // Assuming you use react-router
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../productCard/ProductCard";

const LatestFeatured = () => {
  const { products } = useAppContext();

  // Filter only in-stock products
  const displayProducts = products.filter((p) => p.inStock).slice(0, 8);

  return (
    <div className="mt-6 px-4 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[2px] bg-indigo-600"></span>
            <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]">
              Collection 2026
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-gray-900 leading-none">
            Nouveautés
          </h2>
          <p className="mt-4 text-gray-500 text-sm md:text-base font-medium leading-relaxed">
            Découvrez les dernières tendances de la saison. Une fusion parfaite entre 
            design contemporain et qualité exceptionnelle, conçue pour ceux qui ne 
            font aucun compromis.
          </p>
        </div>

        {/* VIEW ALL LINK */}
        <Link 
          to="/products" 
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-indigo-600 transition-colors"
        >
          Voir toute la collection
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 w-full">
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* DECORATIVE BOTTOM ELEMENT (Optional) */}
      <div className="mt-16 h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent w-full" />
    </div>
  );
};

export default LatestFeatured;