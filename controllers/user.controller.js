import User from "../models/user.model.js";
import errorHandler from "../utils/errorHandler";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import setAuthCookie from "../utils/cookieHelper.js";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = User.findOne({ email });
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
    setAuthCookie(token);
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
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
    } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const userId = req.userId;

    const user = await User.find({ _id: userId });
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

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
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    const { password: psw, ...rest } = updatedUser._doc;

    const token = generateToken(user._id);
    setAuthCookie(token);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: rest,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.find({ _id: userId });
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
