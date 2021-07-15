const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const { messages } = require("../localization/messages");
const {
  sendResponseWithDataAndMessage,
  errorResponseWithOnlyMessage,
  sendResponseOnlyWithMessage,
  errorResponse,
} = require("../methods/response");
const userSchema = require("../models/user-schema");

signup = async (req, res) => {
  try {
    //Validation checks
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!req.body.email.match(regexEmail)) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.validationChecks.invalid_email
      );
    }
    if (req.body.password !== req.body.password2) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.validationChecks.passwords_do_not_match
      );
    }

    if (typeof parseInt(req.body.age) !== "number") {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.validationChecks.invalid_age
      );
    }
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
    //Validation checks
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!req.body.email.match(regexEmail)) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.validationChecks.invalid_email
      );
    }

    //Get args
    const qEmail = req.body.email;
    const qPassword = req.body.password;
    let success = false;
    console.log(qEmail, qPassword);

    //Process args
    const response = await authService.login(qEmail, qPassword);

    //If email not found
    if (response == messages.auth.login.user_not_found) {
      return errorResponseWithOnlyMessage(res, response);
    } //If email found but password doesn't match
    else if (response == messages.auth.login.incorrect_password) {
      errorResponseWithOnlyMessage(res, response);
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
    await authService.logout(req.token);
    res.redirect("../login");
  } catch (e) {
    console.log(`Error whilst logging out user: ${e}`);
  }
};

resetPassword = async (req, res) => {
  try {
    //Validation checks
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!req.body.email.match(regexEmail)) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.validationChecks.invalid_email
      );
    }

    //Generate new password
    var plainTextNewPassword = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
      plainTextNewPassword += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    //Hash password
    let salt = await bcrypt.genSalt(10);
    HashedNewPassword = await bcrypt.hash(plainTextNewPassword, salt);

    const response = await authService.resetPassword(
      req.body.email,
      plainTextNewPassword,
      HashedNewPassword
    );
    if (response == messages.auth.resetPassword.success) {
      return sendResponseOnlyWithMessage(res, true, response, 200);
    } else if (
      response == messages.auth.resetPassword.failure ||
      response == messages.auth.resetPassword.user_not_found
    ) {
      return errorResponseWithOnlyMessage(res, response);
    } else {
      throw "Internal Server Error.";
    }
  } catch (e) {
    console.log(`Error resetting password ${e}`);
    return errorResponseWithOnlyMessage(res, e);
  }
};

sendVerificationEmail = async (req, res) => {
  try {
    //Validation checks
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!req.user.email.match(regexEmail)) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.validationChecks.invalid_email
      );
    }
    const response = await authService.sendVerificationCode(req.user.email);
    if (response == messages.auth.sendVerificationCode.success) {
      res.redirect("../verifyCode");
    } else if (
      response == messages.auth.sendVerificationCode.user_not_found ||
      response == messages.auth.sendVerificationCode.failure
    ) {
      return errorResponseWithOnlyMessage(res, response);
    }
  } catch (e) {
    console.log(`Error in controller sending verification email:${e}`);
    return errorResponseWithOnlyMessage(res, "Internal Server Error");
  }
};

verifyCode = async (req, res) => {
  try {
    const response = await authService.verifyCode(
      req.user.email,
      req.body.code
    );
    if (response.message == messages.auth.verifyCode.success) {
      res.cookie("JWToken", response.JWToken, {
        expires: new Date(Date.now() + 60 * 15 * 1000),
      });
      return sendResponseOnlyWithMessage(res, true, response.message, 200);
    } else if (response.message == messages.auth.verifyCode.failure) {
      return errorResponseWithOnlyMessage(res, response.message);
    } else {
      throw "Account not found but this shouldn't even be happening here";
    }
  } catch (e) {
    console.log(`Error in controller verifying code: ${e}`);
    return errorResponseWithOnlyMessage(res, "Internal Server Error");
  }
};

verifyUserByAdmin = async (req, res) => {
  try {
    const response = await authService.verifyUserByAdmin(
      req.body.email,
      req.user.email
    );
    if (response == messages.auth.verifyUserByAdmin.success) {
      return sendResponseOnlyWithMessage(res, true, response, 200);
    } else if (
      response == messages.auth.verifyUserByAdmin.unauthorized_request
    ) {
      return errorResponseWithOnlyMessage(res, response);
    } else if (response == messages.auth.verifyUserByAdmin.user_not_found) {
      return errorResponseWithOnlyMessage(res, response);
    }
  } catch (e) {
    console.log(`Error in user-auth:verifyUserByAdmin: ${e}`);
    return errorResponseWithOnlyMessage(res, "Internal Server Error");
  }
};

module.exports = {
  login,
  signup,
  logout,
  resetPassword,
  sendVerificationEmail,
  verifyCode,
  verifyUserByAdmin,
};
