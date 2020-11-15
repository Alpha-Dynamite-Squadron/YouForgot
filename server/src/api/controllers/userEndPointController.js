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

//sectioninstanceID from body, email adress from token
module.exports.userEnroll = function(req, res){
    console.log("Enrolling user into a course");
    //check incoming params
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "User Token does not have an email"
        });
    }
    else if(!req.body.sectionInstanceID){
        res.status(401).json({
            "message" : "You need to pass in a sectionInstanceID."
        });
    }
    else if(!req.body.defaultGetReminderNotifications){
        res.status(401).json({
            "message" : "You need to pass in a whether or not the user wants reminder notifications for this course, using defaultGetReminderNotifications."
        });
    }
    //params are verified there is something there
    else {
        //we have no data so we just get a result
        endpoints.userEnroll(req.payload.emailAddress, req.body.sectionInstanceID, req.body.defaultGetReminderNotifications, function(err, result){
            console.log("enrolling user into a course with an email of: " + req.payload.emailAddress);
            if(err){
                if(result == 1){
                    console.log("Database error in UserEnrollment, trying to enroll a user that has been enrolled");
                    console.log(err);
                    res.status(500).json({
                        "message" : "Database error in UserEnrollment, trying to enroll a user that has been enrolled"
                    });
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
                res.status(200).json({
                    "message" : "User enrolled into the course."
                })
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
                })
            }
            else{
                res.status(200).json({
                    "message" : "Excessive notification updated."
                })
            }
        });
    }
}








/*
Get AVG grade/ get # of upvotes
Join PostASsociation on Posts where assingmnetID == AssignmentID
Then do a count on the upvotes and an avg on the grade
*/

/*
module.exports.getUserInstitution = function(req, res){
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "Token does not contain an email address"
        });   
    }
 
    else {
        //we have a valid email and institution ID
        endpoints.getUserInstitution

    }

}

*/