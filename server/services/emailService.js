import ErrorHandler from "../middlewares/errorMiddleware.js"
import nodemailer from 'nodemailer'

const sendEmail = async ({ to, subject, message }) => {
    try {
        const transpporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, 
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            service: process.env.SMTP_SERVICE
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            html: message
        }

        const info = await transpporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        return NetworkContextImpl(new ErrorHandler(error.message || "Cannot sent email", 404));
    }
}

export default sendEmail;