import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
dotenv.config();

const app = express();
const PORT = process.env.PORT;
import  authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes)
app.use(express.json());
app.use(cookieParser())
app.listen(5001, () => {
    console.log("server is running on port : ", PORT)
    connectDB();
})