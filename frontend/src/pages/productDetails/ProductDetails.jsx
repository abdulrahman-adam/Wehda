import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard/ProductCard";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ProductDetails = () => {
  const { products, navigate, currency, addToCart, categories } =
    useAppContext();
  const { id } = useParams();

  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // MODIFICATION : On passe d'un tableau [] à une valeur unique ""
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const product = useMemo(() => {
    return products.find((item) => String(item.id) === String(id));
  }, [products, id]);

  useEffect(() => {
    if (product && products.length > 0) {
      const pCat = product.category;
      const filtered = products.filter(
        (item) => item.category === pCat && item.id !== product.id,
      );
      setRelatedProducts(filtered.slice(0, 5));
      setThumbnail(product.image[0]);
    }
    // MODIFICATION : Reset avec des chaînes vides
    setSelectedVariant("");
    setSelectedColor("");
    window.scrollTo(0, 0);
  }, [id, product, products]);

  // MODIFICATION : Logique de choix unique (remplace l'ancienne valeur)
  const toggleVariant = (v) => {
    setSelectedVariant(v);
  };

  const toggleColor = (c) => {
    setSelectedColor(c);
  };

  const handleAddToCart = (isBuyNow = false) => {
    // MODIFICATION : Vérification de la chaîne (non vide)
    if (product.variants?.length > 0 && !selectedVariant) {
      return toast.error("Veuillez sélectionner une taille/option");
    }
    if (product.colors?.length > 0 && !selectedColor) {
      return toast.error("Veuillez sélectionner une couleur");
    }

    // MODIFICATION : Construction de la clé avec les valeurs uniques
    const variantKey = `${selectedVariant}-${selectedColor}`;
    addToCart(product.id, variantKey);

    if (isBuyNow) navigate("/cart");
    else toast.success("Ajouté au panier ! ✨");
  };

  if (!product) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 bg-gray-50/50 rounded-b-[40px] shadow-sm border-x border-b border-gray-100">
        {/* BREADCRUMB */}
        {product && (
          <nav className="flex items-center flex-wrap gap-2 text-[10px] md:text-[11px] text-gray-400 mb-10 uppercase tracking-[0.2em] font-bold">
            <Link to="/" className="hover:text-black transition-colors">Accueil</Link>
            <span className="text-gray-300">/</span>
            <Link to="/products" className="hover:text-black transition-colors">Boutique</Link>
            <span className="text-gray-300">/</span>
            {(() => {
              const pCatId = product.categoryId || product.category?.id || product.category;
              const categoryObject = categories.find((cat) => String(cat.id) === String(pCatId));
              return categoryObject ? (
                <Link to={`/products/${categoryObject.path}`} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                  {categoryObject.text}
                </Link>
              ) : <span className="text-gray-500">Article</span>;
            })()}
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 truncate max-w-[150px]">{product.name}</span>
          </nav>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
          {/* LEFT: IMAGE GALLERY */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6">
            <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar py-2">
              {product.image?.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setThumbnail(img)}
                  className={`relative shrink-0 w-20 h-20 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden bg-white shadow-sm ${
                    thumbnail === img ? "border-indigo-600 ring-4 ring-indigo-50 scale-95" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img src={img} className="w-full h-full object-contain p-2" alt="" />
                </div>
              ))}
            </div>

            <div className="flex-1 order-1 md:order-2 bg-white rounded-[40px] overflow-hidden border border-gray-100 flex items-center justify-center min-h-[450px] md:min-h-[600px] shadow-xl shadow-gray-200/50 group">
              <img
                src={thumbnail}
                className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-transform duration-1000 ease-out"
                alt={product.name}
              />
            </div>
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full mb-6 shadow-lg shadow-indigo-200">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tighter italic">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">
                    {product.offerPrice}<span className="text-xl ml-1">{currency}</span>
                  </span>
                  {product.price > product.offerPrice && (
                    <span className="text-2xl text-gray-300 line-through font-bold decoration-red-500/30">
                      {product.price}{currency}
                    </span>
                  )}
                </div>
                {product.price > product.offerPrice && (
                  <span className="animate-pulse bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg">
                    OFFRE LIMITÉE
                  </span>
                )}
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-gray-200 to-transparent w-full mb-10" />

            {/* COLOR SELECTOR */}
            {product.colors?.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                    Couleur Sélectionnée
                  </h3>
                  <span className="text-[10px] font-black uppercase text-indigo-600">
                    {selectedColor || "Choisir"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => toggleColor(c)}
                      style={{ backgroundColor: c.toLowerCase() }}
                      className={`w-10 h-10 rounded-full border-4 transition-all shadow-md active:scale-90 ${
                        selectedColor === c ? "border-white ring-2 ring-black scale-110" : "border-white hover:scale-105"
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* VARIANTS SELECTOR */}
            {product.variants?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase text-gray-400 mb-5 tracking-[0.2em]">Tailles Disponibles</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((v, i) => (
                    <button
                      key={i}
                      onClick={() => toggleVariant(v)}
                      className={`px-6 py-3 rounded-xl border-2 font-black text-xs uppercase transition-all tracking-widest ${
                        selectedVariant === v
                          ? "bg-black border-black text-white shadow-lg -translate-y-1"
                          : "bg-white border-gray-100 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION */}
            <div className="mb-12">
              <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-[0.2em]">À propos de cet article</h3>
              <p className="text-gray-600 leading-relaxed text-base font-medium italic">
                "{product.description}"
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mb-12 mt-auto">
              <button
                onClick={() => handleAddToCart(true)}
                className="w-full py-6 rounded-[24px] bg-indigo-600 text-white font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                Acheter Maintenant
                <span className="text-xl">→</span>
              </button>
              <button
                onClick={() => handleAddToCart(false)}
                className="w-full py-6 rounded-[24px] border-2 border-black font-black uppercase text-[12px] tracking-[0.2em] text-gray-900 hover:bg-black hover:text-white transition-all active:scale-95"
              >
                Ajouter au Panier
              </button>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-2 gap-6 py-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 italic text-xl">✨</div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">Authenticité<br/><span className="text-gray-900">Garantie 100%</span></p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 italic text-xl">🚚</div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-tight">Livraison<br/><span className="text-gray-900">Express Offerte</span></p>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-16 bg-gray-50"/>
        {/* RELATED PRODUCTS */}
        <div className="mt-2 pt-20 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black uppercase tracking-tighter italic text-gray-900">
                Vous aimerez aussi
              </h2>
              <p className="mt-4 text-gray-500 font-medium">Découvrez notre sélection exclusive pour compléter votre panier.</p>
            </div>
            <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent ml-12 mb-3"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-20">
            {relatedProducts.map((p) => (
              <div key={p.id} className="w-[calc(50%-12px)] sm:w-[220px] md:w-[240px] lg:w-[260px] shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;