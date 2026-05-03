import React from "react";

const Footer = () => {
  const footerSections = [
    {
      title: "Entreprise",
      links: [
        { name: "À propos", href: "/about" },
        { name: "Conditions", href: "/terms" },
        { name: "Confidentialité", href: "/privacy-policy" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Livraison", href: "/shipping" },
      ],
    },
    {
      title: "Boutique",
      links: [
        { name: "Produits", href: "/products" },
        { name: "Nouveautés", href: "/new-arrivals" },
        { name: "Promotions", href: "/sales" },
      ],
    },
  ];

  return (
    <footer className="relative bg-[#02040a] border-t border-indigo-500/10 text-gray-200 overflow-hidden">
      {/* Effets de lumière en arrière-plan */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -mr-64 -mb-64"></div>
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full -ml-32 -mt-32"></div>
      </div>

      {/* Ligne lumineuse supérieure */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* COLONNE MARQUE & SLOGAN */}
          <div className="col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left animate-fadeIn">
            <div className="group cursor-default relative">
              <h2 className="text-3xl font-black tracking-tighter text-white transition-all duration-700 group-hover:text-indigo-400">
                <a href="/">WEHDA</a>
              </h2>
              <div className="h-0.5 w-8 bg-indigo-500 transition-all duration-500 group-hover:w-full mt-1"></div>
            </div>
            
            <p className="mt-6 text-gray-400 text-sm leading-relaxed max-w-xs font-medium">
              Plateforme e-commerce moderne, rapide et sécurisée. Redéfinissez votre expérience shopping.
            </p>

            <p className="mt-4 text-gray-500 text-xs italic">
              Découvrez une sélection exclusive de produits livrés chez vous en un clin d'œil.
            </p>
            
            {/* BADGE MICRO-ENTREPRISE & LOCALISATION */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Micro-entreprise
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10">
                <i className="bi bi-geo-alt-fill mr-1 text-indigo-500"></i> <a href="https://www.google.com/maps/place/64+Rue+Louis+Blanc,+75010+Paris/@48.8838015,2.3579371,17z/data=!4m6!3m5!1s0x47e66e70546f1479:0xcb1341dae1e0e515!8m2!3d48.883798!4d2.360512!16s%2Fg%2F11pw1y3h47?entry=ttu&g_ep=EgoyMDI2MDQyOS4wIKXMDSoASAFQAw%3D%3D">Basé à Paris 10</a>
              </span>
            </div>

            {/* RÉSEAUX SOCIAUX */}
            <div className="flex gap-4 mt-8">
              {["facebook", "instagram", "twitter-x"].map((icon) => (
                <a
                  key={icon}
                  href={`https://${icon}.com`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 hover:-translate-y-1"
                >
                  <i className={`bi bi-${icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* LIENS DE NAVIGATION */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-3 gap-3 sm:gap-10">
            {footerSections.map((section, index) => (
              <div key={index} className="flex flex-col items-start text-left animate-slideUp" style={{ animationDelay: `${index * 150}ms` }}>
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-white mb-6 flex items-center">
                  <span className="h-4 w-0.5 bg-indigo-500 mr-2 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="text-gray-400 text-[11px] sm:text-sm hover:text-white transition-all duration-300">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BARRE INFÉRIEURE - LÉGALITÉ */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center text-center">
          <div className="bg-white/[0.02] backdrop-blur-md px-6 py-4 rounded-2xl border border-white/5">
            <p className="text-gray-500 text-[10px] sm:text-[11px] tracking-wide uppercase">
              © {new Date().getFullYear()} <span className="font-black text-indigo-400"><a href="/">WEHDA</a></span>. 
              Fait avec ❤️ à Paris 10e.
            </p>
            <p className="text-[9px] text-gray-600 mt-2 italic max-w-xl mx-auto">
              
              Toutes les transactions sont sécurisées et cryptées.
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.8s ease forwards; }
        .animate-slideUp { opacity: 0; animation: slideUp 0.6s ease forwards; }
      `}</style>
    </footer>
  );
};

export default Footer;