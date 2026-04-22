import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios, deleteOrder } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) setOrders(data.orders);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status: event.target.value,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchOrders();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    // 1. Call the backend
    const success = await deleteOrder(orderId);

    // 2. If the backend says OK, remove it from the screen immediately
    if (success) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen w-full">
      <div className="max-w-6xl mx-auto">
        <h4 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-blue-500 pl-4">
          Admin Order Dashboard
        </h4>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              {/* --- Header: User & Order ID --- */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <img
                      src={assets.box_icon}
                      alt=""
                      className="w-5 h-5 invert"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                      Customer
                    </p>
                    <p className="text-sm font-semibold">
                      {order.user?.name || "Guest"} • {order.user?.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                    Order ID
                  </p>
                  <p className="text-sm font-mono text-gray-700">#{order.id}</p>
                </div>
              </div>

              {/* --- Content: Products & Shipping --- */}
              <div className="flex flex-col lg:flex-row">
                {/* Product List */}
                <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 mb-4 last:mb-0 items-center"
                    >
                      <img
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg bg-gray-100 border"
                        src={
                          Array.isArray(item.product?.image)
                            ? item.product.image[0]
                            : item.product?.image || assets.box_icon
                        }
                        alt={item.product?.name}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
                          {item.product?.name}{" "}
                          <span className="text-blue-500 ml-2">
                            x{item.quantity}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                          {item.product?.category}
                        </p>
                        <p className="text-sm font-medium mt-1 text-gray-700">
                          Subtotal:{" "}
                          {(item.product?.offerPrice * item.quantity).toFixed(
                            2,
                          )}{" "}
                          {currency}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logistics & Payment */}
                <div className="w-full lg:w-80 bg-gray-50/30 p-6 flex flex-col justify-between gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Shipping to
                      </p>
                      {order.address ? (
                        <div className="text-gray-700 text-sm leading-snug">
                          {/* Note: Your DB shows firstName and lastName are separate columns */}
                          <p className="font-bold text-gray-900">
                            Name: {order.address.firstName}{" "}
                            {order.address.lastName}
                          </p>
                          Address: <p>{order.address.street}</p>
                          <p>
                            {order.address.city}{" "}
                            {order.address.zipcode} {order.address.country}
                          </p>
                          <p className="text-blue-600 font-medium">
                            Telephone: {order.address.phone}
                          </p>
                        </div>
                      ) : (
                        <p className="text-red-400 text-xs italic">
                          No address linked to this user
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Details
                      </p>
                      <p className="text-gray-700">
                        Type: <b>{order.paymentType}</b>
                      </p>
                      <p className="text-gray-700">
                        Date:{" "}
                        <b>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </b>
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total: {order.amount.toFixed(2)} {currency}
                      </span>
                      <img
                        onClick={() => handleDelete(order.id)}
                        src={assets.remove_icon}
                        className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                        alt="Delete"
                      />
                    </div>
                    <select
                      onChange={(e) => statusHandler(e, order.id)}
                      value={order.status}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Packing">Packing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
