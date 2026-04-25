import React from 'react';
import { Phone, MapPin, ArrowRight } from 'lucide-react';

const Hero = () => {
  const phoneNumber = "0987654321";
  const mapLocation = "https://www.google.com/maps/dir//Paris+France";

  return (
    <section className="relative w-full bg-white py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* COLONNE GAUCHE : TEXTE & TEL */}
          <div className="flex flex-col space-y-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 block">
                Contact Rapide
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">
                Explorer les <br />
                <span className="text-blue-600 not-italic">Collections</span>
              </h1>
            </div>

            <a 
              href={`tel:${phoneNumber}`}
              className="group flex items-center gap-6 p-6 rounded-[30px] bg-blue-50 border-2 border-transparent hover:border-blue-600 transition-all w-full max-w-sm shadow-sm"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Phone size={28} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Appelez-nous</p>
                <p className="text-xl font-black text-gray-900">{phoneNumber}</p>
              </div>
            </a>
          </div>

          {/* COLONNE DROITE : MAPS & IFRAME */}
          <div className="flex flex-col space-y-8">
            <div className="relative group overflow-hidden rounded-[40px] bg-gray-100 border-2 border-gray-100 shadow-2xl aspect-video lg:aspect-square max-h-[400px]">
              {/* IFRAME MAPS */}
              <iframe
                title="Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.29229261567366!3d48.85837007928746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca979a741c901!2sTour+Eiffel!5e0!3m2!1sfr!2sfr!4v1565104863334!5m2!1sfr!2sfr"
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                allowFullScreen=""
                loading="lazy"
              ></iframe>

              {/* OVERLAY MAPS CLICKABLE */}
              <a 
                href={mapLocation}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 hover:bg-blue-700 transition-colors active:scale-95"
              >
                <MapPin size={24} />
                <span className="font-black uppercase text-[10px] tracking-widest">Ouvrir Maps</span>
              </a>
            </div>
          </div>

        </div>
      </div>
      
      {/* DECORATION BACKGROUND */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
    </section>
  );
};

export default Hero;