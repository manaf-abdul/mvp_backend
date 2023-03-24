import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userModel = new mongoose.Schema(
    {
        username: {
            type: String,
            default:null
        },
        email: {
            type: String,
            default: null,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
            trim: true, 
            lowercase: true
        },
        phone: {
            type: String,
            default:null
        },
        password: {
            type: String,
            default:null
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
        gender: {
            type: String,
            enum: ["male", "female"],
            lowercase: true,
        },
        emailOtp:{
            type: String,
            default: null
        },
        location:{
            type: String,
            default: null
        },
        dateOfBirth:{
            type: String,
            default: null
        },
        profilePic:{}
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
export default User