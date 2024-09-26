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







const questions = [
  new Question({
    text: "How would you rate your overall sleep quality?",
    type: "multiple-choice",
    options: ["Excellent", "Good", "Fair", "Poor"],
    scoring: {
      "Excellent": 3,
      "Good": 2,
      "Fair": 1,
      "Poor": 0
    },
    order: 1
  }),
  new Question({
    text: "How many hours of sleep do you typically get each night?",
    type: "numeric",
    min: 0,
    max: 24,
    order: 2
  }),
  new Question({
    text: "Do you have trouble falling asleep?",
    type: "boolean",
    options: ["Yes", "No"],
    scoring: {
      "Yes": 0,
      "No": 1
    },
    order: 3
  }),
  new Question({
    text: "On a scale of 1-5, how refreshed do you feel upon waking?",
    type: "scale",
    options: ["1", "2", "3", "4", "5"],
    scoring: {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    },
    min: 1,
    max: 5,
    order: 4
  }),
  new Question({
    text: "Which of the following sleep issues do you experience? (Select all that apply)",
    type: "checkbox",
    options: ["Difficulty falling asleep", "Waking up during the night", "Early morning awakening", "Snoring"],
    scoring: {
      "Difficulty falling asleep": -1,
      "Waking up during the night": -1,
      "Early morning awakening": -1,
      "Snoring": -1
    },
    order: 5
  })
];

async function saveQuestions() {
  try {
    await Question.insertMany(questions);
    console.log("All questions saved successfully");
  } catch (error) {
    console.error("Error saving questions:", error);
  }
}

// saveQuestions();