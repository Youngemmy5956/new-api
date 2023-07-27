import express from "express";
import Model from "../model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const router = express.Router();
// const auth = verifyToken;

// register api
router.post("/register", async (req, res) => {
  const { first_Name, last_Name, email, password } = req.body;
  if (!first_Name || !last_Name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const oldUser = await Model.findOne({ email });
  if (oldUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await Model.create({
    first_Name,
    last_Name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });
  const token = jwt.sign(process.env.JWT_SECRECT_KEY, {
    expiresIn: "1h",
  });
  user.token = token;
  //   await user.save();
  res.status(201).json(user);
});



// login api

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  try {
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
        // password,
        // firstName: user.firstName,
        // lastName: user.lastName,
      },    
      process.env.JWT_SECRECT_KEY,
      {
        expiresIn: "1h",
      }
    );
    user.token = token;
    // await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//homep page api 

router.post("/home", auth, async (req, res) => {
    res.status(200).json({ message: "Welcome to home page" });
    });

export default router;
