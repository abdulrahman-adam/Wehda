// import React from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// // Importation des styles nécessaires
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// const Slider = () => {
//   // Chemins directs vers tes images dans /public/images/
//   const myImages = [
//     { url: '/slider/banana_image_1.png', title: 'Bananes', desc: 'Riche en nutriments essentiels' },
//     { url: '/slider/basmati_rice_image.png', title: 'Rizs', desc: 'Sélectionné parmi les meilleures récoltes' },
//     { url: '/slider/carrot_image.png', title: 'Carottes', desc: 'Récoltées à pleine maturité' },
//     { url: '/slider/apple_image.png', title: 'Pommes', desc: 'Cueillies avec soin à la main' },
//     { url: '/slider/barley_image.png', title: 'orge', desc: 'Saveur douce, subtilement boisée' },
//   ];

//   return (
//     <div style={{ width: '100%', margin: '1 auto', padding: '1px 10px', position: 'relative', height: '350px'}}>
//       <Swiper
//         modules={[Navigation, Pagination, Autoplay]}
//         spaceBetween={15}
//         loop={true}
//         autoplay={{ delay: 1000 }}
//         pagination={{ clickable: true }}
//         navigation={true}
//         // --- GESTION DU RESPONSIVE ---
//         breakpoints={{
//           // MOBILE : 1 image à la fois
//           390: {
//             slidesPerView: 1,
//           },
//           // TABLETTE : 2 images à la fois
//           768: {
//             slidesPerView: 2,
//           },
//           // LAPTOP / DESKTOP : 1 image large ou 3 en grille
//           1024: {
//             slidesPerView: 1, // On garde 1 pour un effet "Hero Banner"
//           }
//         }}
//         style={{ borderRadius: '20px', height:'356px', marginTop: '0px'}}
//       >
//         {myImages.map((img, index) => (
//           <SwiperSlide key={index}>
//             <div className="slide-card" style={{
//               height:'356px',
//               position: 'relative',
//               overflow: 'hidden',
//               borderRadius: '15px',
//               // Hauteur dynamique selon l'écran
//               height: window.innerWidth < 768 ? '345px' : '500px'
//             }}>
//               <img 
//                 src={img.url} 
//                 alt={img.title}
//                 style={{
//                   width: '100%',
//                   height: '345px',
//                   objectFit: 'contain' // Empêche la déformation
//                 }}
//               />
//               {/* Overlay Texte */}
//               <div style={{
//                 position: 'absolute',
//                 bottom: 0,
//                 width: '100%',
//                 padding: '20px',
//                 background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
//                 color: 'white'
//               }}>
//                 <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{img.title}</h3>
//                 <p style={{ margin: '5px 0 0', opacity: 0.8 }}>{img.desc}</p>
//               </div>
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default Slider;


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