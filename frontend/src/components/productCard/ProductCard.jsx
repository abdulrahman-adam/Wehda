

import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, cartItems, addToCart, removeFromCart, navigate } = useAppContext();
  
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const toggleVariant = (v) => {
    setSelectedVariants(prev => 
      prev.includes(v) ? prev.filter(i => i !== v) : [...prev, v]
    );
  };

  const toggleColor = (c) => {
    setSelectedColors(prev => 
      prev.includes(c) ? prev.filter(i => i !== c) : [...prev, c]
    );
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.variants?.length && !selectedVariants.length) {
      return alert("Veuillez choisir une variante (ex: Taille)");
    }
    if (product.colors?.length && !selectedColors.length) {
      return alert("Veuillez choisir une couleur");
    }
    
    const variantKey = `${selectedVariants.join("-")}-${selectedColors.join("-")}`;
    addToCart(product.id, variantKey);
  };

  if (!product) return null;

  return (
    <div
      onClick={() => {
        navigate(`/product/${product.id}`);
        window.scrollTo(0, 0);
      }}
      
      /* RESPONSIVE LOGIC:
         - Mobile: w-[calc(50%-8px)] creates 2 columns with a small gap.
         - Tablet/Desktop: sm:w-[230px] keeps fixed size.
         - mx-auto: ensures centering within its grid cell.
      */

      className="group relative border border-gray-100 rounded-xl bg-white w-full h-[390px] sm:w-[230px] min-h-[400px] sm:min-h-[420px] md:h-[460px] p-2 flex flex-col justify-between transition-all hover:shadow-2xl hover:border-indigo-100 mb-4 sm:mb-10 cursor-pointer mx-auto"
    >
      {/* DISCOUNT BADGE */}
      {product.price > product.offerPrice && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{Math.round(((product.price - product.offerPrice) / product.price) * 100)}%
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative flex items-center justify-center h-[140px] sm:h-[180px] w-full overflow-hidden rounded-lg bg-gray-50">
        <img 
          className="group-hover:scale-110 transition-transform duration-500 max-h-full object-contain p-2" 
          src={product.image[0]} 
          alt={product.name} 
        />
      </div>

      {/* INFO SECTION */}
      <div className="flex-1 flex flex-col mt-3 gap-1">
        <div className="flex justify-between items-start">
          <p className="uppercase text-[8px] sm:text-[9px] font-black tracking-widest text-indigo-500">{product.category}</p>
        </div>
        
        <h3 className="text-gray-800 font-bold text-xs sm:text-sm leading-tight line-clamp-1">{product.name}</h3>
        
        <p className="hidden sm:line-clamp-2 text-gray-400 text-[11px] leading-relaxed mt-1">
          {product.description}
        </p>

        {/* COLORS SELECTION */}
        {product.colors?.length > 0 && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase mb-1">Couleurs</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={() => toggleColor(c)}
                  style={{ backgroundColor: c.toLowerCase() }}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border shadow-sm transition-transform ${
                    selectedColors.includes(c) ? "scale-125 border-black ring-1 ring-offset-1 ring-gray-300" : "border-gray-200"
                  }`}
                  title={c}
                />
              ))}
            </div>
          </div>
        )}

        {/* VARIANTS SELECTION */}
        {product.variants?.length > 0 && (
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase mb-1">Options</p>
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 4).map((v, i) => (
                <button 
                  key={i} 
                  onClick={() => toggleVariant(v)} 
                  className={`text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 rounded-md border font-medium transition-all ${
                    selectedVariants.includes(v) 
                      ? "bg-indigo-600 border-indigo-600 text-white" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PRICE & ACTION SECTION */}
        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
            <span className="text-base sm:text-lg font-black text-gray-900">
              {product.offerPrice} <span className="text-[10px] sm:text-sm font-normal">{currency}</span>
            </span>
            {product.price > product.offerPrice && (
              <span className="text-[10px] sm:text-xs text-gray-300 line-through">
                {product.price} {currency}
              </span>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {!cartItems[product.id] ? (
              <button 
                onClick={handleAddToCart} 
                className="group/btn flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-indigo-600 w-full py-2 rounded-lg text-white text-[10px] sm:text-xs font-bold transition-all active:scale-95 shadow-md"
              >
                <img src={assets.cart_icon} className="w-3 h-3 invert" alt="" /> 
                <span className="truncate">Ajouter</span>
              </button>
            ) : (
              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg py-1 px-1 overflow-hidden">
                <button 
                  onClick={() => removeFromCart(product.id)} 
                  className="w-7 h-7 sm:w-8 sm:h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors font-bold"
                >
                  −
                </button>
                <span className="font-black text-xs sm:text-sm">{cartItems[product.id]}</span>
                <button 
                  onClick={() => addToCart(product.id)} 
                  className="w-7 h-7 sm:w-8 sm:h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors font-bold"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;