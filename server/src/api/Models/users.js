let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let dbPool = require('../models/database');

let secretString = process.env.LOGIN_SECRET;
if(secretString == undefined) {
  console.log("Assessment Login Undefined in enviroment `LOGIN_SECRET`");
  process.exit(1);
}

let funcSetPassword = function(password) {
    this.salt = crypto.randomBytes(20).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
  };

let funcCheckPassword = function(password) {
let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

let funcGenerateJwt = function() {
    let expiry = new Date(); //the current date
    expiry.setDate(expiry.getDate() + 1);
    return jwt.sign({
      emailAddress: this.emailAddress,
      userName: this.userName,
      imageID: this.imageID,
      getPostReminderNotifications: this.getPostReminderNotifications,
      getHomeworkReminderNotifications: this.getHomeworkReminderNotifications,
      exp: parseInt(expiry.getTime() / 1000)
    }, secretString);
};

/* This is the database call to pull data for the user. 
*/
export const findAccountByEmail = function(email, resultCallback) {
    var queryString = 'SELECT User.emailAddress, username, imageID, hash, salt, profileRating, getPostReminderNotifications, getHomeworkReminderNotifications, FROM User WHERE accessKey IS NULL AND emailAddress = ?';
    dbPool.query(queryString, email, function (err, result) {
        if(err) {
            resultCallback(err, null);
        }
        else if(result.length === 1) {
            console.log('Found User: ' + result[0].userName);
            var user = {
                emailAddress: result[0].emailAddress,
                userName: result[0].userName,
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
            resultCallback(null, user);
        } 
        else {
            console.log("No User found for email: " + email);
            resultCallback(null, null);
        }
    });
};
// Check that the user exists in the DB once the user has clicked on the link with the access key so that registration can continue.
export const findNewUser = function(accessKey, resultCallback) {
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
export const registerUser = function(accessKey, emailAddress, userName, imageID, password, resultCallback) {
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
                dbPool.query(createUserQuery, [userName, imageID, salt, hash, emailAddress], function(err, result){
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
                            userName: userName,
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
  