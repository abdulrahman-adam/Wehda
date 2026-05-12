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
   <div className="fixed bottom-0 left-0 w-full z-[100] p-0 sm:p-4 animate-in fade-in slide-in-from-bottom-10 duration-700">
  <div className="max-w-6xl mx-auto min-h-[300px] lg:h-[450px] bg-white/95 dark:bg-[#0a192f]/95 backdrop-blur-2xl border border-gray-100 dark:border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.2)] overflow-hidden relative sm:rounded-[2rem]">
    
    {/* Bouton Fermer Rapide */}
    <button 
      onClick={handleDecline}
      className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors z-20 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
    >
      <X size={20} />
    </button>

    <div className="flex flex-col lg:flex-row h-full">
      
      {/* Côté Gauche : Contenu */}
      <div className="p-8 sm:p-12 lg:w-[60%] flex flex-col justify-center">
        
        {/* Badge Privacy */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-2xl text-[10px] sm:text-[12px] font-bold uppercase tracking-widest mb-6 w-fit">
          <Cookie size={14} className="animate-bounce" />
          Privacy & Experience
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-[#0a192f] dark:text-white leading-[1.1] mb-6">
          🍪 COOKIES & CONFIDENTIALITÉ<br/>
          <span className="text-emerald-500 italic font-medium text-xl sm:text-3xl">telle est la question.</span>
        </h2>

        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
          Bienvenue chez <span className="text-[#0a192f] dark:text-emerald-400 font-bold">Wehda Grocery</span>. 
          Nos cookies rendent votre shopping plus intelligent, sécurisé et surtout, plus savoureux.
        </p>

        {/* Grille de Features (Cachée sur très petits écrans si besoin, mais ici optimisée) */}
        <div className="hidden sm:grid grid-cols-2 gap-6 mt-8">
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 p-3 h-fit rounded-2xl">
              <ShieldCheck className="text-emerald-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0a192f] dark:text-white text-sm">Sécurité</h4>
              <p className="text-gray-400 text-xs mt-1">Données cryptées.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-blue-500/10 p-3 h-fit rounded-2xl">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-[#0a192f] dark:text-white text-sm">IA Shopping</h4>
              <p className="text-gray-400 text-xs mt-1">Sur mesure.</p>
            </div>
          </div>
        </div>

        {/* Boutons d'Action Premium */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
          <button 
            onClick={handleAccept}
            className="group w-full sm:w-auto bg-[#0a192f] dark:bg-emerald-600 text-white font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all duration-500 shadow-xl shadow-emerald-200/20 active:scale-95"
          >
            Accepter & Continuer
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button 
            onClick={handleDecline}
            className="w-full sm:w-auto text-gray-400 hover:text-red-500 dark:hover:text-gray-200 font-bold px-8 py-4 transition-all text-sm uppercase tracking-widest"
          >
            Refuser
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap gap-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest border-t border-gray-50 dark:border-white/5 pt-6">
          <button className="text-emerald-600 hover:text-emerald-400 transition-colors">Partenaires</button>
          <button className="text-gray-400 hover:text-[#0a192f] dark:hover:text-white transition-colors">Politique de confidentialité</button>
        </div>
      </div>

      {/* Côté Droit : Visuel Premium */}
      <div className="hidden lg:flex flex-1 bg-[#0a192f] dark:bg-[#0c1d36] relative items-center justify-center overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-emerald-500 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-blue-500 rounded-full blur-[100px] animate-pulse" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-28 h-28 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] flex items-center justify-center text-6xl shadow-2xl mb-6 transform -rotate-12 hover:rotate-0 transition-transform duration-700">
            🍏
          </div>
          <h3 className="text-white text-3xl font-black tracking-tighter">Wehda</h3>
          <p className="text-emerald-400 text-sm font-bold mt-2 tracking-[4px] uppercase opacity-70">Grocery</p>
          
          {/* Décoration minimaliste */}
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" />
            ))}
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
  );
};

export default CookieBanner;