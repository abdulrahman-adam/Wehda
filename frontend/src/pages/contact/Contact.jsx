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
    const nameRegex = /^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/;
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

    try {
      const { data } = await axios.post("/api/contact/send", formData);
      if (data.success) {
        toast.success(data.message);
        setFormData({ name: "", email: "", telephone: "", message: "" });
      }
    } catch (error) {
      toast.error("Erreur serveur.");
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 xl:px-32 mb-20 bg-gradient-to-br from-gray-50 via-white to-indigo-50/40 rounded-[2.5rem] py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-6 md:mt-6">
        {/* LEFT */}
        <div className="space-y-8 animate-fadeIn">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Contactez-nous
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Une question sur une commande ou un partenariat ? Nos experts vous
              répondent sous 24h.
            </p>
          </div>

          <div className="space-y-6">
            <a
              href="tel:+33 7 53 48 50 96"
              className="flex items-center gap-5 group w-fit"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="bi bi-telephone text-xl"></i>
              </div>
              <span className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                07 53 48 50 96
              </span>
            </a>

            <a
              href="mailto:contact@votre-boutique.com"
              className="flex items-center gap-5 group w-fit"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="bi bi-envelope text-xl"></i>
              </div>
              <span className="text-lg font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                contact@wehda.fr
              </span>
            </a>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600">
                <i className="bi bi-geo-alt text-xl"></i>
              </div>
              <span className="text-lg font-semibold text-gray-700 pt-2">
                66 Rue Louis Blanc, 75010 Paris
              </span>
            </div>
          </div>

          {/* MAP */}
          <div className="w-full h-72 rounded-3xl overflow-hidden border border-indigo-100 shadow-inner grayscale hover:grayscale-0 transition-all duration-500">
        
            <iframe
            title="location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30654.629694435593!2d2.463839198924414!3d48.720003371655736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m3!3e6!4m0!4m0!5e1!3m2!1sfr!2sfr!4v1776835941508!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{border:0}}
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white/90 backdrop-blur-xl p-8 md:p-10 lg:p-12 rounded-[2.5rem] border border-indigo-100 shadow-2xl shadow-indigo-100/40">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Nom Complet
                </label>
                <input
                  type="text"
                  placeholder="Prénom Nom"
                  className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-white/70 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  value={formData.name}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@domaine.com"
                  className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-white/70 transition-all"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  value={formData.email}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Téléphone
              </label>
              <input
                type="tel"
                placeholder="+33 1 23 45 67 89"
                className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-white/70 transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
                value={formData.telephone}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Comment pouvons-nous vous aider ?"
                className="w-full p-4 rounded-2xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none bg-white/70 transition-all resize-none"
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                value={formData.message}
              ></textarea>
            </div>

            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-violet-700 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <i className="bi bi-send-fill"></i> Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
