import { createUser, findUserByEmail } from '../dao/user.dao.js';
import { hashPassword, compareHashedPassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/jwtToken.js';
import { generateOTP,storeOTP } from '../utils/otp.js';
import { sendVerificationOtp } from '../utils/sendEmail.js';

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
  console.log( "the otp is" ,otp)
  await storeOTP(email,otp);
  console.log("the otp is stored in redis");
  await sendVerificationOtp(email,otp);
  return { user, token };
};