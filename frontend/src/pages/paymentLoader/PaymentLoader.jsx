import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Loading from '../../components/loading/Loading';

const PaymentLoader = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const { fetchUser, fetchOrders, setCartItems } = useAppContext(); 

    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const finalizePayment = async () => {
            try {
                // 1. Clear cart locally immediately so Navbar updates
                setCartItems({});

                // 2. Wait for Webhook: Crucial for DB to catch up with Stripe
                await new Promise(resolve => setTimeout(resolve, 2500));

                // 3. Sync everything
                await fetchUser();    // Refresh user (confirms empty cart in DB)
                await fetchOrders();  // Refresh orders (shows the new 'Paid' order)

                // 4. Send user to their history
                navigate('/my-orders');
            } catch (error) {
                console.error("Redirection Error:", error);
                navigate('/my-orders'); 
            }
        };

        finalizePayment();
    }, [navigate, fetchUser, fetchOrders, setCartItems]);

    return (
        <div className="flex flex-col items-center justify-center bg-white">
            <Loading /> 
            <div className="text-center mt-6">
                <h2 className="text-2xl font-bold text-gray-800">Paiement Confirmé !</h2>
                <p className="text-gray-500 mt-2">Nous mettons à jour votre historique...</p>
                {orderId && (
                    <p className="text-xs text-indigo-500 font-mono mt-4 italic">Commande #{orderId}</p>
                )}
            </div>
        </div>
    );
};

export default PaymentLoader;