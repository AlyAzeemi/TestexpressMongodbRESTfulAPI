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
        {
          _id: user._id,
          email: user.email,
          username: user.username,
          isEmailVerified: user.isEmailVerified,
          accountType: user.accountType,
        },
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
      return messages.auth.resetPassword.user_not_found;
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
      return messages.auth.sendVerificationCode.user_not_found;
    }
  } catch (e) {
    console.log(`Error sending verification code:${e}`);
    return messages.auth.sendVerificationCode.failure;
  }
}

async function verifyCode(qEmail, qCode) {
  try {
    user = await userSchema.findOne({ email: qEmail });
    if (user) {
      //Check if code matches
      if (user.verificationCode == qCode) {
        user.verificationCode = "";
        user.isEmailVerified = true;

        //ResignToken
        const JWToken = await jwt.sign(
          {
            _id: user._id,
            email: user.email,
            username: user.username,
            isEmailVerified: user.isEmailVerified,
            accountType: user.accountType,
          },
          "secretkey",
          { expiresIn: "1d" }
        );
        user.JWToken = JWToken;

        user.save();
        return { message: messages.auth.verifyCode.success, JWToken: JWToken };
      } else {
        return { message: messages.auth.verifyCode.failure };
      }
    } else {
      throw "Account not found. It should not be possible to trigger this without having logged in so this shouldnt be happening in any case.";
    }
  } catch (e) {
    console.log(`Error verifying code: ${e}`);
    throw e;
  }
}

async function verifyUserByAdmin(qEmailUser, qEmailAdmin) {
  try {
    //Fetch involved accounts
    user = await userSchema.findOne({ email: qEmailUser });
    admin = await userSchema.findOne({ email: qEmailAdmin });

    //Check account types and go through with the process if things check out
    if (admin.accountType == "admin") {
      if (user.accountType == "user") {
        user.verified == true;
        user.save();
        return messages.auth.verifyUserByAdmin.success;
      } else {
        return messages.auth.verifyUserByAdmin.user_not_found;
      }
    } else {
      return messages.auth.verifyUserByAdmin.unauthorized_request;
    }
  } catch (e) {
    console.log(`Error in authService-verifyUserByAdmin: ${e}`);
    throw e;
  }
}

module.exports = {
  login,
  signUp,
  resetPassword,
  sendVerificationCode,
  verifyCode,
};
