import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link
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

  if (!currentCategory) return <div className="mt-20 text-center">Category not found</div>;

  return (
    <div className="mt-16 px-4 min-h-[60vh] max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold uppercase tracking-tighter">
          {currentCategory.text}
        </h2>
        <p className="text-gray-500 mt-2">
          {child ? `Viewing all in ${currentCategory.text}` : `Explore our ${currentCategory.text} collection`}
        </p>
      </div>

      {/* --- ⭐ NEW: SUBCATEGORY NAVIGATION --- */}
      {!child && subcategories.length > 0 && (
        <div className="mb-16 w-full flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-6 text-gray-400 uppercase text-center">Subcategories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full justify-items-center">
            {subcategories.map((sub) => (
              <Link 
                key={sub.id} 
                to={`/products/${parent}/${sub.path}`} 
                className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all border border-transparent hover:border-orange-200 w-full"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-white shadow-sm border group-hover:scale-110 transition-transform">
                  <img src={sub.image} alt={sub.text} className="w-full h-full object-cover" />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 text-center">{sub.text}</span>
              </Link>
            ))}
          </div>
          <hr className="mt-12 border-gray-100 w-full" />
        </div>
      )}

      {/* Product Grid */}
      <div className="w-full flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-6 text-gray-400 uppercase text-center">Products</h3>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400">No products directly in this category.</div>
        )}
      </div>
    </div>
  );
};

export default TreeProductList;