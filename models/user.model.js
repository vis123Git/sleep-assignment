const { Schema, model, Types } = require("mongoose");

const user_schema = new Schema(
  {
    nickname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String, required: false, default: "" },
    is_admin: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);
const User = model("user", user_schema);
module.exports = User;
