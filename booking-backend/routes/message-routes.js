import express  from "express";
import {
    createMessage,
} from "../controllers/message-controller.js";

const messageRouter = express.Router();

messageRouter.post("/createMessage", createMessage);

export default messageRouter;