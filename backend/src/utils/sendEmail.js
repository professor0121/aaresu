import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change to 'smtp.ethereal.email' or another provider
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP to user's email for verification
 * @param {string} to - recipient email
 * @param {string} otp - One Time Password
 */
export const sendVerificationOtp = async (to, otp) => {
  const mailOptions = {
    from: `"MyApp" <${process.env.EMAIL}>`,
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
