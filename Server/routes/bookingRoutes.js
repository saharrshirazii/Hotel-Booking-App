import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkAvailabilityAPI, createBooking, getHotelBookings, getUserBookings } from "../controllers/bookingController.js";

const BookingRouter = express.Router();

BookingRouter.post('/check-availability' , checkAvailabilityAPI);
BookingRouter.post('/book' , protect, createBooking);
BookingRouter.get('/user' , protect, getUserBookings);
BookingRouter.get('/hotel' , protect, getHotelBookings);

export default BookingRouter;



