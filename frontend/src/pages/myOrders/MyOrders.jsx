// import React, { useEffect, useState } from "react";
// import { useAppContext } from "../../context/AppContext";

// const MyOrders = () => {
//   // const [myOrders, setMyOrders] = useState([]);
//   const { currency, axios, user, orders, fetchOrders } = useAppContext();

//   // THE COLOR FOR THE STATUS
//   const statusStyles = {
//     Pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
//     "Order Placed": {
//       bg: "bg-blue-50",
//       text: "text-blue-600",
//       dot: "bg-blue-500",
//     },
//     Processing: {
//       bg: "bg-indigo-50",
//       text: "text-indigo-600",
//       dot: "bg-indigo-500",
//     },
//     Shipped: {
//       bg: "bg-purple-50",
//       text: "text-purple-600",
//       dot: "bg-purple-500",
//     },
//     Delivered: {
//       bg: "bg-green-50",
//       text: "text-green-700",
//       dot: "bg-green-500",
//     },
//     Cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
//   };

//   // const fetchMyOrders = async () => {
//   //   try {
//   //     const { data } = await axios.get("/api/order/user");
//   //     if (data.success) {
//   //       setMyOrders(data.orders);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   // useEffect(() => {
//   //   if (user) {
//   //     fetchMyOrders();
      
//   //   }
//   // }, [user]);

//   useEffect(() => {
//     if (user) {
//       fetchOrders(); // 4. This updates the global 'orders' state
//     }
//   }, [user, fetchOrders]); // 5. Added fetchOrders to dependencies

//   return (
//     <div className="mt-16 pb-16 px-4 md:px-10 max-w-5xl mx-auto">
//       {/* --- TITRE CENTRÉ ET DESIGN --- */}
//       <div className="flex flex-col items-center mb-12 text-center">
//         <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider">
//           Historique de mes <span className="text-indigo-600">Commandes</span>
//         </h1>
//         <div className="w-24 h-1.5 bg-indigo-600 rounded-full mt-2"></div>
//         <p className="text-gray-500 mt-3 italic">
//           Suivez l'état et le détail de vos achats
//         </p>
//       </div>

//       {/* --- LISTE DES COMMANDES --- */}
//       <div className="space-y-10">
//         {myOrders.length > 0 ? (
//           myOrders.map((order, index) => (
//             <div
//               key={index}
//               className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white"
//             >
//               {/* Header de la commande */}
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
//                 <div className="flex flex-col gap-1">
//                   <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
//                     ID Commande
//                   </span>
//                   <span className="text-sm font-medium text-gray-700">
//                     #{order.id}
//                   </span>
//                 </div>
//                 <div className="flex flex-col gap-1 md:text-center">
//                   <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
//                     Date
//                   </span>
//                   <span className="text-sm font-medium text-gray-700">
//                     {new Date(order.createdAt).toLocaleDateString("fr-FR")}
//                   </span>
//                 </div>
//                 <div className="flex flex-col gap-1 md:text-center">
//                   <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
//                     Méthode
//                   </span>
//                   <span className="text-sm font-medium text-gray-700">
//                     {order.paymentType}
//                   </span>
//                 </div>
//                 <div className="flex flex-col gap-1 md:text-right">
//                   <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
//                     Total Commande
//                   </span>
//                   <span className="text-sm font-bold text-indigo-600">
//                     {order.amount} {currency}
//                   </span>
//                 </div>
//               </div>

//               {/* Nouveau: Résumé de livraison (User Info) */}
//               {order.address && (
//                 <div className="px-6 py-3 bg-indigo-50/30 border-b border-gray-100 flex items-center justify-between">
//                   <p className="text-[11px] text-gray-500 italic">
//                     Livré à:{" "}
//                     <span className="font-bold text-gray-700">
//                       {order.address.firstName} {order.address.lastName}
//                     </span>{" "}
//                     — {order.address.street} {order.address.city},{" "}
//                     {order.address.country}{" "}
//                     <span className="ml-2 font-bold text-indigo-600">
//                       ({order.address.phone})
//                     </span>
//                   </p>
//                   <span
//                     className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
//                   >
//                     {order.isPaid ? "PAYÉ" : "NON PAYÉ"}
//                   </span>
//                 </div>
//               )}

