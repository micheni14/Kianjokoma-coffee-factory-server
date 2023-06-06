import express from "express";
import {
  register,
  login,
  getUserProfile,
  uploadFarmerCoffee,
  getAllFarmers,
  specificFarmer,
  getAllStaff,
  forgotPassword,
  deleteUser,
  userUpdate,
  searchUser,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router.get("/staff", getAllStaff);

router.post("/farmer-upload/:farmerId", uploadFarmerCoffee);
router.get("/farmerId/:id", auth, specificFarmer);
router.get("/farmers", getAllFarmers);

router.get("/profile", auth, getUserProfile);

router.delete("/delete-user/:user_id", deleteUser);

router.put("/update/:user_id", userUpdate);

router.get("/search/:searchText", auth, searchUser);

export default router;
