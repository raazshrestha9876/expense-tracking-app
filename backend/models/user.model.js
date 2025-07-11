import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  dob: {
    type: Date,
  },
  occupation: {
    type: String,
  },
  otp: {
    type: Number,
  },
  otpExpiry: {
    type: Date,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
