let endpoints = require('../models/endpoints');
/*
Json Web token from users for reference for what information we have to use.
let funcGenerateJwt = function() {
    let expiry = new Date(); //the current date
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
      emailAddress: this.emailAddress,
      username: this.username,
      imageID: this.imageID,
      getPostReminderNotifications: this.getPostReminderNotifications,
      getHomeworkReminderNotifications: this.getHomeworkReminderNotifications,
      exp: parseInt(expiry.getTime() / 1000)
    }, secretString);
};
*/
module.exports.getUserCourses = function(req, res){
    console.log("Fetching the user's courses.");
    if(!req.body.token){
        res.status(401).json({
            "message" : "no user token provided"
        });
    }
    else{
        endpoints.getUserCourses(req.body.token, function(err,code){

        });
    }
}

module.exports.getUserAssignments = function(req, res){
    console.log("Fetching the user's assignments.");
    if(!req.body.token){
        res.status(401).json({
            "message" : "no user token provided"
        });
    }
    else{
        endpoints.getUserCourses(req.body.token, function(err,code){

        });
    }
}