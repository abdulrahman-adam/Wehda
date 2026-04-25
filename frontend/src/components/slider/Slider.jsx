import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Importation des styles nécessaires
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Slider = () => {
  // Chemins directs vers tes images dans /public/images/
  const myImages = [
    { url: '/slider/banana_image_1.png', title: 'Ordinateure', desc: 'Vitesse de traitement Go' },
    { url: '/slider/basmati_rice_image.png', title: 'Mobile', desc: 'Connexions Redis actives' },
    { url: '/slider/carrot_image.png', title: 'Citron', desc: 'Scalabilité 100k' },
    { url: '/slider/apple_image.png', title: 'Ordinateur', desc: 'Scalabilité 100k' },
    { url: '/slider/barley_image.png', title: 'Ordinateur', desc: 'Scalabilité 100k' },
  ];

  return (
    <div style={{ width: '100%', margin: '1 auto', padding: '1px 10px', position: 'relative', height: '350px'}}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={15}
        loop={true}
        autoplay={{ delay: 1000 }}
        pagination={{ clickable: true }}
        navigation={true}
        // --- GESTION DU RESPONSIVE ---
        breakpoints={{
          // MOBILE : 1 image à la fois
          390: {
            slidesPerView: 1,
          },
          // TABLETTE : 2 images à la fois
          768: {
            slidesPerView: 2,
          },
          // LAPTOP / DESKTOP : 1 image large ou 3 en grille
          1024: {
            slidesPerView: 1, // On garde 1 pour un effet "Hero Banner"
          }
        }}
        style={{ borderRadius: '20px', height:'356px', marginTop: '0px'}}
      >
        {myImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="slide-card" style={{
              height:'356px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '15px',
              // Hauteur dynamique selon l'écran
              height: window.innerWidth < 768 ? '345px' : '500px'
            }}>
              <img 
                src={img.url} 
                alt={img.title}
                style={{
                  width: '100%',
                  height: '345px',
                  objectFit: 'contain' // Empêche la déformation
                }}
              />
              {/* Overlay Texte */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                padding: '20px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{img.title}</h3>
                <p style={{ margin: '5px 0 0', opacity: 0.8 }}>{img.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;

