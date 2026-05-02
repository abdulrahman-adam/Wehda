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
    <footer className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 border-t border-gray-800/50 shadow-2xl text-gray-200 overflow-hidden">
      {/* Top Animated Glow Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-16">
          
          {/* BRAND COLUMN */}
          <div className="col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left animate-fadeIn">
            <div className="group cursor-default relative">
              <h2 className="text-3xl font-black tracking-tighter text-indigo-500 transition-all duration-700 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]">
                OUMABARAR
              </h2>
              <div className="h-0.5 w-0 bg-indigo-500 transition-all duration-500 group-hover:w-full mt-1 shadow-[0_0_8px_rgba(99,102,241,1)]"></div>
            </div>
            
            <p className="mt-6 text-gray-400 text-sm leading-relaxed max-w-xs transition-colors hover:text-gray-300">
              Plateforme e-commerce moderne, rapide et sécurisée.
            </p>

            {/* SOCIAL ICONS WITH SPRING HOVER */}
            <div className="flex gap-4 mt-8">
              {["facebook", "instagram", "twitter-x"].map((icon) => (
                <a
                  key={icon}
                  href={`https://${icon}.com`}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-900/50 border border-gray-800 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 hover:-translate-y-1.5 transition-all duration-300 ease-out hover:shadow-[0_8px_20px_-8px_rgba(99,102,241,0.6)]"
                >
                  <i className={`bi bi-${icon} text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* LINKS: Forced 3-column row on mobile with staggered animations */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-3 gap-3 sm:gap-10">
            {footerSections.map((section, index) => (
              <div 
                key={index} 
                className="flex flex-col items-start text-left animate-slideUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <h3 className="group flex items-center text-[10px] sm:text-xs font-black uppercase tracking-widest text-indigo-400/90 mb-6">
                  <span className="h-4 w-0.5 bg-indigo-500 mr-2 rounded-full transition-all duration-300 group-hover:h-6 group-hover:shadow-[0_0_8px_rgba(99,102,241,1)]"></span>
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, i) => (
                    <li key={i} className="relative group">
                      <a
                        href={link.href}
                        className="inline-block text-gray-400 text-[11px] sm:text-sm hover:text-white transition-all duration-300 transform group-hover:translate-x-1"
                      >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-indigo-500 to-transparent transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM BAR WITH GLASS EFFECT */}
        <div className="mt-16 pt-8 border-t border-gray-800/50 flex flex-col items-center gap-6">
          <div className="bg-gray-900/30 backdrop-blur-md px-8 py-3 rounded-full border border-gray-800/50 hover:border-indigo-500/30 transition-colors duration-500 group">
            <p className="text-gray-500 text-[10px] sm:text-[11px] tracking-wide uppercase">
              © {new Date().getFullYear()} <span className="font-black text-indigo-500 group-hover:text-indigo-400 transition-colors">OUMABARAR</span>. 
              <span className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity">Tous droits réservés.</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;