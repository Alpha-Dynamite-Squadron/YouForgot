let dbPool = require('./database');

/*
let createUserQuery = 'UPDATE User SET username = ?, imageID = ?, hash = ?, salt = ?, accessKey = NULL WHERE userEmail = ?;';
                dbPool.query(createUserQuery, [username, imageID, hash, salt, userEmail], function(err, result){
                    if(err){

*/
//will we need to join here for userenrollment and sectioninstance ID, what will nick need
//tested
module.exports.getUserCourses = function(userEmail, resultCallback) {
    let getUserCourserQuery = 'SELECT * FROM UserEnrollment INNER JOIN SectionInstance ON UserEnrollment.sectionInstanceID = SectionInstance.sectionInstanceID WHERE UserEnrollment.emailAddress = ?;';
    dbPool.query(getUserCourserQuery, userEmail, function(err, res){
        //db error
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if(res.length !== 0){
            console.log("Found Courses for user" + userEmail + ". Course names");
            let userCourses = [];
            for(let i = 0; i < res.length; i++){
                let userCourse = {
                    userEmail: userEmail,
                    nameOfClass: res[i].nameOfClass,
                    imageID: res[i].imageID,
                    instructorName: res[i].instructorName,
                    disciplineLetters: res[i].disciplineLetters,
                    courseNumber: res[i].courseNumber,
                    sectionNumber: res[i].sectionNumber,
                    sectionInstanceID: res[i].sectionInstanceID,
                    academicTerm: res[i].academicTerm,
                    academicYear: res[i].academicYear
                }
                userCourses.push(userCourse);
            }
            resultCallback(null, userCourses);
        }
        else{
            console.log("This user does not have any courses: " + userEmail);
            resultCallback(null,null);
        }
    });
    
}

//tested
module.exports.getUserInfo = function(userEmail, resultCallback){
    let getUserInfoQuery = 'SELECT User.username, User.profileRating, User.imageID, User.getPostReminderNotifications, User.getHomeworkReminderNotifications, User.sendExcessively, Institution.schoolName FROM User INNER JOIN Institution ON User.institutionID = Institution.institutionID WHERE User.emailAddress = ?;';
    dbPool.query(getUserInfoQuery, [userEmail], function(err, res){
        if(err){
            resultCallback(err, null);
        }
        else if(res.length === 1){
            console.log("Found details for user: " + userEmail);
            let userDetails = {
                userEmail: userEmail,
                username: res[0].username,
                imageID: res[0].imageID,
                postNotifications: res[0].getPostReminderNotifications,
                deadlineNotifications: res[0].getHomeworkReminderNotifications,
                sendExcessively: res[0].sendExcessively,
                schoolName: res[0].schoolName,
                profileRating: res[0].profileRating,
            }
            resultCallback(null, userDetails);
        }
        else {
            console.log("No user found.");
            resultCallback(null,null);
        }
    });
}

//select request on postAssociation table
//tested
module.exports.getUserAssignments = function(userEmail, resultCallback){
    //if isIgnored is 0, then its not ignored else if its 1 its ignored
    let getAssignmentsQuery = 'SELECT * FROM PostAssociation INNER JOIN Post ON Post.assignmentID = PostAssociation.assignmentID WHERE emailAddress = ? AND isIgnored = 0;';
    dbPool.query(getAssignmentsQuery, userEmail, function(err, res){
        if(err) {
            console.log(err);
            resultCallback(err, null);
        }
        // worked properly
        else {
            console.log("Found " + res.length + "Assignments for user: " + userEmail);
            let userAssignments = [];

            for(let i = 0; i < res.length; i++){
                let userAssignment = {
                assignmentDescription: res[i].customAssignmentDescription,
                assignmentName: res[i].customAssignmentName,
                uploadDate: res[i].customUploadDate,
                dueDate: res[i].customDueDate,
                isDone: res[i].isDone,
                grade: res[i].Grade,
                forGrade: res[i].forGrade,
                assignmentID: res[i].assignmentID,
                isIgnored: res[i].isIgnored
                }
                userAssignments.push(userAssignment);
            }
            resultCallback(null, userAssignments);
        }
    });

}




