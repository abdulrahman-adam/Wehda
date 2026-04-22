import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Loading = () => {
  const { navigate, setCartItems } = useAppContext();
  let { search } = useLocation();
  const query = new URLSearchParams(search);
  const nextUrl = query.get('next');

  useEffect(() => {
    if (nextUrl) {
      setTimeout(() => {
        setCartItems({})
        navigate(`/${nextUrl}`)
      }, 3000)
    }
  }, [nextUrl])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">

      {/* 🔵 Spinner */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>

      {/* 🔹 Text */}
      <p className="mt-6 text-gray-700 font-medium text-sm animate-pulse">
        Chargement en cours...
      </p>

      {/* 🔹 Sub text */}
      <p className="text-gray-400 text-xs mt-1">
        Veuillez patienter un instant
      </p>

    </div>
  )
}

export default Loading;