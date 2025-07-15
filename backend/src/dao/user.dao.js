import User from '../models/user.model.js';

export const findUserByUsername=async(username)=>{
    return await User.findOne({username});
}

export const findUserByEmail=async(email)=>{
    return await User.findOne({email});
}

export const createUser=async(user)=>{
    return await User.create(user);
}