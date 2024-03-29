const nodemailer = require("nodemailer");

var emailPassword = process.env.EMAIL_PASSWORD;
if(emailPassword == undefined) {
  console.log("Email Password Undefined in enviroment `EMAIL_PASSWORD`");
  process.exit(1);
}

let transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "admin@youforgot.school", // generated ethereal user
      pass: emailPassword, // generated ethereal password
    },
  });

let emailList = ['legonxtjedi@gmail.com'];
let usernameList = ['Christian'];
let classList = ['CS4800'];
let assignmentList = ['Assignment 7'];
for(let i = 0; i < emailList.length; i++) {
  bodyText = "Hello " + usernameList[i] + ",\nYou have an assignment due within 24 hours." + classList[i] + "\nThe Assignment is called " + assignmentList[i] + " Please make sure to check it off here when you are done.\n" + "https://youforgot.school/assignment";
  transporter.sendMail({
    from: '"Kenny Foo 👻" <admin@youforgot.school>', // sender address
    to: emailList[i], // list of receivers
    subject: "You Forgot an Assignment!", // Subject line
    text: bodyText, // plain text body
  });
}
