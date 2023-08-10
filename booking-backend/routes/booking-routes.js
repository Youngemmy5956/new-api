import express from "express";
import {
  deleteBooking,
  getBookingById,
  newBooking,
  getAllBookings
} from "../controllers/booking-controller.js";

const bookingsRouter = express.Router();

bookingsRouter.get("/:id", getBookingById);
bookingsRouter.post("/", newBooking);
bookingsRouter.delete("/:id", deleteBooking);
bookingsRouter.get("/getAllBooking", getAllBookings);
export default bookingsRouter;