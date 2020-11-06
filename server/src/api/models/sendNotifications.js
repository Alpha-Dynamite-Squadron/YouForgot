let dbPool = require('../models/database');
let nodeMailerTransporter = require('../config/nodeMailerTransport.js')

module.exports.sendNotification = function() {
    //SELECT pa.emailAddress, pa.assignmentID, sec.nameOfClass
    // FROM PostAssociation AS pa INNER JOIN Post as po ON pa.assingmentID = po.assignmentID INNER JOIN ON SectionInstance as sec 
    // SELECT pa.emailAddress, pa.assignmentID, sec.nameOfClass FROM PostAssociation AS pa INNER JOIN Post as po ON pa.assingmentID = po.assignmentID INNER JOIN ON SectionInstance AS sec ON po.sectionInstance = sec.sectionInstanceID WHERE pa.customDueDate < (NOW() - INTERVAL 1 DAY)
    // 0 means it has not been sent

    let queryString = 'SELECT pa.emailAddress, pa.assignmentID, pa.customAssignmentName, u.username  FROM PostAssociation AS pa INNER JOIN User as u ON pa.emailAddress = user.emailAddress WHERE pa.customDueDate < (NOW() - INTERVAL 1 DAY  AND pa.sentNotification == 0';
    let emails = [], assignments = [], assingmentIDs = [], usernames = []; 

    dbPool.query(queryString,null, function(err, res){
        if(err){
            console.log("Error in trying to get emails to send notifications");
        }
        else {
            //Query results in here
            console.log("Sent notifications for assignments < 24 hours till due date");
            emails = res[0].emailAddress;
            assignments= res[0].customAssignmentName;
            assignmentIDs = res[0].assignmentID;
            usernames = res[0].username;
        }
    });

    //create the emails
    //test the to option, as docs says we can just past in an array
    for(let i = 0; i < emails.length; i++) {
      bodyText = "Hello " + usernames[i] + ",\nYou have an assignment due within 24 hours. \nThe Assignment is called " + assignments[i] + " Please make sure to check it off here when you are done.\n" + "https://youforgot.school/assignment";
      nodeMailerTransporter.sendMail({
        from: '"Kenny Foo 👻" <admin@youforgot.school>', // sender address
        to: emails[i], // list of receivers
        subject: "You Forgot an Assignment!", // Subject line
        text: bodyText, // plain text body
      });
    }
    // n * m query
    //update after sending
    for(let i = 0; i < emails.length; i++){
       // 1 means we have sent the email
      queryString = "UPDATE PostAssociation SET sentNotification = 1 WHERE assignmentID =" + assignments[i] +" AND emailAddress =" + emails[i] ;
      dbPool.query(queryString,null, function(err, res){
        if(err){
            console.log("Error updating email sent notification, after sending the notification");
        }
        else {
            //Query results in here
            console.log("Updated email notifications");
        }
      });
    }
   
  }

  


