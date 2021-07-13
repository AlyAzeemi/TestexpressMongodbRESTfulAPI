const userSchema = require("../models/user-schema");
const { messages } = require("../localization/messages");
const jwt = require("jsonwebtoken");
const mailClient = require("../constants/mailingAgent");
async function login(qEmail, qPassword) {
  try {
    const user = await userSchema.findOne({ email: qEmail });

    //If account doesn't exist
    if (user == null) {
      return messages.auth.login.user_not_found;
    }

    //Check password
    console.log(user.password);
    console.log(qPassword);

    const passMatch = await user.comparePasswordAsync(qPassword);
    if (!passMatch) {
      return messages.auth.login.incorrect_password;
    } else {
      //TODO: Figure out how this works
      //Login and sign JWT
      const JWToken = await jwt.sign(
        { _id: user._id, email: user.email },
        "secretkey",
        { expiresIn: "1d" }
      );
      user.JWToken = JWToken;
      user.save();
      return { message: messages.auth.login.success, JWToken: JWToken };
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
    if (res !== null) {
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

async function resetPassword(qEmail, plainTextNewPassword, HashedNewPassword) {
  try {
    //See if user exists
    let user = await userSchema.findOne({ email: qEmail });
    if (user) {
      //Send Email
      await mailClient.sendNewPassword(
        qEmail,
        user.username,
        plainTextNewPassword
      );

      //Update password
      user.password = HashedNewPassword;
      await user.save();

      return messages.auth.resetPassword.success;
    } else {
      throw `No account affiliated with ${qEmail} was found.`;
    }
  } catch (e) {
    console.log(`Error resetting password: ${e}`);
    return messages.auth.resetPassword.failure;
  }
}
async function sendVerificationCode(qEmail) {
  try {
    //Generate Code
    const codeLength = 4;
    let verificationCode = Math.floor(Math.random() * Math.pow(10, codeLength));

    //Check if user exists
    user = await userSchema.findOne({ email: qEmail });
    if (user) {
      //Mail code
      await mailClient.sendVerificationCode(
        qEmail,
        user.username,
        verificationCode
      );

      //Store for verification
      //TODO: Add expiry
      user.verificationCode = verificationCode;
      await user.save();

      return messages.auth.sendVerificationCode.success;
    } else {
      throw `No account affiliated with ${qEmail} was found.`;
    }
  } catch (e) {
    console.log(`Error sending verification code:${e}`);
    return messages.auth.sendVerificationCode.failure;
  }
}

async function checkVerificationCode(qEmail) {}

module.exports = {
  login,
  signUp,
  checkIfJWTExists,
  resetPassword,
  sendVerificationCode,
};
