import generateToken from '../config/generateToken.js'
import transpoter from '../config/nodemailer.js'
import User from '../models/user.model.js'
import bcrypt, { hash } from 'bcryptjs'

//controller for sign
export const signController = async (request , response) => {

    try{
        const {fullName , email , password} = request.body

        if(fullName && email && password){

            //check email already exist
            const checkEmail = await User.exists({email : email})

            if(checkEmail){

                response.status(400).json({message : "Email is already exist"})

            }else{ 

                if(password.length >= 6){

                    const newUser = await User.create({
                        name : fullName,
                        email : email,
                        password : password
                    })

                    if(newUser){

                        generateToken(newUser._id , newUser.name , newUser.email , response) //generate token
                        response.status(201).json({message : "Account created" , success : true})

                        //mail option for sending mail
                        const mailOption = {
                            from : process.env.SMTP_EMAIL,
                            to : email,
                            subject : "Welcome to MERN AUTH",
                            text : `Welcome to our webisite . It's Midhun How are you? . Your account has been created with email id : ${email}`
                        } 

                        //sending email
                        await transpoter.sendMail(mailOption , (error , info) => {
                            if(error){
                                console.log("Email error : " + error)
                            }else{
                                console.log("Email send : " , info.response)
                            }
                        })

                    }

                }else{

                    response.status(400).json({message : "Password must be 6 letters or above"})

                }

            }

        }else{

            response.status(400).json({message : "All fields are required"})

        }
    }catch(error){

        console.log("sign controller error : " + error)
        response.status(500).json({error : "Server error"})

    }

}

//controller for login
export const loginController = async (request , response) => {

    try{

        const {email , password} = request.body
        
        if(email && password){

            //check user signed
            const user = await User.findOne({email : email})

            if(user){

                //check password is correct
                const checkPassword = await user.comparePassword(password)

                if(checkPassword){

                    generateToken(user._id , user.name , user.email , response)
                    response.status(400).json({sucess : true , message : "Login success"})
                    
                }else{

                    response.status(400).json({message : "Password is incorrect"})

                }

            }else{

                response.status(400).json({message : "Email is not registered"})

            }

        }else{

            response.status(400).json({message : "All fields are required"})

        }

    }catch(error){

        console.log("login controller error : " + error)
        response.status(500).json({error : "Server error"})

    }

}

//controller for logout
export const logoutController = async (request , response) => {

    try{

        response.clearCookie("token" , {

            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",

        })
        response.status(200).json({message : "Logout success" , logout : true})

    }catch(error){

        console.log("logout controller error : " + error)
        response.status(500).json({error : "Server error"})

    }
}

//controller for send otp
export const sendOtpController = async (request , response) => {

    try{

        const {_id : userId} = request.user

        const user = await User.findById(userId)

        if(user.isVeryfied){

            response.status(200).json({message : "Email is already verified"})

        }else{

            const otp = ((Math.round(Math.random()*9000)) * 100).toString() //generate otp
            
            user.verifyOtp = otp
            user.verifyOtpExpiredAt = Date.now() * 24 * 60 * 60 * 1000

            await user.save()

            const mailOption = {
                from : process.env.SMTP_EMAIL,
                to : user.email,
                subject : "Email veryfication",
                text : `Your OTP is ${otp} . Verify using this OTP but do not share anyone to this OTP`
            } 

            //sending email
            await transpoter.sendMail(mailOption , (error , info) => {
                if(error){
                    console.log("Email error : " + error)
                }else{
                    console.log("Email send : " , info.response)
                }
            })

            response.status(200).json({message : "Veryfication OTP Send to the email" , success : true})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("send otp controller error : " + error)

    }

}

//controller for verify email
export const verifyEmailController = async (request , response) => {

    try{

        const {otp} = request.query
        const {_id : userId} = request.user

        if(otp){

            const user = await User.findById(userId)

            if(user.verifyOtpExpiredAt < Date.now()){

                response.status(400).json({message : "OTP is expired"})

            }
            else if(user.verifyOtp === otp){
                
                user.isVeryfied = true
                user.verifyOtp = null
                user.verifyOtpExpiredAt = null
                user.save()

                response.status(200).json({message : "Account verified" , success : true})

            }else{

                response.status(400).json({message : "incorrect OTP"})

            }

        }else{

            response.status(400).json({message : "OTP is missing"})

        }

    }catch(error){
        response.status(500).json({error : "Server error"})
        console.log("Verify otp controller error : " + error)
    }

}

//controller for check authenticated
export const isAuthenticated = async (request , response) => {

    const {_id : userId} = request.user

    try{

        const user = await User.findById(userId)

        if(user){
            response.status(200).json({message : "Authenticated" , sucess : true , auth : true})
        }

    }catch(error){

        response.status(500).json({message : "Server error"})
        console.log("isAuthenticated controller error : " + error)

    }

}

//controller for send otp for reset password
export const resetPasswordOtp = async (request , response) => {

    try{

        const {_id : userId} = request.user

        if(userId){

            const user = await User.findById(userId)

            const otp = ((Math.round(Math.random()*9000)) * 100).toString() //generate otp

            //mail option for sending mail
            const mailOption = {
                from : process.env.SMTP_EMAIL,
                to : user.email,
                subject : "Reset Password",
                text : `Here your OTP ${otp} for reset password . Do not share this to anyone`
            } 

            //sending email
            await transpoter.sendMail(mailOption , (error , info) => {
                if(error){
                    console.log("Email error : " + error)
                }else{
                    console.log("Email send : " , info.response)
                }
            })

            user.verifyOtp = otp
            user.verifyOtpExpiredAt = Date.now()

            user.save()

            response.status(200).json({sucess : true , message : "OTP sended to the email"})

        }


    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("reset password controller error")

    }

}

//controller for reset password
export const resetPassword = async (request , response) => {

    try{

        const {otp , newPassword} = request.body
        const {_id : userId} = request.user

        if(otp && newPassword){

            const user = await User.findById(userId)

            if(user){

                if(user.verifyOtp === otp && user.verifyOtpExpiredAt < (Date.now() + 60 * 1000)){

                    //hashing new password
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await hash(newPassword , salt)

                    user.password = hashPassword
                    user.verifyOtp = null,
                    user.verifyOtpExpiredAt = null

                    user.save()

                    response.status(200).json({message : "Password has been changed" , success : true})

                }else{

                    response.status(400).json({message : "Invalid OTP"})

                }

            }

        }else{

            response.status(400).json({message : "Fields are missing"})

        }

    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("reset password controller error : " + error)

    }

}