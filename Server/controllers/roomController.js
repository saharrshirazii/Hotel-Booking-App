import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";
import { v2 as cloudinary } from "cloudinary";



//API to create a new room for hotel
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, aminiteis } = req.body; //extract data from request body
        const hotel = await Hotel.findOne({ owner: req.auth.userId }) //find a hotel useing this owner property

        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found." })
        }

        //upload images to cludinary
        const uploadImages = req.file.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        //wait for all uploads to complete
        const images = await Promise.all(uploadImages);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight, //we will get price in string and + will convert it in the number.
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({ success: true, message: "Room created successfully" });

    }
    catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//API to get all rooms
export const getRooms = async (req, res) => {
    try {
        //it finds available properties and in that room it will add the hotel (entire hotel data insted of hotel id) also
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });
        res.json({ success: true, rooms });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//API to get all rooms for a specific hotel
export const getOwnerRoooms = async (req, res) => {
    try {
        const hotelData = await Hotel({ owner: req.auth.userId })
        const rooms = await Room
            .find({ hotel: hotelData._id.toString() })
            .populate("hotel");

        res.json({ success: true, rooms });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//API to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room Availability Updated." });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}