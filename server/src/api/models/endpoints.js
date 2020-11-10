let dbPool = require('../models/database');

/*
let createUserQuery = 'UPDATE User SET username = ?, imageID = ?, hash = ?, salt = ?, accessKey = NULL WHERE emailAddress = ?;';
                dbPool.query(createUserQuery, [username, imageID, hash, salt, emailAddress], function(err, result){
                    if(err){

*/
//will we need to join here for userenrollment and sectioninstance ID, what will nick need
module.exports.getUserCourses = function(req, res) {

    
}

//select request on postAssociation table
module.exports.getUserAssignments = function(userEmail, resultCallBack){
    //if isIgnored is 0, then its not ignored else if its 1 its ignored
    let getAssignmentsQuery = 'SELECT customAssignmentName, customAssignmentDescription, customeDueDate FROM PostAssociation WHERE emailAddress = ? AND isIgnored = 0;';
    dbPool.query(getAssignmentsQuery, userEmail, function(err, res){
        if(err) {
            resultCallback(err, null);
        }
        // worked properly
        else if(res.length === 1) {
            console.log('Found Assignments for user: ' + userEmail + "Assingments Names:  " + res[0].customAssignmentDescription);
            var userAssignments = {
                emailAddress: userEmail,
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
