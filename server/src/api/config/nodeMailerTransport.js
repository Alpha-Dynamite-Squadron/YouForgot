var emailPassword = process.env.EMAIL_PASSWORD;
const nodemailer = require("nodemailer");

if(emailPassword == undefined) {
  console.log("Email Password Undefined in enviroment `EMAIL_PASSWORD`");
  process.exit(1);
}

module.exports.transport  = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "admin@youforgot.school", // generated ethereal user
      pass: emailPassword, // generated ethereal password
    },
  });
