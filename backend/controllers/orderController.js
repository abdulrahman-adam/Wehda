

// import Products from "../models/Products.js";
// import Order from "../models/Order.js";
// import User from "../models/User.js";
// import Stripe from "stripe";
// import { Op } from "sequelize";
// import Address from "../models/Address.js";

// // --- 1. Get Orders by User Id ---
// export const getUserOrders = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const rawOrders = await Order.findAll({
//       where: {
//         userId,
//         [Op.or]: [{ isPaid: true }, { paymentType: "COD" }],
//       },
//       order: [["createdAt", "DESC"]],
//     });

//     const orders = await Promise.all(
//       rawOrders.map(async (order) => {
//         const orderData = order.get({ plain: true });

//         // Standardizing items parsing
//         if (typeof orderData.items === "string") {
//           orderData.items = JSON.parse(orderData.items);
//         }

//         const itemsWithImages = await Promise.all(
//           orderData.items.map(async (item) => {
//             const productDetails = await Products.findByPk(item.product);
//             return {
//               ...item,
//               // 'item.variant' is preserved here from the DB record
//               product: productDetails ? productDetails.get({ plain: true }) : null,
//             };
//           }),
//         );

//         orderData.items = itemsWithImages;
//         return orderData;
//       }),
//     );

//     return res.json({ success: true, orders });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };

// // --- 2. Get ALL Orders (Admin) ---
// export const getAllOrders = async (req, res) => {
//   try {
//     const rawOrders = await Order.findAll({
//       where: { [Op.or]: [{ isPaid: true }, { paymentType: "COD" }] },
//       order: [["createdAt", "DESC"]],
//     });

//     const orders = await Promise.all(
//       rawOrders.map(async (order) => {
//         const orderData = order.get({ plain: true });
//         const userInfo = await User.findByPk(orderData.userId, { attributes: ["name", "email"] });

//         if (typeof orderData.items === "string") {
//           orderData.items = JSON.parse(orderData.items);
//         }

//         const itemsWithDetails = await Promise.all(
//           orderData.items.map(async (item) => {
//             const productInfo = await Products.findByPk(item.product);
//             return {
//               ...item,
//               // Admin can now see item.variant (e.g. "XL-Red")
//               product: productInfo ? productInfo.get({ plain: true }) : null,
//             };
//           }),
//         );

//         return { ...orderData, user: userInfo, items: itemsWithDetails };
//       }),
//     );
//     return res.json({ success: true, orders });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };


// // --- 4. Place Order COD (Calculated & Variant Aware) ---
// export const placeOrderCOD = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;

//     // 1. Validation
//     if (!address || !items || items.length === 0) {
//       return res.json({ success: false, message: "Données invalides" });
//     }

//     // 2. CALCULATE AMOUNT (This fixes the 'amount is not defined' error)
//     let amount = 0;
//     const TAX_RATE = 0.2; // 20%

//     for (const item of items) {
//       const product = await Products.findByPk(item.product);
//       if (product) {
//         // Use offerPrice (or price if you don't have offerPrice)
//         amount += (product.offerPrice || product.price) * item.quantity;
//       }
//     }

//     // Add Tax
//     const totalWithTax = amount + (amount * TAX_RATE);

//     // 3. Build Order Object
//     const orderData = {
//       userId,
//       // Map ensures the data is clean and variants are saved
//       items: items.map(item => ({
//         product: item.product,
//         quantity: item.quantity,
//         variant: item.variant || "Standard"
//       })),
//       amount: totalWithTax, 
//       address,
//       paymentType: "COD",
//       isPaid: false,
//       status: "Order Placed",
//       date: new Date(), // Professional date format
//     };

//     // 4. Create Order & Empty Cart
//     await Order.create(orderData);
    
//     // Optional: Clear user cart after COD order
//     await User.update({ cartItems: "{}" }, { where: { id: userId } });

//     return res.json({ success: true, message: "Commande passée avec succès !" });
//   } catch (error) {
//     console.error("COD Error:", error);
//     return res.json({ success: false, message: error.message });
//   }
// };
// // --- 5. Place Order Stripe (Professional Variant Display) ---
// export const placeOrderStripe = async (req, res) => {
//   try {
//     const { userId, items, address } = req.body;
//     const { origin } = req.headers;

//     if (!address || !items || items.length === 0) return res.json({ success: false, message: "Invalid data" });

//     let stripeLineItems = [];
//     let totalAmountForDB = 0;
//     const TAX_RATE = 0.2;

//     for (const item of items) {
//       const product = await Products.findByPk(item.product);
//       if (product) {
//         const priceWithTax = product.offerPrice * (1 + TAX_RATE);
        
//         stripeLineItems.push({
//           price_data: {
//             currency: "eur",
//             product_data: {
//               // --- PRO UPDATE: Display variant name on Stripe Checkout screen ---
//               name: item.variant && item.variant !== "Standard" 
//                 ? `${product.name} (${item.variant})` 
//                 : product.name,
//               images: Array.isArray(product.image) ? [product.image[0]] : [product.image],
//             },
//             unit_amount: Math.round(priceWithTax * 100),
//           },
//           quantity: item.quantity,
//         });

//         totalAmountForDB += priceWithTax * item.quantity;
//       }
//     }

//     const order = await Order.create({
//       userId,
//       items,
//       amount: totalAmountForDB,
//       address,
//       paymentType: "Online",
//       isPaid: false,
//       status: "Order Placed",
//       date: new Date(),
//     });

