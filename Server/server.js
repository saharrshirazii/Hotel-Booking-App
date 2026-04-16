import express from "express"
import "dotenv/config"
import cors from "cors" 
import connectDB from "./configs/db.js"
import { clerkMiddleware } from "@clerk/express"
import ClerkWebhooks from "./controllers/clerkWebhooks.js"


connectDB();

const app = express(); //initialize my app.
app.use(cors()) //Security middleware. It prevents browsers from blocking requests coming from your frontend's URL.

//API to listen to webhook
app.use("/api/clerk", express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}), ClerkWebhooks);

//Middleware
app.use(express.json()) //It allows my server to read JSON data sent in the body of a request.
app.use(clerkMiddleware()) //Integrates Clerk authentication. This checks if a user is logged in for every request.




app.get ('/' , (req , res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => console.log(`Server running on port ${PORT}`));
