import Appointment from "../models/Appointment.js";
import nodemailer from "nodemailer";

// Create a Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

export const createAppointment = async (req, res) => {
  const { name, subject, location, message } = req.body; // Include 'message' here
  try {
    await Appointment.create({
      name,
      subject,
      location,
      message // Include 'message' here
    });

    const mailOptions = {
      from: "Mech_Api_Form",
      to: "emmanuelgodwin558@gmail.com", // Your email where you want to receive the message
      subject: "Contact Form Submission",
      text: `Name: ${name}\nEmail: ${location}\nSubject: ${subject}\nMessage: ${message}`, // Include 'message' here
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Appointment book successfully!" });
  } catch (error) {
    if (error.code === "EAUTH") {
      // Authentication error (invalid email/password)
      res.status(401).json({
        error: "Authentication failed. Check your email and password.",
      });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