//user enroll we want defaultGetRemindernotifications, updateDefaultGetRemindernotifications end point is cherry on top
//tested
module.exports.userEnroll = function(userEmail, sectionInstanceID, getRemindernotifications, resultCallback){
    let userEnrollQuery = 'INSERT INTO UserEnrollment (emailAddress, sectionInstanceID, getReminderNotifications) VALUES (?,?,?);';
    dbPool.query(userEnrollQuery, [userEmail, sectionInstanceID, getRemindernotifications], function(err1,res){
        //db err
        if(err1){
            if(err1.code === "ER_DUP_ENTRY") {
                resultCallback(err1, 1);
            }
            else {
                //console.log(err);
                resultCallback(err1, null);
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
                        let counter = 0;
                        dbPool.query(createPostAssociationQuery, [userEmail, res2[i].assignmentID,0,0,res2[i].uploadDate, res2[i].assignmentName, "default description", res2[i].assignmentDueDate, 0, 0], function(err3, res3){
                            if(err3){
                                    console.log("Error creating post associations for user:" + userEmail);
                                    resultCallback(err3, 3);
                            }
                            else{
                                counter++;
                                if(counter === res2.length) {
                                    resultCallback(null, 0);
                                }
                            }
                        });
                    }
                }
                else{
                    console.log("There are no Posts associated with this sectionInstanceID");
                    resultCallback(null, 0);
                }
            });
        }
        
    });

}

//tested
module.exports.updateProfile = function(userEmail, username, imageID, postNotifications, deadlineNotifications, sendExcessively, resultCallback){
    let updateProfileQuery = 'UPDATE User SET username = ?, imageID = ?, getPostReminderNotifications = ?, getHomeworkReminderNotifications = ?, sendExcessively = ? WHERE emailAddress = ? LIMIT 1;';
    dbPool.query(updateProfileQuery, [username, imageID, postNotifications, deadlineNotifications, sendExcessively, userEmail], function(err, res){
        if(err){
            if(err.code == 'ER_DUP_ENTRY') {
                resultCallback(null, 2);
            } else {
                resultCallback(err, null);
            }
        }
        else if(res.affectedRows === 1) {
            resultCallback(null, 0);
        }
        else{//Email not Found
            resultCallback(null, 1);
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

//tested
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

module.exports.updateIsIgnored = function(userEmail, assignmentID, resultCallback){
    let selectIsIgnoredQuery = 'SELECT isIgnored FROM PostAssociation WHERE emailAddress = ? AND assignmentID = ?;';
    let newIsIgnoredStatus;
    dbPool.query(selectIsIgnoredQuery, [userEmail, assignmentID], function(err, res){
        if(err){
            console.log("Error trying to select current isIgnored status from user " + userEmail);
            console.log(err);
            resultCallback(err, 1);
        }
        else if (res.length === 1){
            if (res[0].isIgnored == 1){
                newIsIgnoredStatus = 0;
            }
            else{
                newIsIgnoredStatus = 1;
            }
            console.log("New isIgnored status is " + newIsIgnoredStatus);
            let updateIsIgnoredQuery = 'UPDATE PostAssociation SET isIgnored = ? WHERE emailAddress = ? AND assignmentID = ?';
            dbPool.query(updateIsIgnoredQuery, [newIsIgnoredStatus, userEmail, assignmentID], function(errorTwo, result){
                if(errorTwo){
                    console.log("Error attempting to update isIgnored for user " + userEmail);
                    resultCallback(errorTwo, 2);
                }
                else{
                    console.log("Updated isIgnored for user " + userEmail);
                    resultCallback(null,null);
                }
            });
        }else{
            console.log("This should never happen. This is dead code");
        }
    });
}

//tested
module.exports.unenroll = function(userEmail, sectionInstanceID, resultCallback){
    let deleteUserFromCourseQuery = 'DELETE FROM UserEnrollment WHERE emailAddress = ? AND sectionInstanceID = ?;';
    dbPool.query(deleteUserFromCourseQuery, [userEmail, sectionInstanceID], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err,null);
        }
        else{
            let getAssignmentIDs = 'SELECT assignmentID FROM Post WHERE sectionInstance = ?;';
            dbPool.query(getAssignmentIDs, [sectionInstanceID], function(err2, res2){
                if(err2){
                    console.log(err2);
                    resultCallback(err2, 2);
                }
                else if(res2.length !== 0){
                    let deletePostAssociations = 'DELETE FROM PostAssociation WHERE assignmentID = ? AND emailAddress = ?;';
                    let counter = 0;
                    for(let i = 0; i < res2.length; i++){
                        dbPool.query(deletePostAssociations, [res2[i].assignmentID, userEmail], function(err3,res3){
                            if(err3){
                                console.log(err3);
                                resultCallback(err3,3);
                            }
                            else{
                                counter++;
                                if(counter == res2.length) {
                                    resultCallback(null, 0);
                                }
                            }
                        });
                    }
                }
                // nothing from select query
                else{
                    resultCallback(null, 0);
                }
            });
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
        else{
            resultCallback(null,null);
        }
    });
}


