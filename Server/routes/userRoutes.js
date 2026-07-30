import express from 'express'; //using this we will create a router
import { protect } from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSearchedCities } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/' , protect, getUserData);
userRouter.post('/store-recent-search' , protect, storeRecentSearchedCities);


export default userRouter;