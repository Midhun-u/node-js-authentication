import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const protectMiddleware = async (request , response , next) => {

    const {token} = request.cookies

    if(token){

        const verifyUser = jwt.verify(token , process.env.JWT_SECRET)

        if(verifyUser){

            const user = await User.findOne({_id : verifyUser.id})
            request.user = user

            next()

        }else{

            response.status(400).json({message : "Invalid token"})

        }


    }else{

        response.status(400).json({auth : false})

    }

}

export default protectMiddleware