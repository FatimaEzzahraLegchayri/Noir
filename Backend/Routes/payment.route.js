import express from "express";
import { verifyToken } from "../Middelware/verifyToken.js";
import { checkoutSuccess, createCheckoutSession } from "../Controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;