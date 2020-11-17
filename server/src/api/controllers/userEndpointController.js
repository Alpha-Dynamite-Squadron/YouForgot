let endpoints = require('../models/userEndpoints');
/*
Json Web token from users for reference for what information we have to use.
let funcGenerateJwt = function() {
    let expiry = new Date(); //the current date
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
      emailAddress: this.emailAddress,
      username: this.username,
      imageID: this.imageID,
      getPostReminderNotifications: this.getPostReminderNotifications,
      getHomeworkReminderNotifications: this.getHomeworkReminderNotifications,
      exp: parseInt(expiry.getTime() / 1000)
    }, secretString);
};
*/

/*
THIS GETS ALL THE COURSES A USER IS ENROLLED IN

 First use a select query to find all sectionInstance IDS that are tied to a user
 Given those sectionInstance IDs, we then do a select query on the sectionInstance ID to get the information of every individual course
 then send back that infromation like nameOfClass, etc
 We return the semester, course name, teacher name, imageID
*/
//tested
module.exports.getUserCourses = function(req, res){
    console.log("Fetching the user's courses.");
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "invalid token data"
        });
    }
    else{
        //we have a valid emailAddress
        endpoints.getUserCourses(req.payload.emailAddress, function(err,data){
            //db error
            if(err){
                console.log("We have an issue at endpoints.js(getUserCourses) in models");
                res.status(500).json({
                    "message" : "Unknown database error"
                });
            }
            //we have data
            else if(data){
                res.status(200).json(data);
            }
            // no courses found for that user
            else {
                res.status(404).json({
                    "message" : "This user does not have any courses."
                });
            }
        });
    }
}

// get ALL OF THE USERS ASSINGMENTS
// Null DB error
module.exports.getUserAssignments = function(req, res){
    console.log("Fetching the user's assignments.");
    //if no token is provided, we can't get their courses
    //do we need to check email address
    // req.payload.emailAddress 
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else{
        //we have a valid email address
        endpoints.getUserCourses(req.payload.emailAddress, function(err,data){
            console.log("Fetching all the courses for user: " + req.payload.emailAddress);
            if(err){
                //DB error
                if(data == null){
                    console.log("Database error in PostAssociation getUserAssignments Query");
                    console.log(err);
                    res.status(500).json({
                        "message" : "Unknown database error"
                    });
                }
            }
            //assume all the data is alright in the field
            else if(data){
                res.status(200).json(data);
            }
            else {
                res.status(404).json({
                    "message" : "No Courses were found for the requested user."
                });
            }
        });
    }
}

//tested
module.exports.getUserInfo = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "invalid token data"
        });
    }
    else{
        endpoints.getUserInfo(req.payload.emailAddress, function(err, data){
            if(err){
                console.log("There was an issue grabbing the user data for the email provided");
                res.status(500).json({
                    "message" : "Unknown database error"
                });
            }
            else if(data){
                res.status(500).json(data);
            }
             // no courses found for that user
             else {
                res.status(404).json({
                    "message" : "This user does not exist"
                });
            }
        });
    }
}

