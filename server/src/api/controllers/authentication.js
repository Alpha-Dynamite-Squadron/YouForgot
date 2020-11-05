let passport = require('passport');
let users = require('../models/users');
let crypto = require('crypto');

module.exports.findNewUser = function(req, res)   {
  console.log("Find User by AccessKey Request Receieved");
  if(!req.body.accessKey) {
    res.status(400).json({
      "message" : "accessKey required"
    });
  }
  else {
    users.findNewUser(req.body.accessKey, function(err, data) {
      if(err) {
        console.log("Error Finding User By AccessKey: " + req.body.accessKey);
        console.log(err);
        res.status(500).json({
          "message" : "Unknown Database Error"
        });
      }
      else if(data == null) {
        console.log("Invalid Registration AccessKey: " + req.body.accessKey);
        res.status(403).json({
          message : "AccessKey Invalid"
        });
      }
      else {//User Found
        res.status(200).json(data);
      }
    });
  }
}
module.exports.register = function(req, res) {
    console.log("AccessKey Registration Request Receieved");
    if(!req.body.accessKey) {
      res.status(400).json({
        "message" : "accessKey required"
      });
    }
    else if(!req.body.password) {
      res.status(400).json({
        "message" : "password required"
      });
    }
    else if(!req.body.imageID) {
        res.status(400).json({
          "message" : "imageID required"
        });
    }
    else if(!req.body.emailAddress) {
        res.status(400).json({
          "message" : "emailAddress required"
        });
    }
    else if(!req.body.userName) {
        res.status(400).json({
          "message" : "userName required"
        });
    }
    else {
      //Verify Password usable
        users.registerUser(req.body.accessKey, req.body.emailAddress, req.body.userName, req.body.imageID, req.body.password, function(err, code, data) {
            if(err) {
                console.log("Error Registering User: " + req.body.accessKey);
                console.log(err);
                res.status(500).json({
                "message" : "Unknown Database Error"
                });
            }
            else if(code == 0){
                console.log("Successfully Registered User: " + req.body.userName);
                let token = data.generateJwt();
                res.status(200).json({
                    "token" : token
                });
            }
            else if(code == 1){
                console.log("Error unauthorized access key for user: " + req.body.userName);
                res.status(401).json({
                    "message" : "Bad access key provided"
                });
            }
            else if(code == 2){
                console.log("Error email not found for user: " + req.body.userName);
                res.status(403).json({
                    "message" : "Bad email provided"
                });
            }
            else if(code == 3){
                console.log("Error the email was found the the query did not complete for user: " + req.body.userName);
                res.status(500).json({
                    "message" : "Unknown database error occurred"
                });
            }
            else {//User Found
                res.status(500).json({
                    "message" : "Unexpected code recieved from database"
                });;
            }
        });
    }
}

module.exports.login = function(req, res) {
  passport.authenticate('user-local', function(err, user, info) {
    var token;
    if(err) {//Passport Error
      res.status(500).json(err);
      return;
    }
    if(user) {//If User is found
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {//If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};

module.exports.hashContent = function(req, res) {
  var salt = crypto.randomBytes(20).toString('hex');
  var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 512, 'sha512').toString('hex');
  res.status(200).json({
    hash: hash,
    salt: salt
  });
};
