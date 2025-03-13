import User from "../models/user.model.js"

//controller for get user data
export const userData = async (request , response) => {

    try{

        const {_id : userId} = request.user

        if(userId){

            const user = await User.findById(userId).select("-password")
            response.status(200).json(user)

        }


    }catch(error){

        response.status(500).json({error : "Server error"})
        console.log("user data controller error : " + error)

    }

}