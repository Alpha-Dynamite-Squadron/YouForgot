let passport = require('passport');
let users = require('../models/users');
let crypto = require('crypto');

module.exports.preRegistration = function(req, res)   {
  console.log("Attempting to Preregister user");
  if(!req.body.email) {
    res.status(400).json({
      "message" : "email required"
    });
  }
  else {
    users.preRegistration(req.body.email, function(err, code) {
      if(err) {
        if(code == null){
          console.log("Error Trying to insert user with email " + req.body.email);
          console.log(err);
          res.status(500).json({
            "message" : "Unknown Database Error"
          });
        }else{
          console.log("Error Trying to send and email to the user" + req.body.email);
          console.log(err);
          res.status(500).json({
            "message" : "Unknown Email Error"
          })
        }
      }
      else if(code == 1) { //the email is not valid
        console.log("This email address is not a vaild edu address");
        res.status(406).json({
          "message" : "Non-edu address provided."
        });
      }else if(code == 2) {// the email failed to send
        res.status(500).json({
          "message" : "The email failed to send."
        });
      }else if (code == 3){
        console.log("Attempted to register email already registered");
        res.status(406).json({
          "message" : "Email already registered"
        });
      }else{ // code 0 the user was successfully added
        res.status(200).end();
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
    else if(!req.body.username) {
        res.status(400).json({
          "message" : "username required"
        });
    }
    else {
      //Verify Password usable
        users.registerUser(req.body.accessKey, req.body.emailAddress, req.body.username, req.body.imageID, req.body.password, function(err, code, data) {
            if(err) {
                console.log("Error Registering User: " + req.body.accessKey);
                console.log(err);
                res.status(500).json({
                "message" : "Unknown Database Error"
                });
            }
            else if(code == 0){
                console.log("Successfully Registered User: " + req.body.username);
                let token = data.generateJwt();
                res.status(200).json({
                    "token" : token
                });
            }
            else if(code == 1){
                console.log("Error unauthorized access key for user: " + req.body.username);
                res.status(401).json({
                    "message" : "Bad access key provided"
                });
            }
            else if(code == 2){
                console.log("Error email not found for user: " + req.body.username);
                res.status(403).json({
                    "message" : "Bad email provided"
                });
            }
            else if(code == 3){
                console.log("Error the email was found the the query did not complete for user: " + req.body.username);
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

module.exports.login = function(req, res, next) {
  let authenticationFunction = passport.authenticate('user-local', function(err, user, info) {
    var token;
    if(err) {//Passport Error
      console.error("Failed to Authenticate User", err);
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
  });
  authenticationFunction(req, res, next);
};

module.exports.verifyAccessKey = function(req, res)   {
  console.log("Attempting to verify Access Key");
  if(!req.body.accessKey) {
    res.status(400).json({
      "message" : "email required"
    });
  }
  else {
    users.verifyAccessKey(req.body.accessKey, function(err, data) {
      if(err) {
        console.log("Error Trying to verify Access Key: " + req.body.accessKey);
        console.log(err);
        res.status(500).json({
          "message" : "Unknown Database Error"
        });
      }
      else if(data) { //AccessKey Found
        if(data.hash == undefined) {
          res.status(200).json(data.emailAddress);
        }
        else {
          console.log("AccessKey Requested was for PasswordChange, not FinishingRegistration");
          res.status(406).json({
            "message" : "Access Key not found."
          });
        }
      }else{ //User was not found
        console.log("This accessKey was not Found");
        res.status(406).json({
          "message" : "Access Key not found."
        });
      }
    });
  }
}

module.exports.hashContent = function(req, res) {
  var salt = crypto.randomBytes(20).toString('hex');
  var hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 512, 'sha512').toString('hex');
  res.status(200).json({
    hash: hash,
    salt: salt
  });
};
