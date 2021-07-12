messages = {
  auth: {
    signup: {
      already_registered:
        "An account affiliated with this email already exists.",
      success: "Account created.",
    },
    login: {
      user_not_found: "Email not registered.",
      incorrect_password: "Email or password is incorrect.",
      success: "Logged in.",
    },
    resetPassword: {
      success: "New password has been sent.",
      failure: "Unable to send",
    },
    sendVerificationCode: {
      success: "Verification code has been sent",
      failure: "Unable to send verification code at mailing address",
    },
  },
};
module.exports = { messages };
