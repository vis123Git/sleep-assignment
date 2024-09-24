const Question = require("../models/question.model");

exports.save_new_question = async (data) => {
  try {
    return await Question.create(data);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_question_by_id = async (id) => {
  try {
    return await Question.findById(id);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_one_question = async (filter, fields) => {
  try {
    return await Question.findOne(filter, fields);
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.find_all_questions = async (filter, fields) => {
  try {
    return await Question.find(filter, fields).sort({ order: 1 });
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};

exports.update_one_question = async (id, data) => {
  try {
    return await Question.findByIdAndUpdate(id, { $set: data }, { new: true });
  } catch (error) {
    console.log("error--->", error);
    throw error;
  }
};
