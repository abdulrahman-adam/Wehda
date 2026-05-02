import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAppContext } from "./context/AppContext";

// Components
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Loading from "./components/loading/Loading";
import Login from "./components/login/Login";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";

// Pages
import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import AllProducts from "./pages/allProducts/AllProducts";
import ProductDetails from "./pages/productDetails/ProductDetails";
import TreeProductList from "./components/treeProductList/TreeProductList";

// Admin & User Pages
import AddCategory from "./pages/admin/AddCategory";
import AddProduct from "./pages/admin/AddProduct";
import ListCategory from "./pages/admin/ListCategory";
import ProductList from "./pages/admin/ProductList";
import ContactList from "./pages/admin/ContactList";
import Cart from "./pages/cart/Cart";
import AddAddress from "./pages/addAddress/AddAdress";
import MyOrders from "./pages/myOrders/MyOrders";
import Orders from "./pages/admin/Orders";
import PaymentLoader from "./pages/paymentLoader/PaymentLoader";
import { Toaster } from "react-hot-toast";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import About from "./pages/about/About";
import Terms from "./pages/terms/Terms";
import FAQ from "./pages/faq/FAQ";
import Shipping from "./pages/Shipping/Shipping";
import Promotions from "./pages/promotions/Promotions";
import NewArrivals from "./pages/newArrivals/NewArrivals";


const App = () => {
  const { pathname } = useLocation();
  const isSellerPath = pathname.includes("admin");
  const { showUserLogin, setShowUserLogin, isSeller, user } = useAppContext();

  useEffect(() => {
    setShowUserLogin(false);
  }, [pathname, setShowUserLogin]);

  // 1. Wait for Auth check to complete
  // This prevents the <Navigate to="/" /> from running before the server answers
  if (user === undefined) {
    return <Loading />;
  }

  // 2. Existing Seller check
  if (isSellerPath && isSeller === null) return <Loading />;


  
  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      {!isSellerPath && <Navbar />}
      
      {showUserLogin && <Login />}

   {/* Standard Toaster with Z-Index Fix */}
<div style={{ zIndex: 99999, position: 'relative' }}>
  <Toaster 
    position="top-center"
    reverseOrder={false}
    gutter={8}
    containerStyle={{
      top: 40, // Adds a little extra space from the very top
    }}
    toastOptions={{
      duration: 3000,
      style: {
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      success: {
        style: {
          background: '#10b981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      },
      error: {
        style: {
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      },
    }}
  />
</div>

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
        <Route path="/about" element={<About />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/sales" element={<Promotions />} />
        {/* Redirection si la page n'existe pas */}
            <Route path="*" element={<h1 className="text-center py-20">404 - Page non trouvée</h1>} />
        {/* <Route path="/add-address" element={<AddAddress />} />
        <Route path='/my-orders' element={<MyOrders />} /> */}
        {/* ================= PROTECTED USER ROUTES ================= */}
        <Route
          path="/my-orders"
          element={user ? <MyOrders /> : <Navigate to="/" />}
        />
        <Route
          path="/add-address"
          element={user ? <AddAddress /> : <Navigate to="/" />}
        />
        <Route path="/loader" element={<PaymentLoader />} />

        {/* ================= PRODUCT SYSTEM ================= */}
        <Route path="/products" element={<AllProducts />} />

        {/* This single line now handles 1, 2, 3, 4, or even 10 levels of categories */}
        <Route path="/products/*" element={<TreeProductList />} />


        

        {/* Unified Product Detail Route */}
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route path="/loader" element={<Loading />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={isSeller ? <AdminLayout /> : <AdminLogin />}
        >
          <Route index element={<AddProduct />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="category-list" element={<ListCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="all-contact" element={<ContactList />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;

// Breadcrumb Navigation
// Recursive || Recursive Filter
// getAllDescendantIds

// splat (wildcard)
// fix a mistake" (Soft Reset)
// git reset --soft HEAD~1