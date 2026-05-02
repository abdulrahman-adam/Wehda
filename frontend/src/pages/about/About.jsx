import React from 'react';
import { Target, Eye, Award, Users, ShieldCheck, Globe } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Clients Satisfaits', value: '50K+', icon: <Users className="w-6 h-6" /> },
    { label: 'Bureaux Internationaux', value: '04', icon: <Globe className="w-6 h-6" /> },
    { label: 'Prix d’Excellence', value: '12', icon: <Award className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* SECTION HERO - Adaptative du mobile au 4K */}
      <section className="relative py-20 md:py-32 lg:py-40 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute transform -rotate-12 -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[120px]"></div>
          <div className="absolute transform rotate-12 -bottom-20 -right-20 w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h4 className="text-teal-400 font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-teal-400"></span> Notre Histoire
            </h4>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              Redéfinir <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-400">
                l'E-commerce Moderne.
              </span>
            </h1>
            <p className="text-slate-400 text-lg md:text-2xl leading-relaxed font-light">
              OUMABARAR est né en 2024 d'une ambition simple : créer un écosystème où l'excellence du produit rencontre la fluidité technologique absolue.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION & VISION - Grille responsive */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-10">
            <div className="group p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-5">Notre Mission</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Offrir aux consommateurs une expérience d'achat rapide, sécurisée et transparente. Nous éliminons les barrières entre le désir et l'acquisition.
              </p>
            </div>

            <div className="group p-10 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] transition-all duration-500">
              <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-teal-200 group-hover:scale-110 transition-transform">
                <Eye size={32} />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-5">Notre Vision</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Devenir la place de marché de référence pour les produits premium, où chaque choix sur OUMABARAR est un gage de qualité et de style.
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[4/5] rounded-[3rem] bg-slate-200 overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-slate-500 italic px-10 text-center">
                [Insérez ici une photo haute résolution de votre bureau ou équipe]
              </div>
            </div>
            {/* Badge de confiance flottant (Masqué sur mobile) */}
            <div className="absolute -bottom-8 -left-8 bg-white p-10 rounded-[2rem] shadow-2xl hidden md:block border border-slate-100">
              <p className="text-indigo-600 font-black text-5xl italic mb-1">100%</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Satisfaction Client Garantie</p>
            </div>
          </div>
        </div>
      </section>

      {/* BANDEAU STATISTIQUES - Sombre et Élégant */}
      <section className="bg-slate-950 py-20 lg:py-32 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-16 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="text-teal-400 mb-6 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
                <h2 className="text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter">{stat.value}</h2>
                <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOS VALEURS - Grille épurée */}
      <section className="max-w-7xl mx-auto px-6 py-24 lg:py-40 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-20 tracking-tight">Nos Piliers Fondamentaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { t: 'Innovation', d: 'Nous intégrons les dernières technologies pour garantir une navigation fluide et intuitive.' },
            { t: 'Sécurité', d: 'Vos données et transactions sont protégées par les standards de chiffrement les plus stricts au monde.' },
            { t: 'Fiabilité', d: 'De la commande à la livraison, notre processus est conçu pour une ponctualité chirurgicale.' }
          ].map((val, i) => (
            <div key={i} className="p-12 rounded-[2.5rem] border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 transition-all">
              <h4 className="text-2xl font-bold text-indigo-600 mb-6">{val.t}</h4>
              <p className="text-slate-500 text-lg leading-relaxed">
                {val.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-8">Prêt à vivre l'expérience OUMABARAR ?</h2>
            <button className="bg-white text-indigo-600 font-bold py-5 px-12 rounded-full hover:bg-teal-400 hover:text-white transition-all transform hover:scale-105 shadow-xl">
             <a href="/"> Découvrir la Boutique</a>
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
};

export default About;