const mongoose = require("mongoose");
const { mongoPass } = require("../secrets.json");
const mongoPath = `mongodb+srv://aly:${mongoPass}@cluster0.fwdpv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const userSchema = require("../models/user-schema");
const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const { response } = require("express");
const messages = require("../localization/messages");
const {
  sendResponseWithDataAndMessage,
  errorResponseWithOnlyMessage,
  sendResponseOnlyWithMessage,
} = require("../methods/response");

async function signup(req, res) {
  try {
    //Get form data
    let userFormData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      age: req.body.age,
    };

    //Hash password
    let salt = await bcrypt.genSalt(10);
    userFormData.password = await bcrypt.hash(this.password, salt);

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
    return {
      message: "An account affiliated with that email already exists.",
      signupStatus: false,
    };
  }
}
async function login(req, res) {
  try {
    //Get args
    const qEmail = req.body.email;
    const qPassword = req.body.password;
    console.log(qEmail, qPassword);

    //Hash password
    let salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(qPassword, salt);

    //Process args
    response = await authService.login(qEmail, hashedPassword);
    //If email not found
    if (response == messages.auth.login.user_not_found) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.login.user_not_found
      );
    } //If email found but password doesn't match
    else if (response == messages.auth.login.incorrect_password) {
      return errorResponseWithOnlyMessage(
        res,
        messages.auth.login.incorrect_password
      );
    } //If everything checks out
    else if (response == messages.auth.login.success) {
      sendResponseOnlyWithMessage(res, messages.auth.login.success, 200);
      return res.redirect("../dashboard");
    } else {
      throw e;
    }
  } catch (e) {
    console.log(`Error logging in: ${e}`);
    errorResponseWithOnlyMessage(res, e);
  }
}

async function test() {
  await signup();

  await login();
}

module.exports = { login, signup };
