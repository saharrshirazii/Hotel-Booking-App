import User from "../models/User.js";

import { Webhook } from "svix"; //get user data

const ClerkWebhooks = async (req, res) => {
    try {
        //Create a Svix instance with clrek webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Getting Headers
        const headers = {
    "svix-id": req.headers["svix-id"],
    "svix-timestamp": req.headers["svix-timestamp"],
    "svix-signature": req.headers["svix-signature"] 
};

        //Verifing Headers
        await whook.verify(JSON.stringify(req.body), headers)

        //Getting Data from request body
        const { data, type } = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };

        //Switch Case for diffrent events
        switch(type){
            case "user.created":{
                await User.create(userData); //save a new user to MongoDB
                break;
            }

             case "user.updated":{
                await User.findByIdAndUpdate(data.id , userData); //Updates the existing user
                break;
            }

             case "user.deleted":{
                await User.findByIdAndDelete(data.id); //Removes them from my DB if they delete their account.
                break;
            }
            default:
            break;
        }

        res.json({success: true , message: "Webhook Recived"});




    } catch (error) {
        console.log(error.message);
        res.json({success: false , message: error.message});
    }
}

export default ClerkWebhooks;


