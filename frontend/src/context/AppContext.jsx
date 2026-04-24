// import { useContext, useEffect, useState, createContext } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import axios from "axios";

// // Axios Configuration
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// export const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const currency = import.meta.env.VITE_CURRENCY;
//   const navigate = useNavigate();

//   // --- State ---
//   const [orders, setOrders] = useState([]); // Shared Order State

//   const [user, setUser] = useState(null); // For Customers
//   const [adminData, setAdminData] = useState(null); // For the Admin/Seller
//   const [isSeller, setIsSeller] = useState(null);
//   const [userData, setUserData] = useState(null);
//   const [showUserLogin, setShowUserLogin] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [cartItems, setCartItems] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [contacts, setContacts] = useState([]);

//   // --- AUTH ---
//   const fetchSeller = async () => {
//     try {
//       const { data } = await axios.get("/api/seller/is-auth");
//       setIsSeller(data.success);
//     } catch {
//       setIsSeller(false);
//     }
//   };

//   // NEW: This function specifically fetches the Admin's info
// //   const fetchSellerProfile = async () => {
// //     try {
// //       const { data } = await axios.get("/api/seller/profile");
// //       if (data.success) {
// //         setAdminData(data.seller); // Now we save to adminData, not user
// //       }
// //     } catch (error) {
// //       console.error("Seller profile error");
// //     }
// // };

// const fetchSellerProfile = async () => {
//     console.log("Frontend: Fetching Seller Profile...");
//     try {
//       const { data } = await axios.get("/api/seller/profile");
      
//       console.log("Frontend: Received Data from /profile:", data);

//       if (data.success) {
//         setAdminData(data.seller);
//         console.log("Frontend: adminData state updated to:", data.seller);
//       } else {
//         console.warn("Frontend: API returned success:false", data.message);
//       }
//     } catch (error) {
//       console.error("Frontend: Axios Error fetching profile:", error.response?.data || error.message);
//     }
// };

// // Also update your useEffect to trigger it:
// useEffect(() => {
//     if (isSeller) {
//       fetchSellerProfile(); // Fetch admin info when seller is authenticated
//       getAllContacts();
//       fetchOrders();
//     }
// }, [isSeller]);


//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get("/api/user/is-auth");
//       if (data.success) {
//         setUser(data.user);

//         let rawCart = data.user.cartItems;

//         // Enhanced Recursive Parsing for Sequelize JSON strings
//         if (typeof rawCart === "string") {
//           try {
//             while (typeof rawCart === "string") {
//               rawCart = JSON.parse(rawCart);
//             }
//             setCartItems(rawCart || {});
//           } catch {
//             setCartItems({});
//           }
//         } else {
//           setCartItems(rawCart || {});
//         }
//       }
//     } catch {
//       setUser(null);
//     }
//   };

//   // --- ORDERS (New Central Fetch) ---
//   const fetchOrders = async () => {
//     try {
//       const { data } = await axios.get("/api/order/seller");
//       if (data.success) {
//         setOrders(data.orders);
//       }
//     } catch (error) {
//       console.error("Fetch orders error:", error.message);
//     }
//   };

//   // --- PRODUCTS ---
//   const fetchProducts = async () => {
//     try {
//       const { data } = await axios.get("/api/product/list");

//       if (data?.success && Array.isArray(data?.products)) {
//         const formattedProducts = data.products.map((product) => ({
//           ...product,
//           image: Array.isArray(product.image)
//             ? product.image
//             : product.image
//               ? JSON.parse(product.image)
//               : [],
//           variants: Array.isArray(product.variants)
//             ? product.variants
//             : product.variants
//               ? JSON.parse(product.variants)
//               : [],
//           colors: Array.isArray(product.colors)
//             ? product.colors
//             : product.colors
//               ? JSON.parse(product.colors)
//               : [],
//           categoryData: product.categoryData || null,
//         }));

//         setProducts(formattedProducts);
//       } else {
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Products error:", error.message);
//       setProducts([]);
//     }
//   };

//   // --- CATEGORIES ---
//   const fetchCategories = async () => {
//     try {
//       const { data } = await axios.get("/api/category/list");
//       if (data.success) {
//         setCategories(data.categories || []);
//       }
//     } catch (error) {
//       console.error("Categories error:", error.message);
//       setCategories([]);
//     }
//   };

//   const getChildCategories = (parentId) => {
//     return categories.filter(
//       (cat) => String(cat.parentId) === String(parentId),
//     );
//   };

//   const getAllContacts = async () => {
//     if (!isSeller) return;
//     try {
//       const { data } = await axios.get(`/api/contact/all`);
//       if (data.success) setContacts(data.data || []);
//     } catch (error) {
//       console.error("Contacts error:", error.message);
//     }
//   };

