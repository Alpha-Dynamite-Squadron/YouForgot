let dbPool = require('../models/database');

/*
let createUserQuery = 'UPDATE User SET username = ?, imageID = ?, hash = ?, salt = ?, accessKey = NULL WHERE userEmail = ?;';
                dbPool.query(createUserQuery, [username, imageID, hash, salt, userEmail], function(err, result){
                    if(err){

*/
//will we need to join here for userenrollment and sectioninstance ID, what will nick need
module.exports.getUserCourses = function(userEmail, resultCallback) {
    let getUserCourserQuery = 'SELECT * FROM UserEnrollment INNER JOIN SectionInstance ON UserEnrollment.sectionInstanceID = SectionInstance.sectionInstanceID WHERE UserEnrollment.emailAddress = ?;';
    dbPool.query(getUserCourserQuery, userEmail, function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if(res.length === 1){
            console.log("Found Courses for user" + userEmail + ". Course names");
            let userCourses = {
                userEmail: userEmail,
                nameOfClass: res[0].nameOfClass,
                instructorName: res[0].instructorName,
                disciplineLetters: res[0].disciplineLetters,
                courseNumber: res[0].courseNumber,
                academicSection: res[0].academicSection
            }
            resultCallback(null, userCourses);
        }
        else{
            console.log("This user does not have any courses:" + userEmail);
            resultCallback(null,null);
        }

    });
    
}

//select request on postAssociation table
module.exports.getUserAssignments = function(userEmail, resultCallback){
    //if isIgnored is 0, then its not ignored else if its 1 its ignored
    let getAssignmentsQuery = 'SELECT customAssignmentName, customAssignmentDescription, customeDueDate FROM PostAssociation WHERE userEmail = ? AND isIgnored = 0;';
    dbPool.query(getAssignmentsQuery, userEmail, function(err, res){
        if(err) {
            resultCallback(err, null);
        }
        // worked properly
        else if(res.length === 1) {
            console.log("Found Assignments for user: " + userEmail + "Assingments Names:  " + res[0].customAssignmentDescription);
            let userAssignments = {
                userEmail: userEmail,
                assignmentDescriptions: res[0].customAssignmentDescription,
                assignmentNames: res[0].customAssignmentName,
                dueDates: res[0].customDueDate
            }
            resultCallback(null, userAssignments);
        }
        else {
            console.log("No Assignments Found for:  " + userEmail);
            resultCallback(null, null);
        }
    });

}

module.exports.getAllCoures = function(req, res){

}

module.exports.createAssignment = function(req, res){

}

module.exports.createCourse = function(req,res){

}
