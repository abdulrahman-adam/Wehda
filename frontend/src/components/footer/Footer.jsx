import React from "react";

const Footer = () => {
  const footerSections = [
    {
      title: "Entreprise",
      links: ["À propos", "Conditions", "Confidentialité"],
    },
    {
      title: "Support",
      links: ["Contact", "FAQ", "Livraison"],
    },
    {
      title: "Boutique",
      links: ["Produits", "Nouveautés", "Promotions"],
    },
  ];

  return (
<footer className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border-t border-gray-800 shadow-inner text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-10">

        {/* 🔹 TOP */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-6">

          {/* BRAND */}
          <div>
            <h2 className="text-xl font-bold text-indigo-600">WEHDA</h2>
            <p className="mt-2 text-gray-600 text-sm max-w-sm">
              Plateforme e-commerce moderne, rapide et sécurisée.
            </p>
          </div>

          {/* 🔹 LINKS (ALWAYS 3 COLUMNS) */}
          <div className="w-full grid grid-cols-3 gap-4 text-center sm:text-left">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-xs sm:text-sm font-semibold text-white-900 mb-2">
                  {section.title}
                </h3>

                <ul className="space-y-1 sm:space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="block text-gray-500 text-[11px] sm:text-sm hover:text-indigo-600 transition"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 🔹 TRUST BADGES */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-gray-500 mt-4">
            <span className="flex items-center gap-1">
              <i className="bi bi-shield-check text-green-500"></i> Sécurisé
            </span>
            <span className="flex items-center gap-1">
              <i className="bi bi-truck text-indigo-500"></i> Livraison
            </span>
            <span className="flex items-center gap-1">
              <i className="bi bi-arrow-repeat text-purple-500"></i> Retours
            </span>
          </div>

          {/* 🔹 SOCIAL */}
          <div className="flex gap-3 mt-4">
            {["facebook", "instagram", "twitter-x"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white transition"
              >
                <i className={`bi bi-${icon}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* 🔹 BOTTOM */}
        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-gray-500 text-xs sm:text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-indigo-600">WEHDA</span>
          </p>

          <div className="flex gap-4 text-xs sm:text-sm text-gray-400">
            <a href="#" className="hover:text-gray-700">Confidentialité</a>
            <a href="#" className="hover:text-gray-700">Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;