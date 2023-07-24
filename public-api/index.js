import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./src/config/mongo.js";
import router from "./src/routes/routes.js";
import bodyParser from "body-parser";



dotenv.config();

const app = express();
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", router);

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

