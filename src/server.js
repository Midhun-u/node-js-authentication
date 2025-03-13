import express from 'express'
import https from 'node:https'
import path from 'path'
import fs from 'fs'
import {fileURLToPath} from 'url'
import {config} from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import databaseConnection from './config/db.js'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({credentials : true , origin : "http://localhost:5173"}))
app.use(cookieParser())

//middleware for auth route
app.use("/auth" , authRoute)

//middleware for user route
app.use("/user" , userRoute) 

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const server = https.createServer({
    key : fs.readFileSync(path.join(__dirname , "cert" , "key.pem")),
    cert : fs.readFileSync(path.join(__dirname , "cert" , "cert.pem"))
} , app)

server.listen(PORT , "0.0.0.0" , () => {

    //function for connection database
    databaseConnection()

    console.log(`Server running on ${PORT}`)
})

export default server
