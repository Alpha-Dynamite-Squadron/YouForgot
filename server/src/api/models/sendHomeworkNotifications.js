let dbPool = require('./database');
let nodeMailerTransporter = require('../config/nodeMailerTransport.js');

const sendNotification = () =>  {
  
    let queryString = 'SELECT pa.emailAddress, pa.assignmentID, pa.customAssignmentName, u.username  FROM PostAssociation AS pa INNER JOIN User as u ON pa.emailAddress = u.emailAddress WHERE u.getHomeworkReminderNotifications = 1 AND pa.customDueDate BETWEEN now() AND (now() + INTERVAL 1 DAY)  AND (pa.sentNotification = 0  OR u.sendExcessively = 1) AND isDone = 0  AND pa.isIgnored = 0;';
    let emails = [], assignments = [], assingmentIDs = [], usernames = []; 
    dbPool.query(queryString,null, function(err, res){
        if(err){
            console.log("Error in trying to get emails to send notifications");
        }
        else if (res.length !== 0){
            //Query results in here
            console.log("Sent notifications for assignments < 24 hours till due date");
            for(let i = 0; i < res.length; i++){
                emails.push(res[i].emailAddress);
                assignments.push(res[i].customAssignmentName);
                assingmentIDs.push(res[i].assignmentID);
                usernames.push(res[i].username);
            }
            for(let i = 0; i < emails.length; i++) {
              bodyText = "Hello " + usernames[i] + ",\nYou have an assignment due within 24 hours. \nThe Assignment is called " + assignments[i] + " Please make sure to check it off here when you are done.\n" + "https://youforgot.school/assignment";
              nodeMailerTransporter.sendMail({
                from: '"Kenny Foo 👻" <admin@youforgot.school>', // sender address
                to: emails[i], // list of receivers
                subject: "You Forgot an Assignment!", // Subject line
                text: bodyText, // plain text body
              }, function(err, info){
                if(err){
                  console.log(err);
                }else{
                  console.log(info);
                }

              });
            }
            for(let i = 0; i < emails.length; i++){
              queryString = 'UPDATE PostAssociation SET sentNotification = 1 WHERE assignmentID = ?  AND emailAddress = ?;';
              dbPool.query(queryString, [assingmentIDs[i], emails[i]], function(error, result){
                if(error){
                  console.log(err);
                  console.log("Error updating email sent notification, after sending the notification");
                }
                else {
                    //Query results in here
                    console.log("Updated email notifications");
                }
              });
            }
        }
        else{
          console.log("There are no people with assignments due within 24 hours.");
        }
    });
  }

exports.sendNotification = sendNotification;


