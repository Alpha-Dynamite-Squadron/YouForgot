let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let dbPool = require('../models/database');
let nodeMailerTransport = require('../config/nodeMailerTransport.js')

//kwqmeposdms1dsnfd812j312nj38sdvh
let secretString = process.env.LOGIN_SECRET;
if(secretString == undefined) {
  console.log("Assessment Login Undefined in enviroment `LOGIN_SECRET`");
  process.exit(1);
}

let funcSetPassword = function(password) {
    this.salt = crypto.randomBytes(20).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
  };
function validateEmail(mail) {
    return(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail));

}

let funcCheckPassword = function(password) {
let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

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

/* This is the database call to pull data for the user.
*/
module.exports.findAccountByEmail = function(email, resultCallback) {
    var queryString = 'SELECT emailAddress, username, imageID, hash, salt, profileRating, getPostReminderNotifications, getHomeworkReminderNotifications FROM User WHERE accessKey IS NULL AND emailAddress = ?';
    dbPool.query(queryString, email, function (err, result) {
        if(err) {
            resultCallback(err, null);
        }
        else if(result.length === 1) {
            console.log('Found User: ' + result[0].username);
            var user = {
                emailAddress: result[0].emailAddress,
                username: result[0].username,
                imageID: result[0].imageID,
                hash: result[0].hash,
                salt: result[0].salt,
                profileRating: result[0].profileRating,
                getPostReminderNotifications: result[0].getPostReminderNotifications,
                getHomeworkReminderNotifications: result[0].getHomeworkReminderNotifications,
                setPassword: funcSetPassword,
                validPassword: funcCheckPassword,
                generateJwt: funcGenerateJwt
            }
            console.log(user);
            resultCallback(null, user);
        }
        else {
            console.log("No User found for email: " + email);
            resultCallback(null, null);
        }
    });
};
// Check that the user exists in the DB once the user has clicked on the link with the access key so that registration can continue.
module.exports.findNewUser = function(accessKey, resultCallback) {
    var findInactiveUserQuery = 'SELECT accessKey, emailAddress, FROM User WHERE accessKey = ? LIMIT 1';
    dbPool.query(findInactiveUserQuery, accessKey, function(err, result) {
        if(err) {
        resultCallback(err, null);
        }
        else if(result.length === 1) {
            console.log('Found Inactive User:' + result[0].emailAddress);
            resultCallback(null, result[0].emailAddress);
        }
        else {
            console.log("Invalid access key provided for user " +  accessKey);
            resultCallback(null, null);
        }
    });
}
   /*
    * status code 0 the user was registered succefully. You should expect the user object at parameter 3 in the callback
    * error code 1 is an unauthorized accesskey
    * error code 2 no email address is found
    * error code 3 is that the query failed because the email dissapeared
    */
module.exports.registerUser = function(accessKey, emailAddress, username, imageID, password, resultCallback) {
    let findInactiveUserQuery = 'SELECT emailAddress, accessKey FROM Personnel WHERE emailAddress = ? LIMIT 1';
    dbPool.query(findInactiveUserQuery, emailAddress, function(err, result) {
        if(err) {
        resultCallback(err, null);
        }
        else if(result.length === 1) {
            if(result[0].accessKey === accessKey){
                console.log('Registering Inactive User:' + result[0].emailAddress);
                let saltSteak = setPassword(password);
                let hash = saltSteak.hash;
                let salt = saltSteak.salt;
                let createUserQuery = 'UPDATE User SET username = ?, imageID = ?, hash = ?, salt = ?, accessKey = NULL WHERE emailAddress = ? '
                dbPool.query(createUserQuery, [username, imageID, hash, salt, emailAddress], function(err, result){
                    if(err){
                        resultCallback(err, null);
                    }
                    else if(result.affectedRows == 0){
                        console.log("The email was found but the query did not complete");
                        resultCallback(null, 3);
                    }
                    else{
                        console.log("New user registered.");
                        let user = {
                            emailAddress: emailAddress,
                            username: username,
                            imageID: imageID,
                            getPostReminderNotifications: true,
                            getHomeworkReminderNotifications: true,
                            generateJwt: funcGenerateJwt
                        }
                        resultCallback(null, 0, user);
                    }
                });
            }
            else{
                console.log("Unauthorized Access key!");
                resultCallback(null, 1);
            }
        }
        else { // no email address found
            resultCallback(null, 2);
        }
    });
}
// 0 is that the user was successfully inserted
// 1 the email is not a vaild edu email
// 2 the email failed to send
module.exports.preRegistration = function(email, resultCallback){
    let validEmail = validateEmail(email);
    let validEdu = false;
    if(validEmail){
        let edu = email.substring(email.length - 4);
        if(edu === '.edu'){
            validEdu = true;
        }
    } 
    if(validEdu){
        let accessKey = crypto.randomBytes(20).toString('hex');
        const url = 'http://localhost:8080/' + accessKey;
        let setAccessKeyQuery = 'INSERT INTO User (emailAddress, accessKey) VALUES (?, ?);';
        dbPool.query(setAccessKeyQuery, [email, accessKey], function(err, result) {
            if(err) {
                resultCallback(err, null);
                // need to account for duplicate emails
            }
            else{
                let info = transporter.sendMail({
                    from: '"YouForgot Admin" <admin@youforgot.school>', // sender address
                    to: email, // list of receivers
                    subject: "Register Your Account on YouForgot.school", // Subject line
                    html: `Please click this email to confirm  your email address on YouForgot.school: <a href="${url}">Finish Registration</a>`, // html body
                  }, function(error, result){
                      if(error){
                           console.log("Failed to send email to " + email);
                           resultCallback(error, 2); //failed to send email
                      }else{
                          console.log("Successfully sent the email to " + email);
                          resultCallback(null, 0);
                      }
                  });
                
            }
        });
    }else{
        resultCallback(null, 1); // not a valid edu email address
    }
}