//     const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY); 
//     const session = await stripeInstance.checkout.sessions.create({
//       line_items: stripeLineItems,
//       mode: "payment",
//       success_url: `${origin}/loader?next=my-orders`,
//       cancel_url: `${origin}/cart`,
//       metadata: { orderId: order.id.toString(), userId: userId.toString() },
//     });

//     return res.json({ success: true, url: session.url });
//   } catch (error) {
//     return res.json({ success: false, message: error.message });
//   }
// };



// // --- 6. Stripe Webhook (Fixed) ---
// export const stripeWebhooks = async (request, response) => {
//   const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
//   const sig = request.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (error) {
//     return response.status(400).send(`Webhook Error: ${error.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const { orderId, userId } = session.metadata;

//     try {
//       await Order.update(
//         { isPaid: true, status: "Order Placed" }, 
//         { where: { id: Number(orderId) } }
//       );
//       await User.update({ cartItems: "{}" }, { where: { id: userId } });
//     } catch (dbError) {
//       console.error("Webhook DB Error:", dbError.message);
//     }
//   }
//   response.json({ received: true });
// };



// export const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;
//     await Order.update({ status }, { where: { id: orderId } });
//     res.json({ success: true, message: "Status updated successfully" });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// export const deleteOrder = async (req, res) => {
//   try {
//     await Order.destroy({ where: { id: req.params.id } });
//     res.json({ success: true, message: "Order deleted" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

import Products from "../models/Products.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Address from "../models/Address.js"; // Added this import
import Stripe from "stripe";
import { Op } from "sequelize";

// --- PRIVATE HELPER: Attaches live Product, User, & Address info ---
const fetchOrderDetails = async (order) => {
    const orderData = order.get({ plain: true });

    // 1. Fetch User Info
    const user = await User.findByPk(orderData.userId, { 
        attributes: ["name", "email"]
    });

    // 2. NEW: Fetch Full Address Object (Fixes the "Empty Name/Address" issue)
    let addressInfo = null;
    if (orderData.address) {
        // If address is an ID (Number), fetch the object. If it's already an object, use it.
        if (typeof orderData.address === 'number' || !isNaN(orderData.address)) {
            addressInfo = await Address.findByPk(orderData.address);
        } else {
            addressInfo = orderData.address;
        }
    }

    // 3. Fetch Live Product Details for each item
    const itemsWithDetails = await Promise.all(
        orderData.items.map(async (item) => {
            const productInfo = await Products.findByPk(item.product);
            return {
                ...item,
                product: productInfo ? productInfo.get({ plain: true }) : null,
            };
        })
    );

    return { 
        ...orderData, 
        user, 
        address: addressInfo, // Returns the full object now, not just an ID
        items: itemsWithDetails 
    };
};

// --- 1. Get Orders for Seller Dashboard ---
export const getSellerOrders = async (req, res) => {
    try {
        const rawOrders = await Order.findAll({
            order: [["createdAt", "DESC"]],
        });
        const orders = await Promise.all(rawOrders.map(fetchOrderDetails));
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- 2. Get User Orders (My Account) ---
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const rawOrders = await Order.findAll({
            where: {
                userId,
                [Op.or]: [{ isPaid: true }, { paymentType: "COD" }],
            },
            order: [["createdAt", "DESC"]],
        });
        const orders = await Promise.all(rawOrders.map(fetchOrderDetails));
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- 3. Place Order COD ---
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || !items || items.length === 0) {
            return res.json({ success: false, message: "Données invalides" });
        }

        let subtotal = 0;
        for (const item of items) {
            const product = await Products.findByPk(item.product);
            if (product) subtotal += (product.offerPrice || product.price) * item.quantity;
        }

        const shippingFee = subtotal > 500 ? 0 : 20;
        const totalAmount = subtotal + (subtotal * 0.2) + shippingFee;

        const newOrder = await Order.create({
            userId,
            items: items.map(i => ({ ...i, variant: i.variant || "Standard" })),
            amount: totalAmount,
            subtotal,
            shippingFee,
            address,
            paymentType: "COD",
        });

        await User.update({ cartItems: "{}" }, { where: { id: userId } });
        res.json({ success: true, message: "Commande passée !", orderNumber: newOrder.orderNumber });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- 4. Place Order Stripe ---
export const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        const { origin } = req.headers;

        let subtotal = 0;
        const stripeLineItems = [];

        for (const item of items) {
            const product = await Products.findByPk(item.product);
            if (product) {
                const price = product.offerPrice || product.price;
                subtotal += price * item.quantity;
                stripeLineItems.push({
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: item.variant !== "Standard" ? `${product.name} [${item.variant}]` : product.name,
                            images: [Array.isArray(product.image) ? product.image[0] : product.image],
                        },
                        unit_amount: Math.round(price * 1.2 * 100),
                    },
                    quantity: item.quantity,
                });
            }
        }

        const order = await Order.create({
            userId, items, amount: (subtotal * 1.2) + (subtotal > 500 ? 0 : 20),
            subtotal, address, paymentType: "Stripe", status: "Pending"
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.create({
            line_items: stripeLineItems,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders&orderId=${order.id}`,
            cancel_url: `${origin}/cart`,
            metadata: { orderId: order.id.toString(), userId: userId.toString() },
        });

        res.json({ success: true, url: session.url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- 5. Admin Actions ---
export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.update({ status }, { where: { id: orderId } });
        res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 6. Stripe Webhook ---
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const { orderId, userId } = event.data.object.metadata;
        await Order.update({ isPaid: true, status: "Order Placed" }, { where: { id: orderId } });
        await User.update({ cartItems: "{}" }, { where: { id: userId } });
    }
    response.json({ received: true });
};