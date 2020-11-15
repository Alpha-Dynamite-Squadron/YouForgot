let dbPool = require('./database');

/*
let createUserQuery = 'UPDATE User SET username = ?, imageID = ?, hash = ?, salt = ?, accessKey = NULL WHERE userEmail = ?;';
                dbPool.query(createUserQuery, [username, imageID, hash, salt, userEmail], function(err, result){
                    if(err){

*/
//will we need to join here for userenrollment and sectioninstance ID, what will nick need
module.exports.getUserCourses = function(userEmail, resultCallback) {
    let getUserCourserQuery = 'SELECT * FROM UserEnrollment INNER JOIN SectionInstance ON UserEnrollment.sectionInstanceID = SectionInstance.sectionInstanceID WHERE UserEnrollment.emailAddress = ?;';
    dbPool.query(getUserCourserQuery, userEmail, function(err, res){
        //db error
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if(res.length === 1){
            console.log("Found Courses for user" + userEmail + ". Course names");
            let userCourses = [];
            for(let i = 0; i < res.length; i++){
                let userCourse = {
                    userEmail: userEmail,
                    nameOfClass: res[i].nameOfClass,
                    instructorName: res[i].instructorName,
                    disciplineLetters: res[i].disciplineLetters,
                    courseNumber: res[i].courseNumber,
                    sectionInstanceID: res[i].sectionInstanceID,
                    academicSession: res[i].academicSession,
                    year: res[i].year
    
                }
                userCourses.push(userCourse);
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
            console.log(err);
            resultCallback(err, null);
        }
        // worked properly
        else if(res.length === 1) {
            console.log("Found Assignments for user: " + userEmail + "Assingments Names:  " + res[0].customAssignmentDescription);
            let userAssignments = [];

            for(let i = 0; i < res.length; i++){
                let userAssignment = {
                userEmail: userEmail,
                assignmentDescriptions: res[i].customAssignmentDescription,
                assignmentNames: res[0].customAssignmentName,
                dueDates: res[i].customDueDate
                }
                userAssignments.push(userAssignment);
            }
            resultCallback(null, userAssignments);
        }
        else {
            console.log("No Assignments Found for:  " + userEmail);
            resultCallback(null, null);
        }
    });

}




//user enroll we want defaultGetRemindernotifications, updateDefaultGetRemindernotifications end point is cherry on top

module.exports.userEnroll = function(userEmail, sectionInstanceID, defaultGetRemindernotifications, resultCallback){
    let userEnrollQuery = 'INSERT INTO UserEnrollment (emailAddress, sectionInstanceID) VALUES (?,?,?);';
    dbPool.query(userEnrollQuery, [userEmail, sectionInstanceID, defaultGetRemindernotifications], function(err,res){
        //db err
        if(err){
            if(err.code === "ER_DUP_ENTRY"){
                resultCallback(err, 1);
            }
            else {
                console.log(err);
                resultCallback(err, null);
            }
        }
        else{
            //no errors
            resultCallback(null,null);
        }
    });
}

/*
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;

UPDATE Customers
SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
WHERE CustomerID = 1;

*/
//NEED TO DO
module.exports.updateExcessiveNotifications = function(userEmail, notificationStatus, resultCallback){
    let updateExcessiveNotificationsQuery = 'UPDATE User SET sendExcessively = ? WHERE emailAddress = ?;';
    dbPool.query(updateExcessiveNotificationsQuery, [notificationStatus, userEmail], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else{
            resultCallback(null, null);
        }
    });
}
