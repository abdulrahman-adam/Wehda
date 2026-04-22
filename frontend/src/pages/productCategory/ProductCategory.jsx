// // import React, { useMemo } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { useAppContext } from '../../context/AppContext';
// // import ProductCard from '../../components/productCard/ProductCard';

// // const ProductCategory = () => {
// //     const { products, categories } = useAppContext();
// //     const { category } = useParams();

// //     // Utilisation de useMemo pour la performance
// //     const filterProducts = useMemo(() => {
// //     if (!products) return [];

// //     return products.filter((product) => {
// //         // Nettoyage des données
// //         const productCat = product.category ? String(product.category).toLowerCase().trim() : "";
// //         const urlCat = category ? String(category).toLowerCase().trim() : "";

// //         // --- LA CORRECTION ---
// //         // On vérifie si l'un contient l'autre.
// //         // Ainsi, "electronics" (URL) matchera avec "electronic" (DB)
// //         return (
// //             productCat === urlCat ||
// //             productCat.includes(urlCat) ||
// //             urlCat.includes(productCat)
// //         );
// //     });
// // }, [products, category]);

// //     // Trouver le nom propre de la catégorie pour l'affichage
// //     const categoryInfo = categories.find(
// //         cat => (cat.name || cat.text).toLowerCase() === category.toLowerCase()
// //     );

// //     console.log("URL Category:", category);
// // console.log("Exemple catégorie produit:", products[0]?.category);
// //     return (
// //         <div className='mt-16 px-4 min-h-[60vh]'>
// //             {/* Titre de la Section */}
// //             <div className='flex flex-col items-center mb-10'>
// //                 <h2 className='text-3xl font-bold text-gray-800 uppercase tracking-widest'>
// //                     {categoryInfo ? (categoryInfo.name || categoryInfo.text) : category}
// //                 </h2>
// //                 <div className='w-24 h-1 bg-indigo-600 rounded-full mt-2'></div>
// //             </div>

// //             {filterProducts.length > 0 ? (
// //                 // <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 mt-6'>
// //                 //     {filterProducts.map((product) => (
// //                 //         <ProductCard key={product._id} product={product}/>
// //                 //     ))}
// //                 // </div>

// //                 <div className='flex flex-wrap justify-center gap-4 md:gap-8 mt-6 w-full'>
// //         {filterProducts.map((product) => (
// //             <ProductCard key={product._id} product={product}/>
// //         ))}
// //     </div>
// //             ) : (
// //                 <div className='flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200'>
// //                     <i className="bi bi-search text-5xl text-gray-300 mb-4"></i>
// //                     <p className='text-gray-500 text-xl font-medium'>
// //                         Aucun produit trouvé dans la catégorie <span className='text-indigo-600 font-bold'>"{category}"</span>
// //                     </p>
// //                     <button
// //                         onClick={() => window.history.back()}
// //                         className="mt-6 text-indigo-600 font-semibold hover:underline"
// //                     >
// //                         ← Retour aux catégories
// //                     </button>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // };

// // export default ProductCategory;

// import React, { useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { useAppContext } from "../../context/AppContext";
// import ProductCard from "../../components/productCard/ProductCard";

// const ProductCategory = () => {
//   const { products, categories } = useAppContext();
//   const { parent, child } = useParams();
//   const { category } = useParams();

// const filteredProducts = useMemo(() => {
//   if (!products) return [];

//   const parentSlug = (parent || "").toLowerCase().trim();
//   const childSlug = (child || "").toLowerCase().trim();

//   return products.filter((product) => {
//     const productCat = (
//       product.category?.path ||
//       product.category ||
//       ""
//     )
//       .toString()
//       .toLowerCase()
//       .trim();

//     // ✅ CASE 1: CHILD PAGE
//     if (childSlug) {
//       return productCat === childSlug;
//     }

//     // ✅ CASE 2: PARENT PAGE → include ALL children
//     const parentCategory = categories.find(
//       (cat) =>
//         (cat.path || "").toLowerCase().trim() === parentSlug
//     );

//     if (!parentCategory) return false;

//     const children = categories
//       .filter((cat) => cat.parentId === parentCategory.id)
//       .map((cat) => cat.path.toLowerCase());

//     return children.includes(productCat);
//   });
// }, [products, parent, child, categories]);

// //   const categoryInfo = categories.find(
// //     (cat) => (cat.name || cat.text).toLowerCase() === category.toLowerCase(),
// //   );

// const categoryInfo = useMemo(() => {
//   if (!category || !categories) return null;

//   const urlCat = category.toLowerCase().trim();

//   return categories.find((cat) => {
//     const name = (cat.name || cat.text || "").toLowerCase().trim();
//     return name === urlCat;
//   });
// }, [categories, category]);

//   return (
//     <div className="mt-16 px-4 min-h-[60vh]">
//       <div className="flex flex-col items-center mb-10">
//         <h2 className="text-3xl font-bold text-gray-800 uppercase tracking-widest">
//           {categoryInfo ? categoryInfo.name || categoryInfo.text : category}
//         </h2>
//         <div className="w-24 h-1 bg-indigo-600 rounded-full mt-2"></div>
//       </div>

//       {filterProducts.length > 0 ? (
//         <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6 w-full">
//           {filterProducts.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       ) : (
//         <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//           <i className="bi bi-search text-5xl text-gray-300 mb-4"></i>
//           <p className="text-gray-500 text-xl font-medium">
//             Aucun produit trouvé dans la catégorie{" "}
//             <span className="text-indigo-600 font-bold">"{category}"</span>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductCategory;

import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import ProductCard from "../../components/productCard/ProductCard";

const ProductCategory = () => {
  const { products, categories } = useAppContext();
  const { parent, child } = useParams();

  const filteredProducts = useMemo(() => {
    if (!products || !categories) return [];

    const parentSlug = (parent || "").toLowerCase().trim();
    const childSlug = (child || "").toLowerCase().trim();

    return products.filter((product) => {
      const productCat = (
        product.category?.path ||
        product.category ||
        ""
      )
        .toString()
        .toLowerCase()
        .trim();

      // ✅ CHILD PAGE → /products/fruits/apple
      if (childSlug) {
        return productCat === childSlug;
      }

      // ✅ PARENT PAGE → /products/fruits
      const parentCategory = categories.find(
        (cat) =>
          (cat.path || "").toLowerCase().trim() === parentSlug
      );

      if (!parentCategory) return false;

      const children = categories
        .filter((cat) => cat.parentId === parentCategory.id)
        .map((cat) => cat.path.toLowerCase());

      return children.includes(productCat);
    });
  }, [products, parent, child, categories]);

  return (
    <div className="mt-16 px-4 min-h-[60vh]">

      <h2 className="text-3xl text-center mb-6 uppercase">
        {child ? `${parent} / ${child}` : parent}
      </h2>

      {filteredProducts.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No products found
        </p>
      )}
    </div>
  );
};

export default ProductCategory;