//TESTED
//sectioninstanceID from body, email adress from token
//Error 1 is from enrolling the user into a class
//Error 2 is doing the select query on Post to get all Posts for that class
//Error 3 is There are no Posts for that sectonInstanceID
//Error 4 is There is an error creating post associations for the user who just enrolled into a class
//Error 5 is There is a duplicate entry when inserting post associations for the user who just enrolled in the class
module.exports.userEnroll = function(req, res){
    //check incoming params
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.payload.getPostReminderNotifications){
        res.status(400).json({
            "message" : "You need to pass in a whether or not the user wants reminder notifications for this course, using defaultGetReminderNotifications."
        });
    }
    else if(!req.body.sectionInstanceID){
        res.status(400).json({
            "message" : "You need to pass in a sectionInstanceID."
        });
    }
    //params are verified there is something there
    else {
        //we have no data so we just get a result
        console.log("enrolling user into a course with an email of: " + req.payload.emailAddress);
        endpoints.userEnroll(req.payload.emailAddress, req.body.sectionInstanceID, req.payload.getPostReminderNotifications, function(err, result){
            if(err){
                if(result == 1){
                    console.log("Database error in UserEnrollment, trying to enroll a user that has been enrolled");
                    console.log(err);
                    res.status(500).json({
                        "message" : "Database error in UserEnrollment, trying to enroll a user that has been enrolled"
                    });
                }
                else if(result == 2){
                    console.log("Error doing the select query on Post to get all Posts for that class");
                    console.log(err);
                    res.status(500).json({
                        "message" : "Error in the select query on Post."
                    });
                }
                else if(result == 3){
                    console.log("There are no Posts for that sectonInstanceID");
                    console.log(err);
                    res.status(500).json({
                        "message" : "No Posts for the given sectionInstanceID."
                    });
                }
                else if(result == 4){
                    console.log("There is an error creating post associations for the user who just enrolled into a class");
                    console.log(err);
                    res.status(500).json({
                        "message" : "Error creating Post Associations for that user"
                    });
                }
                else if(result == 5){
                    console.log("There is a duplicate entry when inserting post associations for the user who just enrolled in the class");
                    res.status(500).end();
                }
                else{
                    console.log();
                    console.log(err);
                    res.status(500).json({
                        "message" : "Unknown database error"
                    });
                }
            }
            //dont have data so result is in here
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

module.exports.updateExcessiveNotifications = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.body.notificationStatus){
        res.status(401).json({
            "message" : "Notification status not provided"
        });
    }
    else{
        endpoints.updateExcessiveNotifications(req.payload.emailAddress, req.body.notificationStatus, function(err, result){
            if(err){
                console.log("Unable to update users excessive notification status");
                res.status(500).json({
                    "message" : "Unable to update user excessive notification status"
                });
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

module.exports.updateAssignmentDeadlineNotifications = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.body.notificationStatus){
        res.status(401).json({
            "message" : "Notification status not provided"
        });
    }
    else{
        endpoints.updateAssignmentDeadlineNotifications(req.payload.emailAddress, req.body.notificationStatus, function(err, result){
            if(err){
                console.log("Unable to update users assignment deadline notification status");
                res.status(500).json({
                    "message" : "Unable to update user assignment deadline notification status"
                });
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

module.exports.updateAssignmentGrade = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.body.gradeRecieved){
        res.status(401).json({
            "message" : "Grade recieved not provided"
        });
    }
    else  if(!req.body.assignmentID){
        res.status(401).json({
            "message" : "assignmentID not provied"
        });
    }
    else{
        endpoints.updateAssignmentGrade(req.payload.emailAddress, req.body.gradeRecieved, req.body.assignmentID, function(err, result){
            if(err){
                console.log("Unable to update user's assignment assignment grade.");
                res.status(500).json({
                    "message" : "Unable to update user's assignment grade"
                });
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

module.exports.updatePostNotifications = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.body.notificationStatus){
        res.status(401).json({
            "message" : "Notification status not provided"
        });
    }
    else{
        endpoints.updatePostNotifications(req.payload.emailAddress, req.body.notificationStatus, function(err, result){
            if(err){
                console.log("Unable to update users assignment notification status");
                res.status(500).json({
                    "message" : "Unable to update user assignment notification status"
                });
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

module.exports.updateIsDone = function(req, res){
    console.log("Attempting to update isDone status for user assignment.");
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "Invalid token data"
        });
    }
    else if(!req.body.assignmentID){
        res.status(400).json({
            "message" : "Assignment ID required."
        });
    }
    else{
        endpoints.updateIsDone(req.payload.emailAddress, req.body.assignmentID, function(err, result){
            if(err){
                if(result == 1){
                    console.log("Database error occurred selecting");
                    res.status(500).json({
                        "message" : "Unknown database error occurred"
                    });
                }
                else if(result == 2){
                    console.log("Database error occurred updating");
                    res.status(500).json({
                        "message" : "Unknown database error occurred"
                    });
                }
                else{
                    res.status(500).json({
                        "message" : "Unknown database error occurred"
                    });
                }
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

module.exports.updateIForgot = function(req, res){
    console.log("Attempting to update iForgot status for a particular user on a particular assignment");
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "Invalid token data"
        });
    }
    else if(!req.body.assignmentID){
        res.status(400).json({
            "message" : "Assignment ID required."
        });
    }
    else{
        endpoints.updateIForgot(req.payload.emailAddress, req.body.assignmentID, function(err, result){
            if(err){
                if(result == 1){
                    console.log("Database error occurred selecting");
                    res.status(500).json({
                        "message" : "Database error occurred on selecting"
                    });
                }
                else if(result == 2){
                    console.log("Database error occurred updating");
                    res.status(500).json({
                        "message" : "Database error occurred on updating"
                    });
                }
                else{
                    res.status(500).json({
                        "message" : "Unknown database error occurred"
                    });
                }
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
    
}

module.exports.updateIsIgnored= function(req, res){
    console.log("Attempting to update isIgnored status for a particular user on a particular assignment");
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "Invalid token data"
        });
    }
    else if(!req.body.assignmentID){
        res.status(400).json({
            "message" : "Assignment ID required."
        });
    }
    else{
        endpoints.updateIsIgnored(req.payload.emailAddress, req.body.assignmentID, function(err, result){
            if(err){
                if(result == 1){
                    console.log("Database error occurred selecting");
                    res.status(500).json({
                        "message" : "Database error occurred on selecting"
                    });
                }
                else if(result == 2){
                    console.log("Database error occurred updating");
                    res.status(500).json({
                        "message" : "Database error occurred on updating"
                    });
                }
                else{
                    res.status(500).json({
                        "message" : "Unknown database error occurred"
                    });
                }
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
    
}

//Code 1 No Post associated to unenrolled user
//Code 2 Error in Select query to get Posts associated with the unenrolled user
//Code 3 Error in delete Post Associations for the unenrolled user

module.exports.unenroll = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.body.sectionInstanceID){
        res.status(401).json({
            "message" : "Section Instance ID must be provided."
        });
    }
    else{
        endpoints.unenroll(req.payload.emailAddress, req.body.sectionInstanceID, function(err, result){
            if(err){
                if(result == 1){
                    console.log("No Post associated to the unenrolled user");
                }
                console.log("Error trying to unenroll a user");
                res.status(500).json({
                    "message" : "Error trying to unenroll a user"
                });
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}

//tested
module.exports.deleteAccount = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else{
        endpoints.deleteAccount(req.payload.emailAddress,function(err, result){
            if(err){
                console.log("Error trying to delete a user");
                res.status(500).json({
                    "message" : "Error trying to delete user account"
                });
            }
            else{
                res.status(200).end(); // successfully updated 
            }
        });
    }
}
