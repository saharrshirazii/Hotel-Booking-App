import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, ref: "User", required: true },
    room: { type: String, ref: "Room", required: true },
    hotel: { type: String, ref: "Hotel", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, r: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "confirmed", "canceled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        default: "Pay At Hotel",
        required: true
    },
    isPaid: {type: Boolean, default: false}

}, { timestamps: true });

//creating model using the above schema
const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;