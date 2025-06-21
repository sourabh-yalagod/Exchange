import { Router } from "express";
import { getOrderBook } from "../controller/orderBook";
const router = Router();

// router.post(`/`);
router.get(`/:asset`,getOrderBook);
export default router;
