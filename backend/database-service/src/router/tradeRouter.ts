import { Router } from "express";
import { login, register } from "../controller/auth";
import {
  closeOrder,
  fetchClosedOrders,
  fetchOpenOrders,
} from "../controller/order";
const router = Router();

router.get(`/`, fetchOpenOrders);
router.get(`/closed`, fetchClosedOrders);
router.post(`/close/:orderId`, closeOrder);
export default router;
