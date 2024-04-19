import path from "path";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import express from "express";
import { app, server } from "./socket/socket.js";


import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"

import { v2 as cloudinary } from "cloudinary"
import job from "./cron/cron.js";


dotenv.config()

connectDB()
job.start()


const PORT = process.env.PORT || 5000
const __dirname = path.resolve(); //build NODE_modules

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(express.json({ limit: "10mb" })) // parse JSON data in req.body
app.use(express.urlencoded({ limit: "10mb", extended: true })) // part a nested data in req.body
app.use(cookieParser()) //get cookie from req end set cookie inside res

app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/messages", messageRoutes)



if (process.env.NODE_ENV === "production") {
	console.log(process.env.NODE_ENV)
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// react app
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

server.listen(PORT, () => { console.log(`Server started at http://localhost:${PORT}`); })