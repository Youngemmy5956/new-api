import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let transporter = nodemailer.createTransport({
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

export const sendMail = async (params) => {
  let mailOptions = {
    from: "Booking App",
    to: params.to,
    subject: "Email Confirmation",
    html: `<div>
        <h1>Booking App</h1> <br /> <br />
        <h2>Verify Email</h2> <br /> <br />
        <p>Booking App received a request to create an account for you. Before we proceed, we need to verify the email address verification code: ${params.OTP} <br />
        If you did not register with booking app, please ignore this message as it's possible that someone else might have registered on your behalf.... <br />
        Kind Regards, <br />
        The Booking App Team
        </p>
        </div>`,
  };
  try {
    let info = await transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });
    return info;
  } catch (error) {
    console.log("error", error);
    return false;
  }
};
