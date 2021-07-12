const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const primaryKey = { type: String, required: true, unique: true };
const reqString = { type: String, required: true };
const optInt = { type: Number, required: false };
const account = { type: String, required: true, default: "user" };

const userSchema = mongoose.Schema(
  {
    email: primaryKey,
    username: reqString,
    password: reqString,
    age: optInt,
    JWToken: String,
    isEmailVerified: { type: Boolean, default: false },
    adminApproval: { type: Boolean, default: false },
    accountType: account,
    verificationCode: optInt,
  },
  { timestamps: true }
);

userSchema.methods.comparePasswordAsync = async function (hashedPassword) {
  r = bcrypt.compareSync(hashedPassword, this.password);
  return r;
};

module.exports = mongoose.model("users", userSchema);
