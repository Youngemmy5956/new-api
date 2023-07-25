import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    first_Name: { type: String, required: true },
    last_Name: { type: String, required: true },
    email: { type: String, required: true },
    token:{type: String},
    password:{ type: String, minLength: 8, required: true },
});

const users = mongoose.model("Users", userSchema);


export default users;