import Admin from '../models/admin.model.js';

export const findAdminByEmail=async(email)=>{
    return await Admin.findOne({email});
}

export const createAdmin=async(adminData)=>{
    return await Admin.create(adminData);
}

export const findAdminById=async(_id)=>{
    return await Admin.findById(_id);
}

export const updateAdminById=async(_id,update)=>{
    return await Admin.findByIdAndUpdate(_id,update,{new:true});
}