import React, { useEffect } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppContext } from "./context/AppContext";

import Home from "./pages/home/Home";
import Contact from "./pages/contact/Contact";
import Loading from "./components/loading/Loading";
import AdminLogin from "./components/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Login from "./components/login/Login";
import { Toaster } from "react-hot-toast";

import AddCategory from "./pages/admin/AddCategory";
import AddProduct from "./pages/admin/AddProduct";
import ListCategory from "./pages/admin/ListCategory";
import ProductList from "./pages/admin/ProductList";
import ContactList from "./pages/admin/ContactList";

import AllProducts from "./pages/allProducts/AllProducts";
import ProductDetails from "./pages/productDetails/ProductDetails";
import TreeProductList from "./components/treeProductList/TreeProductList";

const App = () => {
  const { pathname } = useLocation();
  const isSellerPath = pathname.includes("admin");

  const { showUserLogin, setShowUserLogin, isSeller } = useAppContext();

  // Hide login modal on route change
  useEffect(() => {
    setShowUserLogin(false);
  }, [pathname, setShowUserLogin]);

  // Prevent flashing admin routes before auth check
  if (isSellerPath && isSeller === null) {
    return <Loading />;
  }

  return (
    <div className="text-default min-h-screen text-gray-700 bg-white">
      
      {/* Navbar */}
      {!isSellerPath && <Navbar />}

      {/* Login Modal */}
      {showUserLogin && <Login />}

      {/* Toast */}
      <Toaster
        position="top-center"
        toastOptions={{
          success: { style: { background: "#4caf50", color: "#fff" } },
          error: { style: { background: "#f44336", color: "#fff" } },
        }}
      />

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* PRODUCTS */}
        <Route path="/products" element={<AllProducts />} />
        <Route path="/products/:parent" element={<TreeProductList />} />
        <Route path="/products/:parent/:child" element={<TreeProductList />} />
        <Route path="/products/:parent/:child/:id" element={<ProductDetails />} />

        <Route path="/loader" element={<Loading />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={isSeller ? <AdminLayout /> : <AdminLogin />}
        >
          <Route index element={<AddProduct />} />
          <Route path="product-list" element={<ProductList />} />
          <Route path="category-list" element={<ListCategory />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="all-contact" element={<ContactList />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Footer */}
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;