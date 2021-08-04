import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI!, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  } catch (error) {
    console.log("connection error ", error.message);
  }

  const connection = mongoose.connection;

  if (connection.readyState >= 1) {
    console.log("connected to database");
    return;
  }

  connection.on("connected", () => console.log("connected to database"));

  connection.on("error", () => console.log("database connection failed"));
};
export default connectDB;
