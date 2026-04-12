import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: string , required: true},
    image: {type: string , required: true},
    role: {type: string, enum: ["user" , "hotelOwner"], default: "user"},
    recentSearchedCities: [{type: string, required: true}],
} , {timestamps: true}
);

const User = mongoose.model("user" , userSchema);

export default User;sana