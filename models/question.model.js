const { Schema, model, Types } = require("mongoose");

const question_schema = new Schema(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["multiple-choice", "checkbox", "numeric", "scale", "time", "text", "boolean"],
    },
    options: {
      type: [String],
      required: function () {
        return ["multiple-choice", "checkbox", "scale", "boolean"].includes(this.type);
      },
    },
    scoring: {
      type: Map,
      of: Number,
      required: function () {
        return ["multiple-choice", "checkbox", "scale", "boolean"].includes(this.type);
      },
    },
    min: {
      type: Number,
      required: function () {
        return ["numeric", "scale"].includes(this.type);
      },
    },
    max: {
      type: Number,
      required: function () {
        return ["numeric", "scale"].includes(this.type);
      },
    },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const Question = model("question", question_schema);
module.exports = Question;
