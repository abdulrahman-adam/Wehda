import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    message: "",
  });

  const validateForm = () => {
    const { name, email, telephone, message } = formData;
    const nameRegex = /^[a-zA-ZÀ-ÿ]{2,}\s+[a-zA-ZÀ-ÿ]{2,}/;
    const phoneRegex = /^[0-9+]{8,15}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
      toast.error("Veuillez entrer votre Prénom et Nom.");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Email invalide.");
      return false;
    }
    if (!phoneRegex.test(telephone)) {
      toast.error("Téléphone invalide.");
      return false;
    }
    if (message.length < 10) {
      toast.error("Message trop court.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loadingToast = toast.loading("Envoi en cours...");
    try {
      const { data } = await axios.post("/api/contact/send", formData);
      toast.dismiss(loadingToast);
      if (data.success) {
        toast.success(data.message);
        setFormData({ name: "", email: "", telephone: "", message: "" });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erreur serveur.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-16 lg:px-24 xl:px-32 mb-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/40 rounded-[2.5rem] py-4 md:py-10 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-4 transition-all duration-1000 ease-out translate-y-0 opacity-100">
        
        {/* LEFT SECTION - INFO & MAP */}
        <div className="space-y-8 animate-fadeInLeft">
          <div className="transform transition-all duration-700 hover:translate-x-1">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600">
              Contactez-nous
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed max-w-md">
              Une question sur une commande ou un partenariat ? Nos experts vous
              répondent sous <span className="text-indigo-600 font-bold">24h</span>.
            </p>
          </div>

          <div className="space-y-5">
            <a
              href="tel:+33749992487"
              className="flex items-center gap-5 group w-fit p-2 -ml-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm">
                <i className="bi bi-telephone text-xl"></i>
              </div>
              <span className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                07 49 99 24 87
              </span>
            </a>

            <a
              href="mailto:oumabarar.paris@gmail.com"
              className="flex items-center gap-5 group w-fit p-2 -ml-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-sm">
                <i className="bi bi-envelope text-xl"></i>
              </div>
              <span className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                oumabarar.paris@gmail.com
              </span>
            </a>

            <div className="flex items-start gap-5 group p-2 -ml-2 rounded-2xl transition-all duration-300">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 group-hover:bounce transition-all">
                <i className="bi bi-geo-alt text-xl"></i>
              </div>
              <a href="https://share.google/DaR35i6fAsn97T6VS" target="_blank" rel="noreferrer">
                <span className="text-lg font-semibold text-gray-700 pt-2 block hover:text-indigo-600 transition duration-300">
                  12 Rue Doudeauville 75018 Paris
                </span>
              </a>
            </div>
          </div>

          {/* MAP WITH PROFESSIONAL WRAPPER */}
          <div className="group w-full h-80 rounded-[2rem] overflow-hidden border border-indigo-100 shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 ease-in-out relative transform hover:scale-[1.01]">
            <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d10493.54164627176!2d2.339577525216331!3d48.88899163688157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x47e66e64d6addfdb%3A0xfebe60e73d2c6f96!2s12%20Rue%20Doudeauville%2C%2075018%20Paris!3m2!1d48.888979!2d2.3580315!5e0!3m2!1sfr!2sfr!4v1777655639649!5m2!1sfr!2sfr"
              className="w-full h-full object-cover"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* RIGHT SECTION - FORM */}
        <div className="bg-white/80 backdrop-blur-2xl p-6 md:p-10 lg:p-12 rounded-[3rem] border border-white shadow-[0_20px_50px_rgba(79,70,229,0.1)] transform animate-slideUp transition-all hover:shadow-indigo-200/50 duration-500">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-500 ml-1 transition-colors group-focus-within:text-indigo-600">
                  Nom Complet
                </label>
                <input
                  type="text"
                  placeholder="Prénom Nom"
                  className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-gray-50/50 transition-all duration-300"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  value={formData.name}
                />
              </div>

              <div className="group space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-indigo-500 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@domaine.com"
                  className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-gray-50/50 transition-all duration-300"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  value={formData.email}
                />
              </div>
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-indigo-500 ml-1">
                Téléphone
              </label>
              <input
                type="tel"
                placeholder="+33 1 23 45 67 89"
                className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-gray-50/50 transition-all duration-300"
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                value={formData.telephone}
              />
            </div>

            <div className="group space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-indigo-500 ml-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Comment pouvons-nous vous aider ?"
                className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-gray-50/50 transition-all duration-300 resize-none"
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                value={formData.message}
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-4 relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white py-5 rounded-2xl font-black text-lg tracking-widest hover:shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
            >
              <div className="flex items-center justify-center gap-3 relative z-10">
                <i className="bi bi-send-fill group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"></i>
                ENVOYER LE MESSAGE
              </div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>
        </div>
      </div>

      {/* CUSTOM ANIMATIONS */}
      <style jsx="true">{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Contact;