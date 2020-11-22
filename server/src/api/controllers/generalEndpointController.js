let generalEndpoints = require('../models/generalEndpoints');


// WE TAKE IN A SECTIONID WHEN A USER CLICKS A HYPERLINK IN THEIR MY COURSES SECTION TO GO THEIR COURSE
// THIS DISPLAYS ALL THE INFO OF A SPECIFIC COURSE INCLUDING ASSIGMNETS
//tested
module.exports.getCourseAssignments = function(req,res){
    if(!req.body.sectionInstanceID){
        res.status(400).json({
            "message" : "Section Instance ID Required"
          });
    }
    else {
        generalEndpoints.getCourseAssignments(req.body.sectionInstanceID, function(err,data){
            console.log("Fetching all information for this course: " + req.body.sectionInstanceID);
            if(err){
                //DB error
                if(data == null){
                    res.status(400).json({
                        "message" : "No data found for the given section instance. This section may not exist"
                      });
                }
            }
            else {
                res.status(200).json(data);
            }
        });
    }
}


module.exports.getCourseName = function(req,res){
  if(!req.body.sectionInstanceID){
      res.status(400).json({
          "message" : "Section Instance ID Required"
        });
  }
  else {
      generalEndpoints.getCourseName(req.body.sectionInstanceID, function(err,data){
          if(err){
              //DB error
              if(data == null){
                  res.status(500).json({
                      "message" : "Internal DB Error"
                    });
              }
          }
          else if(data){
              res.status(200).json(data);
          }
          else{
              res.status(401).json({
                  "message" : "SectionInstanceID does not exists"
              });
          }
      });
  }
}

// given an institution id this is returns all of the courses
// for the given institution.
//tested
module.exports.getInstitutionCourses = function(req, res){
    console.log(req.payload);
    if(!req.payload.institutionID) {
        res.status(400).json({
          "message" : "Institution ID required"
        });
    }
    else{
        console.log("Fetching all the courses for school: " + req.payload.institutionID);
        generalEndpoints.getInstitutionCourses(req.payload.institutionID, function(err, data){
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
            else {
                res.status(200).json(data);
            }
        });
    }
}

// get all the institutions in the table Insitutions.
// tested
module.exports.getInstitutions = function(req, res){
    if(!req.body.institution){
        res.status(400).json({
            "message" : "institution Required"
        });
    }
    console.log("Fetching institutions like '" + req.body.institution + "'");
    generalEndpoints.getInstitutions(req.body.institution, function(err, data){
        if(err){
            //DB error
            console.log("Database error in Get Institution Query", err);
            res.status(500).json({
                "message" : "Unknown database error"
            });
        }
        //assume all the data is alright in the field
        else if(data){
            res.status(200).json(data);
        }
        else {
            res.status(404).json({
                "message" : "No institutions found"
            });
        }
    });
}

// This is to create a course
// course requires
//TESTED
module.exports.createCourse = function(req,res){
    console.log("Creating a course called " + req.body.nameOfClass);
    if(!req.payload.emailAddress || !req.payload.institutionID){
        res.status(400).json({
            "message" : "Invalid token data"
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
    else if(!req.body.instructorName){
        res.status(400).json({
            "message" : "instructorName Required"
        });
    }
    else if(!req.body.disciplineLetters){
        res.status(400).json({
            "message" : "disciplineLetters Required"
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
    else if(!req.body.sectionNumber){
        res.status(400).json({
            "message" : "sectionNumber Required"
        });
    }
    else {
        generalEndpoints.createCourse(req.body.nameOfClass, req.body.imageID, req.body.instructorName,
            req.payload.institutionID, req.body.disciplineLetters, req.body.courseNumber, req.body.academicTerm,
            req.body.academicYear, req.body.sectionNumber, req.payload.emailAddress,
            function(err, result){
                if(err){
                    //DB error
                    if(result == 1){
                        console.log("Database error in UserEnrollment, trying to enroll a student.");
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
                    res.status(200).end();
                }
            });
    }
}

//tested
module.exports.createAssignment = function(req, res){
    console.log("Attempting to create an assignment.");
    if(!req.payload.emailAddress){
        res.status(401).json({
            "message" : "Invalid token data"
        });
    }
    else if(!req.body.sectionInstanceID){
        res.status(400).json({
            "message" : "No sectionInstanceID provided."
        });
    }
    else if(!req.body.assignmentName){
        res.status(400).json({
            "message" : "No assignment name provided."
        });
    }
    else if(req.body.forGrade == null){
        res.status(400).json({
            "message" : "forGrade not provided."
        });
    }
    else if(!req.body.assignmentDueDate){
        res.status(400).json({
            "message" : "No assignment due date provided."
        });
    }
    else{
        generalEndpoints.createAssignment(req.payload.emailAddress, req.body.assignmentName, req.body.assignmentDueDate,
            req.body.forGrade, req.body.sectionInstanceID, function(err, result){
                if(err){
                    console.log(err);
                    if(result == 1){
                        console.log(err);
                        console.log("There was a duplicate entry for an assignment.");
                        res.status(500).json({
                            "message" : "Duplicate Entry for an assignment."
                        });
                    }
                    else if(result == 2){
                        console.log("There are no classmates in this course.");
                        res.status(500).json({
                            "message" : "There are no classmates in this course"
                        });

                    }
                    else if(result == 3){
                        console.log("There is an error in the Select Query where we try to find classmates");
                        res.status(500).json({
                            "message" : "There is an error in the Select Query where we try to find classmates"
                        });
                    }
                    else if(result == 4){
                        console.log("There is a duplicate in creating Post associations for the classmates.");
                        res.status(500).json({
                            "message" : "There is a duplicate in creating Post associations for the classmates."
                        });
                    }
                    else if(result == 5){
                        console.log("");
                        res.status(500).json({
                            "message" : "There is an unknown DB error when creating Post Associations for the classmates. "
                        });
                    }
                    else if(result == 6){
                        console.log("");
                        res.status(500).json({
                            "message" : "There is an issue with the select query when trying to find the course name for the email notifications. "
                        });
                    }
                    else{
                        res.status(500).json({
                            "message" : "Unknown database error"
                        });
                    }
                }
                else{
                    if(result == 7){
                        console.log("");
                        res.status(500).json({
                            "message" : "The nameOfClass select statement is empty, which should never happen. "
                        });
                    }
                    console.log("Assignment association created");
                    res.status(200).end();
                }
            });
    }
}
