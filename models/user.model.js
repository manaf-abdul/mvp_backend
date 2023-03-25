import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const userModel = new mongoose.Schema(
    {
        name: { type: String, required: false },
        contactNumber: { type: String },
        email: {
            type: String,
            default: null,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            trim: true, 
            lowercase: true,
            unique: true
        },
        otp: { type: Number, default: true},
        isEmailVerified: { type: Boolean, default: false },
        dob: { type: Date, required: false },
        gender: {
            type: String,
            enum: ["male", "female", "trans"],
            lowercase: true,
        },
        occupation: {
            type: String,
            default:null
        },
        googleId: {
            type: String,
            required: false,
            default:null
        },
        linkedInProfile: { type: String },
        currentCity: { type: String, required: false },
        about: { type: String },
        currentOrganization: { type: String },
        department: { type: String },
        meetingLink: { type: String },
        skills: [{ type: String }],
        keywords: [{ type: String }],
        password: { type: String, required: false },
        dateOfBirth:{
            type: String,
            default: null
        },
        profilePic: { type: String, required: false }
    }
)

userModel.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})
const User=mongoose.model("User",userModel)

User.prototype.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, email: this.email}, process.env.JWT_PRIVATE_KEY, {
        expiresIn: '7d'
    });
    return token;
}
export default User