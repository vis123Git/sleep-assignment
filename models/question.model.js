const { Schema, model, Types } = require("mongoose");

const question_schema = new Schema(
  {
    text: { type: String, required: true },
    type: { type: String, required: true },
    options: [String],
    order: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const Question = model("question", question_schema);
module.exports = Question;
