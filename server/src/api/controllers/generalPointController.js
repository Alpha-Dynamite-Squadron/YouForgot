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
    if(!req.payload.emailAddress || !req.payload.insitutionID){
        res.status(400).json({
            "message" : "Invalid token data"
        });
    }
    else if(!req.body.creationDate){
        res.status(400).json({
            "message" : "CreationDate Required"
        });
    }
    else if(!req.body.nameOfClass){
        res.status(400).json({
            "message" : "nameOfClass Required"
        });
    }
    else if(!req.body.imageID){
        res.status(400).json({
            "message" : "imageID Required"
        });
    }
    else if(!req.body.enrollmentCount){
        res.status(400).json({
            "message" : "enrollmentCount Required"
        });
    }
    else if(!req.body.instructorName){
        res.status(400).json({
            "message" : "instructorName Required"
        });
    }
    else if(!req.body.diciplineLetters){
        res.status(400).json({
            "message" : "nameOfClass Required"
        });
    }
    else if(!req.body.courseNumber){
        res.status(400).json({
            "message" : "courseNumber Required"
        });
    }
    else if(!req.body.academicTerm){
        res.status(400).json({
            "message" : "academicTerm Required"
        });
    }
    else if(!req.body.academicYear){
        res.status(400).json({
            "message" : "academicYear Required"
        });
    }
    else {
        generalEndpoints.createCourse(req.body.creationDate, req.body.nameOfClass, req.body.imageID, req.body.instructorName, 
            req.payload.insitutionID, req.body.diciplineLetters, req.body.courseNumber, req.body.academicTerm,
            req.body.academicYear, req.payload.emailAddress,
            function(err, result){
                if(err){
                    //DB error
                    if(result == 1){
                        console.log("Database error in SectionInstance in trying to insert a class");
                        console.log(err);
                        res.status(500).json({
                            "message" : "Unknown database error"
                        });
                    }
                    else if(result == 2){
                        console.log("Database error when inserting the user who created the course, into UserEnrollment");
                        console.log(err);
                        res.status(500).json({
                            "message" : "Unknown database error"
                        });
                    }
                    else{
                        console.log("Database error in UserEnrollment in trying to insert a user");
                        console.log(err);
                        res.status(500).json({
                            "message" : "Unknown database error"
                        });
                    }
                }
                else{
                    res.status(200).json({
                        "message" : "Created a course and enrolled the user who created the course."
                    });
                }
            });
    }
}



module.exports.createAssignment = function(req,res){
    console.log("Creating an Assignment");
    
}