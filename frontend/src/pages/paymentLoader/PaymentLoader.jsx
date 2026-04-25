

import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import Loading from "../../components/loading/Loading";

const PaymentLoader = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchUser, fetchOrders, setCartItems } = useAppContext();
  const orderId = searchParams.get("orderId");

  const attemptsRef = useRef(0);
  const maxAttempts = 12; // 36 seconds total

useEffect(() => {
    let intervalId;
    // console.log("🔎 Component Mounted. OrderId:", orderId);

    const finalizePayment = async () => {
        // console.log("🚀 finalizePayment loop starting...");
        setCartItems({});

        intervalId = setInterval(async () => {
            attemptsRef.current += 1;
            // console.log(`📡 Polling attempt: ${attemptsRef.current}`);

            try {
                // We call fetchOrders - this updates the global state
                const latestOrders = await fetchOrders();
                
                // Use a flexible ID check (works for both SQL id or MongoDB _id)
                const currentOrder = latestOrders?.find(
                    (o) => String(o.id) === String(orderId) || String(o._id) === String(orderId)
                );

                if (currentOrder) {
                    // console.log("✅ Order found! Status isPaid:", currentOrder.isPaid);
                    
                    if (Number(currentOrder.isPaid) === 1 || currentOrder.isPaid === true) {
                        console.log("💰 Success! Redirecting...");
                        clearInterval(intervalId);
                        navigate("/my-orders");
                    }
                } else {
                    console.log("❓ Order #", orderId, "not in database yet...");
                }

                if (attemptsRef.current >= maxAttempts) {
                    console.log("⏰ Timeout reached.");
                    clearInterval(intervalId);
                    navigate("/my-orders");
                }
            } catch (err) {
                console.log("❌ Loop Error:", err.message);
            }
        }, 3000);
    };

    if (orderId) {
        finalizePayment();
    }

    // CLEANUP: This only runs when the component UNMOUNTS
    return () => {
        console.log("🧹 Cleanup: Stopping Polling.");
        if (intervalId) clearInterval(intervalId);
    };
    
    // REMOVED fetchOrders and fetchUser from dependencies to stop the infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [orderId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
      <Loading />
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold text-gray-800">Vérification du Paiement</h2>
        <p className="text-gray-500 mt-2">
          Nous confirmons votre transaction auprès de la banque...
        </p>
        {orderId && (
          <p className="text-xs text-indigo-500 font-mono mt-4 italic">
            Commande en cours: #{orderId}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentLoader;