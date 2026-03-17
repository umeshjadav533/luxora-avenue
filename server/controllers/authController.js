import cloudinary from "../config/cloudinary.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import User from "../models/userModel.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import generateToken from "../utils/generateToken.js";
import path from "path";
import Cart from "../models/cartModel.js";
import Wishlist from "../models/wishlistModel.js";
import generateForgotPasswordEmailTemplate from "../utils/emailTemplate.js";
import sendEmail from "../services/emailService.js";
import crypto from 'crypto'

// ----------------- REGISTER USER -----------------
export const registerUser = asyncHandler(async (req, res, next) => {
  // Destructure fields
  const { first_name, last_name, email, password, phone_number } = req.body;

  //   check field is not empty or space-only
  if (
    [first_name, last_name, email, password, phone_number].some(
      (field) => !field || field.toString().trim() === "",
    )
  ) {
    return next(new ErrorHandler("Please Provide all fields", 400));
  }

  //   check User is already exist or not
  const existUser = await User.findOne({
    email: email.toLowerCase(),
    phone_number,
  });
  if (existUser) {
    return next(new ErrorHandler("User already exists", 409));
  }

  let avatarData = {
    public_id: null,
    url: null,
  };

  if (req.file) {
    // upload on local folder
    const localFilePath = path.join(
      process.cwd(),
      "/uploads/avatars",
      req.file.filename,
    );

    // Uploado cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "luxora_avatars",
    });

    // Delete local file after succesful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }

  // Create User
  const user = await User.create({
    first_name,
    last_name,
    email: email.toLowerCase(),
    password,
    phone_number,
    avatar: avatarData,
  });

  // Intialize Cart
  await Cart.create({
    user: user._id,
    items: [],
  });

  // Initlaize Wishlist
  await Wishlist.create({
    user: user._id,
    items: [],
  });

  user.password = undefined;

  // Generate token
  generateToken(user, 201, "User Registration Successfully", res);
});

// ------------------- LOGIN USER --------------------
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, phone_number, password } = req.body;

  // Check at least one (email or phone)
  if (!email && !phone_number) {
    return next(new ErrorHandler("Email or Phone number is required", 400));
  }

  // Check for password
  if (!password) {
    return next(new ErrorHandler("Password is required", 400));
  }

  const query = {
    $or: [{ email }, { phone_number }],
  };

  const user = await User.findOne(query).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not Registered", 404));
  }

  // Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  user.password = undefined;

  generateToken(user, 200, "Logged In Successfully", res);
});

// ----------------- FORGOT PASSWORD -----------------
export const forgotPassword = asyncHandler(async (req, res, next) => {
  // Destructure field
  const { email, phone_number } = req.body;

  // Check field is not empty
  if (!email && !phone_number) {
    return next(new ErrorHandler("Email or Phone number is required", 400));
  }

  // find user
  const query = {
    $or: [{ email }, { phone_number }],
  };
  const user = await User.findOne(query);

  // Check user is registred or not
  if (!user) {
    return next(new ErrorHandler("User not Registered", 404));
  }

  // Generate token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validationBeforeSave: false });

  // Reset password url
  const resetPasswordUrl = `${process.env.FRONTEND_URL}api/auth/password/reset-password/${resetToken}`;

  // Generate Email
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    // Send Email
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      message,
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validationBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

// ----------------- RESET PASSWORD -----------------
export const resetPassword = asyncHandler(async (req, res, next) => {
  // Destructure fields
  const { password, confirmPassword } = req.body;

  // Check password and confirmPassword is not empty or space-only
  if (
    [password, confirmPassword].some((field) => !field || field?.trim() === "")
  ) {
    return next(
      new ErrorHandler("Please Provide password and ConfirmPassword", 400),
    );
  }

  // Check password and confirm Password is Matched or not
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password do not match", 400));
  }

  // Generate crypto token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find user
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  // Check token is valid or not
  if (!user) {
    return next(new ErrorHandler("Token is invalid or expired", 400));
  }

  // Change password
  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

// ----------------- GET USER -----------------
export const getUser = asyncHandler(async (req, res, next) => {
  // Get user from middleware
  if (!req.user)
    return next(new ErrorHandler("User is not authenticated", 401));

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ----------------- UPDATE USER -----------------
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  // Destructure fields
  let updatedData = { ...req.body };

  if (req.file) {
    // Upload on local folder
    const localFilePath = path.join(
      process.cwd(),
      "uploads/avatars",
      req.file.filename,
    );

    // Delete old cloudinary image
    if (user.avatar?.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    // Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "luxora_avatars",
    });

    updatedData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };

    // Delete local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "User Updated Successfully",
    user: updatedUser,
  });
});
