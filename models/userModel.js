const { mongo, default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email Address Already taken."],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
