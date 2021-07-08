const userSchema = require("../models/user-schema");
const { messages } = require("../localization/messages");
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
      //TODO: Figure out how this works
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
    res = await userSchema.findOne({ email: user.email });
    if (user !== null) {
      return messages.auth.signup.already_registered;
    }
    await user.save();

    return messages.auth.signup.success;
  } catch (e) {
    console.log(`Error registering user:${e}`);
    throw e;
  }
}

async function logout(token) {
  try {
    var user = await new userSchema.findOne({ JWToken: token });
    user.JWToken = "";
    await user.save();
  } catch (e) {}
}
module.exports = { login, signUp, checkIfJWTExists };
