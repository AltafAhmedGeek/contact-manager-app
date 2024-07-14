const { mongoose } = require("mongoose");

const connectDb = async () => {
  try {
      const connect = await mongoose.connect(process.env.CONN_STR);
    console.log(
      "DB Connected",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectDb;
