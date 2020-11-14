let generalEndpoints = require('../models/generalPoints');


// WE TAKE IN A SECTIONID WHEN A USER CLICKS A HYPERLINK IN THEIR MY COURSES SECTION TO GO THEIR COURSE
// THIS DISPLAYS ALL THE INFO OF A SPECIFIC COURSE INCLUDING ASSIGMNETS
module.exports.getCourseInfo = function(req,res){
    if(!req.body.sectionInstanceID){
        res.status(400).json({
            "message" : "Section Instance ID Required"
          });
    }
    else {
        generalEndpoints.getCourseInfo(req.body.sectionInstanceID, function(err,data){
            console.log("Fetching all information for this course: " + req.body.sectionInstanceID);
            if(err){
                //DB error
                if(data == null){
                    res.status(400).json({
                        "message" : "Section Instance ID required"
                      });
                }
            }
            else if(data.length > 0){
                res.status(200).json(data);
            }
            //this section has no assignemnts
            else{
                res.status(404).json({
                    "message" : "This course does not have any assignments"
                });
            }
        });
    }
}



// given an institution id this is returns all of the courses
// for the given insitution. 
module.exports.getInstitutionCourses = function(req, res){
    if(!req.payload.insitutionID) {
        res.status(400).json({
          "message" : "Institution ID required"
        });
    }
    else{
        generalEndpoints.getInstutionCourses(req.payload.insitutionID, function(err, data){     
            console.log("Fetching all the courses for school: " + req.payload.insitutionID);
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
// get all the insitutions in the table Insitutions.
module.exports.getInstitutions = function(req, res){
    generalEndpoints.getInstutions(function(err, data){     
        console.log("Fetching all instituions");
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
                "message" : "No insitutions found"
            });
        }
    }); 
}



module.exports.createAssignment = function(req, res){
    console.log("Creating Assingment");
    if(!req.params){
        res.send("Params Empty!");
    }
    else {
        
    }

}
// This is to create a course
// course requires 
module.exports.createCourse = function(req,res){
    console.log("Fetching all the assingments for  course");
    if(!req.params){
        res.send("Params Empty!");
    }
    else {

    }

}


