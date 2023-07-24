import express from "express";
import User_model from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import auth from "../middleware/auth.js";

const router = express.Router();


// register api
router.post("/auth/register", async (req, res) => {
const { firstName, lastName, email, password } = req.body;
if (!firstName || !lastName || !email || !password) {
return res.status(400).json({ message: "Please fill all fields" });
}
const oldUser = await User_model.findOne({ email });
if (oldUser) {
return res.status(409).json({ message: "User already exists" });
}
const hashedPassword = await bcrypt.hash(password, 12);
const token = jwt.sign(
{ email, password, firstName, lastName },
process.env.JWT_SECRECT_KEY,
{
expiresIn: "1h",
}
);
const user = await User_model.create({
firstName,
lastName,
email: email.toLowerCase(),
password: hashedPassword,
token,
});

res.status(201).json({ user });
});












export default router;