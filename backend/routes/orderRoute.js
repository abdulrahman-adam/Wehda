import express from "express";
import authUser from "../middleware/authUser.js"
import authSeller from "../middleware/authSeller.js"
import { deleteOrder, getSellerOrders, getUserOrders, placeOrderCOD, placeOrderStripe, updateStatus } from "../controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
// MUST be first, raw body, no auth
// orderRouter.post("/webhook/stripe", express.raw({ type: 'application/json' }), stripeWebhooks);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getSellerOrders);
orderRouter.delete("/delete/:id", authSeller, deleteOrder);

orderRouter.post('/status',authSeller, updateStatus);

export default orderRouter;