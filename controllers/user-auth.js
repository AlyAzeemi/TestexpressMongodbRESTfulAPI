const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const { messages } = require("../localization/messages");
const {
  sendResponseWithDataAndMessage,
  errorResponseWithOnlyMessage,
  sendResponseOnlyWithMessage,
} = require("../methods/response");

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
    console.log(response);
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

    /*Hash password
    let salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(qPassword, salt);*/

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
    else if (response == messages.auth.login.success) {
      success = true;
      /*
      sendResponseOnlyWithMessage(
        res,
        success,
        messages.auth.login.success,
        200
      );*/
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
    res.clearCookie("accessToken", req.token), { httpOnly: true };
    res.redirect("../login");
  } catch (e) {
    console.log(`Error whilst logging out user: ${e}`);
  }
};

async function test() {
  await signup();
  await login();
}

module.exports = { login, signup, logout };
