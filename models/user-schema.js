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
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    let salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, function (error, isMatch) {
    if (error) {
      return callback(error);
    } else {
      callback(null, isMatch);
    }
  });
};

userSchema.methods.comparePasswordAsync = function (param1) {
  let password = this.password;
  return new Promise(function (resolve, reject) {
    bcrypt.compare(param1, password, function (err, res) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = mongoose.model("users", userSchema);
