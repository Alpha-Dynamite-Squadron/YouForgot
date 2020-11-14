let dbPool = require('../models/database');
const uuidv4 = require("uuid/v4")

module.exports.getInstutionCourses = function(institutionID, resultCallback){
    let getCoursesQuery = 'SELECT * FROM SectionInstance WHERE institutionID = ?;';
    dbPool.query(getCoursesQuery, institutionID, function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if (res.length === 1){
            console.log("Courses found");
            let courses = [];
            for(let i = 0; i < res.length; i++){
                let institutionCourse = {
                    sectionInstanceID: res[i].sectionInstanceID,
                    nameOfClass: res[i].nameOfClass,
                    instructorName: res[i].instructorName,
                    disciplineLetters: res[i].disciplineLetters,
                    courseNumber: res[i].courseNumber,
                    courseEnrollment: res[i].enrollmentCount,
                    academicSession: res[i].academicSession,
                    year: res[i].year
                }
                courses.push(institutionCourse);
            }
            resultCallback(null, courses);
        }
        else{
            console.log("No courses found");
            resultCallback(null,null);
        }
    });
}
module.exports.getInsitutions = function(resultCallback){
    let getInsitutionsQuery = 'SELECT * FROM Insitution;';
    dbPool.query(getInsitutionsQuery, function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if (res.length === 1){
            console.log("Courses found.");
            let institutions = [];
            for(let i = 0; i < res.length; i++){
                let instituion = {
                    instituionID: res[i].instituionID,
                    schoolName: res[i].schoolName
                }
                institutions.push(instituion);
            }
            resultCallback(null, institutions);
        } 
        else{
            console.log("No institutions found.");
            resultCallback(null,null);
        }
    });
}

// GET THE INFO OF A SPECIFIC CLASS GIVEN THE SECTION INSTANCE ID
// gives you a assignment ID if you want to subscribe to the assignment, forGrade determines whether or not it shows assignmentAverage
module.exports.getCourseInfo = function(sectionInstanceID, resultCallback){
    let getCourseInfoQuery = 'SELECT SectionInstance.nameOfClass, Post.assignmentID, Post.uploadDate, Post.assignmentName, Post.assignmentDueDate, Post.forGrade, Post.assignmentAverage, Post.iForgotCount FROM SectionInstance INNER JOIN ON Post WHERE SectionInstance.sectionInstanceID = Post.sectionInstanceID;';
    dbPool.query(getCourseInfoQuery, function(err, res){
        if(err){
            console.log(err);
            resultCallback(err,null);
        }
        //sql query ran
        else if (res.length === 1){
            console.log("Assignments found for Course:" + sectionInstanceID);
            let courseAssignments = [];
            for(let i = 0; i < res.length; i++){
                let courseAssignment = {
                    nameOfClass : res[i].nameOfClass,
                    assignmentID: res[i].assignmentID,
                    uploadDate: res[i].uploadDate,
                    assignmentName : res[i].assignmentName,
                    forGrade: res[i].forGrade,
                    iForgotCount: res[i].iForgotCount
                }
                courseAssignments.push(courseAssignment);
            }
            resultCallback(null, courseAssignments);
        }
        else{
            console.log("This section currently has no assignments");
            resultCallback(null,null);
        }
    });
}

// how to creat sectionInstance ID?
//title, disciplineLetters, number,
//Error 1 is a database error saying duplicate entry. This is a db error because this should never happen
// Error 2 is that association between a user and a course failed to create. 
module.exports.createCourse = function(creationDate, nameOfClass, imageID, instructorName,
    institutionID, disciplineLetters, courseNumber, 
    academicTerm, academicYear, userEmail, resultCallback){
    let sectionInstanceID = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    let createCourseQuery = 'INSERT INTO SectionInstance (sectionInstanceID, creationDate, nameOfClass, imageID, instructorName, institutionID, disciplineLetters, courseNumber, academicTerm, academicYear, sectionCreatorEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    dbPool.query(createCourseQuery, [sectionInstanceID, creationDate, nameOfClass, imageID, instructorName, institutionID, disciplineLetters, courseNumber, academicTerm, academicYear, userEmail], function(err, result) {
        if(err) {
            if(err.code === "ER_DUP_ENTRY") {
                resultCallback(null, 1);
            }
            else {
                resultCallback(err, null);
            }
        }
        else{
            console.log("Course " + nameOfClass + " was added to SectionInstance. Now enrolling user "  + userEmail);
            let enrollUserQuery = 'INSERT INTO UserEnrollment (emailAddress, sectionInstanceID) VALUES (?, ?);';
            dbPool.query(enrollUserQuery, [userEmail, sectionInstanceID], function(errorTwo, resTwo){
                if(errorTwo) {
                    if(errorTwo.code === "ER_DUP_ENTRY") {
                        resultCallback(null, 2);
                    }
                    else {
                        resultCallback(err, null);
                    }
                }
            });
            resultCallback(null, null);
        }
    });
}
module.exports.createAssignment = function(req, res){

}


