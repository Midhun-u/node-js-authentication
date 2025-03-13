import {Schema , model} from 'mongoose'
import {hash , genSalt, compare} from 'bcryptjs'

const userSchema = new Schema({

    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    isVeryfied : {
        type : Boolean,
        default : false,
    },
    verifyOtp : {
        type : String,
        default : null
    },
    verifyOtpExpiredAt : {
        type : Number,
        default : null
    },
    


} , {timestamps : true})

//middleware for hashing password
userSchema.pre("save" , async function(next){

    //bcrypt method used for hashing password
    const salt = await genSalt(10)
    const hashPassword = await hash(this.password , salt)

    this.password = hashPassword
    next()

})

//function for comparing password
userSchema.methods.comparePassword = async function(userPassword){

    //brypt method for comparing password
    const isPasswordCorrect = await compare(userPassword , this.password)
    return isPasswordCorrect

}

const User = model("User" , userSchema)

export default User