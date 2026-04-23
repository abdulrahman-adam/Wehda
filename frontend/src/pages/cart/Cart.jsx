
import React, { useEffect, useState } from "react";
// import { useAppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

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
        // key format is "productId-variant1-variant2"
        const parts = String(key).split("-");
        const productId = parts[0];
        const variantsFromKey = parts.slice(1); // Everything after the ID

        const product = products.find((item) => String(item.id) === String(productId));

        if (product) {
          tempArray.push({
            ...product,
            cartKey: key, // Keep the full key for updates/removal
            quantity: cartItems[key],
            currentVariants: variantsFromKey, // Store variants for display
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
          // Send variants as a readable string to the backend
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
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <img src={assets.logo} alt="Vide" className="w-12 opacity-20 grayscale" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Votre panier est vide</h2>
        <p className="text-gray-500 mt-2 mb-8 max-w-sm">
          On dirait que vous n'avez pas encore fait votre choix. Découvrez nos nouveautés !
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-md font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Découvrir les produits
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto gap-10">
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Mon Panier{" "}
          <span className="text-sm font-medium text-indigo-500 ml-2">
            ({getCartCount()} articles)
          </span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-400 text-xs uppercase font-bold tracking-wider pb-3 border-b border-gray-100">
          <p>Détails Produit</p>
          <p className="text-center">Sous-total</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div key={index} className="grid grid-cols-[2fr_1fr_1fr] items-center py-6 border-b border-gray-50">
            <div className="flex items-center gap-4">
              <div
                onClick={() => {
                  navigate(`/products/${product.category.toLowerCase()}/${product.id}`);
                  window.scrollTo(0, 0);
                }}
                className="cursor-pointer w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0"
              >
                <img className="w-full h-full object-contain" src={product.image[0]} alt={product.name} />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm md:text-base mb-1">{product.name}</p>
                
                {/* --- PROFESSIONAL VARIANT DISPLAY --- */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.currentVariants.length > 0 ? (
                    product.currentVariants.map((v, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase">
                        {v}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Standard</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Qté:</span>
                  <select
                    onChange={(e) => updateCartItems(product.cartKey, Number(e.target.value))}
                    value={product.quantity}
                    className="bg-white border border-gray-200 rounded text-xs p-1 outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-center font-bold text-gray-800">
              {(product.offerPrice * product.quantity).toFixed(2)} {currency}
            </p>

            <button
              onClick={() => removeFromCart(product.cartKey)}
              className="mx-auto p-2 hover:bg-red-50 rounded-full transition group"
            >
              <img src={assets.remove_icon} alt="Supprimer" className="w-5 h-5 opacity-50 group-hover:opacity-100" />
            </button>
          </div>
        ))}

        <button
          onClick={() => navigate("/products")}
          className="flex items-center mt-8 gap-2 text-indigo-600 font-bold text-sm hover:underline"
        >
          ← Continuer mes achats
        </button>
      </div>

      {/* --- RÉSUMÉ DE COMMANDE (Keeping your layout, just refining data) --- */}
      <div className="max-w-[380px] w-full bg-white p-8 border border-gray-100 shadow-sm rounded-2xl h-fit sticky top-24">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Résumé de la commande</h2>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
              Adresse de livraison
            </label>
            <div className="relative bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-600 leading-relaxed pr-8">
                {selectedAddress
                  ? `${selectedAddress.street}, ${selectedAddress.city} ${selectedAddress.zipcode}`
                  : "Aucune adresse sélectionnée"}
              </p>
              <button
                onClick={() => setShowAddress(!showAddress)}
                className="absolute top-4 right-4 text-indigo-600 font-bold text-[10px] hover:underline"
              >
                MODIFIER
              </button>

              {showAddress && (
                <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden">
                  {addresses.map((addr, i) => (
                    <div
                      key={i}
                      onClick={() => { setSelectedAddress(addr); setShowAddress(false); }}
                      className="p-3 text-xs hover:bg-indigo-50 cursor-pointer border-b border-gray-50"
                    >
                      {addr.street}, {addr.city}
                    </div>
                  ))}
                  <div
                    onClick={() => user ? navigate("/add-address") : setShowUserLogin(true)}
                    className="p-3 text-xs text-indigo-600 font-bold text-center hover:bg-indigo-50 cursor-pointer"
                  >
                    + Ajouter une adresse
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-2">
              Méthode de paiement
            </label>
            <select
              onChange={(e) => setPaymentOption(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 p-3 rounded-xl text-xs font-medium outline-none"
            >
              <option value="COD">Paiement à la livraison (COD)</option>
              <option value="Online">Paiement par Carte / Stripe</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-bold text-gray-800">{getCartAmount().toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">TVA (20%)</span>
              <span className="font-bold text-gray-800">{(getCartAmount() * 0.2).toFixed(2)} {currency}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-gray-900 pt-3 border-t border-gray-100">
              <span>Total</span>
              <span>{(getCartAmount() * 1.2).toFixed(2)} {currency}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            {paymentOption === "COD" ? "CONFIRMER LA COMMANDE" : "PROCÉDER AU PAIEMENT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;