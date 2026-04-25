

import Products from "../models/Products.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import Address from "../models/Address.js"; // Added this import
import Stripe from "stripe";
import { Op } from "sequelize";
import Category from "../models/Category.js";

// --- PRIVATE HELPER: Attaches live Product, User, & Address info ---
// const fetchOrderDetails = async (order) => {
//     const orderData = order.get({ plain: true });

//     // 1. Fetch User Info
//     const user = await User.findByPk(orderData.userId, { 
//         attributes: ["name", "email"]
//     });

//     // 2. NEW: Fetch Full Address Object (Fixes the "Empty Name/Address" issue)
//     let addressInfo = null;
//     if (orderData.address) {
//         // If address is an ID (Number), fetch the object. If it's already an object, use it.
//         if (typeof orderData.address === 'number' || !isNaN(orderData.address)) {
//             addressInfo = await Address.findByPk(orderData.address);
//         } else {
//             addressInfo = orderData.address;
//         }
//     }

//     // 3. Fetch Live Product Details for each item
//     const itemsWithDetails = await Promise.all(
//         orderData.items.map(async (item) => {
//             const productInfo = await Products.findByPk(item.product);
//             return {
//                 ...item,
//                 product: productInfo ? productInfo.get({ plain: true }) : null,
//             };
//         })
//     );

//     return { 
//         ...orderData, 
//         user, 
//         address: addressInfo, // Returns the full object now, not just an ID
//         items: itemsWithDetails 
//     };
// };

// const fetchOrderDetails = async (order) => {
//     const orderData = order.get({ plain: true });

//     // 1. Fetch User Info
//     const user = await User.findByPk(orderData.userId, { 
//         attributes: ["name", "email"]
//     });

//     // 2. Fetch Full Address Object
//     let addressInfo = null;
//     if (orderData.address) {
//         if (typeof orderData.address === 'number' || !isNaN(orderData.address)) {
//             addressInfo = await Address.findByPk(orderData.address);
//         } else {
//             addressInfo = orderData.address;
//         }
//     }

//     // 3. Fetch Live Product Details (Updated to get Category manually)
//     const itemsWithDetails = await Promise.all(
//         orderData.items.map(async (item) => {
//             // Get the product
//             const productInfo = await Products.findByPk(item.product);
            
//             let productPlain = null;
//             if (productInfo) {
//                 productPlain = productInfo.get({ plain: true });
                
//                 // --- ADDED ONLY THIS: Manual Category Fetch ---
//                 if (productPlain.categId) {
//                     const category = await Category.findByPk(productPlain.categId);
//                     productPlain.categ = category ? category.get({ plain: true }) : null;
//                 }
//                 // -----------------------------------------------
//             }

//             return {
//                 ...item,
//                 product: productPlain,
//             };
//         })
//     );

//     return { 
//         ...orderData, 
//         user, 
//         address: addressInfo, 
//         items: itemsWithDetails 
//     };
// };

const fetchOrderDetails = async (order) => {
    try {
        const orderData = order.get({ plain: true });

        // 1. Fetch User Info
        const user = await User.findByPk(orderData.userId, { 
            attributes: ["name", "email"]
        });

        // 2. Fetch Full Address Object
        let addressInfo = null;
        if (orderData.address) {
            if (typeof orderData.address === 'number' || !isNaN(orderData.address)) {
                addressInfo = await Address.findByPk(orderData.address);
            } else {
                addressInfo = orderData.address;
            }
        }

        // 3. Fetch Live Product Details
        const itemsWithDetails = await Promise.all(
            (orderData.items || []).map(async (item) => {
                // IMPORTANT: Ensure "Products" is imported correctly at the top
                const productInfo = await Products.findByPk(item.product);
                
                let productPlain = null;
                if (productInfo) {
                    productPlain = productInfo.get({ plain: true });
                    
                    // --- FIX: Change 'categId' to 'categoryId' to match your Model ---
                    const catId = productPlain.categoryId; 
                    
                    if (catId) {
                        const category = await Category.findByPk(catId);
                        if (category) {
                            const categoryData = category.get({ plain: true });

                            // Fetch Parent for the "Parent > Child" breadcrumb in your HTML
                            if (categoryData.parentId) {
                                const parent = await Category.findByPk(categoryData.parentId);
                                categoryData.parent = parent ? parent.get({ plain: true }) : null;
                            }

                            // This attaches it so item.product.categ.text works
                            productPlain.categ = categoryData;
                        }
                    }
                }

                return {
                    ...item,
                    product: productPlain,
                };
            })
        );

        return { 
            ...orderData, 
            user, 
            address: addressInfo, 
            items: itemsWithDetails 
        };
    } catch (error) {
        console.error("fetchOrderDetails Error:", error);
        // Return basic data so the frontend doesn't show "No orders found"
        return order.get({ plain: true });
    }
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
// export const updateStatus = async (req, res) => {
//     try {
//         const { orderId, status } = req.body;

//         // 1. Find the specific order first
//         const order = await Order.findByPk(orderId);

//         if (!order) {
//             return res.json({ success: false, message: "Order not found" });
//         }

//         // 2. Update the status field
//         order.status = status;

//         // 3. Save it (this triggers hooks correctly and updates updatedAt)
//         await order.save();

//         res.json({ success: true, message: "Status updated successfully" });
//     } catch (error) {
//         console.error("Backend Error:", error);
//         res.json({ success: false, message: error.message });
//     }
// };

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        order.status = status;
        
        // This line is critical: it updates the database AND the updatedAt timestamp
        await order.save(); 

        res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
    console.log("🔥 Webhook received:", event.type);
};


// npm install -g stripe
// stripe login
// stripe listen --forward-to localhost:4000/webhook/stripe
// It will give you a webhook secret like:
// Replace in .env:
// STRIPE_WEBHOOK_SECRET=whsec_xxxxx




// PRODUCTION
// Set webhook in Stripe Dashboard: => https://yourdomain.com/webhook/stripe