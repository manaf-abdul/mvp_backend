import User from "../models/user.model.js";
import { validationResult } from "express-validator";

export const updateProfile = async (req, res) => {
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
    const {
      firstName,
      lastName,
      contactNumber,
      dob,
      linkedInProfile,
      city,
      about,
      organization,
      department,
      skills,
      abilities,
      seeking,
      profilePic,
      userId,
    } = req.body;
    let userName = null
    const existingUserName = await User.find({ firstName: firstName.toLowerCase() })
    if(existingUserName.length) userName = "firstName" + (existingUserName.length + 1)
    else userName = userName
    const user = await User.findById(userId);
    user.firstName = firstName;
    user.lastName = lastName;
    user.userName = userName;
    user.contactNumber = contactNumber;
    user.dob = dob;
    user.linkedInProfile = linkedInProfile;
    user.city = city;
    user.about = about;
    user.organization = organization;
    user.department = department;
    user.abilities = abilities;
    user.seeking = seeking;
    user.skills = skills;
    user.profilePic = profilePic
    await user.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (e) {
    return res
      .status(500)
      .json({ message: e.message, data: null });
  }
};

export const usernameChecker = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName });
    const isExisting = Boolean(user);
    if(isExisting) res.status(409).json({ isExisting: isExisting });
    else res.status(200).json({ isExisting: isExisting });
  } catch (error) {
     res.status(500).json({ error: 'Internal server error' });
  }
}
