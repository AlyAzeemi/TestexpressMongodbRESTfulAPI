const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const primaryKey = { type: String, required: true, unique: true };
const reqString = { type: String, required: true };
const optInt = { type: Number, required: false };

const userSchema = mongoose.Schema(
  {
    email: primaryKey,
    username: reqString,
    password: reqString,
    age: optInt,
    JWToken: String,
  },
  { timestamps: true }
);

userSchema.methods.comparePasswordAsync = async function (qPassword) {
  r = await bcrypt.compareSync(qPassword, this.password);
  return r;
};

module.exports = mongoose.model("users", userSchema);
