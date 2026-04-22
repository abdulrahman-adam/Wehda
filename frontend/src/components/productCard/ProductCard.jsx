// import React from "react";
// import { assets } from "../../assets/assets";
// import { useAppContext } from "../../context/AppContext";

// const ProductCard = ({ product }) => {
//   // Getting the currency from AppContext
//   const { currency, cartItems, addToCart, removeFromCart, navigate } =
//     useAppContext();

//   return (
//     product && (
      
//         <div
//           onClick={() => {
//             navigate(
//               `/products/${product.category.toLowerCase()}/${product.id}`,
//             );
//             scrollTo(0, 0);
//           }}
//           // className="border border-gray-500/20 rounded-md bg-white 
//           //    w-full max-w-full sm:max-w-xs md:max-w-56 
//           //    h-[360px] px-3 sm:px-4 py-2 mx-auto 
//           //    flex flex-col justify-between mb-16"
//           className="border border-gray-500/20 rounded-md bg-white 
//              /* Mobile: 2 colonnes avec calc | Tablet/Laptop: Largeur fixe */
//              w-[calc(50%-10px)] sm:w-[220px] md:w-[224px] 
//              h-[380px] px-3 sm:px-4 py-2 
//              flex flex-col justify-between transition-all hover:shadow-lg mb-16"
//         >
//           {/* Section Image centrée */}
//           <div className="group cursor-pointer flex items-center justify-center px-2">
//             <img
//               className="group-hover:scale-105 transition w-full h-[160px]"
//               src={product.image[0]}
//               alt={product.name}
//             />
//           </div>

//           <div className="text-gray-500/60 text-sm">
//             <p>Catégorie: {product.category}</p>

//             <p className="text-gray-700 font-medium text-lg truncate w-full">
//               {product.name}
//             </p>

//             <p className="text-gray-500 truncate w-full">
//               {product.description}
//             </p>

//             {/* Section Étoiles */}
//             <div className="flex items-center gap-0.5">
//               {Array(5)
//                 .fill("")
//                 .map((_, i) => (
//                   <img
//                     key={i}
//                     src={i < 4 ? assets.star_icon : assets.star_dull_icon}
//                     alt=""
//                     className="md:w-3.5 w-3"
//                   />
//                 ))}
//               <p className="ml-1">(4)</p>
//             </div>

//             <div className="mt-3">
//               {/* Prix */}
//               <div className="mb-2">
//                 <p className="md:text-xl text-base font-medium">
//                   <span className="text-blue-600">
//                     {product.offerPrice} {currency}
//                   </span>
//                   &nbsp;&nbsp;
//                   <span className="text-gray-300 md:text-sm text-xs line-through">
//                     {product.price} {currency}
//                   </span>
//                 </p>
//               </div>

//               {/* Bouton Panier / Sélecteur Quantité */}
//               <div
//                 onClick={(e) => {
//                   e.stopPropagation();
//                 }}
//                 className="text-primary"
//               >
//                 {!cartItems[product.id] ? (
//                   <button
//                     className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/40 w-full h-[36px] rounded text-primary font-medium transition-colors hover:bg-primary/20"
//                     onClick={() => addToCart(product.id)}
//                   >
//                     <img
//                       src={assets.cart_icon}
//                       alt="cart_icon"
//                       className="w-4 h-4"
//                     />
//                     <span className="text-blue-600">Ajouter au Panier</span>
//                   </button>
//                 ) : (
//                   <div className="flex items-center justify-between gap-2 w-full h-[36px] bg-indigo-500/25 rounded select-none">
//                     <button
//                       onClick={() => removeFromCart(product.id)}
//                       className="cursor-pointer text-xl px-4 h-full font-bold hover:bg-indigo-500/10 rounded-l transition-colors"
//                     >
//                       −
//                     </button>

//                     <span className="flex-1 text-center font-medium">
//                       {cartItems[product.id]}
//                     </span>

//                     <button
//                       onClick={() => addToCart(product.id)}
//                       className="cursor-pointer text-xl px-4 h-full font-bold hover:bg-indigo-500/10 rounded-r transition-colors"
//                     >
//                       +
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
      
//     )
//   );
// };

// export default ProductCard;

import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const ProductCard = ({ product }) => {
  const {
    currency,
    cartItems,
    addToCart,
    removeFromCart,
    navigate,
  } = useAppContext();

  // ==================================================
  // ⭐ CHANGED: MULTI SELECT STATES
  // ==================================================
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // ==================================================
  // ⭐ TOGGLE VARIANTS
  // ==================================================
  const toggleVariant = (v) => {
    setSelectedVariants((prev) =>
      prev.includes(v)
        ? prev.filter((item) => item !== v)
        : [...prev, v]
    );
  };

  // ==================================================
  // ⭐ TOGGLE COLORS
  // ==================================================
  const toggleColor = (c) => {
    setSelectedColors((prev) =>
      prev.includes(c)
        ? prev.filter((item) => item !== c)
        : [...prev, c]
    );
  };

  // ==================================================
  // ⭐ ADD TO CART VALIDATION
  // ==================================================
  const handleAddToCart = (e) => {
    e.stopPropagation();

    if (product.variants?.length && selectedVariants.length === 0) {
      return alert("Veuillez choisir au moins une variante");
    }

    if (product.colors?.length && selectedColors.length === 0) {
      return alert("Veuillez choisir au moins une couleur");
    }

    const variantKey = `${selectedVariants.join("-")}-${selectedColors.join("-")}`;

    addToCart(product.id, variantKey);
  };

  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/products/${product.category.toLowerCase()}/${product.id}`
          );
          scrollTo(0, 0);
        }}
        className="border border-gray-500/20 rounded-md bg-white 
             w-[calc(50%-10px)] sm:w-[220px] md:w-[224px] 
             h-[380px] px-3 sm:px-4 py-2 
             flex flex-col justify-between transition-all hover:shadow-lg mb-16"
      >
        {/* IMAGE */}
        <div className="group cursor-pointer flex items-center justify-center px-2">
          <img
            className="group-hover:scale-105 transition w-full h-[160px]"
            src={product.image[0]}
            alt={product.name}
          />
        </div>

        <div className="text-gray-500/60 text-sm">
          <p>Catégorie: {product.category}</p>

          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>

          <p className="text-gray-500 truncate w-full">
            {product.description}
          </p>

          {/* ==================================================
              ⭐ MULTI VARIANTS
          ================================================== */}
          {product.variants?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.variants.map((v, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVariant(v);
                  }}
                  className={`text-xs px-2 py-1 rounded border ${
                    selectedVariants.includes(v)
                      ? "bg-black text-white"
                      : "bg-white"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* ==================================================
              ⭐ MULTI COLORS
          ================================================== */}
          {product.colors?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.colors.map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColor(c);
                  }}
                  className={`text-xs px-2 py-1 rounded border ${
                    selectedColors.includes(c)
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}

          {/* CART */}
          <div className="mt-3">
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-primary"
            >
              {!cartItems[product.id] ? (
                <button
                  className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/40 w-full h-[36px] rounded text-primary font-medium"
                  onClick={handleAddToCart}
                >
                  <img
                    src={assets.cart_icon}
                    alt="cart_icon"
                    className="w-4 h-4"
                  />
                  <span className="text-blue-600">Ajouter au Panier</span>
                </button>
              ) : (
                <div className="flex items-center justify-between gap-2 w-full h-[36px] bg-indigo-500/25 rounded">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-xl px-4 font-bold"
                  >
                    −
                  </button>

                  <span className="flex-1 text-center font-medium">
                    {cartItems[product.id]}
                  </span>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="text-xl px-4 font-bold"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;