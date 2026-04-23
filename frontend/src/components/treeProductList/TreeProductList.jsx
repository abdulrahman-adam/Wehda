import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../../components/productCard/ProductCard";

const TreeProductList = () => {
  const { products, categories } = useAppContext();
  const { parent, child } = useParams();

  // 1. Find the current category object based on URL
  const currentCategory = useMemo(() => {
    const slug = (child || parent || "").toLowerCase().trim();
    return categories.find(cat => (cat.path || "").toLowerCase().trim() === slug);
  }, [categories, parent, child]);

  // 2. Identify Subcategories (if we are in a parent)
  const subcategories = useMemo(() => {
    if (!currentCategory) return [];
    return categories.filter(cat => cat.parentId === currentCategory.id);
  }, [categories, currentCategory]);

  // 3. Filter Products
  const filteredProducts = useMemo(() => {
    if (!currentCategory || !products.length) return [];

    const familyIds = [
      currentCategory.id,
      ...subcategories.map(sub => sub.id)
    ];

    return products.filter(product => {
      const pCatId = product.categoryId || product.category?.id || product.category;
      return familyIds.includes(Number(pCatId));
    });
  }, [products, currentCategory, subcategories]);

  if (!currentCategory) return <div className="mt-20 text-center text-gray-500">Category not found</div>;

  return (
    <div className="mt-16 px-4 min-h-[60vh] max-w-7xl mx-auto flex flex-col items-center">
      
      {/* --- ⭐ PROFESSIONAL BREADCRUMBS (Navigation Return) --- */}
      <nav className="w-full flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8 self-start">
        <Link to="/" className="hover:text-orange-600 transition-colors">Accueil</Link>
        <span>/</span>
        {child ? (
          <>
            <Link to={`/products/${parent}`} className="hover:text-orange-600 transition-colors">
              {parent.replace(/-/g, ' ')}
            </Link>
            <span>/</span>
            <span className="text-orange-600">{currentCategory.text}</span>
          </>
        ) : (
          <span className="text-orange-600">{currentCategory.text}</span>
        )}
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        {/* Back Arrow Button for Mobile/Deep Navigation */}
        {child && (
          <Link 
            to={`/products/${parent}`} 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-orange-600 transition-all mb-4 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> RETOUR À {parent.replace(/-/g, ' ')}
          </Link>
        )}
        
        <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
          {currentCategory.text}
        </h2>
        <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
        <p className="text-gray-500 mt-4 italic">
          {child ? `Toute la sélection ${currentCategory.text}` : `Explorez notre collection ${currentCategory.text}`}
        </p>
      </div>

      {/* --- SUBCATEGORY NAVIGATION --- */}
      {!child && subcategories.length > 0 && (
        <div className="mb-16 w-full flex flex-col items-center">
          <h3 className="text-sm font-black mb-8 text-gray-300 uppercase text-center tracking-[0.2em]">Sous-Catégories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full justify-items-center">
            {subcategories.map((sub) => (
              <Link 
                key={sub.id} 
                to={`/products/${parent}/${sub.path}`} 
                className="group flex flex-col items-center w-full"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 bg-white shadow-md border-2 border-transparent group-hover:border-orange-500 transition-all duration-300">
                  <img src={sub.image} alt={sub.text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-orange-600 text-center uppercase tracking-tight">{sub.text}</span>
              </Link>
            ))}
          </div>
          <hr className="mt-16 border-gray-100 w-full" />
        </div>
      )}

      {/* Product Grid */}
      <div className="w-full flex flex-col items-center">
        <h3 className="text-sm font-black mb-10 text-gray-300 uppercase text-center tracking-[0.2em]">Nos Produits</h3>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 w-full justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl w-full border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeProductList;