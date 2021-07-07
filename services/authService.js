const { login } = require("../controllers/user-auth");
const userSchema = require("../models/user-schema");
const messages = require("../localization/messages");
const jwt = require("jsonwebtoken");

async function login(qEmail, qPassword) {
  try {
    const user = await userSchema.findOne({ email: qEmail });
    //If account doesn't exist
    if (user == null) {
      return messages.auth.login.user_not_found;
    }
    //Check password
    const passMatch = await user.comparePasswordAsync(qPassword);
    //If pass incorrect
    if (!passMatch) {
      return messages.auth.login.incorrect_password;
    } else {
      //Login and sign JWT
      const JWToken = await jwt.sign(user, "secretkey", { expiresIn: "1d" });
      user.JWToken = JWToken;
      //TODO: Change save method
      //user.save();
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
  var user = new userSchema(data);
  user.save();
}
