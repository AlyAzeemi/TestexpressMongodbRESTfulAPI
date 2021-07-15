messages = {
  auth: {
    validationChecks: {
      invalid_email: "Invalid email address",
      passwords_do_not_match: "Passwords don't match",
    },
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
      user_not_found: "Email not registered.",
      failure: "Unable to send",
    },
    sendVerificationCode: {
      success: "Verification code has been sent",
      user_not_found: "Email not registered.",
      failure: "Unable to send verification code at mailing address",
    },
    verifyCode: {
      success: "Email has been verified",
      failure: "Incorrect submission",
    },
    verifyUserByAdmin: {
      success: "Account had been verified ✓",
      user_not_found: "Target account not found",
      unauthorized_request: "403 Admin privilege required.",
    },
  },
};
module.exports = { messages };
