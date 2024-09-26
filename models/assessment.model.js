const { Schema, model, Types } = require("mongoose");

const assessment_schema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: "user", required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    is_completed: { type: Boolean, default: false },
    score: { type: Number },
    answers: [
      {
        question: { type: Types.ObjectId, ref: "question", required: true },
        answer: { type: Schema.Types.Mixed, required: true },
        score: { type: Number },
      },
    ],
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

const Assessment = model("assessment", assessment_schema);
module.exports = Assessment;
