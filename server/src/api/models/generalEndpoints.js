let dbPool = require('./database');
let nodeMailerTransporter = require('../config/nodeMailerTransport.js')


module.exports.getInstitutionCourses = function(institutionID, resultCallback){
    let getCoursesQuery = 'SELECT * FROM SectionInstance WHERE institutionID = ?;';
    dbPool.query(getCoursesQuery, [institutionID], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else {
            console.log("Found " + res.length + " Courses for Institution: " + institutionID);
            let courses = [];
            for(let i = 0; i < res.length; i++){
                let institutionCourse = {
                    sectionInstanceID: res[i].sectionInstanceID,
                    nameOfClass: res[i].nameOfClass,
                    imageID: res[i].imageID,
                    instructorName: res[i].instructorName,
                    disciplineLetters: res[i].disciplineLetters,
                    courseNumber: res[i].courseNumber,
                    courseEnrollment: res[i].enrollmentCount,
                    sectionNumber: res[i].sectionNumber,
                    academicTerm: res[i].academicTerm,
                    academicYear: res[i].academicYear
                }
                courses.push(institutionCourse);
            }
            console.log(courses);
            resultCallback(null, courses);
        }
    });
}
module.exports.getInstitutions = function(institution, resultCallback){
    let getInstitutionsQuery = 'SELECT * FROM Institution WHERE schoolName LIKE ?;';
    dbPool.query(getInstitutionsQuery, "%" + institution + "%", function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if (res.length !== 0){
            let institutions = [];
            for(let i = 0; i < res.length; i++){
                let institution = {
                    id: res[i].institutionID,
                    name: res[i].schoolName
                }
                institutions.push(institution);
            }
            console.log("Found " + institutions.length + " Institutions");
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
//tested
module.exports.getCourseAssignments = function(sectionInstanceID, emailAddress, resultCallback){
    let getCourseInfoQuery = 'SELECT SectionInstance.nameOfClass, Post.assignmentID, Post.uploadDate, Post.assignmentName, Post.assignmentDueDate, Post.forGrade, Post.assignmentAverage, Post.iForgotCount, PostAssociation.isDone, PostAssociation.iForgot, PostAssociation.isIgnored, PostAssociation.isReported, PostAssociation.Grade FROM Post INNER JOIN SectionInstance ON SectionInstance.sectionInstanceID = Post.sectionInstance AND SectionInstance.sectionInstanceID = ? INNER JOIN PostAssociation ON PostAssociation.assignmentID = Post.assignmentID AND PostAssociation.emailAddress = ?;';
    dbPool.query(getCourseInfoQuery, [sectionInstanceID, emailAddress], function(err, res){
        if(err){
            console.log(err);
            resultCallback(err,null);
        }
        //sql query ran
        else {
            console.log("Found " + res.length + " Assignments found for Course: " + sectionInstanceID);
            let courseAssignments = [];
            for(let i = 0; i < res.length; i++){
                let courseAssignment = {
                    nameOfClass : res[i].nameOfClass,
                    assignmentID: res[i].assignmentID,
                    uploadDate: res[i].uploadDate,
                    dueDate: res[i].assignmentDueDate,
                    assignmentName : res[i].assignmentName,
                    grade: res[i].Grade,
                    forGrade: res[i].forGrade,
                    isDone: res[i].isDone,
                    iForgot: res[i].iForgot,
                    isIgnored: res[i].isIgnored,
                    isReported: res[i].isReported,
                    iForgotCount: res[i].iForgotCount,
                    assignmentAverage: res[i].assignmentAverage,
                    sectionInstanceID: sectionInstanceID
                }
                courseAssignments.push(courseAssignment);
            }
            console.log(courseAssignments);
            resultCallback(null, courseAssignments);
        }
    });
}

module.exports.getCourseName = function(sectionInstanceID, resultCallback){
  let getCourseInfoQuery = 'SELECT nameOfClass FROM SectionInstance WHERE sectionInstanceID = ? LIMIT 1;';
  dbPool.query(getCourseInfoQuery, [sectionInstanceID], function(err, res){
      if(err){
          console.log(err);
          resultCallback(err,null);
      }
      else if (res.length === 1){
          resultCallback(null, res[0].nameOfClass);
      }
      else{
          console.log("Could not find sectionInstanceID");
          resultCallback(null,null);
      }
  });
}

// how to creat sectionInstance ID?
//title, disciplineLetters, number,
//Error 1 is a database error saying duplicate entry. This is a db error because this should never happen
// Error 2 is that association between a user and a course failed to create.
//tested
module.exports.createCourse = function(nameOfClass, imageID, instructorName,
    institutionID, disciplineLetters, courseNumber,
    academicTerm, academicYear, sectionNumber, userEmail, resultCallback){
    let creationDate = new Date();
    let createCourseQuery = 'INSERT INTO SectionInstance (creationDate, nameOfClass, imageID, instructorName, institutionID, disciplineLetters, courseNumber, sectionNumber, academicTerm, academicYear, sectionCreatorEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
    dbPool.query(createCourseQuery, [creationDate, nameOfClass, imageID, instructorName, institutionID, disciplineLetters, courseNumber, sectionNumber, academicTerm, academicYear, userEmail], function(err, result) {
        if(err) {
            resultCallback(err, null);
        }
        else{
            console.log("Course " + nameOfClass + " was added to SectionInstance. Now enrolling user "  + userEmail);
            let enrollUserQuery = 'INSERT INTO UserEnrollment (emailAddress, sectionInstanceID) VALUES (?, ?);';
            dbPool.query(enrollUserQuery, [userEmail, result.insertId], function(errorTwo, resTwo){ //here we use insertId as that is a field of res.
                if(errorTwo) {
                    console.log("Failed to enroll user into course.")
                    if(errorTwo.code === "ER_DUP_ENTRY") {
                        resultCallback(errTwo, 1);
                    }
                    else {
                        resultCallback(errorTwo, null);
                    }
                }
            });
            resultCallback(null, null);
        }
    });
}

//assignmentID is from UUID, userEmail from token, uploadDate/AssignmentDueDate is ???, forGrade is passed in, Average depends on forGrade, iforgot default is 0, sectionInstance passed in
// code 1 means there was a duplicate entry for an assignment.
// Code 2 There are no classmates in this course.
// Code 3 There is an error in the Select Query where we try to find classmates.
// Code 4 There is a duplicate in creating Post associations for the classmates.
// Code 5 There is an unknown DB error when creating Post Associations for the classmates.
// Code 6 There is an issue with the select query when trying to find the course name for the email notifications.
// Code 7 The nameOfClass select statement is empty, which should never happen.
module.exports.createAssignment = function(postAuthorEmail , assignmentName, dueDate, forGrade, sectionInstanceID, resultCallback){
    let assignmentDueDate = new Date(dueDate);
    let uploadDate = new Date();
    let createAssignmentQuery = 'INSERT INTO Post (postAuthorEmail, uploadDate, assignmentName, assignmentDueDate, forGrade, sectionInstance) VALUES (?, ?, ?, ?, ?, ?);';
    dbPool.query(createAssignmentQuery, [postAuthorEmail, uploadDate, assignmentName, assignmentDueDate, forGrade, sectionInstanceID], function(err, res){
        if(err) {
            resultCallback(err, null);
        }
        else{
            let getClassMatesQuery = 'SELECT emailAddress, getReminderNotifications FROM UserEnrollment WHERE sectionInstanceID = ?;';
            dbPool.query(getClassMatesQuery, [sectionInstanceID, postAuthorEmail], function(error3, result3){
                if(error3){
                    resultCallback(error3, 3);
                }
                else if(result3.length != 0){
                    let createPostAssociationsQuery = 'INSERT INTO PostAssociation (emailAddress, assignmentID, isIgnored, isReported, customUploadDate, customAssignmentName, customAssignmentDescription, customDueDate, sentNotification, iForgot) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
                    let counter = 0;
                    for(let i = 0; i < result3.length; i++){
                        dbPool.query(createPostAssociationsQuery, [result3[i].emailAddress, res.insertId,0,0,uploadDate,assignmentName,'default description',assignmentDueDate,0,0], function(error4, result4){
                            if(error4){
                                if(error4.code === "ER_DUP_ENTRY"){
                                    innerError = true;
                                    resultCallback(error4, 4);
                                }
                                else{
                                    innerError = true;
                                    resultCallback(error4, 5);
                                }
                            }
                            //Find email addresses where they have defaultNotificationsTurnedOn for the Class
                            //doing nodemailer where getReminderNotifications = 1, 1 is true
                            else{
                                counter++;
                                if(counter == result3.length) {
                                  let getClassInfo = 'SELECT nameOfClass from SectionInstance WHERE sectionInstanceID = ?;';
                                  dbPool.query(getClassInfo, [sectionInstanceID], function(error5, result5){
                                      if(error5){
                                          resultCallback(error5, 6);
                                      }
                                      else if(result5.length !== 0){
                                          let nameOfClass = result5[0].nameOfClass;
                                          for(let i =0; i < result3.length; i++){
                                              //only email people who have notifications on for this course
                                              if(result3[i].getReminderNotifications === 1){
                                                  bodyText = "Hello! \nThere is a new assignment posted in your class:  " + nameOfClass+ ". Please make sure to check it out on our website.\n" + "https://youforgot.school/assignment";
                                                  nodeMailerTransporter.sendMail({
                                                      from: '"Your friends at YouForgot" <admin@youforgot.school>', // sender address
                                                      to: result3[i].emailAddress, // list of receivers
                                                      subject: "You Forgot an Assignment!", // Subject line
                                                      text: bodyText, // plain text body
                                                  });
                                              }
                                          }
                                          resultCallback(null, null);
                                      }
                                      else{
                                          resultCallback(null, 7);
                                      }
                                  });
                              }
                            }
                        });
                    }
                }
                //no classmates in this class
                else{
                    console.log("There are no classmates in this class" + sectionInstanceID);
                    resultCallback(error3, 2);
                }
            });
        }
    });

}
