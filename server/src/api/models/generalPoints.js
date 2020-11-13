let dbPool = require('../models/database');

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
// how to creat sectionInstance ID?
//title, disciplineLetters, number, 
module.exports.createCourse = function(req,res){

}

module.exports.createAssignment = function(req, res){

}


