import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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

const App = () => {
  const { pathname } = useLocation();
  const isSellerPath = pathname.includes("admin");
  const { showUserLogin, setShowUserLogin, isSeller,user } = useAppContext();

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

      <Toaster position="top-center" />

      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
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
        <Route path="/products/:parent" element={<TreeProductList />} />
        <Route path="/products/:parent/:child" element={<TreeProductList />} />

        {/* 🆕 ADDED: Support for 3rd level (e.g., Electronics/Laptops/Toshiba) */}
        <Route
          path="/products/:parent/:child/:grandchild"
          element={<TreeProductList />}
        />

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
// Recursive
// getAllDescendantIds
