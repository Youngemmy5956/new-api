import express from "express";
import {
  deleteUser,
  getAllUsers,
  getBookingsOfUser,
  getUserById,
  login,
  singup,
  updateUser,
  verifyEmail,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter.get("/getAllUsers", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", singup);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
userRouter.post("verifyEmail", verifyEmail);
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;
