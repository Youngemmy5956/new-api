import Message from "../models/Message.js";
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

export const createMessage = async (req, res) => {
  const { name, email, subject, message } = req.body; // Include 'message' here

  // Check if email is not defined or empty
  if (!email || email.trim() === "") {
    return res.status(400).json({ error: "Email address is required." });
  }
  try {
    await Message.create({
      name,
      email,
      subject,
      message, // Include 'message' here
    });

    const mailOptions = {
      from: "Mech_Api_Form",
      to: "emmanuelgodwin558@gmail.com", // Your email where you want to receive the message
      subject: "Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`, // Include 'message' here
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
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
