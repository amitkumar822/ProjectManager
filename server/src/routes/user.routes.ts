import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/authUser";

const router = Router();

// auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);

router.get("/get-all-users", isAuthenticated, getAllUsers);
router.get("/get-user", isAuthenticated, getUserById);
router.put("/update-user", isAuthenticated, updateUser);
router.delete("/delete-user/:userId", isAuthenticated, deleteUser);

export default router;
