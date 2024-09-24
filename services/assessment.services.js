const Assessment = require("../models/assessment.model");

exports.save_new_assessment = async (data) => {
  try {
    return await Assessment.create(data);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_assessment_by_id = async (id) => {
  try {
    return await Assessment.findById(id);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_one_assessment = async (filter, fields) => {
  try {
    return await Assessment.findOne(filter, fields);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.update_one_assessment = async (id, data) => {
  try {
    return await Assessment.findByIdAndUpdate(id, { $set: data }, { new: true });
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};
