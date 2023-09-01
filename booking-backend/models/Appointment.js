import mongoose from "mongoose";
const Schema = mongoose.Schema;
const appointmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true, 
 },
 message: {
    type: String,
    required: true,
    },

});

export default mongoose.model("Appointment", appointmentSchema);