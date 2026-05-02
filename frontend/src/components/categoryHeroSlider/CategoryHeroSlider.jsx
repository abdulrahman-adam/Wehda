import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from "../../context/AppContext";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const CategoryHeroSlider = () => {
  const { categories = [] } = useAppContext() || {};
  const location = useLocation();
  const navigate = useNavigate();

  const subcategories = useMemo(() => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    
    if (pathParts.length === 0) {
      return categories.filter(cat => !cat.parentId || String(cat.parentId).toUpperCase() === "NULL");
    }

    const lastSlug = pathParts[pathParts.length - 1]?.toLowerCase().trim();
    const currentCat = categories.find(
      (cat) => (cat.path || "").toLowerCase().trim() === lastSlug
    );

    if (!currentCat) return [];

    return categories.filter(
      (cat) => Number(cat.parentId) === Number(currentCat.id)
    );
  }, [categories, location.pathname]);

  const handleSlideClick = (sub) => {
    const cleanPath = (sub.path || "").trim();
    const currentPath = location.pathname.replace(/\/$/, "");

    if (currentPath === "" || currentPath === "/") {
      navigate(`/products/${cleanPath}`);
    } else {
      navigate(`${currentPath}/${cleanPath}`);
    }
  };

  if (subcategories.length === 0) return null;

  return (
    <div className="w-full relative group">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        loop={subcategories.length > 1}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        // Responsive Heights: Mobile 150px, Tablet 250px, Desktop 300px
        className="h-[150px] md:h-[250px] lg:h-[300px] w-full"
      >
        {subcategories.map((sub) => (
          <SwiperSlide key={sub.id}>
            <div 
              onClick={() => handleSlideClick(sub)}
              className="relative w-full h-full bg-[#f8f8f8] flex items-center overflow-hidden cursor-pointer group/slide"
            >
              
              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="container mx-auto px-4 md:px-16">
                  <div className="max-w-[60%] md:max-w-xl animate-fadeIn">
                    <h4 className="text-orange-600 font-black uppercase tracking-[0.2em] text-[8px] md:text-sm mb-1">
                      Offre Exclusive
                    </h4>
                    
                    <div className="flex items-center gap-1 md:gap-4 mb-1 md:mb-2">
                        <span className="text-2xl md:text-6xl font-black text-gray-900 leading-none">
                            10 %
                        </span>
                        <div className="flex flex-col text-red-700">
                            <span className="font-bold text-[10px] md:text-2xl text-gray-800 leading-none">10 %</span>
                            <span className="font-black text-[7px] md:text-sm text-gray-500 uppercase tracking-tighter">De Remise</span>
                        </div>
                    </div>

                    <h2 className="text-xs md:text-3xl lg:text-4xl font-black text-gray-800 uppercase tracking-tighter mb-2 md:mb-6 leading-tight">
                      Sur toute la collection <br /> 
                      <span className="text-orange-500">{sub.text}</span>
                    </h2>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="bg-red-600 group-hover/slide:bg-red-700 text-white font-black uppercase tracking-widest text-[7px] md:text-sm px-3 md:px-10 py-1.5 md:py-3 rounded-lg md:rounded-xl shadow-lg transition-all">
                            Acheter
                        </div>
                        
                        <div className="bg-white/80 backdrop-blur-sm border border-dashed border-gray-300 px-2 py-1 rounded">
                            <p className="text-[6px] md:text-[10px] font-bold text-gray-400 uppercase">Code: <span className="text-red-600">PROMO{sub.id}</span></p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Side */}
              <div className="absolute right-0 top-0 w-full md:w-[70%] h-full">
                <img 
                  src={sub.image || "/logo.jpeg"} 
                  alt={sub.text}
                  className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover/slide:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#f8f8f8] via-[#f8f8f8]/80 md:via-[#f8f8f8]/30 to-transparent" />
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .swiper-button-next, .swiper-button-prev {
          color: #000 !important;
          background: white;
          width: 30px !important;
          height: 30px !important;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          opacity: 0;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .swiper-button-next, .swiper-button-prev {
            width: 45px !important;
            height: 45px !important;
          }
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev {
          opacity: 1;
        }
        .swiper-button-next::after, .swiper-button-prev::after {
          font-size: 12px !important;
          font-weight: bold;
        }
        .swiper-pagination-bullet-active {
          background: #ea580c !important;
          width: 20px !important;
          border-radius: 10px !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CategoryHeroSlider;