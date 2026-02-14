import express from "express";
import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
// import userRouter from "./routes/userRoutes.js";
// import ollamaResponse from "./ollama.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://virtual-assistant-aohk.onrender.com"],
    credentials: true,
  }),
);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


// app.get("/", async (req, res) => {
//   const prompt = req.query.prompt;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required" });
//   }

//   const data = await ollamaResponse(prompt);
//   res.json({ response: data });
// });

app.listen(port, () => {
  connectDb();
  console.log("server started");
});