//   // --- ACTIONS ---
//   const deleteProduct = async (productId) => {
//     try {
//       const { data } = await axios.delete("/api/product/delete", {
//         data: { id: productId },
//       });
//       if (data.success) {
//         toast.success("Product deleted!");
//         setProducts((prev) => prev.filter((p) => p.id !== productId));
//       }
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   const deleteCategory = async (categoryId) => {
//     try {
//       const { data } = await axios.post("/api/category/delete", {
//         id: categoryId,
//       });
//       if (data.success) {
//         toast.success("Deleted successfully!");
//         setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const deleteOrder = async (orderId) => {
//     try {
//       const { data } = await axios.delete(`/api/order/delete/${orderId}`);
//       if (data.success) {
//         toast.success(data.message);
//         setOrders((prev) => prev.filter((o) => o.id !== orderId));
//         return true;
//       }
//       return false;
//     } catch (error) {
//       toast.error(error.message);
//       return false;
//     }
//   };

//   const deleteContact = async (id) => {
//     try {
//       const { data } = await axios.delete(`/api/contact/delete/${id}`);
//       if (data.success) {
//         toast.success(data.message);
//         getAllContacts();
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // --- CART LOGIC ---
//   const addToCart = (itemId, variant = "") => {
//     if (!itemId) return;
//     const cartKey = variant ? `${itemId}-${variant}` : `${itemId}`;
//     let cartData = structuredClone(cartItems || {});
//     cartData[cartKey] = (cartData[cartKey] || 0) + 1;
//     setCartItems(cartData);
//     toast.success("Added to cart ✨");
//   };

//   const removeFromCart = (itemId) => {
//     let cartData = structuredClone(cartItems);
//     if (cartData[itemId]) {
//       cartData[itemId] -= 1;
//       if (cartData[itemId] <= 0) delete cartData[itemId];
//     }
//     setCartItems(cartData);
//     toast.success("Removed from cart");
//   };

//   const updateCartItems = (itemId, quantity) => {
//     let cartData = structuredClone(cartItems || {});
//     cartData[itemId] = quantity;
//     setCartItems(cartData);
//     toast.success("Cart updated 🛍️");
//   };

//   const getCartCount = () =>
//     Object.values(cartItems).reduce((a, b) => a + b, 0);

//   const getCartAmount = () => {
//     let total = 0;
//     for (const key in cartItems) {
//       if (cartItems[key] > 0) {
//         const productId = String(key).split("-")[0];
//         const item = products.find((p) => String(p.id) === productId);
//         if (item) {
//           total += item.offerPrice * cartItems[key];
//         }
//       }
//     }
//     return parseFloat(total.toFixed(2));
//   };

//   // --- INIT ---
//   useEffect(() => {
//     const init = async () => {
//       await fetchUser();
//       await fetchSeller();
//       fetchProducts();
//       fetchCategories();
//     };
//     init();
//   }, []);

//   useEffect(() => {
//     if (isSeller) {
//       getAllContacts();
//       fetchOrders(); // Load orders if seller
//     }
//   }, [isSeller]);

//   // Debounced Cart Sync
//   useEffect(() => {
//     const syncCart = async () => {
//       if (user && Object.keys(cartItems).length > 0) {
//         await axios.post("/api/cart/update", { cartItems });
//       }
//     };
//     const delay = setTimeout(syncCart, 500);
//     return () => clearTimeout(delay);
//   }, [cartItems, user]);

//   const value = {
//     currency,
//     navigate,
//     getChildCategories,
//     user,
//     setUser,
//     isSeller,
//     setIsSeller,
//     showUserLogin,
//     setShowUserLogin,
//     products,
//     categories,
//     addToCart,
//     adminData,      // <--- MUST BE HERE
//     setAdminData,   // <--- MUST BE HERE
//     cartItems,
//     removeFromCart,
//     getCartCount,
//     getCartAmount,
//     axios,
//     fetchProducts,
//     fetchCategories,
//     deleteProduct,
//     deleteCategory,
//     contacts,
//     getAllContacts,
//     setSearchQuery,
//     searchQuery,
//     updateCartItems,
//     deleteOrder,
//     deleteContact,
//     orders,
//     setOrders,
//     fetchOrders, // Added to export
//     fetchSellerProfile,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);

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
  const [user, setUser] = useState(null); 
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
        let rawCart = data.user.cartItems;
        // Recursive JSON parsing for Sequelize strings
        if (typeof rawCart === "string") {
          try {
            while (typeof rawCart === "string") { rawCart = JSON.parse(rawCart); }
            setCartItems(rawCart || {});
          } catch { setCartItems({}); }
        } else {
          setCartItems(rawCart || {});
        }
      }
    } catch {
      setUser(null);
    }
  };

  // --- ORDERS (Dynamic: Seller vs User) ---
  const fetchOrders = async () => {
    try {
      // Switches endpoint based on who is logged in
      const url = isSeller ? "/api/order/seller" : "/api/order/user-orders";
      const { data } = await axios.get(url);
      if (data.success) setOrders(data.orders);
    } catch (error) {
      console.error("Fetch orders error:", error.message);
      setOrders([]);
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

  // --- CART ACTIONS ---
  const updateCartItems = (itemId, quantity) => {
    let cartData = structuredClone(cartItems || {});
    cartData[itemId] = quantity;
    setCartItems(cartData);
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

  const value = {
    currency, navigate, user, setUser, isSeller, setIsSeller, adminData, setAdminData,
    products, categories, cartItems, setCartItems, orders, setOrders,
    showUserLogin, setShowUserLogin, fetchUser, fetchOrders, fetchProducts,
    fetchCategories, getCartCount, getCartAmount, updateCartItems, axios, searchQuery, setSearchQuery
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);