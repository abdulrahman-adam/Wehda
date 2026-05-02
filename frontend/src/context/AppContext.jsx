



import { useContext, useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  // --- State ---
  // const [user, setUser] = useState(null); 
  // To this:
const [user, setUser] = useState(undefined);
  const [adminData, setAdminData] = useState(null); 
  const [isSeller, setIsSeller] = useState(null);
  const [orders, setOrders] = useState([]); 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [contacts, setContacts] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");

  // --- AUTH & PROFILES ---
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchSellerProfile = async () => {
    try {
      const { data } = await axios.get("/api/seller/profile");
      if (data.success) setAdminData(data.seller);
    } catch (error) {
      console.error("Seller profile error");
    }
  };


  

const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        
        // --- Your Cart Logic ---
        let rawCart = data.user.cartItems;
        if (typeof rawCart === "string") {
          try {
            while (typeof rawCart === "string") { rawCart = JSON.parse(rawCart); }
            setCartItems(rawCart || {});
          } catch { setCartItems({}); }
        } else {
          setCartItems(rawCart || {});
        }
      } else {
        // If server responds but success is false
        setUser(null); 
      }
    } catch (error) {
      // If unauthorized (401) or network error
      setUser(null); 
    }
};




  const fetchOrders = async () => {
    try {
      const url = isSeller ? "/api/order/seller" : "/api/order/user";
      const { data } = await axios.get(url);
      
      if (data.success) {
        setOrders([...data.orders]);
        return data.orders; // <--- ADD THIS LINE
      }
      
      return []; // Return empty array if success is false
    } catch (error) {
      console.error("Fetch orders error:", error.message);
      setOrders([]);
      return []; // Return empty array on error
    }
};



  // DELETE ORDER
    const deleteOrder = async (orderId) => {
    try {
      const { data } = await axios.delete(`/api/order/delete/${orderId}`);
      if (data.success) {
        toast.success(data.message);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.message);
      return false;
    }
  };


  // --- DATA FETCHING (Products/Categories) ---
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data?.success && Array.isArray(data?.products)) {
        const formatted = data.products.map(p => ({
          ...p,
          image: typeof p.image === 'string' ? JSON.parse(p.image) : p.image,
          variants: typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants,
          colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors,
        }));
        setProducts(formatted);
      }
    } catch (error) { console.error("Products error"); }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get("/api/category/list");
      if (data.success) setCategories(data.categories || []);
    } catch (error) { console.error("Categories error"); }
  };

    const getChildCategories = (parentId) => {
    return categories.filter(
      (cat) => String(cat.parentId) === String(parentId),
    );
  };

  // --- ACTIONS ---
  const deleteProduct = async (productId) => {
    try {
      const { data } = await axios.delete("/api/product/delete", {
        data: { id: productId },
      });
      if (data.success) {
        toast.success("Product deleted!");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch {
      toast.error("Delete failed");
    }
  };



  const deleteCategory = async (categoryId) => {
  try {
    // We send the ID in the body
    const { data } = await axios.post("/api/category/delete", { id: categoryId });
    
    if (data.success) {
      toast.success("Catégorie supprimée !");
      // Refresh categories from server to ensure the UI matches the DB state
      fetchCategories(); 
    }
  } catch (error) {
    // This will now show you the REAL error from the backend (e.g., "Foreign key constraint")
    const errorMsg = error.response?.data?.message || "Erreur lors de la suppression";
    toast.error(errorMsg);
    console.error("Delete Error details:", error.response?.data);
  }
};

  //   // --- CART LOGIC ---
  const addToCart = (itemId, variant = "") => {
    if (!itemId) return;
    const cartKey = variant ? `${itemId}-${variant}` : `${itemId}`;
    let cartData = structuredClone(cartItems || {});
    cartData[cartKey] = (cartData[cartKey] || 0) + 1;
    setCartItems(cartData);
    // toast.success("Added to cart ✨");
    // ADD THIS LINE TO TRIGGER THE TOAST
    toast.success("Produit ajouté au panier ! ✨");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] <= 0) delete cartData[itemId];
    }
    setCartItems(cartData);
    toast.success("Produit retiré du panier");
  };


  // --- CART ACTIONS ---
  const updateCartItems = (itemId, quantity) => {
    let cartData = structuredClone(cartItems || {});
    cartData[itemId] = quantity;
    setCartItems(cartData);
    // ADD THIS LINE TO TRIGGER THE TOAST
    toast.success("Panier mis à jour ! ✨");
  };

  const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const productId = String(key).split("-")[0];
        const item = products.find((p) => String(p.id) === productId);
        if (item) total += item.offerPrice * cartItems[key];
      }
    }
    return parseFloat(total.toFixed(2));
  };

  // THE FUNCTION CLEAR CART
  const clearCart = () => {
  setCartItems({});
};


  // --- LIFECYCLE ---
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchSeller();
      fetchProducts();
      fetchCategories();
    };
    init();
  }, []);

  useEffect(() => {
    if (isSeller) {
      fetchSellerProfile();
      fetchOrders(); // Fetches as Admin
    } else if (user) {
      fetchOrders(); // Fetches as Customer
    }
  }, [isSeller, user]);

  
  const getAllContacts = async () => {
    if (!isSeller) return;
    try {
      const { data } = await axios.get(`/api/contact/all`);
      if (data.success) setContacts(data.data || []);
    } catch (error) {
      console.error("Contacts error:", error.message);
    }
  };

    const deleteContact = async (id) => {
    try {
      const { data } = await axios.delete(`/api/contact/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        getAllContacts();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const value = {
    currency, navigate, user, setUser, isSeller, setIsSeller, adminData,getChildCategories, setAdminData,contacts, getAllContacts,deleteProduct, deleteCategory,
    products, categories, cartItems, setCartItems, orders, setOrders,deleteContact,
    showUserLogin, setShowUserLogin, fetchUser, fetchOrders, fetchProducts,deleteOrder,addToCart, removeFromCart,
    fetchCategories, getCartCount, getCartAmount, updateCartItems, axios, searchQuery, setSearchQuery,clearCart
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);