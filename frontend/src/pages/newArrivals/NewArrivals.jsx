import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/productCard/ProductCard';

const NewArrivals = () => {
  const { products } = useAppContext();

  // On filtre les produits "inStock" et on prend les 8 plus récents
  const newProducts = products
    ?.filter(product => product.inStock === true || product.inStock === 1)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 8) || [];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-600 font-bold text-sm uppercase tracking-[0.2em]">
              <span className="w-8 h-[2px] bg-indigo-600"></span>
              Collection 2026
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Nos <span className="text-slate-400">Nouveautés</span>
            </h2>
          </div>
          
          <Link 
            to="/products" 
            className="group flex items-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-900 hover:text-indigo-600 px-6 py-3 rounded-2xl font-bold transition-all duration-300"
          >
            Voir toute la collection 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Section */}
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-indigo-400 opacity-20"></span>
              <ArrowRight className="w-8 h-8 text-slate-300 rotate-45" />
            </div>
            <p className="text-slate-500 font-bold text-lg">Bientôt disponible</p>
            <p className="text-slate-400 text-sm">Nos équipes préparent la nouvelle collection.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;