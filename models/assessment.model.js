const { Schema, model, Types } = require("mongoose");

const assessment_schema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "user", required: true },
    started_at: { type: Date, default: Date.now },
    completed_at: { type: Date },
    score: { type: Number },
    answers: [
      {
        question: { type: Types.ObjectId, ref: "question", required: true },
        answer: { type: String, required: true },
        answered_at: { type: Date, default: Date.now },
      },
    ],
    recommendations: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Assessment = model("assessment", assessment_schema);
module.exports = Assessment;
