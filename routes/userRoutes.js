import express from "express";
import {
  register,
  getAllUsers,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", register);
router.put("/:id", updateUser);

export default router;
