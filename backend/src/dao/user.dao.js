import User from '../models/user.model.js';

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const updateUserById = async (id, update) => {
  return await User.findByIdAndUpdate(id, update, { new: true });
};

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const updateVerified = async (email) => {
  return await User.findOneAndUpdate({ email }, { verified: true }, { new: true });
};
