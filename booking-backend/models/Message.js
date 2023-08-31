import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true, 
 },

});

export default mongoose.model("Message", messageSchema);