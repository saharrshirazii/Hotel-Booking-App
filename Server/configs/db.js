import mongoose from "mongoose";

const connectDB = async () => { //An asynchronous function because connecting to a database takes time.
    try {
        mongoose.connection.on('connected' , ()=> console.log("Database Connected")); //An event listener. It prints "Database Connected" to your console only once the connection is successful.
        await mongoose.connect(`${process.env.MONGODB_URL}/hotel-booking`) //This is the actual connection command. It uses the MONGODB_URL from my .env file.
    }catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB;