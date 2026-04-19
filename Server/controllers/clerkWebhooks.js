import { Webhook } from "svix";
import User from "../models/User.js";

const ClerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // We use req.body.toString() because we used express.raw in server.js
        const payload = req.body.toString();
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // 1. Verify the payload
        const evt = whook.verify(payload, headers);
        
        // 2. Get the data from the verified event
        const { data, type } = evt;

        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "no-email@provided.com",
                    username: `${data.first_name || ""} ${data.last_name || ""}`.trim() || "New User",
                    image: data.image_url,
                };
                await User.create(userData);
                console.log("✅ User saved to MongoDB");
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    username: `${data.first_name} ${data.last_name || ""}`.trim(),
                    image: data.image_url,
                });
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }
        }

        res.status(200).json({ success: true, message: "Webhook processed" });

    } catch (error) {
        console.log("❌ Webhook Error:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
}

export default ClerkWebhooks;