import moongose from "mongoose";

const roomSchema = new moongose.Schema({
    hotel: { type: String, required: true, ref: "Hotel"},
    roomType: { type: String, required: true},
    pricePerNight: { type: Number, required: true},
    amenities: { type: Array, required: true},
    images: [{ type: string}],
    isAvailable: { type: Boolean, required: true},
}, { timestamps: true });

//creating model using the above schema
const Room = mongoose.model("Room", roomSchema);

export default Room;