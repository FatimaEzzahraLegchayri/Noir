import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' })
import cors from "cors";
import cookieParser from "cookie-parser";
// import path from "path";

import { connectDb } from "./Config/Connect.Db.js";
import authRoutes from "./Routes/Auth.route.js";
import cartRoutes from './Routes/Cart.route.js'
import paymentRoutes from './Routes/Cart.route.js'

console.log(process.env.JWT_SECRET); 
const app = express();
const PORT = process.env.PORT;
// const __dirname = path.resolve();
dotenv.config();



app.use(cookieParser()); // allows us to parse incoming cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // allows us to parse incoming requests:req.body

app.use("/auth", authRoutes);
app.use("/cart", cartRoutes);
app.use("/payments", paymentRoutes);
app.use("/analytics", analyticsRoutes);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

app.listen(PORT, () => {
	connectDb();
	console.log("Server is running on port: ", PORT);
});