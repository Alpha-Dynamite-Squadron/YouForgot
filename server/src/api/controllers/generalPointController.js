let generalEndpoints = require('../models/generalPoints');

//get info on a course like assignments, etc
//takes in the parameter of a sectionID instance
module.exports.getCourseInfo = function(req,res){

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

// given an institution id this is returns all of the courses
// for the given insitution. 
module.exports.getInstitutionCourses = function(req, res){
    if(!req.body.insitutionID) {
        res.status(400).json({
          "message" : "Institution ID required"
        });
    }
    else{
        generalEndpoints.getInstutionCoures(req.body.insitutionID, function(err, data){     
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
                    "message" : "No Courses were found for this institution"
                });
            }
        });
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

