import express from "express";
import auth from "../middleware/auth.js";
import {
  createAccount,
  deposit,
  getAccDetails,
} from "../controllers/account.js";
const router = express.Router();
router.get("/create-acc", createAccount);
router.post("/deposit", auth, deposit);
router.get("/details", getAccDetails);

export default router;
