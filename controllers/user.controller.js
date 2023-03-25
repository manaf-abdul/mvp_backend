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
      name,
      contactNumber,
      dob,
      linkedInProfile,
      currentCity,
      about,
      currentOrganization,
      department,
      skills,
      keywords,
      userEmail,
    } = req.body;
    const user = await User.findOne({ userEmail });
    user.name = name;
    user.contactNumber = contactNumber;
    user.dob = dob;
    user.linkedInProfile = linkedInProfile;
    user.currentCity = currentCity;
    user.about = about;
    user.currentOrganization = currentOrganization;
    user.department = department;
    user.skills = skills;
    user.keywords = keywords;
    await user.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (e) {
    return res
      .status(200)
      .json({ errorcode: 5, status: false, msg: e.message, data: null });
  }
};
