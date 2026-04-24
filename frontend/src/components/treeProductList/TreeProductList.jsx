import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../../components/productCard/ProductCard";

const TreeProductList = () => {
  const { products, categories } = useAppContext();
  const { parent, child, grandchild } = useParams();

  // 1. Find the current category object based on URL
  const currentCategory = useMemo(() => {
    const slug = (grandchild || child || parent || "").toLowerCase().trim();
    const found = categories.find(cat => (cat.path || "").toLowerCase().trim() === slug);
    console.log("URL Slug:", slug, "Category Found:", found); // DEBUG LOG
    return found;
  }, [categories, parent, child, grandchild]);

  // 2. Identify Subcategories (For the circular navigation UI)
  const subcategories = useMemo(() => {
    if (!currentCategory) return [];
    return categories.filter(cat => Number(cat.parentId) === Number(currentCategory.id));
  }, [categories, currentCategory]);

  // 3. Filter Products (RECURSIVE - This finds products in all sub-levels)
  const filteredProducts = useMemo(() => {
    if (!currentCategory || !products.length) return [];

    // Helper to find every single ID belonging to this branch
    const getAllDescendantIds = (parentId) => {
      const children = categories.filter(cat => Number(cat.parentId) === Number(parentId));
      let ids = children.map(c => c.id);
      children.forEach(c => {
        ids = [...ids, ...getAllDescendantIds(c.id)];
      });
      return ids;
    };

    const familyIds = [currentCategory.id, ...getAllDescendantIds(currentCategory.id)];
    console.log("Current Cat ID:", currentCategory.id, "Total Family IDs:", familyIds); // DEBUG LOG

    return products.filter(product => {
      const pCatId = product.categoryId || product.category?.id || product.category;
      return familyIds.includes(Number(pCatId));
    });
  }, [products, currentCategory, categories]);

  if (!currentCategory) {
    return <div className="mt-20 text-center text-gray-500 font-black uppercase tracking-widest">Catégorie introuvable</div>;
  }

  return (
    <div className="mt-16 px-4 min-h-[60vh] max-w-7xl mx-auto flex flex-col items-center">
      
      {/* BREADCRUMBS */}
      <nav className="w-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 self-start">
        <Link to="/" className="hover:text-orange-600 transition-colors">Accueil</Link>
        <span>/</span>
        <Link to={`/products/${parent}`} className="hover:text-orange-600">
          {parent?.replace(/-/g, ' ')}
        </Link>
        {child && (
          <>
            <span>/</span>
            <Link to={`/products/${parent}/${child}`} className="hover:text-orange-600">
              {child.replace(/-/g, ' ')}
            </Link>
          </>
        )}
        {grandchild && (
          <>
            <span>/</span>
            <span className="text-orange-600">{currentCategory.text}</span>
          </>
        )}
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">
          {currentCategory.text}
        </h2>
        <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full"></div>
      </div>

      {/* SUBCATEGORY CIRCLES (UI) - CENTERED */}
      {subcategories.length > 0 && (
        <div className="mb-16 w-full flex flex-col items-center">
          <h3 className="text-[10px] font-black mb-8 text-gray-300 uppercase tracking-[0.3em]">Collections</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 w-full max-w-4xl">
            {subcategories.map((sub) => (
              <Link 
                key={sub.id} 
                to={child ? `/products/${parent}/${child}/${sub.path}` : `/products/${parent}/${sub.path}`} 
                className="group flex flex-col items-center"
              >
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-4 bg-white shadow-sm border-2 border-transparent group-hover:border-orange-500 transition-all">
                  <img src={sub.image || "/logo.jpeg"} alt={sub.text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 group-hover:text-orange-600 uppercase text-center">{sub.text}</span>
              </Link>
            ))}
          </div>
          <hr className="mt-16 border-gray-100 w-full" />
        </div>
      )}

      {/* PRODUCTS GRID - 2 COLUMNS ON MOBILE, CENTERED ON LARGE */}
    {/* PRODUCTS GRID - PERFECTLY CENTERED ON ALL SCREENS */}
      <div className="w-full flex flex-col items-center">
        <h3 className="text-[10px] font-black mb-10 text-gray-300 uppercase tracking-[0.3em]">
          Nos Produits ({filteredProducts.length})
        </h3>
        
        {filteredProducts.length > 0 ? (
          /* We use 'flex-wrap' with 'justify-center' to ensure that 
             if there are 1, 2, or 3 products, they always sit in the middle.
          */
          <div className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full max-w-7xl">
            {filteredProducts.map((product) => (
              /* On mobile: w-[calc(50%-6px)] creates exactly 2 columns.
                 On desktop: w-72 (or your ProductCard default width)
              */
              <div 
                key={product.id} 
                className="w-[calc(50%-8px)] sm:w-auto flex justify-center"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] w-full border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">
              Aucun produit trouvé
            </p>
          </div>
        )}
      </div>



    </div>
  );
};

export default TreeProductList;