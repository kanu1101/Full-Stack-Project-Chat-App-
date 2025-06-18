// Load environment and dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
// ✅ Set up middleware first!
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());         // Needed for req.body
app.use(cookieParser());         // Needed for req.cookies

// ✅ Then register routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  })
}
// ✅ Start server
server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  connectDB();
});