//               {/* Détails des produits de la commande */}
//               <div className="divide-y divide-gray-100">
//                 {order.items.map((item, itemIdx) => (
//                   <div
//                     key={itemIdx}
//                     className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors"
//                   >
//                     <div className="flex items-center w-full md:w-auto">
//                       <div className="bg-gray-100 p-2 rounded-xl border border-gray-200 flex-shrink-0">
//                         <img
//                           src={
//                             Array.isArray(item.product?.image)
//                               ? item.product?.image[0]
//                               : item.product?.image || "/placeholder.png"
//                           }
//                           alt={item.product?.name}
//                           className="w-20 h-20 object-contain"
//                         />
//                       </div>
//                       <div className="ml-5">
//                         <h2 className="text-lg font-bold text-gray-800 leading-tight">
//                           {item.product?.name}
//                         </h2>

//                         <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
//                           {/* <p className="text-xs text-gray-500">
//                             Catégorie :{" "}
//                             <span className="text-gray-700">
//                               {item.product?.categ?.text || "Non spécifiée"}
//                             </span>
//                           </p> */}

//                           <p className="text-xs text-gray-500">
//                             Catégorie :{" "}
//                             <span className="text-gray-700 font-medium">
//                               {/* This shows "Parent > Child" if parent exists */}
//                               {item.product?.categ?.parent?.text
//                                 ? `${item.product.categ.parent.text} > `
//                                 : ""}
//                               {item.product?.categ?.text || "Non spécifiée"}
//                             </span>
//                           </p>
//                           {item.variant && (
//                             <p className="text-xs text-gray-500">
//                               Option :{" "}
//                               <span className="text-indigo-600 font-semibold">
//                                 {item.variant}
//                               </span>
//                             </p>
//                           )}
//                         </div>

//                         <div className="flex items-center gap-3 mt-3">
//                           <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase">
//                             Qté: {item.quantity || "1"}
//                           </span>
//                           <span className="text-xs text-gray-400 font-medium">
//                             Prix Unitaire: {item.product?.offerPrice} {currency}
//                           </span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* --- PROFESSIONAL STATUS BADGE --- */}
//                     <div className="flex flex-col md:items-center w-full md:w-auto space-y-2">
//                       <div
//                         className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusStyles[order.status]?.bg || "bg-gray-50"} ${statusStyles[order.status]?.text || "text-gray-500"} border-current/10`}
//                       >
//                         {/* Dynamic Dot */}
//                         <div
//                           className={`w-2 h-2 rounded-full ${statusStyles[order.status]?.dot || "bg-gray-400"} ${order.status !== "Delivered" && order.status !== "Cancelled" ? "animate-pulse" : ""}`}
//                         ></div>

//                         {/* Status Text */}
//                         <span className="font-black uppercase tracking-tighter text-[10px]">
//                           {order.status}
//                         </span>
//                       </div>

//                       <p className="text-gray-400 text-[10px] font-medium">
//                         Mise à jour:{" "}
//                         {new Date(
//                           order.updatedAt || order.createdAt,
//                         ).toLocaleDateString("fr-FR")}{" "}
//                         à{" "}
//                         {new Date(
//                           order.updatedAt || order.createdAt,
//                         ).toLocaleTimeString("fr-FR", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                     </div>

//                     <div className="w-full md:w-auto text-right border-t md:border-none pt-4 md:pt-0">
//                       <p className="text-xs text-gray-400 uppercase font-bold">
//                         Sous-total
//                       </p>
//                       <p className="text-xl font-black text-indigo-900">
//                         {(item.product?.offerPrice * item.quantity).toFixed(2)}{" "}
//                         {currency}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
//             <p className="text-gray-400">
//               Vous n'avez pas encore passé de commande.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyOrders;


 



