let generalEndpoints = require('../models/generalPoints');

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