var mailClient = require("nodemailer");
const { serviceEmailAccount } = require("../secrets.json");

var mail = mailClient.createTransport({
  service: "gmail",
  auth: {
    user: serviceEmailAccount.email,
    pass: serviceEmailAccount.password,
  },
});

async function sendVerificationCode(targetEmail, username) {
  try {
    const codeLength = 4;
    let verificationCode = Math.floor(Math.random() * Math.pow(10, codeLength));
    let mailOptions = {
      from: serviceEmailAccount.email,
      to: targetEmail,
      subject: "Verification Code",
      text: `Hi ${username}! Your verification code is ${verificationCode}.Enter this code in our website to activate your account.`,
    };
    res = await mail.sendMail(mailOptions);
    console.log(res);
    return true;
  } catch (e) {
    console.log(`mailingAgent failed to send verification code: ${e}`);
    return false;
  }
}

async function sendNewPassword(targetEmail, username, newPassword) {
  try {
    let mailOptions = {
      from: serviceEmailAccount.email,
      to: targetEmail,
      subject: "New Password",
      text: `Hi ${username}! Your password has been reset to ${newPassword}.Login and go to Settings->Account->Change Password in order to change your password to something more personalized.`,
    };
    res = await mail.sendMail(mailOptions);
    console.log(res);
    return true;
  } catch (e) {
    console.log(`mailingAgent failed to send new password: ${e}`);
    return false;
  }
}

module.exports = { sendVerificationCode };