import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const MyOrders = () => {
  // Use global state and functions from Context
  const { currency, user, orders, fetchOrders } = useAppContext();

  const statusStyles = {
    Pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
    "Order Placed": { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
    Processing: { bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    Shipped: { bg: "bg-purple-50", text: "text-purple-600", dot: "bg-purple-500" },
    Delivered: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
    Cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  return (
    <div className="mt-16 pb-16 px-4 md:px-10 max-w-5xl mx-auto">
      {/* --- TITRE --- */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wider">
          Historique de mes <span className="text-indigo-600">Commandes</span>
        </h1>
        <div className="w-24 h-1.5 bg-indigo-600 rounded-full mt-2"></div>
        <p className="text-gray-500 mt-3 italic">
          Suivez l'état et le détail de vos achats
        </p>
      </div>

      {/* --- LISTE DES COMMANDES --- */}
      <div className="space-y-10">
        {/* Fixed: Use 'orders' from context instead of 'myOrders' */}
        {orders && orders.length > 0 ? (
          orders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white"
            >
              {/* Header de la commande */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    ID Commande
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    #{order.id}
                  </span>
                </div>
                <div className="flex flex-col gap-1 md:text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    Date
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex flex-col gap-1 md:text-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    Méthode
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {order.paymentType}
                  </span>
                </div>
                <div className="flex flex-col gap-1 md:text-right">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    Total Commande
                  </span>
                  <span className="text-sm font-bold text-indigo-600">
                    {order.amount} {currency}
                  </span>
                </div>
              </div>

              {/* Résumé de livraison */}
              {order.address && (
                <div className="px-6 py-3 bg-indigo-50/30 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-[11px] text-gray-500 italic">
                    Livré à:{" "}
                    <span className="font-bold text-gray-700">
                      {order.address.firstName} {order.address.lastName}
                    </span>{" "}
                    — {order.address.street} {order.address.city},{" "}
                    {order.address.country}{" "}
                    <span className="ml-2 font-bold text-indigo-600">
                      ({order.address.phone})
                    </span>
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {order.isPaid ? "PAYÉ" : "NON PAYÉ"}
                  </span>
                </div>
              )}

              {/* Produits */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center w-full md:w-auto">
                      <div className="bg-gray-100 p-2 rounded-xl border border-gray-200 flex-shrink-0">
                        <img
                          src={
                            Array.isArray(item.product?.image)
                              ? item.product?.image[0]
                              : item.product?.image || "/placeholder.png"
                          }
                          alt={item.product?.name}
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                      <div className="ml-5">
                        <h2 className="text-lg font-bold text-gray-800 leading-tight">
                          {item.product?.name}
                        </h2>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <p className="text-xs text-gray-500">
                            Catégorie :{" "}
                            <span className="text-gray-700 font-medium">
                              {item.product?.categ?.parent?.text
                                ? `${item.product.categ.parent.text} > `
                                : ""}
                              {item.product?.categ?.text || "Non spécifiée"}
                            </span>
                          </p>
                          {item.variant && (
                            <p className="text-xs text-gray-500">
                              Couleur :{" "}
                              <span className="text-indigo-600 font-semibold">
                                {item.variant}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-3">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-md uppercase">
                            Qauntité: {item.quantity || "1"}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            Prix Unitaire: {item.product?.offerPrice} {currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge Statut */}
                    <div className="flex flex-col md:items-center w-full md:w-auto space-y-2">
                      <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusStyles[order.status]?.bg || "bg-gray-50"} ${statusStyles[order.status]?.text || "text-gray-500"} border-current/10`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${statusStyles[order.status]?.dot || "bg-gray-400"} ${order.status !== "Delivered" && order.status !== "Cancelled" ? "animate-pulse" : ""}`}
                        ></div>
                        <span className="font-black uppercase tracking-tighter text-[10px]">
                          {order.status}
                        </span>
                      </div>

                      <p className="text-gray-400 text-[10px] font-medium">
                         Mise à jour:{" "}
                         {new Date(
                           order.updatedAt || order.createdAt,
                         ).toLocaleDateString("fr-FR")}{" "}
                         à{" "}
                         {new Date(
                           order.updatedAt || order.createdAt,
                         ).toLocaleTimeString("fr-FR", {
                           hour: "2-digit",
                           minute: "2-digit",
                         })}
                      </p>
                    </div>

                    <div className="w-full md:w-auto text-right border-t md:border-none pt-4 md:pt-0">
                      <p className="text-xs text-gray-400 uppercase font-bold">Sous-total</p>
                      <p className="text-xl font-black text-indigo-900">
                        {(item.product?.offerPrice * item.quantity).toFixed(2)} {currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400">Vous n'avez pas encore passé de commande.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;