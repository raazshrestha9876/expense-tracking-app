import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import {
  setAuthCookie,
  setPasswordResetCookie,
} from "../utils/cookieHelper.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return next(errorHandler(400, "Email already exists"));
    }
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return next(errorHandler(401, "Invalid credentials"));
    }
    const token = generateToken(user._id);
    setAuthCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found"));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 2 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    const subject = "Your OTP for Password Reset in Expenso";
    const message = `<p style={{fontSize: "20px" }}>Your OTP is <strong>${otp}</strong>. It will expire in 1 minutes.</p>`;
    await sendEmail(user.email, subject, message);

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findOne({ otp: otp });
    if (!user) {
      return next(errorHandler(404, "Invalid OTP"));
    }
    const currentTime = new Date();
    if (user.otpExpiry < currentTime) {
      return next(errorHandler(404, "OTP has expired"));
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = generateToken(user._id);
    setPasswordResetCookie(res, token);

    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updatedUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      address,
      gender,
      dob,
      occupation,
      image,
    } = req.body;

    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    let hashedPassword;
    if (password) {
      const genSalt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, genSalt);
    }
    const updatedUserData = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      gender,
      dob,
      occupation,
      image,
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: updatedUserData,
      },
      {
        new: true,
      }
    );
    const { password: psw, ...rest } = updatedUser._doc;

    const token = generateToken(updatedUser._id);
    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserPassword = async (req, res, next) => {
  try {
    const password = req.body.password;
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $set: {
        password: hashedPassword,
      },
    });
    const token = generateToken(updatedUser._id);
    setAuthCookie(res, token);
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return next(errorHandler(404, "User not found"));
    await User.findByIdAndDelete(userId);
    res.clearCookie("access_token");
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
