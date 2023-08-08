import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/mongo.js";
import cors from "cors";




dotenv.config();

const app = express();
app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

async function connect() {
  try {
    app.listen(8000, () => {
      connectDB(process.env.MONGODB_PASSWORD);
      console.log("server is running on  port 8000");
    });
  } catch (err) {
    console.log(err);
  }
}
connect();

