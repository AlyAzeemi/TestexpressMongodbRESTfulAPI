const { login } = require("../controllers/user-auth");
const userSchema = require("../models/user-schema");
const messages = require("../localization/messages");
const jwt = require("jsonwebtoken");

async function login(qEmail, hashedPassword) {
  try {
    const user = await userSchema.findOne({ email: qEmail });

    //If account doesn't exist
    if (user == null) {
      return messages.auth.login.user_not_found;
    }

    //Check password
    const passMatch = await user.comparePasswordAsync(hashedPassword);
    if (!passMatch) {
      return messages.auth.login.incorrect_password;
    } else {
      //Login and sign JWT
      const JWToken = await jwt.sign(user, "secretkey", { expiresIn: "1d" });
      user.JWToken = JWToken;
      user.save();
      return messages.auth.login.success;
    }
  } catch (e) {
    throw e;
  }
}

async function checkIfJWTExists(token) {
  try {
    var user = await userSchema.findOne({ JWToken: token });
    return user;
  } catch (e) {
    console.log(`Error finding JWToken: ${e}`);
    throw e;
  }
}

async function signUp(data) {
  try {
    var user = new userSchema(data);
    res = await user.save();
    return res;
  } catch (e) {
    console.log(`Error registering user:${e}`);
    throw e;
  }
}

module.exports = { login, signUp, checkIfJWTExists };
