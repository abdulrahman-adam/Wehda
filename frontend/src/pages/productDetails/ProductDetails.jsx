import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard/ProductCard";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);

  const product = useMemo(() => {
    return products.find((item) => String(item.id) === String(id));
  }, [products, id]);

  const toggleVariant = (v) => {
    setSelectedVariants((prev) =>
      prev.includes(v) ? prev.filter((item) => item !== v) : [...prev, v]
    );
  };

  useEffect(() => {
    if (product && products.length > 0) {
      const filtered = products.filter(
        (item) => item.category === product.category && item.id !== product.id
      );
      setRelatedProducts(filtered.slice(0, 5));
    }
    setSelectedVariants([]);
    window.scrollTo(0, 0);
  }, [id, products, product]);

  useEffect(() => {
    if (product?.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  const handleAddToCart = (isBuyNow = false) => {
    if (product.variants?.length > 0 && selectedVariants.length === 0) {
      return toast.error("Veuillez sélectionner au moins une option");
    }
    const variantString = selectedVariants.sort().join("-");
    addToCart(product.id, variantString);

    if (isBuyNow) {
      navigate("/cart");
    } else {
      toast.success("Ajouté au panier ! ✨");
    }
  };

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen">
      {/* Reduced outer container padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        
        {/* Tightened Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[12px] text-gray-400 mb-4 overflow-x-auto whitespace-nowrap no-scrollbar">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">Store</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          
          {/* LEFT: IMAGES (Takes 7/12 columns on desktop) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-3">
            {/* Optimized Thumbnails - smaller and tighter */}
            <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar">
              {product.image.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(img)}
                  className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 transition-all ${
                    thumbnail === img ? "border-indigo-600" : "border-gray-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover rounded-md" />
                </div>
              ))}
            </div>

            {/* Main Image - Maximize view space */}
            <div className="flex-1 order-1 md:order-2 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
              <img src={thumbnail} alt="" className="w-full h-auto aspect-square object-cover" />
            </div>
          </div>

          {/* RIGHT: CONTENT (Takes 5/12 columns on desktop) */}
          <div className="lg:col-span-5 flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-3">{product.name}</h1>
            
            {/* Tightened Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <img key={i} src={assets.star_icon} className="w-3 h-3" alt="" />
                ))}
              </div>
              <span className="text-[11px] text-gray-400 font-bold">(120 REVIEWS)</span>
            </div>

            {/* Compact Pricing Section */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-black text-gray-900">{currency}{product.offerPrice}</span>
              <span className="text-lg text-gray-300 line-through">{currency}{product.price}</span>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                SAVE {Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
              </span>
            </div>

            {/* Options - More compact buttons */}
            <div className="mb-8">
              <h3 className="text-[11px] font-black uppercase text-gray-400 mb-3 tracking-widest">Select Variant</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => toggleVariant(v)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-lg border-2 transition-all ${
                      selectedVariants.includes(v)
                        ? "bg-black border-black text-white"
                        : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Tighter Description List */}
            <div className="mb-8 py-6 border-y border-gray-50">
              <ul className="space-y-2">
                {product.description.map((desc, index) => (
                  <li key={index} className="flex gap-3 text-gray-600 text-[13px] leading-relaxed">
                    <span className="text-indigo-500 font-bold">•</span>
                    {desc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons - Fixed to bottom on mobile? (Optional) */}
            <div className="flex flex-row gap-3">
              <button
                onClick={() => handleAddToCart(false)}
                className="flex-1 py-4 text-xs font-black uppercase tracking-widest border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all active:scale-95"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleAddToCart(true)}
                className="flex-[1.5] py-4 text-xs font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products - Tighter spacing */}
        <div className="mt-16 pt-10 border-t border-gray-50">
          <h2 className="text-xl font-black text-center mb-8 uppercase tracking-widest">Related Gear</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {relatedProducts.filter(p => p.inStock).map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;