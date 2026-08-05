import { clerkClient } from '@clerk/express';
import User from '../models/User.js';

//middleware to check if user is authenticated
export const protect = async(req , res, next) => {
    const {userId} = req.auth() ?? {};
    if(!userId){
        return res.status(401).json({
            success: false,
            message: "not authenticated."
        });
    } else {
        let user = await User.findById(userId);
        if(!user){
            //user exists in Clerk but hasn't been synced to MongoDB yet
            const clerkUser = await clerkClient.users.getUser(userId);
            user = await User.create({
                _id: clerkUser.id,
                email: clerkUser.emailAddresses[0].emailAddress,
                username: `${clerkUser.firstName} ${clerkUser.lastName}`,
                image: clerkUser.imageUrl,
            });
        }
        req.user = user;
        next();
    }
}