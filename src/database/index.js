const { default: mongoose } = require("mongoose");

const connectToDB = async () => {
  const connectonURL = process.env.MONGODB_URL;
  // "mongodb://localhost:27017/Pitchhub";

  mongoose
    .connect(connectonURL)
    .then(() => console.log("json board database is successfull"))
    .catch((error) => console.log(error));
};

export default connectToDB;
