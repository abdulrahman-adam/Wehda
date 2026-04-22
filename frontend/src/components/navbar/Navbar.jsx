import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const {
    axios,
    user,
    getCartCount,
    setUser,
    setShowUserLogin,
    navigate,
    // searchQuery = "",
    searchQuery,
    setSearchQuery,
    categories,
  } = useAppContext();

  // Ferme le menu et la modal lors du changement d'URL
  useEffect(() => {
    setShowUserLogin(false);
    setOpen(false);
  }, [location.pathname, setShowUserLogin]);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  console.log("Type de setSearchQuery:", typeof setSearchQuery);
  console.log("Valeur de searchQuery:", searchQuery);
  return (
    <nav className="flex items-center justify-between px-4 md:px-10 lg:px-16 py-4 h-[55px] border-b border-gray-200 bg-gray sticky top-0 z-50 bg-gray-300">
      {/* --- LOGO --- */}
      <NavLink to="/" className="z-50">
        <img
          src="/logo.jpeg"
          alt="logo"
          className="w-28 md:w-32"
          style={{ height: "50px", width: "50px" }}
        />
      </NavLink>

      {/* --- DESKTOP NAVIGATION (Visible > sm) --- */}
      <ul className="hidden sm:flex items-center gap-5 md:gap-8 font-medium text-gray-700">
        <NavLink to="/" className="hover:text-indigo-600 transition-colors">
          Accueil
        </NavLink>
        <NavLink
          to="/products"
          className="hover:text-indigo-600 transition-colors"
        >
          Produits
        </NavLink>

        {/* Select Catégories Desktop */}
        <div className="relative group flex items-center">
          <select
            onChange={(e) =>
              navigate(
                e.target.value
                  ? `/products/${e.target.value.toLowerCase()}`
                  : "/products",
              )
            }
            className="bg-transparent outline-none cursor-pointer hover:text-indigo-600 appearance-none pr-5 py-1"
          >
            <option value="">Catégories</option>
            {categories?.map((cat, index) => (
              <option key={index} value={cat.name || cat.text}>
                {cat.name || cat.text}
              </option>
            ))}
          </select>
          <i className="bi bi-chevron-down absolute right-0 text-[10px] text-gray-400 group-hover:text-indigo-600 pointer-events-none"></i>
        </div>

        <NavLink
          to="/contact"
          className="hover:text-indigo-600 transition-colors"
        >
          Contact
        </NavLink>
      </ul>

      {/* --- ICONS & ACTIONS --- */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Barre de recherche (Cachée sur petit mobile, visible > lg) */}
        <div className="hidden lg:flex items-center bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
          {/* <input 
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent outline-none text-sm w-32 xl:w-48"
          /> */}

          <input
            type="text"
            placeholder="Rechercher..."
            // ✅ On s'assure que value n'est JAMAIS undefined
            value={searchQuery || ""}
            // ✅ On met à jour l'état ET on redirige si nécessaire
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (location.pathname !== "/products") {
                navigate("/products");
              }
            }}
            className="bg-transparent outline-none text-sm w-32 xl:w-48"
          />
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 h-4 opacity-60"
          />
        </div>

        {/* Panier */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80"
          />
          <span className="absolute -top-2 -right-2 text-[10px] text-white bg-indigo-600 w-4 h-4 rounded-full flex items-center justify-center">
            {getCartCount ? getCartCount() : 0}
          </span>
        </div>

        {/* Profil / Login */}
        <div className="hidden sm:block">
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition cursor-pointer"
            >
              Connexion
            </button>
          ) : (
            <div className="relative group">
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-9 cursor-pointer"
              />
              <div className="hidden group-hover:block absolute right-0 top-full pt-2 w-40">
                <ul className="bg-white shadow-xl border border-gray-100 rounded-xl py-2 text-sm">
                  <li
                    onClick={() => navigate("/my-orders")}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition"
                  >
                    Mes Commandes
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2 hover:bg-red-50 text-red-500 cursor-pointer transition border-t border-gray-50 cursor-pointer"
                  >
                    Déconnexion
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bouton Menu Mobile */}
        <button className="sm:hidden" onClick={() => setOpen(true)}>
          <img src={assets.menu_icon} alt="menu" className="w-6" />
        </button>
      </div>

      {/* --- MOBILE SIDEBAR MENU --- */}
      <div
        className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white transition-all z-[100] ${open ? "w-full" : "w-0"}`}
      >
        <div className="flex flex-col text-gray-600 h-full">
          {/* Header Mobile Menu */}
          <div className="flex items-center justify-between p-5 border-b">
            {/* <img src={assets.logo} className="w-24" alt="logo" /> */}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/logo.jpeg"
                alt="logo"
                className="w-28 md:w-32 cursor-pointer"
                style={{ height: "50px", width: "50px" }}
              />
            </NavLink>

            <button
              onClick={() => setOpen(false)}
              className="text-2xl cursor-pointer hover:text-red-500 transition"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* Links Mobile Menu */}
          <div className="flex flex-col p-6 gap-6 text-lg font-medium">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <i className="bi bi-house"></i> Accueil
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <i className="bi bi-box"></i> Produits
            </NavLink>

            {/* Mobile Categories Select */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-400 uppercase">Catégories</p>
              <select
                onChange={(e) => {
                  const value = e.target.value;

                  if (value) {
                    navigate(`/products/${value.toLowerCase()}`);
                  } else {
                    navigate("/products");
                  }

                  setOpen(false);
                }}
                className="p-3 bg-gray-50 rounded-xl outline-none border border-gray-100"
              >
                <option value="">Toutes les catégories</option>
                {categories?.map((cat, index) => (
                  <option key={index} value={cat.name || cat.text}>
                    {cat.name || cat.text}
                  </option>
                ))}
              </select>
            </div>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <i className="bi bi-envelope"></i> Contact
            </NavLink>

            <hr className="my-2" />

            {!user ? (
              <button
                onClick={() => {
                  setShowUserLogin(true);
                  setOpen(false);
                }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl cursor-pointer"
              >
                Connexion
              </button>
            ) : (
              <>
                <NavLink
                  to="/my-orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 font-normal"
                >
                  <i className="bi bi-bag-check"></i> Mes Commandes
                </NavLink>
                <button
                  onClick={logout}
                  className="text-left text-red-500 flex items-center gap-3 font-normal"
                >
                  <i className="bi bi-box-arrow-right cursor-pointer"></i>{" "}
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
