import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Bookings from "../models/Bookings.js";
import nodemailer from "nodemailer";



let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  }
});

let mailOptions = {
  from: 'emmanuelgodwin558@gmail.com',
  to:  'emmanuelgodwin558@gmail.com',
  subject: 'Nodemailer Project',
  text: 'Hi from your nodemailer project'
};

transporter.sendMail(mailOptions, function(err, data) {
  if (err) {
    console.log("Error " + err);
  } else {
    console.log("Email sent successfully");
  }
});


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ message: "book successfully listed", users });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const singup = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "password is less than 8 characters" });
  }
  if (!name || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }
  if (email.indexOf("@") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  if (email.indexOf(".") === -1) {
    return res.status(400).json({ message: "invalid email" });
  }
  try {
    bcrypt.hash(password, 10).then(async (hash) => {
      await User.create({
        name,
        email,
        password: hash,
      }).then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, email },
          process.env.JWT_SECRECT_KEY,
          { expiresIn: maxAge }
        );
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ message: "User successfully created", user });
      });
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email } = req.body;
  if (
    !name &&
    name.trim() === "" &&
    !email &&
    email.trim() === "" &&
    !password &&
    password.trim() === ""
  ) {
    return res.status(422).json({ message: "Invalid Inputs" });
  }

  let user;
  try {
    user = await User.findByIdAndUpdate(id, {
      name,
      email,
    });
  } catch (errr) {
    return console.log(errr);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  res.status(200).json({ message: "Updated Sucessfully" });
};

export const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findByIdAndRemove(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }
  return res.status(200).json({ message: "Deleted Successfully" });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && email.trim() === "" && !password && password.trim() === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }

  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Unable to find user from this ID" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  return res
    .status(200)
    .json({ message: "Login Successfull", id: existingUser._id });
};
export const getBookingsOfUser = async (req, res, next) => {
  const id = req.params.id;
  let bookings;
  try {
    bookings = await Bookings.find({ user: id })
      .populate("movie")
      .populate("user");
  } catch (err) {
    return console.log(err);
  }
  if (!bookings) {
    return res.status(500).json({ message: "Unable to get Bookings" });
  }
  return res.status(200).json({ bookings });
};
export const getUserById = async (req, res, next) => {
  const id = req.params.id;
  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    return console.log(err);
  }
  if (!user) {
    return res.status(500).json({ message: "Unexpected Error Occured" });
  }
  return res.status(200).json({ user });
};
