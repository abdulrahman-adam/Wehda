

import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard/ProductCard";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart, categories } = useAppContext();
  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const product = useMemo(() => {
    return products.find((item) => String(item.id) === String(id));
  }, [products, id]);

  useEffect(() => {
    if (product && products.length > 0) {
      const pCat = product.category;
      const filtered = products.filter(item => item.category === pCat && item.id !== product.id);
      setRelatedProducts(filtered.slice(0, 5));
      setThumbnail(product.image[0]);
    }
    // Reset selections on product change
    setSelectedVariants([]);
    setSelectedColors([]);
    window.scrollTo(0, 0);
  }, [id, product, products]);

  const toggleVariant = (v) => {
    setSelectedVariants(prev => prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v]);
  };

  const toggleColor = (c) => {
    setSelectedColors(prev => prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]);
  };

  const handleAddToCart = (isBuyNow = false) => {
    if (product.variants?.length > 0 && selectedVariants.length === 0) {
      return toast.error("Veuillez sélectionner une taille/option");
    }
    if (product.colors?.length > 0 && selectedColors.length === 0) {
      return toast.error("Veuillez sélectionner une couleur");
    }
    
    const variantKey = `${selectedVariants.join("-")}-${selectedColors.join("-")}`;
    addToCart(product.id, variantKey);
    
    if (isBuyNow) navigate("/cart");
    else toast.success("Ajouté au panier ! ✨");
  };

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* BREADCRUMB - Responsive Visibility */}
{/* PREMIUM SMART BREADCRUMB */}



{/* BREADCRUMB SECTION */}

{/* PREMIUM SMART BREADCRUMB */}
{product && (
  // <nav className="hidden sm:flex items-center gap-2 text-[10px] md:text-[11px] text-gray-400 mb-8 uppercase tracking-[0.15em] font-bold">
  <nav className="flex items-center flex-wrap gap-2 text-[10px] md:text-[11px] text-gray-400 mb-8 uppercase tracking-[0.15em] font-bold">
    <Link to="/" className="hover:text-black transition-colors">Accueil</Link>
    <span className="text-gray-300">/</span>
    <Link to="/products" className="hover:text-black transition-colors">Boutique</Link>
    <span className="text-gray-300">/</span>
    
    {(() => {
      // 1. Get the category ID from the product (Handle MySQL variants)
      const pCatId = product.categoryId || product.category?.id || product.category;

      // 2. Find the actual category object from your AppContext 'categories' array
      const categoryObject = categories.find(cat => String(cat.id) === String(pCatId));

      // 3. If we found it, use its 'path' and 'text'. If not, fallback to "Article"
      if (categoryObject) {
        return (
          <Link 
            to={`/products/${categoryObject.path}`} 
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {categoryObject.text}
          </Link>
        );
      }

      return <span className="text-gray-500">Article</span>;
    })()}

    <span className="text-gray-300">/</span>
    
    <span className="text-gray-900 max-w-[200px] truncate">
      {product.name}
    </span>
  </nav>
)}




        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* LEFT: IMAGE GALLERY (Mobile: Stacked | Tablet: Side-by-Side) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            {/* Thumbnails List */}
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 md:py-0">
              {product.image?.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setThumbnail(img)}
                  className={`relative shrink-0 w-20 h-20 rounded-xl border-2 transition-all cursor-pointer overflow-hidden bg-gray-50 ${
                    thumbnail === img ? 'border-indigo-600 scale-95' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain p-1" alt="" />
                </div>
              ))}
            </div>

            {/* Main Preview */}
            <div className="flex-1 order-1 md:order-2 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
              <img src={thumbnail} className="w-full h-full object-contain hover:scale-105 transition-transform duration-700" alt={product.name} />
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-900">{product.offerPrice}{currency}</span>
                  {product.price > product.offerPrice && (
                    <span className="text-xl text-gray-300 line-through font-medium">{product.price}{currency}</span>
                  )}
                </div>
                {product.price > product.offerPrice && (
                  <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-1 rounded">
                    PROMO
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100 w-full mb-8" />

            {/* COLORS SELECTOR */}
            {product.colors?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Choisir Couleur</h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c, i) => (
                    <button 
                      key={i} 
                      onClick={() => toggleColor(c)}
                      style={{ backgroundColor: c.toLowerCase() }}
                      className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${
                        selectedColors.includes(c) ? 'border-black ring-2 ring-indigo-200 scale-110' : 'border-transparent'
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* VARIANTS SELECTOR */}
            {product.variants?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Sélectionner Taille / Option</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => (
                    <button 
                      key={i} 
                      onClick={() => toggleVariant(v)} 
                      className={`px-6 py-3 rounded-xl border-2 font-bold text-sm transition-all active:scale-95 ${
                        selectedVariants.includes(v) 
                        ? 'bg-black border-black text-white shadow-xl' 
                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="mb-10">
              <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">Description</h3>
              <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 mt-auto">
              <button 
                onClick={() => handleAddToCart(false)} 
                className="flex-1 py-5 rounded-2xl border-2 border-black font-black uppercase text-[11px] tracking-widest hover:bg-black hover:text-white transition-all active:scale-95"
              >
                Ajouter au Panier
              </button>
              <button 
                onClick={() => handleAddToCart(true)} 
                className="flex-[1.5] py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Acheter Maintenant
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">✅</div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Paiement Sécurisé</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">🚚</div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Livraison Rapide</p>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <div className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic">Vous aimerez aussi</h2>
            <div className="h-px flex-1 bg-gray-100 ml-8 hidden sm:block"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;