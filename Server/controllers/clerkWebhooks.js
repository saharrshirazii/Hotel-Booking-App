import User from "../models/User.js";

import { Webhook } from "svix"; //get user data

const ClerkWebhooks = async (req, res) => {
    try {
        //Create a Svix instance wiyh clrek webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signiture": req.headers["svix-signiture"]
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
                await User.create(userData);
                breake;
            }

             case "user.updated":{
                await User.findByIdAndUpdate(data.id , userData);
                breake;
            }

             case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                breake;
            }
            default:
            break;
        }

        res.JSON({success: true , message: "Webhook Recived"});




    } catch (error) {
        console.log(error.message);
        res.JSON({success: false , message: error.message});
    }
}

export default ClerkWebhooks;