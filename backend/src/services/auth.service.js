import { findUserByEmail } from "../dao/user.dao";
import asyncHandler from "../utils/asyncHandler";

export const createUserService=asyncHandler(async(username,email,password)=>{
    const user=await findUserByEmail(email);
    if(user){
        throw new Error('User already exists');
    }
    const newUser=await createUser({username,email,password});
    return newUser;
})