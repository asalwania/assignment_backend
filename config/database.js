const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const params = {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.DB_URI, params);
    // await mongoose.connect("mongodb://localhost:27017/assignment", params)

    console.log("DB Connected");
  } catch (error) {
    console.log("Could not connect to DB", error);
  }
};

module.exports = connectDatabase;
