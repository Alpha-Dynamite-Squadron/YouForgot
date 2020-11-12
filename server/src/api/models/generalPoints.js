let dbPool = require('../models/database');

module.exports.getInstutionCoures = function(institutionID, resultCallback){
    let getCoursesQuery = 'SELECT * SectionInstance WHERE sectionInstanceID = ?;';
    dbPool.query(getCoursesQuery, institutionID, function(err, res){
        if(err){
            console.log(err);
            resultCallback(err, null);
        }
        else if (res.length === 1){
            console.log("Courses found");
            let courses = [];
            let data = [];
            for(let i = 0; i < res.length; i++){
                let userCourse = {
                    sectionInstanceID: res[i].sectionInstanceID,
                    nameOfClass: res[i].nameOfClass,
                    instructorName: res[i].instructorName,
                    disciplineLetters: res[i].disciplineLetters,
                    courseNumber: res[i].courseNumber,
                    courseEnrollment: res[i].enrollmentCount,
                    academicSession: res[i].academicSession,
                    year: res[i].year
                }
                data.push(userCourse);
            }
            resultCallback(null, courses);
        }
        else{
            console.log("No courses found");
            resultCallback(null,null);
        }
    });


}

module.exports.createAssignment = function(req, res){

}

module.exports.createCourse = function(req,res){

}
