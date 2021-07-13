var mailClient = require("nodemailer");
const { serviceEmailAccount } = require("../secrets.json");
var id = 0;

var mail = mailClient.createTransport({
  service: "gmail",
  auth: {
    user: serviceEmailAccount.email,
    pass: serviceEmailAccount.password,
  },
});

async function sendVerificationCode(targetEmail, username, verificationCode) {
  try {
    let mailOptions = {
      from: serviceEmailAccount.email,
      to: targetEmail,
      subject: "Verification Code",
      text: `Hi ${username}! Your verification code is ${verificationCode}.Enter this code in our website to activate your account.`,
      dsn: {
        id: id,
        return: "headers",
        notify: ["failure", "delay"],
        recipient: serviceEmailAccount.email,
      },
    };
    id++;
    res = await mail.sendMail(mailOptions);

    console.log(res);
    return true;
  } catch (e) {
    console.log(`mailingAgent failed to send verification code: ${e}`);
    return false;
  }
}

async function sendNewPassword(targetEmail, username, plainTextNewPassword) {
  try {
    let mailOptions = {
      from: serviceEmailAccount.email,
      to: targetEmail,
      subject: "New Password",
      text: `Hi ${username}! Your password has been reset to ${plainTextNewPassword}.Login and go to Settings->Account->Change Password in order to change your password to something more personalized.`,
      dsn: {
        id: id,
        return: "headers",
        notify: ["failure", "delay"],
        recipient: serviceEmailAccount.email,
      },
    };
    id++;
    res = await mail.sendMail(mailOptions);
    console.log(res);
  } catch (e) {
    console.log(`mailingAgent failed to send new password: ${e}`);
    throw e;
  }
}

module.exports = { sendVerificationCode, sendNewPassword };
