// import express from "express";
// import {
//   getResult,
//   getTimeout,
//   getToken,
//   MakePayment,
// } from "../controllers/payment.js";
// const router = express.Router();
// router.get("/access-token", getToken);
// router.get("/pay", getToken, MakePayment);

// router.post("/result", getResult);
// router.post("/timeout", getTimeout);

// export default router;

import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";
import {
  approveMultiplePayment,
  approvePayment,
  getAllTrasanctions,
  getPayableFarmers,
  getRequests,
  getSingleTransaction,
  makeSinglePayment,
  notifyManager,
  notifySinglePayment,
  payAll,
  payAllMng,
  rejectedRequest,
  rejectMultiplePayments,
  rejectSinglePayment,
  resetPayment,
  withdrawal,
} from "../controllers/payment.js";
router.get("/payable-farmers", getPayableFarmers);
router.get("/pay/:farmer_id", makeSinglePayment);
router.get("/transactions", getAllTrasanctions);
router.get("/farmer-transaction/:farmerId", getSingleTransaction);
router.post("/withdraw/:farmerId", withdrawal);
router.get("/pay-all-mng", auth, payAllMng);
router.get("/pay-all", auth, payAll);
router.get("/notify-manager", notifyManager);
router.get("/notify-single-payment/:farmerId", auth, notifySinglePayment);
router.get("/approve-multiple-payments", approveMultiplePayment);
router.get("/approve-payment/:requestId", approvePayment);
router.get("/reject-single-payment/:requestId", rejectSinglePayment);
router.get("/reject-multiple-payment", auth, rejectMultiplePayments);

router.get("/requests", auth, getRequests);
router.get("/rejected-requests", auth, rejectedRequest);

router.get("/reset", resetPayment);

export default router;
