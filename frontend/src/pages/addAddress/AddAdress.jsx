import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'

import toast from 'react-hot-toast'
import { useAppContext } from '../../context/AppContext';

// Composant InputField amélioré avec un effet de focus plus propre
const InputField = ({ type, placeholder, name, handleChange, address, label }) => (
    <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-xs font-semibold text-gray-500 uppercase ml-1">{label}</label>}
        <input 
            type={type} 
            placeholder={placeholder} 
            onChange={handleChange} 
            name={name} 
            value={address[name]} 
            required
            className='w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50/50'
        />
    </div>
)

const AddAddress = () => {
    const { axios, user, navigate } = useAppContext();

    const [address, setAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/address/add", { address });
            if (data.success) {
                toast.success(data.message);
                navigate("/cart")
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (!user) {
            navigate("/cart");
        }
    }, [user, navigate])

    return (
        <div className='mt-10 pb-20 max-w-6xl mx-auto px-4'>
            {/* --- TITRE SECTION --- */}
            <div className='flex flex-col items-center mb-12 text-center'>
                <h1 className='text-3xl md:text-4xl font-black text-gray-800 uppercase tracking-tight'>
                    Informations de <span className='text-indigo-600'>Livraison</span>
                </h1>
                <div className='w-20 h-1.5 bg-indigo-600 rounded-full mt-2'></div>
                <p className='text-gray-500 mt-4 max-w-md'>
                    Enregistrez votre adresse pour une expérience de commande plus rapide et sécurisée.
                </p>
            </div>

            <div className='flex flex-col lg:flex-row items-start justify-between gap-16'>
                {/* --- FORMULAIRE --- */}
                <div className='w-full lg:flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-50'>
                    <form onSubmit={onSubmitHandler} className='space-y-5'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name="firstName" type="text" placeholder="John" label="Prénom"/>
                            <InputField handleChange={handleChange} address={address} name="lastName" type="text" placeholder="Doe" label="Nom"/>
                        </div>
                        
                        <InputField handleChange={handleChange} address={address} name="email" type="email" placeholder="john@example.com" label="Email de contact"/>
                        <InputField handleChange={handleChange} address={address} name="street" type="text" placeholder="123 rue de l'Exemple" label="Adresse (Rue)"/>
                        
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name="city" type="text" placeholder="Paris" label="Ville"/>
                            <InputField handleChange={handleChange} address={address} name="zipcode" type="text" placeholder="75000" label="Code Postal"/>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name="country" type="text" placeholder="France" label="Pays"/>
                            <InputField handleChange={handleChange} address={address} name="phone" type="tel" placeholder="06 12 34 56 78" label="Téléphone"/>
                        </div>

                        <button className='w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] uppercase tracking-wider cursor-pointer'>
                            Enregistrer l'adresse
                        </button>
                    </form>
                </div>

                {/* --- IMAGE & INFO --- */}
                <div className='hidden lg:flex flex-1 flex-col items-center justify-center sticky top-24'>
                    <img 
                        src={assets.add_address_iamge} 
                        alt="Add Address Illustration" 
                        className='w-full max-w-md drop-shadow-2xl animate-pulse-slow' 
                    />
                    <div className='mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 max-w-sm'>
                        <p className='text-indigo-800 text-sm leading-relaxed text-center font-medium'>
                            "Vos données sont protégées. Nous utilisons ces informations uniquement pour assurer la livraison de vos colis."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddAddress