const mongoose = require("mongoose");
const  Schema  = mongoose.Schema;
const bcrypt = require("bcryptjs");

const StudentSchema = new Schema({
  Email: {
    type: String,
    required: true,
    unique : true,
  },
  Aadharcard: {
    type: Number,
    required: true,
    unique : true,
  },
  Password: {
    type: String,
    required: true,
  },
});



StudentSchema.pre("save", async function (next) {
  const user = this;
  console.log(user);
  if (!user.isModified("Password")) {
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);
    const hash_password = await bcrypt.hash(user.Password, saltRound);
    user.Password = hash_password;
  } catch (err) {
    console.log(err);
  }
});

const student = mongoose.model("Students", StudentSchema);
module.exports = student;
