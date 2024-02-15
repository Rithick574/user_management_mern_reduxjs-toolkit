const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
  },
  profile: {
    type: {
      type: String,
    },
  },
});


const User = mongoose.model("users",userSchema);
module.exports = User;