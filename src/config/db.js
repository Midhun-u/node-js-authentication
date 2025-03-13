import {connect} from 'mongoose'

//function for connection database
const databaseConnection = async () => {

    try{
        await connect(process.env.MONGODB_URL)
        console.log("Database connected")
    }catch(error){
        console.log("Database is not connected : " + error)
    }

}

export default databaseConnection