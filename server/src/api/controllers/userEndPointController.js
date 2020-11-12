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
            //db error
            if(err){
                console.log("We have an issue at endpoints.js(getUserCourses) in models");
                res.status(500).json({
                    "message" : "Unknown database error"
                });
            }
            //we have data
            else if(data){
                if(data.userEmail !== undefined && data.nameOfClass !== undefined && data.instructorName !== undefined && data.disciplineLetters !== undefined && data.courseNumber !== undefined && data.academicSession !== undefined){
                    res.status(200).json(data);            
                }
                //we have incomplete data
                else{
                    res.status(422).json({
                        "message" : "Incomplete data found for that user's email"
                    });
                }
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
            console.log("Fetching all the courses for school: " + req.body.insitutionID);
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
            else if(data.length > 0){
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