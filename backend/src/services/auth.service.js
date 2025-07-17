import { createUser, findUserByEmail } from '../dao/user.dao.js';
import { createAdmin,findAdminByEmail } from '../dao/admin.dao.js';
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

export const createAdminService = async (username, email, password) => {
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword)
  const newAdmin = await createAdmin({ username, email, password: hashedPassword });
  const token = await generateToken(email);
  return { newAdmin, token };
};

export const loginAdminService = async (email, password) => {
  const admin = await findAdminByEmail(email);
  if (!admin) {
    throw new Error('Admin not found');
  }
  const match = await compareHashedPassword(password, admin.password);
  if (!match) {
    throw new Error('Invalid password');
  }
  const token = await generateToken(email);
  const otp=generateOTP();
  await storeOTP(email,otp);
  await sendVerificationAdminOtp(email,otp);
  return { admin, token };
};