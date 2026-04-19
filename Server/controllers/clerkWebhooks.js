import { Webhook } from "svix";
import User from "../models/User.js";

const ClerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verification requires the RAW body string
        const payload = req.body.toString(); 
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        // 1. Verify
        const evt = whook.verify(payload, headers);
        const { data, type } = evt; // Use the verified data from Svix

        // 2. Process
        switch (type) {
            case "user.created": {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    username: (data.first_name + " " + (data.last_name || "")).trim(),
                    image: data.image_url,
                };
                await User.create(userData);
                console.log(`✅ User ${data.id} created`);
                break;
            }
            case "user.updated": {
                await User.findByIdAndUpdate(data.id, {
                    email: data.email_addresses[0].email_address,
                    username: (data.first_name + " " + (data.last_name || "")).trim(),
                    image: data.image_url,
                });
                break;
            }
            case "user.deleted": {
                await User.findByIdAndDelete(data.id);
                break;
            }
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("❌ Webhook Error:", error.message);
        return res.status(400).json({ success: false, message: error.message });
    }
}

export default ClerkWebhooks;