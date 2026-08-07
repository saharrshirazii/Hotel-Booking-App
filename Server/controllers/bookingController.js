import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js"

//Function to check Availability of Room
const checkAvailability = async ({ checkInDate, checkOutOut, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkInDate },
        });

        const isAvailable = bookings.length === 0;
        return isAvailable;

    } catch (error) {
        console.error(error.message);
    }
}

//API to check avialability of room
//POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkIn, checkOut } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });

    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}

//API to create a new booking
//POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room, guests } = req.body;
        const user = req.user._id;

        //Before booking check availability
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room });

        if (!isAvailable) {
            return resjson({ success: false, message: "Room is not available." });
        }

        //Get total price from room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //calculate totalPrice based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDifference = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDifference / (1000 * 3600 * 24));
        totalPrice *= nights;

        const booking = await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests, //convert string to number
            checkInDate,
            checkOutDate,
            totalPrice
        })

        res.json({ succes: true, message: "Booking created successfully." })

    } catch (error) {
        console.log(error);
        res.json({ succes: false, message: error.message })
    }
};

//API to get all bookings for users
//GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate("room hotel").sort({ createdAt: -1 });

        res.json({ succes: true, bookings });


    } catch (error) {
        res.json({ succes: false, message: "Failed to fetch bookings." });
    }
}

export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.user._id });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found." });
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });

        //Total Bookings 
        const totalBookings = bookings.length;
        //Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

        res.json({ success: true, dashboardData: { totalBookings, totalRevenue, bookings } })

    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings." })
    }
}

