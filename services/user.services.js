const User = require("../models/user.model");

exports.save_new_user = async (data) => {
  try {
    return await User.create(data);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_user_by_id = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_one_user = async (filter, fields) => {
  try {
    return await User.findOne(filter, fields);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.update_one_user = async (id, data) => {
  try {
    return await User.findByIdAndUpdate(id, { $set: data }, { new: true });
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};
