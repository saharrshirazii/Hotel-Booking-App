import User from "../models/User.js";
import { Webhook } from "svix"; //get user data


const clerkWebhooks = async (req, res) => {
        console.log("🔥 WEBHOOK HIT");

    res.set("Cache-Control", "no-store");
    try {
        //Create a Svix instance with clrek webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Getting Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        console.log("Headers:", headers);

        //Verifing Headers
        // await whook.verify(req.rawBody, headers);
await whook.verify(req.rawBody, headers);

        //Getting Data from request body
        const { data, type } = req.body;
        console.log("TYPE:", type);


        const primaryEmail = data.email_addresses?.find(
  (e) => e.id === data.primary_email_address_id
);

const userData = {
  _id: data.id,
  email:
    data.email_addresses?.[0]?.email_address ||
    data.primary_email_address?.email_address ||
    "no-email",
  username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
  image: data.image_url,
};
        console.log("USER DATA:", userData);
        console.log("FULL DATA:", JSON.stringify(data, null, 2));

        //Switch Case for diffrent events
        switch (type) {
           case "user.created": {
    await User.findByIdAndUpdate(
        data.id,
        userData,
        { upsert: true, new: true }
    );
    console.log("User upserted");
    break;
}

            case "user.updated": {
                await User.findByIdAndUpdate(data.id, userData); //Updates the existing user
                break;
            }

            case "user.deleted": {
                await User.findByIdAndDelete(data.id); //Removes them from my DB if they delete their account.
                break;
            }
            default:
                break;
        }

        res.json({ success: true, message: "Webhook Recived" });




    } catch (error) {
        console.log("Error in Webhook:", error.message);
        res.json({ success: false, message: error.message });
    }
}

export default clerkWebhooks;


