import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port:465,
  secure:true,
  auth: {
    user: 'abhishekak.madquick@gmail.com',
    pass: 'joesbrxzmvmlbacp',
  },
});

/**
 * Send OTP to user's email for verification
 * @param {string} to - recipient email
 * @param {string} otp - One Time Password
 */
export const sendVerificationOtp = async (to, otp) => {
  const mailOptions = {
    from: `"MyApp" <abhishekak.madquick@gmail.com>`,
    to,
    subject: '🔐 Email Verification - OTP Inside',
    html: `
      <h2>Hello 👋</h2>
      <p>Thanks for registering! Please use the OTP below to verify your email:</p>
      <h1 style="letter-spacing: 2px;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <br/>
      <small>If you did not request this, please ignore this email.</small>
    `,
  };

  await transporter.sendMail(mailOptions);
};
