import {createTransport} from "nodemailer"
import dotenv from "dotenv";
dotenv.config()

const transporter = createTransport({
    service:"Gmail",
    auth:{
        user:process.env.EMAIL_USERNAME,
        pass:process.env.EMAIL_PASSWORD
    }
})

export const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Your OTP for Account Verification',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Account Verification</h2>
          <p>Your OTP for account verification is:</p>
          <h3 style="background: #f4f4f4; padding: 10px; display: inline-block;">
            ${otp}
          </h3>
          <p>This OTP is valid for 3 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
};

