import { Router } from "express";
import { login, register } from "../controller/auth";
import { closeOrder, fetchOrders } from "../controller/order";
const router = Router();

router.get(`/`, fetchOrders);
router.patch(`/:orderId`, closeOrder);
export default router;
