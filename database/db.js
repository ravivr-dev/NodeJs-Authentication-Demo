const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDB connected Successfully");
  } catch (e) {
    console.log("MongoDB connection Failed! ", e);
    process.exit(1);
  }
};

module.exports = connectToDB;
