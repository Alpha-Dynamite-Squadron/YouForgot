let dbPool = require('../models/database');
import nodemailer from 'nodemailer';

export const notificationMailer = () => {
    let queryString = 'SELECT emailAddress, assignmentID FROM PostAssociation WHERE  '
    let emails = [], assIDs = [];

    dbPool.query(queryString,null, function(err, res){
        if(err){
            console.log("Error in trying to get emails to send notifications");
        }
        else {
            //Query results in here
            console.log("Sent notifications for assignments < 24 hours till due date");
            emails = res[0].emailAddress;
            assIDs = res[0].assingmentID;
        }
    });
    // needed to transport emails across the web
    let transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "e490d2f812ae9c",
          pass: "b65fa14ad77a5b"
        }
      });
    //create the emails
    //test the to option, as docs says we can just past in an array
    let mailOptions = {
        from: '"Example Team" <from@example.com>',
        to: emails,
        subject: 'Nice Nodemailer test',
        text: 'Hey there, it’s our first message sent with Nodemailer ;) ', 
        html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer',
    };
    
    //send the emails out
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });

}

export default notificationMailer;