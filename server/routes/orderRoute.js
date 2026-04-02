import express from 'express'
import isAuthenticated from '../middlewares/authMiddleware.js';
import { cancelOrder, createOrder, getOrders, getOrderById } from '../controllers/orderController.js';

const orderRouter = express.Router();

orderRouter.post("/", isAuthenticated, createOrder);
orderRouter.get("/", isAuthenticated, getOrders);
orderRouter.get("/:id", isAuthenticated, getOrderById);
orderRouter.put("/cancel/:id", isAuthenticated, cancelOrder);

export default orderRouter;