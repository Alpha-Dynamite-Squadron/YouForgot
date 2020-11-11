let endpoints = require('../models/userEndPoints');
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
 First use a select query to find all sectionInstance IDS that are tied to a user
 Given those sectionInstance IDs, we then do a select query on the sectionInstance ID to get the information of every individual course
 then send back that infromation like nameOfClass, etc
 We return the semester, course name, teacher name, imageID
*/
module.exports.getUserCourses = function(req, res){
    console.log("Fetching the user's courses.");
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "Token does not contain an email address"
        });
    }
    else{
        //we have a valid emailAddress
        endpoints.getUserCourses(req.payload.emailAddress, function(err,data){
            if(err){
                console.log("We have an issue at endpoints.js(getUserCourses) in models");
                res.status(500).json({
                    "message" : "Unknown database error"
                });
            }
            //we have data
            else if(data){
                if(err){
                    
                }
                //we have incomplete data
                else{
                    res.status(422).json({
                        "message" : "Incomplete data found for that user's email"
                    });
                }
            }

        });
    }
}

// get ALL OF THE USERS ASSINGMENTS
// 0 Success
// 1 No Assignments Found
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
            //no error, but there is data meaning we did get data from the query
            else if(data){
                //if we have all parameters needed we return a 200 with the object
                if(data.emailAddress !== undefined && data.assignmentDescriptions !== undefined && assignmentNames !== undefined && dueDates !== undefined){
                    console.log("Query Successful, we have found the assignments for")
                    //sends the json object with the results from the querry
                    res.status(200).json(data);
                } 
                // incomplete date for the given email
                else{
                    res.status(422).json({
                        "message" : "Incomplete data found for that user's email"
                    });
                }
            }
            //error and data is null here meaning no assignments found
            else {
            // EMAIL IS FOUND BUT NO ROWS
                 res.status(404).json({
                     "message" : "Email was valid, but user has no assignments"
                 });
            }
        });
    }
}

// get the assingments for a course
module.exports.getUserCourseAssignments = function(req, res){
    console.log("Fetching all the assingments for  course");
    if(!req.body.token){
        res.status(401).json({
            "message" : "no user token provided"
        });
    }
    else {
        endpoints.getCourseAssignments
            
        
    }
}


/*
Get AVG grade/ get # of upvotes
Join PostASsociation on Posts where assingmnetID == AssignmentID
Then do a count on the upvotes and an avg on the grade
*/