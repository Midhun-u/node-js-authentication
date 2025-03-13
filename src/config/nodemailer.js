import nodemailer from 'nodemailer'
import {config} from 'dotenv'
config()

const transpoter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.SMTP_EMAIL,
        pass : process.env.SMTP_PASS
    }
})

export default transpoter