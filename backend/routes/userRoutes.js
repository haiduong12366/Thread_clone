import express from "express";
import { signupUser,loginUser,logoutUser,followUnfollowUser,updateUser,getUserProfile,getSuggestedUsers,freezeAccount } from "../controlllers/userController.js";
import protectRoute from "../middleWares/protectRoute.js";


const router = express.Router();

router.get("/profile/:query",getUserProfile)
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/signup",signupUser)
router.post("/login",loginUser)
router.post("/logout",protectRoute,logoutUser)
router.post("/follow/:id",protectRoute,followUnfollowUser)
router.put("/update/:id",protectRoute,updateUser)
router.put("/freeze",protectRoute,freezeAccount)


export default router