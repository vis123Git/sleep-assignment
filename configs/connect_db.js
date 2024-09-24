const mongoose = require("mongoose");

exports.db_connection = async () => {
  try {
    const db = await mongoose.connect(process.env.DB);
    if (db) {
      console.log("MongoDB Test Database Connected");
    }
  } catch (error) {
    console.log("error---->", error);

    process.exit(1);
  }
};
