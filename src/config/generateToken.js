import jwt from  'jsonwebtoken'

//function for generating token
const generateToken = (id , userName , userEmail , response) => {

    const token = jwt.sign({id : id , name : userName , email : userEmail} , process.env.JWT_SECRET , {expiresIn : "7d"})

    response.cookie("token" , token , {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge : 7 * 24 * 60 * 60 * 1000
    })

}

export default generateToken