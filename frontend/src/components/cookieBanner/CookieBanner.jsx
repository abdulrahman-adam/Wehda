import React, { useState, useEffect } from "react";
import { ShieldCheck, Cookie, BarChart3, X, ArrowRight } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Animation d'entrée après 1.5 seconde
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    // Logique pour accepter (ex: localStorage.setItem('cookies', 'true'))
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-4 sm:px-8 sm:pb-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-2xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-[2.5rem] overflow-hidden relative">
        
        {/* Bouton Fermer Rapide */}
        <button 
          onClick={handleDecline}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col lg:flex-row">
          
          {/* Côté Gauche : Contenu */}
          <div className="p-8 sm:p-12 lg:w-[60%]">
            
            {/* Badge Premium */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-[12px] font-bold uppercase tracking-widest mb-6">
              <Cookie size={14} className="animate-bounce" />
              Privacy & Experience
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0a192f] leading-[1.1] mb-6">
              🍪 OR NOT COOKIES,<br/>
              <span className="text-emerald-500 italic font-medium">telle est la question.</span>
            </h2>

            <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
              Bienvenue chez <span className="text-[#0a192f] font-bold">Wehda Grocery</span>. 
              Nous utilisons des cookies pour personnaliser vos courses, sécuriser vos paiements et rendre chaque visite plus savoureuse.
            </p>

            {/* Grille de Features Épurée */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="flex gap-4">
                <div className="bg-emerald-500/10 p-3 h-fit rounded-2xl">
                  <ShieldCheck className="text-emerald-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-sm">Sécurité Maximale</h4>
                  <p className="text-gray-400 text-xs mt-1">Données cryptées et anonymes.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-blue-500/10 p-3 h-fit rounded-2xl">
                  <BarChart3 className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-[#0a192f] text-sm">IA Shopping</h4>
                  <p className="text-gray-400 text-xs mt-1">Recommandations sur mesure.</p>
                </div>
              </div>
            </div>

            {/* Boutons d'Action Fonctionnels */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <button 
                onClick={handleAccept}
                className="group w-full sm:w-auto bg-[#0a192f] text-white font-bold px-10 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all duration-500 shadow-xl shadow-emerald-100 active:scale-95"
              >
                Accepter & Continuer
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={handleDecline}
                className="w-full sm:w-auto text-gray-400 hover:text-gray-900 font-bold px-8 py-4 transition-all text-sm uppercase tracking-widest"
              >
                Refuser
              </button>
            </div>

            <div className="mt-8 flex gap-6 text-[11px] font-bold uppercase tracking-tighter border-t border-gray-50 pt-6">
              <button className="text-emerald-600 hover:underline">Partenaires</button>
              <button className="text-gray-400 hover:text-[#0a192f]">Politique de confidentialité</button>
            </div>
          </div>

          {/* Côté Droit : Design Visuel (Masqué sur mobile) */}
          <div className="hidden lg:flex flex-1 bg-[#0a192f] relative items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
               <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
               <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl mb-6">
                🍏
              </div>
              <h3 className="text-white text-2xl font-black tracking-tighter">Wehda Grocery</h3>
              <p className="text-emerald-400 text-sm font-medium mt-2">Premium Experience</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CookieBanner;