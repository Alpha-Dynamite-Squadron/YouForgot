let endpoints = require('../models/endpoints');
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
    if(!req.body.token){
        res.status(401).json({
            "message" : "no user token provided"
        });
    }
    else{
        endpoints.getUserCourses(req.body.token, function(err,code){

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
    if(!req.payload){
        res.status(401).json({
            "message" : "no user token provided"
        });
    }
    else{
        //we have token
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
module.exports.getCourseAssignments = function(req, res){
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

// get all possible courses
module.exports.getAllCourses = function(req, res){
    console.log("Fetching all possible courses");
    if(!req.params){
        res.send("Params Empty!");
    }
    else { 
        endpoints.getAllCourses()
    }
}


//create an assingment for a class
module.exports.createAssignment = function(req, res){
    console.log("Creating Assingment");
    if(!req.params){
        res.send("Params Empty!");
    }
    else {
        
    }

}
// This is to create a course
module.exports.createCourse = function(req,res){
    console.log("Fetching all the assingments for  course");
    if(!req.params){
        res.send("Params Empty!");
    }
    else {

    }

}

/*
Get AVG grade/ get # of upvotes
Join PostASsociation on Posts where assingmnetID == AssignmentID
Then do a count on the upvotes and an avg on the grade
*/