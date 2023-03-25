import { generateOTP } from '../utils/otp.util.js'
import User from '../models/user.model.js'
import { sendOtpToEmail } from '../services/email.service.js'
import { validationResult } from "express-validator"
export const verifyOtp = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = {...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(400).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const {email,otp} = req.body
        let existingUser = await User.findOne({ email });
        if(!existingUser) return res.status(404).json({ error: 'User not found' });
        if (existingUser.isEmailVerified) {
            return res.status(409).json({ error: 'User already exists' });
        }
        if(existingUser.otp === otp) {
            existingUser.isEmailVerified = true
            await existingUser.save()
            const accessToken = existingUser.generateAuthToken();
            return res.status(200).json({ message: 'Account successully verified', accessToken });
        }
        return res.status(400).json({message: 'Incorrect OTP'})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: error.message })
    }
}

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = {...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(400).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({email})
        if(existingUser && existingUser.isEmailVerified) res.status(409).json({message: 'Account already exist'});
        const otp = generateOTP()
        if(existingUser) {
            existingUser.name = name
            existingUser.email = email
            existingUser.password = password
            existingUser.otp = otp
            await existingUser.save();
        } else {
            const newUser = new User()
            newUser.name = name
            newUser.email = email
            newUser.password = password
            newUser.otp = otp
            await newUser.save();
        }
        const {status} = await sendOtpToEmail(email, name, otp)
        console.log(status)
        if(status) res.status(201).json({ message: 'OTP sent successfully' })
    } catch (e) {
        return res.status(200).json({ errorcode: 5, status: false, msg: e.message, data: null });
    }
}

export const logIn = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let errs = [];
            let err_msgs = {...errors };
            err_msgs.errors.forEach(err => errs.push(err.msg));
            return res.status(400).json({ errorcode: 1, status: false, msg: errs, data: null });
        }
        const { email, password } = req.body
        const userRepo = new User()
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Incorrect password' });
        if (validPassword) {
            const accessToken = userRepo.generateAuthToken();
            return res
              .status(200)
              .send({ message: 'User authenticated successfully', accessToken });
          }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}