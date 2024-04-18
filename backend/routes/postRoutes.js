import express from "express";
import protectRoute from "../middleWares/protectRoute.js";
import { createPost ,getPost, deletePost,likeUnlikePost,replyToPost,getFeedPosts,getUserPosts} from "../controlllers/postController.js";

const router = express.Router();

router.get("/feed",protectRoute,getFeedPosts)
router.get("/:id",getPost)
router.get("/user/:username",getUserPosts)
router.post("/create",protectRoute,createPost)
router.delete("/:id",protectRoute,deletePost)
router.put("/like/:id",protectRoute,likeUnlikePost)
router.put("/reply/:id",protectRoute,replyToPost)

export default router