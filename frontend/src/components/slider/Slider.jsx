

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = () => {
  const myImages = [
    { url: '/slider/banana_image_1.png', title: 'Bananes', desc: 'Riche en nutriments essentiels' },
    { url: '/slider/basmati_rice_image.png', title: 'Rizs', desc: 'Sélectionné parmi les meilleures récoltes' },
    { url: '/slider/carrot_image.png', title: 'Carottes', desc: 'Récoltées à pleine maturité' },
    { url: '/slider/apple_image.png', title: 'Pommes', desc: 'Cueillies avec soin à la main' },
    { url: '/slider/barley_image.png', title: 'orge', desc: 'Saveur douce, subtilement boisée' },
  ];

  return (
    <div className="w-full mx-auto px-2 md:px-4 py-4 relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={15}
        loop={true}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        breakpoints={{
          // Mobile
          0: {
            slidesPerView: 1,
          },
          // Tablet
          768: {
            slidesPerView: 2,
          },
          // Desktop (Hero Banner style)
          1024: {
            slidesPerView: 1,
          }
        }}
        className="rounded-[20px] overflow-hidden h-[350px] md:h-[450px] lg:h-[500px]"
      >
        {myImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full overflow-hidden group">
              <img 
                src={img.url} 
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Professional Gradient Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <h3 className="m-0 text-xl md:text-2xl font-bold">{img.title}</h3>
                <p className="mt-2 text-sm md:text-base opacity-90">{img.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;