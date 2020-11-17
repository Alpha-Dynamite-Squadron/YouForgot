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

module.getUserDetails = function(userEmail, resultCallback){
    let getUserDetailsQuery = 'SELECT * FROM User WHERE emailAddress = ?;';
    dbPool.query(getUserDetailsQuery, [userEmail], function(err, res){
        if(err){
            resultCallback(err, null);
        }
        else if(res.length === 1){
            console.log("Found details for user: " + userEmail);
            let userDetails = {
                userEmail: userEmail,
                
            }

        }
        else {

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
        else if(res.length !== 0) {
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
// TESTED  ASK CHRISTIAN ON DUPES
module.exports.userEnroll = function(userEmail, sectionInstanceID, getRemindernotifications, resultCallback){

    let userEnrollQuery = 'INSERT INTO UserEnrollment (emailAddress, sectionInstanceID, getReminderNotifications) VALUES (?,?,?);';
    dbPool.query(userEnrollQuery, [userEmail, sectionInstanceID, getRemindernotifications], function(err,res){
        //db err
        if(err){
            if(err.code === "ER_DUP_ENTRY"){
                resultCallback(err, 1);
            }
            else {
                //console.log(err);
                resultCallback(err, null);
            }
        }
        else{
            let getAssignments = 'SELECT * FROM Post WHERE sectionInstance = ?;';
            dbPool.query(getAssignments, [sectionInstanceID], function(err2, res2){
                if(err2){
                    console.log(err2);
                    resultCallback(err2, 2);
                }
                //we should have information here
                else if(res2.length !== 0){
                    let createPostAssociationQuery = 'INSERT INTO PostAssociation (emailAddress, assignmentID, isIgnored, isReported, customUploadDate, customAssignmentName, customAssignmentDescription, customDueDate, sentNotification, iForgot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                    let innerError = false;
                    for(let i = 0; i < res2.length; i++){
                        if(innerError){
                            break;
                        }
                        dbPool.query(createPostAssociationQuery, [userEmail, res2[i].assignmentID,0,0,res2[i].uploadDate, res2[i].assignmentName, "default description", res2[i].assignmentDueDate, 0, 0], function(err3, res3){
                            if(err3){
                                if(err3.code === "ER_DUP_ENTRY"){
                                    innerError = err3;
                                    resultCallback(err3, 5);
                                }
                                else {
                                    innerError = err3;
                                    console.log("Error creating post associations for user:" + userEmail);
                                    resultCallback(err3, 4);
                                }
                            }
                            else{
                                resultCallback(null,null);
                            }
                        });
                    }
                }
                
                else{
                    console.log("There are no Posts associated with this sectionInstanceID");
                    resultCallback(err,3);
                }
            });
        }
        
    });

}

//tested
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
//tested
module.exports.updateAssignmentNotifications = function(userEmail, notificationStatus, resultCallback){
    let updateAssignmentNotificationsQuery = 'UPDATE User SET getPostReminderNotifications = ? WHERE emailAddress = ?;';
    dbPool.query(updateAssignmentNotificationsQuery, [notificationStatus, userEmail], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else{
            resultCallback(null, null);
        }
    });
}
//tested 
module.exports.updateAssignmentDeadlineNotifications = function(userEmail, notificationStatus, resultCallback){
    let updateAssignmentNotificationsQuery = 'UPDATE User SET getHomeworkReminderNotifications = ? WHERE emailAddress = ?;';
    dbPool.query(updateAssignmentNotificationsQuery, [notificationStatus, userEmail], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else{
            resultCallback(null, null);
        }
    });
}
//tested
module.exports.updateAssignmentGrade = function(userEmail, gradeRecieved, assignmentID, resultCallback){
    let updateAssignmentGradeQuery = 'UPDATE PostAssociation SET Grade = ? WHERE emailAddress = ? AND assignmentID = ? ;';
    dbPool.query(updateAssignmentGradeQuery, [gradeRecieved, userEmail, assignmentID], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else{
            resultCallback(null, null);
        }
    });
}

module.exports.updateIForgot = function(userEmail, assignmentID, resultCallback){
    let selectIForgotQuery = 'SELECT iForgot FROM PostAssociation WHERE emailAddress = ? AND assignmentID = ?;';
    let newIForgotStatus;
    dbPool.query(selectIForgotQuery, [userEmail, assignmentID], function(err, res){
        if(err){
            console.log("Error trying to select current iForgot status from user " + userEmail);
            console.log(err);
            resultCallback(err, 1);
        }
        else if (res.length === 1){
            if (res[0].iForgot == 1){
                newIForgotStatus = 0;
            }
            else{
                newIForgotStatus = 1;
            }
            console.log("New iForgot status is " + newIForgotStatus);
            let updateIsDoneQuery = 'UPDATE PostAssociation SET iForgot = ? WHERE emailAddress = ? AND assignmentID = ?';
            dbPool.query(updateIsDoneQuery, [newIForgotStatus, userEmail, assignmentID], function(errorTwo, result){
                if(errorTwo){
                    console.log("Error attempting to update iForgot for user " + userEmail);
                    resultCallback(errorTwo, 2);
                }
                else{
                    console.log("Updated iForgot for user " + userEmail);
                    resultCallback(null,null);
                }
            });
        }else{
            console.log("This should never happen. This is dead code");
        }
    });
}

// 1 is an error on the general select query
// 2 is that the user isDone status was not able to be updated.
//tested
module.exports.updateIsDone = function(userEmail, assignmentID, resultCallback){
    let selectIsDoneQuery = 'SELECT isDone FROM PostAssociation WHERE emailAddress = ? AND assignmentID = ?;';
    let newIsDoneStatus;
    dbPool.query(selectIsDoneQuery, [userEmail, assignmentID], function(err, res){
        if(err){
            console.log("Error trying to select current isDoneStatus from user " + userEmail);
            console.log(err);
            resultCallback(err, 1);
        }
        else if (res.length === 1){
            if (res[0].isDone == 1){
                newIsDoneStatus = 0;
            }
            else{
                newIsDoneStatus = 1;
            }
            console.log("New isDone status is " + newIsDoneStatus);
            let updateIsDoneQuery = 'UPDATE PostAssociation SET isDone = ? WHERE emailAddress = ? AND assignmentID = ?';
            dbPool.query(updateIsDoneQuery, [newIsDoneStatus, userEmail, assignmentID], function(errorTwo, result){
                if(errorTwo){
                    console.log("Error attempting to update isDone for user " + userEmail);
                    resultCallback(errorTwo, 2);
                }
                else{
                    console.log("Updated isDone for user " + userEmail);
                    resultCallback(null,null);
                }
            });
        }else{
            console.log("This should never happen. This is dead code");
        }
    });
}

module.exports.unenroll = function(userEmail, sectionInstanceID, resultCallback){
    let deleteUserFromCourseQuery = 'DELETE FROM UserEnrollment WHERE emailAddress = ? AND sectionInstanceID = ?;';
    dbPool.query(deleteUserFromCourseQuery, [userEmail, sectionInstanceID], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err,null);
        }
        //else its deleted 
        else{
            resultCallback(null,null);
        }
    });
}

//tested
module.exports.deleteAccount = function(userEmail, resultCallback){
    let deleteAccountQuery = 'DELETE FROM User WHERE emailAddress = ?;';
    dbPool.query(deleteAccountQuery, userEmail, function(err, res){
        if(err){
            console.log("SQL ERROR HERE!")
            console.log(err);
            resultCallback(err,null);
        }
        //else its deleted 
        else{
            resultCallback(null,null);
        }
    });
}


