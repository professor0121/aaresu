import { createUser, findUserByEmail } from '../dao/user.dao.js';
import { hashPassword, compareHashedPassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/jwtToken.js';
import { generateOTP,storeOTP } from '../utils/otp.js';
import { sendVerificationOtp,sendVerificationAdminOtp } from '../utils/sendEmail.js';

export const registerUserService = async (username, email, password) => {
 const  hashedPassword=await hashPassword(password);
 const newUser=await createUser({username,email,password:hashedPassword});
 const token=await generateToken(email)
 return {newUser,token};
};

export const loginUserService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  const match = await compareHashedPassword(password, user.password);
  if (!match) {
    throw new Error('Invalid password');
  }
  const token = await generateToken(email);
  const otp=generateOTP();
  await storeOTP(email,otp);
  await sendVerificationOtp(email,otp);
  return { user, token };
};

