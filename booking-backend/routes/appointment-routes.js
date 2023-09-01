import express from "express"
import {
    createAppointment,
} from "../controllers/appointment-controller.js"

const appointmentRouter = express.Router()

appointmentRouter.post("/createAppointment", createAppointment)

export default appointmentRouter
