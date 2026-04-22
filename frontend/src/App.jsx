import React, { useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import Home from './pages/home/Home';
import Contact from './pages/contact/Contact';
import Loading from './components/loading/Loading';
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './components/login/Login';
import { Toaster } from 'react-hot-toast';
import AddCategory from './pages/admin/AddCategory';
import AddProduct from './pages/admin/AddProduct';
import ListCategory from './pages/admin/ListCategory';
import ProductList from './pages/admin/ProductList';
import ContactList from './pages/admin/ContactList';

const App = () => {
  const { pathname } = useLocation();
  const isSellerPath = pathname.includes("admin");
  const { showUserLogin, setShowUserLogin, isSeller } = useAppContext();

  // Hide login modal whenever the URL changes
  useEffect(() => {
    setShowUserLogin(false);
  }, [pathname, setShowUserLogin]);

  // --- CRITICAL: AUTH LOADING CHECK ---
  // If isSeller is null, it means we are still waiting for the API response (is-auth).
  // This prevents the "Black Screen" or "404" during a page refresh.
  if (isSellerPath && isSeller === null) {
    return <Loading />;
  }


  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      
       {/* Show Navbar only if NOT in Admin routes */}
      {!isSellerPath && <Navbar />}

      {/* Shared Login Modal */}
      {showUserLogin && <Login />}

      {/* Global Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          success: { style: { background: "#4caf50", color: "#fff" } },
          error: { style: { background: "#f44336", color: "#fff" } },
        }}
      />

      <div className={isSellerPath ? "mx-0 px-0" : "mx-0 px-0"}>

        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/loader' element={<Loading />} />


           {/* Admin Protected Routes */}
          {/* If not a seller, show AdminLogin. If seller, show AdminLayout (which contains Sidebar/Navbar) */}
          <Route path='/admin' element={isSeller ? <AdminLayout /> : <AdminLogin />}>
            {/* These routes will render inside the <Outlet /> of AdminLayout */}
            {/* 
            
            <Route path='orders' element={<Orders />} />
            */}
            <Route path='all-contact' element={<ContactList />} /> 
            <Route path='product-list' element={<ProductList />} />
            <Route index element={<AddProduct />} />
            <Route path='category-list' element={<ListCategory />} />
            <Route path='add-category' element={<AddCategory />} />
          </Route>

          {/* Catch-all: Redirect unknown routes to Home */}
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
       {/* Show Footer only if NOT in Admin routes */}
      {/* {!isSellerPath && <Footer />} */}
    </div>
  )
}

export default App