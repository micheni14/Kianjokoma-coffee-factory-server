import express from "express";
import {
  getTotalQuantityPaid,
  getTotalQuantitySubmitted,
  getUserCoffeeDetails,
  uploadUserCoffee,
} from "../controllers/coffee.js";
import auth from "../middleware/auth.js";
const router = express.Router();
router.post("/upload", uploadUserCoffee);
router.get("/coffee-details", getUserCoffeeDetails);
router.get("/total-quantity-paid", auth, getTotalQuantityPaid);
router.get("/total-quantity-submitted", auth, getTotalQuantitySubmitted);

export default router;
