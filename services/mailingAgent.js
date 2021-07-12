const nodeMailer = require("nodemailer");

let mailClient = new nodeMailer();
var mail = mailClient.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-gmail-password",
  },
});
