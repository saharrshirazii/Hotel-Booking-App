//This defines what a "User" looks like in my database.
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    _id: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String , required: true},
    image: {type: String , required: true},
    role: {type: String, enum: ["user" , "hotelOwner"], default: "user"},
    recentSearchedCities: [{type: String, required: true}], //An array of strings to track user history.
} , {timestamps: true} //This automatically adds createdAt and updatedAt fields to every user.
);

const User = mongoose.model("user" , userSchema);

export default User;