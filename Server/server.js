import express from "express"
import "dotenv/config"
import cors from "cors" 
import connectDB from "./configs/db.js"
import { clerkMiddleware } from "@clerk/express"
import clerkWebhooks from "./controllers/clerkWebhooks.js"
import userRouter from "./routes/userRoutes.js"
import hotelRouter from "./routes/hotelRoutes.js"
import connectCloudinary from "./configs/cloudinary.js"
import roomRouter from "./routes/roomRoutes.js"
import BookingRouter from "./routes/bookingRoutes.js"


connectDB();
connectCloudinary();

const app = express(); //initialize my app.
app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
})); // Security middleware. Allows cross-origin requests with Authorization headers.


app.post(
  "/api/clerk/",
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
  clerkWebhooks
);

//Middleware
app.use(express.json()); //It allows my server to read JSON data sent in the body of a request.
app.use(clerkMiddleware()); //Integrates Clerk authentication. This checks if a user is logged in for every request.


// API to listen to webhook
app.use("/api/clerk", clerkWebhooks);

app.get ('/' , (req , res) => res.send("API is working"));
app.use('/api/user' , userRouter);
app.use('/api/hotels' , hotelRouter);
app.use('/api/rooms' , roomRouter);
app.use('/api/bookings' , BookingRouter);


const PORT = process.env.PORT || 3000;

app.listen(PORT , () => console.log(`Server running on port ${PORT}`));
