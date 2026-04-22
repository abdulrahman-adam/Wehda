

import { useContext, useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

// Axios Configuration
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    // --- State Management ---
    const [orders, setOrders] = useState([]);
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(null); // CRITICAL: null means "loading"
    const [userData, setUserData] = useState(null);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [contacts, setContacts] = useState([]);

    // --- 1. AUTHENTICATION FUNCTIONS ---

    const fetchSeller = async () => {
        try {
            const { data } = await axios.get("/api/seller/is-auth");
            setIsSeller(data.success);
        } catch (error) {
            setIsSeller(false);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/is-auth");
            if (data.success) {
                setUser(data.user);
                // Handle Cart Parsing
                let rawCart = data.user.cartItems;
                if (typeof rawCart === "string") {
                    try {
                        while (typeof rawCart === "string") { rawCart = JSON.parse(rawCart); }
                        setCartItems(rawCart);
                    } catch (e) { setCartItems({}); }
                } else {
                    setCartItems(rawCart || {});
                }
            }
        } catch (error) {
            setUser(null);
        }
    };

    const fetchSellerProfile = async () => {
    try {
        const { data } = await axios.get("/api/seller/profile");

        if (data.success) {
            setSeller(data.seller);
        } else {
            setSeller(null);
        }
    } catch (error) {
        setSeller(null);
    }
};


    // --- 2. DATA FETCHING ---

    // const fetchProducts = async () => {
    //     try {
    //         const { data } = await axios.get("/api/product/list");
    //         if (data.success) setProducts(data.products);
    //     } catch (error) {
    //         console.error("Products error:", error.message);
    //     }
    // };

const fetchProducts = async () => {
    try {
        const { data } = await axios.get("/api/product/list");

        if (data?.success && Array.isArray(data?.products)) {

            const formattedProducts = data.products.map((product) => ({
                ...product,

                // ensure image is always array
                image: Array.isArray(product.image)
                    ? product.image
                    : product.image
                    ? JSON.parse(product.image)
                    : [],

                // ensure variants is always array
                variants: Array.isArray(product.variants)
                    ? product.variants
                    : product.variants
                    ? JSON.parse(product.variants)
                    : [],

                // colors safety (YOU HAVE THIS IN MODEL BUT NOT HANDLED)
                colors: Array.isArray(product.colors)
                    ? product.colors
                    : product.colors
                    ? JSON.parse(product.colors)
                    : [],

                // category safety
                categoryData: product.categoryData || null,
            }));

            setProducts(formattedProducts);
        } else {
            setProducts([]); // ✅ IMPORTANT fallback
        }

    } catch (error) {
        console.error("Products error:", error.message);
        setProducts([]); // ✅ prevent crash in UI
    }
};

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get("/api/category/list");
            if (data.success) setCategories(data.categories);
        } catch (error) {
            console.error("Categories error:", error.message);
        }
    };

    const getAllContacts = async () => {
        if (!isSeller) return; 
        try {
            const { data } = await axios.get(`/api/contact/all`);
            if (data.success) setContacts(data.data || []);
        } catch (error) {
            console.error("Contacts error:", error.message);
        }
    };

    // --- 3. ACTIONS ---

    const deleteProduct = async (productId) => {
        try {
            const { data } = await axios.delete('/api/product/delete', { data: { id: productId } });
            if (data.success) {
                toast.success('Product deleted!');
                setProducts(prev => prev.filter(p => p.id !== productId));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const deleteCategory = async (categoryId) => {
        try {
            const { data } = await axios.post('/api/category/delete', { id: categoryId });
            if (data.success) {
                toast.success('Deleted successfully!');
                setCategories(prev => prev.filter(cat => cat.id !== categoryId));
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const { data } = await axios.delete(`/api/order/delete/${orderId}`);
            if (data.success) {
                toast.success(data.message);
                setOrders(prev => prev.filter(o => o.id !== orderId));
                return true;
            }
            return false;
        } catch (error) {
            toast.error(error.message);
            return false;
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

    // --- 4. CART LOGIC ---

    // const addToCart = (itemId) => {
    //     if (!itemId) return;
    //     let cartData = structuredClone(cartItems || {});
    //     cartData[itemId] = (cartData[itemId] || 0) + 1;
    //     setCartItems(cartData);
    //     toast.success("Added to cart ✨");
    // };

    const addToCart = (itemId, variant = "") => {
    if (!itemId) return;

    // 1. Create a unique key (e.g., "product123-Red-XL")
    // If no variant, it just stays as the ID
    const cartKey = variant ? `${itemId}-${variant}` : `${itemId}`;

    let cartData = structuredClone(cartItems || {});

    // 2. Use the cartKey instead of itemId
    cartData[cartKey] = (cartData[cartKey] || 0) + 1;

    setCartItems(cartData);
    toast.success("Added to cart ✨");
};

    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) delete cartData[itemId];
        }
        setCartItems(cartData);
        toast.success("Removed from cart");
    };

    const updateCartItems = (itemId, quantity) => {
        if (!itemId || itemId === "undefined") return;
        let currentCart = typeof cartItems === 'string' ? JSON.parse(cartItems) : cartItems;
        let cartData = structuredClone(currentCart || {});
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated 🛍️");
    };

    const getCartCount = () => Object.values(cartItems).reduce((a, b) => a + b, 0);

    // const getCartAmount = () => {
    //     let totalAmount = 0;
    //     for (const id in cartItems) {
    //         let itemInfo = products.find((p) => String(p.id) === String(id));
    //         if (itemInfo) totalAmount += itemInfo.offerPrice * cartItems[id];
    //     }
    //     return Math.floor(totalAmount * 100) / 100;
    // };

    // --- 5. EFFECTS ---

    // Initial Load
    
    
    const getCartAmount = () => {
    let totalAmount = 0;
    
    for (const key in cartItems) {
        if (cartItems[key] > 0) {
            // 1. Get ONLY the ID part (before the first dash)
            const productId = String(key).split("-")[0];

            // 2. Find the product using that cleaned ID
            const itemInfo = products.find((p) => String(p.id) === productId);

            if (itemInfo) {
                totalAmount += itemInfo.offerPrice * cartItems[key];
            }
        }
    }
    
    // Using toFixed(2) is cleaner for currency than Math.floor/100
    return parseFloat(totalAmount.toFixed(2));
};


    useEffect(() => {
        const init = async () => {
            await fetchUser();
            await fetchSeller();
            fetchProducts();
            fetchCategories();
        };
        init();
    }, []);

    // Load Seller Data
    useEffect(() => {
        if (isSeller) getAllContacts();
    }, [isSeller]);

    // Sync Cart to DB
    useEffect(() => {
        const updateCart = async () => {
            try {
                if (user && Object.keys(cartItems).length > 0) {
                    await axios.post("/api/cart/update", { cartItems });
                }
            } catch (error) {
                console.error("Cart Sync Error");
            }
        };
        const delay = setTimeout(() => { if (user) updateCart(); }, 500);
        return () => clearTimeout(delay);
    }, [cartItems, user]);

    const value = {
        currency, navigate, user, setUser, isSeller, setIsSeller,
        showUserLogin, setShowUserLogin, products, addToCart,
        cartItems, setCartItems, removeFromCart, getCartCount, getCartAmount,
        axios, fetchProducts, deleteProduct, deleteCategory, categories, contacts, 
        setContacts, getAllContacts, userData, setUserData, setSearchQuery,
        searchQuery, updateCartItems, deleteOrder, deleteContact, orders, setOrders
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);