import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,   // Your App Password
  },
});

export const sendOtpMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject: "Reset your password",
        html: `<p>Your otp for reset password is <b>${otp}</b>. It expires in 5  minutes.</p>`
    })
}

export const sendDeliveryOtpMail = async (user, otp) => {
    try {
      console.log("📧 Attempting to send email to:", user.email);
  
      const mailInfo = await transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Delivery OTP",
        html: `<p>Your OTP for delivery is <b>${otp}</b>. It expires in 5 minutes.</p>`,
      });
  
      console.log("📧 MAIL SENT:", mailInfo);
  
    } catch (error) {
      console.error("❌ EMAIL SEND ERROR:", error.message, error);
    }
  };
  
  