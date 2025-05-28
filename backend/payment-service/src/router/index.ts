import { Router } from "express";
import { createIntent, depositeRecord } from "../controller/payment";
const router = Router();

router.post("/create-intent", createIntent);
router.post("/record", depositeRecord);
export default router;
