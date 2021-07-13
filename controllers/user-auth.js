const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const { messages } = require("../localization/messages");
const {
  sendResponseWithDataAndMessage,
  errorResponseWithOnlyMessage,
  sendResponseOnlyWithMessage,
} = require("../methods/response");
const userSchema = require("../models/user-schema");
const { check } = require("express-validator");

signup = async (req, res) => {
  try {
    let userFormData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
    };

    //Hash password
    let salt = await bcrypt.genSalt(10);
    userFormData.password = await bcrypt.hash(userFormData.password, salt);

    //Signup
    const response = await authService.signUp(userFormData);
    if (response == messages.auth.signup.already_registered) {
      return errorResponseWithOnlyMessage(res, response);
    }

    return sendResponseOnlyWithMessage(
      res,
      true,
      messages.auth.signup.success,
      200
    );
  } catch (e) {
    console.log(`Error creating user: ${e}`);
    errorResponseWithOnlyMessage(res, e);
  }
};

login = async (req, res) => {
  try {
    //Get args
    const qEmail = req.body.email;
    const qPassword = req.body.password;
    let success = false;
    console.log(qEmail, qPassword);

    //Process args
    const response = await authService.login(qEmail, qPassword);

    //If email not found
    if (response == messages.auth.login.user_not_found) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.login.user_not_found
      );
    } //If email found but password doesn't match
    else if (response == messages.auth.login.incorrect_password) {
      errorResponseWithOnlyMessage(res, messages.auth.login.incorrect_password);
    } //If everything checks out
    else if (response.message == messages.auth.login.success) {
      success = true;
      /*
      sendResponseOnlyWithMessage(
        res,
        success,
        messages.auth.login.success,
        200
      );*/
      res.cookie("JWToken", response.JWToken, {
        expires: new Date(Date.now() + 60 * 15 * 1000),
      });
      return res.redirect("../dashboard");
    } else {
      throw e;
    }
  } catch (e) {
    console.log(`Error logging in: ${e}`);
    errorResponseWithOnlyMessage(res, e);
  }
};

logout = async (req, res) => {
  //TODO: figure out how to make this work
  try {
    console.log(req.token);
    res.clearCookie("JWToken", req.token), { httpOnly: true };
    await userSchema.findOneAndUpdate(
      { JWToken: req.token },
      { $set: { JWToken: "" } }
    );
    res.redirect("../login");
  } catch (e) {
    console.log(`Error whilst logging out user: ${e}`);
  }
};

resetPassword = async (req, res) => {
  try {
    //Generate new password
    var plainTextNewPassword = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    //Hash password
    let salt = await bcrypt.genSalt(10);
    HashedNewPassword = await bcrypt.hash(plainTextNewPassword, salt);

    let response = await authService.resetPassword(
      req.body.email,
      plainTextNewPassword,
      HashedNewPassword
    );
    if (response == messages.auth.resetPassword.success) {
      return sendResponseOnlyWithMessage(
        res,
        true,
        "New password has been sent to the given mailing address."
      );
    } else if (response == messages.auth.resetPassword.failure) {
      return errorResponseWithOnlyMessage(res, response);
    } else {
      throw e;
    }
  } catch (e) {
    console.log(`Error resetting password ${e}`);
    return errorResponseWithOnlyMessage(res, e);
  }
};

verifyCode = async (req, res) => {};

sendVerificationEmail = async (req, res) => {
  try {
  } catch (e) {}
};

async function test() {
  await signup();
  await login();
}

module.exports = {
  login,
  signup,
  logout,
  resetPassword,
  sendVerificationEmail,
  verifyCode,
};
