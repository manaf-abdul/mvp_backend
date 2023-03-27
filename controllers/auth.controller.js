import { generateOTP } from "../utils/otp.util.js";
import User from "../models/user.model.js";
import { sendOtpToEmail } from "../services/email.service.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
export const verifyOtp = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errs = [];
      let err_msgs = { ...errors };
      err_msgs.errors.forEach((err) => errs.push(err.msg));
      return res
        .status(400)
        .json({ errorcode: 1, status: false, msg: errs, data: null });
    }
    const { email, otp } = req.body;
    let existingUser = await User.findOne({ email }, {password: 0});
    if (!existingUser) return res.status(404).json({ error: "User not found" });
    if (existingUser.isEmailVerified) {
      return res.status(409).json({ error: "User already exists" });
    }
    if (existingUser.otp === otp) {
      existingUser.isEmailVerified = true;
      existingUser.otp = null;
      await existingUser.save();
      const accessToken = existingUser.generateAuthToken();
      return res.status(200).json({
        message: "Account successully verified",
        user: { accessToken, ...existingUser._doc },
      });
    }
    return res.status(400).json({ message: "Incorrect OTP" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errs = [];
      let err_msgs = { ...errors };
      err_msgs.errors.forEach((err) => errs.push(err.msg));
      return res
        .status(400)
        .json({ errorcode: 1, status: false, msg: errs, data: null });
    }
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified)
      res.status(409).json({ message: "Account already exist" });
    const otp = generateOTP();
    if (existingUser) {
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.email = email;
      existingUser.password = password;
      existingUser.otp = otp;
      await existingUser.save();
    } else {
      const newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.password = password;
      newUser.otp = otp;
      await newUser.save();
    }
    const { status } = await sendOtpToEmail(email, firstName, otp);
    if (status) res.status(200).json({ message: "OTP sent successfully" });
    res.status(500).json({ message: "Internal server error" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};

export const logIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errs = [];
      let err_msgs = { ...errors };
      err_msgs.errors.forEach((err) => errs.push(err.msg));
      return res
        .status(400)
        .json({ errorcode: 1, status: false, msg: errs, data: null });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ error: "Incorrect password" });
    if (validPassword) {
      const accessToken = user.generateAuthToken();
      delete user._doc.password
      return res.status(200).send({
        message: "User authenticated successfully",
        user: { accessToken, ...user._doc},
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId, newPassword, currentPassword } = req.body;
    const user = await User.findById(userId);
    if(!user) return res.status(404).send({message: "User not found"});
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if(!validPassword) return res.status(401).send({message: "Invalid credential"});
    user.password = newPassword
    await user.save()
    return res.status(200).send({message: "Password updated successfully"});
  } catch (error) {
    return res.status(500).send({message: "Internal server error"});
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(404).send({message: "User not found"});
    if(user.otp !== otp) return res.status(401).send({message: "Invalid otp"});
    user.password = newPassword
    user.otp = null
    await user.save()
    return res.status(200).send({message: "Password updated successfully"});
  } catch (error) {
    return res.status(500).send({message: "Internal server error"});
  }
}

export const getOtp = async (req, res) => {
  try {
    const email = req.params.email
    const user = await User.findOne({ email });
    if(!user) return res.status(404).send({message: "User not found"});
    const otp = generateOTP();
    user.otp = otp
    await user.save()
    const { status } = await sendOtpToEmail(email, user.firstName, otp);
    if (status) res.status(200).json({ message: "OTP sent successfully" });
    res.status(500).json({ message: "Internal server error" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

