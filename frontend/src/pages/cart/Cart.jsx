import React, { useEffect, useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom"; // Added for Breadcrumb links

const Cart = () => {
  const {
    products,
    axios,
    currency,
    user,
    cartItems,
    removeFromCart,
    getCartCount,
    updateCartItems,
    navigate,
    getCartAmount,
    setShowUserLogin,
  } = useAppContext();

  const [cartArray, setCartArray] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");
  const [isLoaded, setIsLoaded] = useState(false);

  // --- 1. PROFESSIONAL VARIANT PARSING ---
  const getCart = () => {
    let tempArray = [];
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const parts = String(key).split("-");
        const productId = parts[0];
        const variantsFromKey = parts.slice(1);

        const product = products.find((item) => String(item.id) === String(productId));

        if (product) {
          tempArray.push({
            ...product,
            cartKey: key,
            quantity: cartItems[key],
            currentVariants: variantsFromKey,
          });
        }
      }
    }
    setCartArray(tempArray);
    setIsLoaded(true);
  };

  // --- 2. ORDER PLACEMENT WITH VARIANTS ---
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Veuillez sélectionner une adresse de livraison");
      }

      const orderData = {
        userId: user.id,
        address: selectedAddress.id,
        items: cartArray.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          variant: item.currentVariants.join("-") || "Standard",
        })),
      };

      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", orderData);
        if (data.success) {
          toast.success(data.message);
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post("/api/order/stripe", orderData);
        if (data.success) {
          window.location.replace(data.url);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddresses(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      getCart();
    }
  }, [products, cartItems]);

  useEffect(() => {
    if (user) {
      getUserAddress();
    }
  }, [user]);

  if (!isLoaded && products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isLoaded && cartArray.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50 min-h-screen">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
          <img src={assets.logo} alt="Vide" className="w-12 opacity-20 grayscale" />
        </div>
        <h2 className="text-2xl font-black italic text-gray-800 uppercase tracking-tighter">Votre panier est vide</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-sm font-medium">
          On dirait que vous n'avez pas encore fait votre choix. Découvrez nos nouveautés !
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition shadow-2xl shadow-gray-200"
        >
          Découvrir les produits
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {/* CURVED NAVIGATION BACKGROUND HEADER */}
      <div className="bg-white px-6 pt-10 pb-20 rounded-b-[50px] shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* BREADCRUMB ADDED HERE */}
          <nav className="flex items-center gap-2 text-[10px] text-gray-400 mb-8 uppercase tracking-[0.2em] font-black">
            <Link to="/" className="hover:text-black transition-colors">Accueil</Link>
            <span className="text-gray-300">/</span>
            <Link to="/products" className="hover:text-black transition-colors">Boutique</Link>
            <span className="text-gray-300">/</span>
            <span className="text-indigo-600">Votre Panier</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-none tracking-tighter italic">
            Mon Panier
            <span className="text-sm font-bold text-indigo-500 ml-4 not-italic tracking-normal bg-indigo-50 px-3 py-1 rounded-full">
              {getCartCount()} articles
            </span>
          </h1>
          <p className="mt-4 text-gray-400 font-medium text-sm md:text-base">Gérez vos articles et finalisez votre commande en toute sécurité.</p>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col md:flex-row max-w-6xl w-full px-6 mx-auto gap-12 -mt-10 pb-24">
        
        {/* CART ITEMS LIST */}
        <div className="flex-1 bg-white p-6 md:p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-50">
          <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] pb-6 border-b border-gray-100">
            <p>Détails Produit</p>
            <p className="text-center">Sous-total</p>
            <p className="text-right pr-4">Action</p>
          </div>

          <div className="divide-y divide-gray-50">
            {cartArray.map((product, index) => (
              <div key={index} className="grid grid-cols-[2fr_1fr_1fr] items-center py-8 group transition-all">
                <div className="flex items-center gap-5">
                  <div
                    onClick={() => {
                      navigate(`/products/${product.category.toLowerCase()}/${product.id}`);
                      window.scrollTo(0, 0);
                    }}
                    className="cursor-pointer w-24 h-24 bg-gray-50 rounded-[20px] overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-95 transition-transform duration-300 shadow-inner"
                  >
                    <img className="w-full h-full object-contain p-2" src={product.image[0]} alt={product.name} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-gray-900 text-base md:text-lg leading-tight">{product.name}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {product.currentVariants.length > 0 ? (
                        product.currentVariants.map((v, i) => (
                          <span key={i} className="text-[9px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg font-black uppercase tracking-wider">
                            {v}
                          </span>
                        ))
                      ) : (
                        <p className="text-[10px] font-bold text-gray-300 uppercase">Standard Edition</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quantité</span>
                      <select
                        onChange={(e) => updateCartItems(product.cartKey, Number(e.target.value))}
                        value={product.quantity}
                        className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold p-1 px-2 outline-none focus:ring-2 ring-indigo-100"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <p className="text-center font-black text-gray-900 text-lg tracking-tighter">
                  {(product.offerPrice * product.quantity).toFixed(2)} {currency}
                </p>

                <div className="flex justify-end pr-2">
                  <button
                    onClick={() => removeFromCart(product.cartKey)}
                    className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <img src={assets.remove_icon} alt="Supprimer" className="w-4 h-4 brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all" style={{filter: 'invert(37%) sepia(93%) saturate(1469%) hue-rotate(331deg) brightness(98%) contrast(92%)'}} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/products")}
            className="group flex items-center mt-10 gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Continuer mes achats
          </button>
        </div>

        {/* ORDER SUMMARY SIDEBAR */}
        <div className="max-w-[400px] w-full bg-white p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[40px] h-fit sticky top-10">
          <h2 className="text-2xl font-black text-gray-900 mb-8 italic tracking-tighter uppercase">Récapitulatif</h2>

          <div className="space-y-8">
            <div className="group">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">
                Livraison
              </label>
              <div className="relative bg-gray-50 p-5 rounded-[24px] border border-gray-100 group-hover:border-indigo-100 transition-colors">
                <p className="text-xs text-gray-700 font-bold leading-relaxed pr-10 italic">
                  {selectedAddress
                    ? `${selectedAddress.street}, ${selectedAddress.city} ${selectedAddress.zipcode}`
                    : "Aucune adresse sélectionnée"}
                </p>
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="absolute top-5 right-5 text-indigo-600 p-1 bg-white rounded-lg shadow-sm hover:scale-110 transition-transform"
                >
                  ✎
                </button>

                {showAddress && (
                  <div className="absolute top-full left-0 right-0 z-20 mt-3 bg-white border border-gray-100 shadow-2xl rounded-[24px] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {addresses.map((addr, i) => (
                      <div
                        key={i}
                        onClick={() => { setSelectedAddress(addr); setShowAddress(false); }}
                        className="p-4 text-xs font-bold text-gray-600 hover:bg-indigo-50 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        {addr.street}, {addr.city}
                      </div>
                    ))}
                    <div
                      onClick={() => user ? navigate("/add-address") : setShowUserLogin(true)}
                      className="p-4 text-xs text-indigo-600 font-black text-center bg-indigo-50/50 hover:bg-indigo-100 cursor-pointer transition-colors"
                    >
                      + Ajouter une adresse
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-3">
                Mode de Paiement
              </label>
              <select
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 p-4 rounded-[20px] text-xs font-black uppercase tracking-widest outline-none focus:ring-2 ring-indigo-50 appearance-none italic"
              >
                <option value="COD">💰 Cash on Delivery</option>
                <option value="Online">💳 Carte Bancaire / Stripe</option>
              </select>
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-4">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-widest">Sous-total</span>
                <span className="text-gray-900">{getCartAmount().toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-400 uppercase tracking-widest">TVA (20%)</span>
                <span className="text-gray-900">{(getCartAmount() * 0.2).toFixed(2)} {currency}</span>
              </div>
              <div className="flex justify-between text-3xl font-black text-gray-900 pt-6 border-t border-gray-100 tracking-tighter italic">
                <span>Total</span>
                <span>{(getCartAmount() * 1.2).toFixed(2)} {currency}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              className="w-full py-6 bg-black text-white font-black rounded-[24px] text-xs uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95"
            >
              {paymentOption === "COD" ? "Confirmer Commande" : "Payer par Stripe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;